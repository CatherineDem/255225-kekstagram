'use strict';

window.picture = (function () {
  var pictureTemplate = document.querySelector('#picture-template').content;
  var createPictureElement = function (photo) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('img').src = photo.url;
    pictureElement.querySelector('.picture-comments').textContent = photo.comment.length;
    pictureElement.querySelector('.picture-likes').textContent = photo.likes;
    return pictureElement;
  };
  return {
    createPictureElement: createPictureElement
  };
})();
