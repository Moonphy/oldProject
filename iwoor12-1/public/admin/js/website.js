var website_app = angular.module('website_app', ['angularFileUpload']);

website_app.controller('FunSiteController',function FunSiteController($scope,$http,$window, $upload){
    var vm = $scope.vm = {};
    vm.adding  = false;

    vm.onSelectFile = function($files){
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/upload',
                file: file
            }).progress(function (evt) {
                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                vm.data.image = data.image.url;
            });
        }
    };


    $http.get('/ajax/fun').success(function(data){
        vm.websites = data;
        _.each(vm.websites,function(item){item.class=['list-group-item'];});
        $scope.setCurrent(0);
    });

    $scope.setCurrent = function(index){
        $scope.index = index;
        vm.current = vm.websites[index];
        vm.data = angular.copy(vm.current);
        _.each(vm.websites,function(item){item.class=['list-group-item'];});
        vm.current.class.push('active');
    };

    $scope.submit = function(){
        var validate = true;

        var isNew = false;
        if(vm.data.id==0){
            var old = _.find(vm.websites,function(item){return item.url==vm.data.url});
            if(old){
                $window.alert('该链接已录入，原网站名称：' + old.name);
                validate = false;
            }
            isNew = true;
        }
        if(validate){
            $http.post('/ajax/fun',vm.data).success(function(data){
                vm.data.id = data.id;
                if(isNew){
                    vm.data.class = ['list-group-item'];
                    vm.websites.splice(0,0,vm.data);
                    $scope.setCurrent(0) ;
                    vm.adding = false;
                }
                angular.copy(vm.data,vm.current);
            });
        }
    };

    $scope.cancel = function(){
        angular.copy(vm.current,vm.data);
        vm.adding = false;
    };

    $scope.test = function(){
        var result = angular.equals(vm.current,vm.data);
        return result;
    };

    $scope.delete = function(){
        vm.data.id = -vm.data.id;
        $http.post('/ajax/fun',vm.data).success(function(data){
            vm.websites.splice($scope.index,1);
            $scope.setCurrent(0);
        });
    };

    $scope.add = function(){
        vm.adding = true;
        vm.data = {id:0,_rs_:"Fun"};
    };
});