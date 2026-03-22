from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, SubCategory, Subject, Video, Note
from .serializers import (
    CategorySerializer, SubCategorySerializer, SubjectSerializer, 
    VideoSerializer, PublicVideoSerializer, NoteSerializer
)
from .utils.youtube_utils import extract_video_id, get_thumbnail, get_embed_url
from .utils.description_processor import process_description, generate_roadmap
from rest_framework.exceptions import ValidationError

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
    serializer_class = PublicVideoSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'subject': ['exact'],
        'subject__slug': ['exact'],
    }

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
        description = self.request.data.get('description', '')
        summary, _ = process_description(description)
        
        youtube_url = self.request.data.get('youtube_url')
        if youtube_url:
            video_id = extract_video_id(youtube_url)
            if not video_id:
                raise ValidationError({"youtube_url": "Invalid YouTube URL"})
            instance = serializer.save(
                youtube_id=video_id,
                thumbnail=get_thumbnail(video_id),
                video_url=get_embed_url(video_id),
                quick_summary=summary
            )
        else:
            instance = serializer.save(quick_summary=summary)
        
        # Always generate roadmap using fallback logic
        generate_roadmap(instance)

    def perform_update(self, serializer):
        description = self.request.data.get('description', '')
        summary, _ = process_description(description)
        
        youtube_url = self.request.data.get('youtube_url')
        if youtube_url:
            video_id = extract_video_id(youtube_url)
            if not video_id:
                raise ValidationError({"youtube_url": "Invalid YouTube URL"})
            instance = serializer.save(
                youtube_id=video_id,
                thumbnail=get_thumbnail(video_id),
                video_url=get_embed_url(video_id),
                quick_summary=summary
            )
        else:
            instance = serializer.save(quick_summary=summary)
            
        # Always re-generate roadmap using fallback logic
        generate_roadmap(instance)

class AdminNoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().select_related('video', 'subject')
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['video', 'subject']

class AdminSubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().select_related('subcategory')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        name = self.request.data.get('name')
        if Subject.objects.filter(name__iexact=name).exists():
            raise ValidationError({"error": "Subject already exists"})
        serializer.save()

class AdminSubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all().select_related('category')
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        name = self.request.data.get('name')
        category_id = self.request.data.get('category')
        
        # Check if sub-category with this name already exists for THIS category
        if SubCategory.objects.filter(name__iexact=name, category_id=category_id).exists():
            raise ValidationError({"error": f"Sub-category '{name}' already exists for this category"})
            
        # Due to global unique slug constraint, we must also check if name results in a duplicate slug
        from django.utils.text import slugify
        candidate_slug = slugify(name)
        if SubCategory.objects.filter(slug=candidate_slug).exists():
            raise ValidationError({"error": f"A sub-category with name '{name}' (slug: {candidate_slug}) already exists globally. Please use a slightly different name."})
            
        serializer.save()

# Auth Views
@method_decorator(csrf_exempt, name='dispatch')
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
