(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', '$rootScope', function (modalService, $http, $interval, $strings, uiGridConstants, $rootScope) {
        var scope = $rootScope.$new();

        var editableCondition = function editableCondition(rowEntity, colDef) {
            return false;
        };

        var checkEditableCondition = function checkEditableCondition(scope) {
            return editableCondition(scope.row.entity, scope.col.colDef);
        };

        var srvc = {
            gridBudget: {
                columnVirtualizationThreshold: 100,
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: false,
                enableColumnMenus: false,
                cellEditableCondition: checkEditableCondition,
                showGridFooter: false,
                showColumnFooter: true,
                enablePinning: true,
                hidePinLeft: false,
                hidePinRight: true, 
                columnDefs: [{
                    name: 'IDAMB',
                    displayName: 'ID AMB',
                    field: 'IDAMB',
                    width: 50
                }, {
                    name: 'IDCAT',
                    displayName: 'ID CAT',
                    field: 'IDCAT',
                    width: 50
                }, {
                    name: 'IDSOT',
                    displayName: 'ID SOT',
                    field: 'IDSOT',
                    width: 50
                }, {
                    name: 'AMBITO',
                    displayName: 'Ambito',
                    field: 'AMBITO',
                    width: 120
                }, {
                    name: 'CATEGORIA',
                    displayName: 'Categoria',
                    field: 'CATEGORIA',
                    width: 165
                }, {
                    name: 'SOTTOCATEGORIA',
                    displayName: 'Sottocategoria',
                    field: 'SOTTOCATEGORIA',
                    width: 165
                }, {
                    name: 'BUDG_TOT_ANNO',
                    displayName: 'Budget Anno',
                    field: 'BUDG_TOT_ANNO',
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOT_ANNO'] !== null && row.entity['TOT_ANNO'] !== 0) {
                            if (row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_ANNO'] > $strings.BUDGET.ORANGE) {
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
                    width: 130,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['TOT_ANNO'] !== null && row.entity['TOT_ANNO'] !== 0) {
                            if (row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_ANNO'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_ANNO'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_ANNO'] > $strings.BUDGET.ORANGE) {
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
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    pinnedLeft: true
                }, {
                    name: 'BUDG_GEN',
                    displayName: 'Budget GEN',
                    field: 'BUDG_GEN',
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GEN'] !== null && row.entity['GEN'] !== 0 || 1 < n) {
                            if (row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_GEN'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GEN'] !== null && row.entity['GEN'] !== 0 || 1 < n) {
                            if (row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_GEN'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GEN'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_GEN'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['FEB'] !== null && row.entity['FEB'] !== 0 || 2 < n) {
                            if (row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_FEB'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['FEB'] !== null && row.entity['FEB'] !== 0 || 2 < n) {
                            if (row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_FEB'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_FEB'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_FEB'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAR'] !== null && row.entity['MAR'] !== 0 || 3 < n) {
                            if (row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_MAR'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAR'] !== null && row.entity['MAR'] !== 0 || 3 < n) {
                            if (row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_MAR'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAR'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_MAR'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['APR'] !== null && row.entity['APR'] !== 0 || 4 < n) {
                            if (row.entity['PERC_RIM_APR'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_APR'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_APR'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_APR'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['APR'] !== null && row.entity['APR'] !== 0 || 4 < n) {
                            if (row.entity['PERC_RIM_APR'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_APR'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_APR'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_APR'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_APR'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['TOT_ANNO'] !== null && row.entity['MAG'] !== 0 || 5 < n) {
                            if (row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_MAG'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['MAG'] !== null && row.entity['MAG'] !== 0 || 5 < n) {
                            if (row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_MAG'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_MAG'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_MAG'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GIU'] !== null && row.entity['GIU'] !== 0 || 6 < n) {
                            if (row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_GIU'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['GIU'] !== null && row.entity['GIU'] !== 0 || 6 < n) {
                            if (row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_GIU'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_GIU'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_GIU'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['LUG'] !== null && row.entity['LUG'] !== 0 || 7 < n) {
                            if (row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_LUG'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['LUG'] !== null && row.entity['LUG'] !== 0 || 7 < n) {
                            if (row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_LUG'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_LUG'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_LUG'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['AGO'] !== null && row.entity['AGO'] !== 0 || 8 < n) {
                            if (row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_AGO'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['AGO'] !== null && row.entity['AGO'] !== 0 || 8 < n) {
                            if (row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_AGO'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_AGO'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_AGO'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['SETT'] !== null && row.entity['SETT'] !== 0 || 9 < n) {
                            if (row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_SETT'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['SETT'] !== null && row.entity['SETT'] !== 0 || 9 < n) {
                            if (row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_SETT'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_SETT'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_SETT'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['OTT'] !== null && row.entity['OTT'] !== 0 || 10 < n) {
                            if (row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_OTT'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['OTT'] !== null && row.entity['OTT'] !== 0 || 10 < n) {
                            if (row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_OTT'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_OTT'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_OTT'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['NOV'] !== null && row.entity['NOV'] !== 0 || 11 < n) {
                            if (row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_NOV'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['NOV'] !== null && row.entity['NOV'] !== 0 || 11 < n) {
                            if (row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_NOV'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_NOV'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_NOV'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['DIC'] !== null && row.entity['DIC'] !== 0 || 12 < n) {
                            if (row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_DIC'] > $strings.BUDGET.ORANGE) {
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
                    width: 120,
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['DIC'] !== null && row.entity['DIC'] !== 0 || 12 < n) {
                            if (row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.GREEN && row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.LIGHT_GREEN && row.entity['PERC_RIM_DIC'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['PERC_RIM_DIC'] < $strings.BUDGET.YELLOW && row.entity['PERC_RIM_DIC'] > $strings.BUDGET.ORANGE) {
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
                    srvc.gridBudget.gridApi.core.handleWindowResize(); 
                }
            },
            loadBudget: function (pivot) {
                var dto = {};
                dto.tipoconto = pivot.tipoConto;
                dto.anno = pivot.year;
                return $http.post($strings.REST.SERVER + '/budget', dto).then(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        srvc.gridBudget.data = resp.data;
                    }
                });
            }
        };
        return srvc;
    }]);
})();
