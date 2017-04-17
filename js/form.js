'use strict';

window.form = (function () {
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var ENTER_KEY = 13;
  var ESC_KEY = 27;
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.querySelector('.upload-image');
  var uploadFileName = uploadForm.querySelector('.upload-input');
  var uploadCancelBtn = uploadOverlay.querySelector('.upload-form-cancel');
  var uploadSubmitBtn = uploadOverlay.querySelector('.upload-form-submit');
  var uploadComment = uploadOverlay.querySelector('.upload-form-description');
  var scaleDecBtn = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  var scaleIncBtn = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  var scaleBtns = uploadOverlay.querySelectorAll('.upload-resize-controls-button');
  var scale = uploadOverlay.querySelector('.upload-resize-controls-value');
  var uploadImg = uploadOverlay.querySelector('.filter-image-preview');
  var filterBtns = uploadOverlay.querySelector('.upload-filter-controls');
  var errMessageTemplate = document.querySelector('#error-message').content;
  var commentValidityResult = false;
  var scaleValidityResult = true;
  var filterSliderBlock = filterBtns.querySelector('.upload-filter-level');
  var filterToggle = filterSliderBlock.querySelector('.upload-filter-level-pin');
  var filterLine = filterSliderBlock.querySelector('.upload-filter-level-line');
  var filterValue = filterSliderBlock.querySelector('.upload-filter-level-val');
  var toggleCoords = [];
  var shiftX = 0;
  var sliderCoords = [];
  var stepFilter = 1;
  var pointFilter = 1;
  var selectedFilter = '';
  var toggleMousemove = function (evt) {
    var newLeft = (evt.pageX - shiftX - sliderCoords.left);
    newLeft = Math.round(newLeft / (stepFilter * pointFilter) * stepFilter * pointFilter);
    if (newLeft < 0) {
      newLeft = 0;
    }
    var rightEdge = filterLine.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }
    var setValue = (Math.ceil(newLeft / pointFilter)) * stepFilter;
    switch (selectedFilter) {
      case 'chrome':
        setFilterToggle(0, 1, setValue, stepFilter, 'grayscale');
        break;
      case 'sepia':
        setFilterToggle(0, 1, setValue, stepFilter, 'sepia');
        break;
      case 'marvin':
        setFilterToggle(0, 100, setValue, stepFilter, 'invert');
        break;
      case 'phobos':
        setFilterToggle(0, 5, setValue, stepFilter, 'blur');
        break;
      case 'heat':
        setFilterToggle(0, 3, setValue, stepFilter, 'brightness');
        break;
    }
  };
  var toggleMousedown = function (evt) {
    evt.preventDefault();
    toggleCoords = getCoords(filterToggle);
    shiftX = evt.pageX - toggleCoords.left;
    sliderCoords = getCoords(filterSliderBlock);
    document.addEventListener('mousemove', toggleMousemove);
    return false;
  };
  var toggleMouseup = function () {
    document.removeEventListener('mousemove', toggleMousemove);
  };
  var filterToggleDragstart = function () {
    return false;
  };
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
  var setFilterToggle = function (minValue, maxValue, setValue, step, filterName) {
    stepFilter = step;
    pointFilter = (filterLine.offsetWidth / (maxValue - minValue)) * step;
    switch (filterName) {
      case 'grayscale':
      case 'sepia':
      case 'brightness':
        uploadImg.style.filter = filterName + '(' + setValue + ')';
        break;
      case 'invert':
        uploadImg.style.filter = filterName + '(' + setValue + '%)';
        break;
      case 'blur':
        uploadImg.style.filter = filterName + '(' + setValue + 'px)';
        break;
    }
    var filterSetValue = Math.round(setValue / step * pointFilter);
    filterSetValue = filterSetValue > filterLine.offsetWidth ? filterLine.offsetWidth : filterSetValue;
    filterToggle.style.left = filterSetValue + 'px';
    filterValue.style.width = filterSetValue + 'px';
  };
  var openUploadOverlay = function () {
    uploadForm.classList.add('invisible');
    uploadOverlay.classList.remove('invisible');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    filterBtns.addEventListener('click', filterImg);
    filterValue.style.width = '0';
    filterToggle.style.left = '0';
    scaleBtns.forEach(function (el) {
      el.addEventListener('click', onScaleBtnsClick);
    });
    scale.addEventListener('keyup', onScaleKeyup);
    filterSliderBlock.classList.add('invisible');
    filterToggle.addEventListener('mousedown', toggleMousedown);
    document.addEventListener('mouseup', toggleMouseup);
    filterToggle.addEventListener('dragstart', filterToggleDragstart);
    uploadComment.addEventListener('focus', onUploadCommentFocus);
    uploadComment.addEventListener('blur', onUploadCommentBlur);
    uploadComment.addEventListener('keyup', onUploadCommentKeyupOrChange);
    uploadComment.addEventListener('change', onUploadCommentKeyupOrChange);
    uploadCancelBtn.addEventListener('click', onUploadCancelBtnClick);
    uploadCancelBtn.addEventListener('keydown', onUploadCancelBtnEnterPress);
    uploadSubmitBtn.addEventListener('click', onUploadSubmit);
  };
  var closeUploadOverlay = function () {
    resetForm();
    uploadOverlay.classList.add('invisible');
    uploadForm.classList.remove('invisible');
    uploadFileName.value = '';
    document.removeEventListener('keydown', onUploadOverlayEscPress);
    filterBtns.removeEventListener('click', filterImg);
    scaleBtns.forEach(function (el) {
      el.removeEventListener('click', onScaleBtnsClick);
    });
    scale.removeEventListener('keyup', onScaleKeyup);
    filterToggle.removeEventListener('mousedown', toggleMousedown);
    document.removeEventListener('mouseup', toggleMouseup);
    filterToggle.removeEventListener('dragstart', filterToggleDragstart);
    uploadComment.removeEventListener('focus', onUploadCommentFocus);
    uploadComment.removeEventListener('blur', onUploadCommentBlur);
    uploadComment.removeEventListener('keyup', onUploadCommentKeyupOrChange);
    uploadComment.removeEventListener('change', onUploadCommentKeyupOrChange);
    uploadCancelBtn.removeEventListener('click', onUploadCancelBtnClick);
    uploadCancelBtn.removeEventListener('keydown', onUploadCancelBtnEnterPress);
    uploadSubmitBtn.removeEventListener('click', onUploadSubmit);
    window.gallery.pictures.forEach(function (el) {
      el.addEventListener('click', window.gallery.onPicturesClick);
    });
  };
  var commentValidity = function () {
    uploadComment.value = uploadComment.value.toString();
    commentValidityResult = (uploadComment.checkValidity() && (uploadComment.value.trim().length >= 30 && uploadComment.value.trim().length <= 100));
    if (commentValidityResult === false) {
      if (!uploadOverlay.querySelector('#commentErrMsg')) {
        createErrMessage('commentErrMsg', document.querySelector('.upload-form-description'), 'Длина комментария должна быть от 30 до 100 символов');
      } else {
        uploadOverlay.querySelector('#commentErrMsg').classList.remove('invisible');
      }
      uploadComment.style.borderColor = 'red';
      uploadSubmitBtn.disabled = true;
    } else {
      if (uploadOverlay.querySelector('#commentErrMsg')) {
        uploadOverlay.querySelector('#commentErrMsg').classList.add('invisible');
      }
      uploadComment.style.borderColor = uploadComment.checkValidity() === false ? 'red' : 'rgb(169, 169, 169)';
      uploadSubmitBtn.disabled = !scaleValidityResult;
    }
    return commentValidityResult;
  };
  var resetFilter = function () {
    var filtersCollection = [];
    for (var i = 0; i < uploadImg.classList.length; i++) {
      if (uploadImg.classList[i].indexOf('filter-') > -1) {
        filtersCollection.push(uploadImg.classList[i]);
      }
    }
    uploadImg.classList.remove(filtersCollection.join(' '));
    uploadImg.style.filter = '';
  };
  var resetScaleInputStyle = function () {
    uploadImg.style.transform = '';
    scale.style.outline = 'none';
  };
  var filterImg = function (evt) {
    if (evt.target.getAttribute('type') === 'radio') {
      resetFilter();
      selectedFilter = evt.target.value;
      if (selectedFilter !== 'none') {
        filterSliderBlock.classList.remove('invisible');
        uploadImg.classList.add('filter-' + selectedFilter);
        switch (selectedFilter) {
          case 'chrome':
            setFilterToggle(0, 1, 1, 0.01, 'grayscale');
            break;
          case 'sepia':
            setFilterToggle(0, 1, 1, 0.01, 'sepia');
            break;
          case 'marvin':
            setFilterToggle(0, 100, 100, 1, 'invert');
            break;
          case 'phobos':
            setFilterToggle(0, 5, 5, 1, 'blur');
            break;
          case 'heat':
            setFilterToggle(0, 3, 3, 0.01, 'brightness');
            break;
        }
      } else {
        uploadImg.classList.add('filter-image-preview');
        uploadImg.style.filter = '';
        filterSliderBlock.classList.add('invisible');
      }
    }
  };
  var scaleImg = function (evt) {
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
    uploadImg.style.transform = 'scale(' + scale.value / 100 + ')';
    scale.value += '%';
    scaleValidity(scale.value);
  };
  var scaleValidity = function (scaleValue) {
    var result = false;
    var pattern = /^\d{2,3}%$/;
    if (pattern.test(scaleValue) === true) {
      result = ((parseInt(scaleValue, 10) >= SCALE_MIN) && (parseInt(scaleValue, 10) <= SCALE_MAX) && !(parseInt(scaleValue, 10) % SCALE_STEP));
    }
    scaleValidityResult = result;
    if (!scaleValidityResult) {
      if (!uploadOverlay.querySelector('#scaleErrMsg')) {
        createErrMessage('scaleErrMsg', uploadOverlay.querySelector('.upload-resize-controls-button-inc'), 'Масштаб задан неверно: минимум 25%, максимум 100% с шагом в 25%');
        scale.style.outline = '2px solid red';
      } else {
        uploadOverlay.querySelector('#scaleErrMsg').classList.remove('invisible');
        scale.style.outline = 'none';
      }
    } else {
      if (uploadOverlay.querySelector('#scaleErrMsg')) {
        uploadOverlay.querySelector('#scaleErrMsg').classList.add('invisible');
        scale.style.outline = 'none';
      }
    }
    uploadSubmitBtn.disabled = !(result && commentValidityResult);
    return result;
  };
  var resetForm = function () {
    resetScaleInputStyle();
    scale.value = SCALE_MAX + '%';
    resetFilter();
    uploadOverlay.querySelector('#upload-filter-none').checked = true;
    uploadImg.classList.add('filter-image-preview');
    filterSliderBlock.classList.add('invisible');
    uploadComment.value = '';
    var errMessages = uploadOverlay.querySelectorAll('.err-message');
    [].forEach.call(errMessages, function (el) {
      el.classList.add('invisible');
    });
    uploadSubmitBtn.disabled = true;
  };
  var createErrMessage = function (id, element, errmess) {
    var errMessageElement = errMessageTemplate.cloneNode(true);
    errMessageElement.querySelector('.err-message').id = id;
    errMessageElement.querySelector('.err-message').textContent = errmess;
    element.insertAdjacentElement('afterEnd', errMessageElement.firstElementChild);
  };
  var formValidity = function () {
    var result = (commentValidity()) && (scaleValidity(scale.value));
    uploadSubmitBtn.disabled = !result;
    return result;
  };
  var onUploadOverlayEscPress = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      closeUploadOverlay();
    }
  };
  var onScaleBtnsClick = function (evt) {
    evt.preventDefault();
    scaleImg(evt);
  };
  var onScaleKeyup = function () {
    scaleValidity(scale.value);
  };
  var onUploadCommentFocus = function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  };
  var onUploadCommentBlur = function () {
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };
  var onUploadCommentKeyupOrChange = function () {
    commentValidity();
  };
  var onUploadCancelBtnClick = function () {
    closeUploadOverlay();
  };
  var onUploadCancelBtnEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEY) {
      closeUploadOverlay();
    }
  };
  var onUploadSubmit = function (evt) {
    evt.preventDefault();
    if (formValidity()) {
      resetForm();
      closeUploadOverlay();
    }
  };
  var onUploadFileNameChange = function (evt) {
    window.gallery.pictures.forEach(function (el) {
      el.removeEventListener('click', window.gallery.onPicturesClick);
    });
    openUploadOverlay(evt);
  };
  uploadFileName.addEventListener('change', onUploadFileNameChange);
  return {
    uploadOverlay: uploadOverlay,
    uploadForm: uploadForm,
    uploadFileName: uploadFileName,
    onUploadFileNameChange: onUploadFileNameChange
  };
})();
