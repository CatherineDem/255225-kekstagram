'use strict';

window.errorHandler = (function (id, element, errmess) {
  var errMessageTemplate = document.querySelector('#error-message').content;
  var errMessageElement = errMessageTemplate.cloneNode(true);
  errMessageElement.querySelector('.err-message').id = id;
  errMessageElement.querySelector('.err-message').textContent = errmess;
  element.insertAdjacentElement('afterend', errMessageElement.querySelector('.err-message'));
});
