(function () {
    'use strict';
    angular.module('myApp')
        .constant('$strings', {
        DATE_FORMAT: 'dd/MM/yyyy',
            MODAL: {
                DEFAULT_WAITING_MESSAGE: 'Attendere prego...',
                OK: 'OK',
                ANNULLA: 'ANNULLA',
                WARNING: 'Attenzione',
                EXIT_MSG: 'Ci sono delle modifiche pending non salvate, sei sicuro di voler uscire??',
                ANNULLA_MSG: 'Ci sono delle modifiche pending non salvate, sei sicuro di voler annullare??'
            },
            BUDGET: {
                GREEN: 25,
                YELLOW: 0,
                ORANGE: -25,
                RED: -50
            },
        FANTACALCIO:{
         FANTAFIGHETTINO: "FANTAFIGHETTINO",
            FANTAMARELLI: "FANTAMARELLI",
            FANTABOMBOLACCI: "FANTABOMBOLACCI"
        },
        CONTO:{
            CONTO_COMUNE: "CONTO COMUNE",
            CONTO_PERSONALE: "CONTO PERSONALE",
            CONTO_MARIANNA: "CONTO MARIANNA",
            CONTO_TOTALE: "CONTO TOTALE"
        },
        RGB:{
            CONTO_COMUNE: "#ff000080",
            CONTO_PERSONALE: "#0000ff80",
            CONTO_MARIANNA: "#00ff0080",
            CONTO_TOTALE: "#80808080"
        },
        REST:{
            SERVER: 'http://miky2184.ddns.net:3001'
        },
        PIVOT: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            tipo_conto: 1
        }
        });
})();
