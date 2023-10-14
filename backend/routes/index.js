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
// worthwhile exploration as rendering geojson is much faster than
// looping over json and rendering markers
// and is faster than converting json to geojson client side.
router.get('/api/v1/geojson', (request, response) => {
  database('geojson')
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
// downsides: have to map over data to render markers || have to format as geojson client sides
router.get('/api/v1/geolocation-data', (request, response) => {
  database('geolocationData')
    .select()
    .then((geolocationData) => {
      response.status(200).json(geolocationData);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: `Internal Server Error: ${error}` });
    });
});

router.post('/api/v1/geojson/:id/buffer-geom', async (request, response) => {
  try {
    // await database('bufferData').del(); // maybe? idk. upsert? perhaps?

    const geojsonId = request.params.id;
    const bufferData = request.body;
    const geojson = await database('geojson').where('id', geojsonId);

    if (!geojson.length) {
      throw new Error(`No geojson found with id: ${geojsonId}`);
    }

    await database('bufferData').insert({
      data: bufferData,
      geojson_id: geojsonId,
    });

    response.status(201).json({
      status: 'success',
      message: `Buffer data successfully created and associated with geojson id: ${geojsonId}!`,
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error}`, detail: error.detail });
  }
});

module.exports = router;
