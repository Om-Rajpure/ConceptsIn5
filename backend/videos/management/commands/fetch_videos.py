from django.core.management.base import BaseCommand
from videos.services import YouTubeService

class Command(BaseCommand):
    help = 'Fetches the latest videos from the configured YouTube channel'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Initializing YouTube ingestion pipeline...'))
        
        service = YouTubeService()
        if not service.api_key:
            self.stdout.write(self.style.ERROR('YOUTUBE_API_KEY is not configured in settings.'))
            return
        
        if not service.channel_id:
            self.stdout.write(self.style.ERROR('YOUTUBE_CHANNEL_ID is not configured in settings.'))
            return

        stats = service.run_youtube_pipeline()
        
        self.stdout.write(self.style.SUCCESS(f"Successfully processed {stats['total_fetched']} videos."))
        self.stdout.write(f" - New videos added: {stats['new_added']}")
        self.stdout.write(f" - Duplicates skipped: {stats['skipped']}")
        
        if stats['errors'] > 0:
            self.stdout.write(self.style.WARNING(f" - Errors encountered: {stats['errors']}"))
        
        self.stdout.write(self.style.SUCCESS('Pipeline execution completed.'))
