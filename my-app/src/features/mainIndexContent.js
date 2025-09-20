import { loadCSVToJSON } from "./fileHandling.js"

/**
 * 
 * @param {*} newsTitle - News title 
 * @param {*} newsSource - News source link 
 * @param {*} publishedDate - When the news published
 * @param {*} reliability  - Percentage of reliability
 * @returns - HTML Content
 */
const createArticleContainerCard = (newsTitle, newsSource, publishedDate, reliability) => {
    return `<div class="article-card-container">
        <span class="article-card-title">${newsTitle}</span>
        <div class="article-card-source-container">
            <span class="article-card-source">Source: ${newsSource}</span>
            <div class="just-circle"></div>
            <span class="date-published">${publishedDate}</span>
        </div>
        <span class="article-card-reliability-container">
            <img src="assets/images/check.png" alt="Real Article Icon" class="article-reliability-real-icon">
            <span class="reliability-real-text">Reliability: ${reliability}</span>
        </span>
    </div>`
}


const generateColumnContents = () => {

}


const mainIndexContent = async () => {
    const data = await loadCSVToJSON("/data/news2.csv")

    console.log(data)
}

(async () => {
    await mainIndexContent();
})();
