'use strict';

window.gallery = (function () {
  var URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
  var photos = [];
  var picturesBlock = document.querySelector('.pictures');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var pictures = [];
  var onPicturesClick = function (evt) {
    evt.preventDefault();
    window.preview.openPicture(evt, photos);
  };
  var renderPictures = function (photosCollection) {
    photos = photosCollection;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photosCollection.length; i++) {
      fragment.appendChild(window.createPicture(photosCollection[i]));
    }
    picturesBlock.appendChild(fragment);
    pictures = picturesBlock.querySelectorAll('.picture');
    pictures.forEach(function (el) {
      el.addEventListener('click', onPicturesClick);
    });
  };
  window.form.uploadOverlay.classList.add('invisible');
  window.form.uploadForm.classList.remove('invisible');
  photos = window.load(URL, renderPictures);
  return {
    galleryOverlay: galleryOverlay,
    pictures: pictures,
    onPicturesClick: onPicturesClick
  };
})();
