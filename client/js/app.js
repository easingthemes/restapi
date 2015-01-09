app = {
	init: function(){

		app.showPosts();

		$('section > button').on('click', function(event) {
			event.preventDefault();
			var itemTitle = $('input').val();
			var itemContent = $('textarea').val();
	 		var jsonItem = JSON.stringify({title: itemTitle, content: itemContent});
			app.createPost(jsonItem);
		});
		$('ul').on('click', 'a', function(event) {
			event.preventDefault();
			app.deletePost($(this).parent().attr('id'));
		});
		$('ul').on('click', 'li', function(event) {
			app.showPost($(this).attr('id'));
		});
		$(document).on('click', 'article button', function(event) {
			var newTitle = $(this).siblings('h2').text();
			var newContent = $(this).siblings('div').text();
	 		var jsonItem = JSON.stringify({title: newTitle, content: newContent});
			app.updatePost($(this).parent().data('id'), jsonItem);
		});
	},
	showPosts: function(){
		//READ: get all items from API uri
		$.get('/api/items', function(data) {
			$.each(data, function(index, val) {
				$('<li id="'+val._id+'"><p>'+val.title+'</p> <a href="">delete</a></li>').appendTo('ul');
			});
		});
	},
	showPost: function(itemId){
		//GET: get single item from API uri
		$.get('/api/items/'+itemId, function(data) {
			$('<article data-id="'+data._id+'"  contenteditable="true"><h2>'+data.title+'</h2><div>'+data.content+'</div><p>Click on text and edit</p><button>save</button></article>').appendTo('section');
		});	
	},
	createPost: function(data){
		//CREATE: create new item
 		$.ajax({
 			url: '/api/items',
 			type: 'POST',
 			contentType: 'application/json',
 			dataType: 'json',
 			data: data
 		})
 		.done(function(data) {
 			$('<li id="'+data._id+'"><p>'+data.title+'</p> <a href="">delete</a></li>').appendTo('ul');
 		});
	},
	updatePost: function(itemId, newData){
		console.log(itemId);
		//UPDATE: update item
 		$.ajax({
 			url: '/api/items/'+itemId,
 			type: 'PUT',
 			contentType: 'application/json',
 			dataType: 'json',
 			data: newData
 		})
 		.done(function(data) {
 			console.log(data._id+' - '+data.title);
 			$('#'+data._id+' p').text(data.title);
 		});
	},
	deletePost: function(itemId){
		//DELETE: delete item
 		$.ajax({
 			url: '/api/items/'+itemId,
 			type: 'DELETE'
 		});
 		var itemElement = document.getElementById(itemId);
		itemElement.parentNode.removeChild(itemElement);
	}
}
jQuery(document).ready(function($) {
	app.init();
});
 
