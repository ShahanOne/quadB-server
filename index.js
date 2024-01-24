require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
require('mongoose-type-url');
mongoose.set('strictQuery', false);
const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Connection
mongoose.connect(process.env.MONGODB_URI);

//Schema
const infoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

//Model
const Info = mongoose.model('Info', infoSchema);

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.entries(response.data).slice(0, 10);

    const dataArray = data.map(([key, value]) => ({ ...value, name: key }));

    {
      /*Called only once to store only 10 data */
    }
    // await Info.insertMany(dataArray);

    const dataFromDb = await Info.find({});

    res.json(dataFromDb);
    // res.json(Object.fromEntries(dataArray));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
