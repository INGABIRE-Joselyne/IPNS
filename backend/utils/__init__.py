"""
Utility functions for the IPNS backend.
"""


def get_pharmacy_status_display(status: str) -> str:
    """Get human-readable pharmacy status display."""
    status_map = {
        'open': '🟢 Open',
        'closing_soon': '🟡 Closing Soon',
        'closed': '🔴 Closed',
    }
    return status_map.get(status, 'Unknown')
