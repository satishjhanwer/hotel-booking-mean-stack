(function() {
    angular.module('common-services', [])
    .factory('SessionService', ['$rootScope', '$http', function($rootScope, $http){
        var session = {
            init: function() {
                this.resetSession();
            },
            resetSession: function() {
                this.currentUser = null;
                this.isLoggedIn = false;
            },
            login: function(email, password) {
                $http.post('/login', {
                    email: email,
                    password: password
                }).success(function(data) {
                    console.log(data);
                });
            },
            logout: function() {
                var scope = this;
                $http.post('/logout').success(function(){
                    scope.resetSession();
                });
            },
            authSuccess: function(userData) {
                this.currentUser = userData;
                this.isLoggedIn = true;
            },
            authFailed: function() {
                this.resetSession();
                console.log('Authentication failed');
            }
        };
        session.init();
        return session;
    }])
    .factory('HotelService', ['$rootScope', '$http', function($rootScope, $http){
        return {
            term: null,
            get: function() {
                return $http.get('/api/hotels/');
            },
            getHotel: function(id) {
                return $http.get('/api/hotels/' + id);
            },
            create: function(hotelData) {
                return $http.post('/api/hotels', hotelData);
            },
            delete: function(id) {
                return $http.delete('/api/hotels/' + id);
            },
            search: function(term) {
                return $http.post('/api/hotels/search',{term:term});
            }
        };
    }])
    .factory('BookingService', ['$rootScope', '$http', function($rootScope, $http){
        return {
            get: function() {
                return $http.get('/api/bookings');
            },
            create: function(bookingData) {
                return $http.post('/api/bookings', bookingData);
            },
            delete: function(id) {
                return $http.delete('/api/bookings/' + id);
            }
        };
    }])
    .factory('UserService', ['$rootScope', '$http', function($rootScope, $http){
        return {
            get: function() {
                return $http.get('/api/userData/');
            },
            create: function(userData) {
                return $http.post('/signup', userData);
            }
        };
    }]);
})();
