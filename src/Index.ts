import * as express from 'express'
import cors = require('cors')
import {queryDailyTracks, queryTrackStatistics} from './Db'
import authenticate from './Auth'

const MOUNT_PREFIX = process.env.MOUNT_PREFIX || ''
const BASIC_AUTH_PASSWD = process.env.BASIC_AUTH_PASSWD

const app = express()
app.use(cors())
app.use(authenticate(BASIC_AUTH_PASSWD))


app.get(MOUNT_PREFIX + '/:vesselId/daily-tracks', (req, res, next) => {
  const bbox = req.query.bbox.split(",")

  queryDailyTracks(bbox,
    req.params.vesselId,
    req.query['track-count'],
    req.query['start-time'] ? new Date(req.query['start-time']) : undefined,
    req.query['end-time'] ? new Date(req.query['end-time']) : undefined)
    .then(tracks => res.json(tracks))
    .catch(next)
})

app.get(MOUNT_PREFIX + '/:vesselId/track-statistics', (req, res, next) => {
  queryTrackStatistics(req.params.vesselId,
    req.query['start-time'] ? new Date(req.query['start-time']) : undefined,
    req.query['end-time'] ? new Date(req.query['end-time']) : undefined)
    .then(stats => res.json(stats))
    .catch(next)
})

app.listen(7000, () => console.log('Listening on port 7000'))
