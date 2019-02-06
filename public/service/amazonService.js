(function () {
    'use strict';
    angular.module('myApp').factory('amazonService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'uiGridConstants', '$strings', function (modalService, $http, $interval, $rootScope, utilService, uiGridConstants, $strings) {
        var scope = $rootScope.$new();                    
        
        var srvc = {
            gridOptionsAmazon : {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 23,
                enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                multiSelect: false,
                columnDefs: [{
                    name: 'asin',
                    displayName: 'Prodotto',
                    field: 'asin',
                    width: '*'
            }, {
                    name: 'price',
                    displayName: 'Prezzo Desiderato',
                    field: 'price',
                    width: 100,
                    cellFilter: 'currency'
        }, {
                    name: 'dataInserimento',
                    displayName: 'Data Inserimento',
                    field: 'dataInserimento',
                    cellFilter: 'date:\'yyyy-MM-dd\'',
                    width: 100
        }, {
                    name: 'lastPrice',
                    displayName: 'Ultimo Prezzo',
                    field: 'lastPrice',
                    cellFilter: 'currency',
                    width: 100
        }, {
                    name: 'dataLastPrice',
                    displayName: 'Data Ultimo Prezzo',
                    field: 'dataLastPrice',
                    cellFilter: 'date:\'yyyy-MM-dd\'',
                    width: 100
        }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsAmazon.gridApi = gridApi;
                    gridApi.selection.on.rowSelectionChanged(scope, srvc.onSelectASIN);
                }
            },
            amazon: {},

            onSelectASIN : function onSelectASIN(row) {
                var asin = {};
                asin.asinOrig = row.entity.asinOrig;
                return $http.post($strings.REST.SERVER+'/amazonProduct', asin).then(function (resp) {                   
                    srvc.amazon.amzLink = resp.data.ItemLookupResponse.Items.Item.DetailPageURL;
                    srvc.amazon.amzPrice = resp.data.ItemLookupResponse.Items.Item.OfferSummary.LowestNewPrice.FormattedPrice;
                    srvc.amazon.amzImage = resp.data.ItemLookupResponse.Items.Item.LargeImage.URL;
                    srvc.amazon.amzHeight = resp.data.ItemLookupResponse.Items.Item.LargeImage.Height._;
                    srvc.amazon.amzWidth = resp.data.ItemLookupResponse.Items.Item.LargeImage.Width._;
                });
            },


            loadAmazonData : function () {

                var dataAmazon = [];

                return $http.get($strings.REST.SERVER+'/amazon').then(function (resp) {
                    resp.data.map(function (obj) {
                        var tmp = {};
                        tmp.asin = 'http://www.amazon.it/dp/' + obj['ASIN'];
                        tmp.asinOrig = obj['ASIN'];
                        tmp.price = obj['PRICE'];
                        tmp.dataInserimento = obj['DATA_INSERTIMENTO'];
                        tmp.lastPrice = obj['LAST_PRICE'];
                        tmp.dataLastPrice = obj['DATA_LAST_PRICE'];
                        dataAmazon.push(tmp);
                        return tmp;
                    });

                    srvc.gridOptionsAmazon.data = dataAmazon;
                    $interval(srvc.gridOptionsAmazon.gridApi.core.handleWindowResize, 100, 10);
                });
            }      
        };
        return srvc;
    }]);
})();
