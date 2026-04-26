"""
Common utilities and helper functions for the IPNS API.
"""
from django.db.models import QuerySet
from typing import Any, List


def get_paginated_response(queryset: QuerySet, page_size: int = 10) -> dict:
    """Helper function to prepare paginated response."""
    return {
        'count': queryset.count(),
        'results': queryset[:page_size]
    }


def format_error_response(message: str, code: str = None) -> dict:
    """Format error response consistently."""
    return {
        'error': message,
        'code': code or 'UNKNOWN_ERROR'
    }
