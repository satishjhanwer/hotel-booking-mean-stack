(function () {
	angular
		.module("common-directives", [])
		.directive("redir", [
			"$http",
			function ($http) {
				return {
					restrict: "A",
					link: function (scope, element, attrs) {
						element.on("click", function (e) {
							e.preventDefault();
							window.location = attrs.href;
						});
					},
				};
			},
		])
		.directive("logout", [
			"$http",
			function ($http) {
				return {
					restrict: "A",
					link: function (scope, element, attrs) {
						element.on("click", function (e) {
							e.preventDefault();
							$http.post("/logout");
						});
					},
				};
			},
		])
		.directive("creditCardType", function () {
			return {
				require: "ngModel",
				link: function (scope, elm, attrs, ctrl) {
					ctrl.$parsers.unshift(function (value) {
						scope.booking.type = /^5[1-5]/.test(value)
							? "fa fa-cc-mastercard"
							: /^4/.test(value)
							? "fa fa-cc-visa"
							: /^3[47]/.test(value)
							? "fa fa-cc-amex"
							: /^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)
							? "fa fa-cc-discover"
							: undefined;
						ctrl.$setValidity("invalid", !!scope.booking.type);
						return value;
					});
				},
			};
		})
		.directive("cardExpiration", function () {
			return {
				require: "ngModel",
				link: function (scope, elm, attrs, ctrl) {
					scope.$watch(
						"[booking.month,booking.year]",
						function (value) {
							ctrl.$setValidity("invalid", true);
							if (
								parseInt(scope.booking.year) === scope.currentYear &&
								scope.booking.month <= scope.currentMonth
							) {
								ctrl.$setValidity("invalid", false);
							}
							return value;
						},
						true,
					);
				},
			};
		});
})();
