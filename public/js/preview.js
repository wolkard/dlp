function preview_init(){
	if ($('#preview').length==0) return;
	$("body").delegate("#preview_previous","click",function(){
		$("#preview_range").val($("#preview_range").val()-1);
		$("#preview_range").trigger("input");
	}).delegate("#preview_next","click",function(){
		$("#preview_range").val(parseInt($("#preview_range").val())+1);
		$("#preview_range").trigger("input");
	}).delegate("#preview_range","input keypress propertychange",function(){
		preview_update();
	});
//	preview_update();
}

function preview_update(){
	var d = new Date();
	var addon = '?' + d.getTime();
	var current_layer = $('#preview_range').val();
	var layers_count = $('#preview_range').attr('max');
//	$('#current_layer').html(current_layer);
	$('#preview').attr('src', $('#preview').data('path') + current_layer + '.png' + addon);
	$("#preview_p").html('共'+layers_count+'层，当前为第'+current_layer+'层');
//	if (!$("#toggle_details").data("display")) return;

//	$.getJSON($('#preview').data('path')+"info.json").done(function(data) {
//		d=data[current_layer-1];
//		$.each(d,function(k,v){
//			$("#"+k).html(v);
//		});
//	});
//	$.getJSON("/layer/preview/"+$('#preview_range').data("plate")+"/"+current_layer).done(function(data) {
//		$.each(data,function(k,v){
//			$("#"+k).html(v);
//		});
//	});
}
