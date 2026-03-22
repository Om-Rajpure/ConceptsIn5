import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import Video
from videos.utils.description_processor import process_description

def migrate_data():
    videos = Video.objects.all()
    count = 0
    for video in videos:
        summary, roadmap = process_description(video.description)
        video.quick_summary = summary
        video.roadmap = roadmap
        video.save()
        count += 1
        print(f"Processed: {video.title}")
    
    print(f"\nFinished processing {count} videos.")

if __name__ == '__main__':
    migrate_data()
