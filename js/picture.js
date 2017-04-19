'use strict';

window.createPicture = (function (photo) {
  var pictureTemplate = document.querySelector('#picture-template').content;
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = photo.url;
  pictureElement.querySelector('.picture-comments').textContent = photo.comments.length;
  pictureElement.querySelector('.picture-likes').textContent = photo.likes;
  return pictureElement;
});
