// const fs = require('fs');
// const Papa = require('papaparse');

import fs from 'fs';
import Papa from 'papaparse';

/**
 * Save your data to a CSV file
 * @param {*} data - data that will be saved to a csv file 
 * @param {*} filePath - path where the csv file will be saved
 */
export const saveCSVFile = (data, filePath) => {
    const loadedData = loadCSVFile(filePath) || [];
    loadedData.push(...data);
    // Remove potential duplicate entries based on a unique key, e.g., 'url'
    const uniqueData = Array.from(new Map(loadedData.map(item => [item.url, item])).values());
    const finalData = uniqueData;
    const csv = Papa.unparse(finalData);

    fs.writeFileSync(filePath, csv);
    console.log(`Data saved to ${filePath}`);
}

/**
 * loads a CSV file and parses it
 * @param {*} filePath - path to the csv file
 * @returns - parsed csv data
 */
export const loadCSVFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }

    const csv = fs.readFileSync(filePath, 'utf-8');
    const data = Papa.parse(csv).data;
    return data;
}

// if (require.main === module) {
//     const data = {
//         "Name": "Vince",
//         "Age": 22,
//         "City": "New York"
//     };
//     console.log(data);

//     const filePath = 'Scrappy/utils/test.csv';
    
//     saveCSVFile([data], filePath);
// }