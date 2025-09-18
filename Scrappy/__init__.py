"""
## Scrappy

CAUTION:
An action of scraping may cause a ban to the specific website so be careful.
"""

from .main import scrape_gmanetwork, scrape_bbc, check_up, activate, deactivate

__all__ = [
    "scrape_gmanetwork", "check_up", "activate", "deactivate"
]