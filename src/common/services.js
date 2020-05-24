(function () {
	angular
		.module("common-services", [])
		.factory("SessionService", [
			"$rootScope",
			"$http",
			"$location",
			"$q",
			function ($rootScope, $http, $location, $q) {
				var session = {
					init: function () {
						this.resetSession();
					},
					resetSession: function () {
						this.currentUser = null;
						this.isAdmin = false;
						this.isLoggedIn = false;
						window.user = {};
					},
					login: function (email, password) {
						return $http
							.post("/login", {
								email: email,
								password: password,
							})
							.then(function (response) {
								return response.data;
							});
					},
					logout: function () {
						var scope = this;
						$http
							.post("/logout")
							.then(function (response) {
								return response.data;
							})
							.then(function (data) {
								if (data.success) {
									scope.resetSession();
									$location.path("/index");
								}
							});
					},
					isAdminLoggedIn: function () {
						$http.get("/api/userData/").then(function (data) {
							var validateAccess = $q.defer();
							var isAllowed = data.isAdmin;

							if (!isAllowed) {
								$location.path("/profile");
							}

							validateAccess.resolve();
							return validateAccess.promise;
						});
					},
					authSuccess: function (userData) {
						if (Object.keys(userData).length > 0) {
							this.currentUser = userData;
							this.isAdmin = userData.isAdmin;
							this.isLoggedIn = true;
						}
					},
					authFailed: function () {
						this.resetSession();
						console.log("Authentication failed");
					},
				};
				session.init();
				return session;
			},
		])
		.factory("HotelService", [
			"$rootScope",
			"$http",
			function ($rootScope, $http) {
				return {
					term: null,
					get: function () {
						return $http.get("/api/hotels/").then(function (response) {
							return response.data;
						});
					},
					getHotel: function (id) {
						return $http.get("/api/hotels/" + id).then(function (response) {
							return response.data;
						});
					},
					create: function (hotelData) {
						return $http.post("/api/admin/hotels", hotelData);
					},
					delete: function (id) {
						return $http.delete("/api/admin/hotels/" + id);
					},
					search: function (term) {
						return $http.post("/api/hotels/search", { term: term }).then(function (response) {
							return response.data;
						});
					},
				};
			},
		])
		.factory("BookingService", [
			"$rootScope",
			"$http",
			function ($rootScope, $http) {
				return {
					get: function () {
						return $http.get("/api/bookings").then(function (response) {
							return response.data;
						});
					},
					create: function (bookingData) {
						return $http.post("/api/bookings", bookingData);
					},
					delete: function (id) {
						return $http.delete("/api/bookings/" + id);
					},
				};
			},
		])
		.factory("UserService", [
			"$rootScope",
			"$http",
			function ($rootScope, $http) {
				return {
					get: function () {
						return $http.get("/api/admin/users/").then(function (response) {
							return response.data;
						});
					},
					create: function (userData) {
						return $http.post("/signup", userData);
					},
					delete: function (id) {
						return $http.delete("/api/admin/users/" + id);
					},
				};
			},
		]);
})();
