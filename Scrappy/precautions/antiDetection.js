
/**
 * Per Scrape it picks Random User Agent per Scrape
 * @returns 
 */
export const randomUserAgent = () => {
    const userAgents = [
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36,gzip(gfe)",
        "Mozilla/5.0 (Linux; Android 14; moto g power 5G - 2024 Build/U1UD34.16-62; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/123.0.6312.99 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 12; moto g stylus 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36v",
        "Mozilla/5.0 (Linux; Android 13; 23129RAA4G Build/TKQ1.221114.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36",
        "Mozilla/5.0 (iPad16,3; CPU OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Tropicana_NJ/5.7.1",
        "Dalvik/2.1.0 (Linux; U; Android 14; SM-X306B Build/UP1A.231005.007)",
        "Mozilla/5.0 (PlayStation; PlayStation 5/2.26) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15",
        "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
        "Dalvik/2.1.0 (Linux; U; Android 14; SM-P619N Build/UP1A.231005.007)",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1"
    ];
    
    const pickUserAgent = Math.floor(Math.random() * userAgents.length)
    return userAgents[pickUserAgent]
}


/**
 * It delays every querySelector in a second to avoid continous scraping
 * It helps also to mimic real user browsing through the site by delaying
 * @param {number} min minimum seconds
 * @param {number} max maximum seconds
 * @returns 
 */
export const randomDelay= (min,max) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}
