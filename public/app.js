(function () {
  'use strict';

  angular.module('myApp', ['ngTouch', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView'])

    .controller('MainController', ['$scope', '$http', 'uiGridConstants', '$log', '$q', '$interval', '$timeout', '$uibModal', function ($scope, $http, uiGridConstants, $log, $q, $interval, $timeout, $uibModal) {

      $scope.login = {
        logged: false,
        admin: false,
        read: false
      };

      $scope.afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }

        var newSett = {};
        var oldSett = {};

        if (colDef.name === 'ambito') {

          newSett = $scope.editDropDownAmbitoArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownAmbitoArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];

        } else if (colDef.name === 'categoria') {
          newSett = $scope.editDropDownCategoriaArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownCategoriaArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];

        } else if (colDef.name === 'sottocategoria') {
          newSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];

        } else if (colDef.name === 'beneficiario') {
          newSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];
        }

        if (newSett) {
          newSett.used = newSett.used + 1;
        }

        if (oldSett) {
          oldSett.used += -1;
        }

        rowEntity.dirty = true;

      };

      $scope.gridOptions = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 14,
        enableFiltering: true,
        enableRowSelection: true,
        enableSelectAll: true,
        selectionRowHeaderWidth: 35,
        rowTemplate: 'templates/rows/deletableRow.html',
        enableColumnMenus: false,
        enableGridMenu: true,
        exporterMenuCsv: false,
        exporterMenuPdf: false,
        exporterExcelFilename: 'Finanze.xlsx',
        exporterExcelSheetName: 'Dati Estratti',
        columnDefs: [
          {
            field: 'data',
            width: '6%',
            type: 'date',
            cellFilter: 'date:\'yyyy-MM-dd\''
            },
          {
            name: 'ambito',
            displayName: 'Ambito',
            field: 'ambito',
            width: '8%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'ambito',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownAmbitoArray:"ambito":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              return $scope.editDropDownAmbitoArray.filter(function (a) {
                return !a.deleted;
              });
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownAmbitoArray) {
                  var cell = row.grid.appScope.$parent.editDropDownAmbitoArray.filter(function (ambito) {
                    return ambito.ambito === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            name: 'categoria',
            displayName: 'Categoria',
            field: 'categoria',
            width: '8%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'categoria',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownCategoriaArray:"categoria":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              if (rowEntity.ambito) {
                return $scope.editDropDownCategoriaArray.filter(function (obj) {
                  return obj.ambito === rowEntity.ambito && !obj.deleted;
                });
              }
              return []; //$scope.editDropDownCategoriaArray;
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownCategoriaArray) {
                  var cell = row.grid.appScope.$parent.editDropDownCategoriaArray.filter(function (categoria) {
                    return categoria.categoria === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            name: 'sottocategoria',
            displayName: 'Sottocategoria',
            field: 'sottocategoria',
            width: '8%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'sottocategoria',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownSottoCategoriaArray:"sottocategoria":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              if (rowEntity.categoria) {
                return $scope.editDropDownSottoCategoriaArray.filter(function (obj) {
                  return obj.categoria === rowEntity.categoria && !obj.deleted;
                });
              }
              return [];
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownSottoCategoriaArray) {
                  var cell = row.grid.appScope.$parent.editDropDownSottoCategoriaArray.filter(function (sottocategoria) {
                    return sottocategoria.sottocategoria === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            name: 'beneficiario',
            displayName: 'Beneficiario',
            field: 'beneficiario',
            width: '8%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'beneficiario',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownBeneficiarioArray:"beneficiario":"label"',
            editDropdownOptionsFunction: function () {
              return $scope.editDropDownBeneficiarioArray;
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownBeneficiarioArray) {
                  var cell = row.grid.appScope.$parent.editDropDownBeneficiarioArray.filter(function (beneficiario) {
                    return beneficiario.beneficiario === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            name: 'tipoConto',
            displayName: 'Tipo Conto',
            field: 'tipoConto',
            width: '12%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'tipoConto',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownTipoContoArray:"tipoConto":"label"',
            editDropdownOptionsFunction: function () {
              return $scope.editDropDownTipoContoArray;
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownTipoContoArray) {
                  var cell = row.grid.appScope.$parent.editDropDownTipoContoArray.filter(function (tipoConto) {
                    return tipoConto.tipoConto === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            field: 'conto',
            name: 'conto',
            displayName: 'Conto',
            field: 'conto',
            width: '12%',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'conto',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownContoArray:"conto":"label"',
            editDropdownOptionsFunction: function () {
              return $scope.editDropDownContoArray;
            },
            filter: {
              condition: function (searchTerm, cellValue, row, column) {
                if (row.grid.appScope.$parent.editDropDownContoArray) {
                  var cell = row.grid.appScope.$parent.editDropDownContoArray.filter(function (conto) {
                    return conto.conto === cellValue;
                  });
                  if (cell && cell.length > 0) {
                    return cell[0].label.toUpperCase().indexOf(searchTerm.toUpperCase()) >= 0;
                  } else {
                    return false;
                  }
                }
              }
            }
            },
          {
            field: 'contabilizzata',
            width: '3%',
            cellTooltip: true,
            cellTemplate: 'templates/rows/checkboxIcon.html',
            buttonNgClass: 'fas fa-balance-scale'
            },
          {
            field: 'visualizzare',
            width: '3%',
            cellTooltip: true,
            cellTemplate: 'templates/rows/checkboxIcon.html',
            buttonNgClass: 'fas fa-eye'
            },
          {
            field: 'importo',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellFilter: 'currency',
            cellFilter: 'currency',
            width: '8%',
            cellTooltip: true,
            cellClass: 'text-right'
            },
          {
            field: 'info',
            cellTooltip: true,
            width: '*'
            },
          {
            field: 'anno',
            diplayName: 'Anno',
            width: '3%'
            },
          {
            field: 'mese',
            diplayName: 'Mese',
            width: '3%'
            }
		],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptions.gridApi = gridApi;

          gridApi.selection.on.rowSelectionChanged($scope, function (row) {});

          gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {});

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditFunction);

        }
      };
      $scope.alerts = [];
      $scope.accesso = function () {
        var user = {};
        user.username = $scope.username;
        user.pwd = $scope.password;
        return $http.post('http://2.225.127.144:3000/login', user).then(function (resp) {
          // return $http.get('json/login.json').then(function (resp) {
          if (resp.data && resp.data.length === 1) {
            $scope.descName = resp.data[0]['NAME'];
            $scope.login.admin = resp.data[0]['PROFILE'] === 'admn' ? true : false;
            $scope.login.read = resp.data[0]['PROFILE'] === 'read' ? true : false;
            return $scope.loadData().then(function (resp) {
              if ($scope.login.admin) {
                $scope.loadSettings();
              }
            });
          } else {
            $scope.alerts.push({
              msg: 'Username e/o Password errate!!!',
              type: 'danger'
            });
          }
        });
      };

      $scope.logout = function () {
        $scope.login.logged = false;
        $scope.login.admin = false;
      }

      $scope.backupData = [];

      $scope.loadData = function () {
        return $http.get('http://2.225.127.144:3000/ambito').then(function (response) {
          // return $http.get('json/ambito.json').then(function (response) {
          if (response.data) {
            response.data.unshift({
              "ambito": "null",
              "label": " "
            });
          }
          $scope.editDropDownAmbitoArray = response.data;

          return $http.get('http://2.225.127.144:3000/categoria').then(function (response) {
            // return $http.get('json/categoria.json').then(function (response) {
            if (response.data) {
              response.data.unshift({
                "categoria": "null",
                "label": " "
              });
            }
            $scope.editDropDownCategoriaArray = response.data;

            return $http.get('http://2.225.127.144:3000/sottocategoria').then(function (response) {
              // return $http.get('json/sottocategoria.json').then(function (response) {
              if (response.data) {
                response.data.unshift({
                  "sottocategoria": "null",
                  "label": " "
                });
              }
              $scope.editDropDownSottoCategoriaArray = response.data;

              return $http.get('http://2.225.127.144:3000/beneficiario').then(function (response) {
                // return $http.get('json/beneficiario.json').then(function (response) {
                if (response.data) {
                  response.data.unshift({
                    "beneficiario": "null",
                    "label": " "
                  });
                }
                $scope.editDropDownBeneficiarioArray = response.data;

                return $http.get('http://2.225.127.144:3000/tipoConto').then(function (response) {
                  // return $http.get('json/tipoConto.json').then(function (response) {
                  $scope.editDropDownTipoContoArray = response.data;

                  return $http.get('http://2.225.127.144:3000/conto').then(function (response) {
                    // return $http.get('json/conto.json').then(function (response) {
                    $scope.editDropDownContoArray = response.data;

                    return $http.get('http://2.225.127.144:3000/all').
                    // return $http.get('json/all.json').
                    then(function (response) {

                      $scope.login.logged = true;

                      var resultsData = [];

                      response.data.forEach(function (row) {
                        var newRow = {};
                        newRow.id = row['ID'];
                        newRow.data = new Date(row['DATA_VAL']);
                        newRow.ambito = row['AMBITO'];
                        newRow.categoria = row['CATEGORIA'];
                        newRow.sottocategoria = row['SOTTOCATEGORIA'];
                        // newRow.prodotto = row['PRODOTTO'];
                        newRow.beneficiario = row['BENEFICIARIO'];
                        newRow.tipoConto = row['TP_CONTO'];
                        newRow.conto = row['CONTO'];
                        newRow.contabilizzata = row['FL_CONT'] === 'SI' ? true : false;
                        newRow.visualizzare = row['FL_VISL'] === 'SI' ? true : false;
                        newRow.importo = row['VALUE'];
                        newRow.info = row['INFO'];
                        newRow.anno = new Date(row['DATA_VAL']).getFullYear();
                        newRow.mese = new Date(row['DATA_VAL']).getMonth() + 1;
                        return resultsData.push(newRow);
                      });

                      $scope.backupData = angular.copy(resultsData);

                      $scope.gridOptions.data = resultsData;

                      $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = $scope.editDropDownAmbitoArray;
                      $scope.gridOptions.columnDefs[2].editDropdownOptionsArray = $scope.editDropDownCategoriaArray;
                      $scope.gridOptions.columnDefs[3].editDropdownOptionsArray = $scope.editDropDownSottoCategoriaArray;
                      $scope.gridOptions.columnDefs[4].editDropdownOptionsArray = $scope.editDropDownBeneficiarioArray;
                      $scope.gridOptions.columnDefs[5].editDropdownOptionsArray = $scope.editDropDownTipoContoArray;
                      $scope.gridOptions.columnDefs[6].editDropdownOptionsArray = $scope.editDropDownContoArray;

                      $interval($scope.gridOptions.gridApi.core.handleWindowResize, 100, 10);

                    });
                  });
                });
              });
            });
          });
        });
      };

      $scope.actionButtons = [];
      $scope.settingButtons = [];
      $scope.saveButtons = [];


      $scope.addBtn = {
        label: '+',
        listener: function (gridOptions) {
          gridOptions.data.unshift({
            newRow: true,
            data: new Date(),
            anno: new Date().getFullYear(),
            mese: new Date().getMonth() + 1,
            contabilizzata: true,
            visualizzare: true
          });
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      $scope.deleteBtn = {
        label: '-',
        listener: function (gridOptions) {
          if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
              row.deleted = !row.deleted;
              row.dirty = true;
            });
          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      $scope.copyBtn = {
        label: 'Copy',
        listener: function (gridOptions) {
          if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
              var copyRow = angular.copy(row);
              copyRow.data = new Date();
              copyRow.newRow = true;
              copyRow.deleted = false;
              copyRow.dirty = true;
              gridOptions.data.unshift(copyRow);
            });
            gridOptions.gridApi.selection.clearSelectedRows();
          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.actionButtons.push($scope.addBtn);
      $scope.actionButtons.push($scope.deleteBtn);
      $scope.actionButtons.push($scope.copyBtn);

      $scope.addSettingBtn = {
        label: '+',
        listener: function (gridOptions, type, settings) {
          if (settings) {
            var newSetting = {};
            newSetting.newRow = true;
            newSetting[type] = Math.max(...gridOptions.data.filter(function (j) {
              return j[type] !== "null";
            }).map(function (obj) {
              return obj[type];
            })) + 1;
            newSetting.dirty = true;
            newSetting['label'] = '';
            newSetting.used = 0;
            // gridOptions.data.unshift(newSetting);

            if (type === 'ambito') {
              $scope.editDropDownAmbitoArray.unshift(newSetting);
              $scope.gridOptionsAmb.data = $scope.editDropDownAmbitoArray.filter(function (x) {
                return x[type] != "null";
              });
            } else if (type === 'categoria') {
              $scope.editDropDownCategoriaArray.unshift(newSetting);
              $scope.gridOptionsCat.data = $scope.editDropDownCategoriaArray.filter(function (x) {
                return x[type] != "null";
              });
            } else if (type === 'sottocategoria') {
              $scope.editDropDownSottoCategoriaArray.unshift(newSetting);
              $scope.gridOptionsSott.data = $scope.editDropDownSottoCategoriaArray.filter(function (x) {
                return x[type] != "null";
              });
            } else if (type === 'beneficiario') {
              $scope.editDropDownBeneficiarioArray.unshift(newSetting);
              $scope.gridOptionsBen.data = $scope.editDropDownBeneficiarioArray.filter(function (x) {
                return x[type] != "null";
              });
            }
          } else {
            var newLink = {
              dirty: true,
              newRow: true,
              deleted: false
            };
            if (type === 'ambcat'){
              $scope.gridOptionsAmbCat.data.unshift(newLink);    
            } else if (type === 'catsott'){
              $scope.gridOptionsCatSott.data.unshift(newLink);
            }
          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      $scope.deleteSettingBtn = {
        label: '-',
        listener: function (gridOptions, type) {
          if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
              row.deleted = !row.deleted;
              row.dirty = true;
            });
          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.settingButtons.push($scope.addSettingBtn);
      $scope.settingButtons.push($scope.deleteSettingBtn);

      $scope.saveBtn = {
        label: 'Salva',
        listener: function () {
          var dto = {};
          dto.settings = {};
          dto.links = {};

          dto.settings.ambiti = $scope.editDropDownAmbitoArray.filter(function (ambito) {
            return ambito.dirty;
          });

          dto.settings.categorie = $scope.editDropDownCategoriaArray.filter(function (categoria) {
            return categoria.dirty;
          });

          dto.settings.sottocategorie = $scope.editDropDownSottoCategoriaArray.filter(function (sottocategoria) {
            return sottocategoria.dirty;
          });

          dto.settings.beneficiari = $scope.editDropDownBeneficiarioArray.filter(function (beneficiario) {
            return beneficiario.dirty;
          });
          
          dto.links.ambitocategoria = $scope.gridOptionsAmbCat.data.filter(function(ambcat){
            return ambcat.dirty;
          });
          
          dto.links.categoriasottocategoria = $scope.gridOptionsAmbCat.data.filter(function(catsott){
            return catsott.dirty;
          })

          dto.finanze = $scope.gridOptions.data.filter(function (row) {
            return row.dirty;
          });                    

          return $http.post('http://2.225.127.144:3000/save', dto).then(function (resp) {
            return $scope.loadData().then(function (resp) {
              if ($scope.login.admin) {
                $scope.loadSettings();
              }
            });
          });

        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.cancelBtn = {
        label: 'Annulla',
        listener: function (gridOptions) {
          gridOptions.data = angular.copy($scope.backupData);
        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.saveButtons.push($scope.saveBtn);
      $scope.saveButtons.push($scope.cancelBtn);

      function sortByKey(array, key) {
        return array.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      }

      /************************************************
       *                  TAB BILANCIO
       ************************************************/

      $scope.gridOptionsBalance = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 14,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
          name: 'conto',
          displayName: 'Conto',
          field: 'conto',
          width: '20%'
            }, {
          name: 'contoComune',
          displayName: 'Conto Comune',
          field: 'contoComune',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency',
        }, {
          name: 'contoPersonale',
          displayName: 'Conto Personale',
          field: 'contoPersonale',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: 'totale',
          displayName: 'Totale',
          field: 'totale',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsBalance.gridApi = gridApi;
        }
      };

      $scope.loadBalance = function () {
        var balanceData = angular.copy($scope.gridOptions.data);

        var balance = [];

        $scope.editDropDownContoArray.forEach(function (row) {
          var newConto = {
            "conto": row.label
          };
          var importoContoComune = 0;
          var importoContoPersonale = 0;

          for (var x = 0; x < balanceData.length; x++) {
            if (balanceData[x].conto === row.conto) {
              if (balanceData[x].contabilizzata) {
                if (balanceData[x].tipoConto === 1) {
                  importoContoComune = importoContoComune + balanceData[x].importo;
                } else {
                  importoContoPersonale = importoContoPersonale + balanceData[x].importo;
                }
              }
            }
          }

          newConto.contoComune = importoContoComune;
          newConto.contoPersonale = importoContoPersonale;
          newConto.totale = importoContoComune + importoContoPersonale;
          balance.push(newConto);

        });

        $scope.gridOptionsBalance.data = balance;

        $interval($scope.gridOptionsBalance.gridApi.core.handleWindowResize, 100, 10);
      };

      /************************************************
       *                  TAB PIVOT CONTO COMUNE
       ************************************************/

      $scope.gridOptionsPivotConto = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 14,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
        enableGridMenu: true,
        exporterMenuCsv: false,
        exporterMenuPdf: false,
        exporterExcelFilename: 'Pivot_Conto_Comune.xlsx',
        exporterExcelSheetName: 'Dati Estratti',
        columnDefs: [{
          name: 'ambito',
          displayName: 'Ambito',
          field: 'ambito',
          width: '10%'
            }, {
          name: 'categoria',
          displayName: 'Categoria',
          field: 'categoria',
          width: '10%'
        }, {
          name: 'sottocategoria',
          displayName: 'Sottocategoria',
          field: 'sottocategoria',
          width: '10%'
        }, {
          name: '1',
          displayName: 'GENNAIO',
          field: '1',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '2',
          displayName: 'FEBBRAIO',
          field: '2',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '3',
          displayName: 'MARZO',
          field: '3',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '4',
          displayName: 'APRILE',
          field: '4',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '5',
          displayName: 'MAGGIO',
          field: '5',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '6',
          displayName: 'GIUGNO',
          field: '6',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '7',
          displayName: 'LUGLIO',
          field: '7',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '8',
          displayName: 'AGOSTO',
          field: '8',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '9',
          displayName: 'SETTEMBRE',
          field: '9',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '10',
          displayName: 'OTTOBRE',
          field: '10',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '11',
          displayName: 'NOVEMBRE',
          field: '11',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: '12',
          displayName: 'DICEMBRE',
          field: '12',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsPivotConto.gridApi = gridApi;

          $timeout(function () {
            $scope.gridOptionsPivotConto.gridApi.treeBase.expandAllRows();
          }, 250);
        }
      };

      $scope.pivot = {
        year: 2018,
        tipoConto: 1
      };
      $scope.years = [2018, 2017, 2016];

      $scope.loadPivotConto = function () {
        var balanceData = angular.copy($scope.gridOptions.data).filter(function (obj) {
          return obj.anno === $scope.pivot.year && obj.tipoConto === $scope.pivot.tipoConto && obj.contabilizzata;
        });

        var pivotData = [];

        balanceData = sortByKey(balanceData, 'ambito');

        var ambitoData = [];

        $scope.editDropDownAmbitoArray.forEach(function (ambito) {

          var obj = {
            'idAmb': ambito.ambito,
            'ambito': ambito.label,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            '10': 0,
            '11': 0,
            '12': 0,
            '$$treeLevel': 0
          };

          for (var x = 0; x < balanceData.length; x++) {
            if (balanceData[x].ambito === ambito.ambito) {
              switch (balanceData[x].mese) {
                case 1:
                  obj['1'] = obj['1'] + balanceData[x].importo;
                  break;
                case 2:
                  obj['2'] = obj['2'] + balanceData[x].importo;
                  break;
                case 3:
                  obj['3'] = obj['3'] + balanceData[x].importo;
                  break;
                case 4:
                  obj['4'] = obj['4'] + balanceData[x].importo;
                  break;
                case 5:
                  obj['5'] = obj['5'] + balanceData[x].importo;
                  break;
                case 6:
                  obj['6'] = obj['6'] + balanceData[x].importo;
                  break;
                case 7:
                  obj['7'] = obj['7'] + balanceData[x].importo;
                  break;
                case 8:
                  obj['8'] = obj['8'] + balanceData[x].importo;
                  break;
                case 9:
                  obj['9'] = obj['9'] + balanceData[x].importo;
                  break;
                case 10:
                  obj['10'] = obj['10'] + balanceData[x].importo;
                  break;
                case 11:
                  obj['11'] = obj['11'] + balanceData[x].importo;
                  break;
                case 12:
                  obj['12'] = obj['12'] + balanceData[x].importo;
                  break;
                default:
              }
            }
          }
          ambitoData.push(obj);

        });

        balanceData = sortByKey(balanceData, 'categoria');

        var categoryData = [];

        $scope.editDropDownCategoriaArray.forEach(function (categoria) {

          var obj = {
            'idCat': categoria.categoria,
            'categoria': categoria.label,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            '10': 0,
            '11': 0,
            '12': 0,
            '$$treeLevel': 1
          };

          for (var x = 0; x < balanceData.length; x++) {
            if (balanceData[x].categoria === categoria.categoria) {
              obj.idAmb = balanceData[x].ambito;
              switch (balanceData[x].mese) {
                case 1:
                  obj['1'] = obj['1'] + balanceData[x].importo;
                  break;
                case 2:
                  obj['2'] = obj['2'] + balanceData[x].importo;
                  break;
                case 3:
                  obj['3'] = obj['3'] + balanceData[x].importo;
                  break;
                case 4:
                  obj['4'] = obj['4'] + balanceData[x].importo;
                  break;
                case 5:
                  obj['5'] = obj['5'] + balanceData[x].importo;
                  break;
                case 6:
                  obj['6'] = obj['6'] + balanceData[x].importo;
                  break;
                case 7:
                  obj['7'] = obj['7'] + balanceData[x].importo;
                  break;
                case 8:
                  obj['8'] = obj['8'] + balanceData[x].importo;
                  break;
                case 9:
                  obj['9'] = obj['9'] + balanceData[x].importo;
                  break;
                case 10:
                  obj['10'] = obj['10'] + balanceData[x].importo;
                  break;
                case 11:
                  obj['11'] = obj['11'] + balanceData[x].importo;
                  break;
                case 12:
                  obj['12'] = obj['12'] + balanceData[x].importo;
                  break;
                default:
              }
            }
          }
          categoryData.push(obj);

        });
        categoryData = categoryData.filter(function (cat) {
          return cat.idAmb;
        });
        categoryData = sortByKey(categoryData, 'idAmb');


        balanceData = sortByKey(balanceData, 'sottocategoria');

        var sottocategoryData = [];

        $scope.editDropDownSottoCategoriaArray.forEach(function (sottocategoria) {

          var obj = {
            'idSott': sottocategoria.sottocategoria,
            'sottocategoria': sottocategoria.label,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0,
            '7': 0,
            '8': 0,
            '9': 0,
            '10': 0,
            '11': 0,
            '12': 0
          };

          for (var x = 0; x < balanceData.length; x++) {
            if (balanceData[x].sottocategoria === sottocategoria.sottocategoria) {
              obj.idAmb = balanceData[x].ambito;
              obj.idCat = balanceData[x].categoria;
              switch (balanceData[x].mese) {
                case 1:
                  obj['1'] = obj['1'] + balanceData[x].importo;
                  break;
                case 2:
                  obj['2'] = obj['2'] + balanceData[x].importo;
                  break;
                case 3:
                  obj['3'] = obj['3'] + balanceData[x].importo;
                  break;
                case 4:
                  obj['4'] = obj['4'] + balanceData[x].importo;
                  break;
                case 5:
                  obj['5'] = obj['5'] + balanceData[x].importo;
                  break;
                case 6:
                  obj['6'] = obj['6'] + balanceData[x].importo;
                  break;
                case 7:
                  obj['7'] = obj['7'] + balanceData[x].importo;
                  break;
                case 8:
                  obj['8'] = obj['8'] + balanceData[x].importo;
                  break;
                case 9:
                  obj['9'] = obj['9'] + balanceData[x].importo;
                  break;
                case 10:
                  obj['10'] = obj['10'] + balanceData[x].importo;
                  break;
                case 11:
                  obj['11'] = obj['11'] + balanceData[x].importo;
                  break;
                case 12:
                  obj['12'] = obj['12'] + balanceData[x].importo;
                  break;
                default:
              }
            }
          }
          sottocategoryData.push(obj);
        });

        sottocategoryData = sottocategoryData.filter(function (sott) {
          return sott.idCat;
        });
        sottocategoryData = sortByKey(sottocategoryData, 'idCat');

        var tmpAmbId;
        var tmpCatId;

        var tmpData = [];
        for (var x = 0; x < ambitoData.length; x++) {
          tmpAmbId = ambitoData[x].idAmb;
          pivotData.push(ambitoData[x]);
          for (var y = 0; y < categoryData.length; y++) {
            tmpCatId = categoryData[y].idCat;
            if (tmpAmbId === categoryData[y].idAmb) {
              pivotData.push(categoryData[y]);
              for (var z = 0; z < sottocategoryData.length; z++) {
                if (tmpCatId === sottocategoryData[z].idCat) {
                  pivotData.push(sottocategoryData[z]);
                }
              }
            }
          }
        }

        $scope.gridOptionsPivotConto.data = pivotData;
        $interval($scope.gridOptionsPivotConto.gridApi.core.handleWindowResize, 100, 10);
        $timeout(function () {
          $scope.gridOptionsPivotConto.gridApi.treeBase.expandAllRows();
        }, 250);
      };

      /************************************************
       *                  TAB SETTINGS
       ************************************************/

      $scope.loadSettings = function () {
        $scope.gridOptionsAmb.data = $scope.editDropDownAmbitoArray.filter(function (j) {
          return j.ambito !== "null";
        });
        $scope.gridOptionsCat.data = $scope.editDropDownCategoriaArray.filter(function (j) {
          return j.categoria !== "null";
        });
        $scope.gridOptionsSott.data = $scope.editDropDownSottoCategoriaArray.filter(function (j) {
          return j.sottocategoria !== "null";
        });
        $scope.gridOptionsBen.data = $scope.editDropDownBeneficiarioArray.filter(function (j) {
          return j.beneficiario !== "null";
        });
        $scope.gridOptionsAmbCat.data = $scope.editDropDownCategoriaArray;
        $scope.gridOptionsCatSott.data = $scope.editDropDownSottoCategoriaArray;

        $scope.refreshGridSettings();
      }

      $scope.refreshGridSettings = function () {
        $interval($scope.gridOptionsAmb.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsCat.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsSott.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsBen.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsAmbCat.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsCatSott.gridApi.core.handleWindowResize, 100, 10);
      }

      $scope.afterCellEditSettingsFunction = function (rowEntity, colDef, newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }

        rowEntity.dirty = true;

      };

      $scope.gridOptionsAmb = {
        minRowsToShow: 8,
        rowTemplate: 'templates/rows/deletableRow.html',
        columnDefs: [{
          field: 'label'
       }, {
          field: 'used',
          displayName: 'In Uso'
       }],
        data: [],
        isRowSelectable: function (row) {
          return row.entity.used <= 0;
        },
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsAmb.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsCat = {
        minRowsToShow: 8,
        rowTemplate: 'templates/rows/deletableRow.html',
        columnDefs: [{
          field: 'label'
       }, {
          field: 'used',
          displayName: 'In Uso'
       }],
        data: [],
        isRowSelectable: function (row) {
          return row.entity.used <= 0;
        },
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsCat.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsSott = {
        minRowsToShow: 8,
        rowTemplate: 'templates/rows/deletableRow.html',
        columnDefs: [{
          field: 'label'
       }, {
          field: 'used',
          displayName: 'In Uso'
       }],
        data: [],
        isRowSelectable: function (row) {
          return row.entity.used <= 0;
        },
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsSott.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsBen = {
        rowTemplate: 'templates/rows/deletableRow.html',
        minRowsToShow: 8,
        columnDefs: [{
          field: 'label'
       }, {
          field: 'used',
          displayName: 'In Uso'
       }],
        data: [],
        isRowSelectable: function (row) {
          return row.entity.used <= 0;
        },
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsBen.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsAmbCat = {
        minRowsToShow: 8,
        rowTemplate: 'templates/rows/deletableRow.html',
        columnDefs: [{
            name: 'ambito',
            displayName: 'Ambito',
            field: 'ambito',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'ambito',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownAmbitoArray:"ambito":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              return $scope.editDropDownAmbitoArray;
            }
     },
          {
            name: 'categoria',
            displayName: 'Categoria',
            field: 'categoria',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'categoria',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownCategoriaArray:"categoria":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              return $scope.editDropDownCategoriaArray;
            }
     }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsAmbCat.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope. afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsCatSott = {
        minRowsToShow: 8,
        rowTemplate: 'templates/rows/deletableRow.html',
        columnDefs: [{
            name: 'categoria',
            displayName: 'Categoria',
            field: 'categoria',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'categoria',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownCategoriaArray:"categoria":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              return $scope.editDropDownCategoriaArray;
            }
     },
          {
            name: 'sottocategoria',
            displayName: 'Sottocategoria',
            field: 'sottocategoria',
            editableCellTemplate: 'templates/rows/dropdownEditor.html',
            editDropdownIdLabel: 'sottocategoria',
            editDropdownValueLabel: 'label',
            cellFilter: 'map:row.grid.appScope.$parent.editDropDownSottoCategoriaArray:"sottocategoria":"label"',
            editDropdownOptionsFunction: function (rowEntity, colDef) {
              return $scope.editDropDownSottoCategoriaArray;
            }
     }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsCatSott.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

    }]).filter('map', function () {
      return function () {
        return function (input, map, idLabel, valueLabel) {
          if (map !== null && map !== undefined) {
            for (var i = 0; i < map.length; i++) {
              if (map[i][idLabel] === input) {
                return map[i][valueLabel];
              }
            }
          }
          return '';
        };
      }();
    });
}());
