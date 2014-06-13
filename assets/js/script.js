
var Database = function ($scope){


	var init = function(){
		var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
		var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

		if (!window.indexedDB){
			alert("Indexed DB não suportado!");
		}
		else {
			var request = window.indexedDB.open("Selecoes", 1);
			console.log(request);
			request.onerror = function(e) {
				alert("Erro na conexão com o banco de dados");
				console.log(e.target.errorCode);
			};
			request.onsuccess = function(e) {
				db = request.result;

				  //console.log($scope.listar);
				  //$scope.listar();
				  listar();
				};
				request.onupgradeneeded = function (e) {
					var thisDb = e.target.result;

					if(!thisDb.objectStoreNames.contains("selecoes")) {
						var store = e.target.result.createObjectStore(["selecoes"], { keyPath: "id", autoIncrement: true });
						store.createIndex("nome", "nome", { unique: true });
						store.createIndex("grupo", "grupo", { unique: false });
					}
				};
			}
		}();

		var salvar = function(callback){
			var transaction = db.transaction(["selecoes"], "readwrite");
			var objectStore = transaction.objectStore("selecoes");

			var obj = {};
			obj.nome = $scope.selecao.nome;
			obj.grupo = $scope.selecao.grupo;

			if($scope.selecao.id > 0){
				obj.id = $scope.selecao.id;
				var request = objectStore.get(obj.id);
				request.onerror = function(event) {
					alert("Erro ao buscar selecionado!");
					console.log(e.target.errorCode);
				};
				request.onsuccess = function(event) {
					var data = request.result;
					data = obj;

					var requestUpdate = objectStore.put(data);
					requestUpdate.onerror = function(event) {
						alert("Erro ao editar selecionado!");
						console.log(e.target.errorCode);
					};
					requestUpdate.onsuccess = function(event) {
						alert("editado");
						$scope.$apply(function(){
							$scope.selecao = {id : 0, nome: "", grupo: ""};
						});
					};
				};
			}
			else{
				var request = objectStore.add(obj);

				request.onsuccess = function (e) {
					var id = e.srcElement.result;
					$scope.$apply(function(){
						$scope.selecao = {id : 0, nome: "", grupo: ""};
						listar();
					});
					if(callback)callback();
				};
				request.onerror = function(e) {
					alert("Erro ao salvar");
					console.log(e.target.errorCode);
				};
			}


		}

		var listar = function(){
			var transaction = db.transaction(["selecoes"]);
			var objectStore = transaction.objectStore("selecoes");
			var selecoes = [];
			var request = objectStore.openCursor();
			console.log(request);
			request.onsuccess = function(e) {
				var cursor = e.target.result;
				if (cursor) {
					$scope.$apply(function(){
						$scope.selecoes.push(cursor.value);
						cursor.continue();
					});

				}
				else
					return $scope.selecoes;
			};

			request.onerror = function(e) {
				alert("Erro ao listar seleções");
				console.log(e.target.errorCode);
			};
		}

		var excluir = function(item, callback){
			var transaction = db.transaction(["selecoes"], "readwrite")
				.objectStore("selecoes")
				.delete(item.id);
			transaction.onsuccess = function(e) {
				if(callback)callback();
				$scope.$apply(function(){
					var index = $scope.selecoes.indexOf(item);
			  		$scope.selecoes.splice(index,1);
				});
			};
		}

		return {
			salvar : salvar,
			listar : listar,
			excluir : excluir
		}
	}




	var Cadastro = function ($scope){
		var database = new Database($scope);

		var init = function(){
			$scope.selecao = {id : 0, nome: "", grupo: ""};
			$scope.selecoes = [];

		};


		$scope.salvar = function () {
	    	// var obj = $scope.selecao;
	    	// database.salvar(obj);
	    	database.salvar(saved);
	    }

	    $scope.editar = function (item){
	    	$scope.selecao = item;
	    	//database.salvar(saved);
	    }

	    $scope.excluir = function(item){
	    	var obj = item;
	    	database.excluir(obj,excluded);
	    }

	    $scope.listar = function(){

	    }

	    var excluded = function(){
		  	alert("excluiu");
		  }

		  var saved = function(){
		  	alert("salvou!");
		  }

		  var edited = function(){
		  	alert("editou");
		  }

		  init();
		}