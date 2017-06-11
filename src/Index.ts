import * as express from 'express'
import cors = require('cors')
import {queryDailyTracks} from './Db'

const MOUNT_PREFIX = process.env.MOUNT_PREFIX || ''

const app = express()
app.use(cors())


app.get(MOUNT_PREFIX + '/daily-tracks/:vesselId', (req, res, next) => {
  const bbox = req.query.bbox.split(",")

  queryDailyTracks(bbox, req.params.vesselId)
    .then(tracks => res.json(tracks))
    .catch(next)
})


app.listen(7000, () => console.log('Listening on port 7000'))

