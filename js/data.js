'use strict';
window.data = (function () {
  var LIKES_MIN = 15;
  var LIKES_MAX = 500;
  var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var photos = [];
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
  return {
    createPhotos: createPhotos
  };
})();
