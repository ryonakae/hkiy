(function(){
  var $button;
  var $count;

  function init(){
    $button = document.querySelector('#js-button');
    $count = document.querySelector('#js-count');

    $button.addEventListener('click', function(){
      onClick('/post', {'text': 'hoge'});
    }, false);
  };

  function onClick(_url, _data){
    postData(_url, _data);
  };

  function postData(_url, _data){
    console.log('post');

    $.ajax({
      type: 'POST',
      url: _url,
      data: _data,
      success: function(res){
        console.log('success', res, res.status);
        incrementCount();
      },
    });
  };

  function incrementCount(){
    // $count内の文字列を整数に変換
    var _num = parseInt($count.innerText);
    // $count内の数字を1つ増やす
    $count.innerText = _num +1;
  };

  document.addEventListener('DOMContentLoaded', init, false);
})();