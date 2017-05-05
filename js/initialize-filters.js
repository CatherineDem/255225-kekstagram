/* initializeFilters */
'use strict';
var initializeFilters = function (selectedFilter, filterName, setValue, cb) {
  cb('filter-' + selectedFilter, filterName, setValue);
};

module.exports = initializeFilters;
