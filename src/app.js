import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import xml from 'xml';
import covid19ImpactEstimator from './estimator';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'access.log');

app.use(helmet());

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(filePath, { flags: 'a' });

app.use(
  morgan(':method   :url    :status   :response-time    ms \n', {
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
      res.send(data);
    });
  } catch (error) {
    res.sendStatus(500).send({ error: 'something went wrong on the server' });
  }
});

app.post('/api/v1/on-covid-19/:fomart?', (req, res) => {
  const { fomart } = req.params;
  const { data } = req.body;
  const result = covid19ImpactEstimator(data);

  if (fomart === 'xml') {
    res.set('Content-Type', 'text/xml');
    return res.send(xml(result));
  }
  return res.status(200).send({
    message: 'You will get a response in json',
    data: result
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port: ${port}`);
});
