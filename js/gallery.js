/* Gallery */
'use strict';
var preview = require('./preview.js');
var filterPhoto = require('./filter-photo.js');
var createPicture = require('./picture.js');
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
