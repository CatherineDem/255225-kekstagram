'use strict';

window.filterPhoto = (function () {
  var URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
  var NEW_PHOTOS_COUNT = 10;
  var filtersBlock = document.querySelector('.filters');
  var currentFilter = filtersBlock.querySelector('input[type="radio"]:checked').value;
  var photos = [];
  var initPhotoArray = function (loadedPhotos) {
    photos = loadedPhotos;
    applyFilter();
  };
  function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var filterByNew = function (photoArr) {
    var result = [];
    var randomPhotoIndex = 0;
    for (var i = 0; i < NEW_PHOTOS_COUNT; i++) {
      do {
        randomPhotoIndex = getRandomInRange(0, photos.length - 1);
      }
      while (result.indexOf(photos[randomPhotoIndex]) !== -1);
      result[i] = photos[randomPhotoIndex];
    }
    return result;
  };
  var filterByDiscussed = function (photo1, photo2) {
    return photo2.comments.length - photo1.comments.length;
  };
  var applyFilter = function () {
    var filteredArrayPhotos = photos.slice();
    switch (currentFilter) {
      case 'new': filteredArrayPhotos = filterByNew(filteredArrayPhotos);
        break;
      case 'discussed': filteredArrayPhotos.sort(filterByDiscussed);
        break;
    }
    window.gallery.renderPictures(filteredArrayPhotos);
  };
  var onFilterClick = function (evt) {
    if (evt.target.getAttribute('type') === 'radio') {
      currentFilter = evt.target.value;
      window.debounce(applyFilter);
    }
  };
  var addFiltersEvents = function () {
    filtersBlock.addEventListener('click', onFilterClick);
  };
  var removeFiltersEvents = function () {
    filtersBlock.removeEventListener('click', onFilterClick);
  };
  window.load(URL, initPhotoArray);
  return {
    filtersBlock: filtersBlock,
    addFiltersEvents: addFiltersEvents,
    removeFiltersEvents: removeFiltersEvents
  };
})();
