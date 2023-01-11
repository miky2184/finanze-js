(function () {
    'use strict';
    angular.module('myApp').factory('budgetService', ['modalService', '$http', '$interval', '$strings', 'uiGridConstants', 'dataService', function (modalService, $http, $interval, $strings, uiGridConstants, dataService) {

        var srvc = {
            gridBudget: {
                columnVirtualizationThreshold: 32,
                minRowsToShow: 23,
                enableSorting: false,
                enableFiltering: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePinning: true,
                columnDefs: [{
                    name: 'idamb',
                    displayName: 'AMB',
                    field: 'idamb',
                    width: '2%',
                    pinnedLeft: true
                }, {
                    name: 'idcat',
                    displayName: 'CAT',
                    field: 'idcat',
                    width: '2%',
                    pinnedLeft: true
                }, {
                    name: 'idsot',
                    displayName: 'SOT',
                    field: 'idsot',
                    width: '2%',
                    pinnedLeft: true
                }, {
                    name: 'ambito',
                    displayName: 'Ambito',
                    field: 'ambito',
                    width: '5%',
                    pinnedLeft: true
                }, {
                    name: 'categoria',
                    displayName: 'Categoria',
                    field: 'categoria',
                    width: '8%',
                    pinnedLeft: true
                }, {
                    name: 'sottocategoria',
                    displayName: 'Sottocategoria',
                    field: 'sottocategoria',
                    width: '8%',
                    pinnedLeft: true
                },
                {
                    name: 'perc_budg',
                    displayName: '%',
                    field: 'perc_budg',
                    width: '2%',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['tot_anno'] !== null && row.entity['tot_anno'] !== 0) {
                            if (row.entity['perc_rim_anno'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.GREEN && row.entity['perc_rim_anno'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_anno'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_anno'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                return 'zeroperc';
                            }
                        } else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    pinnedLeft: true
                },
                {
                    name: 'budg_tot_anno',
                    displayName: 'Budget Anno',
                    field: 'budg_tot_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['tot_anno'] !== null && row.entity['tot_anno'] !== 0) {
                            if (row.entity['perc_rim_anno'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.GREEN && row.entity['perc_rim_anno'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_anno'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_anno'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                return 'zeroperc';
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    pinnedLeft: true
                },
                {
                    name: 'tot_anno',
                    displayName: 'Spese Anno',
                    field: 'tot_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['tot_anno'] !== null && row.entity['tot_anno'] !== 0) {
                            if (row.entity['perc_rim_anno'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.GREEN && row.entity['perc_rim_anno'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_anno'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_anno'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                return 'zeroperc';
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    pinnedLeft: true
                }, {
                    name: 'prev_fino_anno',
                    displayName: 'Prev. Fine Anno',
                    field: 'prev_fino_anno',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        if (row.entity['tot_anno'] !== null && row.entity['tot_anno'] !== 0) {
                            if (row.entity['perc_rim_anno'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.GREEN && row.entity['perc_rim_anno'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_anno'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_anno'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_anno'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                return 'zeroperc';
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum,
                    pinnedLeft: true
                },{
                    name: 'budg_gen',
                    displayName: 'Budget GEN',
                    field: 'budg_gen',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['gen'] !== null && row.entity['gen'] !== 0 || 1 < n) {
                            if (row.entity['perc_rim_gen'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.GREEN && row.entity['perc_rim_gen'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_gen'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_gen'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['gen'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'gen',
                    displayName: 'Spese GEN',
                    field: 'gen',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['gen'] !== null && row.entity['gen'] !== 0 || 1 < n) {
                            if (row.entity['perc_rim_gen'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.GREEN && row.entity['perc_rim_gen'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_gen'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_gen'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_gen'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['gen'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_feb',
                    displayName: 'Budget FEB',
                    field: 'budg_feb',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['feb'] !== null && row.entity['feb'] !== 0 || 2 < n) {
                            if (row.entity['perc_rim_feb'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.GREEN && row.entity['perc_rim_feb'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_feb'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_feb'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['feb'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'feb',
                    displayName: 'Spese FEB',
                    field: 'feb',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['feb'] !== null && row.entity['feb'] !== 0 || 2 < n) {
                            if (row.entity['perc_rim_feb'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.GREEN && row.entity['perc_rim_feb'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_feb'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_feb'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_feb'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['feb'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_mar',
                    displayName: 'Budget MAR',
                    field: 'budg_mar',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            if (row.entity['perc_rim_mar'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mar'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mar'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mar'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mar'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'mar',
                    displayName: 'Spese MAR',
                    field: 'mar',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mar'] !== null && row.entity['mar'] !== 0 || 3 < n) {
                            if (row.entity['perc_rim_mar'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mar'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mar'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mar'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mar'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mar'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_apr',
                    displayName: 'Budget APR',
                    field: 'budg_apr',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            if (row.entity['perc_rim_apr'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.GREEN && row.entity['perc_rim_apr'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_apr'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_apr'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['apr'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'apr',
                    displayName: 'Spese APR',
                    field: 'apr',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['apr'] !== null && row.entity['apr'] !== 0 || 4 < n) {
                            if (row.entity['perc_rim_apr'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.GREEN && row.entity['perc_rim_apr'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_apr'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_apr'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_apr'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['apr'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_mag',
                    displayName: 'Budget MAG',
                    field: 'budg_mag',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['tot_anno'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            if (row.entity['perc_rim_mag'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mag'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mag'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mag'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mag'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'mag',
                    displayName: 'Spese MAG',
                    field: 'mag',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['mag'] !== null && row.entity['mag'] !== 0 || 5 < n) {
                            if (row.entity['perc_rim_mag'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.GREEN && row.entity['perc_rim_mag'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_mag'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_mag'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_mag'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['mag'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_giu',
                    displayName: 'Budget GIU',
                    field: 'budg_giu',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            if (row.entity['perc_rim_giu'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.GREEN && row.entity['perc_rim_giu'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_giu'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_giu'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['giu'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'giu',
                    displayName: 'Spese GIU',
                    field: 'giu',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['giu'] !== null && row.entity['giu'] !== 0 || 6 < n) {
                            if (row.entity['perc_rim_giu'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.GREEN && row.entity['perc_rim_giu'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_giu'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_giu'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_giu'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['giu'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_lug',
                    displayName: 'Budget LUG',
                    field: 'budg_lug',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            if (row.entity['perc_rim_lug'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.GREEN && row.entity['perc_rim_lug'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_lug'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_lug'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['lug'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'lug',
                    displayName: 'Spese LUG',
                    field: 'lug',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['lug'] !== null && row.entity['lug'] !== 0 || 7 < n) {
                            if (row.entity['perc_rim_lug'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.GREEN && row.entity['perc_rim_lug'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_lug'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_lug'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_lug'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['lug'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_ago',
                    displayName: 'Budget AGO',
                    field: 'budg_ago',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            if (row.entity['perc_rim_ago'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ago'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ago'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ago'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ago'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'ago',
                    displayName: 'Spese AGO',
                    field: 'ago',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ago'] !== null && row.entity['ago'] !== 0 || 8 < n) {
                            if (row.entity['perc_rim_ago'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ago'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ago'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ago'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ago'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ago'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_sett',
                    displayName: 'Budget SETT',
                    field: 'budg_sett',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            if (row.entity['perc_rim_sett'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.GREEN && row.entity['perc_rim_sett'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_sett'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_sett'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['sett'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'sett',
                    displayName: 'Spese SETT',
                    field: 'sett',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['sett'] !== null && row.entity['sett'] !== 0 || 9 < n) {
                            if (row.entity['perc_rim_sett'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.GREEN && row.entity['perc_rim_sett'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_sett'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_sett'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_sett'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['sett'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_ott',
                    displayName: 'Budget OTT',
                    field: 'budg_ott',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            if (row.entity['perc_rim_ott'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ott'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ott'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ott'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ott'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'ott',
                    displayName: 'Spese OTT',
                    field: 'ott',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['ott'] !== null && row.entity['ott'] !== 0 || 10 < n) {
                            if (row.entity['perc_rim_ott'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.GREEN && row.entity['perc_rim_ott'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_ott'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_ott'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_ott'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['ott'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_nov',
                    displayName: 'Budget NOV',
                    field: 'budg_nov',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            if (row.entity['perc_rim_nov'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.GREEN && row.entity['perc_rim_nov'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_nov'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_nov'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['nov'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'nov',
                    displayName: 'Spese NOV',
                    field: 'nov',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['nov'] !== null && row.entity['nov'] !== 0 || 11 < n) {
                            if (row.entity['perc_rim_nov'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.GREEN && row.entity['perc_rim_nov'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_nov'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_nov'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_nov'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['nov'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'budg_dic',
                    displayName: 'Budget DIC',
                    field: 'budg_dic',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            if (row.entity['perc_rim_dic'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.GREEN && row.entity['perc_rim_dic'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_dic'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_dic'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['dic'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
                    aggregationType: uiGridConstants.aggregationTypes.sum
                }, {
                    name: 'dic',
                    displayName: 'Spese DIC',
                    field: 'dic',
                    width: '5%',
                    footerCellFilter: 'currency',
                    cellFilter: 'currency',
                    cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                        var d = new Date();
                        var n = d.getMonth();
                        if (row.entity['dic'] !== null && row.entity['dic'] !== 0 || 12 < n) {
                            if (row.entity['perc_rim_dic'] >= $strings.BUDGET.GREEN) {
                                return 'centoperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.GREEN && row.entity['perc_rim_dic'] >= $strings.BUDGET.LIGHT_GREEN) {
                                return 'settcinqueperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.LIGHT_GREEN&& row.entity['perc_rim_dic'] >= $strings.BUDGET.YELLOW) {
                                return 'cinquantaperc';
                            } else if (row.entity['perc_rim_dic'] < $strings.BUDGET.YELLOW && row.entity['perc_rim_dic'] > $strings.BUDGET.ORANGE) {
                                return 'venticinqperc';
                            } else {
                                if (row.entity['dic'] < 0) {
                                    return 'zeroperc';
                                } else {
                                    return 'centoperc';
                                }
                            }
                        }else {
                            return 'text-right';
                        }
                    },
                    type: 'number',
                    filters: [
                        {
                          condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                          placeholder: 'greater than'
                        },
                        {
                          condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                          placeholder: 'less than'
                        }
                      ],
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
                dto.tipoconto = pivot.tipoconto;
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
