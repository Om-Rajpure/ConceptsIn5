"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import JsonResponse
from django.db import connections
from django.db.utils import OperationalError
import os

def health_check(request):
    status = {
        "status": "healthy",
        "database": "unknown",
    }
    status_code = 200
    try:
        # Check database connection
        db_conn = connections['default']
        db_conn.cursor()
        status["database"] = "connected"
    except OperationalError:
        status["status"] = "unhealthy"
        status["database"] = "disconnected"
        status_code = 503
    except Exception as e:
        status["status"] = "unhealthy"
        status["database"] = f"error: {str(e)}"
        status_code = 503
        
    return JsonResponse(status, status=status_code)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('django-admin/', admin.site.urls), # Rename default admin to avoid collision with custom /om
    path('api/', include('videos.urls')),

    # Serve built frontend assets directly from root paths
    path('assets/<path:path>', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'assets'),
    }),
    path('images/<path:path>', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist', 'images'),
    }),
    path('favicon.png', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist'),
        'path': 'favicon.png',
    }),

    path('', lambda request: JsonResponse({'status': 'ok', 'service': 'ConceptsIn5 API'})),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

