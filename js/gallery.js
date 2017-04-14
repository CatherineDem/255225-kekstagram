'use strict';

window.gallery = (function () {
  var photos = [];
  var picturesBlock = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var renderPictures = function () {
    var photosCollection = window.data;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photosCollection.length; i++) {
      fragment.appendChild(window.picture.createPictureElement(photosCollection[i]));
    }
    picturesBlock.appendChild(fragment);
    return photosCollection;
  };
  var onPicturesClick = function (evt) {
    evt.preventDefault();
    window.preview.openPicture(evt, photos);
  };
  window.form.uploadOverlay.classList.add('invisible');
  window.form.uploadForm.classList.remove('invisible');
  photos = renderPictures();
  var pictures = picturesBlock.querySelectorAll('.picture');
  pictures.forEach(function (el) {
    el.addEventListener('click', onPicturesClick);
  });
  return {
    galleryOverlay: galleryOverlay,
    pictures: pictures,
    onPicturesClick: onPicturesClick
  };
})();
