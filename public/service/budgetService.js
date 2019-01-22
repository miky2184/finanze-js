(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$rootScope', '$strings', 'uiGridConstants', function (modalService, $http, $interval, $rootScope, $strings, uiGridConstants) {
        var scope = $rootScope.$new();
        var srvc = {
            gridBudget: {
                columnVirtualizationThreshold: 100,
                minRowsToShow: 23,
                enableFiltering: false,
                selectionRowHeaderWidth: 35,
                enableSorting: false,
                enableColumnMenus: false,
                showGridFooter: false,
                showColumnFooter: true,
                columnDefs: [{
                    name: 'IDAMB',
                    displayName: 'ID AMB',
                    field: 'IDAMB',
                    width: '3%'
                }, {
                    name: 'IDCAT',
                    displayName: 'ID CAT',
                    field: 'IDCAT',
                    width: '3%'
                }, {
                    name: 'IDSOT',
                    displayName: 'ID SOT',
                    field: 'IDSOT',
                    width: '3%'
                }, {
                    name: 'AMBITO',
                    displayName: 'Ambito',
                    field: 'AMBITO',
                    width: '7%'
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'CATEGORIA',
                    width: '8%'
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'SOTTOCATEGORIA',
                    width: '12%'
                }, {
                    name: 'BUDG_TOT_ANNO',
                    displayName: 'Budget Anno',
                    field: 'BUDG_TOT_ANNO',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOT_ANNO'] !== null && row.entity['TOT_ANNO'] !== 0) {
                            if (row.entity['PERC_RIM_ANNO'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.YELLOW && row.entity['PERC_RIM_ANNO'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['TOT_ANNO'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'TOT_ANNO',
                    displayName: 'Spese Anno',
                    field: 'TOT_ANNO',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOT_ANNO'] !== null && row.entity['TOT_ANNO'] !== 0) {
                            if (row.entity['PERC_RIM_ANNO'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.YELLOW && row.entity['PERC_RIM_ANNO'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['TOT_ANNO'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_GEN',
                    displayName: 'Budget GEN',
                    field: 'BUDG_GEN',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GEN'] !== null && row.entity['GEN'] !== 0 || 1 < n) {
                            if (row.entity['PERC_RIM_GEN'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.GREEN && row.entity['PERC_RIM_GEN'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_GEN'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.YELLOW && row.entity['PERC_RIM_GEN'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['GEN'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'GEN',
                    displayName: 'Spese GEN',
                    field: 'GEN',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GEN'] !== null && row.entity['GEN'] !== 0 || 1 < n) {
                            if (row.entity['PERC_RIM_GEN'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.GREEN && row.entity['PERC_RIM_GEN'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_GEN'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.YELLOW && row.entity['PERC_RIM_GEN'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['GEN'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_FEB',
                    displayName: 'Budget FEB',
                    field: 'BUDG_FEB',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['FEB'] !== null && row.entity['FEB'] !== 0 || 2 < n) {
                            if (row.entity['PERC_RIM_FEB'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.GREEN && row.entity['PERC_RIM_FEB'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_FEB'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.YELLOW && row.entity['PERC_RIM_FEB'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['FEB'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'FEB',
                    displayName: 'Spese FEB',
                    field: 'FEB',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['FEB'] !== null && row.entity['FEB'] !== 0 || 2 < n) {
                            if (row.entity['PERC_RIM_FEB'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.GREEN && row.entity['PERC_RIM_FEB'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_FEB'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.YELLOW && row.entity['PERC_RIM_FEB'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['FEB'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_MAR',
                    displayName: 'Budget MAR',
                    field: 'BUDG_MAR',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAR'] !== null && row.entity['MAR'] !== 0 || 3 < n) {
                            if (row.entity['PERC_RIM_MAR'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.GREEN && row.entity['PERC_RIM_MAR'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_MAR'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.YELLOW && row.entity['PERC_RIM_MAR'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['MAR'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'MAR',
                    displayName: 'Spese MAR',
                    field: 'MAR',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAR'] !== null && row.entity['MAR'] !== 0 || 3 < n) {
                            if (row.entity['PERC_RIM_MAR'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.GREEN && row.entity['PERC_RIM_MAR'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_MAR'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.YELLOW && row.entity['PERC_RIM_MAR'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['MAR'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_APR',
                    displayName: 'Budget APR',
                    field: 'BUDG_APR',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['APR'] !== null && row.entity['APR'] !== 0 || 4 < n) {
                            if (row.entity['PERC_RIM_APR'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.GREEN && row.entity['PERC_RIM_APR'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_APR'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.YELLOW && row.entity['PERC_RIM_APR'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['APR'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'APR',
                    displayName: 'Spese APR',
                    field: 'APR',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['APR'] !== null && row.entity['APR'] !== 0 || 4 < n) {
                            if (row.entity['PERC_RIM_APR'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.GREEN && row.entity['PERC_RIM_APR'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_APR'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.YELLOW && row.entity['PERC_RIM_APR'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['APR'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_MAG',
                    displayName: 'Budget MAG',
                    field: 'BUDG_MAG',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['TOT_ANNO'] !== null && row.entity['MAG'] !== 0 || 5 < n) {
                            if (row.entity['PERC_RIM_MAG'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.GREEN && row.entity['PERC_RIM_MAG'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_MAG'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.YELLOW && row.entity['PERC_RIM_MAG'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['MAG'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'MAG',
                    displayName: 'Spese MAG',
                    field: 'MAG',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAG'] !== null && row.entity['MAG'] !== 0 || 5 < n) {
                            if (row.entity['PERC_RIM_MAG'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.GREEN && row.entity['PERC_RIM_MAG'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_MAG'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.YELLOW && row.entity['PERC_RIM_MAG'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['MAG'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_GIU',
                    displayName: 'Budget GIU',
                    field: 'BUDG_GIU',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GIU'] !== null && row.entity['GIU'] !== 0 || 6 < n) {
                            if (row.entity['PERC_RIM_GIU'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.GREEN && row.entity['PERC_RIM_GIU'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_GIU'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.YELLOW && row.entity['PERC_RIM_GIU'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['GIU'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'GIU',
                    displayName: 'Spese GIU',
                    field: 'GIU',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GIU'] !== null && row.entity['GIU'] !== 0 || 6 < n) {
                            if (row.entity['PERC_RIM_GIU'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.GREEN && row.entity['PERC_RIM_GIU'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_GIU'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.YELLOW && row.entity['PERC_RIM_GIU'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['GIU'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_LUG',
                    displayName: 'Budget LUG',
                    field: 'BUDG_LUG',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['LUG'] !== null && row.entity['LUG'] !== 0 || 7 < n) {
                            if (row.entity['PERC_RIM_LUG'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.GREEN && row.entity['PERC_RIM_LUG'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_LUG'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.YELLOW && row.entity['PERC_RIM_LUG'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['LUG'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'LUG',
                    displayName: 'Spese LUG',
                    field: 'LUG',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['LUG'] !== null && row.entity['LUG'] !== 0 || 7 < n) {
                            if (row.entity['PERC_RIM_LUG'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.GREEN && row.entity['PERC_RIM_LUG'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_LUG'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.YELLOW && row.entity['PERC_RIM_LUG'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['LUG'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_AGO',
                    displayName: 'Budget AGO',
                    field: 'BUDG_AGO',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['AGO'] !== null && row.entity['AGO'] !== 0 || 8 < n) {
                            if (row.entity['PERC_RIM_AGO'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.GREEN && row.entity['PERC_RIM_AGO'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_AGO'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.YELLOW && row.entity['PERC_RIM_AGO'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['AGO'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'AGO',
                    displayName: 'Spese AGO',
                    field: 'AGO',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['AGO'] !== null && row.entity['AGO'] !== 0 || 8 < n) {
                            if (row.entity['PERC_RIM_AGO'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.GREEN && row.entity['PERC_RIM_AGO'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_AGO'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.YELLOW && row.entity['PERC_RIM_AGO'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['AGO'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_SETT',
                    displayName: 'Budget SETT',
                    field: 'BUDG_SETT',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['SETT'] !== null && row.entity['SETT'] !== 0 || 9 < n) {
                            if (row.entity['PERC_RIM_SETT'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.GREEN && row.entity['PERC_RIM_SETT'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_SETT'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.YELLOW && row.entity['PERC_RIM_SETT'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['SETT'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'SETT',
                    displayName: 'Spese SETT',
                    field: 'SETT',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['SETT'] !== null && row.entity['SETT'] !== 0 || 9 < n) {
                            if (row.entity['PERC_RIM_SETT'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.GREEN && row.entity['PERC_RIM_SETT'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_SETT'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.YELLOW && row.entity['PERC_RIM_SETT'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['SETT'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_OTT',
                    displayName: 'Budget OTT',
                    field: 'BUDG_OTT',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['OTT'] !== null && row.entity['OTT'] !== 0 || 10 < n) {
                            if (row.entity['PERC_RIM_OTT'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.GREEN && row.entity['PERC_RIM_OTT'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_OTT'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.YELLOW && row.entity['PERC_RIM_OTT'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['OTT'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'OTT',
                    displayName: 'Spese OTT',
                    field: 'OTT',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['OTT'] !== null && row.entity['OTT'] !== 0 || 10 < n) {
                            if (row.entity['PERC_RIM_OTT'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.GREEN && row.entity['PERC_RIM_OTT'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_OTT'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.YELLOW && row.entity['PERC_RIM_OTT'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['OTT'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_NOV',
                    displayName: 'Budget NOV',
                    field: 'BUDG_NOV',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['NOV'] !== null && row.entity['NOV'] !== 0 || 11 < n) {
                            if (row.entity['PERC_RIM_NOV'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.GREEN && row.entity['PERC_RIM_NOV'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_NOV'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.YELLOW && row.entity['PERC_RIM_NOV'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['NOV'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'NOV',
                    displayName: 'Spese NOV',
                    field: 'NOV',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['NOV'] !== null && row.entity['NOV'] !== 0 || 11 < n) {
                            if (row.entity['PERC_RIM_NOV'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.GREEN && row.entity['PERC_RIM_NOV'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_NOV'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.YELLOW && row.entity['PERC_RIM_NOV'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['NOV'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'BUDG_DIC',
                    displayName: 'Budget DIC',
                    field: 'BUDG_DIC',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['DIC'] !== null && row.entity['DIC'] !== 0 || 12 < n) {
                            if (row.entity['PERC_RIM_DIC'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.GREEN && row.entity['PERC_RIM_DIC'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_DIC'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.YELLOW && row.entity['PERC_RIM_DIC'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['DIC'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'DIC',
                    displayName: 'Spese DIC',
                    field: 'DIC',
                    width: '7%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['DIC'] !== null && row.entity['DIC'] !== 0 || 12 < n) {
                            if (row.entity['PERC_RIM_DIC'] >= $strings.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.GREEN && row.entity['PERC_RIM_DIC'] >= $strings.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.LIGHT_GREEN && row.entity['PERC_RIM_DIC'] >= $strings.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.YELLOW && row.entity['PERC_RIM_DIC'] > $strings.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['DIC'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }],
                data: [],
                onRegisterApi: function (gridApi) {
                    srvc.gridBudget.gridApi = gridApi;
                }
            },
            loadBudget: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoConto;
                dto.anno = pivot.year;
                return $http.post('http://93.55.248.37:3001/budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridBudget.data = resp.data;

                        if (srvc.gridBudget && srvc.gridBudget.gridApi) {
                            $interval(srvc.gridBudget.gridApi.core.handleWindowResize, 100, 10);
                        }

                    }
                });
            }
        };
        return srvc;
    }]);
})();
