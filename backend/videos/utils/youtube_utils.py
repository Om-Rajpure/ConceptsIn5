import re

def extract_video_id(url):
    """
    Extracts the 11-character YouTube video ID from various URL formats.
    """
    if not url:
        return None
        
    patterns = [
        r'(?:v=|\/|vi\/|youtu\.be\/|embed\/)([0-9A-Za-z_-]{11})',
        r'watch\?v=([0-9A-Za-z_-]{11})',
        r'shorts\/([0-9A-Za-z_-]{11})'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None

def get_thumbnail(video_id):
    """
    Generates the standard high-resolution YouTube thumbnail URL.
    """
    if not video_id:
        return ""
    return f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"

def get_embed_url(video_id):
    """
    Generates the YouTube embed URL.
    """
    if not video_id:
        return ""
    return f"https://www.youtube.com/embed/{video_id}"
