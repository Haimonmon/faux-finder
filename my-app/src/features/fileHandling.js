import fs from "fs";
import Papa from "papaparse";

export const loadCSVToJSON = async (path) => {
  const response = await fetch(path);
  const csv = await response.text();

  // console.log(csv)

  const result = Papa.parse(csv, {
    header: true,   
    skipEmptyLines: true
  });

  return result.data;
};


/**
 * Saves JSON data to a CSV file on disk
 * @param {Array} jsonData - Array of objects
 * @param {string} filePath - Path to the CSV file
 */
export const saveCSVToFile = (jsonData, filePath = "./data.csv") => {
  if (!jsonData || !jsonData.length) {
    console.error("No data to save!");
    return;
  }

  const csv = Papa.unparse(jsonData);

  fs.writeFile(filePath, csv, "utf8", (err) => {
    if (err) {
      console.error("Error saving CSV:", err);
    } else {
      console.log(`CSV saved successfully at ${filePath}`);
    }
  });
};