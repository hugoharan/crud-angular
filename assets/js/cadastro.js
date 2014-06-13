
	var Cadastro = function ($scope){

		$scope.selecao = {id : 0, nome: "", grupo: ""};
		$scope.lista = [];

		var init = function(){

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




 //  	module.factory('storage', function($q,$rootScope){
 //  		var db;
 //  		var service = {};

 //  		service.init = function(){


	// 	};

	// 	service.salvar = function(obj){


	// 	}

	// 	service.excluir = function(obj){
	// 		debugger;

	// 	}

	// 	service.listar = function($q){
	// 		var def = $q.defer();
	// 		debugger;
	// 		var transaction = db.transaction(["selecoes"]);
	//         var objectStore = transaction.objectStore("selecoes");
	// 		var selecoes = new Array();
	//         var request = objectStore.openCursor();
	//         request.onsuccess = function(evt) {
	//             def.resolve(pos);
	//             var cursor = evt.target.result;
	//             if (cursor) {
	//                selecoes.push(cursor.value);
	//                 cursor.continue();
	//             }
	//             else{
	//             	return selecoes;
	//             }
	//         };
	//         request.onerror = function(e) {
	// 			 def.reject(error);
	// 			alert("Erro ao listar seleções");
	// 			console.log(e.target.errorCode);
	// 		};
	// 		return def.promise;
	// 	}

	// return service;
	// });


// function Cadastro($scope, storage) {



// }


// function Database(){ // = function(){


// }


// $(document).ready(function(){

//     var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
//     var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
//     var db;

//     if (!window.indexedDB) {
//         alert("Seu navegavor não suporta a API IndexedDB.");
//     } else {
//         bdTarefas();
//     }

//     function bdTarefas(){
//         var request = indexedDB.open("Tarefas", 1);
//         request.onsuccess = function (evt) {
//             db = request.result;
//             $('#categoria').val('Entrada');
//             var categoria = $('#categoria').val();
//             $('#tarefa').attr('placeholder', "Adicionar um item em \"" + categoria + "\"");
//             listaTarefas();
//             listaCategorias();
//         };

//         request.onerror = function (evt) {
//             console.log("IndexedDB error: " + evt.target.errorCode);
//         };

//         request.onupgradeneeded = function (evt) {
//             var storeTarefas = evt.currentTarget.result.createObjectStore("tarefas", { keyPath: "id", autoIncrement: true });
//             storeTarefas.createIndex("tarefa", "tarefa", { unique: false });
//             storeTarefas.createIndex("categoria", "categoria", { unique: false });
//             var storeCategorias = evt.currentTarget.result.createObjectStore("categorias", { keyPath: "id", autoIncrement: true });
//             storeCategorias.createIndex("categoria", "categoria", { unique: true });
//         };
//     }

//     function listaTarefas() {
//         var tarefas = $('.listaTarefas');
//         tarefas.empty();
//         var transaction = db.transaction("tarefas", "readwrite");
//         var objectStore = transaction.objectStore("tarefas");

//         var req = objectStore.openCursor();
//         req.onsuccess = function(evt) {
//             var cursor = evt.target.result;
//             if (cursor) {
//                 if(cursor.value.categoria == $('#categoria').val()) {
//                     var linha  = "<li>" + cursor.value.tarefa + "<a href='#' id='" + cursor.key + "'>[ Delete ]</a></li>";
//                     $('.listaTarefas').append(linha);
//                 }
//                 cursor.continue();
//             }
//         };
//     }

//     function listaCategorias() {
//         var tarefas = $('.listaCategorias');
//         tarefas.empty();
//         $('.listaCategorias').append("<li id='Entrada' class='categorias ativo'>Entrada</li>");
//         var transaction = db.transaction("categorias", "readwrite");
//         var objectStore = transaction.objectStore("categorias");

//         var req = objectStore.openCursor();
//         req.onsuccess = function(evt) {
//             var cursor = evt.target.result;
//             if (cursor) {
//                 var linha  = "<li id='"+ cursor.value.categoria +"' class='categorias'>" + cursor.value.categoria + "<a href='" + cursor.value.categoria + "' id='"+cursor.key+"'>[ X ]</a></li>";
//                 $('.listaCategorias').append(linha);
//                 cursor.continue();
//             } else {
//                 $('.listaCategorias').append('<li id="nova">+ Adicionar Nova Categoria</li>');
//             }
//         };
//     }

//     function insereTarefa() {
//         var categoria = $('#categoria').val();
//         var tarefa = $("#tarefa").val();

//         var transaction = db.transaction("tarefas", "readwrite");
//         var objectStore = transaction.objectStore("tarefas");
//         var request = objectStore.add({tarefa: tarefa, categoria: categoria});
//         request.onsuccess = function (evt) {
//             $('#tarefa').val('');
//             listaTarefas();
//         };
//     }

//     function insereCategoria() {
//         var categoria = $('#nova_categoria').val();

//         var transaction = db.transaction("categorias", "readwrite");
//         var objectStore = transaction.objectStore("categorias");
//         var request = objectStore.add({categoria: categoria});
//         request.onsuccess = function (evt) {
//             $('#nova_categoria').val('');
//             listaCategorias();
//         };
//     }

//     function deletaTarefa(id) {
//         var transaction = db.transaction("tarefas", "readwrite");
//         var store = transaction.objectStore("tarefas");
//         var req = store.delete(+id);
//         req.onsuccess = function(evt) {
//             listaTarefas();
//         };
//     }

//     function deletaCategoria(id, categoria) {
//         var transaction = db.transaction("categorias", "readwrite");
//         var store = transaction.objectStore("categorias");
//         var req = store.delete(+id);
//         req.onsuccess = function(evt) {
//             limpaTarefasSemCategoria(categoria);
//             bdTarefas();
//         };
//     }

//     function limpaTarefasSemCategoria(categoria) {
//         var transaction = db.transaction("tarefas", "readwrite");
//         var objectStore = transaction.objectStore("tarefas");

//         var req = objectStore.openCursor();
//         req.onsuccess = function(evt) {
//             var cursor = evt.target.result;
//             if (cursor) {
//                 if(cursor.value.categoria == categoria) {
//                     var del = objectStore.delete(cursor.key);
//                 }
//                 cursor.continue();
//             }
//         };
//     }

//     $('#tarefa').keypress(function (e) {
//         if(e.keyCode == 13) {
//             insereTarefa();
//         }
//     });

//     $('.listaTarefas').on('click', 'a', function(){
//         var confirma = confirm('Deseja excluir esta tarefa ?')
//         if(confirma) {
//             deletaTarefa(this.id);
//             return false;
//         }
//     });

//     $('.listaCategorias').on('click', 'a', function(){
//         var confirma = confirm('Deseja excluir esta categoria ?\nATENÇÃO: Esta ação excluirá todas as tarefas vinculadas a esta categoria!')
//         if(confirma){
//             var id = this.id;
//             var categoria = $(this).parent().get(0).id;
//             deletaCategoria(id, categoria);
//         }
//         return false;
//     });

//     $('.listaCategorias').on('keypress', '#nova_categoria', function(e) {
//         if(e.keyCode == 13) {
//             insereCategoria();
//         }
//     });

//     $('.listaCategorias').on('click', '.categorias', function(){
//         $('nav li').removeClass('ativo');
//         $(this).addClass('ativo');
//         $('#categoria').val('');
//         var id = this.id;
//         $('#categoria').val(id);
//         $('#tarefa').attr('placeholder', "Adicionar um item em \"" + id + "\"");
//         listaTarefas();
//     });

//     $('.listaCategorias').on('click','#nova', function(){
//         $(this).replaceWith('<li id="nova"><input type="text" name="nova_categoria" id="nova_categoria" placeholder="Adicionar nova categoria"></li>')
//         $('#nova_categoria').focus();
//     });

//     $('.listaCategorias').on('blur', '#nova_categoria', function(){
//         $(this).replaceWith('+ Adicionar Nova Categoria')
//     });
// });