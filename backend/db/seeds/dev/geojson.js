const fs = require('fs');
const path = require('path');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// seeds `location_geojson` with geojson jsonb column
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('location_geojson').del();

  const csvFile = fs.readFileSync(path.resolve('data/data.csv'), 'utf8');
  const rows = csvFile.split('\n').map((line) => line.replace('\r', ''));

  // Extract headers
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.split(',');

  const geoJSONFeatures = rows
    .map((row) => {
      const values = row.split(',');

      // Create an object from headers and values
      const dataObject = {};
      headers.forEach((header, index) => {
        dataObject[header] = values[index];
      });

      return {
        dataObject,
        feature: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(dataObject.Longitude),
              parseFloat(dataObject.Latitude),
            ],
          },
          properties: {
            TimeStamp: dataObject.TimeStamp,
            Ch4: parseFloat(dataObject.Ch4),
            C2H6: parseFloat(dataObject.C2H6),
          },
        },
      };
    })
    .filter(({ dataObject, feature }) => {
      // Check if Latitude or Longitude is null or NaN and filter them out
      return (
        dataObject.Latitude &&
        dataObject.Longitude &&
        !isNaN(feature.geometry.coordinates[0]) &&
        !isNaN(feature.geometry.coordinates[1])
      );
    })
    .map(({ feature }) => feature);

  const geoJSONData = {
    type: 'FeatureCollection',
    features: geoJSONFeatures,
  };

  // 3. Seed the Database
  await knex('location_geojson').insert({
    geojson_feature: JSON.stringify(geoJSONData),
  });
};
