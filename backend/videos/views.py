from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Video
from .serializers import VideoSerializer
from .services.youtube_service import YouTubeService

class VideoListView(APIView):
    """
    Returns a list of videos, optionally filtered by subject or category.
    """
    def get(self, request):
        subject = request.query_params.get('subject')
        category = request.query_params.get('category')
        
        queryset = Video.objects.all()
        if subject:
            queryset = queryset.filter(subject=subject)
        if category:
            queryset = queryset.filter(category=category)
            
        serializer = VideoSerializer(queryset, many=True)
        return Response(serializer.data)

class RefreshVideosView(APIView):
    """
    Triggers a manual sync with the YouTube API.
    """
    def post(self, request):
        service = YouTubeService()
        try:
            raw_videos = service.fetch_channel_videos()
            
            created_count = 0
            updated_count = 0
            
            for v_data in raw_videos:
                obj, created = Video.objects.update_or_create(
                    video_id=v_data['video_id'],
                    defaults=v_data
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
                    
            return Response({
                "status": "Success", 
                "total": len(raw_videos),
                "created": created_count,
                "updated": updated_count
            })
        except Exception as e:
            return Response({
                "status": "Error", 
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
