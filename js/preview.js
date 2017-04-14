'use strict';

window.preview = (function () {
  var galleryOverlay = window.gallery.galleryOverlay;
  var galleryCloseBtn = galleryOverlay.querySelector('.gallery-overlay-close');
  var createPreview = function (photo, destGallery) {
    destGallery.querySelector('img').src = photo.url;
    destGallery.querySelector('.likes-count').textContent = photo.likes;
    destGallery.querySelector('.comments-count').textContent = photo.comment.length;
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
    window.form.uploadFileName.addEventListener('change', window.form.onUploadFileNameChange);
  };
  var openPicture = function (evt, photosArr) {
    if (evt.currentTarget.className === 'picture') {
      var pictureSrc = evt.currentTarget.children[0].getAttribute('src');
      var pictureObj = findPhoto(photosArr, pictureSrc);
      if (typeof pictureObj === 'object') {
        createPreview(pictureObj, window.gallery.galleryOverlay);
        window.gallery.galleryOverlay.classList.remove('invisible');
      }
    }
    document.addEventListener('keydown', onPictureEscPress);
    galleryCloseBtn.addEventListener('click', onCloseBtnClick);
    galleryCloseBtn.addEventListener('keydown', onCloseBtnEnterPress);
    window.form.uploadFileName.removeEventListener('change', window.form.onUploadFileNameChange);
  };
  var onPictureEscPress = function (evt) {
    if (evt.keyCode === 27) {
      closePicture();
    }
  };
  var onCloseBtnClick = function (evt) {
    closePicture();
  };
  var onCloseBtnEnterPress = function (evt) {
    if (evt.keyCode === 13) {
      closePicture();
    }
  };
  return {
    closePicture: closePicture,
    openPicture: openPicture
  };
})();
