/* FilterPhoto */
'use strict';
var debounce = require('./debounce.js');
var NEW_PHOTOS_COUNT = 10;

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var filterByNew = function (photoArr) {
  var result = [];
  var randomPhotoIndex = 0;
  for (var i = 0; i < NEW_PHOTOS_COUNT; i++) {
    do {
      randomPhotoIndex = getRandomInRange(0, filterPhoto.photos.length - 1);
    }
    while (result.indexOf(filterPhoto.photos[randomPhotoIndex]) !== -1);
    result[i] = filterPhoto.photos[randomPhotoIndex];
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
  this.photos = [];
  this.afterApplyFunc = null;
}

FilterPhoto.prototype = {
  init: function (element, photos, cb) {
    if (typeof(cb) != 'function') {
      throw new Error('Переданный аргумент должен быть функцией');
    }
    this.filtersBlock = element;
    this.currentFilter = this.filtersBlock.querySelector('input[type="radio"]:checked').value;
    this.photos = photos;
    this.afterApplyFunc = cb;
    this.applyFilter();
    this.filtersBlock.classList.remove('hidden');
    this.addFiltersEvents(this);
  },
  applyFilter: function () {
    var filteredArrayPhotos = this.photos.slice();
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
