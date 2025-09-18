import Scrappy as scrap

scrap.activate()

# print(scrap.check_up())

scraped_data = scrap.scrape_gmanetwork(url_to_save = "data/news1.csv")
print(scraped_data["message"])

scrap.deactivate()