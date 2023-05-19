import 'module-alias/register';

import express from 'express';
import { connectDB } from '@utils/database';
import { CONSTANTS } from '@config/constants';
import { enumeratorRouter } from '@routes/enumerator';
import { adminRouter } from '@routes/admin';

connectDB();

const port = CONSTANTS.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/enumerator', enumeratorRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
