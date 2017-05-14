/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* FilterPhoto */

var debounce = __webpack_require__(3);
var NEW_PHOTOS_COUNT = 10;

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var filterByNew = function (photoArr) {
  var result = [];
  var randomPhotoIndex = 0;
  for (var i = 0; i < NEW_PHOTOS_COUNT; i++) {
    do {
      randomPhotoIndex = getRandomInRange(0, filterPhoto.filterPhotos.length - 1);
    }
    while (result.indexOf(filterPhoto.filterPhotos[randomPhotoIndex]) !== -1);
    result[i] = filterPhoto.filterPhotos[randomPhotoIndex];
  }
  return result;
};

var filterByDiscussed = function (photo1, photo2) {
  return photo2.comments.length - photo1.comments.length;
};

var onFilterClick = function (evt) {
  if (evt.target.getAttribute('type') === 'radio') {
    filterPhoto.currentFilter = evt.target.value;
    debounce(filterPhoto.applyFilter.bind(filterPhoto));
  }
};

var FilterPhoto = function () {
  this.filtersBlock = null;
  this.currentFilter = null;
  this.filterPhotos = [];
  this.afterApplyFunc = null;
}

FilterPhoto.prototype = {
  init: function (element, photos, cb) {
    if (typeof(cb) != 'function') {
      throw new Error('Переданный аргумент должен быть функцией');
    }
    this.filtersBlock = element;
    this.currentFilter = this.filtersBlock.querySelector('input[type="radio"]:checked').value;
    this.filterPhotos = photos;
    this.afterApplyFunc = cb;
    this.applyFilter();
    this.filtersBlock.classList.remove('hidden');
    this.addFiltersEvents(this);
  },
  applyFilter: function () {
    var filteredArrayPhotos = this.filterPhotos.slice();
    switch (this.currentFilter) {
      case 'new': filteredArrayPhotos = filterByNew(filteredArrayPhotos);
        break;
      case 'discussed': filteredArrayPhotos.sort(filterByDiscussed);
        break;
    }
    this.afterApplyFunc(filteredArrayPhotos);
  },
  addFiltersEvents: function (filterPhoto) {
    this.filtersBlock.addEventListener('click', onFilterClick);
  },
  removeFiltersEvents: function () {
    this.filtersBlock.removeEventListener('click', onFilterClick);
  }
};

var filterPhoto = new FilterPhoto();

