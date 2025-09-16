import Scrappy as scrap

scrap.activate()

print(scrap.check_up())

scraped_data = scrap.scrape(website = 'gmanetwork', limit = 7, url_to_save = "data/news2.csv")
print(scraped_data["message"])

scrap.deactivate()