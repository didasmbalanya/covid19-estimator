import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan(':method :url :status :response-time ms'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Welcome to covid 19 estimator api' });
});

app.get('/api/v1/on-covid-19/:fomart?', (req, res) => {
  const { fomart } = req.params;
  if (fomart === 'xml') {
    // res.setHeader('Content-Type', 'xml');
    return res
      .status(200)
      .send({ message: `You will get a response in ${fomart}` });
  }
  return res.status(200).send({
    message: 'You will get a response in json'
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port: ${port}`);
});