module.exports = {
  filterPhoto: filterPhoto
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* Gallery */
  var preview = __webpack_require__(10);
  var filterPhoto = __webpack_require__(0);
  var createPicture = __webpack_require__(9);
  var photos = [];
  var picturesBlock = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.querySelector('.upload-image');
  var pictures = [];
  var onPicturesClick = function (evt) {
    evt.preventDefault();
    preview.openPicture(evt, photos);
  };
  var renderPictures = function (photosCollection) {
    photos = photosCollection;
    for (var i = picturesBlock.children.length - 1; i >= 0; i--) {
      var child = picturesBlock.children[i];
      child.parentElement.removeChild(child);
    }
    var fragment = document.createDocumentFragment();
    for (i = 0; i < photosCollection.length; i++) {
      fragment.appendChild(createPicture(photosCollection[i]));
    }
    picturesBlock.appendChild(fragment);
    pictures = picturesBlock.querySelectorAll('.picture');
    [].forEach.call(pictures, function (el) {
      el.addEventListener('click', onPicturesClick);
    });
  };
  
  uploadOverlay.classList.add('invisible');
  uploadForm.classList.remove('invisible');
  module.exports = {
    renderPictures: renderPictures,
    pictures: pictures,
    onPicturesClick: onPicturesClick
  };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* ErrorHandler */
var errorHandler = (function (id, element, errmess) {
  var errMessageTemplate = document.querySelector('#error-message').content;
  var errMessageElement = errMessageTemplate.cloneNode(true);
  var errMessage = errMessageElement.querySelector('.err-message');
  errMessage.id = id;
  errMessage.textContent = errmess;
  element.insertAdjacentElement('afterend', errMessage);
});

module.exports = errorHandler;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* Debounce */
var DEBOUNCE_INTERVAL = 500; // ms
var lastTimeout;

var debounce = function (fun) {
    if (lastTimeout > 0) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

module.exports = debounce;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* Form */
var errorHandler = __webpack_require__(2);
var initializeScale = __webpack_require__(6);
var initializeFilters = __webpack_require__(5);
var filterPhoto = {};
var gallery = __webpack_require__(1);
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
  filterPhoto = __webpack_require__(0);
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


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/* initializeFilters */
var initializeFilters = function (selectedFilter, filterName, setValue, cb) {
  cb('filter-' + selectedFilter, filterName, setValue);
};

module.exports = initializeFilters;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* initializeScale */
var initializeScale = function (scaleValue, cb) {
  cb(scaleValue);
};

module.exports = initializeScale;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* Load */
var errorHandler = __webpack_require__(2);
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
var photos = [];
var load = __webpack_require__(7);
var filterPhoto = __webpack_require__(0);
var gallery = __webpack_require__(1);
var galleryFilter = {};
var filtersBlock = document.querySelector('.filters');

var initGallery = function (loadedPhotos) {
  photos = loadedPhotos;
  filterPhoto.filterPhoto.init(filtersBlock, photos, gallery.renderPictures);
};

load(URL, initGallery);

if (true) {
  console.log('Работает!');
}



/***/ }),
/* 9 */
/***/ (function(module, exports) {

/* Picture */
var createPicture = function (photo) {
  var pictureTemplate = document.querySelector('#picture-template').content;
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = photo.url;
  pictureElement.querySelector('.picture-comments').textContent = photo.comments.length;
  pictureElement.querySelector('.picture-likes').textContent = photo.likes;
  return pictureElement;
};

module.exports = createPicture;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* Preview */
var ENTER_KEY = 13;
var ESC_KEY = 27;
var gallery = __webpack_require__(1);
var galleryOverlay = document.querySelector('.gallery-overlay');;
var galleryCloseBtn = galleryOverlay.querySelector('.gallery-overlay-close');
var form = __webpack_require__(4);
var createPreview = function (photo, destGallery) {
  destGallery.querySelector('img').src = photo.url;
  destGallery.querySelector('.likes-count').textContent = photo.likes;
  destGallery.querySelector('.comments-count').textContent = photo.comments.length;
};

function findPhoto(array, url) {
  var result = -1;
  array.every(function (el, i) {
    if (el.url === url) {
      result = i;
      return false;
    }
    return true;
  });
  return array[result];
}
var closePicture = function () {
  galleryOverlay.classList.add('invisible');
  document.removeEventListener('keydown', onPictureEscPress);
  galleryCloseBtn.removeEventListener('click', onCloseBtnClick);
  galleryCloseBtn.removeEventListener('keydown', onCloseBtnEnterPress);
  form.uploadFileName.addEventListener('change', form.onUploadFileNameChange);
};
var openPicture = function (evt, photosArr) {
  if (evt.currentTarget.className === 'picture') {
    var pictureSrc = evt.currentTarget.children[0].getAttribute('src');
    var pictureObj = findPhoto(photosArr, pictureSrc);
    if (typeof pictureObj === 'object') {
      createPreview(pictureObj, galleryOverlay);
      galleryOverlay.classList.remove('invisible');
    }
  }
  document.addEventListener('keydown', onPictureEscPress);
  galleryCloseBtn.addEventListener('click', onCloseBtnClick);
  galleryCloseBtn.addEventListener('keydown', onCloseBtnEnterPress);
  form.uploadFileName.removeEventListener('change', form.onUploadFileNameChange);
};
var onPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEY) {
    closePicture();
  }
};
var onCloseBtnClick = function (evt) {
  closePicture();
};
var onCloseBtnEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEY) {
    closePicture();
  }
};
module.exports = {
  closePicture: closePicture,
  openPicture: openPicture
};



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhMGVjMDYwNTQ2OWNmOTRjMGEyYiIsIndlYnBhY2s6Ly8vLi9maWx0ZXItcGhvdG8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2FsbGVyeS5qcyIsIndlYnBhY2s6Ly8vLi9lcnJvci1oYW5kbGVyLmpzIiwid2VicGFjazovLy8uL2RlYm91bmNlLmpzIiwid2VicGFjazovLy8uL2Zvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vaW5pdGlhbGl6ZS1maWx0ZXJzLmpzIiwid2VicGFjazovLy8uL2luaXRpYWxpemUtc2NhbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9tYWluLmpzIiwid2VicGFjazovLy8uL3BpY3R1cmUuanMiLCJ3ZWJwYWNrOi8vLy4vcHJldmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGEwZWMwNjA1NDY5Y2Y5NGMwYTJiIiwiLyogRmlsdGVyUGhvdG8gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlLmpzJyk7XHJcbnZhciBORVdfUEhPVE9TX0NPVU5UID0gMTA7XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5kb21JblJhbmdlKG1pbiwgbWF4KSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbn1cclxuXHJcbnZhciBmaWx0ZXJCeU5ldyA9IGZ1bmN0aW9uIChwaG90b0Fycikge1xyXG4gIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgcmFuZG9tUGhvdG9JbmRleCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBORVdfUEhPVE9TX0NPVU5UOyBpKyspIHtcclxuICAgIGRvIHtcclxuICAgICAgcmFuZG9tUGhvdG9JbmRleCA9IGdldFJhbmRvbUluUmFuZ2UoMCwgZmlsdGVyUGhvdG8uZmlsdGVyUGhvdG9zLmxlbmd0aCAtIDEpO1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKHJlc3VsdC5pbmRleE9mKGZpbHRlclBob3RvLmZpbHRlclBob3Rvc1tyYW5kb21QaG90b0luZGV4XSkgIT09IC0xKTtcclxuICAgIHJlc3VsdFtpXSA9IGZpbHRlclBob3RvLmZpbHRlclBob3Rvc1tyYW5kb21QaG90b0luZGV4XTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbnZhciBmaWx0ZXJCeURpc2N1c3NlZCA9IGZ1bmN0aW9uIChwaG90bzEsIHBob3RvMikge1xyXG4gIHJldHVybiBwaG90bzIuY29tbWVudHMubGVuZ3RoIC0gcGhvdG8xLmNvbW1lbnRzLmxlbmd0aDtcclxufTtcclxuXHJcbnZhciBvbkZpbHRlckNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGlmIChldnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgndHlwZScpID09PSAncmFkaW8nKSB7XHJcbiAgICBmaWx0ZXJQaG90by5jdXJyZW50RmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgIGRlYm91bmNlKGZpbHRlclBob3RvLmFwcGx5RmlsdGVyLmJpbmQoZmlsdGVyUGhvdG8pKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgRmlsdGVyUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5maWx0ZXJzQmxvY2sgPSBudWxsO1xyXG4gIHRoaXMuY3VycmVudEZpbHRlciA9IG51bGw7XHJcbiAgdGhpcy5maWx0ZXJQaG90b3MgPSBbXTtcclxuICB0aGlzLmFmdGVyQXBwbHlGdW5jID0gbnVsbDtcclxufVxyXG5cclxuRmlsdGVyUGhvdG8ucHJvdG90eXBlID0ge1xyXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCBwaG90b3MsIGNiKSB7XHJcbiAgICBpZiAodHlwZW9mKGNiKSAhPSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcign0J/QtdGA0LXQtNCw0L3QvdGL0Lkg0LDRgNCz0YPQvNC10L3RgiDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0YTRg9C90LrRhtC40LXQuScpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5maWx0ZXJzQmxvY2sgPSBlbGVtZW50O1xyXG4gICAgdGhpcy5jdXJyZW50RmlsdGVyID0gdGhpcy5maWx0ZXJzQmxvY2sucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS52YWx1ZTtcclxuICAgIHRoaXMuZmlsdGVyUGhvdG9zID0gcGhvdG9zO1xyXG4gICAgdGhpcy5hZnRlckFwcGx5RnVuYyA9IGNiO1xyXG4gICAgdGhpcy5hcHBseUZpbHRlcigpO1xyXG4gICAgdGhpcy5maWx0ZXJzQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcbiAgICB0aGlzLmFkZEZpbHRlcnNFdmVudHModGhpcyk7XHJcbiAgfSxcclxuICBhcHBseUZpbHRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGZpbHRlcmVkQXJyYXlQaG90b3MgPSB0aGlzLmZpbHRlclBob3Rvcy5zbGljZSgpO1xyXG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRGaWx0ZXIpIHtcclxuICAgICAgY2FzZSAnbmV3JzogZmlsdGVyZWRBcnJheVBob3RvcyA9IGZpbHRlckJ5TmV3KGZpbHRlcmVkQXJyYXlQaG90b3MpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkaXNjdXNzZWQnOiBmaWx0ZXJlZEFycmF5UGhvdG9zLnNvcnQoZmlsdGVyQnlEaXNjdXNzZWQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hZnRlckFwcGx5RnVuYyhmaWx0ZXJlZEFycmF5UGhvdG9zKTtcclxuICB9LFxyXG4gIGFkZEZpbHRlcnNFdmVudHM6IGZ1bmN0aW9uIChmaWx0ZXJQaG90bykge1xyXG4gICAgdGhpcy5maWx0ZXJzQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkZpbHRlckNsaWNrKTtcclxuICB9LFxyXG4gIHJlbW92ZUZpbHRlcnNFdmVudHM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZmlsdGVyc0Jsb2NrLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25GaWx0ZXJDbGljayk7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIGZpbHRlclBob3RvID0gbmV3IEZpbHRlclBob3RvKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBmaWx0ZXJQaG90bzogZmlsdGVyUGhvdG9cclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9maWx0ZXItcGhvdG8uanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogR2FsbGVyeSAqL1xyXG4gIHZhciBwcmV2aWV3ID0gcmVxdWlyZSgnLi9wcmV2aWV3LmpzJyk7XHJcbiAgdmFyIGZpbHRlclBob3RvID0gcmVxdWlyZSgnLi9maWx0ZXItcGhvdG8uanMnKTtcclxuICB2YXIgY3JlYXRlUGljdHVyZSA9IHJlcXVpcmUoJy4vcGljdHVyZS5qcycpO1xyXG4gIHZhciBwaG90b3MgPSBbXTtcclxuICB2YXIgcGljdHVyZXNCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5waWN0dXJlcycpO1xyXG4gIHZhciBnYWxsZXJ5T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5LW92ZXJsYXknKTtcclxuICB2YXIgdXBsb2FkT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtb3ZlcmxheScpO1xyXG4gIHZhciB1cGxvYWRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pbWFnZScpO1xyXG4gIHZhciBwaWN0dXJlcyA9IFtdO1xyXG4gIHZhciBvblBpY3R1cmVzQ2xpY2sgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHByZXZpZXcub3BlblBpY3R1cmUoZXZ0LCBwaG90b3MpO1xyXG4gIH07XHJcbiAgdmFyIHJlbmRlclBpY3R1cmVzID0gZnVuY3Rpb24gKHBob3Rvc0NvbGxlY3Rpb24pIHtcclxuICAgIHBob3RvcyA9IHBob3Rvc0NvbGxlY3Rpb247XHJcbiAgICBmb3IgKHZhciBpID0gcGljdHVyZXNCbG9jay5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICB2YXIgY2hpbGQgPSBwaWN0dXJlc0Jsb2NrLmNoaWxkcmVuW2ldO1xyXG4gICAgICBjaGlsZC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBwaG90b3NDb2xsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNyZWF0ZVBpY3R1cmUocGhvdG9zQ29sbGVjdGlvbltpXSkpO1xyXG4gICAgfVxyXG4gICAgcGljdHVyZXNCbG9jay5hcHBlbmRDaGlsZChmcmFnbWVudCk7XHJcbiAgICBwaWN0dXJlcyA9IHBpY3R1cmVzQmxvY2sucXVlcnlTZWxlY3RvckFsbCgnLnBpY3R1cmUnKTtcclxuICAgIFtdLmZvckVhY2guY2FsbChwaWN0dXJlcywgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25QaWN0dXJlc0NsaWNrKTtcclxuICAgIH0pO1xyXG4gIH07XHJcbiAgXHJcbiAgdXBsb2FkT3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICB1cGxvYWRGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xyXG4gIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVuZGVyUGljdHVyZXM6IHJlbmRlclBpY3R1cmVzLFxyXG4gICAgcGljdHVyZXM6IHBpY3R1cmVzLFxyXG4gICAgb25QaWN0dXJlc0NsaWNrOiBvblBpY3R1cmVzQ2xpY2tcclxuICB9O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2dhbGxlcnkuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogRXJyb3JIYW5kbGVyICovXHJcbnZhciBlcnJvckhhbmRsZXIgPSAoZnVuY3Rpb24gKGlkLCBlbGVtZW50LCBlcnJtZXNzKSB7XHJcbiAgdmFyIGVyck1lc3NhZ2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlcnJvci1tZXNzYWdlJykuY29udGVudDtcclxuICB2YXIgZXJyTWVzc2FnZUVsZW1lbnQgPSBlcnJNZXNzYWdlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIHZhciBlcnJNZXNzYWdlID0gZXJyTWVzc2FnZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmVyci1tZXNzYWdlJyk7XHJcbiAgZXJyTWVzc2FnZS5pZCA9IGlkO1xyXG4gIGVyck1lc3NhZ2UudGV4dENvbnRlbnQgPSBlcnJtZXNzO1xyXG4gIGVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdhZnRlcmVuZCcsIGVyck1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXJyb3JIYW5kbGVyO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Vycm9yLWhhbmRsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogRGVib3VuY2UgKi9cclxudmFyIERFQk9VTkNFX0lOVEVSVkFMID0gNTAwOyAvLyBtc1xyXG52YXIgbGFzdFRpbWVvdXQ7XHJcblxyXG52YXIgZGVib3VuY2UgPSBmdW5jdGlvbiAoZnVuKSB7XHJcbiAgICBpZiAobGFzdFRpbWVvdXQgPiAwKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQobGFzdFRpbWVvdXQpO1xyXG4gICAgfVxyXG4gICAgbGFzdFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW4sIERFQk9VTkNFX0lOVEVSVkFMKTtcclxuICB9O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9kZWJvdW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBGb3JtICovXHJcbnZhciBlcnJvckhhbmRsZXIgPSByZXF1aXJlKCcuL2Vycm9yLWhhbmRsZXIuanMnKTtcclxudmFyIGluaXRpYWxpemVTY2FsZSA9IHJlcXVpcmUoJy4vaW5pdGlhbGl6ZS1zY2FsZS5qcycpO1xyXG52YXIgaW5pdGlhbGl6ZUZpbHRlcnMgPSByZXF1aXJlKCcuL2luaXRpYWxpemUtZmlsdGVycy5qcycpO1xyXG52YXIgZmlsdGVyUGhvdG8gPSB7fTtcclxudmFyIGdhbGxlcnkgPSByZXF1aXJlKCcuL2dhbGxlcnkuanMnKTtcclxudmFyIFNDQUxFX01JTiA9IDI1O1xyXG52YXIgU0NBTEVfTUFYID0gMTAwO1xyXG52YXIgU0NBTEVfU1RFUCA9IDI1O1xyXG52YXIgRU5URVJfS0VZID0gMTM7XHJcbnZhciBFU0NfS0VZID0gMjc7XHJcbnZhciBGSUxFX1RZUEVTID0gWydnaWYnLCAnanBnJywgJ2pwZWcnLCAncG5nJ107XHJcbnZhciB1cGxvYWRPdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVwbG9hZC1vdmVybGF5Jyk7XHJcbnZhciB1cGxvYWRGb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pbWFnZScpO1xyXG52YXIgcGljdHVyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGljdHVyZScpO1xyXG52YXIgdXBsb2FkRmlsZU5hbWUgPSB1cGxvYWRGb3JtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtaW5wdXQnKTtcclxudmFyIHVwbG9hZERyb3Bib3ggPSB1cGxvYWRGb3JtLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtY29udHJvbCcpO1xyXG52YXIgdXBsb2FkQ2FuY2VsQnRuID0gdXBsb2FkT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWZvcm0tY2FuY2VsJyk7XHJcbnZhciB1cGxvYWRTdWJtaXRCdG4gPSB1cGxvYWRPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtZm9ybS1zdWJtaXQnKTtcclxudmFyIHVwbG9hZENvbW1lbnQgPSB1cGxvYWRPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtZm9ybS1kZXNjcmlwdGlvbicpO1xyXG52YXIgY29tbWVudEVyck1zZyA9IHVwbG9hZE92ZXJsYXkucXVlcnlTZWxlY3RvcignI2NvbW1lbnRFcnJNc2cnKTtcclxudmFyIHNjYWxlRGVjQnRuID0gdXBsb2FkT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLXJlc2l6ZS1jb250cm9scy1idXR0b24tZGVjJyk7XHJcbnZhciBzY2FsZUluY0J0biA9IHVwbG9hZE92ZXJsYXkucXVlcnlTZWxlY3RvcignLnVwbG9hZC1yZXNpemUtY29udHJvbHMtYnV0dG9uLWluYycpO1xyXG52YXIgc2NhbGVDb250cm9sbCA9IHVwbG9hZE92ZXJsYXkucXVlcnlTZWxlY3RvcignLnVwbG9hZC1yZXNpemUtY29udHJvbHMnKTtcclxudmFyIHNjYWxlID0gdXBsb2FkT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLXJlc2l6ZS1jb250cm9scy12YWx1ZScpO1xyXG52YXIgc2NhbGVFcnJNc2cgPSB1cGxvYWRPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNzY2FsZUVyck1zZycpO1xyXG52YXIgdXBsb2FkSW1nID0gdXBsb2FkT3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyLWltYWdlLXByZXZpZXcnKTtcclxudmFyIGZpbHRlckJ0bnMgPSB1cGxvYWRPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtZmlsdGVyLWNvbnRyb2xzJyk7XHJcbnZhciBjb21tZW50VmFsaWRpdHlSZXN1bHQgPSBmYWxzZTtcclxudmFyIHNjYWxlVmFsaWRpdHlSZXN1bHQgPSB0cnVlO1xyXG52YXIgZmlsdGVyU2xpZGVyQmxvY2sgPSBmaWx0ZXJCdG5zLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtZmlsdGVyLWxldmVsJyk7XHJcbnZhciBmaWx0ZXJUb2dnbGUgPSBmaWx0ZXJTbGlkZXJCbG9jay5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWZpbHRlci1sZXZlbC1waW4nKTtcclxudmFyIGZpbHRlckxpbmUgPSBmaWx0ZXJTbGlkZXJCbG9jay5xdWVyeVNlbGVjdG9yKCcudXBsb2FkLWZpbHRlci1sZXZlbC1saW5lJyk7XHJcbnZhciBmaWx0ZXJWYWx1ZSA9IGZpbHRlclNsaWRlckJsb2NrLnF1ZXJ5U2VsZWN0b3IoJy51cGxvYWQtZmlsdGVyLWxldmVsLXZhbCcpO1xyXG52YXIgZmlsdGVyRGVmYXVsdCA9IGZpbHRlckJ0bnMucXVlcnlTZWxlY3RvcignI3VwbG9hZC1maWx0ZXItbm9uZScpO1xyXG52YXIgdG9nZ2xlQ29vcmRzID0gW107XHJcbnZhciBzaGlmdFggPSAwO1xyXG52YXIgc2xpZGVyQ29vcmRzID0gW107XHJcbnZhciBzdGVwRmlsdGVyID0gMTtcclxudmFyIHBvaW50RmlsdGVyID0gMTtcclxudmFyIHNlbGVjdGVkRmlsdGVyID0gJyc7XHJcbnZhciBmaWx0ZXJOYW1lID0gJyc7XHJcbnZhciBmaWx0ZXJNaW4gPSAwO1xyXG52YXIgZmlsdGVyTWF4ID0gMTAwO1xyXG52YXIgdG9nZ2xlTW91c2Vtb3ZlID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIHZhciBuZXdMZWZ0ID0gKGV2dC5wYWdlWCAtIHNoaWZ0WCAtIHNsaWRlckNvb3Jkcy5sZWZ0KTtcclxuICBuZXdMZWZ0ID0gTWF0aC5yb3VuZChuZXdMZWZ0IC8gKHN0ZXBGaWx0ZXIgKiBwb2ludEZpbHRlcikgKiBzdGVwRmlsdGVyICogcG9pbnRGaWx0ZXIpO1xyXG4gIGlmIChuZXdMZWZ0IDwgMCkge1xyXG4gICAgbmV3TGVmdCA9IDA7XHJcbiAgfVxyXG4gIHZhciByaWdodEVkZ2UgPSBmaWx0ZXJMaW5lLm9mZnNldFdpZHRoO1xyXG4gIGlmIChuZXdMZWZ0ID4gcmlnaHRFZGdlKSB7XHJcbiAgICBuZXdMZWZ0ID0gcmlnaHRFZGdlO1xyXG4gIH1cclxuICB2YXIgc2V0VmFsdWUgPSAoTWF0aC5jZWlsKG5ld0xlZnQgLyBwb2ludEZpbHRlcikpICogc3RlcEZpbHRlcjtcclxuICBzZXRGaWx0ZXJUb2dnbGUoc2V0VmFsdWUpO1xyXG59O1xyXG52YXIgdG9nZ2xlTW91c2Vkb3duID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIHRvZ2dsZUNvb3JkcyA9IGdldENvb3JkcyhmaWx0ZXJUb2dnbGUpO1xyXG4gIHNoaWZ0WCA9IGV2dC5wYWdlWCAtIHRvZ2dsZUNvb3Jkcy5sZWZ0O1xyXG4gIHNsaWRlckNvb3JkcyA9IGdldENvb3JkcyhmaWx0ZXJTbGlkZXJCbG9jayk7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdG9nZ2xlTW91c2Vtb3ZlKTtcclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcbnZhciB0b2dnbGVNb3VzZXVwID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRvZ2dsZU1vdXNlbW92ZSk7XHJcbn07XHJcbnZhciBmaWx0ZXJUb2dnbGVEcmFnc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5mdW5jdGlvbiBnZXRDb29yZHMoZWxlbSkge1xyXG4gIHZhciBib3ggPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHJldHVybiB7XHJcbiAgICB0b3A6IGJveC50b3AgKyBwYWdlWU9mZnNldCxcclxuICAgIGxlZnQ6IGJveC5sZWZ0ICsgcGFnZVhPZmZzZXRcclxuICB9O1xyXG59XHJcbnZhciBzZXRGaWx0ZXJUb2dnbGUgPSBmdW5jdGlvbiAoc2V0VmFsdWUpIHtcclxuICB2YXIgZmlsdGVyU2V0VmFsdWUgPSBNYXRoLnJvdW5kKHNldFZhbHVlIC8gc3RlcEZpbHRlciAqIHBvaW50RmlsdGVyKTtcclxuICBmaWx0ZXJTZXRWYWx1ZSA9IGZpbHRlclNldFZhbHVlID4gZmlsdGVyTGluZS5vZmZzZXRXaWR0aCA/IGZpbHRlckxpbmUub2Zmc2V0V2lkdGggOiBmaWx0ZXJTZXRWYWx1ZTtcclxuICBmaWx0ZXJUb2dnbGUuc3R5bGUubGVmdCA9IGZpbHRlclNldFZhbHVlICsgJ3B4JztcclxuICBmaWx0ZXJWYWx1ZS5zdHlsZS53aWR0aCA9IGZpbHRlclNldFZhbHVlICsgJ3B4JztcclxuICBzZXRWYWx1ZSA9IChmaWx0ZXJOYW1lID09PSAnYmx1cicpID8gc2V0VmFsdWUgKz0gJ3B4JyA6IHNldFZhbHVlO1xyXG4gIGluaXRpYWxpemVGaWx0ZXJzKHNlbGVjdGVkRmlsdGVyLCBmaWx0ZXJOYW1lLCBzZXRWYWx1ZSwgYXBwbHlGaWx0ZXIpO1xyXG59O1xyXG52YXIgcmVzZXRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZmlsdGVyQnRucy5maXJzdENoaWxkLmNoZWNrZWQgPSB0cnVlO1xyXG4gIGZpbHRlclNsaWRlckJsb2NrLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xyXG59O1xyXG52YXIgaW5pdEZpbHRlciA9IGZ1bmN0aW9uIChtaW5WYWx1ZSwgbWF4VmFsdWUsIHN0ZXAsIG5hbWVGaWx0ZXIpIHtcclxuICBmaWx0ZXJNaW4gPSBtaW5WYWx1ZTtcclxuICBmaWx0ZXJNYXggPSBtYXhWYWx1ZTtcclxuICBzdGVwRmlsdGVyID0gc3RlcDtcclxuICBwb2ludEZpbHRlciA9IChmaWx0ZXJMaW5lLm9mZnNldFdpZHRoIC8gKGZpbHRlck1heCAtIGZpbHRlck1pbikpICogc3RlcEZpbHRlcjtcclxufTtcclxudmFyIGZpbHRlckltZyA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBpZiAoZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3JhZGlvJykge1xyXG4gICAgc2VsZWN0ZWRGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgaWYgKHNlbGVjdGVkRmlsdGVyICE9PSAnbm9uZScpIHtcclxuICAgICAgZmlsdGVyU2xpZGVyQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICAgIHN3aXRjaCAoc2VsZWN0ZWRGaWx0ZXIpIHtcclxuICAgICAgICBjYXNlICdjaHJvbWUnOlxyXG4gICAgICAgICAgZmlsdGVyTmFtZSA9ICdncmF5c2NhbGUnO1xyXG4gICAgICAgICAgaW5pdEZpbHRlcigwLCAxLCAwLjAxLCBmaWx0ZXJOYW1lKTtcclxuICAgICAgICAgIHNldEZpbHRlclRvZ2dsZSgxKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3NlcGlhJzpcclxuICAgICAgICAgIGZpbHRlck5hbWUgPSAnc2VwaWEnO1xyXG4gICAgICAgICAgaW5pdEZpbHRlcigwLCAxLCAwLjAxLCBmaWx0ZXJOYW1lKTtcclxuICAgICAgICAgIHNldEZpbHRlclRvZ2dsZSgxKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ21hcnZpbic6XHJcbiAgICAgICAgICBmaWx0ZXJOYW1lID0gJ2ludmVydCc7XHJcbiAgICAgICAgICBpbml0RmlsdGVyKDAsIDEsIDAuMDEsIGZpbHRlck5hbWUpO1xyXG4gICAgICAgICAgc2V0RmlsdGVyVG9nZ2xlKDEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAncGhvYm9zJzpcclxuICAgICAgICAgIGZpbHRlck5hbWUgPSAnYmx1cic7XHJcbiAgICAgICAgICBpbml0RmlsdGVyKDAsIDUsIDEsIGZpbHRlck5hbWUpO1xyXG4gICAgICAgICAgc2V0RmlsdGVyVG9nZ2xlKDUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnaGVhdCc6XHJcbiAgICAgICAgICBmaWx0ZXJOYW1lID0gJ2JyaWdodG5lc3MnO1xyXG4gICAgICAgICAgaW5pdEZpbHRlcigwLCAzLCAwLjAxLCBmaWx0ZXJOYW1lKTtcclxuICAgICAgICAgIHNldEZpbHRlclRvZ2dsZSgzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxlY3RlZEZpbHRlciA9ICdpbWFnZS1wcmV2aWV3JztcclxuICAgICAgZmlsdGVyU2xpZGVyQmxvY2suY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplRmlsdGVycyhzZWxlY3RlZEZpbHRlciwgZmlsdGVyTWF4LCBmaWx0ZXJOYW1lLCBhcHBseUZpbHRlcik7XHJcbiAgfVxyXG59O1xyXG52YXIgYXBwbHlGaWx0ZXIgPSBmdW5jdGlvbiAoc2V0Q2xhc3NOYW1lLCBzZXRGaWx0ZXJTdHlsZSwgc2V0VmFsdWUpIHtcclxuICB1cGxvYWRJbWcuc3R5bGUuZmlsdGVyID0gJyc7XHJcbiAgdmFyIGN1cnJlbnRDbGFzc05hbWUgPSB1cGxvYWRJbWcuY2xhc3NOYW1lO1xyXG4gIGlmIChjdXJyZW50Q2xhc3NOYW1lICE9PSBzZXRDbGFzc05hbWUpIHtcclxuICAgIHVwbG9hZEltZy5jbGFzc0xpc3QucmVtb3ZlKGN1cnJlbnRDbGFzc05hbWUpO1xyXG4gIH1cclxuICB1cGxvYWRJbWcuY2xhc3NMaXN0LmFkZChzZXRDbGFzc05hbWUpO1xyXG4gIHVwbG9hZEltZy5zdHlsZS5maWx0ZXIgPSBzZXRGaWx0ZXJTdHlsZSArICcoJyArIHNldFZhbHVlICsgJyknO1xyXG59O1xyXG52YXIgb3BlblVwbG9hZE92ZXJsYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdXBsb2FkRmlsZU5hbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25VcGxvYWRGaWxlTmFtZUNoYW5nZSk7XHJcbiAgdXBsb2FkRm9ybS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICB1cGxvYWRPdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvblVwbG9hZE92ZXJsYXlFc2NQcmVzcyk7XHJcbiAgZmlsdGVyQnRucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZpbHRlckltZyk7XHJcbiAgZmlsdGVyVmFsdWUuc3R5bGUud2lkdGggPSAnMCc7XHJcbiAgZmlsdGVyVG9nZ2xlLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgc2NhbGVDb250cm9sbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uU2NhbGVCdG5zQ2xpY2spO1xyXG4gIHNjYWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25TY2FsZUtleXVwKTtcclxuICBmaWx0ZXJTbGlkZXJCbG9jay5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICBmaWx0ZXJUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdG9nZ2xlTW91c2Vkb3duKTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdG9nZ2xlTW91c2V1cCk7XHJcbiAgZmlsdGVyVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGZpbHRlclRvZ2dsZURyYWdzdGFydCk7XHJcbiAgdXBsb2FkQ29tbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIG9uVXBsb2FkQ29tbWVudEZvY3VzKTtcclxuICB1cGxvYWRDb21tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvblVwbG9hZENvbW1lbnRCbHVyKTtcclxuICB1cGxvYWRDb21tZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25VcGxvYWRDb21tZW50S2V5dXBPckNoYW5nZSk7XHJcbiAgdXBsb2FkQ29tbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBvblVwbG9hZENvbW1lbnRLZXl1cE9yQ2hhbmdlKTtcclxuICB1cGxvYWRDYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblVwbG9hZENhbmNlbEJ0bkNsaWNrKTtcclxuICB1cGxvYWRDYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uVXBsb2FkQ2FuY2VsQnRuRW50ZXJQcmVzcyk7XHJcbiAgdXBsb2FkU3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25VcGxvYWRTdWJtaXQpO1xyXG4gIGZpbHRlclBob3RvLnJlbW92ZUZpbHRlcnNFdmVudHMoKTtcclxuICB1cGxvYWREcm9wYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIG9uVXBsb2FkRHJvcGJveERyYWcpO1xyXG4gIHVwbG9hZERyb3Bib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBvblVwbG9hZERyb3Bib3hEcmFnKTtcclxuICB1cGxvYWREcm9wYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBvblVwbG9hZERyb3Bib3hEcm9wKTtcclxufTtcclxudmFyIGNsb3NlVXBsb2FkT3ZlcmxheSA9IGZ1bmN0aW9uICgpIHtcclxuICByZXNldEZvcm0oKTtcclxuICB1cGxvYWRPdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xyXG4gIHVwbG9hZEZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgdXBsb2FkRmlsZU5hbWUudmFsdWUgPSAnJztcclxuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25VcGxvYWRPdmVybGF5RXNjUHJlc3MpO1xyXG4gIGZpbHRlckJ0bnMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmaWx0ZXJJbWcpO1xyXG4gIHNjYWxlQ29udHJvbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblNjYWxlQnRuc0NsaWNrKTtcclxuICBzY2FsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uU2NhbGVLZXl1cCk7XHJcbiAgZmlsdGVyVG9nZ2xlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRvZ2dsZU1vdXNlZG93bik7XHJcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRvZ2dsZU1vdXNldXApO1xyXG4gIGZpbHRlclRvZ2dsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBmaWx0ZXJUb2dnbGVEcmFnc3RhcnQpO1xyXG4gIHVwbG9hZENvbW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBvblVwbG9hZENvbW1lbnRGb2N1cyk7XHJcbiAgdXBsb2FkQ29tbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgb25VcGxvYWRDb21tZW50Qmx1cik7XHJcbiAgdXBsb2FkQ29tbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uVXBsb2FkQ29tbWVudEtleXVwT3JDaGFuZ2UpO1xyXG4gIHVwbG9hZENvbW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25VcGxvYWRDb21tZW50S2V5dXBPckNoYW5nZSk7XHJcbiAgdXBsb2FkQ2FuY2VsQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25VcGxvYWRDYW5jZWxCdG5DbGljayk7XHJcbiAgdXBsb2FkQ2FuY2VsQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvblVwbG9hZENhbmNlbEJ0bkVudGVyUHJlc3MpO1xyXG4gIHVwbG9hZFN1Ym1pdEJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uVXBsb2FkU3VibWl0KTtcclxuICBbXS5mb3JFYWNoLmNhbGwocGljdHVyZXMsIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYWxsZXJ5Lm9uUGljdHVyZXNDbGljayk7XHJcbiAgfSk7XHJcbiAgZmlsdGVyUGhvdG8uYWRkRmlsdGVyc0V2ZW50cygpO1xyXG4gIHVwbG9hZEZpbGVOYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uVXBsb2FkRmlsZU5hbWVDaGFuZ2UpO1xyXG4gIHVwbG9hZERyb3Bib3guYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VudGVyJywgb25VcGxvYWREcm9wYm94RHJhZyk7XHJcbiAgdXBsb2FkRHJvcGJveC5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIG9uVXBsb2FkRHJvcGJveERyYWcpO1xyXG4gIHVwbG9hZERyb3Bib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uVXBsb2FkRHJvcGJveERyb3ApO1xyXG59O1xyXG52YXIgY29tbWVudFZhbGlkaXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gIHVwbG9hZENvbW1lbnQudmFsdWUgPSB1cGxvYWRDb21tZW50LnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgY29tbWVudFZhbGlkaXR5UmVzdWx0ID0gKHVwbG9hZENvbW1lbnQuY2hlY2tWYWxpZGl0eSgpICYmICh1cGxvYWRDb21tZW50LnZhbHVlLnRyaW0oKS5sZW5ndGggPj0gMzAgJiYgdXBsb2FkQ29tbWVudC52YWx1ZS50cmltKCkubGVuZ3RoIDw9IDEwMCkpO1xyXG4gIGlmIChjb21tZW50VmFsaWRpdHlSZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICBpZiAoY29tbWVudEVyck1zZyA9PT0gbnVsbCkge1xyXG4gICAgICBlcnJvckhhbmRsZXIoJ2NvbW1lbnRFcnJNc2cnLCB1cGxvYWRDb21tZW50LCAn0JTQu9C40L3QsCDQutC+0LzQvNC10L3RgtCw0YDQuNGPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQvtGCIDMwINC00L4gMTAwINGB0LjQvNCy0L7Qu9C+0LInKTtcclxuICAgICAgY29tbWVudEVyck1zZyA9IHVwbG9hZE92ZXJsYXkucXVlcnlTZWxlY3RvcignI2NvbW1lbnRFcnJNc2cnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbW1lbnRFcnJNc2cuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICB9XHJcbiAgICB1cGxvYWRDb21tZW50LnN0eWxlLmJvcmRlckNvbG9yID0gJ3JlZCc7XHJcbiAgICB1cGxvYWRTdWJtaXRCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoY29tbWVudEVyck1zZyAhPT0gbnVsbCkge1xyXG4gICAgICBjb21tZW50RXJyTXNnLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xyXG4gICAgfVxyXG4gICAgdXBsb2FkQ29tbWVudC5zdHlsZS5ib3JkZXJDb2xvciA9IHVwbG9hZENvbW1lbnQuY2hlY2tWYWxpZGl0eSgpID09PSBmYWxzZSA/ICdyZWQnIDogJ3JnYigxNjksIDE2OSwgMTY5KSc7XHJcbiAgICB1cGxvYWRTdWJtaXRCdG4uZGlzYWJsZWQgPSAhc2NhbGVWYWxpZGl0eVJlc3VsdDtcclxuICB9XHJcbiAgcmV0dXJuIGNvbW1lbnRWYWxpZGl0eVJlc3VsdDtcclxufTtcclxudmFyIGFkanVzdFNjYWxlID0gZnVuY3Rpb24gKHNjYWxlVmFsdWUpIHtcclxuICB1cGxvYWRJbWcuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKCcgKyBzY2FsZVZhbHVlIC8gMTAwICsgJyknO1xyXG59O1xyXG52YXIgcmVzZXRTY2FsZUlucHV0U3R5bGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdXBsb2FkSW1nLnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xyXG4gIHNjYWxlLnN0eWxlLm91dGxpbmUgPSAnbm9uZSc7XHJcbn07XHJcbnZhciBjaGFuZ2VTY2FsZSA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBpZiAoZXZ0LnRhcmdldC50YWdOYW1lID09PSAnQlVUVE9OJykge1xyXG4gICAgdmFyIGN1cnJlbnRTY2FsZSA9IHBhcnNlSW50KHNjYWxlLnZhbHVlLCAxMCk7XHJcbiAgICBpZiAoZXZ0LnRhcmdldCA9PT0gc2NhbGVEZWNCdG4pIHtcclxuICAgICAgaWYgKGN1cnJlbnRTY2FsZSA+IFNDQUxFX01BWCkge1xyXG4gICAgICAgIHNjYWxlLnZhbHVlID0gU0NBTEVfTUFYO1xyXG4gICAgICB9IGVsc2UgaWYgKChjdXJyZW50U2NhbGUgJSBTQ0FMRV9TVEVQICE9PSAwKSAmJiAoY3VycmVudFNjYWxlID4gU0NBTEVfTUlOKSAmJiAoY3VycmVudFNjYWxlIDwgU0NBTEVfTUFYKSkge1xyXG4gICAgICAgIHNjYWxlLnZhbHVlID0gKHBhcnNlSW50KGN1cnJlbnRTY2FsZSAvIFNDQUxFX1NURVAsIDEwKSkgKiBTQ0FMRV9TVEVQO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlLnZhbHVlID0gKGN1cnJlbnRTY2FsZSAtIFNDQUxFX1NURVAgPCBTQ0FMRV9NSU4pID8gU0NBTEVfTUlOIDogY3VycmVudFNjYWxlIC0gU0NBTEVfU1RFUDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChldnQudGFyZ2V0ID09PSBzY2FsZUluY0J0bikge1xyXG4gICAgICBpZiAoY3VycmVudFNjYWxlIDwgU0NBTEVfTUlOKSB7XHJcbiAgICAgICAgc2NhbGUudmFsdWUgPSBTQ0FMRV9NSU47XHJcbiAgICAgIH0gZWxzZSBpZiAoKGN1cnJlbnRTY2FsZSAlIFNDQUxFX1NURVAgIT09IDApICYmIChjdXJyZW50U2NhbGUgPiBTQ0FMRV9NSU4pICYmIChjdXJyZW50U2NhbGUgPCBTQ0FMRV9NQVgpKSB7XHJcbiAgICAgICAgc2NhbGUudmFsdWUgPSAocGFyc2VJbnQoY3VycmVudFNjYWxlIC8gU0NBTEVfU1RFUCwgMTApICsgMSkgKiBTQ0FMRV9TVEVQO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlLnZhbHVlID0gKGN1cnJlbnRTY2FsZSArIFNDQUxFX1NURVAgPiBTQ0FMRV9NQVgpID8gU0NBTEVfTUFYIDogY3VycmVudFNjYWxlICsgU0NBTEVfU1RFUDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHNjYWxlVmFsaWRpdHkoc2NhbGUudmFsdWUgKyAnJScpKSB7XHJcbiAgICAgIGluaXRpYWxpemVTY2FsZShzY2FsZS52YWx1ZSwgYWRqdXN0U2NhbGUpO1xyXG4gICAgfVxyXG4gICAgc2NhbGUudmFsdWUgKz0gJyUnO1xyXG4gIH1cclxufTtcclxudmFyIHNjYWxlVmFsaWRpdHkgPSBmdW5jdGlvbiAoc2NhbGVWYWx1ZSkge1xyXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICB2YXIgcGF0dGVybiA9IC9eXFxkezIsM30lJC87XHJcbiAgaWYgKHBhdHRlcm4udGVzdChzY2FsZVZhbHVlKSA9PT0gdHJ1ZSkge1xyXG4gICAgcmVzdWx0ID0gKChwYXJzZUludChzY2FsZVZhbHVlLCAxMCkgPj0gU0NBTEVfTUlOKSAmJiAocGFyc2VJbnQoc2NhbGVWYWx1ZSwgMTApIDw9IFNDQUxFX01BWCkgJiYgIShwYXJzZUludChzY2FsZVZhbHVlLCAxMCkgJSBTQ0FMRV9TVEVQKSk7XHJcbiAgfVxyXG4gIHNjYWxlVmFsaWRpdHlSZXN1bHQgPSByZXN1bHQ7XHJcbiAgaWYgKHNjYWxlVmFsaWRpdHlSZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICBpZiAoc2NhbGVFcnJNc2cgPT09IG51bGwpIHtcclxuICAgICAgZXJyb3JIYW5kbGVyKCdzY2FsZUVyck1zZycsIHNjYWxlSW5jQnRuLCAn0JzQsNGB0YjRgtCw0LEg0LfQsNC00LDQvSDQvdC10LLQtdGA0L3Qvjog0LzQuNC90LjQvNGD0LwgMjUlLCDQvNCw0LrRgdC40LzRg9C8IDEwMCUg0YEg0YjQsNCz0L7QvCDQsiAyNSUnKTtcclxuICAgICAgc2NhbGVFcnJNc2cgPSB1cGxvYWRPdmVybGF5LnF1ZXJ5U2VsZWN0b3IoJyNzY2FsZUVyck1zZycpO1xyXG4gICAgICBzY2FsZS5zdHlsZS5vdXRsaW5lID0gJzJweCBzb2xpZCByZWQnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2NhbGVFcnJNc2cuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcbiAgICAgIHNjYWxlLnN0eWxlLm91dGxpbmUgPSAnbm9uZSc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChzY2FsZUVyck1zZyAhPT0gbnVsbCkge1xyXG4gICAgICBzY2FsZUVyck1zZy5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICAgICAgc2NhbGUuc3R5bGUub3V0bGluZSA9ICdub25lJztcclxuICAgIH1cclxuICB9XHJcbiAgdXBsb2FkU3VibWl0QnRuLmRpc2FibGVkID0gIShyZXN1bHQgJiYgY29tbWVudFZhbGlkaXR5UmVzdWx0KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG52YXIgcmVzZXRGb3JtID0gZnVuY3Rpb24gKCkge1xyXG4gIHJlc2V0U2NhbGVJbnB1dFN0eWxlKCk7XHJcbiAgc2NhbGUudmFsdWUgPSBTQ0FMRV9NQVggKyAnJSc7XHJcbiAgcmVzZXRGaWx0ZXIoKTtcclxuICBmaWx0ZXJEZWZhdWx0LmNoZWNrZWQgPSB0cnVlO1xyXG4gIHVwbG9hZEltZy5jbGFzc05hbWUgPSAnZmlsdGVyLWltYWdlLXByZXZpZXcnO1xyXG4gIHVwbG9hZEltZy5zdHlsZS5maWx0ZXIgPSAnJztcclxuICBmaWx0ZXJTbGlkZXJCbG9jay5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICB1cGxvYWRDb21tZW50LnZhbHVlID0gJyc7XHJcbiAgdmFyIGVyck1lc3NhZ2VzID0gdXBsb2FkT3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKCcuZXJyLW1lc3NhZ2UnKTtcclxuICBbXS5mb3JFYWNoLmNhbGwoZXJyTWVzc2FnZXMsIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XHJcbiAgfSk7XHJcbiAgY29tbWVudFZhbGlkaXR5UmVzdWx0ID0gZmFsc2U7XHJcbiAgc2NhbGVWYWxpZGl0eVJlc3VsdCA9IHRydWU7XHJcbiAgdXBsb2FkU3VibWl0QnRuLmRpc2FibGVkID0gdHJ1ZTtcclxufTtcclxudmFyIGZvcm1WYWxpZGl0eSA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcmVzdWx0ID0gKGNvbW1lbnRWYWxpZGl0eSgpKSAmJiAoc2NhbGVWYWxpZGl0eShzY2FsZS52YWx1ZSkpO1xyXG4gIHVwbG9hZFN1Ym1pdEJ0bi5kaXNhYmxlZCA9ICFyZXN1bHQ7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIG9uVXBsb2FkT3ZlcmxheUVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGlmIChldnQua2V5Q29kZSA9PT0gRVNDX0tFWSkge1xyXG4gICAgY2xvc2VVcGxvYWRPdmVybGF5KCk7XHJcbiAgfVxyXG59O1xyXG52YXIgb25TY2FsZUJ0bnNDbGljayA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBjaGFuZ2VTY2FsZShldnQpO1xyXG59O1xyXG52YXIgb25TY2FsZUtleXVwID0gZnVuY3Rpb24gKCkge1xyXG4gIHNjYWxlVmFsaWRpdHkoc2NhbGUudmFsdWUpO1xyXG59O1xyXG52YXIgb25VcGxvYWRDb21tZW50Rm9jdXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uVXBsb2FkT3ZlcmxheUVzY1ByZXNzKTtcclxufTtcclxudmFyIG9uVXBsb2FkQ29tbWVudEJsdXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uVXBsb2FkT3ZlcmxheUVzY1ByZXNzKTtcclxufTtcclxudmFyIG9uVXBsb2FkQ29tbWVudEtleXVwT3JDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29tbWVudFZhbGlkaXR5KCk7XHJcbn07XHJcbnZhciBvblVwbG9hZENhbmNlbEJ0bkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gIGNsb3NlVXBsb2FkT3ZlcmxheSgpO1xyXG59O1xyXG52YXIgb25VcGxvYWRDYW5jZWxCdG5FbnRlclByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGlmIChldnQua2V5Q29kZSA9PT0gRU5URVJfS0VZKSB7XHJcbiAgICBjbG9zZVVwbG9hZE92ZXJsYXkoKTtcclxuICB9XHJcbn07XHJcbnZhciBvblVwbG9hZFN1Ym1pdCA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBpZiAoZm9ybVZhbGlkaXR5KCkgPT09IHRydWUpIHtcclxuICAgIHJlc2V0Rm9ybSgpO1xyXG4gICAgY2xvc2VVcGxvYWRPdmVybGF5KCk7XHJcbiAgfVxyXG59O1xyXG52YXIgb25VcGxvYWRGaWxlTmFtZUNoYW5nZSA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBbXS5mb3JFYWNoLmNhbGwocGljdHVyZXMsIGZ1bmN0aW9uIChlbCkge1xyXG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnYWxsZXJ5Lm9uUGljdHVyZXNDbGljayk7XHJcbiAgfSk7XHJcbiAgdmFyIGZpbGUgPSB1cGxvYWRGaWxlTmFtZS5maWxlc1swXTtcclxuICB2YXIgZmlsZU5hbWUgPSBmaWxlLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICB2YXIgbWF0Y2hlcyA9IEZJTEVfVFlQRVMuc29tZShmdW5jdGlvbiAoaXQpIHtcclxuICAgIHJldHVybiBmaWxlTmFtZS5lbmRzV2l0aChpdCk7XHJcbiAgfSk7XHJcbiAgaWYgKG1hdGNoZXMpIHtcclxuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHVwbG9hZEltZy5zcmMgPSByZWFkZXIucmVzdWx0O1xyXG4gICAgICBvcGVuVXBsb2FkT3ZlcmxheShldnQpO1xyXG4gICAgfSk7XHJcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICB9XHJcbiAgZmlsdGVyUGhvdG8gPSByZXF1aXJlKCcuL2ZpbHRlci1waG90by5qcycpO1xyXG59O1xyXG52YXIgb25VcGxvYWREcm9wYm94RHJhZyA9IGZ1bmN0aW9uIChldnQpIHtcclxuICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcbnZhciBvblVwbG9hZERyb3Bib3hEcm9wID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICB2YXIgZHQgPSBldnQuZGF0YVRyYW5zZmVyO1xyXG4gIHZhciBmaWxlcyA9IGR0LmZpbGVzO1xyXG4gIHVwbG9hZEZpbGVOYW1lLmZpbGVzID0gZmlsZXM7XHJcbn07XHJcbnVwbG9hZEZpbGVOYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uVXBsb2FkRmlsZU5hbWVDaGFuZ2UpO1xyXG51cGxvYWREcm9wYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdlbnRlcicsIG9uVXBsb2FkRHJvcGJveERyYWcpO1xyXG51cGxvYWREcm9wYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgb25VcGxvYWREcm9wYm94RHJhZyk7XHJcbnVwbG9hZERyb3Bib3guYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIG9uVXBsb2FkRHJvcGJveERyb3ApO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICB1cGxvYWRPdmVybGF5OiB1cGxvYWRPdmVybGF5LFxyXG4gIHVwbG9hZEZvcm06IHVwbG9hZEZvcm0sXHJcbiAgdXBsb2FkRmlsZU5hbWU6IHVwbG9hZEZpbGVOYW1lLFxyXG4gIG9uVXBsb2FkRmlsZU5hbWVDaGFuZ2U6IG9uVXBsb2FkRmlsZU5hbWVDaGFuZ2VcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9mb3JtLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGluaXRpYWxpemVGaWx0ZXJzICovXHJcbnZhciBpbml0aWFsaXplRmlsdGVycyA9IGZ1bmN0aW9uIChzZWxlY3RlZEZpbHRlciwgZmlsdGVyTmFtZSwgc2V0VmFsdWUsIGNiKSB7XHJcbiAgY2IoJ2ZpbHRlci0nICsgc2VsZWN0ZWRGaWx0ZXIsIGZpbHRlck5hbWUsIHNldFZhbHVlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5pdGlhbGl6ZUZpbHRlcnM7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5pdGlhbGl6ZS1maWx0ZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGluaXRpYWxpemVTY2FsZSAqL1xyXG52YXIgaW5pdGlhbGl6ZVNjYWxlID0gZnVuY3Rpb24gKHNjYWxlVmFsdWUsIGNiKSB7XHJcbiAgY2Ioc2NhbGVWYWx1ZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRpYWxpemVTY2FsZTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9pbml0aWFsaXplLXNjYWxlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIExvYWQgKi9cclxudmFyIGVycm9ySGFuZGxlciA9IHJlcXVpcmUoJy4vZXJyb3ItaGFuZGxlci5qcycpO1xyXG52YXIgbG9hZCA9IGZ1bmN0aW9uICh1cmwsIG9uTG9hZCkge1xyXG4gIHZhciBlbGVtZW50Rm9yRXJyb3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3JzJyk7XHJcbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XHJcbiAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgIG9uTG9hZCh4aHIucmVzcG9uc2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXJyb3JIYW5kbGVyKCcjbG9hZEVycm9yJywgZWxlbWVudEZvckVycm9yLCAn0J3QtdC40LfQstC10YHRgtC90YvQuSDRgdGC0LDRgtGD0YE6ICcgKyB4aHIuc3RhdHVzICsgJyAnICsgeGhyLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIGVycm9ySGFuZGxlcignI2xvYWRFcnJvcicsIGVsZW1lbnRGb3JFcnJvciwgJ9Cf0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LAg0YHQvtC10LTQuNC90LXQvdC40Y8nKTtcclxuICB9KTtcclxuICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigndGltZW91dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGVycm9ySGFuZGxlcignI2xvYWRFcnJvcicsIGVsZW1lbnRGb3JFcnJvciwgJ9CX0LDQv9GA0L7RgSDQvdC1INGD0YHQv9C10Lsg0LLRi9C/0L7Qu9C90LjRgtGM0YHRjyDQt9CwICcgKyB4aHIudGltZW91dCArICfQvNGBJyk7XHJcbiAgfSk7XHJcbiAgeGhyLnRpbWVvdXQgPSAxMDAwMDtcclxuICB4aHIub3BlbignR0VUJywgdXJsKTtcclxuICB4aHIuc2VuZCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsb2FkO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xvYWQuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFVSTCA9ICdodHRwczovL2ludGVuc2l2ZS1qYXZhc2NyaXB0LXNlcnZlci1ramd2eGZlcGpsLm5vdy5zaC9rZWtzdGFncmFtL2RhdGEnO1xyXG52YXIgcGhvdG9zID0gW107XHJcbnZhciBsb2FkID0gcmVxdWlyZSgnLi9sb2FkLmpzJyk7XHJcbnZhciBmaWx0ZXJQaG90byA9IHJlcXVpcmUoJy4vZmlsdGVyLXBob3RvLmpzJyk7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi9nYWxsZXJ5LmpzJyk7XHJcbnZhciBnYWxsZXJ5RmlsdGVyID0ge307XHJcbnZhciBmaWx0ZXJzQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVycycpO1xyXG5cclxudmFyIGluaXRHYWxsZXJ5ID0gZnVuY3Rpb24gKGxvYWRlZFBob3Rvcykge1xyXG4gIHBob3RvcyA9IGxvYWRlZFBob3RvcztcclxuICBmaWx0ZXJQaG90by5maWx0ZXJQaG90by5pbml0KGZpbHRlcnNCbG9jaywgcGhvdG9zLCBnYWxsZXJ5LnJlbmRlclBpY3R1cmVzKTtcclxufTtcclxuXHJcbmxvYWQoVVJMLCBpbml0R2FsbGVyeSk7XHJcblxyXG5pZiAoTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50Jykge1xyXG4gIGNvbnNvbGUubG9nKCfQoNCw0LHQvtGC0LDQtdGCIScpO1xyXG59XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogUGljdHVyZSAqL1xyXG52YXIgY3JlYXRlUGljdHVyZSA9IGZ1bmN0aW9uIChwaG90bykge1xyXG4gIHZhciBwaWN0dXJlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGljdHVyZS10ZW1wbGF0ZScpLmNvbnRlbnQ7XHJcbiAgdmFyIHBpY3R1cmVFbGVtZW50ID0gcGljdHVyZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBwaWN0dXJlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKS5zcmMgPSBwaG90by51cmw7XHJcbiAgcGljdHVyZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmUtY29tbWVudHMnKS50ZXh0Q29udGVudCA9IHBob3RvLmNvbW1lbnRzLmxlbmd0aDtcclxuICBwaWN0dXJlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGljdHVyZS1saWtlcycpLnRleHRDb250ZW50ID0gcGhvdG8ubGlrZXM7XHJcbiAgcmV0dXJuIHBpY3R1cmVFbGVtZW50O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQaWN0dXJlO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3BpY3R1cmUuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogUHJldmlldyAqL1xyXG52YXIgRU5URVJfS0VZID0gMTM7XHJcbnZhciBFU0NfS0VZID0gMjc7XHJcbnZhciBnYWxsZXJ5ID0gcmVxdWlyZSgnLi9nYWxsZXJ5LmpzJyk7XHJcbnZhciBnYWxsZXJ5T3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5LW92ZXJsYXknKTs7XHJcbnZhciBnYWxsZXJ5Q2xvc2VCdG4gPSBnYWxsZXJ5T3ZlcmxheS5xdWVyeVNlbGVjdG9yKCcuZ2FsbGVyeS1vdmVybGF5LWNsb3NlJyk7XHJcbnZhciBmb3JtID0gcmVxdWlyZSgnLi9mb3JtLmpzJyk7XHJcbnZhciBjcmVhdGVQcmV2aWV3ID0gZnVuY3Rpb24gKHBob3RvLCBkZXN0R2FsbGVyeSkge1xyXG4gIGRlc3RHYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpLnNyYyA9IHBob3RvLnVybDtcclxuICBkZXN0R2FsbGVyeS5xdWVyeVNlbGVjdG9yKCcubGlrZXMtY291bnQnKS50ZXh0Q29udGVudCA9IHBob3RvLmxpa2VzO1xyXG4gIGRlc3RHYWxsZXJ5LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50cy1jb3VudCcpLnRleHRDb250ZW50ID0gcGhvdG8uY29tbWVudHMubGVuZ3RoO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZmluZFBob3RvKGFycmF5LCB1cmwpIHtcclxuICB2YXIgcmVzdWx0ID0gLTE7XHJcbiAgYXJyYXkuZXZlcnkoZnVuY3Rpb24gKGVsLCBpKSB7XHJcbiAgICBpZiAoZWwudXJsID09PSB1cmwpIHtcclxuICAgICAgcmVzdWx0ID0gaTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGFycmF5W3Jlc3VsdF07XHJcbn1cclxudmFyIGNsb3NlUGljdHVyZSA9IGZ1bmN0aW9uICgpIHtcclxuICBnYWxsZXJ5T3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25QaWN0dXJlRXNjUHJlc3MpO1xyXG4gIGdhbGxlcnlDbG9zZUJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xvc2VCdG5DbGljayk7XHJcbiAgZ2FsbGVyeUNsb3NlQnRuLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbkNsb3NlQnRuRW50ZXJQcmVzcyk7XHJcbiAgZm9ybS51cGxvYWRGaWxlTmFtZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmb3JtLm9uVXBsb2FkRmlsZU5hbWVDaGFuZ2UpO1xyXG59O1xyXG52YXIgb3BlblBpY3R1cmUgPSBmdW5jdGlvbiAoZXZ0LCBwaG90b3NBcnIpIHtcclxuICBpZiAoZXZ0LmN1cnJlbnRUYXJnZXQuY2xhc3NOYW1lID09PSAncGljdHVyZScpIHtcclxuICAgIHZhciBwaWN0dXJlU3JjID0gZXZ0LmN1cnJlbnRUYXJnZXQuY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKCdzcmMnKTtcclxuICAgIHZhciBwaWN0dXJlT2JqID0gZmluZFBob3RvKHBob3Rvc0FyciwgcGljdHVyZVNyYyk7XHJcbiAgICBpZiAodHlwZW9mIHBpY3R1cmVPYmogPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIGNyZWF0ZVByZXZpZXcocGljdHVyZU9iaiwgZ2FsbGVyeU92ZXJsYXkpO1xyXG4gICAgICBnYWxsZXJ5T3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcclxuICAgIH1cclxuICB9XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uUGljdHVyZUVzY1ByZXNzKTtcclxuICBnYWxsZXJ5Q2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsb3NlQnRuQ2xpY2spO1xyXG4gIGdhbGxlcnlDbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25DbG9zZUJ0bkVudGVyUHJlc3MpO1xyXG4gIGZvcm0udXBsb2FkRmlsZU5hbWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZm9ybS5vblVwbG9hZEZpbGVOYW1lQ2hhbmdlKTtcclxufTtcclxudmFyIG9uUGljdHVyZUVzY1ByZXNzID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGlmIChldnQua2V5Q29kZSA9PT0gRVNDX0tFWSkge1xyXG4gICAgY2xvc2VQaWN0dXJlKCk7XHJcbiAgfVxyXG59O1xyXG52YXIgb25DbG9zZUJ0bkNsaWNrID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gIGNsb3NlUGljdHVyZSgpO1xyXG59O1xyXG52YXIgb25DbG9zZUJ0bkVudGVyUHJlc3MgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgaWYgKGV2dC5rZXlDb2RlID09PSBFTlRFUl9LRVkpIHtcclxuICAgIGNsb3NlUGljdHVyZSgpO1xyXG4gIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgY2xvc2VQaWN0dXJlOiBjbG9zZVBpY3R1cmUsXHJcbiAgb3BlblBpY3R1cmU6IG9wZW5QaWN0dXJlXHJcbn07XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3ByZXZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=