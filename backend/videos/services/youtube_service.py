import os
from googleapiclient.discovery import build
from django.conf import settings

SUBJECT_KEYWORDS = {
    "dbms": ["dbms", "database", "sql"],
    "ml": ["machine learning", "neural", "ml"],
    "web": ["react", "javascript", "frontend", "web"],
    "os": ["operating system", "kernel", "os"],
    "networks": ["computer network", "tcp", "ip", "connection"]
}

class YouTubeService:
    def __init__(self):
        self.api_key = getattr(settings, 'YOUTUBE_API_KEY', None)
        self.channel_id = getattr(settings, 'CHANNEL_ID', None)
        
        if not self.api_key or self.api_key == "YOUR_API_KEY":
            raise ValueError("YouTube API Key not configured in settings.py")
            
        self.youtube = build('youtube', 'v3', developerKey=self.api_key)

    def fetch_channel_videos(self, max_results=20):
        """
        Fetch latest videos from a channel and process them.
        """
        # 1. Search for videos in the channel
        request = self.youtube.search().list(
            part="snippet",
            channelId=self.channel_id,
            maxResults=max_results,
            order="date",
            type="video"
        )
        response = request.execute()
        
        video_ids = [item['id']['videoId'] for item in response['items']]
        
        # 2. Get detailed info (duration)
        details_request = self.youtube.videos().list(
            part="contentDetails",
            id=','.join(video_ids)
        )
        details_response = details_request.execute()
        
        durations = {item['id']: item['contentDetails']['duration'] for item in details_response['items']}
        
        # 3. Process into clean data
        processed_videos = []
        for item in response['items']:
            snippet = item['snippet']
            v_id = item['id']['videoId']
            title = snippet['title']
            desc = snippet['description']
            
            # Map Subject
            subject = self._detect_subject(title, desc)
            
            # Parse duration (e.g., PT12M30S -> 12:30)
            duration_iso = durations.get(v_id, "PT0S")
            duration_clean = self._parse_duration(duration_iso)
            
            processed_videos.append({
                "video_id": v_id,
                "title": title,
                "description": desc,
                "youtube_url": f"https://www.youtube.com/watch?v={v_id}",
                "thumbnail": snippet['thumbnails']['high']['url'],
                "duration": duration_clean,
                "subject": subject,
                "category": "semester"
            })
            
        return processed_videos

    def _detect_subject(self, title, desc):
        text = (title + " " + desc).lower()
        for subject, keywords in SUBJECT_KEYWORDS.items():
            if any(k in text for k in keywords):
                return subject
        return "general"

    def _parse_duration(self, iso_duration):
        """
        ISO 8601 duration parser for PT#M#S or PT#H#M#S
        """
        import re
        hours = re.search(r'(\d+)H', iso_duration)
        mins = re.search(r'(\d+)M', iso_duration)
        secs = re.search(r'(\d+)S', iso_duration)
        
        h = int(hours.group(1)) if hours else 0
        m = int(mins.group(1)) if mins else 0
        s = int(secs.group(1)) if secs else 0
        
        if h > 0:
            return f"{h}:{m:02d}:{s:02d}"
        return f"{m}:{s:02d}"
