suite('fileTypeIconのテスト', function() {
  'use strict';

  var LOADING_WAIT = 300;

  setup(function() {
    document.body.innerHTML = __html__['test/test.html'];
  });

  teardown(function() {
    document.body.innerHTML = '';
  });

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
});
