/* ErrorHandler */
'use strict';
var errorHandler = (function (id, element, errmess) {
  var errMessageTemplate = document.querySelector('#error-message').content;
  var errMessageElement = errMessageTemplate.cloneNode(true);
  var errMessage = errMessageElement.querySelector('.err-message');
  errMessage.id = id;
  errMessage.textContent = errmess;
  element.insertAdjacentElement('afterend', errMessage);
});

module.exports = errorHandler;
