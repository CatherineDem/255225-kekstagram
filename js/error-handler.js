'use strict';

window.errorHandler = (function () {
  var errMessageTemplate = document.querySelector('#error-message').content;
  var createErrMessage = function (id, element, errmess) {
    var errMessageElement = errMessageTemplate.cloneNode(true);
    errMessageElement.querySelector('.err-message').id = id;
    errMessageElement.querySelector('.err-message').textContent = errmess;
    element.insertAdjacentElement('afterEnd', errMessageElement.firstElementChild);
  };
  return {
    createErrMessage: createErrMessage
  };
})();
