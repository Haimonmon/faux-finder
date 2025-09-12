import requests
import subprocess

from typing import Literal, Dict, Any, List

from .file import FileManager

file_manager = FileManager()
process: subprocess.Popen = None
is_activated: bool = False

def activate(display_port: bool = False) -> None:
    """ Activates Scrappy port in order to scrape on browser. """
    global process, is_activated

    if not is_activated:
        process = subprocess.Popen(["node", "Scrappy/index.js"])

        if display_port:
            print("f\n[ Scrappy 🟢 ] Getting Started . . . 🍏 \n -------------------------------------------------- \n running at port: http://localhost:3000/scrappy/ \n --------------------------------------------------\n")
        else:
            print("\n[ Scrappy 🟢 ] Getting Started . . . 🍏\n")
        
        is_activated = True



def deactivate() -> None:
    """ DeActivates or Closing Scrappy port connection. """
    global is_activated

    if is_activated:
        print("\n[ Scrappy 🔴 ] Shutting Down . . . 🍎")
        process.terminate()
        is_activated = False


def scrape(website: Literal["philstar", "abscbn", "gmanetwork"] = "philstar", limit: int = 1, url_to_save: str = None, display_port: bool = False) -> str:
    """ Scrape a specific news on the givin url site """
    if website not in ["philstar", "abscbn", "gmanetwork"]:
        print(" Cant scrape that site buddy ☝️🤓.")
        return
    
    # # * ACTIVATE SCRAPPY
    # activate(display_port)
    website = website.lower()

    scraped_data: Dict[str, Any] = requests.get(f"http://localhost:3000/scrappy/scrape/{website}?limit={limit}")
    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    # deactivate()

    if url_to_save:
        file_manager.save_csv(url_to_save, data["data"])
    return data


def check_up(display_port: bool = False) -> Dict[str, Any]:
    """ Checks up scrappy if its prone on web bot detection or not. """
    # activate(display_port)

    scraped_data: Dict[str, Any] = requests.get(f"http://localhost:3000/scrappy/check-up")
    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    # deactivate()
    return data["message"]

if __name__ == "__main__":
      scraper = scrape("gmanetwork")

      print(scraper)
