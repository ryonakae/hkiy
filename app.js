'use strict';
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const bodyParser = require('body-parser');

const _port = 3000;

app.set('port', (process.env.PORT || _port));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({extended: true}));

// get /
app.get('/', (req, res) => {
  // PostgreSQLに接続
  const connectionString = process.env.DATABASE_URL || 'tcp://localhost:5432/mylocaldb';
  pg.connect(connectionString, (error, client, done) => {
    const _queryCmd = 'select * from tweet_count order by id desc offset 0 limit 1;';
    const _query = client.query(_queryCmd);
    const _rows = [];

    _query.on('row', (row) => {
      _rows.push(row);
    });

    _query.on('end', (row, err) => {
      res.render('index', {
        title: 'HKIY',
        description: 'Hayaku Kaette Ika Yaritee',
        id: _rows[0].id
      });
    });
  });
});

// post /
app.post('/post', (req, res) => {
  if(req){
    console.log(req.body);

    // responseをjsonで返す
    const response = {
      status  : 200,
      message : 'Post Success'
    };
    res.end(JSON.stringify(response));
  }
});

app.listen(app.get('port'), (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('listen:', app.get('port'));
  }
});