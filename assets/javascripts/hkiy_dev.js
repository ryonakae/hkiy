'use strict';

window.jQuery = window.$ = require('jquery');
import {TumblrImager} from './lib/tumblr_background_imager.js';
import Cookies from 'js-cookie';

(() => {
  // variables
  let $button;
  let $count;
  let $ordinal;


  // debug
  // ビルド前にコメントアウトすること
  // debug();


  // ページ読み込み時にinit関数を実行するで
  document.addEventListener('DOMContentLoaded', init, false);


  // 読み込み時に実行する処理
  function init() {
    $button = document.getElementById('js-button');
    $count = document.getElementById('js-count');
    $ordinal = document.getElementById('js-ordinal');

    checkOrdinal(parseInt($count.innerText));

    initTumblrImager();

    initButton();
  }


  // Tumblr背景をセットアップ・実行
  function initTumblrImager() {
    TumblrImager.init({
      json: tumblr_api_read,
      containerSelector: '#js-background'
    });
  }


  // HKIYボタンの初期化
  function initButton() {
    // クッキーの有無をチェック
    // クッキーがある -> ボタンをdisableにする
    if (Cookies.get('hkiy') !== undefined) {
      $button.classList.add('is-disable');
      // ボタンの文言変更
      $button.innerHTML = 'Button will be reset the next day.';
    }
    // クッキーがない -> ボタンにクリックイベントをバインド
    // クリックしたらデータ送信&ボタンをdisableにする
    else {
      $button.addEventListener('click', ()=>{
        onButtonClick();
        $button.removeEventListener('click', onButtonClick, false);
      }, false);
    }
  }

  function onButtonClick() {
    $button.classList.add('is-disable');
    postData('/post', {});
  }


  // データをDBにpostする用関数
  function postData(_url, _data) {
    // console.log('post:', _url, _data);

    $.ajax({
      type: 'POST',
      url: _url,
      data: _data,
      async: false,
      success: (res) => {
        if (res.status === 200) {
          // console.log('success:', res);
          // incrementCount();

          // クッキーをセットする
          // expiresは、次の日の0時
          const _d = new Date();
          const next0Oclock = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate()+1, 0, 0, 0);
          Cookies.set('hkiy', 'true', {expires: next0Oclock});

          // ボタンの文言変更
          $button.innerHTML = 'Button will be reset the next day.';

          checkOrdinal(parseInt($count.innerText));
          tweetPopup();
        }
      },
    });
  }


  // 数字の序数をチェックする関数
  function checkOrdinal(_num) {
    const _onePlace = _num % 10; // 一の位
    const _tenPlace = Math.floor(_num % 100 / 10); // 十の位

    // 数字によって序数を変える
    // 11とか111のときは11stじゃなくて11thになるから
    // 1の位が1で、かつ十の位が1
    if (_onePlace === 1 && _tenPlace !== 1) {
      $ordinal.innerText = 'st';
    }
    // 1の位が2で、かつ十の位が1
    else if (_onePlace === 2 && _tenPlace !== 1) {
      $ordinal.innerText = 'nd';
    }
    // 1の位が3で、かつ十の位が1
    else if (_onePlace === 3 && _tenPlace !== 1) {
      $ordinal.innerText = 'rd';
    }
    // それ以外
    else {
      $ordinal.innerText = 'th';
    }
  }


  function tweetPopup() {
    const url = 'https://twitter.com/intent/tweet?text=早く帰ってイカやりてぇ%20%28You%20are%20the%20' + $count.innerText + $ordinal.innerText + '%20%23HKIY%29&url=http://hkiy.herokuapp.com/';
    window.open(url, 'tweetPopup', 'width=500, height=400, menubar=no, toolbar=no, location=no, status=no');
  }


  // デバッグ用関数
  function debug() {
    Cookies.remove('hkiy');
  }
})();