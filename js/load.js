/* Load */
'use strict';
var errorHandler = require('./error-handler.js');
var load = function (url, onLoad) {
  var elementForError = document.querySelector('.errors');
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
    } else {
      errorHandler('#loadError', elementForError, 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
    }
  });
  xhr.addEventListener('error', function () {
    errorHandler('#loadError', elementForError, 'Произошла ошибка соединения');
  });
  xhr.addEventListener('timeout', function () {
    errorHandler('#loadError', elementForError, 'Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });
  xhr.timeout = 10000;
  xhr.open('GET', url);
  xhr.send();
};

module.exports = load;
