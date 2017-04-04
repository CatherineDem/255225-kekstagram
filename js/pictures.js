'use strict';

var LIKES_MIN = 15;

var LIKES_MAX = 500;

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

var photos = [];

var pictureTemplate = document.querySelector('#picture-template').content;

var picturesBlock = document.querySelector('.pictures');

var uploadForm = document.querySelector('.upload-overlay');

var gallery = document.querySelector('.gallery-overlay');

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomComment(cnt) {
  var comment = '';
  var useComments = [];
  var commentIndex = 0;
  for (var i = 1; i <= cnt; i++) {
    do {
      commentIndex = getRandomInRange(0, COMMENTS.length - 1);
    }
    while (useComments.indexOf(commentIndex) !== -1);
    useComments.push(commentIndex);
    comment += (cnt > 1) && (i < cnt) ? COMMENTS[commentIndex] + ' ' : COMMENTS[commentIndex];
  }
  return comment;
}

function Photo(num) {
  this.url = 'photos/{{' + num + '}}.jpg';
  this.likes = getRandomInRange(LIKES_MIN, LIKES_MAX);
  this.comment = getRandomComment(getRandomInRange(1, 2));
}

var createPhotos = function () {
  for (var i = 1; i < 26; i++) {
    var photo = new Photo(i);
    photos.push(photo);
  }
  return photos;
};

var createPictureElement = function (photo) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = photo.url;
  pictureElement.querySelector('.picture-comments').textContent = photo.comment;
  pictureElement.querySelector('.picture-likes').textContent = photo.likes;
  return pictureElement;
};

var fillBlockPictures = function () {
  var photosCollection = createPhotos();
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(createPictureElement(photos[i]));
  }
  picturesBlock.appendChild(fragment);
  return photosCollection;
};

var fillGallery = function (photo) {
  gallery.querySelector('img').src = photo.url;
  gallery.querySelector('.likes-count').textContent = photo.likes;
  gallery.querySelector('.comments-count').textContent = photo.comment;
};

photos = fillBlockPictures();
uploadForm.classList.add('invisible');
gallery.classList.remove('invisible');
fillGallery(photos[0]);
