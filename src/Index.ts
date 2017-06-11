import * as express from 'express'
import cors = require('cors')
import {queryDailyTracks} from './Db'

const app = express()
app.use(cors())


app.get('/daily-tracks', (req, res, next) => {
  const bbox = req.query.bbox.split(",")

  queryDailyTracks(bbox)
    .then(tracks => res.json(tracks))
    .catch(next)
})


app.listen(7000, () => console.log('Listening on port 7000'))

