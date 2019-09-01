(function () {
    'use strict';
    angular.module('myApp').factory('predmatchService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', '$strings', function (modalService, $http, $interval, $rootScope, utilService, dataService, $strings) {
        var scope = $rootScope.$new();

        var editableCondition = function editableCondition(rowEntity, colDef) {            
            if (colDef.name === 'golCasa' || colDef.name === 'golTrasferta' || colDef.name === 'giocata') {
                return true;
            }
            return false;
        };

        var checkEditableCondition = function checkEditableCondition(scope) {
            return editableCondition(scope.row.entity, scope.col.colDef);
        };

        var srvc = {
            distinct: function (value, index, self) {
                return self.indexOf(value) === index;
            },
            afterCellEditFunction: function (rowEntity, colDef, newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                rowEntity.dirty = true;
                dataService.data.dirty = true;
            },
            gridOptionsPredMatch: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 22,
                enableFiltering: true,
                selectionRowHeaderWidth: 35,
                enableSorting: true,
                enableGridMenu: true,
                enableColumnMenus: false,
                cellEditableCondition: checkEditableCondition,
                rowTemplate: 'templates/rows/deletableRow.html',
                columnDefs: [
                    {
                        name: 'DATA_GAME',
                        displayName: 'DATA',
                        field: 'DATA_GAME',
                        width: 120,
                        pinnedLeft: true
                }, {
                        name: 'giornata',
                        displayName: 'G.',
                        field: 'giornata',
                        width: 50,
                        pinnedLeft: true
                }, {
                        name: 'division',
                        displayName: 'DIV',
                        field: 'division',
                        width: 70,
                        pinnedLeft: true
                }, {
                        name: 'HOME',
                        displayName: 'HOME',
                        field: 'HOME',
                        width: 200,
                        pinnedLeft: true
                }, {
                        name: 'AWAY',
                        displayName: 'AWAY',
                        field: 'AWAY',
                        width: 200,
                        pinnedLeft: true
                }, {
                        name: 'golCasa',
                        displayName: 'FTHG',
                        field: 'golCasa',
                        width: 50,
                        pinnedLeft: true
                }, {
                        name: 'golTrasferta',
                        displayName: 'FTAG',
                        field: 'golTrasferta',
                        width: 50,
                        pinnedLeft: true
                }, {
                        name: 'giocata',
                        displayName: 'Gioc.',
                        field: 'giocata',
                        width: 50,
                        pinnedLeft: true,
                        cellTemplate: 'templates/rows/checkboxIcon.html',
                        buttonNgClass: 'fas fa-futbol'
                },{
                        name: 'rinviata',
                        displayName: 'Rinv.',
                        field: 'rinviata',
                        width: 50,
                        pinnedLeft: true,
                        cellTemplate: 'templates/rows/checkboxIcon.html',
                        buttonNgClass: 'fa fa-calendar'
                }, {
                        name: 'PERC_1',
                        displayName: '%1',
                        field: 'PERC_1',
                        width: 60,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestWin) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_X',
                        displayName: '%X',
                        field: 'PERC_X',
                        width: 60,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestDraw) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_2',
                        displayName: '%2',
                        field: 'PERC_2',
                        width: 60,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestLoss) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_GG',
                        displayName: '%GG',
                        field: 'PERC_GG',
                        width: 60,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestGg) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_O1',
                        displayName: '%O1.5',
                        field: 'PERC_O1',
                        width: 70,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestO1) {
                                return 'best-bet';
                            }
                        }
                }, {
                        name: 'PERC_O2',
                        displayName: '%O2.5',
                        field: 'PERC_O2',
                        width: 70,
                        cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                            if (row.entity.bestO2) {
                                return 'best-bet';
                            }
                        }
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPredMatch.gridApi = gridApi;
                    srvc.gridOptionsPredMatch.gridApi.core.handleWindowResize();
                    gridApi.edit.on.afterCellEdit(scope, srvc.afterCellEditFunction);
                }
            },
            loadPredMatch: function (season) {
                if (!season) {
                    return;
                }
                var dto = {
                    season: season.value.id
                };
                return $http.post($strings.REST.SERVER + '/predmatch', dto).then(function (resp) {                    

                    function bestBetAll(matchesForDivision) {
                        var bestRow = -1;
                        var bestValue = -1;
                        var isWin = false;
                        var isDraw = false;
                        var isLoss = false;
                        var isGg = false;
                        var isO1 = false;
                        var isO2 = false;
                        for (var i = 0; i < matchesForDivision.length; i++) {
                            var win = false;
                            var draw = false;
                            var loss = false;
                            var gg = false;
                            var o1 = false;
                            var o2 = false;
                            if (matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_X'] &&
                                matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_2'] &&
                                matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_GG'] &&
                                matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_O1'] &&
                                matchesForDivision[i]['PERC_1'] >= matchesForDivision[i]['PERC_O2']) {
                                win = true;
                            } else if (matchesForDivision[i]['PERC_X'] >= matchesForDivision[i]['PERC_2'] &&
                                matchesForDivision[i]['PERC_X'] >= matchesForDivision[i]['PERC_GG'] &&
                                matchesForDivision[i]['PERC_X'] >= matchesForDivision[i]['PERC_O1'] &&
                                matchesForDivision[i]['PERC_X'] >= matchesForDivision[i]['PERC_O2']) {
                                draw = true;
                            } else if (matchesForDivision[i]['PERC_2'] >= matchesForDivision[i]['PERC_GG'] &&
                                matchesForDivision[i]['PERC_2'] >= matchesForDivision[i]['PERC_O1'] &&
                                matchesForDivision[i]['PERC_2'] >= matchesForDivision[i]['PERC_O2']) {
                                loss = true;
                            } else if (matchesForDivision[i]['PERC_GG'] >= matchesForDivision[i]['PERC_O1'] &&
                                matchesForDivision[i]['PERC_GG'] >= matchesForDivision[i]['PERC_O2']) {
                                gg = true;
                            } else if (matchesForDivision[i]['PERC_O1'] >= matchesForDivision[i]['PERC_O2']) {
                                o1 = true;
                            } else {
                                o2 = true;
                            }

                            if (win) {
                                if (matchesForDivision[i]['PERC_1'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_1'];
                                    bestRow = i;
                                    isWin = true;
                                    isDraw = false;
                                    isLoss = false;
                                    isGg = false;
                                    isO1 = false;
                                    isO2 = false;
                                }
                            } else if (draw) {
                                if (matchesForDivision[i]['PERC_X'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_X'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = true;
                                    isLoss = false;
                                    isGg = false;
                                    isO1 = false;
                                    isO2 = false;
                                }
                            } else if (loss) {
                                if (matchesForDivision[i]['PERC_2'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_2'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = false;
                                    isLoss = true;
                                    isGg = false;
                                    isO1 = false;
                                    isO2 = false;
                                }
                            } else if (gg) {
                                if (matchesForDivision[i]['PERC_GG'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_GG'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = false;
                                    isLoss = false;
                                    isGg = true;
                                    isO1 = false;
                                    isO2 = false;
                                }
                            } else if (o1) {
                                if (matchesForDivision[i]['PERC_O1'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_O1'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = false;
                                    isLoss = false;
                                    isGg = false;
                                    isO1 = true;
                                    isO2 = false;
                                }
                            } else if (o2) {
                                if (matchesForDivision[i]['PERC_O2'] > bestValue) {
                                    bestValue = matchesForDivision[i]['PERC_O2'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = false;
                                    isLoss = false;
                                    isGg = false;
                                    isO1 = false;
                                    isO2 = true;
                                }
                            }
                        }
                        if (isWin) {
                            matchesForDivision[bestRow].bestWin = true;
                        } else if (isDraw) {
                            matchesForDivision[bestRow].bestDraw = true;
                        } else if (isLoss) {
                            matchesForDivision[bestRow].bestLoss = true;
                        } else if (isGg) {
                            matchesForDivision[bestRow].bestGg = true;
                        } else if (isO1) {
                            matchesForDivision[bestRow].bestO1 = true;
                        } else if (isO2) {
                            matchesForDivision[bestRow].bestO2 = true;
                        }
                    }

                    function bestBet1X2(matchesForDivision) {
                        var isWin = false;
                        var isDraw = false;
                        var isLoss = false;
                        var bestRow = -1;
                        var bestValue = -1;
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
                                if (matchesForDivision[i]['PERC_1'] > bestValue && !(matchesForDivision[i].bestGg || matchesForDivision[i].bestO1 || matchesForDivision[i].bestO2)) {
                                    bestValue = matchesForDivision[i]['PERC_1'];
                                    bestRow = i;
                                    isWin = true;
                                    isDraw = false;
                                    isLoss = false;

                                }
                            } else if (draw) {
                                if (matchesForDivision[i]['PERC_X'] > bestValue && !(matchesForDivision[i].bestGg || matchesForDivision[i].bestO1 || matchesForDivision[i].bestO2)) {
                                    bestValue = matchesForDivision[i]['PERC_X'];
                                    bestRow = i;
                                    isWin = false;
                                    isDraw = true;
                                    isLoss = false;
                                }
                            } else if (loss) {
                                if (matchesForDivision[i]['PERC_2'] > bestValue && !(matchesForDivision[i].bestGg || matchesForDivision[i].bestO1 || matchesForDivision[i].bestO2)) {
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
                    }

                    var divisions = resp.data.map(function (e) {
                        e['DATA_GAME'] = e['DATA_GAME'].substr(0, 10);
                        e.giocata = e['GIOCATA'] === 'T' ? true : false;                                    
                        e.rinviata = e['rinviata'] === 'T' ? true : false;
                        return e['division'];
                    }).filter(srvc.distinct);

                    divisions.forEach(function (div) {
                        var matchesForDivision = resp.data.filter(function (m) {
                            return m['division'] === div;
                        })

                        bestBetAll(matchesForDivision);
                        bestBet1X2(matchesForDivision);

                    });

                    srvc.gridOptionsPredMatch.data = resp.data;
                });
            }
        };

        return srvc;
    }]);
})();
