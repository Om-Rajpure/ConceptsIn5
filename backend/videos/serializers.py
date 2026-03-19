from rest_framework import serializers
from .models import Video

class VideoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='video_id') # Map internal video_id to 'id' for frontend
    
    class Meta:
        model = Video
        fields = ['id', 'title', 'description', 'youtube_url', 'thumbnail', 'duration', 'subject', 'category']
