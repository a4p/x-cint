'use strict';

/**
 * Drop objects controller
 *
 * @param $scope
 */
function ctrlMeetingObjLinkDrop($scope) {

    $scope.dndActive = false;
    $scope.dropOver = false;
    $scope.dragObject = null;


    $scope.dndStart = function (event) {
        if (event.dataTransfer) {
            a4p.safeApply($scope, function() {
                $scope.dndActive = true;
                $scope.dragObject = event.dataTransfer;
            });
        }
    };
    $scope.dndEnd = function (event) {
        if ($scope.dndActive) {
            a4p.safeApply($scope, function() {
                $scope.dndActive = false;
                $scope.dragObject = null;
            });
        }
    };
    $scope.dndCancel = function (event) {
        if ($scope.dndActive) {
            a4p.safeApply($scope, function() {
                $scope.dndActive = false;
                $scope.dragObject = null;
            });
        }
    };
    $scope.dropOverEnter = function (event) {
        if ($scope.dndActive && !$scope.dropOver) {
            a4p.safeApply($scope, function() {
                $scope.dropOver = true;
            });
        }
    };
    $scope.dropOverLeave = function (event) {
        if ($scope.dndActive && $scope.dropOver) {
            a4p.safeApply($scope, function() {
                $scope.dropOver = false;
            });
        }
    };
    $scope.dropEnd = function (event) {
        var obj= event.dataTransfer;
        var mObj = $scope.currentMeetingObject;

        //SEEMS Dirty BUT
        // is it need to refresh correctly the update of the ng-include directive
        //
        a4p.safeApply($scope, function() {
            $scope.setMeetingObject(null);
        });

        mObj.obj = obj;

        a4p.safeApply($scope, function() {
            //set view to plan
            $scope.setActionItem('plan');
            $scope.setMeetingObject(mObj);
        });
    };
}
ctrlMeetingObjLinkDrop.$inject = ['$scope'];




