'use strict';

window.initializeFilters = (function () {
  var filterBtns = document.querySelector('.upload-filter-controls');
  var filterSliderBlock = filterBtns.querySelector('.upload-filter-level');
  var filterToggle = filterSliderBlock.querySelector('.upload-filter-level-pin');
  var filterLine = filterSliderBlock.querySelector('.upload-filter-level-line');
  var filterValue = filterSliderBlock.querySelector('.upload-filter-level-val');
  var toggleCoords = [];
  var shiftX = 0;
  var sliderCoords = [];
  var stepFilter = 1;
  var pointFilter = 1;
  var selectedFilter = '';
  var callBack = '';
  var toggleMousemove = function (evt) {
    var newLeft = (evt.pageX - shiftX - sliderCoords.left);
    newLeft = Math.round(newLeft / (stepFilter * pointFilter) * stepFilter * pointFilter);
    if (newLeft < 0) {
      newLeft = 0;
    }
    var rightEdge = filterLine.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }
    var setValue = (Math.ceil(newLeft / pointFilter)) * stepFilter;
    switch (selectedFilter) {
      case 'chrome':
        setFilterToggle(0, 1, setValue, stepFilter, 'grayscale');
        break;
      case 'sepia':
        setFilterToggle(0, 1, setValue, stepFilter, 'sepia');
        break;
      case 'marvin':
        setFilterToggle(0, 100, setValue, stepFilter, 'invert');
        break;
      case 'phobos':
        setFilterToggle(0, 5, setValue, stepFilter, 'blur');
        break;
      case 'heat':
        setFilterToggle(0, 3, setValue, stepFilter, 'brightness');
        break;
    }
  };
  var toggleMousedown = function (evt) {
    evt.preventDefault();
    toggleCoords = getCoords(filterToggle);
    shiftX = evt.pageX - toggleCoords.left;
    sliderCoords = getCoords(filterSliderBlock);
    document.addEventListener('mousemove', toggleMousemove);
    return false;
  };
  var toggleMouseup = function () {
    document.removeEventListener('mousemove', toggleMousemove);
  };
  var filterToggleDragstart = function () {
    return false;
  };
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }
  var setFilterToggle = function (minValue, maxValue, setValue, step, filterName) {
    stepFilter = step;
    pointFilter = (filterLine.offsetWidth / (maxValue - minValue)) * step;
    switch (filterName) {
      case 'grayscale':
      case 'sepia':
      case 'brightness':
        callBack(selectedFilter, filterName, setValue);
        break;
      case 'invert':
        callBack(selectedFilter, filterName, setValue + '%');
        break;
      case 'blur':
        callBack(selectedFilter, filterName, setValue + 'px');
        break;
    }
    var filterSetValue = Math.round(setValue / step * pointFilter);
    filterSetValue = filterSetValue > filterLine.offsetWidth ? filterLine.offsetWidth : filterSetValue;
    filterToggle.style.left = filterSetValue + 'px';
    filterValue.style.width = filterSetValue + 'px';
  };
  var resetFilter = function () {
    filterBtns.firstChild.checked = true;
    filterSliderBlock.classList.add('invisible');
  };
  var filterImg = function (evt, cb) {
    if (evt.target.getAttribute('type') === 'radio') {
      selectedFilter = evt.target.value;
      if (selectedFilter !== 'none') {
        filterSliderBlock.classList.remove('invisible');
        switch (selectedFilter) {
          case 'chrome':
            setFilterToggle(0, 1, 1, 0.01, 'grayscale');
            break;
          case 'sepia':
            setFilterToggle(0, 1, 1, 0.01, 'sepia');
            break;
          case 'marvin':
            setFilterToggle(0, 100, 100, 1, 'invert');
            break;
          case 'phobos':
            setFilterToggle(0, 5, 5, 1, 'blur');
            break;
          case 'heat':
            setFilterToggle(0, 3, 3, 0.01, 'brightness');
            break;
        }
      } else {
        selectedFilter = 'image-preview';
        filterSliderBlock.classList.add('invisible');
      }
      cb('filter-' + selectedFilter, '', 0);
    }
  };
  var onFiltersBtnClick = function (evt) {
    filterImg(evt, callBack);
  };
  var initializeFilterControll = function (cb) {
    callBack = cb;
    filterBtns.addEventListener('click', onFiltersBtnClick);
    filterValue.style.width = '0';
    filterToggle.style.left = '0';
    filterSliderBlock.classList.add('invisible');
    filterToggle.addEventListener('mousedown', toggleMousedown);
    document.addEventListener('mouseup', toggleMouseup);
    filterToggle.addEventListener('dragstart', filterToggleDragstart);
  };
  var deactivateFilterControll = function () {
    filterBtns.removeEventListener('click', onFiltersBtnClick);
    filterToggle.removeEventListener('mousedown', toggleMousedown);
    document.removeEventListener('mouseup', toggleMouseup);
    filterToggle.removeEventListener('dragstart', filterToggleDragstart);
  };
  return {
    initializeFilterControll: initializeFilterControll,
    deactivateFilterControll: deactivateFilterControll,
    resetFilter: resetFilter
  };
})();
