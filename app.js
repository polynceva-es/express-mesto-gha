const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const {PORT = 3000} = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

function errorHandler (err, req, res, next) {
  res.status(500).send({message: `Произошла ошибка: ${err.message}`})
}


app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
