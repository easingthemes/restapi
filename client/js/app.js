app = {
	init: function(){

		app.showPosts();

		$('.create').on('click', function(event) {
			event.preventDefault();
			var itemTitle = $('input').val();
			var itemContent = $('textarea').val();
	 		var jsonItem = JSON.stringify({title: itemTitle, content: itemContent});
			app.createPost(jsonItem);
		});
		$('section').on('click', '.delete', function(event) {
			event.preventDefault();
			app.deletePost($(this).parent().attr('id'));
		});
		$('section').on('click', 'li > p', function(event) {
			app.showPost($(this).parent().attr('id'));
		});
		$('article').on('click', '.update', function(event) {
			var newTitle = $(this).siblings('h3').text();
			var newContent = $(this).siblings('div').text();
	 		var jsonItem = JSON.stringify({title: newTitle, content: newContent});
			app.updatePost($(this).parent().data('id'), jsonItem);
		});
	},
	showPosts: function(){
		//READ: get all items from API uri
		$.get('/api/items', function(data) {
			$.each(data, function(index, val) {
				$('<li id="'+val._id+'"><p>'+val.title+'</p> <button class="delete">delete</button></li>').appendTo('ul');
			});
			if (data.length != 0) {
				//Show one full item
				$('article').data('id',data[0]._id).html('');
				$('<h3 contenteditable="true">'+data[0].title+'</h3><div contenteditable="true">'+data[0].content+'</div><button class="update">update</button>').appendTo('article');
			};
			app.checkItems();
		});
		
	},
	showPost: function(itemId){
		//GET: get single item from API uri
		$.get('/api/items/'+itemId, function(data) {
			$('article').html('').data('id',data._id);
			$('<h3 contenteditable="true">'+data.title+'</h3><div contenteditable="true">'+data.content+'</div><button class="update">update</button>').appendTo('article');
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
 			$('<li id="'+data._id+'"><p>'+data.title+'</p> <button class="delete">delete</button></li>').appendTo('section > div > ul');
 			app.checkItems();
 		});
	},
	updatePost: function(itemId, newData){
		//UPDATE: update item
 		$.ajax({
 			url: '/api/items/'+itemId,
 			type: 'PUT',
 			contentType: 'application/json',
 			dataType: 'json',
 			data: newData
 		})
 		.done(function(data) {
 			$('#'+data._id+' p').text(data.title);
 		});
	},
	deletePost: function(itemId){
		//DELETE: delete item
		if (itemId) {
			var itemElement = document.getElementById(itemId);
	 		itemElement.parentNode.removeChild(itemElement);
	 		var fullItem = $('article');
	 		if (fullItem.data('id') === itemId) {
	 			fullItem.html('<h4>Select item to update: Click on item Title</h4>');
	 		};			
		};
 		$.ajax({
 			url: '/api/items/'+itemId,
 			type: 'DELETE'
 		});
 		app.checkItems();

	},
	checkItems: function() {
		if ($('li').length === 0) {
			$('ul').addClass('empty-list');
		} else {
			$('ul').removeClass('empty-list');
		}
	}
}
jQuery(document).ready(function($) {
	app.init();
});
 
