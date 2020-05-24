(function () {
	angular
		.module("common-factories", [])
		.factory("transformRequestAsFormPost", function () {
			function serializeData(data) {
				if (!angular.isObject(data)) {
					return data == null ? "" : data.toString();
				}

				var buffer = [];

				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent(value == null ? "" : value));
				}

				var source = buffer.join("&").replace(/%20/g, "+");
				return source;
			}

			function transformRequest(data, getHeaders) {
				var headers = getHeaders();
				headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
				return serializeData(data);
			}

			return transformRequest;
		})
		.factory("myHttpResponseInterceptor", [
			"$q",
			"$location",
			"growl",
			function ($q, $location, growl) {
				return {
					response: function (response) {
						if (typeof response.data === "object") {
							if (response.data.redirect) {
								$location.path(response.data.redirect);
								return {} || $q.when(response);
							} else if (response.data.error) {
								growl.addErrorMessage(response.data.error);
							}
						}
						return response || $q.when(response);
					},
				};
			},
		])
		.config([
			"$httpProvider",
			function ($httpProvider) {
				$httpProvider.interceptors.push("myHttpResponseInterceptor");
			},
		]);
})();
