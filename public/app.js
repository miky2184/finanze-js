(function () {
  'use strict';

  var myApp = angular.module('myApp', ['ngTouch', 'ui.grid', 'ui.bootstrap', 'ui.grid.selection', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.exporter', 'ui.grid.treeView', 'nvd3', 'ui.grid.pinning']);

  myApp.controller('MainController', ['$scope', '$http', 'uiGridConstants', '$log', '$q', '$interval', '$timeout', '$uibModal', function ($scope, $http, uiGridConstants, $log, $q, $interval, $timeout, $uibModal) {

    $scope.login = {
      logged: false,
      admin: false,
      read: false
    };

    $scope.afterCellEditFunction = function (rowEntity, colDef, newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

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
          break;
        case 'categoria':
          newSett = $scope.editDropDownCategoriaArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownCategoriaArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];
        case 'sottocategoria':
          newSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownSottoCategoriaArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];
        case 'beneficiario':
          newSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
            return a[colDef.name] === newValue;
          })[0];

          oldSett = $scope.editDropDownBeneficiarioArray.filter(function (a) {
            return a[colDef.name] === oldValue;
          })[0];
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
      minRowsToShow: 20,
      enableFiltering: true,
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 35,
      rowTemplate: 'templates/rows/deletableRow.html',
      enableColumnMenus: false,
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
          width: '6%',
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
          width: '10%',
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
          width: '13%',
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
          width: '*',
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
          width: '10%',
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
          width: '9%',
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
          width: '2%',
          cellTooltip: true,
          cellTemplate: 'templates/rows/checkboxIcon.html',
          buttonNgClass: 'fas fa-balance-scale'
            },
        {
          field: 'visualizzare',
          width: '2%',
          cellTooltip: true,
          cellTemplate: 'templates/rows/checkboxIcon.html',
          buttonNgClass: 'fas fa-eye'
            },
        {
          field: 'cartaCredito',
          width: '2%',
          cellTooltip: true,
          cellTemplate: 'templates/rows/checkboxIcon.html',
          buttonNgClass: 'far fa-credit-card'
            },
        {
          field: 'webapp',
          width: '2%',
          cellTooltip: true,
          cellTemplate: 'templates/rows/checkboxIcon.html',
          buttonNgClass: 'fab fa-telegram-plane'
            },
        {
          field: 'importo',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          footerCellFilter: 'currency',
          cellFilter: 'currency',
          width: '6%',
          cellTooltip: true,
          cellClass: 'text-right',
          type: 'number'
            },
        {
          field: 'info',
          cellTooltip: true,
          width: '12%'
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
      return $http.post('http://2.225.127.144:3001/login', user).then(function (resp) {
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

      var modalSearchInstance = $uibModal.open({
        size: 'sm',
        templateUrl: 'templates/modal/waitingModal.html',
        backdrop: false,
        keyboard: false
      });

      return $http.get('http://2.225.127.144:3001/ambito').then(function (response) {
        // return $http.get('json/ambito.json').then(function (response) {
        if (response.data) {
          response.data.unshift({
            "ambito": "null",
            "label": " "
          });
        }
        $scope.editDropDownAmbitoArray = response.data;

        return $http.get('http://2.225.127.144:3001/categoria').then(function (response) {
          // return $http.get('json/categoria.json').then(function (response) {
          if (response.data) {
            response.data.unshift({
              "categoria": "null",
              "label": " "
            });
          }
          $scope.editDropDownCategoriaArray = response.data;

          return $http.get('http://2.225.127.144:3001/sottocategoria').then(function (response) {
            // return $http.get('json/sottocategoria.json').then(function (response) {
            if (response.data) {
              response.data.unshift({
                "sottocategoria": "null",
                "label": " "
              });
            }
            $scope.editDropDownSottoCategoriaArray = response.data;

            return $http.get('http://2.225.127.144:3001/beneficiario').then(function (response) {
              // return $http.get('json/beneficiario.json').then(function (response) {
              if (response.data) {
                response.data.unshift({
                  "beneficiario": "null",
                  "label": " "
                });
              }
              $scope.editDropDownBeneficiarioArray = response.data;

              return $http.get('http://2.225.127.144:3001/tipoConto').then(function (response) {
                // return $http.get('json/tipoConto.json').then(function (response) {
                $scope.editDropDownTipoContoArray = response.data;

                return $http.get('http://2.225.127.144:3001/conto').then(function (response) {
                  // return $http.get('json/conto.json').then(function (response) {
                  $scope.editDropDownContoArray = response.data;

                  return $http.get('http://2.225.127.144:3001/all').
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
                      newRow.cartaCredito = row['FL_CC'] === 'SI' ? true : false;
                      newRow.webapp = row['WEBAPP'] === 'SI' ? true : false;
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
                    modalSearchInstance.close();
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

    $scope.b64toBlob = function b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = b64Data;
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {
        type: contentType
      });
      return blob;
    };

    $scope.addBtn = {
      label: '+',
      listener: function (gridOptions) {
        gridOptions.data.unshift({
          /* id: Math.max(...gridOptions.data.filter(function (j) {
             return j.id !== "null";
           }).map(function (obj) {
             return obj.id;
           })) + 1; */
          newRow: true,
          data: new Date(),
          anno: new Date().getFullYear(),
          mese: new Date().getMonth() + 1,
          contabilizzata: true,
          visualizzare: true,
          cartaCredito: false,
          webapp: false
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

        gridOptions.gridApi.selection.clearSelectedRows();
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
    $scope.exportBtn = {
      label: 'Export',
      listener: function (gridOptions) {
        return $scope.salva().then(function (response) {
          return $http.get('http://2.225.127.144:3001/export').then(function (resp) {
            var excel = $scope.b64toBlob(resp.data);
            var blob = new Blob([excel]);
            var alink = angular.element('<a/>');
            var link = alink[0];
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Report.xlsx';
            link.target = '_blank';

            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window,
              0, 0, 0, 0, 0, false, false, false, false, 0, null);

            // modalService.hideWaitingModal();

            link.dispatchEvent(evt);

            return resp;
          });
        });
      },
      disabled: function () {
        return false;
      }
    };

    $scope.actionButtons.push($scope.addBtn);
    $scope.actionButtons.push($scope.deleteBtn);
    $scope.actionButtons.push($scope.copyBtn);
    $scope.actionButtons.push($scope.exportBtn);

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
          });
        }
      },
      disabled: function () {
        return $scope.login.read;
      }
    };

    $scope.settingButtons.push($scope.addSettingBtn);
    $scope.settingButtons.push($scope.deleteSettingBtn);

    $scope.salva = function () {


      var modalSavingInstance = $uibModal.open({
        size: 'sm',
        templateUrl: 'templates/modal/savingModal.html',
        backdrop: false,
        keyboard: false
      });

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

      return $http.post('http://2.225.127.144:3001/save', dto).then(function (resp) {
        return $scope.loadData().then(function (resp) {
          if ($scope.login.admin) {
            $scope.loadSettings();
          }
          modalSavingInstance.close();
        });
      });
    };

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
      minRowsToShow: 10,
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
      minRowsToShow: 10,
      enableFiltering: false,
      selectionRowHeaderWidth: 35,
      columnDefs: [{
        field: 'dataVal',
        cellFilter: 'date:\'yyyy-MM-dd\''
        }, {
        field: 'beneficiario'
        }, {
        field: 'contoComune'
        }, {
        field: 'contoPersonale'
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
      showGridFooter: true,
      showColumnFooter: true,
      minRowsToShow: 14,
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

        gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditSettingsFunction);
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

    /********************************************************************************
     *                      TAB GRAFICO
     ********************************************************************************/

    $scope.loadGrafico = function () {

      return $http.get('http://2.225.127.144:3001/graph').then(function (resp) {

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
      return $http.get('http://2.225.127.144:3001/hue/9');
    };

    $scope.lightLedOnOff = function () {
      return $http.get('http://2.225.127.144:3001/hue/4');
    };

    $scope.loadHome = function () {
      return $http.get('http://2.225.127.144:3001/temp').then(function (response) {
        // return $http.get('json/ambito.json').then(function (response) {
        if (response.data) {
          $scope.temperature = response.data.temperature;
          $scope.humidity = response.data.humidity;
        }
      });
    };

    /************************************************
     *                  TAB PIVOT MESE
     ************************************************/

    $scope.gridOptionPivotMese = {
      columnVirtualizationThreshold: 100,
      showGridFooter: true,
      showColumnFooter: true,
      minRowsToShow: 13,
      enableFiltering: false,
      selectionRowHeaderWidth: 35,
      enableSorting: false,
      enableColumnMenus: false,
      columnDefs: [{
        name: 'mese',
        displayName: 'Mese',
        field: 'mese',
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
        $scope.gridOptionPivotMese.gridApi = gridApi;
      }
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


      function add(a, b) {
        return a + b;
      };

      function filter_array(test_array) {
        var index = -1,
          arr_length = test_array ? test_array.length : 0,
          resIndex = -1,
          result = [];

        while (++index < arr_length) {
          var value = test_array[index];

          if (value) {
            result[++resIndex] = value;
          }
        }

        return result;
      };

      months.forEach(function (month) {

        var newRow = {};

        newRow.value = month.value;
        newRow.mese = month.mese;
        newRow.contocomune = filter_array(dataContoComune.map(function (obj) {
          if (obj.mese === month.value) {
            return obj.importo;
          }
        })).reduce(add, 0);

        newRow.contopersonale = filter_array(dataContoPersonale.map(function (obj) {
          if (obj.mese === month.value) {
            return obj.importo;
          }
        })).reduce(add, 0);

        pivotData.push(newRow);

      });

      $scope.gridOptionPivotMese.data = pivotData;
      $interval($scope.gridOptionPivotMese.gridApi.core.handleWindowResize, 100, 10);

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

    $scope.gridOptionsSalary = {
      columnVirtualizationThreshold: 100,
      minRowsToShow: 13,
      enableFiltering: false,
      enableSorting: false,
      columnDefs: [{
          name: 'anno',
          displayName: 'Anno',
          field: 'anno',
          width: 50,
          pinnedLeft: true
      }, {
          name: 'mese',
          displayName: 'Mese',
          field: 'mese',
          width: 50,
          pinnedLeft: true
            }, {
          name: 'data',
          displayName: 'Data',
          field: 'data',
          width: 100,
          cellFilter: 'date:\'yyyy-MM-dd\'',
          pinnedLeft: true
            }, {
          name: 'stipendioLordo',
          displayName: 'Stipendio Lordo',
          field: 'stipendioLordo',
          width: 100,
          cellFilter: 'currency',
          pinnedLeft: true
        }, {
          name: 'stipendioNetto',
          displayName: 'Stipendio Netto',
          field: 'stipendioNetto',
          width: 100,
          cellFilter: 'currency',
          pinnedLeft: true
        }, {
          name: 'ggLavorativi',
          displayName: 'Giorni Lavorativi',
          field: 'ggLavorativi',
          width: 100
        }, {
          name: 'festivitaNonGoduta',
          displayName: 'Festività Non Goduta',
          field: 'festivitaNonGoduta',
          width: 100
        }, {
          name: 'competenzaBase',
          displayName: 'Competenza Base',
          field: 'competenzaBase',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'liqRol',
          displayName: 'Ore ROL Liquidate',
          field: 'liqRol',
          width: 100
        }, {
          name: 'compRol',
          displayName: 'Compenso ROL',
          field: 'compRol',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'straordinario25',
          displayName: 'Str. 25%',
          field: 'straordinario25',
          width: 100
        }, {
          name: 'compStraordinario25',
          displayName: 'Comp. Str. 25%',
          field: 'compStraordinario25',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'maggiorazione25',
          displayName: 'Magg. Str. 25%',
          field: 'maggiorazione25',
          width: 100
        }, {
          name: 'compMaggiorazione25',
          displayName: 'Magg. Str. 25%',
          field: 'compMaggiorazione25',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'straordinario30',
          displayName: 'Str. 30%',
          field: 'straordinario30',
          width: 100
        }, {
          name: 'compStraordinario30',
          displayName: 'Comp. Str. 30%',
          field: 'compStraordinario30',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'maggiorazione30',
          displayName: 'Magg. Str. 30%',
          field: 'maggiorazione30',
          width: 100
        }, {
          name: 'compMaggiorazione30',
          displayName: 'Comp. Magg. Str. 30%',
          field: 'compMaggiorazione30',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'straordinario50',
          displayName: 'Str. 50%',
          field: 'straordinario50',
          width: 100
        }, {
          name: 'compStraordinario50',
          displayName: 'Comp. Str. 50%',
          field: 'compStraordinario50',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'maggiorazione50',
          displayName: 'Magg. Str. 50%',
          field: 'maggiorazione50',
          width: 100
        }, {
          name: 'compMaggiorazione50',
          displayName: 'Magg. Str. 50%',
          field: 'compMaggiorazione50',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'maggiorazione60',
          displayName: 'Magg. Str. 60%',
          field: 'maggiorazione60',
          width: 100
        }, {
          name: 'compMaggiorazione60',
          displayName: 'Magg. Str. 60%',
          field: 'compMaggiorazione60',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'erogazioneSpeciale',
          displayName: 'Erogazione Speciale',
          field: 'erogazioneSpeciale',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'periquativo',
          displayName: 'Periquativo',
          field: 'periquativo',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'settetrenta',
          displayName: '730',
          field: 'settetrenta',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'impPrevNonArr',
          displayName: 'Imponibile Previdenziale NON Arrotondato',
          field: 'impPrevNonArr',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'impPrevArr',
          displayName: 'Imponibile Previdenziale Arrotondato',
          field: 'impPrevArr',
          cellFilter: 'currency',
          width: 100
        }
                  , {
          name: 'impAnnoArr',
          displayName: 'Imponibile Annuo Arrotondato',
          field: 'impAnnoArr',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'ritenuteMeseInps',
          displayName: 'Ritenute Mese INPS',
          field: 'ritenuteMeseInps',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'ritenuteAnnoInps',
          displayName: 'Ritenute Annue INPS',
          field: 'ritenuteAnnoInps',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'imponibileFiscaleMese',
          displayName: 'Imponibile Fiscale Mese',
          field: 'imponibileFiscaleMese',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'imponibileTotAnnuo',
          displayName: 'Imponibile Tot. Annuo',
          field: 'imponibileTotAnnuo',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'imponibileMedio',
          displayName: 'Imponibile Medio',
          field: 'imponibileMedio',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'imponibilePrevistoAnnuo',
          displayName: 'Imponibile Previsto Annuo',
          field: 'imponibilePrevistoAnnuo',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'ritenutaFiscaleMeseLorda',
          displayName: 'Ritenuta Fiscale Mese lorda',
          field: 'ritenutaFiscaleMeseLorda',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'detrazioniImposta',
          displayName: 'Detrazioni Imposta',
          field: 'detrazioniImposta',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'detrazioneConiuge',
          displayName: 'Detrazione Coniuge',
          field: 'detrazioneConiuge',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'detrazioneFigli',
          displayName: 'Detrazione Figli',
          field: 'detrazioneFigli',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'ritenutaFiscaleMeseNetta',
          displayName: 'Ritenuta Fiscale Mese Netta',
          field: 'ritenutaFiscaleMeseNetta',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'bonusRenzi',
          displayName: 'Bonus Renzi',
          field: 'bonusRenzi',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'conguaglio',
          displayName: 'Conguaglio',
          field: 'conguaglio',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'addizionaleComunaleVariabile',
          displayName: 'Addizionale Comunale Variabile',
          field: 'addizionaleComunaleVariabile',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'addizionaleComunaleVariabileAcconto',
          displayName: 'Addizionale Comunale Variabile Acconto',
          field: 'addizionaleComunaleVariabileAcconto',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'addizionaleRegionaleFissa',
          displayName: 'Addizionale Regionale Fissa',
          field: 'addizionaleRegionaleFissa',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'addizionaleRegionaleVariabile',
          displayName: 'Addizionale Regionale Variabile',
          field: 'addizionaleRegionaleVariabile',
          cellFilter: 'currency',
          width: 100
        }, {
          name: 'abbonamentoAnnualeAtm',
          displayName: 'Abbonamento Annuale ATM',
          field: 'abbonamentoAnnualeAtm',
          cellFilter: 'currency',
          width: 100
        }],
      data: [],
      onRegisterApi: function (gridApi) {
        $scope.gridOptionsSalary.gridApi = gridApi;
      }
    };

    var sumArray = function sumArray(array, field) {
      var total = 0.0;
      array.forEach(function (obj) {
        total += obj[field];
      });
      return total;
    };

    var ultimo = function ultimo(mese, anno) {
      var d = new Date(anno, mese, 0)
      return d.getDate();
    };

    $scope.loadWork = function () {
      return $http.get('http://2.225.127.144:3001/aliquote').then(function (response) {
        $scope.aliquote = response.data;

        $http.get('http://2.225.127.144:3001/aliquoteMese').then(function (response) {
          $scope.aliquoteMese = response.data;

          $http.get('http://2.225.127.144:3001/aliquoteAnno').then(function (response) {
            $scope.aliquoteAnno = response.data;

            return $http.get('json/work.json').then(function (resp) {
              var salaryData = [];

              resp.data.forEach(function (obj) {

                var tmp = {};
                tmp.anno = new Date(obj.data).getFullYear();

                var alq = $scope.aliquote.filter(function (a) {
                  return a['ANNO'] === tmp.anno;
                })[0];


                tmp.mese = new Date(obj.data).getMonth() + 1;
                tmp.data = obj.data;
                tmp.ggLavorativi = obj.ggLavorativi;
                tmp.liqRol = obj.liqRol;
                tmp.compRol = obj.compRol;
                tmp.straordinario25 = obj.straordinario25;
                tmp.compStraordinario25 = obj.compStraordinario25;
                tmp.maggiorazione25 = obj.maggiorazione25;
                tmp.compMaggiorazione25 = obj.compMaggiorazione25;
                tmp.straordinario30 = obj.straordinario30;
                tmp.compStraordinario30 = obj.compStraordinario30;
                tmp.maggiorazione30 = obj.maggiorazione30;
                tmp.compMaggiorazione30 = obj.compMaggiorazione30;
                tmp.straordinario50 = obj.straordinario50;
                tmp.compStraordinario50 = obj.compStraordinario50;
                tmp.maggiorazione50 = obj.maggiorazione50;
                tmp.compMaggiorazione50 = obj.compMaggiorazione50;
                tmp.maggiorazione60 = obj.maggiorazione60;
                tmp.compMaggiorazione60 = obj.compMaggiorazione60;
                tmp.festivitaNonGoduta = obj.festivitaNonGoduta;
                tmp.periquativo = obj.periquativo;
                tmp.settetrenta = obj.settetrenta;
                tmp.competenzaBase = obj.competenzaBase;
                tmp.stipendioLordo = obj.ggLavorativi * obj.competenzaBase;
                tmp.impPrevNonArr = ((obj.ggLavorativi + obj.festivitaNonGoduta) * obj.competenzaBase) + (obj.liqRol * obj.compRol) + (obj.straordinario25 * obj.compStraordinario25) + (obj.maggiorazione25 * obj.compMaggiorazione25) + (obj.straordinario30 * obj.compStraordinario30) + (obj.maggiorazione30 * obj.compMaggiorazione30) + (obj.straordinario50 * obj.compStraordinario50) + (obj.maggiorazione50 * obj.compMaggiorazione50) + (obj.maggiorazione60 * obj.compMaggiorazione60) + obj.periquativo + obj.erogazioneSpeciale;
                tmp.erogazioneSpeciale = obj.erogazioneSpeciale;
                tmp.impPrevArr = Math.round(tmp.impPrevNonArr);
                tmp.ritenuteMeseInps = (tmp.impPrevArr > alq['SOGLIA_FAP'] ? ((tmp.impPrevArr * alq['INPS'] / 100) +
                  (tmp.impPrevArr - alq['SOGLIA_FAP']) *
                  (tmp.impPrevArr * alq['ECCEZZO_FAP'] / 100)) : (tmp.impPrevArr * alq['INPS'] / 100));
                tmp.imponibileFiscaleMese = tmp.impPrevNonArr - tmp.ritenuteMeseInps;
                tmp.detrazioneConiuge = obj.detrazioneConiuge;
                tmp.detrazioneFigli = obj.detrazioneFigli;
                tmp.conguaglio = obj.conguaglio;
                tmp.addizionaleComunaleVariabile = obj.addizionaleComunaleVariabile;
                tmp.addizionaleComunaleVariabileAcconto = obj.addizionaleComunaleVariabileAcconto;
                tmp.addizionaleRegionaleFissa = obj.addizionaleRegionaleFissa;
                tmp.addizionaleRegionaleVariabile = obj.addizionaleRegionaleVariabile;
                tmp.abbonamentoAnnualeAtm = obj.abbonamentoAnnualeAtm;
                salaryData.push(tmp);
              });

              salaryData.forEach(function (obj) {

                var alq = $scope.aliquote.filter(function (a) {
                  return a['ANNO'] === obj.anno;
                })[0];

                obj.impAnnoArr = sumArray(salaryData.filter(function (tmp) {
                  return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                }), 'impPrevArr');
                obj.imponibileTotAnnuo = sumArray(salaryData.filter(function (tmp) {
                  return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                }), 'imponibileFiscaleMese');
                obj.ritenuteAnnoInps = sumArray(salaryData.filter(function (tmp) {
                  return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                }), 'ritenuteMeseInps');
                obj.imponibileTotAnnuo = sumArray(salaryData.filter(function (tmp) {
                  return tmp.anno === obj.anno && tmp.mese <= obj.mese;
                }), 'imponibileFiscaleMese');
                obj.imponibileMedio = (obj.imponibileTotAnnuo / obj.mese);
                obj.imponibilePrevistoAnnuo = obj.imponibileTotAnnuo + (obj.imponibileMedio * (13 - obj.mese));

                //TODO
                obj.ritenutaFiscaleMeseLorda = 0.0;
                obj.detrazioniImposta = (obj.imponibilePrevistoAnnuo <= alq['SOGLIA1'] ? (alq['QUOTA1'] + alq['QUOTA2'] * ((alq['SOGLIA1'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE1'])) : (alq['QUOTA1'] * ((alq['SOGLIA2'] - obj.imponibilePrevistoAnnuo) / alq['DIVISORE2']))) /
                  365 * ultimo(obj.mese, obj.anno);
                obj.ritenutaFiscaleMeseNetta = obj.ritenutaFiscaleMeseLorda - obj.detrazioniImposta - obj.detrazioneConiuge - obj.detrazioneFigli;

                obj.bonusRenzi = (obj.imponibilePrevistoAnnuo > 0 && obj.imponibilePrevistoAnnuo < 24000 ? 960 : (obj.imponibilePrevistoAnnuo >= 24000 && obj.imponibilePrevistoAnnuo <= 26000 ? 960 * ((26000 - obj.imponibilePrevistoAnnuo) / 2000) : 0)) / 365 * ultimo(obj.mese, obj.anno);

                obj.stipendioNetto = obj.impPrevNonArr - obj.ritenuteMeseInps - obj.ritenutaFiscaleMeseNetta - obj.addizionaleComunaleVariabile - obj.addizionaleRegionaleFissa - obj.addizionaleRegionaleVariabile - obj.addizionaleComunaleVariabileAcconto - obj.abbonamentoAnnualeAtm + obj.bonusRenzi + obj.periquativo + obj.settetrenta;
              });

              $scope.gridOptionsSalary.data = salaryData;
              $interval($scope.gridOptionsSalary.gridApi.core.handleWindowResize, 200, 10);
            });
          });
        });
      });
    };

    }]);
  myApp.filter('map', function () {
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
