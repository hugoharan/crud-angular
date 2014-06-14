$(document).ready(function(){
	$(".table-selecoes").on("click",".edit", function(){
		$(".box-form").css("transform","rotateY(360deg)");
	});

});

var Cadastro = function ($scope){

	var init = function(){
		//inicialização das váriaveis do escopo
		$scope.selecao = {id : 0, nome: "", grupo: ""};
		$scope.lista = [];

		//inicialização do banco de dados
		var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
		var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

		if (!window.indexedDB){
			alert("Indexed DB não suportado!");
		}
		else {
			//abrindo conexão com o banco de dados
			var request = window.indexedDB.open("Selecoes", 1);
			request.onerror = function(e) {
				alert("Erro na conexão com o banco de dados!");
				console.log(e.target.errorCode);
			};
			request.onsuccess = function(e) {
				db = request.result;
				$scope.listar();
			};
			request.onupgradeneeded = function (e) {
				var thisDb = e.target.result;
				//se o banco não existir, ele será criado
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

		var obj = {};
		obj.nome = $scope.selecao.nome;
		obj.grupo = $scope.selecao.grupo;

		//verifica se é edição ou cadastro
		if($scope.selecao.id > 0){
			obj.id = $scope.selecao.id;
			var request = objectStore.get(obj.id);

			request.onerror = function(e) {
				alert("Erro ao buscar item selecionado!");
				console.log(e.target.errorCode);
			};

			request.onsuccess = function(e) {
				var data = request.result;
				data = obj;

				var requestUpdate = objectStore.put(data);

				requestUpdate.onerror = function(e) {
					alert("Erro ao editar selecionado!");
					console.log(e.target.errorCode);
				};

				requestUpdate.onsuccess = function(e) {
					alert("O item foi editado com sucesso!");
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
					var retorno = {};
					retorno.id = id;
					retorno.nome = obj.nome;
					retorno.grupo = obj.grupo;
					$scope.lista.push(retorno);
					$scope.selecao = {id : 0, nome: "", grupo: ""};
					alert("Item salvo com sucesso!");
				});
			};

			request.onerror = function(e) {
				alert("Erro ao salvar");
				console.log(e.target.errorCode);
			};
		}
	}

	$scope.editar = function (item){
		//apenas preenche o model com o item desejado
		$scope.selecao = item;
	}

	$scope.excluir = function(item){
		var transaction = db.transaction(["selecoes"], "readwrite")
		.objectStore("selecoes")
		.delete(item.id);
		transaction.onsuccess = function(e) {
			alert("Item excluído com sucesso!");
			$scope.$apply(function(){
				var index = $scope.lista.indexOf(item);
				$scope.lista.splice(index,1);
			});
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
				$scope.$apply(function(){
					$scope.lista.push(cursor.value);
					cursor.continue();
				});

			}
			else
				return $scope.lista;
		};

		request.onerror = function(e) {
			alert("Erro ao listar seleções!");
			console.log(e.target.errorCode);
		};
	}

	$scope.pesquisar = function(){
		var nome = $scope.selecao.search;
		if (nome == ""){
			$scope.lista = new Array();
			$scope.listar();
			return;
		}
		var tamanho = $scope.lista.length;
		for(var i = 0; i < tamanho; i++){
			var item = $scope.lista[i];
			if(item.nome == nome){
				$scope.lista = new Array();
				$scope.lista.push(item);
				return;
			}
		}
		alert("Item não encontrado!");
		$scope.lista = new Array();
		$scope.listar();
	}
}