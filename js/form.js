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
  var scaleControll = uploadOverlay.querySelector('.upload-resize-controls');
  var scale = uploadOverlay.querySelector('.upload-resize-controls-value');
  var uploadImg = uploadOverlay.querySelector('.filter-image-preview');
  var filterBtns = uploadOverlay.querySelector('.upload-filter-controls');
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
  var filterMin = 0;
  var filterMax = 100;
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
    setFilterToggle(setValue);
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
  var setFilterToggle = function (setValue) {
    var filterSetValue = Math.round(setValue / stepFilter * pointFilter);
    filterSetValue = filterSetValue > filterLine.offsetWidth ? filterLine.offsetWidth : filterSetValue;
    filterToggle.style.left = filterSetValue + 'px';
    filterValue.style.width = filterSetValue + 'px';
    window.initializeFilters(selectedFilter, setValue, applyFilter);
  };
  var resetFilter = function () {
    filterBtns.firstChild.checked = true;
    filterSliderBlock.classList.add('invisible');
  };
  var initFilter = function (minValue, maxValue, step, nameFilter) {
    filterMin = minValue;
    filterMax = maxValue;
    stepFilter = step;
    pointFilter = (filterLine.offsetWidth / (filterMax - filterMin)) * stepFilter;
  };
  var filterImg = function (evt) {
    if (evt.target.getAttribute('type') === 'radio') {
      selectedFilter = evt.target.value;
      if (selectedFilter !== 'none') {
        filterSliderBlock.classList.remove('invisible');
        switch (selectedFilter) {
          case 'chrome':
            initFilter(0, 1, 0.01, 'grayscale');
            setFilterToggle(1);
            break;
          case 'sepia':
            initFilter(0, 1, 0.01, 'sepia');
            setFilterToggle(1);
            break;
          case 'marvin':
            initFilter(0, 100, 1, 'invert');
            setFilterToggle(100);
            break;
          case 'phobos':
            initFilter(0, 5, 1, 'blur');
            setFilterToggle(5);
            break;
          case 'heat':
            initFilter(0, 3, 0.01, 'brightness');
            setFilterToggle(3);
            break;
        }
      } else {
        selectedFilter = 'image-preview';
        filterSliderBlock.classList.add('invisible');
      }
      window.initializeFilters(selectedFilter, filterMax, applyFilter);
    }
  };
  var applyFilter = function (setClassName, setFilterStyle, setValue) {
    uploadImg.style.filter = '';
    var currentClassName = uploadImg.className;
    if (currentClassName !== setClassName) {
      uploadImg.classList.remove(currentClassName);
    }
    uploadImg.classList.add(setClassName);
    uploadImg.style.filter = setFilterStyle + '(' + setValue + ')';
  };
  var openUploadOverlay = function () {
    uploadForm.classList.add('invisible');
    uploadOverlay.classList.remove('invisible');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    filterBtns.addEventListener('click', filterImg);
    filterValue.style.width = '0';
    filterToggle.style.left = '0';
    scaleControll.addEventListener('click', onScaleBtnsClick);
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
    scaleControll.removeEventListener('click', onScaleBtnsClick);
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
        window.errorHandler('commentErrMsg', document.querySelector('.upload-form-description'), 'Длина комментария должна быть от 30 до 100 символов');
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
  var adjustScale = function (scaleValue) {
    uploadImg.style.transform = 'scale(' + scaleValue / 100 + ')';
  };
  var resetScaleInputStyle = function () {
    uploadImg.style.transform = '';
    scale.style.outline = 'none';
  };
  var changeScale = function (evt) {
    if (evt.target.tagName === 'BUTTON') {
      var currentScale = parseInt(scale.value, 10);
      if (evt.target === scaleDecBtn) {
        if (currentScale > SCALE_MAX) {
          scale.value = SCALE_MAX;
        } else if ((currentScale % SCALE_STEP !== 0) && (currentScale > SCALE_MIN) && (currentScale < SCALE_MAX)) {
          scale.value = (parseInt(currentScale / SCALE_STEP, 10)) * SCALE_STEP;
        } else {
          scale.value = (currentScale - SCALE_STEP < SCALE_MIN) ? SCALE_MIN : currentScale - SCALE_STEP;
        }
      } else if (evt.target === scaleIncBtn) {
        if (currentScale < SCALE_MIN) {
          scale.value = SCALE_MIN;
        } else if ((currentScale % SCALE_STEP !== 0) && (currentScale > SCALE_MIN) && (currentScale < SCALE_MAX)) {
          scale.value = (parseInt(currentScale / SCALE_STEP, 10) + 1) * SCALE_STEP;
        } else {
          scale.value = (currentScale + SCALE_STEP > SCALE_MAX) ? SCALE_MAX : currentScale + SCALE_STEP;
        }
      }
      if (scaleValidity(scale.value + '%')) {
        window.initializeScale(scale.value, adjustScale);
      }
      scale.value += '%';
    }
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
        window.errorHandler('scaleErrMsg', uploadOverlay.querySelector('.upload-resize-controls-button-inc'), 'Масштаб задан неверно: минимум 25%, максимум 100% с шагом в 25%');
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
    uploadImg.className = 'filter-image-preview';
    uploadImg.style.filter = '';
    filterSliderBlock.classList.add('invisible');
    uploadComment.value = '';
    var errMessages = uploadOverlay.querySelectorAll('.err-message');
    [].forEach.call(errMessages, function (el) {
      el.classList.add('invisible');
    });
    uploadSubmitBtn.disabled = true;
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
    changeScale(evt);
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
