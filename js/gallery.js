'use strict';

window.gallery = (function () {
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
    for (var i = picturesBlock.children.length - 1; i >= 0; i--) {
      var child = picturesBlock.children[i];
      child.parentElement.removeChild(child);
    }
    var fragment = document.createDocumentFragment();
    for (i = 0; i < photosCollection.length; i++) {
      fragment.appendChild(window.createPicture(photosCollection[i]));
    }
    picturesBlock.appendChild(fragment);
    pictures = picturesBlock.querySelectorAll('.picture');
    [].forEach.call(pictures, function (el) {
      el.addEventListener('click', onPicturesClick);
    });
    window.filterPhoto.filtersBlock.classList.remove('hidden');
    window.filterPhoto.addFiltersEvents();
  };
  window.form.uploadOverlay.classList.add('invisible');
  window.form.uploadForm.classList.remove('invisible');
  return {
    renderPictures: renderPictures,
    galleryOverlay: galleryOverlay,
    pictures: pictures,
    onPicturesClick: onPicturesClick
  };
})();
