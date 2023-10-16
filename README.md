# Project Canary

Find this app deployed on [Netlify](https://projcanarrrr.netlify.app/) (runs slowly, be nice to heroku postgres).

Also, please note: tradeoffs were made in the interest of time! I look forward to chatting about these.

## Overview

Project Canary is a mapping coding exercise that aims to plot the locations of each record in a `data.csv` file on a map and save a coverage polygon. The project consists of both a frontend and a backend.

### Setup

#### Prerequisites

- Postgres + psql CLI
- Create the database:

```
$ psql
hughmorrison=# CREATE DATABASE projectcanary;
```

- Knex (`npm i -g knex`)
- Node 18.7.0
- A Mapbox API key

#### .env

Create a `.env` file in the frontend directory with the following variables:

```
VITE_MAPBOX_API_KEY='yourkeyhere'
```

This will be used to render the map layers.

#### Configuration steps

Run `npm install` and then `npm start` in the root directory, which will concurrently install the dependencies in the frontend and backend repos and start both servers.

Alternatively, you can run the backend and frontend servers separately in separate terminals:

```
1. Navigate to the `frontend` directory.
2. Install the required packages using `npm install`.
3. Start the development server using `npm run dev`.
```

```
1. Navigate to the `backend` directory.
2. Install the required packages using `npm install`.
3. Start the server using `npm start`.
```

## Backend

The backend is written in Node.js and uses Express for the server. For a database it uses Postgres with PostGIS and Knex as an ORM.


#### A few notes on DB setup:
We'll have to migrate and seed the database using `knex` cli commands like so:

`knex migrate:latest`
`knex seed:run`

The seed script will parse the csv and insert the data into the database as geojson objects.

#### API endpoints

```
GET /api/v1/location-geojson
-- Serves all of location data as a geojson object.

GET /api/v1/location-geojson/:id/buffer-geom
-- Serves the buffer geometry for a specific location geojson layer.

POST /api/v1/location-geojson/:id/buffer-geom
-- Creates buffer geometry that is associated with a specific location geojson layer.

```

## Frontend

The frontend is built using React, TypeScript, and Vite.

## Requirements

- Plot the locations of each record in `data.csv` on a map.
- Each point should have a visual indicator of the value.
- Dropdown to choose between Ethane (C2H6) and Methane (Ch4).
- Use React map gl for the front end mapping visualization.
- Input field to set a buffer (in meters) around each point.
- Save the geometry to a database table with a timestamp, buffer size, and geom column.

[View Full Requirements](https://github.com/hmorri32/project-canary/blob/main/REQUIREMENTS.md)
