const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID
const morgan = require('morgan');
require('dotenv').config();

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4qdym.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookings = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);

  app.post('/adminForm', (req, res) =>{
      const event = req.body;
      bookings.insertOne(event)
      .then(result => {
      res.send(result.insertedCount>0)
    })
  })
  app.post("/content", (req, res) => {
      const newBooking = req.body;
      bookings.insertOne(newBooking)
      .then((result) => {
      res.send(result.insertedCount>0);
    })
  })
  app.get('/event',(req, res)=>{
      const ami = req.query.email;
      bookings.find({email: ami})
      .toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.get('/admin',(req,res)=>{
      bookings.find({})
      .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  app.delete('/admin/:id', (req, res) =>{
    bookings.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
    res.send(result)
  })
})
  app.delete('/task/:id', (req, res) =>{
      bookings.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
      res.send(result)
    })
  })
});

app.listen(process.env.PORT || port);
