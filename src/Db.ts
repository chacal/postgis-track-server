import {IDatabase, IMain} from 'pg-promise'
import * as PgPromise from 'pg-promise'
import R = require('ramda')
const GeoLib = require('geolib')

const minDate = new Date(0);
const maxDate = new Date('2050-01-01');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'signalk',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWD
}

const pgp: IMain = PgPromise()
const db: IDatabase<any> = pgp(dbConfig)

export function queryDailyTracks(bbox: number[], vesselId: string, trackCount: number = Number.MAX_SAFE_INTEGER, startTime: Date = minDate, endTime: Date = maxDate) {
  const tolerance = GeoLib.getDistance([bbox[0], bbox[1]], [bbox[2], bbox[3]]) / 1000000000 * 3

  //language=PostgreSQL
  const query = `
    WITH daily_tracks_descending AS (
      SELECT
        date,
        ST_AsGeoJSON(ST_Simplify(St_MakeLine(point::geometry ORDER BY timestamp), $9))::json AS route
      FROM (
        SELECT
          date_trunc('day', timestamp) as date,
          point,
          timestamp
        FROM
          track
        WHERE
          point && ST_MakeEnvelope($1, $2, $3, $4) AND
          vessel_id = $5 AND
          timestamp >= timestamp with time zone $6 AND
          timestamp <= timestamp with time zone $7
        ORDER BY timestamp ASC
      ) data
      GROUP BY date
      ORDER BY date DESC
      LIMIT $8      
    )
    SELECT * FROM daily_tracks_descending ORDER BY date;
`

  return db.any(query, R.flatten<string|number|Date>([bbox, vesselId, startTime, endTime, trackCount, tolerance]))
}
