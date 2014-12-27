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

	$('#douban').blur(function(){
		var douban = $(this);
		var id = douban.val();
		console.log(id);
		if(id){
			$.ajax({
				url: "https://api.douban.com/v2/movie/subject/" + id
				,cache: true
				,type: 'get'
				,dataType: 'jsonp'
				,crossDomain: true
				,jsonp: 'callback'
				,success: function(data){
					// console.log(data);
					$("#inputTitle").val(data.title);
					$("#inputDirector").val(data.directors[0].name);
					$("#inputCountry").val(data.countries[0]);
					$("#inputLanguage").val(data.countries[0]);
					$("#inputPoster").val(data.images.small);
					$("#show").attr("src", data.images.small);
					$("#inputFlash").val(data.alt);
					$("#inputYear").val(data.year);
					$("#inputSummary").val(data.summary);
				}
			})
		}
	})
})