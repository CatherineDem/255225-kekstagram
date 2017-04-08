'use strict';

var LIKES_MIN = 15;

var LIKES_MAX = 500;

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

var photos = [];

var pictureTemplate = document.querySelector('#picture-template').content;

var picturesBlock = document.querySelector('.pictures');

var uploadOverlay = document.querySelector('.upload-overlay');

var gallery = document.querySelector('.gallery-overlay');

var galleryCloseBtn = gallery.querySelector('.gallery-overlay-close');

var uploadForm = document.querySelector('.upload-image');

var uploadFileName = uploadForm.querySelector('.upload-input');

var uploadCancelBtn = uploadOverlay.querySelector('.upload-form-cancel');

var uploadSubmitBtn = uploadOverlay.querySelector('.upload-form-submit');

var uploadComment = uploadOverlay.querySelector('.upload-form-description');

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomComment(cnt) {
  var comment = [];
  var useComments = [];
  var commentIndex = 0;
  for (var i = 1; i <= cnt; i++) {
    do {
      commentIndex = getRandomInRange(0, COMMENTS.length - 1);
    }
    while (useComments.indexOf(commentIndex) !== -1);
    useComments.push(commentIndex);
    comment[i - 1] = COMMENTS[commentIndex];
  }
  return comment;
}

function Photo(num) {
  this.url = 'photos/' + num + '.jpg';
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
  pictureElement.querySelector('.picture-comments').textContent = photo.comment.length;
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
  gallery.querySelector('.comments-count').textContent = photo.comment.length;
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
  return photos[result];
}

var onPictureEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closePicture();
  }
};

var closePicture = function () {
  gallery.classList.add('invisible');
  document.removeEventListener('keydown', onPictureEscPress);
};

var openPicture = function (evt) {
  if (evt.currentTarget.className === 'picture') {
    var pictureSrc = evt.currentTarget.children[0].getAttribute('src');
    var pictureObj = findPhoto(photos, pictureSrc);
    if (typeof pictureObj === 'object') {
      fillGallery(pictureObj);
      gallery.classList.remove('invisible');
    }
  }
  document.addEventListener('keydown', onPictureEscPress);
};

var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closeUploadOverlay();
  }
};

var closeUploadOverlay = function () {
  uploadOverlay.classList.add('invisible');
  uploadForm.classList.remove('invisible');
  uploadFileName.value = '';
  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

var openUploadOverlay = function () {
  uploadForm.classList.add('invisible');
  uploadOverlay.classList.remove('invisible');
  document.addEventListener('keydown', onUploadOverlayEscPress);
};

photos = fillBlockPictures();
uploadOverlay.classList.add('invisible');
uploadForm.classList.remove('invisible');

var pictures = picturesBlock.querySelectorAll('.picture');
pictures.forEach(function (el) {
  el.addEventListener('click', function (evt) {
    evt.preventDefault();
    openPicture(evt);
  });
});

galleryCloseBtn.addEventListener('click', function () {
  closePicture();
});

galleryCloseBtn.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    closePicture();
  }
});

uploadFileName.addEventListener('change', function (evt) {
  openUploadOverlay(evt);
});

uploadCancelBtn.addEventListener('click', function () {
  closeUploadOverlay();
});

uploadCancelBtn.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 13) {
    closeUploadOverlay();
  }
});

uploadComment.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadOverlayEscPress);
});

uploadComment.addEventListener('blur', function () {
  document.addEventListener('keydown', onUploadOverlayEscPress);
});

uploadSubmitBtn.addEventListener('click', function () {
  closeUploadOverlay();
});
