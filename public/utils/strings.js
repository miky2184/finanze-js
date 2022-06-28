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
                GREEN: 10,
                LIGHT_GREEN: 0,
                YELLOW: -1,
                ORANGE: -10
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
            CONTO_COMUNE: "#ffff00",
            CONTO_PERSONALE: "#1E90FF",
            CONTO_MARIANNA: "#ff69B4",
            CONTO_TOTALE: "#00bb00"
        },
        REST:{
            SERVER: 'http://miky2184.ddns.net:3001'
        }
        });
})();
