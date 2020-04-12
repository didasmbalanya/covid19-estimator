/* eslint-disable no-underscore-dangle */
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import covid19ImpactEstimator from './estimator';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'access.log');

app.use(helmet());

const accessLogStream = fs.createWriteStream(filePath, { flags: 'a' });

morgan.token('total-time', (req, res, digits) => {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return;
  }

  // time elapsed from request start
  const elapsed = process.hrtime(req._startAt);

  // cover to milliseconds
  const ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6);
  const time = ms.toFixed(digits === undefined ? 3 : digits);

  // return truncated value
  // eslint-disable-next-line consistent-return
  return time.toString().padStart(2, 0);
});

app.use(
  morgan(':method   :url    :status   :total-time[0]ms\n', {
    stream: accessLogStream
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to covid 19 estimator api' });
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  try {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;
      return res.set('Content-Type', 'text/plain').status(200).send(data);
    });
  } catch (error) {
    res.sendStatus(500).send({ error: 'something went wrong on the server' });
  }
});

app.post('/api/v1/on-covid-19/:fomart?', (req, res) => {
  const { fomart } = req.params;
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  } = req.body;

  const data = {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    population,
    totalHospitalBeds
  };

  try {
    const result = covid19ImpactEstimator(data);

    if (fomart && fomart.toLowerCase() === 'xml') {
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(result);

      res.set('Content-Type', 'application/xml');
      return res.status(200).send(xml);
    }
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({
      error: 'Something went wrong!'
    });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port: ${port}`);
});
