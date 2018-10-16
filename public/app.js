(function () {
  'use strict';

  angular.module('myApp', ['ngMaterial', 'ngMessages', 'ngTouch', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView', 'nvd3', 'ui.grid.pinning', 'ui.grid.autoResize'])
    .config(['$mdThemingProvider', function ($mdThemingProvider) {
      $mdThemingProvider.theme('default');
    }])
    .controller('MainController', ['$scope', '$http', 'uiGridConstants', '$log', '$q', '$interval', '$timeout', '$uibModal', '$strings', 'modalService', 'restService', 'utilService', function ($scope, $http, uiGridConstants, $log, $q, $interval, $timeout, $uibModal, $strings, modalService, restService, utilService) {

      $scope.dirty = false;

      $scope.season = {};
      $scope.season.value = {};
      $scope.fanta = {};
      $scope.fanta.value = {};
      $scope.seasons = [];
      $scope.giornata = {};
      $scope.giornata.value = {};
      $scope.giornate = [];

      $scope.menu = {
        isOpen: false,
        count: 0,
        selectedDirection: 'right'
      }

      $scope.login = {
        logged: false,
        admin: false,
        read: false
      };

      $scope.afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        $scope.dirty = true;
        rowEntity.dirty = true;
        var newSett = {};
        var oldSett = {};

        switch (colDef.name) {
          case 'data':
            rowEntity.anno = new Date(newValue).getFullYear();
            rowEntity.mese = new Date(newValue).getMonth() + 1;
            break;
          case 'ambito':
            newSett = $scope.editDropDownAmbitoArray.filter(function (a) {
              return a[colDef.name] === newValue;
            })[0];

            oldSett = $scope.editDropDownAmbitoArray.filter(function (a) {
              return a[colDef.name] === oldValue;
            })[0];
            rowEntity.categoria = null;
            rowEntity.sottocategoria = null;
            break;
          case 'categoria':
            newSett = $scope.editDropDownCategoriaArray.filter(function (a) {
              return a[colDef.name] === newValue;
            })[0];

            oldSett = $scope.editDropDownCategoriaArray.filter(function (a) {
              return a[colDef.name] === oldValue;
            })[0];
            rowEntity.sottocategoria = null;
            break;
          case 'sottocategoria':
            newSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
              return a[colDef.name] === newValue;
            })[0];

            oldSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
              return a[colDef.name] === oldValue;
            })[0];
            break;
          case 'beneficiario':
            newSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
              return a[colDef.name] === newValue;
            })[0];

            oldSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
              return a[colDef.name] === oldValue;
            })[0];
            break;
          default:
            break;
        }

        if (newSett) {
          newSett.used = newSett.used + 1;
        }

        if (oldSett) {
          oldSett.used += -1;
        }

      };

      $scope.gridOptions = {
          columnVirtualizationThreshold: 100,
          showGridFooter: true,
          showColumnFooter: true,
          minRowsToShow: 21,          
          enableFiltering: true,
          enableRowSelection: true,
          enableSelectAll: true,
          selectionRowHeaderWidth: 35,
          rowTemplate: 'templates/rows/deletableRow.html',
          enableColumnMenus: false,
          columnDefs: [
              {
                  field: 'data',
                  width: 90,
                  type: 'date',
                  cellFilter: 'date:\'yyyy-MM-dd\''
            },
              {
                  name: 'ambito',
                  displayName: 'Ambito',
                  field: 'ambito',
                  width: 100,
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
                  width: 150,
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
                  width: 200,
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
                  width: 200,
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
                  width: 160,
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
                  width: 160,
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
                  displayName: ' ',
                  width: 35,
                  cellTooltip: true,                  
                  cellTemplate: 'templates/rows/checkboxIcon.html',
                  buttonNgClass: 'fas fa-balance-scale',                  
                  headerCellClass: 'icon contabilizzata'
            },
              {
                  field: 'visualizzare',
                  displayName: ' ',
                  width: 35,
                  cellTooltip: true,                  
                  cellTemplate: 'templates/rows/checkboxIcon.html',
                  buttonNgClass: 'fas fa-eye',
                  headerCellClass: 'icon visualizzare'
            },
              {
                  field: 'cartaCredito',
                  displayName: ' ',
                  width: 35,
                  cellTooltip: true,                  
                  cellTemplate: 'templates/rows/checkboxIcon.html',
                  buttonNgClass: 'far fa-credit-card',
                  headerCellClass: 'icon cartacredito'
            },
              {
                  field: 'webapp',
                  displayName: ' ',
                  width: 35,
                  cellTooltip: true,                  
                  cellTemplate: 'templates/rows/checkboxIcon.html',
                  buttonNgClass: 'fab fa-telegram-plane',
                  headerCellClass: 'icon webapp'
            }, {
                  field: 'fissa',
                  displayName: ' ',
                  width: 35,
                  cellTooltip: true,                  
                  cellTemplate: 'templates/rows/checkboxIcon.html',
                  buttonNgClass: 'fas fa-bookmark',
                  headerCellClass: 'icon fissa'
            },
              {
                  field: 'importo',
                  aggregationType: uiGridConstants.aggregationTypes.sum,
                  footerCellFilter: 'currency',
                  cellFilter: 'currency',
                  width: 120,
                  cellTooltip: true,
                  cellClass: 'text-right',
                  type: 'number'
            },
              {
                  field: 'info',
                  cellTooltip: true,
                  width: '*'
            },
              {
                  field: 'anno',
                  diplayName: 'Anno',
                  width: 45
            },
              {
                  field: 'mese',
                  diplayName: 'Mese',
                  width: 40
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
        return $http.post('http://93.55.248.37:3001/login', user).then(function (resp) {
          // return $http.get('json/login.json').then(function (resp) {
          if (resp.data && resp.data.length === 1) {
            $scope.descName = resp.data[0]['NAME'];
            $scope.login.admin = resp.data[0]['PROFILE'] === 'admn' ? true : false;
            $scope.login.read = resp.data[0]['PROFILE'] === 'read' ? true : false;
            return restService.loadData($scope).then(function (resp) {
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

      $scope.salva = function () {

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

        dto.links.ambitocategoria = $scope.gridOptionsAmbCat.data.filter(function (ambcat) {
          return ambcat.dirty;
        });

        dto.links.categoriasottocategoria = $scope.gridOptionsCatSott.data.filter(function (catsott) {
          return catsott.dirty;
        })

        dto.finanze = $scope.gridOptions.data.filter(function (row) {
          return row.dirty && !(row.newRow && row.deleted);
        });

        dto.salary = $scope.gridOptionsSalary.data.filter(function (row) {
          return row.dirty;
        });

        dto.risultati = $scope.gridOptionsNextGame.data.filter(function (row) {
          return row.dirty;
        });


        if ($scope.dirty) {
          var modalSavingInstance = $uibModal.open({
            size: 'sm',
            templateUrl: 'templates/modal/savingModal.html',
            backdrop: false,
            keyboard: false
          });

          return $http.post('http://93.55.248.37:3001/save', dto).then(function (resp) {
            return restService.loadData($scope).then(function (resp) {
              if ($scope.login.admin) {
                $scope.loadSettings();
              }
              modalSavingInstance.close();
            });
          });
        }
      };

      $scope.backupData = [];

      $scope.actionButtons = [];
      $scope.settingButtons = [];
      $scope.saveButtons = [];

      $scope.addBtn = {
        src: 'images/baseline-add_circle_outline-24px.svg',
        listener: function (gridOptions) {
          gridOptions.data.unshift({
            newRow: true,
            data: new Date(),
            anno: new Date().getFullYear(),
            mese: new Date().getMonth() + 1,
            contabilizzata: true,
            visualizzare: true,
            cartaCredito: false,
            webapp: false,
              fissa: false
          });
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      $scope.deleteBtn = {
        src: 'images/baseline-remove_circle_outline-24px.svg',
        listener: function (gridOptions) {
          if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
              row.deleted = !row.deleted;
              row.dirty = true;
              $scope.dirty = true;
            });
          }

          gridOptions.gridApi.selection.clearSelectedRows();
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      $scope.copyBtn = {
        src: 'images/baseline-file_copy-24px.svg',
        listener: function (gridOptions) {
          if (gridOptions.gridApi.selection.getSelectedRows() && gridOptions.gridApi.selection.getSelectedRows().length > 0) {
            gridOptions.gridApi.selection.getSelectedRows().forEach(function (row) {
              var copyRow = angular.copy(row);
              copyRow.data = new Date();
              copyRow.newRow = true;
              copyRow.deleted = false;
              copyRow.dirty = true;
              $scope.dirty = true;
              gridOptions.data.unshift(copyRow);
            });
            gridOptions.gridApi.selection.clearSelectedRows();
          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };
      
        /* $scope.exportBtn = {
        src: 'images/baseline-cloud_download-24px.svg',
        listener: function (gridOptions) {
          return $scope.salva().then(function (response) {
            return $http.get('http://93.55.248.37:3001/export').then(function (resp) {
              var excel = utilService.b64toBlob(resp.data);
              var blob = new Blob([excel]);
              var alink = angular.element('<a/>');
              var link = alink[0];
              link.href = window.URL.createObjectURL(blob);
              link.download = 'Report.xlsx';
              link.target = '_blank';

              var evt = document.createEvent('MouseEvents');
              evt.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);

              link.dispatchEvent(evt);

              return resp;
            });
          });
        },
        disabled: function () {
          return false;
        }
      }; */

      $scope.actionButtons.push($scope.addBtn);
      $scope.actionButtons.push($scope.deleteBtn);
      $scope.actionButtons.push($scope.copyBtn);
      // $scope.actionButtons.push($scope.exportBtn);

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
            $scope.dirty = true;
            newSetting['label'] = '';
            newSetting.used = 0;

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
            $scope.dirty = true;
            var newLink = {
              dirty: true,
              newRow: true,
              deleted: false
            };
            if (type === 'ambcat') {
              $scope.gridOptionsAmbCat.data.unshift(newLink);
            } else if (type === 'catsott') {
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
              $scope.dirty = true;
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
          return $scope.salva();
        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.cancelBtn = {
        label: 'Annulla',
        listener: function (gridOptions) {
          var deferred = $q.defer();

          if ($scope.dirty) {
            var promise = modalService.showYesNoModal('Attenzione', "Ci sono delle modifiche pending non salvate, sei sicuro di voler annullare??", 'OK', 'Annulla');

            promise.then(function () {
              gridOptions.data = angular.copy($scope.backupData);
              $scope.dirty = false;
              deferred.resolve();
            }, function () {
              deferred.reject();
            });

          }
        },
        disabled: function () {
          return $scope.login.read;
        }
      };

      $scope.saveButtons.push($scope.saveBtn);
      $scope.saveButtons.push($scope.cancelBtn);

      /************************************************
       *                  TAB BILANCIO
       ************************************************/

      $scope.gridOptionsBalance = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 23,
        // enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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

        var avere = [];

        for (var x = 0; x < balanceData.length; x++) {
          if (balanceData[x].conto === 4) {
            var newAvere = {};
            if ($scope.editDropDownBeneficiarioArray.filter(function (ben) {
                return balanceData[x].beneficiario === ben.beneficiario;
              })[0]) {
              newAvere.beneficiario = $scope.editDropDownBeneficiarioArray.filter(function (ben) {
                return balanceData[x].beneficiario === ben.beneficiario;
              })[0].label;
            }

            if (balanceData[x].tipoConto === 1) {
              newAvere.contoComune = balanceData[x].importo;
            } else {
              newAvere.contoPersonale = balanceData[x].importo;
            }
            newAvere.dataVal = balanceData[x].data;
            avere.push(newAvere);
          }
        }

        $scope.gridOptionsAvere.data = avere;

        $interval($scope.gridOptionsBalance.gridApi.core.handleWindowResize, 100, 10);
        $interval($scope.gridOptionsAvere.gridApi.core.handleWindowResize, 100, 10);
      };

      $scope.refreshMainGrid = function () {
        if ($scope.gridOptions && $scope.gridOptions.gridApi) {
          $interval($scope.gridOptions.gridApi.core.handleWindowResize, 100, 10);
        }
      };

      $scope.gridOptionsAvere = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 23,
        // enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        columnDefs: [{
          field: 'dataVal',
          cellFilter: 'date:\'yyyy-MM-dd\''
        }, {
          field: 'beneficiario'
        }, {
          field: 'contoComune',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          field: 'contoPersonale',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsAvere.gridApi = gridApi;
        }
      };

      /************************************************
       *                  TAB PIVOT ANNO
       ************************************************/

      $scope.gridOptionPivotAnno = {
        columnVirtualizationThreshold: 100,
        minRowsToShow: 23,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
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
          $scope.gridOptionPivotAnno.gridApi = gridApi;

          $timeout(function () {
            $scope.gridOptionPivotAnno.gridApi.treeBase.expandAllRows();
          }, 250);
        }
      };

      $scope.pivot = {
        year: 2018,
        tipoConto: 1
      };
      $scope.years = [2018, 2017, 2016];

      $scope.loadPivotAnno = function () {
        var balanceData = angular.copy($scope.gridOptions.data).filter(function (obj) {
          return obj.anno === $scope.pivot.year && obj.tipoConto === $scope.pivot.tipoConto && obj.contabilizzata;
        });

        var pivotData = [];
          
        balanceData = utilService.sortByKey(balanceData, 'sottocategoria');
        balanceData = utilService.sortByKey(balanceData, 'categoria');
        balanceData = utilService.sortByKey(balanceData, 'ambito');    

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

          balanceData = utilService.sortByKey(balanceData, 'sottocategoria');
        balanceData = utilService.sortByKey(balanceData, 'categoria');
        

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
            if (balanceData[x].ambito === categoria.ambito && balanceData[x].categoria === categoria.categoria) {
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
        categoryData = utilService.sortByKey(categoryData, 'idAmb');


        balanceData = utilService.sortByKey(balanceData, 'sottocategoria');

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
            if (balanceData[x].categoria === sottocategoria.categoria && balanceData[x].sottocategoria === sottocategoria.sottocategoria) {
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
        sottocategoryData = utilService.sortByKey(sottocategoryData, 'idCat');

        var tmpAmbId;
        var tmpCatId;

        var removeDuplicates = function removeDuplicates(arr, key) {
          if (!(arr instanceof Array) || key && typeof key !== 'string') {
            return false;
          }

          if (key && typeof key === 'string') {
            return arr.filter((obj, index, arr) => {
              return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
            });

          } else {
            return arr.filter(function (item, index, arr) {
              return arr.indexOf(item) == index;
            });
          }
        };

        // categoryData = removeDuplicates(categoryData, 'idCat');
        // sottocategoryData = removeDuplicates(sottocategoryData, 'idSott');

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

        pivotData.shift();
          $scope.gridOptionPivotAnno.data = pivotData;
        $interval($scope.gridOptionPivotAnno.gridApi.core.handleWindowResize, 100, 10);
        $timeout(function () {
          $scope.gridOptionPivotAnno.gridApi.treeBase.expandAllRows();
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
        $scope.gridOptionsAmbCat.data = $scope.editDropDownCategoriaArray.filter(function (j) {
          return j.categoria !== "null" && j.ambito !== null;
        });
        $scope.gridOptionsCatSott.data = $scope.editDropDownSottoCategoriaArray.filter(function (j) {
          return j.sottocategoria !== "null" && j.categoria !== null;
        });

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
        $scope.dirty = true;

      };

      $scope.gridOptionsAmb = {
        minRowsToShow: 10,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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
        minRowsToShow: 10,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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
        minRowsToShow: 10,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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
        minRowsToShow: 10,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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
        minRowsToShow: 9,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      $scope.gridOptionsCatSott = {
        minRowsToShow: 9,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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

      /********************************************************************************
       *                      TAB GRAFICO
       ********************************************************************************/

      $scope.loadGrafico = function () {

        return $http.get('http://93.55.248.37:3001/graph').then(function (resp) {

          $scope.options = {
            chart: {
              type: 'lineChart',
              height: 720,
              margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 65
              },
              useInteractiveGuideline: true,
              x: function (d) {
                if (d) {
                  // return new Date(d.x).toISOString().slice(0, 10);
                  return d.x;
                }
              },
              y: function (d) {
                if (d) {
                  return d.y;
                }
              },
              xAxis: {
                axisLabel: 'Date (dd/mm/yy)',
                tickFormat: function (d) {
                  return d3.time.format('%d/%m/%y')(new Date(d))
                }
              },
              yAxis: {
                axisLabel: 'Totale (€)'
              }
            }
          };

          $scope.labels = [];
          var dataGraph = [
            {
              key: 'Conto Comune',
              values: [],
              color: '#ff7f0e'
            },
            {
              key: 'Conto Personale',
              values: [],
              color: '#7777ff'
            }
          ];

          var data = resp.data;

          data = resp.data.map(function (d) {
            var tmp = {};
            var dateVal = d['DATA_VAL'];
            var dateLong = new Date(dateVal).setMinutes(new Date(dateVal).getMinutes() - new Date(dateVal).getTimezoneOffset());

            if ($scope.labels.indexOf(dateLong) < 0) {
              $scope.labels.push(dateLong);
            }

            tmp.data = dateLong;
            tmp.tipoConto = d['TP_CONTO'];
            tmp.importo = d['TOTALE'];
            return tmp;
          });

          $scope.data = getDataGrafico();

          var oldImportPersonale = 0;
          var oldImportoComune = 0;

          function getDataGrafico() {

            $scope.labels.forEach(function (l) {

              var dataCC = [];
              dataCC.push(l);

              if (data.filter(function (d) {
                  return d.tipoConto === 1 && d.data === l;
                }).length > 0) {
                dataCC.push(data.filter(function (d) {
                  return d.tipoConto === 1 && d.data === l;
                })[0].importo);
                oldImportoComune = data.filter(function (d) {
                  return d.tipoConto === 1 && d.data === l;
                })[0].importo;
              } else {
                dataCC.push(oldImportoComune);
              }

              dataGraph[0].values.push(dataCC);

              var dataCP = [];
              dataCP.push(l);

              if (data.filter(function (d) {
                  return d.tipoConto === 2 && d.data === l;
                }).length > 0) {
                dataCP.push(data.filter(function (d) {
                  return d.tipoConto === 2 && d.data === l;
                })[0].importo);
                oldImportPersonale = data.filter(function (d) {
                  return d.tipoConto === 2 && d.data === l;
                })[0].importo;
              } else {
                dataCP.push(oldImportPersonale);
              }

              dataGraph[1].values.push(dataCP);

            });
            return dataGraph.map(function (series) {
              series.values = series.values.map(function (d) {
                return {
                  x: d[0],
                  y: d[1]
                };
              });
              return series;
            });
          };
        });
      };

      /******************************************************************
       *                         TAB HOME
       ******************************************************************/

      $scope.home = {};
      $scope.home.on = true;

      $scope.lightOn = function () {
        console.log("luce accesa");
      };

      $scope.lightCouchOnOff = function () {
        return $http.get('http://93.55.248.37:3001/hue/9');
      };

      $scope.lightLedOnOff = function () {
        return $http.get('http://93.55.248.37:3001/hue/4');
      };

      $scope.loadHome = function () {
        /* return $http.get('http://93.55.248.37:3001/temp').then(function (response) {        
          if (response.data) {
            $scope.temperature = response.data.temperature;
            $scope.humidity = response.data.humidity;
          }
        }); */
      };

      /************************************************
       *                  TAB PIVOT MESE
       ************************************************/

      $scope.gridOptionPivotMese = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        showColumnFooter: true,
        minRowsToShow: 23,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
        columnDefs: [{
            name: 'mese',
            displayName: 'Mese',
            field: 'mese',
            width: '30%'
      },
          {
            name: 'contocomune',
            displayName: 'Conto Comune',
            field: 'contocomune',
            width: '35%',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellFilter: 'currency',
            cellFilter: 'currency'
        }, {
            name: 'contopersonale',
            displayName: 'Conto Personale',
            field: 'contopersonale',
            width: '35%',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            footerCellFilter: 'currency',
            cellFilter: 'currency'
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionPivotMese.gridApi = gridApi;
        }
      };

      $scope.callbackPivotMese = function (scope, element) {
        $scope.apiPivotMese = scope.api;
      };

      $scope.loadPivotMese = function () {
        var balanceData = angular.copy($scope.gridOptions.data).filter(function (obj) {
          return obj.anno === $scope.pivot.year && obj.visualizzare && obj.conto !== 4;
        });

        var pivotData = [];

        var months = [{
            value: 1,
            mese: 'Gennaio'
        }, {
            value: 2,
            mese: 'Febbraio'
        }, {
            value: 3,
            mese: 'Marzo'
        },
          {
            value: 4,
            mese: 'Aprile'
        }, {
            value: 5,
            mese: 'Maggio'
        }, {
            value: 6,
            mese: 'Giugno'
        },
          {
            value: 7,
            mese: 'Luglio'
        }, {
            value: 8,
            mese: 'Agosto'
        }, {
            value: 9,
            mese: 'Settembre'
        },
          {
            value: 10,
            mese: 'Ottobre'
        }, {
            value: 11,
            mese: 'Novembre'
        }, {
            value: 12,
            mese: 'Dicembre'
        }];

        var dataContoComune = angular.copy(balanceData).filter(function (obj) {
          return obj.tipoConto === 1;
        });

        var dataContoPersonale = angular.copy(balanceData).filter(function (obj) {
          return obj.tipoConto === 2;
        });

        months.forEach(function (month) {

          var newRow = {};

          newRow.value = month.value;
          newRow.mese = month.mese;
          newRow.contocomune = utilService.filterArray(dataContoComune.map(function (obj) {
            if (obj.mese === month.value) {
              return obj.importo;
            }
          })).reduce(utilService.add, 0);

          newRow.contopersonale = utilService.filterArray(dataContoPersonale.map(function (obj) {
            if (obj.mese === month.value) {
              return obj.importo;
            }
          })).reduce(utilService.add, 0);

          pivotData.push(newRow);

        });

        $scope.gridOptionPivotMese.data = pivotData;
        $interval($scope.gridOptionPivotMese.gridApi.core.handleWindowResize, 100, 10);
        $scope.apiPivotMese.refreshWithTimeout(0);

        $scope.optionsMese = {
          chart: {
            type: 'lineChart',
            height: 720,
            margin: {
              top: 20,
              right: 20,
              bottom: 60,
              left: 65
            },
            x: function (d) {
              if (d) {
                return d.x;
              }
            },
            y: function (d) {
              if (d) {
                return d.y;
              }
            },
            useInteractiveGuideline: true,
            xAxis: {
              axisLabel: 'Month',
              tickFormat: function (d) {
                return d3.time.format('%B')(new Date($scope.pivot.year, d - 1, 1));
              }
            },
            yAxis: {
              axisLabel: 'Totale (€)',
              tickFormat: function (d) {
                return d3.round(d, 2) + " €";
              }
            }
          }
        };

        $scope.dataMese = [
          {
            key: 'Conto Comune',
            values: pivotData.map(function (d) {
              return {
                'x': d.value,
                'y': d.contocomune
              };
            }),
            color: '#ff7f0e',
            area: true
            },
          {
            key: 'Conto Personale',
            values: pivotData.map(function (d) {
              return {
                'x': d.value,
                'y': d.contopersonale
              };
            }),
            color: '#7777ff'
            }
          ];


      };


      /*****************************************************************
       *                      TAB WORK
       ****************************************************************/

      $scope.afterCellEditSalaryFunction = function (obj, colDef, newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }

        if (isNaN(Number(newValue))) {
          return;
        }

        obj.dirty = true;
        $scope.dirty = true;

        var numberValue = Number(newValue);

        switch (colDef.name) {
          case 'ggLavorativi':
            obj.retribuzioneOrdinaria = numberValue * obj.competenzaBase;
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'ggLavorativi', numberValue);
            break;
          case 'ggDetrazioni':
            obj.ggDetrazioni = numberValue;
            break;
          case 'festivitaNonGoduta':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'festivitaNonGoduta', numberValue);
            break;
          case 'competenzaBase':
            obj.stipendioLordo = obj.ggLavorativi * numberValue;
            obj.retribuzioneOrdinaria = obj.ggLavorativi * numberValue;
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'competenzaBase', numberValue);
            break;
          case 'liqRol':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'liqRol', numberValue);
            break;
          case 'compRol':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compRol', numberValue);
            break;
          case 'straordinario25':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'straordinario25', numberValue);
            break;
          case 'compStraordinario25':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compStraordinario25', numberValue);
            break;
          case 'maggiorazione25':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'maggiorazione25', numberValue);
            break;
          case 'compMaggiorazione25':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compMaggiorazione25', numberValue);
            break;
          case 'straordinario30':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'straordinario30', numberValue);
            break;
          case 'compStraordinario30':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compStraordinario30', numberValue);
            break;
          case 'maggiorazione30':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'maggiorazione30', numberValue);
            break;
          case 'compMaggiorazione30':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compMaggiorazione30', numberValue);
            break;
          case 'straordinario50':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'straordinario50', numberValue);
            break;
          case 'compStraordinario50':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compStraordinario50', numberValue);
            break;
          case 'maggiorazione50':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'maggiorazione50', numberValue);
            break;
          case 'compMaggiorazione50':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compMaggiorazione50', numberValue);
            break;
          case 'maggiorazione55':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'maggiorazione55', numberValue);
            break;
          case 'compMaggiorazione55':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compMaggiorazione55', numberValue);
            break;
          case 'maggiorazione60':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'maggiorazione60', numberValue);
            break;
          case 'compMaggiorazione60':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'compMaggiorazione60', numberValue);
            break;
          case 'periquativo':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'periquativo', numberValue);
            break;
          case 'erogazioneSpeciale':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'erogazioneSpeciale', numberValue);
            break;
          case 'premiInNatura':
            obj.impPrevNonArr = $scope.getImpPrevNonArr(obj, 'premiInNatura', numberValue);
            break;
          case 'addizionaleComunaleVariabile':
            obj.addizionaleComunaleVariabile = Math.round(numberValue * 100) / 100;
            break;
          case 'addizionaleComunaleVariabileAcconto':
            obj.addizionaleComunaleVariabileAcconto = Math.round(numberValue * 100) / 100;
            break;
          case 'addizionaleRegionaleFissa':
            obj.addizionaleRegionaleFissa = Math.round(numberValue * 100) / 100;
            break;
          case 'addizionaleRegionaleVariabile':
            obj.addizionaleRegionaleVariabile = Math.round(numberValue * 100) / 100;
            break;
          case 'abbonamentoAnnualeAtm':
            obj.abbonamentoAnnualeAtm = Math.round(numberValue * 100) / 100;
            break;
          default:
            break;
        }

        $scope.ricalcola(obj, angular.copy($scope.gridOptionsSalary.data));

      };

      $scope.gridOptionsSalary = {
        columnVirtualizationThreshold: 100,
        minRowsToShow: 23,
        enableFiltering: true,
        enableSorting: false,
        columnDefs: [{
            name: 'anno',
            displayName: 'Anno',
            field: 'anno',
            width: 50,
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false
      }, {
            name: 'mese',
            displayName: 'Mese',
            field: 'mese',
            width: 50,
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false
            }, {
            name: 'data',
            displayName: 'Data',
            field: 'data',
            width: 100,
            cellFilter: 'date:\'yyyy-MM-dd\'',
            cellClass: 'disable',
            pinnedLeft: true
            }, {
            name: 'stipendioLordo',
            displayName: 'Stipendio Lordo',
            field: 'stipendioLordo',
            width: 100,
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'retribuzioneOrdinaria',
            displayName: 'Retribuzione Ordinaria',
            field: 'retribuzioneOrdinaria',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            width: 100
        }, {
            name: 'totaleRitenute',
            displayName: 'Totale Ritenute',
            field: 'totaleRitenute',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            width: 100
        }, {
            name: 'totaleCompetenze',
            displayName: 'Totale Competenze',
            field: 'totaleCompetenze',
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable',
            width: 100
        }, {
            name: 'stipendioNetto',
            displayName: 'Stipendio Netto',
            field: 'stipendioNetto',
            width: 100,
            cellFilter: 'currency',
            pinnedLeft: true,
            cellClass: 'disable-green',
            enableCellEdit: false
        }, {
            name: 'ggLavorativi',
            displayName: 'Giorni INPS',
            field: 'ggLavorativi',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'ggDetrazioni',
            displayName: 'Giorni Detrazioni',
            field: 'ggDetrazioni',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'festivitaNonGoduta',
            displayName: 'Festività Non Goduta',
            field: 'festivitaNonGoduta',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'competenzaBase',
            displayName: 'Competenza Base',
            field: 'competenzaBase',
            // cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'liqRol',
            displayName: 'Ore ROL Liquidate',
            field: 'liqRol',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compRol',
            displayName: 'Compenso ROL',
            field: 'compRol',
            //  cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'straordinario25',
            displayName: 'Str. 25%',
            field: 'straordinario25',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compStraordinario25',
            displayName: 'Comp. Str. 25%',
            field: 'compStraordinario25',
            //  cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'maggiorazione25',
            displayName: 'Magg. Str. 25%',
            field: 'maggiorazione25',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compMaggiorazione25',
            displayName: 'Magg. Str. 25%',
            field: 'compMaggiorazione25',
            cellClass: 'text-right',
            //  cellFilter: 'currency',
            width: 100
        }, {
            name: 'straordinario30',
            displayName: 'Str. 30%',
            field: 'straordinario30',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compStraordinario30',
            displayName: 'Comp. Str. 30%',
            field: 'compStraordinario30',
            cellClass: 'text-right',
            //  cellFilter: 'currency',
            width: 100
        }, {
            name: 'maggiorazione30',
            displayName: 'Magg. Str. 30%',
            field: 'maggiorazione30',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compMaggiorazione30',
            displayName: 'Comp. Magg. Str. 30%',
            field: 'compMaggiorazione30',
            cellClass: 'text-right',
            //  cellFilter: 'currency',
            width: 100
        }, {
            name: 'straordinario50',
            displayName: 'Str. 50%',
            field: 'straordinario50',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compStraordinario50',
            displayName: 'Comp. Str. 50%',
            field: 'compStraordinario50',
            cellClass: 'text-right',
            //   cellFilter: 'currency',
            width: 100
        }, {
            name: 'maggiorazione50',
            displayName: 'Magg. Str. 50%',
            field: 'maggiorazione50',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compMaggiorazione50',
            displayName: 'Magg. Str. 50%',
            field: 'compMaggiorazione50',
            cellClass: 'text-right',
            //   cellFilter: 'currency',
            width: 100
        }, {
            name: 'maggiorazione55',
            displayName: 'Magg. Str. 55%',
            field: 'maggiorazione55',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compMaggiorazione55',
            displayName: 'Magg. Str. 55%',
            field: 'compMaggiorazione55',
            cellClass: 'text-right',
            //   cellFilter: 'currency',
            width: 100
        }, {
            name: 'maggiorazione60',
            displayName: 'Magg. Str. 60%',
            field: 'maggiorazione60',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'compMaggiorazione60',
            displayName: 'Magg. Str. 60%',
            field: 'compMaggiorazione60',
            cellClass: 'text-right',
            //  cellFilter: 'currency',
            width: 100
        }, {
            name: 'erogazioneSpeciale',
            displayName: 'Erogazione Speciale',
            field: 'erogazioneSpeciale',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'contributoSindacale',
            displayName: 'Contributo Sindacale',
            field: 'contributoSindacale',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'periquativo',
            displayName: 'Periquativo',
            field: 'periquativo',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'settetrenta',
            displayName: '730',
            field: 'settetrenta',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'premiInNatura',
            displayName: 'Premi In Natura',
            field: 'premiInNatura',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        },
          {
            name: 'impPrevNonArr',
            displayName: 'Imponibile Previdenziale NON Arrotondato',
            field: 'impPrevNonArr',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'impPrevArr',
            displayName: 'Imponibile Previdenziale Arrotondato',
            field: 'impPrevArr',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        },
          {
            name: 'ritenuteMeseInps',
            displayName: 'Ritenute Mese INPS',
            field: 'ritenuteMeseInps',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        },
          {
            name: 'imponibileFiscaleMese',
            displayName: 'Imponibile Fiscale Mese',
            field: 'imponibileFiscaleMese',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        },
          {
            name: 'ritenutaFiscaleMeseLorda',
            displayName: 'Ritenuta Fiscale Mese lorda',
            field: 'ritenutaFiscaleMeseLorda',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'detrazioniImposta',
            displayName: 'Detrazioni Imposta',
            field: 'detrazioniImposta',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'detrazioneConiuge',
            displayName: 'Detrazione Coniuge',
            field: 'detrazioneConiuge',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'detrazioneFigli',
            displayName: 'Detrazione Figli',
            field: 'detrazioneFigli',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'ritenutaFiscaleMeseNetta',
            displayName: 'Ritenuta Fiscale Mese Netta',
            field: 'ritenutaFiscaleMeseNetta',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'bonusRenzi',
            displayName: 'Bonus DL 66 del 24/04/2014',
            field: 'bonusRenzi',
            cellFilter: 'currency',
            width: 100,
            cellClass: 'disable',
            enableCellEdit: false
        }, {
            name: 'conguaglio',
            displayName: 'Conguaglio a Credito',
            field: 'conguaglio',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'conguaglioRenzi',
            displayName: 'Conguaglio a Credito DL 66 del 24/04/2014',
            field: 'conguaglioRenzi',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'conguaglioDebito',
            displayName: 'Conguaglio a Debito',
            field: 'conguaglioDebito',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'conguaglioDebitoRenzi',
            displayName: 'Conguaglio a Debili DL 66 del 24/04/2014',
            field: 'conguaglioDebitoRenzi',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'addizionaleComunaleVariabile',
            displayName: 'Addizionale Comunale Variabile',
            field: 'addizionaleComunaleVariabile',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'addizionaleComunaleVariabileAcconto',
            displayName: 'Addizionale Comunale Variabile Acconto',
            field: 'addizionaleComunaleVariabileAcconto',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'addizionaleRegionaleFissa',
            displayName: 'Addizionale Regionale Fissa',
            field: 'addizionaleRegionaleFissa',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'addizionaleRegionaleVariabile',
            displayName: 'Addizionale Regionale Variabile',
            field: 'addizionaleRegionaleVariabile',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }, {
            name: 'abbonamentoAnnualeAtm',
            displayName: 'Abbonamento Annuale ATM',
            field: 'abbonamentoAnnualeAtm',
            cellFilter: 'currency',
            cellClass: 'text-right',
            width: 100
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsSalary.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSalaryFunction);
        }
      };

      $scope.sumArray = function sumArray(array, field) {
        var total = 0.0;
        array.forEach(function (obj) {
          total += obj[field] || 0;
        });
        return total;
      };


      $scope.loadWork = function () {
        return $http.get('http://93.55.248.37:3001/aliquote').then(function (response) {
          $scope.aliquote = response.data;

          return $http.get('http://93.55.248.37:3001/aliquoteMese').then(function (response) {
            $scope.aliquoteMese = response.data;

            return $http.get('http://93.55.248.37:3001/salary').then(function (resp) {
              var salaryData = [];

              resp.data.forEach(function (obj) {
                var x = {};
                x.data = obj['DATA']
                x.anno = new Date(x.data).getFullYear();
                x.mese = new Date(x.data).getMonth() + 1;
                x.ggLavorativi = obj['GG_LAVORATIVI'];
                x.ggDetrazioni = obj['GG_DETRAZIONI'] > 0 ? obj['GG_DETRAZIONI'] : utilService.ultimo(x.mese, x.anno);
                x.liqRol = obj['LIQ_ROL'];
                x.compRol = obj['COMP_ROL'];
                x.straordinario25 = obj['STRAORDINARIO_25'];
                x.compStraordinario25 = obj['COMP_STRAORDINARIO_25'];
                x.maggiorazione25 = obj['MAGGIORAZIONE_25'];
                x.compMaggiorazione25 = obj['COMP_MAGGIORAZIONE_25'];
                x.straordinario30 = obj['STRAORDINARIO_30'];
                x.compStraordinario30 = obj['COMP_STRAORDINARIO_30'];
                x.maggiorazione30 = obj['MAGGIORAZIONE_30'];
                x.compMaggiorazione30 = obj['COMP_MAGGIORAZIONE_30'];
                x.straordinario50 = obj['STRAORDINARIO_50'];
                x.compStraordinario50 = obj['COMP_STRAORDINARIO_50'];
                x.maggiorazione50 = obj['MAGGIORAZIONE_50'];
                x.compMaggiorazione50 = obj['COMP_MAGGIORAZIONE_50'];
                x.maggiorazione55 = obj['MAGGIORAZIONE_55'];
                x.compMaggiorazione55 = obj['COMP_MAGGIORAZIONE_55'];
                x.maggiorazione60 = obj['MAGGIORAZIONE_60'];
                x.compMaggiorazione60 = obj['COMP_MAGGIORAZIONE_60'];
                x.festivitaNonGoduta = obj['FESTIVITA_NON_GODUTA'];
                x.periquativo = obj['PERIQUATIVO'];
                x.settetrenta = obj['SETTETRENTA'];
                x.premiInNatura = obj['PREMI_IN_NATURA'];
                x.contributoSindacale = obj['CONTR_SIND'];
                x.detrazioneConiuge = obj['DETRAZIONE_CONIUGE'];
                x.detrazioneFigli = obj['DETRAZIONE_FIGLI'];
                x.conguaglio = obj['CONGUAGLIO'];
                x.conguaglioRenzi = obj['CONGUAGLIO_RENZI'];
                x.conguaglioDebito = obj['CONGUAGLIO_DEBITO'];
                x.conguaglioDebitoRenzi = obj['CONGUAGLIO_DEBITO_RENZI'];
                x.erogazioneSpeciale = obj['EROGAZIONE_SPECIALE'];
                x.addizionaleComunaleVariabile = obj['ADD_COMUNALE_VARIABILE'];
                x.addizionaleComunaleVariabileAcconto = obj['ADD_COMUNALE_VARIABILE_ACC'];
                x.addizionaleRegionaleFissa = obj['ADD_REGIONALE_FISSA'];
                x.addizionaleRegionaleVariabile = obj['ADD_REGIONALE_VARIABILE'];
                x.abbonamentoAnnualeAtm = obj['ABBONAMENTO_ATM'];
                x.competenzaBase = obj['COMPETENZA_BASE'];
                salaryData.push(x);
              });

              salaryData.forEach(function (obj) {
                $scope.ricalcola(obj, salaryData);
              });

              $scope.gridOptionsSalary.data = salaryData;
              $interval($scope.gridOptionsSalary.gridApi.core.handleWindowResize, 200, 10);
            });
          });
        });
      };

      $scope.ricalcola = function (obj, salaryData) {
        obj.ggMese = utilService.ultimo(obj.mese, obj.anno);
        obj.stipendioLordo = obj.ggLavorativi * obj.competenzaBase;
        obj.retribuzioneOrdinaria = $scope.getRetribuzioneOrdinaria(obj);
        obj.impPrevNonArr = $scope.getImpPrevNonArr(obj);
        if (obj.mese === 12) {
          obj.impPrevArr = Math.floor(obj.impPrevNonArr);
        } else {
          obj.impPrevArr = Math.round(obj.impPrevNonArr);
        }
        obj.ritenuteMeseInps = Math.round($scope.getRitenuteMeseInps(obj) * 100) / 100;
        obj.imponibileFiscaleMese = obj.impPrevNonArr - obj.ritenuteMeseInps;
        obj.imponibileTotAnnuo = $scope.sumArray(salaryData.filter(function (tmp) {
          return tmp.anno === obj.anno && tmp.mese <= obj.mese;
        }), 'imponibileFiscaleMese');
        obj.ggLavorati = $scope.sumArray(salaryData.filter(function (tmp) {
          return tmp.anno === obj.anno && tmp.mese <= obj.mese;
        }), 'ggDetrazioni');
        obj.ggTrascorsi = $scope.sumArray(salaryData.filter(function (tmp) {
          return tmp.anno === obj.anno && tmp.mese <= obj.mese;
        }), 'ggMese');
        var nom = salaryData.filter(function (tmp) {
          return tmp.anno === obj.anno && tmp.mese <= obj.mese;
        }).length;
        if (obj.anno === 2012 && obj.mese === 2) {
          obj.imponibileMedio = ((obj.imponibileTotAnnuo / obj.ggMese) * obj.ggLavorati) / nom;
        } else {
          obj.imponibileMedio = ((obj.imponibileTotAnnuo / obj.ggLavorati) * obj.ggTrascorsi) / nom;
        }
        obj.imponibilePrevistoAnnuo = obj.imponibileTotAnnuo + (obj.imponibileMedio * (13 - obj.mese));
        obj.ritenutaFiscaleMeseLorda = $scope.getRitenutaFiscaleMeseLorda(obj);
        obj.detrazioniImposta = $scope.getDetrazioniImposta(obj);
        obj.ritenutaFiscaleMeseNetta = $scope.getRitenutaFiscaleMeseNetta(obj);
        obj.bonusRenzi = $scope.getBonusRenzi(obj);
        obj.totaleRitenute = $scope.getTotaleRitenute(obj);
        obj.totaleCompetenze = $scope.getTotaleCompetenze(obj);
        obj.stipendioNetto = obj.totaleCompetenze - obj.totaleRitenute;
      };

      $scope.getBonusRenzi = function (obj) {
        var dayOfMonth = new Date(obj.data).getDate();
        if (dayOfMonth === 27) {
          if (obj.anno >= 2014 && obj.anno < 2018) {
            return (obj.imponibilePrevistoAnnuo > 8000 && obj.imponibilePrevistoAnnuo <= 24000 ? 960 : (obj.imponibilePrevistoAnnuo > 24000 && obj.imponibilePrevistoAnnuo < 26000 ? 960 * ((26000 - obj.imponibilePrevistoAnnuo) / 2000) : 0)) / 365 * obj.ggDetrazioni;
          } else if (obj.anno >= 2018) {
            return (obj.imponibilePrevistoAnnuo > 8174 && obj.imponibilePrevistoAnnuo <= 24600 ? 960 : (obj.imponibilePrevistoAnnuo > 24600 && obj.imponibilePrevistoAnnuo < 26600 ? 960 * ((26600 - obj.imponibilePrevistoAnnuo) / 2000) : 0)) / 365 * obj.ggDetrazioni;
          } else {
            return 0.0;
          }
        } else {
          return 0.0;
        }
      }

      $scope.getDetrazioniImposta = function (obj) {

        var alq = $scope.aliquote.filter(function (a) {
          return a['ANNO'] === obj.anno;
        })[0];

        var dayOfMonth = new Date(obj.data).getDate();
        if (dayOfMonth === 27) {
          return (obj.imponibilePrevistoAnnuo <= alq['SOGLIA0'] ? alq['QUOTA0'] : (obj.imponibilePrevistoAnnuo <= alq['SOGLIA1'] ? (alq['QUOTA1'] + alq['QUOTA2'] * ((alq['SOGLIA1'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE1'])) : (alq['QUOTA1'] * ((alq['SOGLIA2'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE2'])))) / 365 * obj.ggDetrazioni;
        } else {
          return 0.0;
        }
      }

      $scope.getRitenutaFiscaleMeseLorda = function (obj) {

        var alqMese = $scope.aliquoteMese.filter(function (a) {
          return a['ANNO'] === obj.anno;
        })[0];

        return (obj.imponibileFiscaleMese <= alqMese['FASCIA1'] ? obj.imponibileFiscaleMese * alqMese['PERC1'] / 100 :
          (obj.imponibileFiscaleMese <= alqMese['FASCIA2'] ? alqMese['ALIQUOTA2'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA1']) * alqMese['PERC2'] / 100) :
            (obj.imponibileFiscaleMese <= alqMese['FASCIA3'] ? alqMese['ALIQUOTA3'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA2']) * alqMese['PERC3'] / 100) :
              (obj.imponibileFiscaleMese <= alqMese['FASCIA4'] ? alqMese['ALIQUOTA4'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA3']) * alqMese['PERC4'] / 100) : alqMese['ALIQUOTA5'] + ((obj.imponibileFiscaleMese - alqMese['FASCIA4']) * alqMese['PERC5'] / 100)))));
      };

      $scope.getRetribuzioneOrdinaria = function (obj) {
        return obj.ggLavorativi * obj.competenzaBase;
      };

      $scope.getRitenuteMeseInps = function (obj) {

        var alq = $scope.aliquote.filter(function (a) {
          return a['ANNO'] === obj.anno;
        })[0];

        return (obj.impPrevArr > alq['SOGLIA_FAP'] ? (obj.impPrevArr * alq['INPS'] / 100) +
          ((obj.impPrevArr - alq['SOGLIA_FAP']) * alq['ECCESSO_FAP'] / 100) : (obj.impPrevArr * alq['INPS'] / 100));
      }

      $scope.getImpPrevNonArr = function (obj, field, value) {

        if (field) {
          obj[field] = value;
        }

        return (Math.round(obj.retribuzioneOrdinaria * 100) / 100) + (Math.round((obj.festivitaNonGoduta * obj.competenzaBase) * 100) / 100) + (Math.round((obj.liqRol * obj.compRol) * 100) / 100) + (Math.round((obj.straordinario25 * obj.compStraordinario25) * 100) / 100) + (Math.round((obj.maggiorazione25 * obj.compMaggiorazione25) * 100) / 100) + (Math.round((obj.straordinario30 * obj.compStraordinario30) * 100) / 100) + (Math.round((obj.maggiorazione30 * obj.compMaggiorazione30) * 100) / 100) + (Math.round((obj.straordinario50 * obj.compStraordinario50) * 100) / 100) + (Math.round((obj.maggiorazione50 * obj.compMaggiorazione50) * 100) / 100) + (Math.round((obj.maggiorazione55 * obj.compMaggiorazione55) * 100) / 100) + (Math.round((obj.maggiorazione60 * obj.compMaggiorazione60) * 100) / 100) + (Math.round(obj.periquativo * 100) / 100) + (Math.round(obj.premiInNatura * 100) / 100) + (Math.round(obj.erogazioneSpeciale * 100) / 100);
      }

      $scope.getRitenutaFiscaleMeseNetta = function (obj) {
        return (Math.round(obj.ritenutaFiscaleMeseLorda * 100) / 100) - (Math.round(obj.detrazioniImposta * 100) / 100) - obj.detrazioneConiuge - obj.detrazioneFigli;
      };

      $scope.getTotaleRitenute = function (obj) {
        return (Math.round(obj.ritenuteMeseInps * 100) / 100) + (Math.round(obj.ritenutaFiscaleMeseNetta * 100) / 100) + (Math.round(obj.addizionaleComunaleVariabile * 100) / 100) + (Math.round(obj.addizionaleComunaleVariabileAcconto * 100) / 100) + (Math.round(obj.addizionaleRegionaleFissa * 100) / 100) + (Math.round(obj.addizionaleRegionaleVariabile * 100) / 100) + (Math.round(obj.abbonamentoAnnualeAtm * 100) / 100) + (Math.round(obj.conguaglioDebito * 100) / 100) + (Math.round(obj.conguaglioDebitoRenzi * 100) / 100) + (Math.round(obj.contributoSindacale * 100) / 100);
      };

      $scope.getTotaleCompetenze = function (obj) {
        return (Math.round(obj.retribuzioneOrdinaria * 100) / 100) + (Math.round((obj.festivitaNonGoduta * obj.competenzaBase) * 100) / 100) + (Math.round((obj.straordinario25 * obj.compStraordinario25) * 100) / 100) + (Math.round((obj.maggiorazione25 * obj.compMaggiorazione25) * 100) / 100) + (Math.round((obj.straordinario30 * obj.compStraordinario30) * 100) / 100) + (Math.round((obj.maggiorazione30 * obj.compMaggiorazione30) * 100) / 100) + (Math.round((obj.straordinario50 * obj.compStraordinario50) * 100) / 100) + (Math.round((obj.maggiorazione50 * obj.compMaggiorazione50) * 100) / 100) + (Math.round((obj.maggiorazione55 * obj.compMaggiorazione55) * 100) / 100) + (Math.round((obj.maggiorazione60 * obj.compMaggiorazione60) * 100) / 100) + (Math.round(obj.erogazioneSpeciale * 100) / 100) + (Math.round(obj.periquativo * 100) / 100) + (Math.round(obj.settetrenta * 100) / 100) + (Math.round(obj.premiInNatura * 100) / 100) + (Math.round(obj.bonusRenzi * 100) / 100) + (Math.round((obj.liqRol * obj.compRol) * 100) / 100) + (Math.round((obj.conguaglio) * 100) / 100) + (Math.round((obj.conguaglioRenzi) * 100) / 100);
      };

      /*****************************************************************
       *                      TAB ANDAMENTO ANNO
       ****************************************************************/

      $scope.gridOptionAndamentoAnnuo = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
        minRowsToShow: 23,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
        columnDefs: [{
          name: 'year',
          displayName: 'Anno',
          field: 'year',
          width: '30%'
            }, {
          name: 'contocomune',
          displayName: 'Conto Comune',
          field: 'contocomune',
          width: '35%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }, {
          name: 'contopersonale',
          displayName: 'Conto Personale',
          field: 'contopersonale',
          width: '35%',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionAndamentoAnnuo.gridApi = gridApi;
        }
      };

      $scope.callbackAndamentoAnnuo = function (scope, element) {
        $scope.apiAndamentoAnnuo = scope.api;
      };

      $scope.loadAndamentoAnnuo = function () {

        var lowest = Number.POSITIVE_INFINITY;
        var highest = Number.NEGATIVE_INFINITY;
        var tmp;
        var dataTmp = angular.copy($scope.gridOptions.data);
        for (var i = dataTmp.length - 1; i >= 0; i--) {
          tmp = dataTmp[i].anno;
          if (tmp < lowest) lowest = tmp;
          if (tmp > highest) highest = tmp;
        }

        var years = [];
        years.push(lowest);
        for (i = 1; i < highest - lowest; i++) {
          var y = lowest + i;
          years.push(y);
        }
        years.push(highest);


        var balanceData = angular.copy($scope.gridOptions.data).filter(function (obj) {
          return obj.conto !== 4;
        });

        var pivotData = [];

        var dataContoComune = angular.copy(balanceData).filter(function (obj) {
          return obj.tipoConto === 1;
        });

        var dataContoPersonale = angular.copy(balanceData).filter(function (obj) {
          return obj.tipoConto === 2;
        });

        years.forEach(function (year) {

          var newRow = {};

          newRow.value = year;
          newRow.year = year;
          newRow.contocomune = utilService.filterArray(dataContoComune.map(function (obj) {
            if (obj.anno <= year) {
              return obj.importo;
            }
          })).reduce(utilService.add, 0);

          newRow.contopersonale = utilService.filterArray(dataContoPersonale.map(function (obj) {
            if (obj.anno <= year) {
              return obj.importo;
            }
          })).reduce(utilService.add, 0);

          pivotData.push(newRow);

        });

        $scope.optionsAndamentoAnno = {
          chart: {
            type: 'lineChart',
            height: 720,
            margin: {
              top: 20,
              right: 20,
              bottom: 60,
              left: 65
            },
            useInteractiveGuideline: true,
            x: function (d) {
              if (d) {
                return d.x;
              }
            },
            y: function (d) {
              if (d) {
                return d.y;
              }
            },
            xAxis: {
              axisLabel: 'Year',
              tickFormat: function (d) {
                return d3.time.format('%Y')(new Date(d, 2, 1));
              }
            },
            yAxis: {
              axisLabel: 'Totale (€)',
              tickFormat: function (d) {
                return d3.round(d, 2) + " €";
              }
            }
          }
        };

        $scope.dataAndamentoAnno = [
          {
            key: 'Conto Comune',
            values: pivotData.map(function (d) {
              return {
                'x': d.value,
                'y': d.contocomune
              };
            }),
            color: '#ff7f0e',
            area: true
            },
          {
            key: 'Conto Personale',
            values: pivotData.map(function (d) {
              return {
                'x': d.value,
                'y': d.contopersonale
              };
            }),
            color: '#7777ff'
            }
          ];

        $scope.gridOptionAndamentoAnnuo.data = pivotData;
        $interval($scope.gridOptionAndamentoAnnuo.gridApi.core.handleWindowResize, 100, 10);
        $scope.apiAndamentoAnnuo.refreshWithTimeout(0);
      };


      /*****************************************************************************************
       *                          TAB AMAZON
       *****************************************************************************************/

      $scope.gridOptionsAmazon = {
        columnVirtualizationThreshold: 100,
        showGridFooter: true,
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
          $scope.gridOptionsAmazon.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, $scope.onSelectASIN);
        }
      };

      $scope.onSelectASIN = function onSelectASIN(row) {
        var asin = {};
        asin.asinOrig = row.entity.asinOrig;
        return $http.post('http://93.55.248.37:3001/amazonProduct', asin).then(function (resp) {
          $scope.amzLink = resp.data.ItemLookupResponse.Items.Item.DetailPageURL;
          $scope.amzPrice = resp.data.ItemLookupResponse.Items.Item.OfferSummary.LowestNewPrice.FormattedPrice;
          $scope.amzImage = resp.data.ItemLookupResponse.Items.Item.LargeImage.URL;
          $scope.amzHeight = resp.data.ItemLookupResponse.Items.Item.LargeImage.Height._;
          $scope.amzWidth = resp.data.ItemLookupResponse.Items.Item.LargeImage.Width._;
        });
      };


      $scope.loadAmazonData = function () {

        var dataAmazon = [];

        return $http.get('http://93.55.248.37:3001/amazon').then(function (resp) {
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

          $scope.gridOptionsAmazon.data = dataAmazon;
          $interval($scope.gridOptionsAmazon.gridApi.core.handleWindowResize, 100, 10);
        });
      };

      /*****************************************************************************************
       *                          TAB MATCH ANALYSIS
       *****************************************************************************************/

      $scope.gridOptionsClassifica = {
        columnVirtualizationThreshold: 100,
        showGridFooter: false,
        minRowsToShow: 22,
        // enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
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
        },{
          name: 'giornataHome',
          displayName: '#GC',
          field: 'giornataHome',
          width: 35
        },  {
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
        },{
          name: 'giornataAway',
          displayName: '#GT',
          field: 'giornataAway',
          width: 35
        },  {
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
          $scope.gridOptionsClassifica.gridApi = gridApi;
        }
      };

      $scope.checkEditableCondition = function checkEditableCondition(scope) {
        return $scope.editableCondition(scope.row.entity, scope.col.colDef);
      }

      $scope.editableCondition = function editableCondition(rowEntity, colDef) {

        if (rowEntity.giocata && new Date($scope.dataGameNext) < new Date()) {
          return false;
        }

        if (colDef.name === 'golCasa' || colDef.name === 'golTrasferta') {
          return true;
        }

        return false;
      }

      $scope.gridOptionsNextGame = {
        columnVirtualizationThreshold: 100,
        showGridFooter: false,
        minRowsToShow: 10,
        // enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        // enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
        cellEditableCondition: $scope.checkEditableCondition,
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
            width: 55
        }, {
            name: 'percDraw',
            displayName: '%X',
            field: 'percDraw',
            width: 55
        }, {
            name: 'percLoss',
            displayName: '%2',
            field: 'percLoss',
            width: 55
        },
                    /* {
                             name: 'perc1X',
                             displayName: '%1X',
                             field: 'perc1X',
                             width: 55
                           }, {
                             name: 'percX2',
                             displayName: '%X2',
                             field: 'percX2',
                             width: 55
                           }, {
                             name: 'perc12',
                             displayName: '%12',
                             field: 'perc12',
                             width: 55
                           }, */
          {
            name: 'percgg',
            displayName: '%GG',
            field: 'percgg',
            width: 55
        }, {
            name: 'percng',
            displayName: '%NG',
            field: 'percng',
            width: 55
        }, {
            name: 'percO1',
            displayName: '%O1.5',
            field: 'percO1',
            width: 55
        }, {
            name: 'percU1',
            displayName: '%U1.5',
            field: 'percU1',
            width: 55
        }, {
            name: 'percO2',
            displayName: '%O2.5',
            field: 'percO2',
            width: 55
        }, {
            name: 'percU2',
            displayName: '%U2.5',
            field: 'percU2',
            width: 55
        }],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridOptionsNextGame.gridApi = gridApi;

          gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
        }
      };

      /* $scope.gridOptionsPrevGame = {
         columnVirtualizationThreshold: 100,
         showGridFooter: false,
         minRowsToShow: 10,
         enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
         enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
         enableFiltering: false,
         selectionRowHeaderWidth: 35,
         enableSorting: false,
         enableColumnMenus: false,
         columnDefs: [{
           name: 'squadraCasa',
           displayName: 'CASA',
           field: 'squadraCasa',
           width: '*'
         }, {
           name: 'squadraTrasferta',
           displayName: 'TRASFERTA',
           field: 'squadraTrasferta',
           width: '*'
         }, {
           name: 'golCasa',
           displayName: ' ',
           field: 'golCasa',
           width: 35
         }, {
           name: 'golTrasferta',
           displayName: ' ',
           field: 'golTrasferta',
           width: 35
         }],
         data: [],
         onRegisterApi: function (gridApi) {
           $scope.gridOptionsPrevGame.gridApi = gridApi;
         }
       }; */

      $scope.loadMatchAnalysis = function () {

        $scope.dataMatchAnalysis = [];

        // $scope.season.name = seasonValue.name;     
        // var dataPrevGame = [];

        return $http.post('http://93.55.248.37:3001/classifica', $scope.season.value).then(function (resp) {
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
              $scope.dataMatchAnalysis.push(tmp);
              return tmp;
            });
          }

          $scope.gridOptionsClassifica.data = $scope.dataMatchAnalysis;
          $interval($scope.gridOptionsClassifica.gridApi.core.handleWindowResize, 100, 10);
        });
      };

      $scope.loadSeasons = function () {
        return $http.get('http://93.55.248.37:3001/seasons').then(function (resp) {
          $scope.seasons = resp.data.map(function (tmp) {
            var obj = {};
            obj.id = tmp.id;
            obj.name = tmp.name;
            return obj;
          });
        });
      };


      $scope.loadGiornate = function () {
        return $http.post('http://93.55.248.37:3001/giornate', $scope.season.value).then(function (resp) {
          $scope.giornate = resp.data.map(function (tmp) {
            var obj = {};
            obj.id = tmp.id;
            obj.name = tmp.name;
            return obj;
          });
        });
      };

      $scope.loadGiornata = function () {
        $scope.dataLastFiveGame = [];

        return $http.post('http://93.55.248.37:3001/lastfivegame', $scope.season.value).then(function (resp) {
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
              $scope.dataLastFiveGame.push(tmp);
              return tmp;
            });
          }
          var dto = {};
          dto.idSeason = $scope.season.value.id;
          dto.idGiornata = $scope.giornata.value.id;

          return $http.post('http://93.55.248.37:3001/nextgame', dto).then(function (resp) {

            $scope.dataNextGame = [];

            if (resp.data.length > 0) {
              resp.data.map(function (obj) {
                var tmp = {};
                $scope.giornNext = obj['GIORNATA'];
                $scope.dataGameNext = obj['DATA_GAME'].substr(0, 10);
                tmp.idHome = obj['ID_HOME'];
                tmp.squadraCasa = obj['TEAM_HOME'];
                tmp.idAway = obj['ID_AWAY'];
                tmp.squadraTrasferta = obj['TEAM_AWAY'];
                tmp.golCasa = obj['SCORE_HOME'];
                tmp.golTrasferta = obj['SCORE_AWAY'];
                tmp.giocata = obj['GIOCATA'] === 'T' ? true : false;
                tmp.season = $scope.season.value.id;
                tmp.giornata = $scope.giornata.value.id;
                var winTotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'vtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var winHomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'vc') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var winLastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'vtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propWinHome = (winTotPercHome + winHomePercHome + winLastFiveHome) / 3;
                var drawTotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'ptot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var drawHomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'pc') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var drawLastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'ptot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propDrawHome = (drawTotPercHome + drawHomePercHome + drawLastFiveHome) / 3;
                var lossTotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'stot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var lossHomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'sc') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var lossLastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'stot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propLossHome = (lossTotPercHome + lossHomePercHome + lossLastFiveHome) / 3;

                var winTotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'vtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var winAwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'vt') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var winLastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'vtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propWinAway = (winTotPercAway + winAwayPercAway + winLastFiveAway) / 3;
                var drawTotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'ptot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var drawAwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'pt') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var drawLastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'ptot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propDrawAway = (drawTotPercAway + drawAwayPercAway + drawLastFiveAway) / 3;
                var lossTotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'stot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var lossAwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'st') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var lossLastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'stot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propLossAway = (lossTotPercAway + lossAwayPercAway + lossLastFiveAway) / 3;

                var ggTotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'ggtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var ggHomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'gghome') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var ggLastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'ggtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propGgHome = (ggTotPercHome + ggHomePercHome + ggLastFiveHome) / 3;

                var ggTotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'ggtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var ggAwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'ggaway') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var ggLastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'ggtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propGgAway = (ggTotPercAway + ggAwayPercAway + ggLastFiveAway) / 3;

                var ngTotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'ngtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var ngHomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'nghome') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var ngLastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'ngtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propNgHome = (ngTotPercHome + ngHomePercHome + ngLastFiveHome) / 3;

                var ngTotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'ngtot') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var ngAwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'ngaway') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var ngLastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'ngtot') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propNgAway = (ngTotPercAway + ngAwayPercAway + ngLastFiveAway) / 3;

                var over1TotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'over1') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var over1HomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'over1c') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var over1LastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'over1') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propOver1Home = (over1TotPercHome + over1HomePercHome + over1LastFiveHome) / 3;

                var over1TotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'over1') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var over1AwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'over1c') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var over1LastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'over1') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propOver1Away = (over1TotPercAway + over1AwayPercAway + over1LastFiveAway) / 3;

                var under1TotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'under1') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var under1HomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'under1t') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var under1LastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'under1') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propUnder1Home = (under1TotPercHome + under1HomePercHome + under1LastFiveHome) / 3;

                var under1TotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'under1') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var under1AwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'under1t') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var under1LastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'under1') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propUnder1Away = (under1TotPercAway + under1AwayPercAway + under1LastFiveAway) / 3;

                var over2TotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'over2') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var over2HomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'over2c') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var over2LastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'over2') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propOver2Home = (over2TotPercHome + over2HomePercHome + over2LastFiveHome) / 3;

                var over2TotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'over2') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var over2AwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'over2c') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var over2LastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'over2') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propOver2Away = (over2TotPercAway + over2AwayPercAway + over2LastFiveAway) / 3;

                var under2TotPercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'under2') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornata') * 100;
                var under2HomePercHome = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'under2t') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idHome, 'giornataHome') * 100;
                var under2LastFiveHome = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'under2') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idHome, 'giornata') * 100;
                var propUnder2Home = (under2TotPercHome + under2HomePercHome + under2LastFiveHome) / 3;

                var under2TotPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'under2') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornata') * 100;
                var under2AwayPercAway = utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'under2t') / utilService.extractMatchValue($scope.dataMatchAnalysis, tmp.idAway, 'giornataAway') * 100;
                var under2LastFiveAway = utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'under2') / utilService.extractMatchValue($scope.dataLastFiveGame, tmp.idAway, 'giornata') * 100;
                var propUnder2Away = (under2TotPercAway + under2AwayPercAway + under2LastFiveAway) / 3;

                tmp.percWin = Math.round(((propWinHome + propLossAway) / 2) * 100) / 100;
                tmp.percDraw = Math.round(((propDrawHome + propDrawAway) / 2) * 100) / 100;
                tmp.percLoss = Math.round(((propLossHome + propWinAway) / 2) * 100) / 100;

                // tmp.perc1X = Math.round((tmp.percWin + tmp.percDraw) * 100) / 100;
                //  tmp.perc12 = Math.round((tmp.percWin + tmp.percLoss) * 100) / 100;
                //  tmp.percX2 = Math.round((tmp.percDraw + tmp.percLoss) * 100) / 100;

                tmp.percgg = Math.round(((propGgHome + propGgAway) / 2) * 100) / 100;
                tmp.percng = Math.round(((propNgHome + propNgAway) / 2) * 100) / 100;

                tmp.percO1 = Math.round(((propOver1Home + propOver1Away) / 2) * 100) / 100;
                tmp.percU1 = Math.round(((propUnder1Home + propUnder1Away) / 2) * 100) / 100;

                tmp.percO2 = Math.round(((propOver2Home + propOver2Away) / 2) * 100) / 100;
                tmp.percU2 = Math.round(((propUnder2Home + propUnder2Away) / 2) * 100) / 100;

                $scope.dataNextGame.push(tmp);
                return tmp;
              });
            }
            $scope.gridOptionsNextGame.data = $scope.dataNextGame;
            $interval($scope.gridOptionsNextGame.gridApi.core.handleWindowResize, 100, 10);
          });
        });
      };

      /***************************************************************************************************
       *                      TAB FANTACALCIO
       **************************************************************************************************/

      $scope.fantacalcio = [{
        id: 1,
        name: "FANTAFIGHETTINO"
            }, {
        id: 2,
        name: "FANTAMARELLI"
            }, {
        id: 3,
        name: "FANTABOMBOLACCI"
            }];

      $scope.gridOptionsPandathinaikos = {
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
          width: 140,
          pinnedLeft: true
                }, {
          name: 'VALORE_ACQUISTO',
          displayName: 'Val. Acqs.',
          field: 'VALORE_ACQUISTO',
          cellClass: 'text-right',
          width: 50
                }, {
          name: 'PG_TOT',
          displayName: 'Gioc.',
          field: 'PG_TOT',
          cellClass: 'text-right',
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
          cellClass: 'text-right',
          width: 50
                }, {
          name: 'PG_HOME',
          displayName: 'Gioc. Home',
          field: 'PG_HOME',
          cellClass: 'text-right',
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
          cellClass: 'text-right',
          width: 50
                }, {
          name: 'PG_AWAY',
          displayName: 'Gioc. Away',
          field: 'PG_AWAY',
          cellClass: 'text-right',
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
          $scope.gridOptionsPandathinaikos.gridApi = gridApi;
        }
      };

      $scope.loadFantaRosa = function () {

        switch ($scope.fanta.value.id) {
          case 1:
            return $http.get('http://93.55.248.37:3001/fantafighettino').then(function (resp) {
              $scope.gridOptionsPandathinaikos.data = resp.data;
            });
            break;
          case 2:
            return $http.get('http://93.55.248.37:3001/fantamarelli').then(function (resp) {
              $scope.gridOptionsPandathinaikos.data = resp.data;
            });
            break;
          case 3:
            return $http.get('http://93.55.248.37:3001/fantabombolacci').then(function (resp) {
              $scope.gridOptionsPandathinaikos.data = resp.data;
            });
            break;
          default:
            return $http.get('http://93.55.248.37:3001/fantafighettino').then(function (resp) {
              $scope.gridOptionsPandathinaikos.data = resp.data;
            });
            break;
        }
        $interval($scope.gridOptionsPandathinaikos.gridApi.core.handleWindowResize, 100, 10);
      };
        
        /************************************************
       *                  TAB REPORT MESE
       ************************************************/

      $scope.gridReportMese = {
        columnVirtualizationThreshold: 100,
        minRowsToShow: 23,
        enableFiltering: false,
        selectionRowHeaderWidth: 35,
        enableSorting: false,
        enableColumnMenus: false,
        columnDefs: [{
          name: 'DESC_AMB',
          displayName: 'Ambito',
          field: 'DESC_AMB',
          width: '10%'
            }, {
          name: 'DESC_CAT',
          displayName: 'Categoria',
          field: 'DESC_CAT',
          width: '10%'
        }, {
          name: 'DESC_SOT',
          displayName: 'Sottocategoria',
          field: 'DESC_SOT',
          width: '10%'
        }, {
          name: 'TOTALE',
          displayName: 'TOT.',
          field: 'TOTALE',
          width: '*',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency'
        } ],
        data: [],
        onRegisterApi: function (gridApi) {
          $scope.gridReportMese.gridApi = gridApi;

          $timeout(function () {
            $scope.gridReportMese.gridApi.treeBase.expandAllRows();
          }, 250);
        }
      };
        
        $scope.loadReportMese = function () {
          var dto = {};
          dto.tipoconto = $scope.pivot.tipoConto;                      
            
            return $http.post('http://93.55.248.37:3001/reportmese', dto).then(function (resp) {          
          if (resp.data && resp.data.length > 0) {
            resp.data.map(function(d){
                return d.$$treeLevel = d['LIVELLO'] -1;
            });
          } 
            gridReportMese.data = resp.data;    
                
        });
            
            
        };            


          }])
    .filter('map', function () {
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
