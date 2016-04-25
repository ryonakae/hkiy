# HKIY

**Hayaku Kaette Ika Yaritee.**

## 準備
nodeのパッケージをインストール

```
$ npm install
```

PostgreSQLの準備
```
# インストール
$ brew install postgresql

# 初期化
$ initdb /usr/local/var/postgres -E utf8

# PostgreSQL起動
$ pg_ctl start

# PostgreSQL停止
$ pg_ctl stop

# ステータス確認
$ pg_ctl status

# HerokuからデータベースをPullする
# まずはheroku-toolbeltをインストールする
$ brew install heroku-toolbelt

# ログインする
$ heroku login

# 環境変数確認する
$ heroku config --app hkiy

# HerokuのDBをローカルにPull
$ heroku pg:pull DATABASE_URL mylocaldb --app hkiy
```

## 開発する
サーバー起動
```
$ npm start
```

別ウインドウ立ち上げて、JSのWatchify
```
$ npm run watch
```

## 本番用のJSのビルド
BrowserifyとUglifyする
```
$ npm run build:prod
```

## 本番にデプロイ
Herokuをリモートに追加
```
$ heroku git:remote -a hkiy
```

`master`をデプロイ
```
$ git push heroku master
```