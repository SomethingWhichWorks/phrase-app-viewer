angular
    .module('NgMaterialModule')
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('yellow')
            .accentPalette('blue');

        // Define a theme for the Login dialogs;
        // @see <md-dialog md-theme="login">...</md-dialog>

        $mdThemingProvider.theme('login')
            .primaryPalette('brown')
            .accentPalette('yellow');

    })
    .controller('appController',function($scope,$mdDialog){
        $scope.showLogin = function() {
            $mdDialog.show({
                controller: 'LoginController',
                templateUrl: 'login.tpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true
            });
        }
    })
    .controller('LoginController', function($scope, $mdDialog, $log) {
        $scope.cancel = function() {
            $mdDialog.hide();
        };
        $scope.login = function() {
            $log.debug("login()...");
            $mdDialog.hide();
        };
        $scope.user = {
            company: 'Google, Inc.',
            email: 'ThomasBurleson@Gmail.com',
            phone: ''
        };
    });
