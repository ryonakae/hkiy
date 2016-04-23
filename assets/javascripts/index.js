'use strict';

window.jQuery = window.$ = require('jquery');
const velocity = require('velocity-animate');
import {TumblrImager} from './lib/tumblr_background_imager.js';

(() => {
  let $button;
  let $count;
  let $ordinal;
  let _countNum;

  const init = () => {
    $button = document.querySelector('#js-button');
    $count = document.querySelector('#js-count');
    $ordinal = document.querySelector('#js-ordinal');

    checkOrdinal(parseInt($count.innerText));

    jQuery($button).on('click.postData', () => {
      postData('/post', {'text': 'hoge'});
    });

    TumblrImager.init({
      json: tumblr_api_read,
      containerSelector: '#js-background'
    });
  };

  const postData = (_url, _data) => {
    console.log('post:', _url, _data);

    jQuery.ajax({
      type: 'POST',
      url: _url,
      data: _data,
      success: (res) => {
        if (res.status === 200) {
          console.log('success:', res);

          incrementCount();
          jQuery($button).off('.postData');
          checkOrdinal(_countNum);
        }
      },
    });
  };

  const incrementCount = () => {
    // $count内の文字列を整数に変換、1を足す
    _countNum = parseInt($count.innerText) + 1;
    // $count内の数字を1つ増やす
    $count.innerText = _countNum;
  };

  const checkOrdinal = (_num) => {
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

  document.addEventListener('DOMContentLoaded', init, false);
})();