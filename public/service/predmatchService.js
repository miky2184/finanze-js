(function () {
    'use strict';
    angular.module('myApp').factory('predmatchService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', '$strings', function (modalService, $http, $interval, $rootScope, utilService, dataService, $strings) {
        var scope = $rootScope.$new();

        var srvc = {
            distinct: function (value, index, self) {
                return self.indexOf(value) === index;
            },
            gridOptionsPredMatch: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 22,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [
                    {
                        name: 'DATA_GAME',
                        displayName: 'DATA',
                        field: 'DATA_GAME',
                        width: 120,
                        pinnedLeft: true
                }, {
                        name: 'GIORNATA',
                        displayName: 'G.',
                        field: 'GIORNATA',
                        width: 50,
                        pinnedLeft: true
                }, {
                        name: 'CHAMPIONSHIP',
                        displayName: 'DIV',
                        field: 'CHAMPIONSHIP',
                        width: 70
                }, {
                        name: 'HOME',
                        displayName: 'HOME',
                        field: 'HOME',
                        width: 200
                }, {
                        name: 'AWAY',
                        displayName: 'AWAY',
                        field: 'AWAY',
                        width: 200
                }, {
                        name: 'PERC_1',
                        displayName: '%1',
                        field: 'PERC_1',
                        width: 50,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestWin) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_X',
                        displayName: '%X',
                        field: 'PERC_X',
                        width: 50,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestDraw) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_2',
                        displayName: '%2',
                        field: 'PERC_2',
                        width: 50,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestLoss) {
                                return 'best-bet';
                            }
                        }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPredMatch.gridApi = gridApi;
                    srvc.gridOptionsPredMatch.gridApi.core.handleWindowResize();
                }
            },
            loadPredMatch: function (season) {
                var dto = {
                    season: season.value.id
                };
                return $http.post($strings.REST.SERVER + '/predmatch', dto).then(function (resp) {

                    var divisions = resp.data.map(function (e) {
                        e['DATA_GAME'] = e['DATA_GAME'].substr(0, 10);
                        return e.entity['CHAMPIONSHIP'];
                    }).filter(srvc.distinct);

                    divisions.forEach(function (div) {
                        var matchesForDivision = resp.data.filter(function (m) {
                            return m['CHAMPIONSHIP'] === div;
                        })

                        var bestRow = -1;
                        var bestValue = -1;
                        var isWin = false;
                        var isDraw = false;
                        var isLoss = false;
                        for (var i = 0; i < matchesForDivision.length; i++) {
                            var win = false;
                            var draw = false;
                            var loss = false;
                            if (matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_X'] && matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_2']) {
                                win = true;
                            } else if (matchesForDivision[i]['PERC_X'] >= matchesForDivision[i]['PERC_2']) {
                                draw = true;
                            } else {
                                loss = true;
                            }

                            if (win) {
                                if (matchesForDivision[i]['PERC_1'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_1'];
                                    bestRow = i;
                                    isWin = true;
                                    isDraw = false;
                                    isLoss = false;
                                }
                            } else if (draw) {
                                if (matchesForDivision[i]['PERC_X'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_X'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = true;
                                    isLoss = false;
                                }
                            } else if (loss) {
                                if (matchesForDivision[i]['PERC_2'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_2'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = false;
                                    isLoss = true;
                                }
                            }
                        }

                        if (isWin) {
                            matchesForDivision[bestRow].bestWin = true;
                        } else if (isDraw) {
                            matchesForDivision[bestRow].bestDraw = true;
                        } else if (isLoss) {
                            matchesForDivision[bestRow].bestLoss = true;
                        }

                    });

                    srvc.gridOptionsPredMatch.data = resp.data;
                });
            }
        };

        return srvc;
    }]);
})();
