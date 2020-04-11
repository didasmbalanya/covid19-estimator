import express from 'express';
import helmet from 'helmet';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());

app.get('/route/:json', (req, res) => {
  res.send('hey ho route');
});
app.get('/route1/:json', (req, res) => {
  res.send('hey hi route 1');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port: ${port}`);
});
