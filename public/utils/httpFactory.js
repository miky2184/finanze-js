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
          if (rejection.status === 401 || rejection.status === 403) {
            console.warn('Token scaduto. Ricarico la pagina per uscire.');
            localStorage.removeItem('jwtToken'); // Rimuovi il token scaduto
            window.location.reload(); // Ricarica la pagina
          }
          return $q.reject(rejection);
        }
      };
    }]);
  })();