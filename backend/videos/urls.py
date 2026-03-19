from django.urls import path
from .views import VideoListView, RefreshVideosView

urlpatterns = [
    path('', VideoListView.as_view(), name='video-list'),
    path('refresh/', RefreshVideosView.as_view(), name='video-refresh'),
]
