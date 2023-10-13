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

router.get('/api/v1/geolocationData', (request, response) => {
  database('geolocationData')
    .select()
    .then((geolocationData) => {
      response.status(200).json(geolocationData);
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({ error });
    });
});

router.post('/api/v1/geolocationData', (request, response) => {
  const geolocationData = request.body;

  for (let requiredParameter of ['latitude', 'longitude', 'date', 'time']) {
    if (!geolocationData[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { latitude: <String>, longitude: <String>, date: <String>, time: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }

    database('geolocationData')
      .insert(geolocationData, 'id')
      .then((geolocationData) => {
        response.status(201).json({ id: geolocationData[0] });
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
  }
});

module.exports = router;
