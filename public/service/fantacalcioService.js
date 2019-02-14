(function () {
    'use strict';
    angular.module('myApp').factory('fantacalcioService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', function (modalService, $http, $interval, $strings, uiGridConstants) {
        var srvc = {
            gridOptionsPandathinaikos: {
                columnVirtualizationThreshold: 100,
                minRowsToShow: 25,
                enableFiltering: true,
                selectionRowHeaderWidth: 35,
                enableColumnMenus: false,
                columnDefs: [{
                    name: 'ID',
                    displayName: 'ID',
                    field: 'ID',
                    width: 50,
                    pinnedLeft: true
                }, {
                    name: 'RUOLO',
                    displayName: 'R',
                    field: 'RUOLO',
                    width: 30,
                    pinnedLeft: true
                }, {
                    name: 'GIOCATORE',
                    displayName: 'Giocatore',
                    field: 'GIOCATORE',
                    width: 200,
                    pinnedLeft: true
                }, {
                    name: 'TEAM_NAME',
                    displayName: 'Squadra',
                    field: 'TEAM_NAME',
                    width: '*',
                    pinnedLeft: true,
                    cellClass: 'cellRightBorder',
                }, {
                    name: 'VALORE_ACQUISTO',
                    displayName: 'Val. Acqs.',
                    field: 'VALORE_ACQUISTO',
                    cellClass: 'cellLeftRightBorder',
                    width: 50
                }, {
                    name: 'PG_TOT',
                    displayName: 'Gioc.',
                    field: 'PG_TOT',
                    cellClass: 'cellLeftBorder',
                    width: 50
                }, {
                    name: 'MEDIA_MAGIC_TOT',
                    displayName: 'Magic Media',
                    field: 'MEDIA_MAGIC_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'MEDIA_VOTO_TOT',
                    displayName: 'Media Voto',
                    field: 'MEDIA_VOTO_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'GOL_TOT',
                    displayName: 'Gol',
                    field: 'GOL_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ASSIST_TOT',
                    displayName: 'Assist',
                    field: 'ASSIST_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'RIGORE_TOT',
                    displayName: 'Rig.',
                    field: 'RIGORE_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AUTORETE_TOT',
                    displayName: 'Autorete',
                    field: 'AUTORETE_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AMMONIZIONE_TOT',
                    displayName: 'Amm.',
                    field: 'AMMONIZIONE_TOT',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ESPULSIONE_TOT',
                    displayName: 'Esp.',
                    field: 'ESPULSIONE_TOT',
                    cellClass: 'cellRightBorder',
                    width: 50
                }, {
                    name: 'PG_HOME',
                    displayName: 'Gioc. Home',
                    field: 'PG_HOME',
                    cellClass: 'cellLeftBorder',
                    width: 50
                }, {
                    name: 'MEDIA_MAGIC_PUNTI_HOME',
                    displayName: 'Magic Media Home',
                    field: 'MEDIA_MAGIC_PUNTI_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'MEDIA_VOTO_PAGELLA_HOME',
                    displayName: 'Media Voto Home',
                    field: 'MEDIA_VOTO_PAGELLA_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'GOL_HOME',
                    displayName: 'Gol Home',
                    field: 'GOL_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ASSIST_HOME',
                    displayName: 'Assist Home',
                    field: 'ASSIST_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'RIGORE_HOME',
                    displayName: 'Rig. Home',
                    field: 'RIGORE_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AUTORETE_HOME',
                    displayName: 'Autorete Home',
                    field: 'AUTORETE_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AMMONIZIONE_HOME',
                    displayName: 'Amm. Home',
                    field: 'AMMONIZIONE_HOME',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ESPULSIONE_HOME',
                    displayName: 'Esp. Home',
                    field: 'ESPULSIONE_HOME',
                    cellClass: 'cellRightBorder',
                    width: 50
                }, {
                    name: 'PG_AWAY',
                    displayName: 'Gioc. Away',
                    field: 'PG_AWAY',
                    cellClass: 'cellLeftBorder',
                    width: 50
                }, {
                    name: 'MEDIA_MAGIC_PUNTI_AWAY',
                    displayName: 'Magic Media Away',
                    field: 'MEDIA_MAGIC_PUNTI_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'MEDIA_VOTO_PAGELLA_AWAY',
                    displayName: 'Media Voto Away',
                    field: 'MEDIA_VOTO_PAGELLA_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'GOL_AWAY',
                    displayName: 'Gol Away',
                    field: 'GOL_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ASSIST_AWAY',
                    displayName: 'Assist Away',
                    field: 'ASSIST_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'RIGORE_AWAY',
                    displayName: 'Rig. Away',
                    field: 'RIGORE_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AUTORETE_AWAY',
                    displayName: 'Autorete Away',
                    field: 'AUTORETE_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'AMMONIZIONE_AWAY',
                    displayName: 'Amm. Away',
                    field: 'AMMONIZIONE_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }, {
                    name: 'ESPULSIONE_AWAY',
                    displayName: 'Esp. Away',
                    field: 'ESPULSIONE_AWAY',
                    cellClass: 'text-right',
                    width: 50
                }],
                onRegisterApi: function (gridApi) {
                    srvc.gridOptionsPandathinaikos.gridApi = gridApi;
                }
            },
            loadFantaRosa: function (id) {
                switch (id) {
                    case 1:
                        return $http.get($strings.REST.SERVER+'/fantafighettino').then(function (resp) {
                            srvc.gridOptionsPandathinaikos.data = resp.data;
                        });
                        break;
                    case 2:
                        return $http.get($strings.REST.SERVER+'/fantamarelli').then(function (resp) {
                            srvc.gridOptionsPandathinaikos.data = resp.data;
                        });
                        break;
                    case 3:
                        return $http.get($strings.REST.SERVER+'/fantabombolacci').then(function (resp) {
                            srvc.gridOptionsPandathinaikos.data = resp.data;
                        });
                        break;
                    default:
                        return $http.get($strings.REST.SERVER+'/fantafighettino').then(function (resp) {
                            srvc.gridOptionsPandathinaikos.data = resp.data;
                        });
                        break;
                }
                $interval(srvc.gridOptionsPandathinaikos.gridApi.core.handleWindowResize, 100, 10);
            }
        };
        return srvc;
    }]);
})();
