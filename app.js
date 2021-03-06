'use strict';

import express from 'express';
const app = express();
import path from 'path';
import pg from 'pg';
import bodyParser from 'body-parser';
import stylus from 'stylus';
import koutoSwiss from 'kouto-swiss';
import autoprefixer from 'autoprefixer-stylus';
import uaParser from 'ua-parser-js';
import moment from 'moment';

const _port = 3000;
const _connectionString = process.env.DATABASE_URL || 'tcp://localhost:5432/mylocaldb';
let _queryCmd;
let _query;

app.set('port', (process.env.PORT || _port));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(stylus.middleware({
  src: path.join(__dirname, 'assets'),
  compile: (str, path) => {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(koutoSwiss())
      .use(autoprefixer({ browsers: ['last 2 versions'] }))
    ;
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'assets'))); // 設定の一番最後に書く

// get /
app.get('/', (req, res) => {
  // ua見る
  const parser = new uaParser();
  const requestHeader = req.headers['user-agent'];
  const ua = parser.setUA(requestHeader).getResult();
  // console.log(ua.device.type);

  // PostgreSQLに接続
  pg.connect(_connectionString, (error, client, done) => {
    _queryCmd = 'select * from tweet_count order by id desc offset 0 limit 1;';
    _query = client.query(_queryCmd);
    const _rows = [];

    _query.on('row', (row) => {
      _rows.push(row);
    });

    _query.on('end', (row, err) => {
      res.render('index', {
        title: 'HKIY',
        description: 'Hayaku Kaette Ika Yaritee',
        url: 'http://hkiy.herokuapp.com',
        id: _rows[0].id,
        ua: ua.device.type
      });
      done();
    });
  });
});

// post /
app.post('/post', (req, res) => {
  if(req){
    // console.log(req.body);

    // PostgreSQLに接続
    pg.connect(_connectionString, (error, client, done) => {
      const date = moment().format('YYYY-MM-DD');
      const time = moment().format('HH:mm:ss');
      // console.log(date, time);
      // 新しいデータ入れて、一番古いデータを消す
      _queryCmd = 'INSERT INTO tweet_count (date, time) values (' + "'" + date + "'" + ',' + "'" + time + "'" + ');' + 'delete from tweet_count where id = (select min(id) from tweet_count);';
      _query = client.query(_queryCmd, (error, result) => {
        done();
      });
    });

    // responseをjsonで返す
    const response = {
      status  : 200,
      message : 'Post Success'
    };
    res.json(response);
  }
});

app.listen(app.get('port'), (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('listen:', app.get('port'));
  }
});