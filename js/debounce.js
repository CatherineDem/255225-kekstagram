/* Debounce */
'use strict';
var DEBOUNCE_INTERVAL = 500; // ms
var lastTimeout;

var debounce = function (fun) {
    if (lastTimeout > 0) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

module.exports = debounce;
