from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, SubCategory, Subject, Video, Note
from .serializers import (
    CategorySerializer, SubCategorySerializer, SubjectSerializer, 
    VideoSerializer, PublicVideoSerializer, NoteSerializer
)
from .utils.youtube_utils import extract_video_id, get_thumbnail, get_embed_url
from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


# ─── Public ViewSets (Read-Only) ─────────────────────────────────────

@method_decorator(cache_page(60 * 10), name='dispatch')
class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related('subcategories__subjects')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

@method_decorator(cache_page(60 * 10), name='dispatch')
class PublicSubCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubCategory.objects.all().select_related('category').prefetch_related('subjects')
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
    lookup_field = 'slug'

@method_decorator(cache_page(60 * 10), name='dispatch')
class PublicSubjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subject.objects.all().select_related('subcategory')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['subcategory']
    lookup_field = 'slug'

@method_decorator(cache_page(60 * 5), name='dispatch')
class PublicVideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.filter(is_published=True).select_related('subject').prefetch_related('notes')
    serializer_class = PublicVideoSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'subject': ['exact'],
        'subject__slug': ['exact'],
        'is_important': ['exact'],
        'subject__subcategory__category': ['exact'],
    }

@method_decorator(cache_page(60 * 5), name='dispatch')
class PublicNoteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Note.objects.all().select_related('video', 'subject')
    serializer_class = NoteSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'video': ['exact'],
        'subject': ['exact'],
        'subject__slug': ['exact'],
        'subject__subcategory': ['exact'],
        'subject__subcategory__category': ['exact'],
    }


# ─── Admin ViewSets ──────────────────────────────────────────────────

class AdminVideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().select_related('subject').prefetch_related('notes')
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filterset_fields = {
        'subject': ['exact'],
        'is_important': ['exact'],
        'subject__subcategory': ['exact'],
        'subject__subcategory__category': ['exact'],
    }

    def perform_create(self, serializer):
        try:
            youtube_url = self.request.data.get('youtube_url')
            if youtube_url:
                video_id = extract_video_id(youtube_url)
                if not video_id:
                    raise ValidationError({"youtube_url": "Invalid YouTube URL"})
                serializer.save(
                    youtube_id=video_id,
                    thumbnail=get_thumbnail(video_id),
                    video_url=get_embed_url(video_id)
                )
                logger.info(f"Admin created video from URL: {serializer.instance.title}")
            else:
                serializer.save()
                logger.info(f"Admin created video manually: {serializer.instance.title}")
        except ValidationError:
            raise  # Re-raise validation errors as-is
        except Exception as e:
            logger.error(f"Error creating video: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to create video. Please check your input and try again."})

    def perform_update(self, serializer):
        try:
            youtube_url = self.request.data.get('youtube_url')
            if youtube_url:
                video_id = extract_video_id(youtube_url)
                if not video_id:
                    raise ValidationError({"youtube_url": "Invalid YouTube URL"})
                serializer.save(
                    youtube_id=video_id,
                    thumbnail=get_thumbnail(video_id),
                    video_url=get_embed_url(video_id)
                )
                logger.info(f"Admin updated video (URL changed): {serializer.instance.title}")
            else:
                serializer.save()
                logger.info(f"Admin updated video: {serializer.instance.title}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error updating video: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to update video. Please check your input and try again."})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        response = super().destroy(request, *args, **kwargs)
        logger.info(f"Admin deleted video: {title}")
        return response


class AdminNoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().select_related('video', 'subject')
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'video': ['exact'],
        'subject': ['exact'],
        'subject__subcategory': ['exact'],
        'subject__subcategory__category': ['exact'],
    }

    def perform_create(self, serializer):
        try:
            serializer.save()
            logger.info(f"Admin created note: {serializer.instance.title}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error creating note: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to create note. Please try again."})

    def perform_update(self, serializer):
        try:
            serializer.save()
            logger.info(f"Admin updated note: {serializer.instance.title}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error updating note: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to update note. Please try again."})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        response = super().destroy(request, *args, **kwargs)
        logger.info(f"Admin deleted note: {title}")
        return response


class AdminSubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().select_related('subcategory')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        try:
            name = self.request.data.get('name')
            if Subject.objects.filter(name__iexact=name).exists():
                raise ValidationError({"error": "Subject already exists"})
            serializer.save()
            logger.info(f"Admin created subject: {serializer.instance.name}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error creating subject: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to create subject. Please try again."})


class AdminSubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all().select_related('category').prefetch_related('subjects')
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        try:
            name = self.request.data.get('name')
            category_id = self.request.data.get('category')
            
            if SubCategory.objects.filter(name__iexact=name, category_id=category_id).exists():
                raise ValidationError({"error": f"Sub-category '{name}' already exists for this category"})
                
            from django.utils.text import slugify
            candidate_slug = slugify(name)
            if SubCategory.objects.filter(slug=candidate_slug).exists():
                raise ValidationError({"error": f"A sub-category with name '{name}' (slug: {candidate_slug}) already exists globally. Please use a slightly different name."})
                
            serializer.save()
            logger.info(f"Admin created sub-category: {serializer.instance.name}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error creating subcategory: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to create subcategory. Please try again."})


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().prefetch_related('subcategories__subjects')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# ─── Auth Views ──────────────────────────────────────────────────────

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'success': False, 'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            logger.info(f"Admin login successful: {user.username}")
            return Response({
                'success': True,
                'detail': 'Logged in successfully',
                'username': user.username
            })
        return Response(
            {'success': False, 'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(views.APIView):
    def post(self, request):
        username = request.user.username
        logout(request)
        logger.info(f"Admin logout: {username}")
        return Response({'success': True, 'detail': 'Logged out successfully'})


class UserStatusView(views.APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'is_authenticated': True,
                'username': request.user.username,
                'is_staff': request.user.is_staff,
            })
        return Response({'is_authenticated': False})


# ─── Dashboard Stats ─────────────────────────────────────────────────

class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    
    def get(self, request):
        try:
            return Response({
                'success': True,
                'total_videos': Video.objects.count(),
                'total_subjects': Subject.objects.count(),
                'total_notes': Note.objects.count(),
            })
        except Exception as e:
            logger.error(f"Error fetching dashboard stats: {e}", exc_info=True)
            return Response(
                {'success': False, 'error': 'Failed to load dashboard statistics.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
