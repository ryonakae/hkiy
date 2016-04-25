'use strict';

window.jQuery = window.$ = require('jquery');
import {TumblrImager} from './lib/tumblr_background_imager.js';

(() => {
  let $button;
  let $count;
  let $ordinal;

  const init = () => {
    $button = document.getElementById('js-button');
    $count = document.getElementById('js-count');
    $ordinal = document.getElementById('js-ordinal');

    checkOrdinal(parseInt($count.innerText));

    jQuery($button).on('click.postData', () => {
      jQuery($button).off('.postData');
      $button.classList.add('is-disable');
      postData('/post', {});
    });

    TumblrImager.init({
      json: tumblr_api_read,
      containerSelector: '#js-background'
    });
  };

  const postData = (_url, _data) => {
    // console.log('post:', _url, _data);

    jQuery.ajax({
      type: 'POST',
      url: _url,
      data: _data,
      async: false,
      success: (res) => {
        if (res.status === 200) {
          // console.log('success:', res);

          // incrementCount();
          checkOrdinal(parseInt($count.innerText));
          tweetPopup();
        }
      },
    });
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
  };

  const tweetPopup = () => {
    const url = 'https://twitter.com/intent/tweet?text=早く帰ってイカやりてぇ%20%28You%20are%20the%20' + $count.innerText + $ordinal.innerText + '%20%23HKIY%29&url=http://hkiy.herokuapp.com/';
    // console.log(url);
    window.open(url, 'tweetPopup', 'width=500, height=400, menubar=no, toolbar=no, location=no, status=no');
  };

  document.addEventListener('DOMContentLoaded', init, false);
})();