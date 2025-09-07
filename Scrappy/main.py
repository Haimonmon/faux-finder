import requests
import subprocess

from typing import Literal, Dict, Any, List

from .file import FileManager

file_manager = FileManager()
process: subprocess.Popen = None

def activate() -> None:
    """ Activates Scrappy port in order to scrape on browser. """
    global process
    process = subprocess.Popen(["node", "Scrappy/index.js"])


def deactivate() -> None:
    """ DeActivates or Closing Scrappy port connection. """
    print("\n [ Scrappy 🎉 ] \n Shutting Down . . . 🍒")
    process.terminate()


def scrape(website: Literal["philstar", "abscbn", "gmanetwork"] = "philstar", limit: int = 1, url_to_save: str = None) -> str:
    """ Scrape a specific news on the givin url site """
    if website not in ["philstar", "abscbn", "gmanetwork"]:
        print(" Cant scrape that site buddy ☝️🤓.")
        return
    
    # * ACTIVATE SCRAPPY
    activate()
    website = website.lower()

    scraped_data: Dict[str, Any] = requests.get(f"http://localhost:3000/scrappy/scrape/{website}")
    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    deactivate()
    return data["data"]


if __name__ == "__main__":
      scraper = scrape("gmanetwork")

      print(scraper)
