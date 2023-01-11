(function () {
  'use strict';
  angular.module('myApp')

    .factory('utilService', ['dataService', function (dataService) {
      var srvc = {

        ultimo: function ultimo(mese, anno) {
          var d = new Date(anno, mese, 0);
          if (mese === 2) {
            return 28;
          }
          return d.getDate();
        },                  

        b64toBlob: function b64toBlob(b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = b64Data;
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, {
            type: contentType
          });
          return blob;
        },

        sortByKey: function sortByKey(array, key) {
          return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
        },

        add: function add(a, b) {
          return a + b;
        },

        filterArray: function filterArray(test_array) {
          var index = -1,
            arr_length = test_array ? test_array.length : 0,
            resIndex = -1,
            result = [];

          while (++index < arr_length) {
            var value = test_array[index];

            if (value) {
              result[++resIndex] = value;
            }
          }

          return result;
        },

        nvl: function nvl(value) {
          if (isNaN(Number(value))) {
            return 0;
          }
          return Number(value);
        },

        extractMatchValue: function extractMatchValue(arrayData, id, prop) {
          return srvc.nvl(arrayData.filter(function (match) {
            return match.id === id;
          }).map(function (a) {
            return a[prop];
          })[0]);
        },
          
        sumArray:  function sumArray(array, field) {
            var total = 0.0;
            array.forEach(function (obj) {
                total += obj[field] || 0;
            });
            return total;
        },
         max: function max(array){
             var max = 0;
             array.forEach(function(obj){
                 if (Number(obj) > max){
                     max = Number(obj);
                 }
             });
             return Number(max);
         },
          
          dateToString: function dateToString(date){
              
              var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + '-' + monthIndex + '-' + year;
              
          }

      };
      return srvc;
    }]);
})();
