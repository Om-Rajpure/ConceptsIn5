from django.db import models

class Video(models.Model):
    video_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_url = models.URLField()
    thumbnail = models.URLField()
    duration = models.CharField(max_length=20)
    subject = models.CharField(max_length=50)
    category = models.CharField(max_length=50, default='semester')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
