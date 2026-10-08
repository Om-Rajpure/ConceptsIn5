from rest_framework import viewsets, permissions, status, views, parsers
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.cache import cache_page
try:
    from ratelimit.decorators import ratelimit
except ImportError:
    # Resilient fallback mock decorator if django-ratelimit is not installed locally
    def ratelimit(*args, **kwargs):
        def decorator(func):
            return func
        return decorator

from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, SubCategory, Subject, Video, Note, Reel
from .serializers import (
    CategorySerializer, SubCategorySerializer, SubjectSerializer, 
    VideoSerializer, PublicVideoSerializer, NoteSerializer, ReelSerializer
)
from .utils.youtube_utils import extract_video_id, get_thumbnail, get_embed_url
from rest_framework.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


def health_check(request):
    return JsonResponse({'status': 'healthy', 'service': 'conceptsin5-api'})


# ─── Public ViewSets (Read-Only) ─────────────────────────────────────

@method_decorator(cache_page(60 * 10), name='dispatch')
class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().prefetch_related('all_subcategories__subjects')
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


# @method_decorator(cache_page(60 * 5), name='dispatch')
class PublicReelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Reel.objects.all().order_by("-created_at")
    serializer_class = ReelSerializer
    permission_classes = [permissions.AllowAny]


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


class AdminReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.all().order_by("-created_at")
    serializer_class = ReelSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        try:
            serializer.save()
            logger.info(f"Admin created reel: {serializer.instance.title}")
        except Exception as e:
            logger.error(f"Error creating reel: {e}", exc_info=True)
            raise ValidationError({"success": False, "error": f"Failed to create reel: {str(e)}"})

    def perform_update(self, serializer):
        try:
            serializer.save()
            logger.info(f"Admin updated reel: {serializer.instance.title}")
        except Exception as e:
            logger.error(f"Error updating reel: {e}", exc_info=True)
            raise ValidationError({"success": False, "error": f"Failed to update reel: {str(e)}"})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        response = super().destroy(request, *args, **kwargs)
        logger.info(f"Admin deleted reel: {title}")
        return response


class AdminSubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().select_related('subcategory', 'category')
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
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        try:
            name = self.request.data.get('name')
            category_id = self.request.data.get('category')
            
            if SubCategory.objects.filter(name__iexact=name, category_id=category_id).exists():
                raise ValidationError({"error": f"Sub-category '{name}' already exists for this category"})
                
            from django.utils.text import slugify
            candidate_slug = slugify(name)
            if SubCategory.objects.filter(slug=candidate_slug).exists():
                # Allow same slug if it's the same name and we want to allow it (but the user said unique name)
                # Actually, let's just let it save and handle slug conflicts via model unique constraint if needed
                pass
                
            serializer.save()
            logger.info(f"Admin created sub-category: {serializer.instance.name}")
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Error creating subcategory: {e}", exc_info=True)
            raise ValidationError({"detail": "Failed to create subcategory. Please try again."})


class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().prefetch_related('all_subcategories__subjects')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]


# ─── Auth Views ──────────────────────────────────────────────────────

@method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True), name='post')
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


