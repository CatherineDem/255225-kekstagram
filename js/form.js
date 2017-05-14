/* Form */
'use strict';
var errorHandler = require('./error-handler.js');
var initializeScale = require('./initialize-scale.js');
var initializeFilters = require('./initialize-filters.js');
var filterPhoto = {};
var gallery = require('./gallery.js');
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var SCALE_STEP = 25;
var ENTER_KEY = 13;
var ESC_KEY = 27;
var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadForm = document.querySelector('.upload-image');
var pictures = document.querySelectorAll('.picture');
var uploadFileName = uploadForm.querySelector('.upload-input');
var uploadDropbox = uploadForm.querySelector('.upload-control');
var uploadCancelBtn = uploadOverlay.querySelector('.upload-form-cancel');
var uploadSubmitBtn = uploadOverlay.querySelector('.upload-form-submit');
var uploadComment = uploadOverlay.querySelector('.upload-form-description');
var commentErrMsg = uploadOverlay.querySelector('#commentErrMsg');
var scaleDecBtn = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
var scaleIncBtn = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
var scaleControll = uploadOverlay.querySelector('.upload-resize-controls');
var scale = uploadOverlay.querySelector('.upload-resize-controls-value');
var scaleErrMsg = uploadOverlay.querySelector('#scaleErrMsg');
var uploadImg = uploadOverlay.querySelector('.filter-image-preview');
var filterBtns = uploadOverlay.querySelector('.upload-filter-controls');
var commentValidityResult = false;
var scaleValidityResult = true;
var filterSliderBlock = filterBtns.querySelector('.upload-filter-level');
var filterToggle = filterSliderBlock.querySelector('.upload-filter-level-pin');
var filterLine = filterSliderBlock.querySelector('.upload-filter-level-line');
var filterValue = filterSliderBlock.querySelector('.upload-filter-level-val');
var filterDefault = filterBtns.querySelector('#upload-filter-none');
var toggleCoords = [];
var shiftX = 0;
var sliderCoords = [];
var stepFilter = 1;
var pointFilter = 1;
var selectedFilter = '';
var filterName = '';
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
  setValue = (filterName === 'blur') ? setValue += 'px' : setValue;
  initializeFilters(selectedFilter, filterName, setValue, applyFilter);
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
          filterName = 'grayscale';
          initFilter(0, 1, 0.01, filterName);
          setFilterToggle(1);
          break;
        case 'sepia':
          filterName = 'sepia';
          initFilter(0, 1, 0.01, filterName);
          setFilterToggle(1);
          break;
        case 'marvin':
          filterName = 'invert';
          initFilter(0, 1, 0.01, filterName);
          setFilterToggle(1);
          break;
        case 'phobos':
          filterName = 'blur';
          initFilter(0, 5, 1, filterName);
          setFilterToggle(5);
          break;
        case 'heat':
          filterName = 'brightness';
          initFilter(0, 3, 0.01, filterName);
          setFilterToggle(3);
          break;
      }
    } else {
      selectedFilter = 'image-preview';
      filterSliderBlock.classList.add('invisible');
    }
    initializeFilters(selectedFilter, filterMax, filterName, applyFilter);
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
  uploadFileName.removeEventListener('change', onUploadFileNameChange);
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
  filterPhoto.removeFiltersEvents();
  uploadDropbox.removeEventListener('dragenter', onUploadDropboxDrag);
  uploadDropbox.removeEventListener('dragover', onUploadDropboxDrag);
  uploadDropbox.removeEventListener('drop', onUploadDropboxDrop);
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
  [].forEach.call(pictures, function (el) {
    el.addEventListener('click', gallery.onPicturesClick);
  });
  filterPhoto.addFiltersEvents();
  uploadFileName.addEventListener('change', onUploadFileNameChange);
  uploadDropbox.addEventListener('dragenter', onUploadDropboxDrag);
  uploadDropbox.addEventListener('dragover', onUploadDropboxDrag);
  uploadDropbox.addEventListener('drop', onUploadDropboxDrop);
};
var commentValidity = function () {
  uploadComment.value = uploadComment.value.toString();
  commentValidityResult = (uploadComment.checkValidity() && (uploadComment.value.trim().length >= 30 && uploadComment.value.trim().length <= 100));
  if (commentValidityResult === false) {
    if (commentErrMsg === null) {
      errorHandler('commentErrMsg', uploadComment, 'Длина комментария должна быть от 30 до 100 символов');
      commentErrMsg = uploadOverlay.querySelector('#commentErrMsg');
    } else {
      commentErrMsg.classList.remove('invisible');
    }
    uploadComment.style.borderColor = 'red';
    uploadSubmitBtn.disabled = true;
  } else {
    if (commentErrMsg !== null) {
      commentErrMsg.classList.add('invisible');
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
      initializeScale(scale.value, adjustScale);
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
  if (scaleValidityResult === false) {
    if (scaleErrMsg === null) {
      errorHandler('scaleErrMsg', scaleIncBtn, 'Масштаб задан неверно: минимум 25%, максимум 100% с шагом в 25%');
      scaleErrMsg = uploadOverlay.querySelector('#scaleErrMsg');
      scale.style.outline = '2px solid red';
    } else {
      scaleErrMsg.classList.remove('invisible');
      scale.style.outline = 'none';
    }
  } else {
    if (scaleErrMsg !== null) {
      scaleErrMsg.classList.add('invisible');
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
  filterDefault.checked = true;
  uploadImg.className = 'filter-image-preview';
  uploadImg.style.filter = '';
  filterSliderBlock.classList.add('invisible');
  uploadComment.value = '';
  var errMessages = uploadOverlay.querySelectorAll('.err-message');
  [].forEach.call(errMessages, function (el) {
    el.classList.add('invisible');
  });
  commentValidityResult = false;
  scaleValidityResult = true;
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
  if (formValidity() === true) {
    resetForm();
    closeUploadOverlay();
  }
};
var onUploadFileNameChange = function (evt) {
  [].forEach.call(pictures, function (el) {
    el.removeEventListener('click', gallery.onPicturesClick);
  });
  var file = uploadFileName.files[0];
  var fileName = file.name.toLowerCase();
  var matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });
  if (matches) {
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      uploadImg.src = reader.result;
      openUploadOverlay(evt);
    });
    reader.readAsDataURL(file);
  }
  filterPhoto = require('./filter-photo.js');
};
var onUploadDropboxDrag = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
};
var onUploadDropboxDrop = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var dt = evt.dataTransfer;
  var files = dt.files;
  uploadFileName.files = files;
};
uploadFileName.addEventListener('change', onUploadFileNameChange);
uploadDropbox.addEventListener('dragenter', onUploadDropboxDrag);
uploadDropbox.addEventListener('dragover', onUploadDropboxDrag);
uploadDropbox.addEventListener('drop', onUploadDropboxDrop);
module.exports = {
  uploadOverlay: uploadOverlay,
  uploadForm: uploadForm,
  uploadFileName: uploadFileName,
  onUploadFileNameChange: onUploadFileNameChange
};
