(function () {
    'use strict';
    angular.module('myApp').factory('matchAnalysisService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', '$strings', function (modalService, $http, $interval, $rootScope, utilService, dataService, $strings) {
        var scope = $rootScope.$new();
        
        var editableCondition = function editableCondition(rowEntity, colDef) {
                if (colDef.name === 'golCasa' || colDef.name === 'golTrasferta') {
                    return true;
                }
                return false;
            };
        
        var checkEditableCondition = function checkEditableCondition(scope) {
                return editableCondition(scope.row.entity, scope.col.colDef);
            };            
        
        var srvc = {
            gridOptionsClassifica: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 22,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'position',
                    displayName: ' ',
                    field: 'position',
                    width: 35,
                    pinnedLeft: true
                }, {
                    name: 'team',
                    displayName: 'SQUADRA',
                    field: 'team',
                    width: 120,
                    pinnedLeft: true
                }, {
                    name: 'punti',
                    displayName: 'PT',
                    field: 'punti',
                    width: 45
                }, {
                    name: 'giornata',
                    displayName: '#G',
                    field: 'giornata',
                    width: 45
                }, {
                    name: 'vtot',
                    displayName: 'V',
                    field: 'vtot',
                    width: 45
                }, {
                    name: 'ptot',
                    displayName: 'N',
                    field: 'ptot',
                    width: 45
                }, {
                    name: 'stot',
                    displayName: 'P',
                    field: 'stot',
                    width: 45
                }, {
                    name: 'gf',
                    displayName: 'GF',
                    field: 'gf',
                    width: 45
                }, {
                    name: 'gs',
                    displayName: 'GS',
                    field: 'gs',
                    width: 45
                }, {
                    name: 'puntic',
                    displayName: 'PTH',
                    field: 'puntic',
                    width: 45
                }, {
                    name: 'giornataHome',
                    displayName: '#GH',
                    field: 'giornataHome',
                    width: 45
                }, {
                    name: 'vc',
                    displayName: 'VH',
                    field: 'vc',
                    width: 45
                }, {
                    name: 'pc',
                    displayName: 'NH',
                    field: 'pc',
                    width: 45
                }, {
                    name: 'sc',
                    displayName: 'PH',
                    field: 'sc',
                    width: 45
                }, {
                    name: 'gfc',
                    displayName: 'GFH',
                    field: 'gfc',
                    width: 45
                }, {
                    name: 'gsc',
                    displayName: 'GSH',
                    field: 'gsc',
                    width: 45
                }, {
                    name: 'puntit',
                    displayName: 'PTA',
                    field: 'puntit',
                    width: 45
                }, {
                    name: 'giornataAway',
                    displayName: '#GA',
                    field: 'giornataAway',
                    width: 45
                }, {
                    name: 'vt',
                    displayName: 'VA',
                    field: 'vt',
                    width: 45
                }, {
                    name: 'pt',
                    displayName: 'NA',
                    field: 'pt',
                    width: 45
                }, {
                    name: 'st',
                    displayName: 'PA',
                    field: 'st',
                    width: 45
                }, {
                    name: 'gft',
                    displayName: 'GFA',
                    field: 'gft',
                    width: 45
                }, {
                    name: 'gst',
                    displayName: 'GSA',
                    field: 'gst',
                    width: 45
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsClassifica.gridApi = gridApi;
                    srvc.gridOptionsClassifica.gridApi.core.handleWindowResize();
                }
            },
            
            gridOptionsPartitePrecedenti:{
                minRowsToShow: 5,
                columnDefs: [{
                    name: 'GIORNATA',
                    displayName: 'Giornata',
                    field: 'GIORNATA',
                    width: 40
                },{
                    name: 'THH',
                    displayName: 'SQD1 HOME',
                    field: 'THH',
                    width: 120
                }, {
                    name: 'TAH',
                    displayName: 'SQD2 HOME',
                    field: 'TAH',
                    width: 120
                }, {
                    name: 'SHH',
                    displayName: '',
                    field: 'SHH',
                    width: 55
                }, {
                    name: 'SAH',
                    displayName: '',
                    field: 'SAH',
                    width: 55
                }, {
                    name: 'THA',
                    displayName: 'SQD1 AWAY',
                    field: 'THA',
                    width: 120
                }, {
                    name: 'TAA',
                    displayName: 'SQD2 AWAY',
                    field: 'TAA',
                    width: 120
                }, {
                    name: 'SHA',
                    displayName: '',
                    field: 'SHA',
                    width: 50
                }, {
                    name: 'SAA',
                    displayName: '',
                    field: 'SAA',
                    width: 50
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPartitePrecedenti.gridApi = gridApi;
                    srvc.gridOptionsPartitePrecedenti.gridApi.core.handleWindowResize();
                }
            },
            
            gridOptionsScontriDiretti: {
                columnDefs: [{
                    name: 'division',
                    displayName: 'DIV',
                    field: 'division',
                    width: 40
                },{
                    name: 'SEASON',
                    displayName: 'Season',
                    field: 'SEASON',
                    width: 55
                }, {
                    name: 'GIORNATA',
                    displayName: 'Giornata',
                    field: 'GIORNATA',
                    width: 50
                }, {
                    name: 'HOME_DESC',
                    displayName: 'Home',
                    field: 'HOME_DESC',
                    width: 55
                }, {
                    name: 'AWAY_DESC',
                    displayName: 'Away',
                    field: 'AWAY_DESC',
                    width: 55
                }, {
                    name: 'SCORE_HOME',
                    displayName: 'FTHG',
                    field: 'SCORE_HOME',
                    width: 50
                }, {
                    name: 'SCORE_AWAY',
                    displayName: 'FTAG',
                    field: 'SCORE_AWAY',
                    width: 50
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsScontriDiretti.gridApi = gridApi;
                    srvc.gridOptionsScontriDiretti.gridApi.core.handleWindowResize();
                }
            },
            gridOptionsNextGame: {
                columnVirtualizationThreshold: 100,
                showGridFooter: false,
                minRowsToShow: 10,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                cellEditableCondition: checkEditableCondition,
                rowTemplate: 'templates/rows/deletableRow.html',
                multiSelect: false,
                columnDefs: [
                    {
                    name: 'HOME',
                    displayName: 'CASA',
                    field: 'HOME',
                    width: 145,
                    pinnedLeft: true
                }, {
                    name: 'AWAY',
                    displayName: 'TRASFERTA',
                    field: 'AWAY',
                    width: 145,
                    pinnedLeft: true
                }, {
                    name: 'golCasa',
                    displayName: 'FTHG',
                    field: 'golCasa',
                    width: 45,
                    pinnedLeft: true
                }, {
                    name: 'golTrasferta',
                    displayName: 'FTAG',
                    field: 'golTrasferta',
                    width: 45,
                    pinnedLeft: true
                }, {
                    name: 'giocata',
                    displayName: 'Gioc.',
                    field: 'giocata',
                    width: 45,
                    pinnedLeft: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-futbol'
                }, {
                    name: 'PERC_1',
                    displayName: '%1',
                    field: 'PERC_1',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var winarray = grid.rows.map(function (e) {
                            return e.entity['PERC_1'];
                        });
                        var percWinTot = 0;
                        winarray.forEach(function (match) {
                            percWinTot = percWinTot + match;
                        });
                        if (row.entity['PERC_1'] > row.entity['PERC_X'] && row.entity['PERC_1'] > row.entity['PERC_2'] && row.entity['PERC_1'] > (percWinTot / winarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'PERC_X',
                    displayName: '%X',
                    field: 'PERC_X',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var drawarray = grid.rows.map(function (e) {
                            return e.entity['PERC_X'];
                        });
                        var percDrawTot = 0;
                        drawarray.forEach(function (match) {
                            percDrawTot = percDrawTot + match;
                        });
                        if (row.entity['PERC_1'] < row.entity['PERC_X'] && row.entity['PERC_X'] > row.entity['PERC_2'] && row.entity['PERC_X'] > (percDrawTot / drawarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'PERC_2',
                    displayName: '%2',
                    field: 'PERC_2',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var lossarray = grid.rows.map(function (e) {
                            return e.entity['PERC_2'];
                        });
                        var percLossTot = 0;
                        lossarray.forEach(function (match) {
                            percLossTot = percLossTot + match;
                        });
                        if (row.entity['PERC_2'] > row.entity['PERC_X'] && row.entity['PERC_1'] < row.entity['PERC_2'] && row.entity['PERC_2'] > (percLossTot / lossarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'PRON_1X2',
                    displayName: '1X2',
                    field: 'PRON_1X2',
                    width: 55
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsNextGame.gridApi = gridApi;                    
                    srvc.gridOptionsNextGame.gridApi.selection.on.rowSelectionChanged(scope, srvc.doSelection);
                    gridApi.edit.on.afterCellEdit(scope, srvc.afterCellEditFunction);
                    srvc.gridOptionsNextGame.gridApi.core.handleWindowResize();
                    
                }
            },
            afterCellEditFunction: function (rowEntity, colDef, newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                rowEntity.dirty = true;
                dataService.data.dirty = true;
            },
            scontriDiretti: {},
            doSelection: function doSelection(row) {
                var cliccata = row.entity;
                if (cliccata) {
                    var match = {
                        idHome: cliccata['idHome'],
                        idAway: cliccata['idAway'],                        
                        giornata: cliccata['giornata'],
                        season: cliccata['season']
                    }
                    return $http.post($strings.REST.SERVER+'/scontriDiretti', match).then(function (resp) {
                        if (resp.data && resp.data.length > 0) {
                            srvc.gridOptionsScontriDiretti.data = resp.data;                            
                        } else {
                            srvc.gridOptionsScontriDiretti.data = [];
                            srvc.scontriDiretti = {};
                        }
                        return $http.post($strings.REST.SERVER+'/partitePrecedenti', match).then(function (resp) {
                            if (resp.data && resp.data.length > 0) {
                            srvc.gridOptionsPartitePrecedenti.data = resp.data;                            
                        } else {
                            srvc.gridOptionsPartitePrecedenti.data = [];
                            srvc.scontriDiretti = {};
                        }
                    });
                });
                }                                                                                          
            },
            loadMatchAnalysis: function (division, season, giornata) {
                var dataMatchAnalysis = [];        
                var dto = {
                   season : season.value.id,
                   division    : division.value.id
                };                
                return $http.post($strings.REST.SERVER+'/classifica', dto ).then(function (resp) {
                    var pos = 1;
                    if (resp.data.length > 0) {
                        resp.data.map(function (obj) {
                            var tmp = {};
                            tmp.position = pos;
                            pos = pos + 1;
                            tmp.id = obj['TEAM_ID'];
                            tmp.team = obj['TEAM_NAME'];
                            tmp.giornata = obj['GIORNATA'];
                            tmp.punti = obj['PUNTI'];
                            tmp.vtot = obj['WIN'];
                            tmp.ptot = obj['DRAW'];
                            tmp.stot = obj['LOSS'];
                            tmp.gf = obj['GOAL_FATTI'];
                            tmp.gs = obj['GOAL_SUBITI'];
                            tmp.giornataHome = obj['GIORNATA_HOME'];
                            tmp.puntic = obj['PUNTI_HOME'];
                            tmp.vc = obj['WIN_HOME'];
                            tmp.pc = obj['DRAW_HOME'];
                            tmp.sc = obj['LOSS_HOME'];
                            tmp.gfc = obj['GOAL_FATTI_HOME'];
                            tmp.gsc = obj['GOAL_SUBITI_HOME'];
                            tmp.giornataAway = obj['GIORNATA_AWAY'];
                            tmp.puntit = obj['PUNTI_AWAY'];
                            tmp.vt = obj['WIN_AWAY'];
                            tmp.pt = obj['DRAW_AWAY'];
                            tmp.st = obj['LOSS_AWAY'];
                            tmp.gft = obj['GOAL_FATTI_AWAY'];
                            tmp.gst = obj['GOAL_SUBITI_AWAY'];
                            tmp.ggtot = obj['GG'];
                            tmp.ngtot = obj['NG'];
                            tmp.over1 = obj['OVER1'];
                            tmp.under1 = obj['UNDER1'];
                            tmp.over2 = obj['OVER2'];
                            tmp.under2 = obj['UNDER2'];
                            tmp.gghome = obj['GG_HOME'];
                            tmp.nghome = obj['NG_HOME'];
                            tmp.over1c = obj['OVER1_HOME'];
                            tmp.under1c = obj['UNDER1_HOME'];
                            tmp.over2c = obj['OVER2_HOME'];
                            tmp.under2c = obj['UNDER2_HOME'];
                            tmp.ggaway = obj['GG_AWAY'];
                            tmp.ngaway = obj['NG_AWAY'];
                            tmp.over1t = obj['OVER1_AWAY'];
                            tmp.under1t = obj['UNDER1_AWAY'];
                            tmp.over2t = obj['OVER2_AWAY'];
                            tmp.under2t = obj['UNDER2_AWAY'];
                            dataMatchAnalysis.push(tmp);
                            return tmp;
                        });
                    }
                    srvc.gridOptionsClassifica.data = dataMatchAnalysis;
                                        
                    var dataLastFiveGame = [];                    
                        if (giornata && giornata.value && giornata.value.id) {
                            dto.giornata = giornata.value.id;                                   
                            return $http.post($strings.REST.SERVER+'/nextmatch', dto).then(function (resp) {                            
                                srvc.gridOptionsNextGame.data = resp.data.map(function(f){
                                    f['giocata'] = f['giocata'] === 'T' ? true : false;
                                    return f;
                                });
                            });                  
                        } else {
                            return;
                        }
                });
            }            
        };
        return srvc;
    }]);
})();
