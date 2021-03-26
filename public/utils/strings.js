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
                GREEN: 90,
                LIGHT_GREEN: 60,
                YELLOW: 30,
                ORANGE: 0
            },
        FANTACALCIO:{
         FANTAFIGHETTINO: "FANTAFIGHETTINO",
            FANTAMARELLI: "FANTAMARELLI",
            FANTABOMBOLACCI: "FANTABOMBOLACCI"
        },
        CONTO:{
            CONTO_COMUNE: "CONTO COMUNE",
            CONTO_PERSONALE: "CONTO PERSONALE"
        },
        RGB:{
            CONTO_COMUNE: "#00bb00",
            CONTO_PERSONALE: "#0000ff"
        },
        REST:{
            SERVER: 'http://93.55.248.37:3001'
        }
        });
})();
