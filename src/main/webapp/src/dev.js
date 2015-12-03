global.jQuery = require('jquery');
global.$ = global.jQuery;
require('./jquery.file-type-icon');

$view = $('#view');
$('#file').on('change', function() {
  var files = $(this).get(0).files;
  // 複数選択はしない
  var file = files[0];
  $view.fileTypeIcon({
    file: file, imageSize: {
      width: 32,
      height: 64
    }
  });
});
