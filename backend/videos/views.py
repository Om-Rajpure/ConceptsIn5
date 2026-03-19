from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, SubCategory, Subject, Video, Note
from .serializers import (
    CategorySerializer, SubCategorySerializer, SubjectSerializer, 
    VideoSerializer, NoteSerializer
)
from .services import YouTubeService

# Public ViewSets
class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related('subcategories__subjects')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class PublicSubCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategory.objects.all().select_related('category').prefetch_related('subjects')
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
    lookup_field = 'slug'

class PublicSubjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subject.objects.all().select_related('subcategory')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subcategory']
    lookup_field = 'slug'

class PublicVideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.filter(is_published=True).select_related('subject')
    serializer_class = VideoSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subject', 'is_important']

class PublicNoteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Note.objects.all().select_related('video', 'subject')
    serializer_class = NoteSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video', 'subject']

# Admin ViewSets
class AdminVideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().select_related('subject')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def perform_create(self, serializer):
        fetch_from_youtube = self.request.data.get('fetch_from_youtube', False)
        youtube_url = self.request.data.get('youtube_url_input', '')
        
        if fetch_from_youtube and youtube_url:
            service = YouTubeService()
            video_id = service.extract_video_id(youtube_url)
            if video_id:
                # Check for duplicates
                if Video.objects.filter(youtube_id=video_id).exists():
                     # Potentially raise error or just update
                     pass
                else:
                    details = service.get_video_details(video_id)
                    if details:
                        serializer.save(
                            title=details['title'],
                            description=details['description'],
                            thumbnail=details['thumbnail'],
                            duration=details['duration'],
                            youtube_id=details['youtube_id'],
                            source='youtube'
                        )
                        return
        serializer.save()

class AdminNoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().select_related('video', 'subject')
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video', 'subject']

# Auth Views
class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({'detail': 'Logged in successfully', 'username': user.username})
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out successfully'})

class UserStatusView(views.APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'is_authenticated': True,
                'username': request.user.username,
                'is_staff': request.user.is_staff
            })
        return Response({'is_authenticated': False})

# Dashboard Stats
class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get(self, request):
        return Response({
            'total_videos': Video.objects.count(),
            'total_subjects': Subject.objects.count(),
            'total_notes': Note.objects.count(),
        })
