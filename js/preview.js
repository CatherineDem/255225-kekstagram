/* Preview */
'use strict';
var ENTER_KEY = 13;
var ESC_KEY = 27;
var gallery = require('./gallery.js');
var galleryOverlay = document.querySelector('.gallery-overlay');;
var galleryCloseBtn = galleryOverlay.querySelector('.gallery-overlay-close');
var form = require('./form.js');
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

