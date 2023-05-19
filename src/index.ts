import express from 'express';
import { connectDB } from '@database';
import { CONSTANTS } from '@config/constants';

connectDB();

const port = CONSTANTS.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
