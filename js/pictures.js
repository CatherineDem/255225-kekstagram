'use strict';

var LIKES_MIN = 15;

var LIKES_MAX = 500;

var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];

var SCALE_MIN = 25;

var SCALE_MAX = 100;

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

var scaleDecBtn = uploadOverlay.querySelector('.upload-resize-controls-button-dec');

var scaleIncBtn = uploadOverlay.querySelector('.upload-resize-controls-button-inc');

var scaleBtns = uploadOverlay.querySelectorAll('.upload-resize-controls-button');

var scale = uploadOverlay.querySelector('.upload-resize-controls-value');

var uploadImg = uploadOverlay.querySelector('.filter-image-preview');

var filterBtns = uploadOverlay.querySelector('.upload-filter-controls');

var errMessageTemplate = document.querySelector('#error-message').content;

var commentValidityResult = false;

var scaleValidityResult = true;

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


uploadComment.addEventListener('focus', function () {
  document.removeEventListener('keydown', onUploadOverlayEscPress);
});

uploadComment.addEventListener('blur', function () {
  document.addEventListener('keydown', onUploadOverlayEscPress);
});

var commentValidity = function () {
  commentValidityResult = uploadComment.checkValidity();
  if (commentValidityResult === false) {
    if (!uploadOverlay.querySelector('#commentErrMsg')) {
      createErrMessage('commentErrMsg', document.querySelector('.upload-form-description'), 'Длина комментария должна быть от 30 до 100 символов');
    } else {
      uploadOverlay.querySelector('#commentErrMsg').classList.remove('invisible');
    }
    uploadComment.style.borderColor = 'red';
    uploadSubmitBtn.disabled = true;
  } else {
    if (uploadOverlay.querySelector('#commentErrMsg')) {
      uploadOverlay.querySelector('#commentErrMsg').classList.add('invisible');
    }
    uploadSubmitBtn.disabled = !scaleValidityResult;
  }
  return commentValidityResult;
};

uploadComment.addEventListener('keydown', function () {
  uploadComment.style.borderColor = uploadComment.checkValidity() === false ? 'red' : 'rgb(169, 169, 169)';
  commentValidity();
});

uploadComment.addEventListener('change', function () {
  uploadComment.style.borderColor = uploadComment.checkValidity() === false ? 'red' : 'rgb(169, 169, 169)';
  commentValidity();
});

var resetFilter = function () {
  var filtersCollection = [];
  for (var i = 0; i < uploadImg.classList.length; i++) {
    if (uploadImg.classList[i].indexOf('filter-') > -1) {
      filtersCollection.push(uploadImg.classList[i]);
    }
  }
  uploadImg.classList.remove(filtersCollection.join(' '));
};

var resetScaleInputStyle = function () {
  uploadImg.style.transform = '';
  scale.style.outline = 'none';
};

var filterImg = function (evt) {
  if (evt.target.getAttribute('type') === 'radio') {
    resetFilter();
    var selectedFilter = evt.target.value;
    if (selectedFilter !== 'none') {
      uploadImg.classList.add('filter-' + selectedFilter);
    } else {
      uploadImg.classList.add('filter-image-preview');
    }
  }
};

filterBtns.addEventListener('click', function (evt) {
  filterImg(evt);
});

var scaleImg = function (evt) {
  var currentScale = parseInt(scale.value, 10);
  currentScale = ((currentScale % 25 !== 0) && (currentScale > 25) && (currentScale < 100)) ? SCALE_MIN : currentScale;
  if (evt.currentTarget === scaleDecBtn) {
    if (currentScale > 100) {
      scale.value = '100';
    } else {
      scale.value = (currentScale - 25 < SCALE_MIN) ? SCALE_MIN : currentScale - 25;
    }
  } else if (evt.currentTarget === scaleIncBtn) {
    if (currentScale < 25) {
      scale.value = '25';
    } else {
      scale.value = (currentScale + 25 > SCALE_MAX) ? SCALE_MAX : currentScale + 25;
    }
  }
  uploadImg.style.transform = 'scale(' + scale.value / 100 + ')';
  scale.value += '%';
  scaleValidity(scale.value);
};

scaleBtns.forEach(function (el) {
  el.addEventListener('click', function (evt) {
    evt.preventDefault();
    scaleImg(evt);
  });
});

var scaleValidity = function (scaleValue) {
  var result = false;
  var pattern = /^\d{2,3}%$/;
  if (pattern.test(scaleValue) === true) {
    result = ((parseInt(scaleValue, 10) >= 25) && (parseInt(scaleValue, 10) <= 100) && !(parseInt(scaleValue, 10) % 25));
  }
  scaleValidityResult = result;
  if (!scaleValidityResult) {
    if (!uploadOverlay.querySelector('#scaleErrMsg')) {
      createErrMessage('scaleErrMsg', uploadOverlay.querySelector('.upload-resize-controls-button-inc'), 'Масштаб задан неверно: минимум 25%, максимум 100% с шагом в 25%');
      scale.style.outline = '2px solid red';
    } else {
      uploadOverlay.querySelector('#scaleErrMsg').classList.remove('invisible');
      scale.style.outline = 'none';
    }
  } else {
    if (uploadOverlay.querySelector('#scaleErrMsg')) {
      uploadOverlay.querySelector('#scaleErrMsg').classList.add('invisible');
      scale.style.outline = 'none';
    }
  }
  uploadSubmitBtn.disabled = !(result && commentValidityResult);
  return result;
};

var resetForm = function () {
  resetScaleInputStyle();
  scale.value = '100%';
  resetFilter();
  uploadOverlay.querySelector('#upload-filter-none').checked = true;
  uploadImg.classList.add('filter-image-preview');
  uploadComment.value = '';
  var errMessages = uploadOverlay.querySelectorAll('.err-message');
  [].forEach.call(errMessages, function (el) {
    el.classList.add('invisible');
  });
};

var onUploadOverlayEscPress = function (evt) {
  if (evt.keyCode === 27) {
    closeUploadOverlay();
  }
};

var closeUploadOverlay = function () {
  resetForm();
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

var createErrMessage = function (id, element, errmess) {
  var errMessageElement = errMessageTemplate.cloneNode(true);
  errMessageElement.querySelector('.err-message').id = id;
  errMessageElement.querySelector('.err-message').textContent = errmess;
  element.insertAdjacentElement('afterEnd', errMessageElement.firstElementChild);
};

var formValidity = function () {
  var result = (commentValidity()) && (scaleValidity(scale.value));
  uploadSubmitBtn.disabled = !result;
  return result;
};

scale.addEventListener('keyup', function () {
  scaleValidity(scale.value);
});

uploadSubmitBtn.addEventListener('click', function (evt) {
  evt.preventDefault();
  if (formValidity()) {
    resetForm();
    closeUploadOverlay();
  }
});
