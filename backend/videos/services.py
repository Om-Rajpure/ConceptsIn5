import re
from googleapiclient.discovery import build
from django.conf import settings
import isodate

class YouTubeService:
    def __init__(self):
        self.api_key = getattr(settings, 'YOUTUBE_API_KEY', None)
        if self.api_key:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        else:
            self.youtube = None

    def extract_video_id(self, url):
        """
        Extracts the video ID from a YouTube URL.
        """
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

    def get_video_details(self, video_id):
        """
        Fetches video details using YouTube Data API.
        """
        if not self.youtube:
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

            # Parse duration from ISO 8601 to human readable (e.g., 5:02)
            duration_iso = content_details['duration']
            duration_delta = isodate.parse_duration(duration_iso)
            seconds = int(duration_delta.total_seconds())
            minutes, seconds = divmod(seconds, 60)
            duration_str = f"{minutes}:{seconds:02d}"

            return {
                'title': snippet['title'],
                'description': snippet['description'],
                'thumbnail': snippet['thumbnails']['high']['url'],
                'duration': duration_str,
                'youtube_id': video_id,
            }
        except Exception as e:
            print(f"Error fetching YouTube details: {e}")
            return None
