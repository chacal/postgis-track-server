# postgis-track-server
Node app to serve GPS tracks from PostGIS DB as GeoJSON

Installation:
  1. `npm install`
  1. Set environment variables
      1. `DB_HOST` (default `localhost`)
      1. `DB_PORT` (default `5432`)
      1. `DB_NAME` (default `signalk`)
      1. `DB_USER` (default `postgres`)
      1. `DB_PASSWD` (default empty)
      1. `BASIC_AUTH_PASSWD` (default empty -> no authentication. If set, only basic auth passwd is verified, username doesn't matter)
  1. `npm start`
