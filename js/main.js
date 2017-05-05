'use strict';

var URL = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
var photos = [];
var load = require('./load.js');
var filterPhoto = require('./filter-photo.js');
var gallery = require('./gallery.js');
var galleryFilter = {};
var filtersBlock = document.querySelector('.filters');

var initGallery = function (loadedPhotos) {
  photos = loadedPhotos;
  filterPhoto.filterPhoto.init(filtersBlock, photos, gallery.renderPictures);
};

load(URL, initGallery);

if (NODE_ENV == 'development') {
  console.log('Работает!');
}

