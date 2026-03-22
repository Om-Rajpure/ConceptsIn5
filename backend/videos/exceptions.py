"""
Global exception handler for the ConceptsIn5 API.
Ensures all errors return clean, consistent JSON responses.
"""

import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that wraps all DRF errors in a consistent
    { success: false, error: ... } format, and catches unhandled exceptions.
    """

    # Let DRF handle the exception first
    response = exception_handler(exc, context)

    if response is not None:
        # DRF handled it — wrap in our consistent format
        error_data = response.data

        # Flatten single-key error dicts for cleaner frontend consumption
        if isinstance(error_data, dict):
            # If it's a 'detail' key only, unwrap it
            if list(error_data.keys()) == ['detail']:
                error_data = str(error_data['detail'])
        elif isinstance(error_data, list):
            error_data = [str(e) for e in error_data]

        response.data = {
            'success': False,
            'status_code': response.status_code,
            'error': error_data,
        }
        return response

    # DRF didn't handle it — this is an unhandled server error
    # Log the full traceback for debugging
    view = context.get('view', None)
    view_name = view.__class__.__name__ if view else 'Unknown'
    logger.error(
        f"Unhandled exception in {view_name}: {exc}",
        exc_info=True,
        extra={'request': context.get('request')},
    )

    return Response(
        {
            'success': False,
            'status_code': 500,
            'error': 'An internal server error occurred. Please try again later.',
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
