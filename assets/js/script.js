
	var Cadastro = function ($scope){



		var init = function(){
			$scope.selecao = {id : 0, nome: "", grupo: ""};
			$scope.lista = [];
			var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
		    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

		    if (!window.indexedDB){
		        alert("Indexed DB não suportado!");
		    }
		    else {
		       	var request = window.indexedDB.open("Selecoes", 1);

				request.onerror = function(e) {
				  alert("Erro na conexão com o banco de dados");
				  console.log(e.target.errorCode);
				};
				request.onsuccess = function(e) {
				  db = request.result;
				  $scope.listar();
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


	    $scope.salvar = function () {
	        var transaction = db.transaction(["selecoes"], "readwrite");
	        var objectStore = transaction.objectStore("selecoes");
	        var request = objectStore.add({ nome: $scope.selecao.nome, grupo: $scope.selecao.grupo});

	        request.onsuccess = function (e) {
	            //obj.id = e.srcElement.result;
	            $scope.listar();
	        };
	        request.onerror = function(e) {
			  alert("Erro ao salvar");
			  console.log(e.target.errorCode);
			};
        }

	    $scope.editar = function (item){
	    	debugger;
	    	$scope.selecao = item;
	    	debugger;
	    }

	    $scope.excluir = function(item){
	    	var request = db.transaction(["selecoes"], "readwrite")
                .objectStore("selecoes")
                .delete(item.id);
			request.onsuccess = function(event) {
			  alert("sucesso!");
			  var index = $scope.lista.indexOf(item);
			  $scope.lista.splice(index,1)
			  return(event);
			};
	    }

	    $scope.listar = function(){
			var transaction = db.transaction(["selecoes"]);
	        var objectStore = transaction.objectStore("selecoes");
			var selecoes = [];
	        var request = objectStore.openCursor();
	        request.onsuccess = function(e) {
	            var cursor = e.target.result;
	            if (cursor) {
	               $scope.lista.unshift(cursor.value);
	                cursor.continue();
	            }
	            else
	            	return $scope.lista;
	        };

	        request.onerror = function(e) {
				alert("Erro ao listar seleções");
				console.log(e.target.errorCode);
			};
	    }

	    //init();
	}//);