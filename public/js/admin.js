$(function(){
	$(".del").click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			url: '/admin/movie/list',
			type: 'delete',
			data: {
				id: id
			}
		})
		.done(function(results) {
			console.log(results);
			if(results.success === 1){
				console.log(tr.length);
				if(tr.length > 0){
					tr.remove();
				}
			}
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	})
})