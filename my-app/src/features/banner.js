// * Default Selection
let currentSelectedPublisher = "GMA";
let currentSelectedSections = []

const publisherSections = {
    "GMA": ["All", "Money", "Sports", "Top Stories", "Life Style", "Pinoy Abroad", "Science Technology"],
    "BBC": ["All","News", "Sports", "Business", "Innovation", "Culture", "Earth"],
    "CNN": ["All","News", "Sports", "Business", "Innovation", "Culture", "Earth"],
    "Fox News": ["All","News", "Sports", "Business", "Innovation", "Culture", "Earth"],
    "The Guardian": ["All","News", "Sports", "Business", "Innovation", "Culture", "Earth"],
    "Inside Edition": ["All","News", "Sports", "Business", "Innovation", "Culture", "Earth"]
}

// "topstories", "money", "sports", "pinoyabroad", "scitech", "lifestyle"
const wantsToScrape = {
    "GMA": {
        apiName: "gmanetwork",
        apiSectionTypes: {
            "Money": "money",
            "Sports": "sports",
            "Pinoy Abroad": "pinoyabroad",
            "Science Technology": "scitech",
            "Life Style": "lifestyle",
            "Top Stories": "topstories"
        }
    }
}

/**
 * 
 * @returns 
 */
const scrapeData = async () => {
    if (currentSelectedPublisher != "GMA" || currentSelectedSections.length == 0) {
        console.log("Sorry Invalid")
        return
    }

    const publisherData = wantsToScrape[currentSelectedPublisher];
    if (!publisherData) return console.error("Publisher not configured");

    const sectionsToScrape = currentSelectedSections.length > 0 
        ? currentSelectedSections 
        : Object.keys(publisherData.apiSectionTypes);

    for (const section of sectionsToScrape) {
        const apiSection = publisherData.apiSectionTypes[section];
        try {
            const response = await fetch(`http://localhost:3000/scrappy/scrape/${publisherData.apiName}?type=${apiSection}`);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            console.log(`Scraped data for ${currentSelectedPublisher} - ${section}:`, data);

            // TODO: Render the data dynamically on your page
        } catch (err) {
            console.error(`Scraping failed for ${section}:`, err);
        }
    }
}


/**
 * 
 */
const applyScrapeBehaviour = () => {
    const scrapeBtn = document.getElementById("scrape-btn");
    if (!scrapeBtn) return;

    scrapeBtn.addEventListener("click", async () => {
        try {
            
            scrapeBtn.disabled = true;
            scrapeBtn.textContent = "Scraping...";

            await scrapeData();

            console.log("Scraping finished!");
        } catch (err) {
            console.error("Error while scraping:", err);
        } finally {
            scrapeBtn.disabled = false;
            scrapeBtn.textContent = "Scrape";
        }
    });
}

/**
 * Changes the section content depending on current slected publisher
 */
const changePublisherSectionContent = () => {
    const sectionContainer = document.querySelector(".section-buttons-container");
    sectionContainer.innerHTML = ""; 

    const sections = publisherSections[currentSelectedPublisher] || [];

    sections.forEach((sectionName, index) => {
        const button = document.createElement("button");
        button.textContent = sectionName;
        button.classList.add(`section${index + 1}`, "unselected");

        sectionContainer.appendChild(button);
    });
};


/**
 * Apply events on publisher filtering on banner
 */
const applyPublishersBehaviour = () => {
    const buttons = document.querySelectorAll(".publisher-buttons-container button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

        buttons.forEach(btn => btn.classList.remove("selected", "unselected"));
        buttons.forEach(btn => btn.classList.add("unselected"));

        button.classList.add("selected");
        button.classList.remove("unselected");

        currentSelectedPublisher = button.textContent.trim();

        console.log("Selected publisher:", currentSelectedPublisher);

        changePublisherSectionContent();
        applyPublisherSectionBehaviour();
        });
    });
};


/**
 * Apply section filtering for publisher sites pages
 */
const applyPublisherSectionBehaviour = () => {
    const sectionButtons = document.querySelectorAll(".section-buttons-container button");

    sectionButtons.forEach(button => {
        button.addEventListener("click", () => {
        const buttonText = button.textContent.trim();
        const isAllButton = buttonText.toLowerCase() === "all";

        if (isAllButton) {
            const allSelected = button.classList.contains("selected");

            sectionButtons.forEach(btn => {
            btn.classList.toggle("selected", !allSelected);
            btn.classList.toggle("unselected", allSelected);
            });

        } else {
            button.classList.toggle("selected");
            button.classList.toggle("unselected");

           
            const allButton = [...sectionButtons].find(btn => btn.textContent.trim().toLowerCase() === "all");
            if (allButton?.classList.contains("selected")) {
            allButton.classList.remove("selected");
            allButton.classList.add("unselected");
            }
        }

        currentSelectedSections = [...sectionButtons]
            .filter(btn => btn.classList.contains("selected") && btn.textContent.trim().toLowerCase() !== "all")
            .map(btn => btn.textContent.trim());

        console.log("Selected sections:", currentSelectedSections);
        });
    });
};


const mainBanner = () => {
    console.log("Running..")
    applyPublishersBehaviour();
    changePublisherSectionContent();
    applyPublisherSectionBehaviour();
    applyScrapeBehaviour();
};

mainBanner();