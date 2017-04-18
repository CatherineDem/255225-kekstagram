'use strict';

window.initializeFilters = (function (selectedFilter, setValue, cb) {
  var filterName = '';
  switch (selectedFilter) {
    case 'chrome':
      filterName = 'grayscale';
      break;
    case 'sepia':
      filterName = 'sepia';
      break;
    case 'marvin':
      filterName = 'invert';
      setValue += '%';
      break;
    case 'phobos':
      filterName = 'blur';
      setValue += 'px';
      break;
    case 'heat':
      filterName = 'brightness';
      break;
    default:
      filterName = '';
  }
  cb('filter-' + selectedFilter, filterName, setValue);
});
