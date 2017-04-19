'use strict';

window.initializeFilters = (function (selectedFilter, filterName, setValue, cb) {
  cb('filter-' + selectedFilter, filterName, setValue);
});
