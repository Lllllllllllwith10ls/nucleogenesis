angular.module('incremental',[])
.controller('IncCtrl',['$scope','$document','$interval', '$sce', '$filter', '$timeout', 
function($scope,$document,$interval,$sce,$filter,$timeout) { 
		$scope.version = '0.0';
		$scope.Math = window.Math;
		
		const startPlayer = {
			unlocks: {
			},
			elements: {
				'H':{
					level: [10,4,1,2,0],
					upgrades:[
						{name:'Upgrade 1',
							price:1,
							description:"Do this and that",
							purchased:true},
						{name:'Upgrade 2',
							price:10,
							description:"Do this and that",
							purchased:false},
						{name:'Upgrade 3',
							price:100,
							description:"Do this and that",
							purchased:false}],
				},'O':{
					level: [15,1,0,0],
					unlocked:true
				}
			},
			resources:{
					'H':{ 
						number:1.523e25,
						is_new:false,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:0,
						ratio:0.999884
					},
					'2H':{ 
						number:100000000,
						is_new:true,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:1,
						ratio:0.000115
					},
					'3H':{ 
						number:1000000000,
						is_new:true,
						visible:function(){
							return $scope.current_element === "H";
						},
						order:2,						
						ratio:0.000001
					},
					'O':{ 
						number:0,
						is_new:false,
						visible:function(){
							return $scope.current_element === "O";
						},
						order:700,
						ratio:0.9976
					},
					'17O':{ 
						number:345,
						is_new:true,						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:701,
						ratio:0.00039
					},
					'18O':{ 
						number:36236,
						is_new:true,						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:702,						
						ratio:0.00201 
					},
					'e-':{ 
						number:0,
						is_new:false,
						visible:function(){
							return true;
						},
						order:20000
					},
					'n':{ 
						number:0,
						is_new:true,
						visible:function(){
							return true;
						},
						order:20001
					},
					'p':{ 
						number:0,
						is_new:false,
						visible:function(){
							return true;
						},
						order:20002
					},
					'energy':{ 
						number:0,
						is_new:false,
						visible:function(){
							return true;
						},
						order:20003
					}
				}
			};
		
		$scope.elements = {
				'H':{
					name:'Hydrogen',
					isotopes:['2H','3H'],
					upgrades:[
						{name:'Upgrade 1',
							price:1,
							description:"Do this and that",
							purchased:true},
						{name:'Upgrade 2',
							price:10,
							description:"Do this and that",
							purchased:false},
						{name:'Upgrade 3',
							price:100,
							description:"Do this and that",
							purchased:false}],
					visible:function(){
							return true;
						},
					has_new:false,
					order:1
				},'O':{
					name:'Oxygen',
					visible:function(){
							return $scope.player.elements.O.unlocked;
						},
					has_new:true,
					order:7
				}
		};
		
		$scope.resources = {
					'H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:0,
						ratio:0.999884
					},
					'2H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:1,
						ratio:0.000115
					},
					'3H':{ 
						visible:function(){
							return $scope.current_element === "H";
						},
						order:2,						
						ratio:0.000001
					},
					'O':{ 
						visible:function(){
							return $scope.current_element === "O";
						},
						order:700,
						ratio:0.9976
					},
					'17O':{ 					
						visible:function(){
							return $scope.current_element === "O";
						},
						order:701,
						ratio:0.00039
					},
					'18O':{ 						
						visible:function(){
							return $scope.current_element === "O";
						},
						order:702,						
						ratio:0.00201 
					},
					'e-':{ 
						visible:function(){
							return true;
						},
						order:20000
					},
					'n':{ 
						visible:function(){
							return true;
						},
						order:20001
					},
					'p':{ 
						visible:function(){
							return true;
						},
						order:20002
					},
					'energy':{ 
						visible:function(){
							return true;
						},
						order:20003
					}
		};
		
		$scope.tabs = {'Elements':{visible:function(){
							return true;
						},
						has_new:false,
						order:0},
				'Encyclopedia':{visible:function(){
							return true;
						},
						has_new:true,
						order:1},
				'Periodic Table':{visible:function(){
							return false;
						},
						has_new:false,
						order:2},
				'Options':{visible:function(){
							return true;
						},
						has_new:false,
						order:3}
			};
			
		var resourceHTML = {
					'2H':'<sup>2</sup>H',
					'3H':'<sup>3</sup>H',
					'17O':'<sup>17</sup>O',
					'18O':'<sup>18</sup>O',
					'energy':'KeV'
		};
		
		var priceIncrease = 1.15;
        var generatorBasePrice = [15,
                                 100,
                                 500,
                                 3000,
                                 10000,
                                 40000,
                                 200000,
                                 1666666,
                                 123456789,
                                 3999999999,
                                 75000000000];
        $scope.generatorPower = [0.1,
                                0.5,
                                4,
                                10,
                                40,
                                100,
                                400,
                                6666,
                                98765,
                                999999,                                        		
                                10000000];
		
		cache = {};
		$scope.current_tab = "Elements";
		$scope.current_element = "H";

		$scope.generatorPrice = function(index,level) {
			var price = generatorBasePrice[index]*Math.pow(priceIncrease,level);
			return Math.ceil(price);
		};
		
		$scope.getHTML = function(resource) {
			var html = resourceHTML[resource];
			if(html == null) return resource;
			return html;
		};
		
		$scope.isCostMet = function(element, index) {return false;};

		$scope.filterAndOrder = function(map, table) {	
			if(map == undefined) return;
			hash = JSON.stringify(map).hashCode();
			if(cache[hash] != null){
				return cache[hash];
			}	
			var array = [];
			for(var objectKey in map) {
				if(Array.isArray(map)){
					objectKey = map[objectKey];
				}
				if(table[objectKey].visible()){
					var object = {};
					object.name = objectKey;
					object.value = map[objectKey];
					array.push(object);
				}
			}
			array.sort(function(a, b){
				n = parseInt(table[a.name].order);
				m = parseInt(table[b.name].order);
				return n - m;
			});
			cache[hash] = array;
			return array;
		};
		
        $scope.buyGenerator = function(number) {
        /*
            if ($scope.player.h >= $scope.player.hGeneratorPrice[number]) {
                $scope.player.h -= $scope.player.hGeneratorPrice[number];
                $scope.player.hGeneratorLevel[number]++;
				$scope.player.hGeneratorPrice[number] = hGeneratorBasePrice[number]*Math.pow(priceIncrease,$scope.player.hGeneratorLevel[number]);
				refreshUpgradeLine(number, true);
            }
            */
        };

		$scope.save = function save() {
			localStorage.setItem("playerStored", JSON.stringify($scope.player));
			var d = new Date();
			$scope.lastSave = d.toLocaleTimeString();
		};
		
		$scope.load = function load() {
			try {
				$scope.player = JSON.parse(localStorage.getItem("playerStored"));
				$scope.currentPrestige = parseInt(localStorage.getItem("currentPrestige"));

			}catch(err){
				alert("Error loading savegame, reset forced.");
				$scope.reset(false);
			}
			versionControl();
		};
		
		$scope.reset = function reset(ask) {
			var confirmation = true;
			if(ask){
				confirmation = confirm("Are you sure you want to reset? This will permanently erase your progress.");
			}
			
			if(confirmation === true){
				init();
				localStorage.removeItem("playerStored");
			}
		};
		
		function versionControl() {
            
        };
		
        function update() {
            
        };
        
		$scope.prettifyNumber = function prettifyNumberHTML(number){
			if(typeof number == 'undefined'){
				return;
			}
				
			if(number == Infinity){
				return "&infin;";
			}
			if(number > 1e8){
				// Very ugly way to extract the mantisa and exponent from an exponential string
				var exponential = number.toExponential().split("e");
				var exponent = parseFloat(exponential[1].split("+")[1]);
				// And it is displayed in with superscript
				if(exponential[0] == "1"){
					return  "10<sup>"+prettifyNumberHTML(exponent)+"</sup>";							
				}
				return  $filter('number')(exponential[0])+" &#215; 10<sup>"+prettifyNumberHTML(exponent)+"</sup>";						
			}
			return $filter('number')(number);
		};   
		
		function init(){
			$scope.player = angular.copy(startPlayer);
		};
				
		$timeout(function(){
			if(localStorage.getItem("playerStored") !== null){
				$scope.load();
			}
			if(typeof $scope.player  === 'undefined'){
				init();
			}
			if(typeof $scope.lastSave  === 'undefined'){
				$scope.lastSave = "None";
			}
			init();
            $interval(update,1000);
            $interval($scope.save,60000);
        });	
        
        $scope.trustHTML = function(html) {
               return $sce.trustAsHtml(html);
        };
        
        String.prototype.hashCode = function() {
		  var hash = 0, i, chr, len;
		  if (this.length == 0) return hash;
		  for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		  }
		  return hash;
		};
}]);
