(function () {
    'use strict';
    angular.module('myApp').factory('matchAnalysisService', ['modalService', '$http', '$interval', '$rootScope', 'utilService', 'dataService', function (modalService, $http, $interval, $rootScope, utilService, dataService) {
        var scope = $rootScope.$new();
        
        var editableCondition = function editableCondition(rowEntity, colDef) {
                if (rowEntity.giocata && new Date(rowEntity.dataGameNext) < new Date()) {
                    return false;
                }
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
                    displayName: 'Squadra',
                    field: 'team',
                    width: 120,
                    pinnedLeft: true
                }, {
                    name: 'punti',
                    displayName: 'Punti',
                    field: 'punti',
                    width: 35
                }, {
                    name: 'giornata',
                    displayName: '#G',
                    field: 'giornata',
                    width: 35
                }, {
                    name: 'vtot',
                    displayName: 'V',
                    field: 'vtot',
                    width: 35
                }, {
                    name: 'ptot',
                    displayName: 'P',
                    field: 'ptot',
                    width: 35
                }, {
                    name: 'stot',
                    displayName: 'S',
                    field: 'stot',
                    width: 35
                }, {
                    name: 'gf',
                    displayName: 'GF',
                    field: 'gf',
                    width: 35
                }, {
                    name: 'gs',
                    displayName: 'GS',
                    field: 'gs',
                    width: 35
                }, {
                    name: 'puntic',
                    displayName: 'Punti Casa',
                    field: 'puntic',
                    width: 35
                }, {
                    name: 'giornataHome',
                    displayName: '#GC',
                    field: 'giornataHome',
                    width: 35
                }, {
                    name: 'vc',
                    displayName: 'VC',
                    field: 'vc',
                    width: 35
                }, {
                    name: 'pc',
                    displayName: 'PC',
                    field: 'pc',
                    width: 35
                }, {
                    name: 'sc',
                    displayName: 'SC',
                    field: 'sc',
                    width: 35
                }, {
                    name: 'gfc',
                    displayName: 'GF Casa',
                    field: 'gfc',
                    width: 35
                }, {
                    name: 'gsc',
                    displayName: 'GS Casa',
                    field: 'gsc',
                    width: 35
                }, {
                    name: 'puntit',
                    displayName: 'Punti Trasferta',
                    field: 'puntit',
                    width: 35
                }, {
                    name: 'giornataAway',
                    displayName: '#GT',
                    field: 'giornataAway',
                    width: 35
                }, {
                    name: 'vt',
                    displayName: 'VT',
                    field: 'vt',
                    width: 35
                }, {
                    name: 'pt',
                    displayName: 'PT',
                    field: 'pt',
                    width: 35
                }, {
                    name: 'st',
                    displayName: 'ST',
                    field: 'st',
                    width: 35
                }, {
                    name: 'gft',
                    displayName: 'GF Trasferta',
                    field: 'gft',
                    width: 35
                }, {
                    name: 'gst',
                    displayName: 'GS Trasferta',
                    field: 'gst',
                    width: 35
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsClassifica.gridApi = gridApi;
                }
            },
            
            gridOptionsScontriDiretti: {
                columnDefs: [{
                    name: 'SEASON',
                    displayName: 'Season',
                    field: 'SEASON',
                    width: 60
                }, {
                    name: 'GIORNATA',
                    displayName: 'Giornata',
                    field: 'GIORNATA',
                    width: 60
                }, {
                    name: 'HOME_DESC',
                    displayName: 'Home',
                    field: 'HOME_DESC',
                    width: 60
                }, {
                    name: 'AWAY_DESC',
                    displayName: 'Away',
                    field: 'AWAY_DESC',
                    width: 60
                }, {
                    name: 'SCORE_HOME',
                    displayName: ' ',
                    field: 'SCORE_HOME',
                    width: 60
                }, {
                    name: 'SCORE_AWAY',
                    displayName: ' ',
                    field: 'SCORE_AWAY',
                    width: 60
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsScontriDiretti.gridApi = gridApi;
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
                columnDefs: [{
                    name: 'squadraCasa',
                    displayName: 'CASA',
                    field: 'squadraCasa',
                    width: 140,
                    pinnedLeft: true
                }, {
                    name: 'squadraTrasferta',
                    displayName: 'TRASFERTA',
                    field: 'squadraTrasferta',
                    width: 140,
                    pinnedLeft: true
                }, {
                    name: 'golCasa',
                    displayName: ' ',
                    field: 'golCasa',
                    width: 35,
                    pinnedLeft: true
                }, {
                    name: 'golTrasferta',
                    displayName: ' ',
                    field: 'golTrasferta',
                    width: 35,
                    pinnedLeft: true
                }, {
                    name: 'giocata',
                    displayName: 'Gioc.',
                    field: 'giocata',
                    width: 35,
                    pinnedLeft: true,
                    cellTemplate: 'templates/rows/checkboxIcon.html',
                    buttonNgClass: 'fas fa-futbol'
                }, {
                    name: 'percWin',
                    displayName: '%1',
                    field: 'percWin',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var winarray = grid.rows.map(function (e) {
                            return e.entity.percWin;
                        });
                        var percWinTot = 0;
                        winarray.forEach(function (match) {
                            percWinTot = percWinTot + match;
                        });
                        if (row.entity.percWin > row.entity.percDraw && row.entity.percWin > row.entity.percLoss && row.entity.percWin > (percWinTot / winarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'percDraw',
                    displayName: '%X',
                    field: 'percDraw',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var drawarray = grid.rows.map(function (e) {
                            return e.entity.percDraw;
                        });
                        var percDrawTot = 0;
                        drawarray.forEach(function (match) {
                            percDrawTot = percDrawTot + match;
                        });
                        if (row.entity.percWin < row.entity.percDraw && row.entity.percDraw > row.entity.percLoss && row.entity.percDraw > (percDrawTot / drawarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'percLoss',
                    displayName: '%2',
                    field: 'percLoss',
                    width: 55,
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var lossarray = grid.rows.map(function (e) {
                            return e.entity.percLoss;
                        });
                        var percLossTot = 0;
                        lossarray.forEach(function (match) {
                            percLossTot = percLossTot + match;
                        });
                        if (row.entity.percLoss > row.entity.percDraw && row.entity.percWin < row.entity.percLoss && row.entity.percLoss > (percLossTot / lossarray.length)) {
                            return 'best-bet';
                        }
                    }
                }, {
                    name: 'percgg',
                    displayName: '%GG',
                    field: 'percgg',
                    width: 55
                }, {
                    name: 'percO2',
                    displayName: '%O2.5',
                    field: 'percO2',
                    width: 55
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsNextGame.gridApi = gridApi;                    
                    srvc.gridOptionsNextGame.gridApi.selection.on.rowSelectionChanged(scope, srvc.doSelection);
                    gridApi.edit.on.afterCellEdit(scope, srvc.afterCellEditFunction);
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
                        idHome: cliccata.idHome,
                        idAway: cliccata.idAway,
                        season: cliccata.season
                    }
                    return $http.post('http://93.55.248.37:3001/scontriDiretti', match).then(function (resp) {
                        if (resp.data && resp.data.length > 0) {
                            srvc.gridOptionsScontriDiretti.data = resp.data;                            
                            srvc.scontriDiretti.squadraHome = resp.data[0]['HOME_DESC'];
                            srvc.scontriDiretti.squadraAway = resp.data[0]['AWAY_DESC'];
                            srvc.scontriDiretti.vinte = resp.data[0]['WIN'];
                            srvc.scontriDiretti.pareggiate = resp.data[0]['DRAW'];
                            srvc.scontriDiretti.perse = resp.data[0]['LOSS'];
                        } else {
                            srvc.gridOptionsScontriDiretti.data = [];
                            srvc.scontriDiretti = {};
                        }
                    });
                }
            },
            loadMatchAnalysis: function (season, giornata) {
                var dataMatchAnalysis = [];
                return $http.post('http://93.55.248.37:3001/classifica', season).then(function (resp) {
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
                    $interval(srvc.gridOptionsClassifica.gridApi.core.handleWindowResize, 100, 10);
                    var dataLastFiveGame = [];
                    return $http.post('http://93.55.248.37:3001/lastfivegame', season).then(function (resp) {
                        if (resp.data.length > 0) {
                            resp.data.map(function (obj) {
                                var tmp = {};
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
                                dataLastFiveGame.push(tmp);
                                return tmp;
                            });
                        }
                        var dto = {};
                        dto.idSeason = season.id;
                        dto.idGiornata = giornata.id;
                        return $http.post('http://93.55.248.37:3001/nextgame', dto).then(function (resp) {
                            var dataNextGame = [];
                            if (resp.data.length > 0) {
                                resp.data.map(function (obj) {
                                    var tmp = {};
                                    tmp.giornNext = obj['GIORNATA'];
                                    tmp.dataGameNext = obj['DATA_GAME'].substr(0, 10);
                                    tmp.idHome = obj['ID_HOME'];
                                    tmp.squadraCasa = obj['TEAM_HOME'];
                                    tmp.idAway = obj['ID_AWAY'];
                                    tmp.squadraTrasferta = obj['TEAM_AWAY'];
                                    tmp.golCasa = obj['SCORE_HOME'];
                                    tmp.golTrasferta = obj['SCORE_AWAY'];
                                    tmp.giocata = obj['GIOCATA'] === 'T' ? true : false;
                                    tmp.season = season.id;
                                    tmp.giornata = giornata.id;
                                    var winTotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'vtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var winHomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'vc') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var winLastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'vtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propWinHome = (winTotPercHome + winHomePercHome + winLastFiveHome) / 3;
                                    var drawTotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'ptot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var drawHomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'pc') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var drawLastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'ptot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propDrawHome = (drawTotPercHome + drawHomePercHome + drawLastFiveHome) / 3;
                                    var lossTotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'stot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var lossHomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'sc') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var lossLastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'stot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propLossHome = (lossTotPercHome + lossHomePercHome + lossLastFiveHome) / 3;
                                    var winTotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'vtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var winAwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'vt') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var winLastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'vtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propWinAway = (winTotPercAway + winAwayPercAway + winLastFiveAway) / 3;
                                    var drawTotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'ptot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var drawAwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'pt') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var drawLastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'ptot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propDrawAway = (drawTotPercAway + drawAwayPercAway + drawLastFiveAway) / 3;
                                    var lossTotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'stot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var lossAwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'st') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var lossLastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'stot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propLossAway = (lossTotPercAway + lossAwayPercAway + lossLastFiveAway) / 3;
                                    var ggTotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'ggtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var ggHomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'gghome') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var ggLastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'ggtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propGgHome = (ggTotPercHome + ggHomePercHome + ggLastFiveHome) / 3;
                                    var ggTotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'ggtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var ggAwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'ggaway') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var ggLastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'ggtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propGgAway = (ggTotPercAway + ggAwayPercAway + ggLastFiveAway) / 3;
                                    var ngTotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'ngtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var ngHomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'nghome') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var ngLastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'ngtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propNgHome = (ngTotPercHome + ngHomePercHome + ngLastFiveHome) / 3;
                                    var ngTotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'ngtot') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var ngAwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'ngaway') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var ngLastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'ngtot') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propNgAway = (ngTotPercAway + ngAwayPercAway + ngLastFiveAway) / 3;
                                    var over1TotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'over1') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var over1HomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'over1c') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var over1LastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'over1') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propOver1Home = (over1TotPercHome + over1HomePercHome + over1LastFiveHome) / 3;
                                    var over1TotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'over1') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var over1AwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'over1c') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var over1LastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'over1') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propOver1Away = (over1TotPercAway + over1AwayPercAway + over1LastFiveAway) / 3;
                                    var under1TotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'under1') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var under1HomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'under1t') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var under1LastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'under1') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propUnder1Home = (under1TotPercHome + under1HomePercHome + under1LastFiveHome) / 3;
                                    var under1TotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'under1') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var under1AwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'under1t') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var under1LastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'under1') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propUnder1Away = (under1TotPercAway + under1AwayPercAway + under1LastFiveAway) / 3;
                                    var over2TotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'over2') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var over2HomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'over2c') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var over2LastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'over2') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propOver2Home = (over2TotPercHome + over2HomePercHome + over2LastFiveHome) / 3;
                                    var over2TotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'over2') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var over2AwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'over2c') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var over2LastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'over2') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propOver2Away = (over2TotPercAway + over2AwayPercAway + over2LastFiveAway) / 3;
                                    var under2TotPercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'under2') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                                    var under2HomePercHome = utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'under2t') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                                    var under2LastFiveHome = utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'under2') / utilService.extractMatchValue(dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                                    var propUnder2Home = (under2TotPercHome + under2HomePercHome + under2LastFiveHome) / 3;
                                    var under2TotPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'under2') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                                    var under2AwayPercAway = utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'under2t') / utilService.extractMatchValue(dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                                    var under2LastFiveAway = utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'under2') / utilService.extractMatchValue(dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                                    var propUnder2Away = (under2TotPercAway + under2AwayPercAway + under2LastFiveAway) / 3;
                                    tmp.percWin = Math.round(((propWinHome + propLossAway) / 2) * 100) / 100;
                                    tmp.percDraw = Math.round(((propDrawHome + propDrawAway) / 2) * 100) / 100;
                                    tmp.percLoss = Math.round(((propLossHome + propWinAway) / 2) * 100) / 100;
                                    tmp.percgg = Math.round(((propGgHome + propGgAway) / 2) * 100) / 100;
                                    tmp.percng = Math.round(((propNgHome + propNgAway) / 2) * 100) / 100;
                                    tmp.percO1 = Math.round(((propOver1Home + propOver1Away) / 2) * 100) / 100;
                                    tmp.percU1 = Math.round(((propUnder1Home + propUnder1Away) / 2) * 100) / 100;
                                    tmp.percO2 = Math.round(((propOver2Home + propOver2Away) / 2) * 100) / 100;
                                    tmp.percU2 = Math.round(((propUnder2Home + propUnder2Away) / 2) * 100) / 100;
                                    dataNextGame.push(tmp);
                                    return tmp;
                                });
                            }
                            srvc.gridOptionsNextGame.data = dataNextGame;
                            $interval(srvc.gridOptionsNextGame.gridApi.core.handleWindowResize, 100, 10);
                        });
                    });
                });
            }            
        };
        return srvc;
    }]);
})();
