from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Category, SubCategory, Subject, Video, Note
import logging

logger = logging.getLogger(__name__)

@receiver([post_save, post_delete], sender=Category)
@receiver([post_save, post_delete], sender=SubCategory)
@receiver([post_save, post_delete], sender=Subject)
@receiver([post_save, post_delete], sender=Video)
@receiver([post_save, post_delete], sender=Note)
def clear_api_cache(sender, instance, **kwargs):
    """
    Clears the entire cache when any relevant model is created, updated, or deleted.
    This ensures that public-facing cached APIs always serve fresh data.
    """
    cache.clear()
    logger.info(f"Cache cleared due to change in {sender.__name__}: {instance}")