@method_decorator(ensure_csrf_cookie, name='dispatch')
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
                'total_reels': Reel.objects.count(),
                'total_categories': Category.objects.count(),
                'total_subcategories': SubCategory.objects.count(),
            })
        except Exception as e:
            logger.error(f"Error fetching dashboard stats: {e}", exc_info=True)
            return Response(
                {'success': False, 'error': f'Failed to load dashboard statistics: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ─── AI Endpoints (Claude-Powered) ───────────────────────────────────

@method_decorator(ratelimit(key='ip', rate='30/m', method='POST', block=True), name='post')
class ConceptTutorView(views.APIView):
    """
    Flagship Context-Grounded AI Concept Tutor.
    Takes a question and concept identifier, retrieves validated server-side
    learning context, and passes it to Claude for pedagogical explanation.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import bleach
        from services.claude_service import ask_concept_tutor

        video_id = request.data.get('video_id')
        note_id = request.data.get('note_id')
        subject_slug = request.data.get('subject_slug')
        raw_question = request.data.get('question', '').strip()
        action_type = request.data.get('action_type', 'custom').strip()

        if not raw_question and action_type == 'custom':
            return Response(
                {'success': False, 'error': 'Please provide a question or select an action.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Sanitize and enforce character limit
        question = bleach.clean(raw_question)[:500]
        if not question and action_type in ['simplify', 'example', 'exam_tip', 'compare', 'quiz_me']:
            action_prompts = {
                'simplify': 'Explain this concept in simple terms for a beginner.',
                'example': 'Provide a practical real-world engineering example or code snippet.',
                'exam_tip': 'What are the highest-yield points to remember for semester exams?',
                'compare': 'Compare this concept with its closest related engineering concept.',
                'quiz_me': 'Give me a quick conceptual question to test my understanding.'
            }
            question = action_prompts.get(action_type, 'Explain this concept.')

        # Build context server-side
        context_data = {
            'title': 'General Technical Concept',
            'subject_name': 'Engineering',
            'topics': [],
            'summary': '',
            'notes_content': ''
        }

        if video_id:
            try:
                vid = Video.objects.select_related('subject').prefetch_related('notes').get(id=video_id)
                context_data['title'] = vid.title
                context_data['subject_name'] = vid.subject.name if vid.subject else 'Computer Science'
                context_data['topics'] = vid.roadmap or [t.strip() for t in vid.important_topics.split(',') if t.strip()]
                context_data['summary'] = vid.quick_summary or vid.description
                if vid.notes.exists():
                    context_data['notes_content'] = "\n".join([n.content for n in vid.notes.all()[:2]])
            except (Video.DoesNotExist, ValueError):
                pass
        elif note_id:
            try:
                n = Note.objects.select_related('subject', 'video').get(id=note_id)
                context_data['title'] = n.title
                context_data['subject_name'] = n.subject.name if n.subject else 'Computer Science'
                context_data['notes_content'] = n.content
                if n.video:
                    context_data['summary'] = n.video.quick_summary or n.video.description
                    context_data['topics'] = n.video.roadmap
            except (Note.DoesNotExist, ValueError):
                pass
        elif subject_slug:
            try:
                subj = Subject.objects.prefetch_related('videos', 'notes').get(slug=subject_slug)
                context_data['title'] = subj.name
                context_data['subject_name'] = subj.name
                context_data['summary'] = subj.description
                sample_videos = [v.title for v in subj.videos.all()[:4]]
                context_data['topics'] = sample_videos
            except Subject.DoesNotExist:
                pass

        result = ask_concept_tutor(context_data, question, action_type)
        return Response({
            'success': True,
            'data': result,
            'context_title': context_data['title']
        })


@method_decorator(ratelimit(key='ip', rate='15/m', method='POST', block=True), name='post')
class QuickQuizView(views.APIView):
    """
    AI Diagnostic Quiz Generator.
    Generates a 4-question targeted quiz based on the active learning module context.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from services.claude_service import generate_quick_quiz

        video_id = request.data.get('video_id')
        note_id = request.data.get('note_id')
        subject_slug = request.data.get('subject_slug')

        context_data = {
            'title': 'Technical Concept',
            'subject_name': 'Engineering',
            'topics': [],
            'summary': '',
            'notes_content': ''
        }

        if video_id:
            try:
                vid = Video.objects.select_related('subject').prefetch_related('notes').get(id=video_id)
                context_data['title'] = vid.title
                context_data['subject_name'] = vid.subject.name if vid.subject else 'Computer Science'
                context_data['topics'] = vid.roadmap or [t.strip() for t in vid.important_topics.split(',') if t.strip()]
                context_data['summary'] = vid.quick_summary or vid.description
                if vid.notes.exists():
                    context_data['notes_content'] = "\n".join([n.content for n in vid.notes.all()[:2]])
            except (Video.DoesNotExist, ValueError):
                pass
        elif note_id:
            try:
                n = Note.objects.select_related('subject', 'video').get(id=note_id)
                context_data['title'] = n.title
                context_data['subject_name'] = n.subject.name if n.subject else 'Computer Science'
                context_data['notes_content'] = n.content
            except (Note.DoesNotExist, ValueError):
                pass
        elif subject_slug:
            try:
                subj = Subject.objects.get(slug=subject_slug)
                context_data['title'] = subj.name
                context_data['subject_name'] = subj.name
                context_data['summary'] = subj.description
            except Subject.DoesNotExist:
                pass

        result = generate_quick_quiz(context_data)
        return Response({
            'success': True,
            'data': result,
            'context_title': context_data['title']
        })

