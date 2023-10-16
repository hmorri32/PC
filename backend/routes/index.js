const express = require('express');
const router = express.Router();
const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[enviroment];
const database = require('knex')(configuration);


router.get('/', (_, response) => {
  response.json({
    name: 'hugh',
    cool: true,
  });
});

// serves geojson formatted data from csv
// renderin a ggeojson layer is much faster than looping over json and rendering markers
// and is faster than converting json to geojson client side.
router.get('/api/v1/location-geojson', (request, response) => {
  database('location_geojson')
    .select()
    .then((geojson) => {
      if (geojson.length) {
        response.status(200).json(geojson);
      } else {
        response.status(404).json({ error: 'No GeoJSON data found' });
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: `Internal Server Error: ${error}` });
    });
});

// serves json from csv
// downsides: have to map over data to render markers
// or have to format as geojson client side
// both of which are slow with the amount of data we have.
// note: not currently used in the frontend.
router.get('/api/v1/location-data', (request, response) => {
  database('location_data')
    .select()
    .then((locationData) => {
      response.status(200).json(locationData);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: `Internal Server Error: ${error}` });
    });
});

// serves buffer geometry that's associated with a geojson id
router.get('/api/v1/location-geojson/:id/buffer-geom', (request, response) => {
  const { id } = request.params;

  database('buffer_geojson')
    .where('geojson_id', id)
    .select()
    .then((bufferData) => {
      console.log({ bufferData });

      response.status(200).json(bufferData);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: `Internal Server Error: ${error}` });
    });
});

// effectively an upsert
router.post(
  '/api/v1/location-geojson/:id/buffer-geom',
  async (request, response) => {
    try {
      const geojsonId = request.params.id;
      const bufferData = request.body;
      const geojson = await database('location_geojson').where('id', geojsonId);

      if (!geojson.length) {
        throw new Error(`No geojson found with id: ${geojsonId}`);
      }

      await database('buffer_geojson')
        .insert({
          data: bufferData,
          geojson_id: geojsonId,
        })
        .onConflict('geojson_id')
        .merge();

      response.status(200).json({
        status: 'success',
        message: `Geometry saved and associated with location data id: ${geojsonId}!`,
        data: bufferData,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        error: `Internal Server Error: ${error}`,
        detail: error.detail,
      });
    }
  },
);

module.exports = router;
