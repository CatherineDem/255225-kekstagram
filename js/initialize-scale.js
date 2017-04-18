'use strict';

window.initializeScale = (function () {
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var scaleControll = document.querySelector('.upload-resize-controls');
  var scaleDecBtn = scaleControll.querySelector('.upload-resize-controls-button-dec');
  var scaleIncBtn = scaleControll.querySelector('.upload-resize-controls-button-inc');
  var scaleBtns = scaleControll.querySelectorAll('.upload-resize-controls-button');
  var scale = scaleControll.querySelector('.upload-resize-controls-value');
  var scaleValidityResult = true;
  var callBack = '';
  var onScaleBtnsClick = function (evt) {
    evt.preventDefault();
    scaleImg(evt, callBack);
  };
  var onScaleKeyup = function () {
    scaleValidity(scale.value);
  };
  var initializeScaleControll = function (cb) {
    callBack = cb;
    scaleBtns.forEach(function (el) {
      el.addEventListener('click', onScaleBtnsClick);
    });
    scale.addEventListener('keyup', onScaleKeyup);
  };
  var deactivateScaleControll = function () {
    scaleBtns.forEach(function (el) {
      el.removeEventListener('click', onScaleBtnsClick);
    });
    scale.removeEventListener('keyup', onScaleKeyup);
  };
  var scaleImg = function (evt, cb) {
    var currentScale = parseInt(scale.value, 10);
    if (evt.currentTarget === scaleDecBtn) {
      if (currentScale > SCALE_MAX) {
        scale.value = SCALE_MAX;
      } else if ((currentScale % SCALE_STEP !== 0) && (currentScale > SCALE_MIN) && (currentScale < SCALE_MAX)) {
        scale.value = (parseInt(currentScale / SCALE_STEP, 10)) * SCALE_STEP;
      } else {
        scale.value = (currentScale - SCALE_STEP < SCALE_MIN) ? SCALE_MIN : currentScale - SCALE_STEP;
      }
    } else if (evt.currentTarget === scaleIncBtn) {
      if (currentScale < SCALE_MIN) {
        scale.value = SCALE_MIN;
      } else if ((currentScale % SCALE_STEP !== 0) && (currentScale > SCALE_MIN) && (currentScale < SCALE_MAX)) {
        scale.value = (parseInt(currentScale / SCALE_STEP, 10) + 1) * SCALE_STEP;
      } else {
        scale.value = (currentScale + SCALE_STEP > SCALE_MAX) ? SCALE_MAX : currentScale + SCALE_STEP;
      }
    }
    if (scaleValidity(scale.value + '%')) {
      cb(scale.value);
    }
    scale.value += '%';
  };
  var scaleValidity = function (scaleValue) {
    var result = false;
    var pattern = /^\d{2,3}%$/;
    if (pattern.test(scaleValue) === true) {
      result = ((parseInt(scaleValue, 10) >= SCALE_MIN) && (parseInt(scaleValue, 10) <= SCALE_MAX) && !(parseInt(scaleValue, 10) % SCALE_STEP));
    }
    scaleValidityResult = result;
    if (!scaleValidityResult) {
      if (!scaleControll.querySelector('#scaleErrMsg')) {
        window.errorHandler.createErrMessage('scaleErrMsg', scaleIncBtn, 'Масштаб задан неверно: минимум 25%, максимум 100% с шагом в 25%');
        scale.style.outline = '2px solid red';
      } else {
        scaleControll.querySelector('#scaleErrMsg').classList.remove('invisible');
        scale.style.outline = 'none';
      }
    } else {
      if (scaleControll.querySelector('#scaleErrMsg')) {
        scaleControll.querySelector('#scaleErrMsg').classList.add('invisible');
        scale.style.outline = 'none';
      }
    }
    return result;
  };
  var resetScaleControll = function () {
    scale.value = SCALE_MAX + '%';
    scale.style.outline = 'none';
  };
  return {
    initializeScaleControll: initializeScaleControll,
    deactivateScaleControll: deactivateScaleControll,
    resetScaleControll: resetScaleControll,
    scaleValidityResult: scaleValidityResult,
    scaleValidity: scaleValidity
  };
})();
