'use strict';
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.set('port', (process.env.PORT || port));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'HKIY',
    description: 'Hayaku Kaette Ika Yaritee'
  });
});

app.listen(app.get('port'), error => {
  if (error) {
    console.error(error);
  } else {
    console.info('listen:', app.get('port'));
  }
});