const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http2 = require('node:http2');
const {HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND} = http2.constants;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const {PORT = 3000} = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

function errorHandler (err, req, res, next) {
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({message: `Произошла ошибка: ${err.message}`})
}

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '643c00324990cc97aad60e3d'
  };
  next();
})
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res)=> {res.status(HTTP_STATUS_NOT_FOUND).send({message: 'Страница не найдена'})});
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})
