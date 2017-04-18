'use strict';

window.form = (function () {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.querySelector('.upload-image');
  var uploadFileName = uploadForm.querySelector('.upload-input');
  var uploadCancelBtn = uploadOverlay.querySelector('.upload-form-cancel');
  var uploadSubmitBtn = uploadOverlay.querySelector('.upload-form-submit');
  var uploadComment = uploadOverlay.querySelector('.upload-form-description');
  var uploadImg = uploadOverlay.querySelector('.filter-image-preview');
  var commentValidityResult = false;
  var scale = uploadOverlay.querySelector('.upload-resize-controls-value');
  var adjustScale = function (scaleValue) {
    uploadImg.style.transform = 'scale(' + scaleValue / 100 + ')';
  };
  var applyFilter = function (filterClass, filterName, setValue) {
    var currentFilter = uploadImg.className;
    if (currentFilter !== filterName) {
      uploadImg.classList.remove(currentFilter);
    }
    uploadImg.classList.add(filterClass);
    if (filterName) {
      uploadImg.style.filter = filterName + '(' + setValue + ')';
    } else {
      uploadImg.style.filter = '';
    }
  };
  var openUploadOverlay = function () {
    uploadForm.classList.add('invisible');
    uploadOverlay.classList.remove('invisible');
    document.addEventListener('keydown', onUploadOverlayEscPress);
    window.initializeScale.initializeScaleControll(adjustScale);
    window.initializeFilters.initializeFilterControll(applyFilter);
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
    window.initializeScale.deactivateScaleControll();
    window.initializeFilters.deactivateFilterControll();
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
        window.errorHandler.createErrMessage('commentErrMsg', document.querySelector('.upload-form-description'), 'Длина комментария должна быть от 30 до 100 символов');
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
      uploadSubmitBtn.disabled = !window.initializeScale.scaleValidityResult;
    }
    return commentValidityResult;
  };
  var resetForm = function () {
    uploadImg.style.transform = '';
    window.initializeScale.resetScaleControll();
    window.initializeFilters.resetFilter();
    uploadOverlay.querySelector('#upload-filter-none').checked = true;
    uploadImg.classList.add('filter-image-preview');
    uploadImg.style.filter = '';
    uploadComment.value = '';
    var errMessages = uploadOverlay.querySelectorAll('.err-message');
    [].forEach.call(errMessages, function (el) {
      el.classList.add('invisible');
    });
    uploadSubmitBtn.disabled = true;
  };
  var formValidity = function () {
    var result = (commentValidity()) && (window.initializeScale.scaleValidity(scale.value));
    uploadSubmitBtn.disabled = !result;
    return result;
  };
  var onUploadOverlayEscPress = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      closeUploadOverlay();
    }
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
    onUploadFileNameChange: onUploadFileNameChange,
    uploadSubmitBtn: uploadSubmitBtn
  };
})();
