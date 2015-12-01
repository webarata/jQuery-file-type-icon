(function (factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('jquery'), window, document);
  } else {
    factory(jQuery, window, document);
  }
}(function ($, window, document, undefined) {
  'use strict';

  var _defaults = {
    initIcon: 'init.gif',
    initIconSize: {
      width: 32,
      height: 32
    },
    defaultIcon: 'default.png',
    imageDir: 'image/',
    classPrefix: 'fti-',
    imageSize: {
      width: 32,
      height: 32
    }
  };

  var _typeIcon = {};

  var _extType = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };

  $.fn.fileTypeIcon = function(options) {
    var settings = $.extend(_defaults, options);
    _initTypeIcon();

    // ファイルが指定されている場合にはそのタイプを優先する
    if (settings.file && settings.file.type) {
      settings.type = settings.file.type;
    }

    var $this = this;

    $this.css({
      width: settings.imageSize.width + 'px',
      height: settings.imageSize.height + 'px',
      overflow: 'hidden'
    });

    if (!$this.hasClass(settings.classPrefix + 'around')) {
      $this.addClass(settings.classPrefix + 'around');
    }
    if (settings.initIcon) {
      _appendInitIcon($this, settings);
    }
    _createFileIcon(settings).then(function($image) {
      $this.empty();
      $this.append($image);
    }, function() {
      console.log('reject');
    });
    return this;
  };

  var _initTypeIcon = function() {
    _typeIcon[_extType.pdf] = 'pdf-256.png';
    _typeIcon[_extType.doc] = 'word-256.png';
    _typeIcon[_extType.docx] = 'word-256.png';
    _typeIcon[_extType.xls] = 'excel-256.png';
    _typeIcon[_extType.xlsx] = 'excel-256.png';
    _typeIcon[_extType.ppt] = 'powerpoint-256.png';
    _typeIcon[_extType.pptx] = 'powerpoint-256.png';
  };

  var _appendInitIcon = function($this, settings) {
    var imageSize = settings.imageSize;
    var $image = $('<img src="' + settings.imageDir + settings.initIcon + '">');

    if (settings.initIconSize.width <= imageSize.width &&
      settings.initIconSize.height <= imageSize.height) {
      // 少なくとも画像サイズはimageSizeと同じか小さい
      var topSize = (imageSize.height - settings.initIconSize.height) / 2;
      var leftSize = (imageSize.width - settings.initIconSize.width) / 2;

      $image.css({
        position: 'relative',
        top: topSize + 'px',
        left: leftSize + 'px'
      });
      $this.empty();
      $this.append($image);
    }
  };

  var _createFileIcon = function(settings) {
    var dfd = $.Deferred();
    var innerDfd;

    if (settings.type && settings.type.match(/image\/\w+/)) {
      if (settings.file) {
        innerDfd = _createFileImage(settings);
      }
    } else {
      var icon = _typeIcon[settings.type] ? _typeIcon[settings.type] : settings.defaultIcon;
      innerDfd = _createImage(settings.imageDir + icon, settings);
    }

    if (innerDfd) {
      innerDfd.then(function($image) {
        dfd.resolve($image);
      }, function() {
        dfd.reject();
      });
    } else {
      dfd.reject();
    }

    return dfd.promise();
  };

  var _createFileImage = function(settings) {
    var dfd = $.Deferred();

    var reader = new FileReader();
    reader.onloadend = function() {
      _createImage(reader.result, settings).then(function($image) {
        dfd.resolve($image);
      }, function() {
        dfd.reject();
      });
    };
    reader.onerror = function() {
      dfd.reject();
    };

    reader.readAsDataURL(settings.file);

    return dfd.promise();
  };

  var _createImage = function(src, settings) {
    var dfd = $.Deferred();

    var image = new Image();
    var $image = $(image);
    // loadイベント後でないと、画像のサイズを取得できない場合がある。
    $image.one('load', function() {
      _adjustImage($image, image, settings);

      dfd.resolve($image);
    });
    $image.attr('src', src);

    return dfd.promise();
  };

  var _adjustImage = function($image, image, settings) {
    var imageSize = settings.imageSize;
    var natural = {
      width: image.naturalWidth,
      height: image.naturalHeight
    };
    var ratio = {
      width: imageSize.width / natural.width,
      height: imageSize.height / natural.height
    };
    var shorter = 'width';
    var longer = 'height';
    if (ratio.width > ratio.height) {
      shorter = 'height';
      longer = 'width';
    }

    // 比率が1より大きければそのまま表示
    if (ratio[shorter] >= 1) {
      ratio[shorter] = 1;
    }
    var longerDiff = (imageSize[longer] - natural[longer] * ratio[shorter]) / 2;

    var top, left;
    if (longer === 'height') {
      top = longerDiff;
    } else {
      left = longerDiff;
    }
    var shorterDiff = (imageSize[shorter] - natural[shorter] * ratio[shorter]) / 2;
    if (longer === 'height') {
      left = shorterDiff;
    } else {
      top = shorterDiff;
    }
    var adjustSize;
    if (natural[shorter] > imageSize[shorter]) {
      adjustSize = imageSize[shorter];
    }
    else {
      adjustSize = natural[shorter];
    }

    $image.css(shorter, adjustSize);
    $image.css('position', 'relative');
    $image.css('top', top + 'px');
    $image.css('left', left + 'px');

    // IEの場合
    // img要素に自動的にwidth、heightが指定されるため、明示的に指定する
    if (image.runtimeStyle) {
      var imageRuntime = image.runtimeStyle;
      imageRuntime.width = natural.width * ratio[shorter] + 'px';
      imageRuntime.height = natural.height * ratio[shorter] + 'px';
    }
  };
}));
