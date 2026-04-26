"""
Global exception and error handling for API.
"""
from rest_framework.exceptions import APIException
from rest_framework import status


class PharmacyNetworkException(APIException):
    """Base exception for IPNS API."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'An error occurred.'


class MedicineNotFound(PharmacyNetworkException):
    """Raised when a medicine is not found."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Medicine not found.'


class PharmacyNotFound(PharmacyNetworkException):
    """Raised when a pharmacy is not found."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Pharmacy not found.'


class StockNotFound(PharmacyNetworkException):
    """Raised when stock information is not found."""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Stock information not found.'
