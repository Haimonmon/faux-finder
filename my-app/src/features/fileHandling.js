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
 * Converts JSON data to CSV and triggers a download in browser
 * @param {Array} jsonData - Array of objects
 * @param {string} filename - Name of the CSV file to save
 */
export const saveCSV = (jsonData, filename = "data.csv") => {
  if (!jsonData || !jsonData.length) {
    console.error("No data to save!");
    return;
  }

  const csv = Papa.unparse(jsonData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
};