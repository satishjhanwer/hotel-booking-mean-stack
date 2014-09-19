(function() {
    angular.module('common-services', [])
    .factory('SessionService', ['$rootScope', '$http', '$location', '$q', function($rootScope, $http, $location, $q){
        var session = {
            init: function() {
                this.resetSession();
            },
            resetSession: function() {
                this.currentUser = null;
                this.isAdmin = false;
                this.isLoggedIn = false;
            },
            login: function(email, password) {
                return $http.post('/login', {
                    email: email,
                    password: password
                });
            },
            logout: function() {
                var scope = this;
                $http.post('/logout').success(function(data){
                    if(data.success){
                        scope.resetSession();
                        $location.path('/index');
                    }
                });
            },
            isAdminLoggedIn: function() {
                $http.get('/api/userData/').success(function(data){
                    var validateAccess = $q.defer();
                    var isAllowed = data.isAdmin;

                    if(!isAllowed){
                        $location.path('/profile');
                    }

                    validateAccess.resolve();
                    return validateAccess.promise;
                });
            },
            authSuccess: function(userData) {
                this.currentUser = userData;
                this.isAdmin = userData.isAdmin;
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
                return $http.post('/api/admin/hotels', hotelData);
            },
            delete: function(id) {
                return $http.delete('/api/admin/hotels/' + id);
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
                return $http.get('/api/admin/users/');
            },
            create: function(userData) {
                return $http.post('/signup', userData);
            },
            delete: function(id) {
                return $http.delete('/api/admin/users/' + id);
            }
        };
    }]);
})();
