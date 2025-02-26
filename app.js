//const createError = require('http-errors');
//const express = require('express');
//const bodyParser = require ('body-parser');
//const logger = require ('morgan');
//const cors = require ('./config/cors.js');
//const mock = require ('./components/mock/mock.js');
import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from './config/cors.js';
import mock from './components/mock/mock.js';



const app = express();

app.use(logger('dev'));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', mock.api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
