'use strict';

window.initializeScale = (function (scaleElement, cb) {
  var scale = scaleElement.querySelector('input[type="text"]');
  var scaleDecBtn = scaleElement.querySelector('.upload-resize-controls-button-dec');
  var scaleIncBtn = scaleElement.querySelector('.upload-resize-controls-button-inc');
  var changeScale = function (evt) {
    if (evt.target.tagName === 'BUTTON') {
      var currentScale = parseInt(scale.value, 10);
      if (evt.target === scaleDecBtn) {
        if (currentScale > window.form.SCALE_MAX) {
          scale.value = window.form.SCALE_MAX;
        } else if ((currentScale % window.form.SCALE_STEP !== 0) && (currentScale > window.form.SCALE_MIN) && (currentScale < window.form.SCALE_MAX)) {
          scale.value = (parseInt(currentScale / window.form.SCALE_STEP, 10)) * window.form.SCALE_STEP;
        } else {
          scale.value = (currentScale - window.form.SCALE_STEP < window.form.SCALE_MIN) ? window.form.SCALE_MIN : currentScale - window.form.SCALE_STEP;
        }
      } else if (evt.target === scaleIncBtn) {
        if (currentScale < window.form.SCALE_MIN) {
          scale.value = window.form.SCALE_MIN;
        } else if ((currentScale % window.form.SCALE_STEP !== 0) && (currentScale > window.form.SCALE_MIN) && (currentScale < window.form.SCALE_MAX)) {
          scale.value = (parseInt(currentScale / window.form.SCALE_STEP, 10) + 1) * window.form.SCALE_STEP;
        } else {
          scale.value = (currentScale + window.form.SCALE_STEP > window.form.SCALE_MAX) ? window.form.SCALE_MAX : currentScale + window.form.SCALE_STEP;
        }
      }
      if (window.form.scaleValidity(scale.value + '%')) {
        cb(scale.value);
      }
      scale.value += '%';
    }
  };
  var onScaleBtnsClick = function (evt) {
    evt.preventDefault();
    changeScale(evt);
  };
  var onScaleKeyup = function () {
    window.form.scaleValidity(scaleElement.value);
  };
  scaleElement.addEventListener('click', onScaleBtnsClick);
  scale.addEventListener('keyup', onScaleKeyup);
});
