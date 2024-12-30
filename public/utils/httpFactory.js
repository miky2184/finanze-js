(function () {
    'use strict';
  
    angular.module('myApp').factory('authInterceptor', ['$q', function ($q) {
      return {
        // Aggiunge il token all'intestazione della richiesta
        request: function (config) {
          const token = localStorage.getItem('jwtToken'); // Recupera il token dal localStorage
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Aggiunge l'intestazione
          }
          return config;
        },
        // Gestione degli errori di risposta
        responseError: function (rejection) {
          if (rejection.status === 401) {
            console.error('Non autorizzato: il token potrebbe essere scaduto o mancante.');
            // Logica aggiuntiva: ad esempio, reindirizzare alla pagina di login
          }
          return $q.reject(rejection);
        }
      };
    }]);
  })();