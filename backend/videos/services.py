import re
from googleapiclient.discovery import build
from django.conf import settings
from django.utils import timezone
import isodate
from datetime import datetime, timezone as dt_timezone

class YouTubeService:
    def __init__(self):
        self.api_key = getattr(settings, 'YOUTUBE_API_KEY', None)
        self.channel_id = getattr(settings, 'YOUTUBE_CHANNEL_ID', None)
        if self.api_key:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        else:
            self.youtube = None

    def convert_duration(self, iso_duration):
        duration_delta = isodate.parse_duration(iso_duration)
        seconds = int(duration_delta.total_seconds())
        minutes, seconds = divmod(seconds, 60)
        return f"{minutes}:{seconds:02d}"

    def extract_video_id(self, url):
        if not url:
            return None
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'youtu\.be\/([0-9A-Za-z_-]{11})',
            r'embed\/([0-9A-Za-z_-]{11})',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None

    def fetch_video_metadata(self, youtube_url):
        video_id = self.extract_video_id(youtube_url)
        if not video_id or not self.youtube:
            return None

        try:
            request = self.youtube.videos().list(
                part="snippet,contentDetails",
                id=video_id
            )
            response = request.execute()

            if not response['items']:
                return None

            item = response['items'][0]
            snippet = item['snippet']
            content_details = item['contentDetails']

            duration = self.convert_duration(content_details['duration'])

            return {
                'title': snippet['title'],
                'description': snippet['description'],
                'thumbnail': snippet['thumbnails']['high']['url'],
                'duration': duration,
                'youtube_id': video_id
            }
        except Exception as e:
            print(f"Error fetching YouTube metadata: {e}")
            return None

    def fetch_latest_videos(self, max_results=10, published_after=None):
        if not self.youtube or not self.channel_id:
            return []

        params = {
            'part': 'snippet',
            'channelId': self.channel_id,
            'order': 'date',
            'maxResults': max_results,
            'type': 'video'
        }
        if published_after:
            # YouTube API expects RFC 3339 format (e.g., 1970-01-01T00:00:00Z)
            params['publishedAfter'] = published_after.strftime('%Y-%m-%dT%H:%M:%SZ')
            
        try:
            request = self.youtube.search().list(**params)
            response = request.execute()
            return response.get('items', [])
        except Exception as e:
            print(f"Error fetching channel videos: {e}")
            return []

    def fetch_video_durations(self, video_ids):
        """
        Bulk fetch durations to save quota.
        """
        if not self.youtube or not video_ids:
            return {}

        try:
            # Join IDs with comma
            ids_str = ",".join(video_ids)
            request = self.youtube.videos().list(
                part="contentDetails",
                id=ids_str
            )
            response = request.execute()
            
            durations = {}
            for item in response.get('items', []):
                vid = item['id']
                iso_duration = item['contentDetails']['duration']
                durations[vid] = self.convert_duration(iso_duration)
            return durations
        except Exception as e:
            print(f"Error fetching video durations: {e}")
            return {}

    def clean_description(self, description):
        text = re.sub(r'http\S+', '', description)
        text = re.sub(r'#\S+', '', text)
        return text.strip()

    def extract_important_topics(self, description):
        lines = description.split('\n')
        topics = []
        for line in lines:
            line = line.strip()
            if any(line.startswith(c) for c in ['•', '-', '*', '1.', '2.']):
                clean_line = re.sub(r'^[•\-*\d\.\s]+', '', line)
                if clean_line:
                    topics.append(clean_line)
        return ", ".join(topics[:8])

    def detect_subject(self, title, description):
        from .models import Subject
        text = f"{title} {description}".lower()
        
        mapping = {
            'DBMS': ["dbms", "database", "normalization", "sql", "nosql", "query"],
            'ML': ["machine learning", "regression", "neural network", "ai", "deep learning", "classifier"],
            'Web Development': ["react", "javascript", "html", "css", "nodejs", "frontend", "backend", "web"],
            'Python': ["python", "django", "flask", "pandas", "numpy"],
            'Operating Systems': ["operating system", "scheduling", "deadlock", "memory management", "process"],
            'Data Structures': ["data structure", "algorithm", "array", "linked list", "stack", "queue", "binary tree"],
        }
        
        for subject_name, keywords in mapping.items():
            for kw in keywords:
                if kw in text:
                    subject = Subject.objects.filter(name__icontains=subject_name).first()
                    if subject:
                        return subject
        return None

    def run_youtube_pipeline(self):
        from .models import Video, FetchLog
        
        # Step 1: Get last fetch time
        last_log = FetchLog.objects.filter(status='success').order_by('-last_fetched_at').first()
        published_after = last_log.last_fetched_at if last_log else None
        
        # Step 2: Fetch latest snippets
        items = self.fetch_latest_videos(max_results=10, published_after=published_after)
        if not items:
            return {'total_fetched': 0, 'new_added': 0, 'skipped': 0, 'errors': 0}

        # Step 3: Extract IDs for bulk duration fetch
        video_ids = [item['id']['videoId'] for item in items]
        durations = self.fetch_video_durations(video_ids)
        
        stats = {
            'total_fetched': len(items),
            'new_added': 0,
            'skipped': 0,
            'errors': 0
        }

        latest_publish_time = published_after

        for item in items:
            try:
                video_id = item['id']['videoId']
                snippet = item['snippet']
                publish_time_str = snippet['publishedAt']
                publish_time = datetime.strptime(publish_time_str, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=dt_timezone.utc)

                # Track latest published video
                if not latest_publish_time or publish_time > latest_publish_time:
                    latest_publish_time = publish_time

                # Step 5: Duplicate Handling
                if Video.objects.filter(youtube_id=video_id).exists():
                    stats['skipped'] += 1
                    continue
                
                # Step 2: Data Processing
                clean_desc = self.clean_description(snippet['description'])
                topics = self.extract_important_topics(snippet['description'])
                duration = durations.get(video_id, "")
                
                # Step 3: Subject Classification
                subject = self.detect_subject(snippet['title'], snippet['description'])
                
                # Step 5: Save to Database
                Video.objects.create(
                    title=snippet['title'],
                    description=clean_desc,
                    youtube_id=video_id,
                    thumbnail=snippet['thumbnails']['high']['url'],
                    duration=duration,
                    subject=subject,
                    important_topics=topics,
                    source='youtube',
                    is_verified=False,
                    is_published=False
                )
                stats['new_added'] += 1
                
            except Exception as e:
                print(f"Error processing video in pipeline: {e}")
                stats['errors'] += 1

        # Step 8: Update FetchLog
        if stats['new_added'] > 0 or stats['skipped'] > 0:
            FetchLog.objects.create(
                last_fetched_at=latest_publish_time,
                videos_added=stats['new_added'],
                status='success'
            )

        return stats
