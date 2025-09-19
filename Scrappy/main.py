import os
import time
import requests
import subprocess

from .file import FileManager

from dotenv import load_dotenv
from typing import Literal, Dict, Any, List


load_dotenv(dotenv_path="Scrappy/.env")

is_activated: bool = False

process: subprocess.Popen = None

file_manager: FileManager = FileManager()

port: str = os.getenv("SCRAPPY_PORT")
host: str = os.getenv("SCRAPPY_HOST")


def clear_screen() -> None:
    """ jUst clears terminal screen, """
    os.system('cls' if os.name == 'nt' else 'clear')


def activate(display_port: bool = False, timeout: int = 10) -> None:
    """ Activates Scrappy port in order to scrape on browser. """

    global process, is_activated

    if not is_activated:
        process = subprocess.Popen(["node", "Scrappy/index.js"])

        for _attempt_ in range(timeout):
            # clear_screen()
            print(f"\n[ Scrappy 🟠 ] Connecting . . . 🍊")

            try:
                greet_response: Dict[str, Any] = requests.get(f"http://{host}:{port}/scrappy/")

                if greet_response.status_code == 200:
                            clear_screen()
                            is_activated = True

                            break
                
            except requests.exceptions.ConnectionError:
                 pass
            
            time.sleep(1)

        if display_port:
            print(f"\n[ Scrappy 🟢 ] Going Online . . . 🍏 \n -------------------------------------------------- \n running at port: http://{host}:{port}/scrappy/ \n --------------------------------------------------\n")
        else:
            print("\n[ Scrappy 🟢 ] Going Online . . . 🍏\n")
        

def deactivate() -> None:
    """ DeActivates or Closing Scrappy port connection. """

    global is_activated

    time.sleep(1)

    if is_activated:
        print("\n[ Scrappy 🔴 ] Going Offline . . . 🍎")
        process.terminate()
        is_activated = False


def scrape_gmanetwork(limit: int = 2, type: Literal["topstories", "money", "sports", "pinoyabroad", "scitech", "lifestyle"] = "topstories", url_to_save: str = None) -> Dict[str, Any]:
    """ Scrape a specific news on GMA Network and can pick base on section types """

    if not is_activated:
        print("[ Scrappy is down ⚠️ ]")
        return
    
    scraped_data: Dict[str, Any] = requests.get(
        f"http://{host}:{port}/scrappy/scrape/gmanetwork", 
        params = {"limit": limit, "type": type}
    )

    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    if url_to_save:
        file_manager.save_csv(url_to_save, data["data"])

    return data


def scrape_bbc(limit: int = 2, type: Literal["news", "sport", "business", "innovation", "culture", "arts", "earth"] = "news", url_to_save: str = None) -> Dict[str, Any]:
    """ Scrape a specific news on GMA Network and can pick base on section types """

    if not is_activated:
        print("[ Scrappy is down ⚠️ ]")
        return

    scraped_data: Dict[str, Any] = requests.get(
        f"http://{host}:{port}/scrappy/scrape/bbc",
        params={"limit": limit, "type": type}
    )
    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    if url_to_save:
        file_manager.save_csv(url_to_save, data["data"])

    return data


def check_up() -> Dict[str, str]:
    """ Checks up scrappy if its prone on web bot detection or not. """

    global port

    if not is_activated:
        print("[ Scrappy is down ⚠️ ]")
        return

    scraped_data: Dict[str, Any] = requests.get(f"http://{host}:{port}/scrappy/check-up")
    data: List[Dict[str, str]] = scraped_data.json()

    if not data["success"]:
        return data["message"]

    return data["message"]


if __name__ == "__main__":
      scraper = scrape_gmanetwork()

      print(scraper)
