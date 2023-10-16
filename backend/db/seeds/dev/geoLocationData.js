const fs = require('fs');
const path = require('path');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// seeds "traditional" pg database with data from csv file
exports.seed = async function (knex) {
  await knex('location_data').del();

  const csvFile = fs.readFileSync(path.resolve('data/data.csv'), 'utf8');
  const rows = csvFile.split('\n').map((line) => line.replace('\r', ''));

  // Extract headers
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.split(',');

  // Parse rows
  const insertData = dataRows.map((row) => {
    const values = row.split(',');

    // Create object for each row
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index];
    });

    return rowData;
  });

  // Insert parsed data into database
  await knex('location_data').insert(insertData);
};
