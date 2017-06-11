import {IDatabase, IMain} from 'pg-promise'
import * as PgPromise from 'pg-promise'
const GeoLib = require('geolib')

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'signalk',
  user: process.env.DB_USER || 'jihartik',
  password: process.env.DB_PASSWD
}

const pgp: IMain = PgPromise()
const db: IDatabase<any> = pgp(dbConfig)

export function queryDailyTracks(bbox: number[]) {
  const tolerance = GeoLib.getDistance([bbox[0], bbox[1]], [bbox[2], bbox[3]]) / 1000000000 * 3

  //language=PostgreSQL
  const query = `SELECT
      date, 
      ST_AsGeoJSON(ST_Simplify(St_MakeLine(point::geometry ORDER BY timestamp), ${tolerance}))::json AS route
		FROM (
      SELECT
        date_trunc('day', timestamp) as date, 
        point, 
        timestamp
      FROM
        track
      WHERE point && ST_MakeEnvelope($1, $2, $3, $4)
      ORDER BY timestamp ASC
    ) data 
    GROUP BY date`

  return db.any(query, bbox)
}
