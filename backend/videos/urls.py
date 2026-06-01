from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicCategoryViewSet, PublicSubCategoryViewSet, PublicSubjectViewSet,
    PublicVideoViewSet, PublicNoteViewSet, PublicReelViewSet,
    AdminVideoViewSet, AdminNoteViewSet, AdminSubjectViewSet, AdminSubCategoryViewSet,
    AdminCategoryViewSet, AdminReelViewSet,
    LoginView, LogoutView, UserStatusView, AdminDashboardStatsView,
    health_check
)

# ── Namespaced routers (CMS / admin frontend uses /public/ and /admin/ prefixes) ──
public_router = DefaultRouter()
public_router.register(r'categories', PublicCategoryViewSet, basename='public-category')
public_router.register(r'subcategories', PublicSubCategoryViewSet, basename='public-subcategory')
public_router.register(r'subjects', PublicSubjectViewSet, basename='public-subject')
public_router.register(r'videos', PublicVideoViewSet, basename='public-video')
public_router.register(r'notes', PublicNoteViewSet, basename='public-note')
public_router.register(r'reels', PublicReelViewSet, basename='public-reel')

admin_router = DefaultRouter()
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-category')
admin_router.register(r'videos', AdminVideoViewSet, basename='admin-video')
admin_router.register(r'notes', AdminNoteViewSet, basename='admin-note')
admin_router.register(r'subjects', AdminSubjectViewSet, basename='admin-subject')
admin_router.register(r'subcategories', AdminSubCategoryViewSet, basename='admin-subcategory')
admin_router.register(r'reels', AdminReelViewSet, basename='admin-reel')

urlpatterns = [
    # ── Health check ──────────────────────────────────────────────────
    path('health/', health_check, name='health-check'),

    # ── Namespaced routes (used by the CMS / admin frontend) ──────────
    path('public/', include(public_router.urls)),
    path('admin/', include(admin_router.urls)),

    # ── Auth ──────────────────────────────────────────────────────────
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/status/', UserStatusView.as_view(), name='api-auth-status'),
    path('auth/logout/', LogoutView.as_view(), name='api-logout'),

    # ── Admin stats ───────────────────────────────────────────────────
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),

    # ── Top-level public shortcuts (called directly by the frontend) ──
    # Aliases for the public_router routes without the /public/ prefix.
    # Supports: api/categories/, api/videos/?is_important=true, api/reels/, etc.
    path('categories/', PublicCategoryViewSet.as_view({'get': 'list'}), name='category-list'),
    path('categories/<slug:slug>/', PublicCategoryViewSet.as_view({'get': 'retrieve'}), name='category-detail'),

    path('subcategories/', PublicSubCategoryViewSet.as_view({'get': 'list'}), name='subcategory-list'),
    path('subcategories/<slug:slug>/', PublicSubCategoryViewSet.as_view({'get': 'retrieve'}), name='subcategory-detail'),

    path('subjects/', PublicSubjectViewSet.as_view({'get': 'list'}), name='subject-list'),
    path('subjects/<slug:slug>/', PublicSubjectViewSet.as_view({'get': 'retrieve'}), name='subject-detail'),

    path('videos/', PublicVideoViewSet.as_view({'get': 'list'}), name='video-list'),
    path('videos/<int:pk>/', PublicVideoViewSet.as_view({'get': 'retrieve'}), name='video-detail'),

    path('notes/', PublicNoteViewSet.as_view({'get': 'list'}), name='note-list'),
    path('notes/<int:pk>/', PublicNoteViewSet.as_view({'get': 'retrieve'}), name='note-detail'),

    path('reels/', PublicReelViewSet.as_view({'get': 'list'}), name='reel-list'),
    path('reels/<int:pk>/', PublicReelViewSet.as_view({'get': 'retrieve'}), name='reel-detail'),

    # ── api/status/ — auth status alias (matches frontend call) ───────
    path('status/', UserStatusView.as_view(), name='api-status'),
]
