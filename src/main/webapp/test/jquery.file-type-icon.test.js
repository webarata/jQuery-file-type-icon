suite('fileTypeIconのテスト', function() {
  'use strict';

  var LOADING_WAIT = 300;

  var image5x5 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAFUlEQVQImWP8qNbynwENMKELUEEQAAzqAqQgfOn0AAAAAElFTkSuQmCC';
  var image5x10 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAKCAYAAAB8OZQwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAANUlEQVQImb3KsQ0AMAjEQJOGFZDYh03Yf4SnDunj8mSTJFYWEQLITKqK7saA63T3FwHOhq84/7oJuc1lHdcAAAAASUVORK5CYII='
  var image10x5 ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAFklEQVQImWNcraf3n4EIwESMogFWCACeHgIQqtJ9lgAAAABJRU5ErkJggg==';

  setup(function() {
    document.body.innerHTML = __html__['test/jquery.file-type-icon.test.html'];
  });

  teardown(function() {
    document.body.innerHTML = '';
  });

  function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try {
      var blob = new Blob([buffer.buffer], { type: 'image/png' });
    } catch (e) {
      return false;
    }
    return blob;
  }

  test('fileTypeIcon pdfのアイコン表示チェック', function(done) {
    $('#fixture').fileTypeIcon({
      type: 'application/pdf',
      imageDir: 'image/'
    });

    setTimeout(function() {
      var $image = $('#fixture').find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.attr('src'), 'image/pdf-256.png', 'pdfのアイコンが挿入されている');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon defalutアイコン表示チェック', function(done) {
    $('#fixture').fileTypeIcon({
      type: 'application/ignore',
      imageDir: 'image/'
    });

    setTimeout(function() {
      var $image = $('#fixture').find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.attr('src'), 'image/default.png', 'defaultのアイコンが挿入されている');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon fileとtype指定', function(done) {
    $('#fixture').fileTypeIcon({
      file: {},
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      imageDir: 'image/'
    });

    setTimeout(function() {
      var $image = $('#fixture').find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.attr('src'), 'image/word-256.png', 'Wordのアイコンが挿入されている');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon ファイルの変更 doc→pdf', function(done) {
    $('#fixture').fileTypeIcon({
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      imageDir: 'image/'
    });

    setTimeout(function() {
      var $fixture = $('#fixture');
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.attr('src'), 'image/word-256.png', 'Wordのアイコンが挿入されている');
      $fixture.fileTypeIcon({
        file: {},
        type: 'application/pdf',
        imageDir: 'image/'
      });
      setTimeout(function() {
        var $image = $('#fixture').find('img');
        assert.equal($image.length, 1, '画像が挿入されている');
        assert.equal($image.attr('src'), 'image/pdf-256.png', 'pdfのアイコンが挿入されている');
        done();
      }, LOADING_WAIT);
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 表示する要素のclass名の確認', function(done) {
    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      type: 'application/msword',
      imageDir: 'image/'
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.ok($fixture.hasClass('fti-around'), 'fti-around classが適用されている');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 表示する要素のclass名の確認', function(done) {
    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      type: 'application/msword',
      imageDir: 'image/',
      classPrefix: 'dummy-'
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.ok($fixture.hasClass('dummy-around'), 'dummy-around classが適用されている');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 縦長サイズの表示域での画像サイズチェック', function(done) {
    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      imageDir: 'image/',
      imageSize: {
        width: 64,
        height: 256
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '64px');
      assert.equal($image.css('height'), '64px');
      assert.equal($image.css('top'), '96px');
      assert.equal($image.css('left'), '0px');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 実ファイル（正方形）でのチェック', function(done) {
    var blob =  toBlob(image5x5);
    blob.type = 'image/png';

    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      file: blob,
      imageSize: {
        width: 5,
        height: 10
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '5px');
      assert.equal($image.css('height'), '5px');
      assert.equal($image.css('top'), '2px');
      assert.equal($image.css('left'), '0px');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 実ファイル（縦長）でのチェック 表示領域のサイズと同じ', function(done) {
    var blob =  toBlob(image5x10);
    blob.type = 'image/png';

    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      file: blob,
      imageSize: {
        width: 5,
        height: 10
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '5px');
      assert.equal($image.css('height'), '10px');
      assert.equal($image.css('top'), '0px');
      assert.equal($image.css('left'), '0px');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 実ファイル（縦長）でのチェック 横長の領域', function(done) {
    var blob =  toBlob(image5x10);
    blob.type = 'image/png';

    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      file: blob,
      imageSize: {
        width: 20,
        height: 10
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '5px');
      assert.equal($image.css('height'), '10px');
      assert.equal($image.css('top'), '0px');
      assert.equal($image.css('left'), '7px');
      done();
    }, LOADING_WAIT);
  });


  test('fileTypeIcon 実ファイル（縦長）でのチェック 横長の領域 拡大', function(done) {
    var blob =  toBlob(image5x10);
    blob.type = 'image/png';

    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      file: blob,
      imageSize: {
        width: 20,
        height: 20
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '5px');
      assert.equal($image.css('height'), '10px');
      assert.equal($image.css('top'), '5px');
      assert.equal($image.css('left'), '7px');
      done();
    }, LOADING_WAIT);
  });

  test('fileTypeIcon 実ファイル（横長）でのチェック 表示領域のサイズと同じ', function(done) {
    var blob =  toBlob(image10x5);
    blob.type = 'image/png';

    var $fixture = $('#fixture');
    $fixture.fileTypeIcon({
      file: blob,
      imageSize: {
        width: 10,
        height: 5
      }
    });

    setTimeout(function() {
      var $image = $fixture.find('img');
      assert.equal($image.length, 1, '画像が挿入されている');
      assert.equal($image.css('width'), '10px');
      assert.equal($image.css('height'), '5px');
      assert.equal($image.css('top'), '0px');
      assert.equal($image.css('left'), '0px');
      done();
    }, LOADING_WAIT);
  });
});
