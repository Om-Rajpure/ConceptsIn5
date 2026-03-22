from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicCategoryViewSet, PublicSubCategoryViewSet, PublicSubjectViewSet,
    PublicVideoViewSet, PublicNoteViewSet,
    AdminVideoViewSet, AdminNoteViewSet, AdminSubjectViewSet, AdminSubCategoryViewSet,
    LoginView, LogoutView, UserStatusView, AdminDashboardStatsView
)

router = DefaultRouter()

# Public Routes
# We'll use prefixing in the main urls.py or here
# For now, let's define them clearly

public_router = DefaultRouter()
public_router.register(r'categories', PublicCategoryViewSet, basename='public-category')
public_router.register(r'subcategories', PublicSubCategoryViewSet, basename='public-subcategory')
public_router.register(r'subjects', PublicSubjectViewSet, basename='public-subject')
public_router.register(r'videos', PublicVideoViewSet, basename='public-video')
public_router.register(r'notes', PublicNoteViewSet, basename='public-note')

admin_router = DefaultRouter()
admin_router.register(r'videos', AdminVideoViewSet, basename='admin-video')
admin_router.register(r'notes', AdminNoteViewSet, basename='admin-note')
admin_router.register(r'subjects', AdminSubjectViewSet, basename='admin-subject')
admin_router.register(r'subcategories', AdminSubCategoryViewSet, basename='admin-subcategory')

urlpatterns = [
    path('public/', include(public_router.urls)),
    path('admin/', include(admin_router.urls)),
    path('auth/login/', LoginView.as_view(), name='api-login'),
    path('auth/status/', UserStatusView.as_view(), name='api-status'),
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('auth/logout/', LogoutView.as_view(), name='api-logout'),
]
