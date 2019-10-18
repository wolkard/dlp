var aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
		if(c.get || c.set) throw new TypeError("ES3 does not support getters and setters.");
		a != Array.prototype && a != Object.prototype && (a[b] = c.value)
	},
	ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;
var model_names = new Array;
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
function isHasElementOne(arr,value){
	for(var i = 0,vlen = arr.length; i < vlen; i++){
		if(arr[i] == value){
			return i;
		}
	}
	return -1;
}
//右键菜单
context.init({preventDoubleContext: false});
context.settings({compress: true});
function step1_model_menu(){
	$(".dropdown-menu.dropdown-context.compressed-context").remove();
	context.attach('#view_3d', [
		{header: '常用功能'},//菜单名称
		{divider: true},//换行分割
		{text: '复制', action: function(){
			copy_model();
		}},
		{divider: true},//换行分割
		{text: '旋转', action: function(){
			$(".rotates").show();
		}},
		{divider: true},//换行分割
		{text: '删除', action: function(){
			del_model();
		}}
	]);

}
function step2_model_menu(){
	$(".dropdown-menu.dropdown-context.compressed-context").remove();
	context.attach('#view_3d', [
		{header: '常用功能'},//菜单名称
		{divider: true},//换行分割
		{text: '删除支撑', action: function(){
			del_support();
		}}
	]);
}
function step1_set_up_menu(first){
	$(".dropdown-menu.dropdown-context.compressed-context").remove();
	context.attach('#view_3d', [
		{header: '常用功能'},//菜单名称
		{divider: true},//换行分割
		{text: first, action: function(){
			model_enter_move();
		}},
		{text: '自动排布', action: function(){
			auto_sort_models();
		}},
		{divider: true},//换行分割
		{text: '设置', action: function(){
			if(typeof(Storage)!=="undefined") {
				//如果支持web储存
				localStorage.setup_from = JSON.stringify(1);
			}
			window.location.href = "/z-calibration";
		}}
	]);
}
function step2_set_up_menu(){
	$(".dropdown-menu.dropdown-context.compressed-context").remove();
	context.attach('#view_3d', [
		{header: '常用功能'},//菜单名称
		{divider: true},//换行分割
		{text: '设置', action: function(){
			if(typeof(Storage)!=="undefined") {
				//如果支持web储存
				localStorage.setup_from = JSON.stringify(1);
			}
			window.location.href = "/z-calibration";
		}}
	]);
}

var flage=1;
$('#step1').click(function(a){
	if(flage!=1){
		$('#return_step1').modal();
		flage=1;
	}
});

$('#step2').click(function(a){
	flage=2;
	//var file = $("#support_file").val();
	//if(file==""&&decodeURI(getUrlParam('src'))=='null'){
	if(G.length<=0){
		$('#select_file').modal();
		flage=1;
	}else{
		if($('#enter_move').text()=="确定"){
			$('#enter_move').click();
		}
		if(G[J]){
			G[J].material = new THREE.MeshLambertMaterial({
				color: 0xe8e8e8
			});//初始化被选中的模型颜色
			J=-1;
		}

		for(var i = 0; i< G.length;i++){//添加支撑前上升模型4mm
			G[i].position.z+=4;
		}
		J=-1;
		$('.active .before_active').addClass('before').removeClass('before_active');
		$('.active .after_active').addClass('after').removeClass('after_active');
		$('div').removeClass('active');
		$('#step2').addClass('active');
		$('.active .before').addClass('before_active').removeClass('before');
		$('.active .after').addClass('after_active').removeClass('after');

		$('#menu_step1').hide();
		$('#enter_move').hide();
		$("#automatic_alignment").hide();
		$('#manually_adding_support').show();
		$('#menu_step2').show();
		$('#view_3d').show();
		a.preventDefault();
		Ra('can_not_add_support')//can_not_add_support禁止手动添加支撑//support可以手动添加支撑
		$('#bottom').trigger("click");
		
		if(typeof(Storage)!=="undefined") {//如果支持web储存
			//密度选择缓存
			if(localStorage.densityId != null){
				$(".density").removeClass("selected_button");//移除密度的
				$("#"+localStorage.densityId).addClass("selected_button");
			}
			//支撑选择缓存
			if(localStorage.supportTypesId!=null){
				//移除选择和样式
				$("#support_types tr").removeClass("selected");
				$("#support_types tr").removeClass("selected_button");
				$("#"+localStorage.supportTypesId).addClass("selected");
				$("#"+localStorage.supportTypesId).addClass("selected_button");
			}
		}
		$('#view_state').css('background-image',"url(../static/img/view_7.png)");
	}
});

$('#step3').click(function(a){
	var file = $("#support_file").val();
	if(file==""&&decodeURI(getUrlParam('src'))=='null'){
		$('#select_file').modal()
	}
	else {
		$('.active .before_active').addClass('before').removeClass('before_active');
		$('.active .after_active').addClass('after').removeClass('after_active');
		$('div').removeClass('active')
		$('#step3').addClass('active')
		$('.active .before').addClass('before_active').removeClass('before');
		$('.active .after').addClass('after_active').removeClass('after');

		$('#menu_step2').hide();
		$('#menu_step1').hide();
		$('#view_3d').hide();
		a.preventDefault();
		$('#save').trigger("click");
	}
	flage=3;
});

$("#del_support").click(function(){
	var load = new Loading();
	load.init();
	load.start();
	setTimeout(function() {
		var len = $('.del_supports').length;
		for (var i=1;i<=len;i++) {
			$('.del_supports').click();
		};
	}, 100);
	setTimeout(function(){
		load.stop();
	},100);
});

//进入移动模式
$("#enter_move").click(function(e){
	model_enter_move()
});

function model_enter_move(){
	if($("#enter_move").text()=="排布"){
		$("#enter_move").text("确定");
		$("#enter_move").addClass("selected_button");
		enter_move()
	}else{
		$("#enter_move").text("排布");
		$("#enter_move").removeClass("selected_button");
		out_move()
	}
}

function enter_move(){
	step1_set_up_menu("退出排布")
	$(".rotates").hide();
	$("#view_up").click();
	n.enabled = !1;
	F="layout";
}
function out_move(){
	step1_set_up_menu("手动排布")
	$("#view_conter").click();
	$(".rotates").hide();
	F = "Z_rot";
	n.enabled = !0;
	Z_rot_end_x=0;//相机围绕z轴旋转归0
}

//进入手动添加支撑模式
$("#manually_adding_support").click(function(e){
	if(this.innerText=="单个添加支撑"){
		$("#manually_adding_support").text("完成");
		$("#manually_adding_support").addClass("selected_button");
		F = "support"
	}else{
		$("#manually_adding_support").text("单个添加支撑");
		$("#manually_adding_support").removeClass("selected_button");
		F = "can_not_add_support"
	}
});

//自动排布
$("#automatic_alignment").click(function(){

	//var canvas = document.getElementById("cvs");
	//console.log(canvas)
	//var ctx = c.getContext("2d");
	//console.log(ctx)
	//for (var i = 0; i < 100; i++) {
	//	var c = ctx.getImageData(i * 3, i * 3, 1, 1).data;
	//	console.log(c)
	//}

	auto_sort_models();
 })
function auto_sort_models(){
	var all_max_y = new Array;//获得所有模型的width/2宽度
	var arr1 = [];//存放用于全排列的序列
	for (var G_num = 0; G_num < G.length; G_num += 1) {
		var max_y = 0;
		arr1.push(G_num);//模型index形成数组,用来排列组合
		G[G_num].material = new THREE.MeshLambertMaterial({
			color: 0xe8e8e8
		});//首先重新初始化模型颜色

		for(var i=0;i<boxes_name.length;i+=1){
			max_y = Math.max(max_y,Math.abs(boxes[G_num][boxes_name[i]].y));
		}
		all_max_y.push(max_y)
	}

	var all_max_y_max = all_max_y[0];
	var all_max_y_min = all_max_y[0];
	for (var i=0;i<all_max_y.length;i++){
		all_max_y_max = Math.max(all_max_y_max,all_max_y[i]);
		all_max_y_min = Math.min(all_max_y_min,all_max_y[i]);
	}

	//如果模型最大y和最小y相差二倍以上，则进行全排列，否则按照模型导入顺序排列
	console.log(all_max_y_max,all_max_y_min)
	if(all_max_y_max/all_max_y_min>=2){
		var groups = permute([],arr1);//模型index 进行全排列
		var best_group = [];
		var last_best_are = Z("width")*Z("height");
		var last_best_num = 0;
		var data = [];
		for (var num = 0; num< groups.length;num+=1) {
			data = auto_sort(num,groups,last_best_are,best_group,last_best_num,false);//模型进行排布
			last_best_are = data[0];
			best_group = data[1];
			last_best_num = data[2];
		}
		data = auto_sort(0,[best_group],last_best_are,best_group,last_best_num,true);
	}else{
		auto_sort(0,[arr1],0,[arr1],0,true);
	}
 };
/*
* 自动排布模型
* num:成功排布模型的数量，作为第一优先级寻找
* groups:模型排布的所有顺序，全排列得出
*last_best_are：之前模型组最小的面积，第二优先级寻找
* best_group：之前最好的模型排布顺序
* last_best_num：之前成功最多的模型数量
* flg:判断是否对模型进行排布（在运算过程中不进行排布，运算完成后利用best_group进行排布）
* */
function auto_sort(num,groups,last_best_are,best_group,last_best_num,flg){

	var width = Z("width");
	var height = Z("height");
	var points = new Object();
	//初始化三个二维向量（x,y）：beg底面左上角起始点，mid所有模型组成的矩形的右下角点，end底面右下角点
	points.beg=new THREE.Vector2(width/2,-height/2);
	points.mid = new THREE.Vector2(width/2,-height/2);
	points.end = new THREE.Vector2(-width/2,height/2);
	var are =0;
	var lines = 0;
	var models_success_num = 0;
	for (var G_num = 0; G_num < groups[num].length; G_num += 1) {
		//获得模型从上到下的投影的 最大x、最大y
		var max_x = 0;
		var max_y = 0;
		for (var i = 0; i < boxes_name.length; i++) {
			max_x = Math.max(max_x, Math.abs(boxes[groups[num][G_num]][boxes_name[i]].x));
			max_y = Math.max(max_y, Math.abs(boxes[groups[num][G_num]][boxes_name[i]].y));
		}

		var interval = 5;//模型间的间隔
		var new_mid_x = points.mid.x - max_x * 2 - interval;
		if (new_mid_x + interval >= points.end.x) {//模型组宽度没有超过底面高度和底面宽度
			if(points.beg.y+max_y*2+interval<= points.end.y){
				if (Math.abs(points.mid.y - points.beg.y) < max_y*2+interval) {//如果模型组的高度小于模型高度，更新模型组高度。
					points.mid.y = points.beg.y + max_y * 2 + interval;//更新mid点的y
				}
				points.mid.x = new_mid_x;//更新mid点的x
				are = Math.abs(points.mid.y - points.beg.y) * Math.abs(points.mid.x - points.beg.x);
				models_success_num+=1;
				if (flg) {
					G[groups[num][G_num]].position.x = points.mid.x + max_x + interval / 2;//更新模型x
					G[groups[num][G_num]].position.y = points.beg.y + max_y + interval / 2;//更新模型y
				}
			}else{
				console.log("模型纵向超出3")
				if(flg) {
					G[groups[num][G_num]].material = new THREE.MeshLambertMaterial({
						color: "#FF0000"
					});
				}
			}
		} else if (new_mid_x + interval < points.end.x) {//如果模型组横向将要超出底面，则纵向+1。
			if(points.mid.y+max_y*2 + interval<= points.end.y){
				//console.log("将要超出底面高度，进行换行");
				lines += are;
				//if(G_num+1<groups[num].length){
					points.mid.x = points.beg.x - max_x * 2 - interval;//回调mid的x
					points.beg.y = points.mid.y;//更新起始点
					points.mid.y += max_y*2 + interval;
					are = Math.abs(points.mid.x - points.beg.x) * Math.abs(points.mid.y + max_y * 2 + interval - points.beg.y);
					models_success_num+=1;
					//points.mid.y += max_y*2 + interval;//更新mid的y
					if (flg) {
						G[groups[num][G_num]].position.x = points.mid.x + max_x + interval / 2;//更新模型x
						G[groups[num][G_num]].position.y = points.beg.y + max_y + interval / 2;//更新模型y
					}
				//}else{
				//	console.log("模型到达最后一个")
				//}
			}else{
				console.log("模型纵向超出1")
				if(flg) {
					G[groups[num][G_num]].material = new THREE.MeshLambertMaterial({
						color: "#FF0000"
					});
				}
			}
		} else if(points.mid.y> points.end.y){
			console.log("模型纵向超出2")
			if(flg) {
				G[groups[num][G_num]].material = new THREE.MeshLambertMaterial({
					color: "#FF0000"
				});
			}
		}else{//如果模型组纵向超出，则
			console.log("error")
		}
	}
	are += lines;
	//console.log("models_success_num;",models_success_num)
	if(models_success_num>= last_best_num){
		if (last_best_are<=are){
			return [last_best_are,best_group,models_success_num];
		}else{
			return [are,groups[num],models_success_num];
		}
	}else{
		return [last_best_are,best_group,last_best_num];
	}
}
//将list元素排列组合
function permute(temArr,testArr){
	var permuteArr=[];
	var arr = testArr;
	function innerPermute(temArr){
		for(var i=0,len=arr.length; i<len; i++) {
			if(temArr.length == len - 1) {
				if(temArr.indexOf(arr[i]) < 0) {
					permuteArr.push(temArr.concat(arr[i]));
				}
				continue;
			}
			if(temArr.indexOf(arr[i]) < 0) {
				innerPermute(temArr.concat(arr[i]));
			}
		}
	}
	innerPermute(temArr);
	return permuteArr;
}


//缩放---未成形
//$("#automatic_alignment").click(function(){
//	console.log(G[J]);
//	var box_names = ["aaa","bbb","aab","aba","baa","abb","bab","bba"];
//	var axis = ["x","y","z"];
//
//	var volume=0.5;
//	G[J].scale.set(volume,volume,volume);
//
//	//修改模型box的max、min的倍数
//	for(var num = 0 ; num<axis.length; num+=1){
//		G[J].geometry.boundingBox.max[axis[num]]*=volume;
//		G[J].geometry.boundingBox.min[axis[num]]*=volume;
//	}
//
//	//修改boxes的倍数
//	for(var num=0 ; num<box_names.length ; num+=1){
//		for(var axis_num=0 ;axis_num<axis.length;axis_num+=1){
//			boxes[J][box_names[num]][axis[axis_num]] *=volume;
//		}
//	}
//
//	//修改模型高度--->降低或升高，使其能贴近底面
//	G[J].position.z =1+ G[J].position.z- volume*G[J].position.z
//	console.log(boxes[J]);
//	console.log(G[J]);
//});

function ca(a, b) {
	if(b) {
		for(var c = ba, d = a.split("."), e = 0; e < d.length - 1; e++) {
			var f = d[e];
			f in c || (c[f] = {});
			c = c[f]
		}
		d = d[d.length - 1];
		e = c[d];
		f = b(e);
		f != e && null != f && aa(c, d, {
			configurable: !0,
			writable: !0,
			value: f
		})
	}
}
ca("Array.prototype.find", function(a) {
	return a ? a : function(a, c) {
		var b;
		a: {
			b = this;b instanceof String && (b = String(b));
			for(var e = b.length, f = 0; f < e; f++) {
				var g = b[f];
				if(a.call(c, g, f, b)) {
					b = g;
					break a
				}
			}
			b = void 0
		}
		return b
	}
});
ca("Array.prototype.fill", function(a) {
	return a ? a : function(a, c, d) {
		var b = this.length || 0;
		0 > c && (c = Math.max(0, b + c));
		if(null == d || d > b) d = b;
		d = Number(d);
		0 > d && (d = Math.max(0, b + d));
		for(c = Number(c || 0); c < d; c++) this[c] = a;
		return this
	}
});


function h() {}

function k() {}

function m() {}

function n() {}

function p() {}

function q() {}

function r() {}

function da() {}

function ea() {}
var t = 0,
	u = 0,
	v, A, ga = !1;

function C() {}
var D = 0,
	E = 0,
	F = "",
	G = [],
	H = [],
	J = -1,
	ha = !1,
	ia = {
		x: 0,
		y: 0
	},
	K = [],
	M = [],
	N = [],
	O = 0,
	P = null,
	Q, T, U,
	Z_rot_begin_x = 0,Z_rot_end_x = 0,
	boxes_name = ["aaa", "aab", "aba", "baa", "abb", "bab", "bba", "bbb"];;
$(function() {
	ja();
	ka();
	la()
});

function ka() {
	if($("#view_3d").length) {
		ma();
		na();
		oa();
		pa();
		qa();
		ra();
		sa();
		//ta();
		h = new THREE.Scene;
		p = new THREE.Raycaster;
//		D = window.innerWidth;
//		E = window.innerHeight;
		D = $("#view_3d").width();
		E = $("#view_3d").height();
		m = new THREE.WebGLRenderer({
			antialias: !0
		});
		m.setSize(D, E);
		m.setPixelRatio(window.devicePixelRatio);

		//var canvas = document.createElement('canvas');
		//canvas.id = "cvs";
		//canvas.width = D;
		//canvas.height = E;
		//m.domElement=canvas;
		$("#view_3d").html(m.domElement);
		ua();
		window.addEventListener("resize", function() {
//			D = window.innerWidth;
//			E = window.innerHeight;
			D = $("#view_3d").width();
			E = $("#view_3d").height();
			m.setSize(D, E);
			k.aspect = D / E;
			k.updateProjectionMatrix()//更新相机
		});
		m.setClearColor(0xd3d9e5, 1);
		wa();//灯光
		xa();
		ya();
		var a = new THREE.AxisHelper(100);
		h.add(a);
		za();
		Aa();
		n = new THREE.TrackballControls(k, m.domElement);
		n.rotateSpeed = 1;//相机旋转速度
		n.f = 5;
		n.maxDistance = 1400;//相机距离
		Ba();
		Ca();
		Da();
		n.target.z = 18;//降低整个区域，Da->Ra 中有n.reset,所以将此行放在Da()后面
		Ea();
		Fa()
		F="Z_rot"
	}
}

function qa() {
	$(document).on("mouseenter", "#items .item", function() {
		"support" === $(this).data("type") ? Ga($(this).data("key")) : "model" === $(this).data("type") && Ha($(this).data("key"))
	}).on("mouseleave", "#items", function() {
		Ia()
	})
	//	.on("click", "#items .copy", function(a) {
	//	a.preventDefault();
	//	a = $(this).parent().data("key");
	//	for(var b = 0; b < H.length; b++)
	//		if(H[b] == a) {
	//			b = G[b].clone();
	//			b.material = new THREE.MeshLambertMaterial({
	//				color: 6534741
	//			});
	//			a = (new Date).getTime();
	//			b.name = a;
	//			b.position.set(b.position.x + 10, b.position.y +
	//				10, b.position.z);
	//			h.add(b);
	//			G.push(b);
	//			H.push(a);
	//			V();
	//			break
	//		}
	//})
	 .on("click", "#items .model", function(a) {
		a.preventDefault();
		"support" == F && (Ja(), Ka());
		if("layout" == F|| "Z_rot"==F || "support" == F) {
			La();
			a: {
				a = $(this).parent().data("key");
				for(var b = H.length - 1; 0 <= b; b--)
					if(H[b] === a) {
						h.add(G[b]);
						J = b;
						a = !0;
						break a
					}
				a = !1
			}!1 === a && (J = H.length - 1, h.add(G[J]))
		}
	}).on("click", "#items .remove", function(a) {
		a.preventDefault();
		a = $(this).parent();
		if("support" === a.data("type")) Ma(a.data("key")), W();
		else if("model" === a.data("type")) {
			a = a.data("key");
			for(var b = H.length - 1; 0 <= b; b--) a == H[b] && (h.remove(G[b]), G.splice(b, 1), H.splice(b, 1));
			J = G.length - 1;
			W()
		}
		V()
	}).on("click", "#items .toggle", function(a) {
		a.preventDefault();
		a = $(this).parent();
		var b = a.data("key");
		if(a.data("hide")) {
			a.data("hide", !1);
			for(var c = M.length - 1; 0 <= c; c--) b == M[c] && h.add(K[c])
		} else {
			for(c = M.length - 1; 0 <= c; c--) b == M[c] && h.remove(K[c]);
			a.data("hide", !0)
		}
	})
}

$("#brace").click(function(){
	var load = new Loading();
	load.init();
	load.start();
	$("#occlusion").show();//显示遮罩
	$("#progressbar").show();//显示进度条
	$("#speed").show();//显示百分比
	setTimeout(function() {
		reductionCamera();
		//if ("support" == F) {
			var bottomWidth = 2.5;
			var bottomHeight = 5/3;
			var backX = -bottomWidth;
			var backY = -bottomHeight;
			var change = 0;
			var intvl=self.setInterval(function(){
				if(backX>=bottomWidth){
					backY+=0.10847*Math.sqrt(2)/2;
					backX=-bottomWidth+change;
					if(change==0){
						change=Math.sqrt(2)/2*0.10847;
					}else{
						change=0;
					}
				}else{
					backX+=0.1*Math.sqrt(2);
				}
				addBrace(backX,backY);
				if(backX>=bottomWidth&&backY>=bottomHeight){
					//$("#unify_base").click();//添加底板
					k.fov=-25;//fov相机倍数距离
					k.updateProjectionMatrix();//更新相机
					m.render(h, k);
					$("#unify_base").click();
					$("#view_conter").click();
					$("#occlusion").hide();//隐藏遮罩
					$("#progressbar").hide();//隐藏进度条
					$("#speed").hide();//隐藏百分比
					load.stop();
					window.clearInterval(intvl);
				}
				$( "#progressbar" ).progressbar({
					max:bottomHeight,
					value: Math.abs(-bottomHeight-backY)/2
				});
				var speed = (Math.abs(-bottomHeight-backY)/2)/bottomHeight;
				if(speed<=1){
					$("#speed").text(Math.round(speed*100)+"%")
				}else{
					$("#speed").text(100+"%")
				}
			},1);
		//} else "plate" == F ? $(document.elementFromPoint(a.clientX, a.clientY)).is("canvas") && (c = new THREE.Vector3(a.clientX / window.innerWidth * 2 - 1, 2 * -(a.clientY / window.innerHeight) + 1, .5), p.setFromCamera(c.clone(), k), c = p.intersectObjects(G), 0 !== c.length && (Pa(a), Qa(), 0 < c.length && Ha(c[0].object.name), V())) : "layout" == F && Pa(a)
	}, 10);
})


if(localStorage.densityVal!=null){
	var kFov = localStorage.densityVal;
}else{
	var kFov = -16.8;
}
//点击后控制扩大倍数，从而改变支撑密度
$(".density").click(function(val){
	$(".density").removeClass("selected_button");
	$("#"+val.target.id).addClass("selected_button");
	if(val.target.id=="big"){
		kFov = -13.5;
	}else if(val.target.id == "lit"){
		kFov = -20;
	}else{
		kFov= -16.8;
	}
	if(typeof(Storage)!=="undefined")
	{
		localStorage.densityId=val.target.id;
		localStorage.densityVal=kFov;
	}
})
//将相机角度还原回底面
function reductionCamera(){
	k.position.x = 0;//position 相机实际距离
	k.position.y = 0;
	k.position.z = -150;
	k.rotation.x=-Math.PI;
	k.rotation.z=-Math.PI;
	k.rotation.y=0;;
	k.up.x=0;
	k.up.y=1;
	k.up.z=0;
	k.updateProjectionMatrix();//更新相机
	k.fov=kFov;//fov相机倍数距离
	k.updateProjectionMatrix();//更新相机
	m.render(h, k);
}
//添加支撑改------自动添加
function addBrace (x,y){
    var b, c = (new Date).getTime();
    a = new THREE.Vector3(x,y,.5);
    p.setFromCamera(a.clone(), k);//p:前面为p绑定点击事件，现在用一个新的原点和方向向量来更新射线
	a = p.intersectObjects(G);//检查射线和物体之间的所有交叉点（包含或不包含后代）。交叉点返回按距离排序，最接近的为第一个。 返回一个交叉点对象数组。
	var d = p.intersectObjects(K), e;
	e = $("#support_types tr.selected").data("key");
	"undefined" === typeof e ? e = "" : (e = N[parseInt(e, 10)], e.head_len = parseFloat(e.head_len) || 0, e.penetration = parseFloat(e.penetration) || 0, e.head_dia = parseFloat(e.head_dia) || 0, e.body_dia = parseFloat(e.body_dia) || 0, e.base_len = parseFloat(e.base_len) || 0, e.base_dia = parseFloat(e.base_dia) || 0, e.head_type = parseFloat(e.head_type) || 0, e.type = parseFloat(e.type) || 0);
	if ("" !== e && (0 !== a.length || 0 !== d.length)) {
		if(a.length>0){
			b = a[0].point;
		}
		if (0 === e.type && 0 < e.body_dia && 0 < a.length) {
			a = e;
			d = 2 * b.z;
			d = Na(b.x, b.y, d);
			d = Na(b.x - a.body_dia / 2, b.y - a.body_dia / 2, d);
			d = Na(b.x + a.body_dia / 2, b.y + a.body_dia / 2, d);
			d = Na(b.x + a.body_dia / 2, b.y - a.body_dia / 2, d);
			d = Na(b.x - a.body_dia / 2, b.y + a.body_dia / 2, d);
			b.z = b.z != d ? d : b.z;
			d = b.z - a.head_len - a.base_len + a.penetration;
			e = new THREE.MeshLambertMaterial({
				color: 6711039
			});
			var f;
			f = 1 === a.head_type ? new THREE.SphereBufferGeometry(a.head_dia, 16, 16) : new THREE.CylinderBufferGeometry(a.head_dia, a.body_dia, a.head_len, 16);
			f = new THREE.Mesh(f, e);
			f.position.set(b.x, b.y, b.z - a.head_len / 2 + a.penetration);
			Oa(f, c);
			f = new THREE.CylinderBufferGeometry(a.body_dia, a.body_dia, d + .05, 16);
			f = new THREE.Mesh(f, e);
			f.position.set(b.x, b.y, b.z - a.head_len - d / 2 + a.penetration);
			Oa(f, c);
			f = new THREE.CylinderBufferGeometry(a.base_dia, a.base_dia, a.base_len, 16);
			e = new THREE.Mesh(f, e);
			e.position.set(b.x, b.y, b.z - a.head_len - d - a.base_len / 2 + a.penetration);
			Oa(e, c);
			T.push({
				type: "m2f",
				key: c,
				dia: a.base_dia,
				x: b.x,
				y: b.y,
				z: d - a.penetration + a.base_len
			})
		} else 0 === e.type && 0 < d.length ? (Ia(), 0 < d.length && Ga(d[0].object.name)) :1 === e.type && 0 < e.body_dia && (0 < d.length && (b = d[0].point), d = e, "" === Y ? ($("body").css("cursor", "copy"), Y = b.clone()) : (e = (new THREE.Vector3).subVectors(Y, b), a = new THREE.Matrix4, a.lookAt(b, Y, (new THREE.Object3D).up),a.multiply((new THREE.Matrix4).set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)), d = new THREE.CylinderGeometry(d.body_dia, d.body_dia, e.length() + 2 * d.penetration, 8, 1), e = new THREE.MeshLambertMaterial({
			color: 6711039
		}), d = new THREE.Mesh(d, e), d.applyMatrix(a), d.position.x = (Y.x + b.x) / 2, d.position.y = (Y.y + b.y) / 2, d.position.z = (Y.z + b.z) / 2, d.name = c, h.add(d), K.push(d), M.push(c), W()));
		V()
	}
}

//点击添加支撑
function za() {
	$(m.domElement).on("mousedown", function (a) {
		console.log(F)
		if(F=="Z_rot"){
			step1_set_up_menu("手动排布")
		}
		if(F=="layout"){
			step1_set_up_menu("退出排布")
		}
		else if(F == "can_not_add_support" || F == "support"){
			step2_set_up_menu()
		}
		if ("support" == F ) {
			if ($(document.elementFromPoint(a.clientX, a.clientY)).is("canvas")) {
				var b, c = (new Date).getTime();
				var x, y;
				x = a.clientX - $("#view_3d").offset().left;
				y = a.clientY - $("#view_3d").offset().top;
				a = new THREE.Vector3(x / $("#view_3d").width() * 2 - 1, 2 * -(y / $("#view_3d").height()) + 1, .5);
				p.setFromCamera(a.clone(), k);
				a = p.intersectObjects(G);
				var d = p.intersectObjects(K), e;
				e = $("#support_types tr.selected").data("key");//选择支撑
				//判断支撑样式e是否存在，存在则将其各个值数字化，否则为空字符串
				"undefined" === typeof e ? e = "" : (e = N[parseInt(e, 10)], e.head_len = parseFloat(e.head_len) || 0, e.penetration = parseFloat(e.penetration) ||
					0, e.head_dia = parseFloat(e.head_dia) || 0, e.body_dia = parseFloat(e.body_dia) || 0, e.base_len = parseFloat(e.base_len) || 0, e.base_dia = parseFloat(e.base_dia) || 0, e.head_type = parseFloat(e.head_type) || 0, e.type = parseFloat(e.type) || 0);
				if ("" !== e && (0 !== a.length || 0 !== d.length)) {//若点击到模型上，则a.length为false；点到支撑d为true（背景为非模型）；
					0 < a.length && (b = a[0].point);//b的xy为支撑的位置
					if (0 === e.type && 0 < e.body_dia && 0 < a.length) {
						a = e;
						d = 2 * b.z;
						d = Na(b.x, b.y, d);
						d = Na(b.x - a.body_dia / 2, b.y - a.body_dia / 2, d);
						d = Na(b.x + a.body_dia / 2, b.y + a.body_dia / 2, d);
						d = Na(b.x + a.body_dia / 2, b.y - a.body_dia / 2, d);
						d = Na(b.x - a.body_dia / 2, b.y + a.body_dia / 2, d);
						b.z = b.z != d ? d : b.z;
						d = b.z - a.head_len - a.base_len + a.penetration;
						e = new THREE.MeshLambertMaterial({
							color: 6711039
						});
						var f;
						f = 1 === a.head_type ? new THREE.SphereBufferGeometry(a.head_dia, 16, 16) : new THREE.CylinderBufferGeometry(a.head_dia, a.body_dia, a.head_len, 16);
						f = new THREE.Mesh(f, e);
						f.position.set(b.x, b.y, b.z - a.head_len / 2 + a.penetration);
						Oa(f, c);
						f = new THREE.CylinderBufferGeometry(a.body_dia, a.body_dia, d + .05, 16);
						f = new THREE.Mesh(f, e);
						f.position.set(b.x, b.y, b.z - a.head_len - d / 2 + a.penetration);
						Oa(f, c);
						f = new THREE.CylinderBufferGeometry(a.base_dia, a.base_dia, a.base_len, 16);
						e = new THREE.Mesh(f, e);
						e.position.set(b.x, b.y, b.z - a.head_len - d - a.base_len / 2 + a.penetration);
						Oa(e, c);
						T.push({
							type: "m2f",
							key: c,
							dia: a.base_dia,
							x: b.x,
							y: b.y,
							z: d - a.penetration + a.base_len
						})
					} else 0 === e.type && 0 < d.length ? (Ia(), 0 < d.length && Ga(d[0].object.name,step2_model_menu())) : 1 === e.type && 0 < e.body_dia && (0 < d.length && (b = d[0].point), d = e, "" === Y ? ($("body").css("cursor", "copy"), Y = b.clone()) : (e = (new THREE.Vector3).subVectors(Y, b), a = new THREE.Matrix4, a.lookAt(b,
						Y, (new THREE.Object3D).up), a.multiply((new THREE.Matrix4).set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1)), d = new THREE.CylinderGeometry(d.body_dia, d.body_dia, e.length() + 2 * d.penetration, 8, 1), e = new THREE.MeshLambertMaterial({
						color: 6711039
					}), d = new THREE.Mesh(d, e), d.applyMatrix(a), d.position.x = (Y.x + b.x) / 2, d.position.y = (Y.y + b.y) / 2, d.position.z = (Y.z + b.z) / 2, d.name = c, h.add(d), K.push(d), M.push(c), W()));
					V()
				}else{
					step2_set_up_menu()
				}
			}
		} else "plate" == F ? $(document.elementFromPoint(a.offsetX, a.offsetY)).is("canvas") && (c = new THREE.Vector3(a.clientX /
			window.innerWidth * 2 - 1, 2 * -(a.clientY / window.innerHeight) + 1, .5), p.setFromCamera(c.clone(), k), c = p.intersectObjects(G), 0 !== c.length && (Pa(a), Qa(), 0 < c.length && Ha(c[0].object.name), V())) : "layout" == F && Pa(a), F=="Z_rot" && (Pa(a),ha=1,Z_rot_begin_x= a.clientX - $("#view_3d").offset().left);//F==Z_rot,则点击模型Pa可用，ha=1可在鼠标拖动时进行模型旋转，Z_rot_begin_x，方便拖动时进行计算模型旋转
	})

}

function Ba() {
	requestAnimationFrame(Ba);
	m.render(h, k);
	n.update()
}

function wa() {
	var a = new THREE.AmbientLight(6316128);
	h.add(a);
	a = new THREE.PointLight(6316128);
	a.position.set(-300, 300, 100);
	h.add(a);
	a = new THREE.PointLight(6316128);
	a.position.set(-300, 300, -100);
	h.add(a);
	a = new THREE.PointLight(6316128);
	a.position.set(300, -300, 100);
	h.add(a);
	a = new THREE.PointLight(6316128);
	a.position.set(-300, -300, 100);
	h.add(a)
}

function Da() {
	Ra("Z_rot");
	$(".mode").on("click", function(a) {
		a.preventDefault();
		F != $(this).data("mode") && Ra($(this).data("mode"))
	})
}

function Ra(a) {
	F = a;
	W();
	$(".mode").removeClass("selected");
	$(".mode").each(function() {
		$(this).data("mode") === a && $(this).addClass("selected")
	});
	"Z_rot" ==a ? (Ja(), La(), C.enabled = !1, Ka(), $("#support_box, #slider, #plate_box").hide(), $("#layout_box").show(), $("#resize").show(), n.reset()) : "can_not_add_support" == a ? (La(), 0 < G.length && (h.add(G[G.length - 1]), J = G.length - 1), C.enabled = !1, $("#layout_box, #plate_box").hide(), $("#support_box, #slider").show(), Sa(), Ta(), n.reset(), $("#resize").hide()) : "plate" == a && (Ja(), Ka(), $("#support_box, #slider, #layout_box").hide(),
		$("#plate_box").show(), Ua(), n.reset(), k.position.x = 0, k.position.y = 0, k.position.z = 300, Va(), $("#resize").show());
	$("body").removeClass();
	$("body").addClass(a + "_mode");
	V()
}

function ua() {
	k = new THREE.PerspectiveCamera(-25, D / E, .1, 2E4);
	k.position.set(0, 200, 100);
	h.add(k);
	$(".cam-reset").on("click", function() {
		n.reset()
		n.target.x = 0;
		n.target.y = 0;
		n.target.z = 18;
	});
	$(".cam-change").on("click", function() {
		var a = $(this),
			b = a.data("x"),
			c = a.data("y"),
			d = a.data("z");
		a.data("reset") && n.reset();
		n.target.z = 10;
		k.position.x = b;
		k.position.y = c;
		k.position.z = d;
		if(b!=0){
			if(b<0){
				k.up.x = -1;
				k.up.y = 0;
				k.up.z = 0;
			}
			else{
				k.up.x = 1;
				k.up.y = 0;
				k.up.z = 0;
			}
		}
		if(c<0){
			k.up.x = 0;
			k.up.y = -1;
			k.up.z = 0;
		}
	})
}

var beforeX=0;
var beforeY=0;
var beforeZ=0;
var sidVal = 0;//输入框暂存，若输入框未修改则一直用这个变量数据
function ta() {
	//还原模型角度
    $("#reset").on("click", function() {
		backBegin();//初始化滑块、输入框、模型等
        "undefined" !== typeof G[J].rotation && (G[J].rotation.x =0, G[J].rotation.y = 0, G[J].rotation.z = 0)
    });
	//滑块
	if(G[J]!=undefined) {
		$(function () {
			$("#sliderX").slider({
				range: "max",
				min: -180,
				max: 180,
				value: 0,
				slide: function (event, ui) {
					$("#amountX").val(ui.value);
					removalOfSliderInterval(ui.value,"X");
				}

			});
			$("#amountX").val($("#sliderX").slider("value"));

			$("#sliderY").slider({
				range: "max",
				min: -180,
				max: 180,
				value: 0,
				slide: function (event, ui) {
					$("#amountY").val(ui.value);
					removalOfSliderInterval(ui.value,"Y");
				}
			});
			$("#amountY").val($("#sliderY").slider("value"));

			$("#sliderZ").slider({
				range: "max",
				min: -180,
				max: 180,
				value: 0,
				slide: function (event, ui) {
					$("#amountZ").val(ui.value);
					removalOfSliderInterval(ui.value,"Z");
				}
			});
			$("#amountZ").val($("#sliderZ").slider("value"));
		});

	}
	/*
	//输入框
	$(".slider_input").focus(function(event){
		sidVal = $("#"+event.target.id)[0].value;//获取到现有的值
		$("#"+event.target.id).val("");//清空现有的值
	});
	$('.slider_input').blur(function(event) {
		var amt = $("#"+event.target.id);//获取到有焦点输入框的dom
		var axis = event.target.id.charAt(event.target.id.length - 1);//哪个坐标轴
		if(axis!="V"){//XYZ轴
			var sid = $( "#slider"+axis);//获取到有焦点滑块的dom
			var amtValue = amt[0].value;//获取到有焦点输入框的值
			var change_num = changeNum(sid,amt,amtValue,sidVal,axis);//改变数据，改变滑块，旋转模型
			console.log(G_max_z)
			console.log("J",J)
			console.log("G_max_z[J]",G_max_z[J])
			revolving_box(axis.toLowerCase(),change_num);//toLowerCase():将XYZ转换为xyz
			console.log("J",J)
			console.log("G_max_z[J]",G_max_z[J])
			rote_info[J]=[beforeX,beforeY,beforeZ];//保存模型旋转信息
		}else{//体积

		}

	});
	////角度+-1
	*/
}


/*
*函数作用：自动下降模型
* rote_info、box_rote_info、rote_info、boxes、G_max_z为全局变量：模型旋转信息、模型单次旋转数据、模型盒子顶点坐标、旋转点到底面的距离。
* 入参：旋转的坐标轴、是否改变了数据（是否进行了旋转）
 */
function revolving_box(axis,change_num){
	if(change_num){//是否更新了数据（是否进行了旋转）
		box_rote_info[J] = new THREE.Vector3(beforeX-rote_info[J][0],beforeY-rote_info[J][1],beforeZ-rote_info[J][2]);
	}else{
		box_rote_info[J] = new THREE.Vector3(0,0,0);
	}

	var axises = ["x","y","z"];//坐标轴名称//boxes顶点点名称（默认a为正b为负）

	for (var box_num =0 ; box_num<boxes_name.length;box_num+=1) {//遍历所有坐标点
		var dict=0;
		var other_axis = new Array;

		for (var num = 0; num < axises.length; num += 1) {
			if (axises[num] != axis) {
				dict += Math.pow(boxes[J][boxes_name[box_num]][axises[num]], 2);//求非旋转轴坐标的其余两轴坐标平方和
				other_axis.push(axises[num]);
			}
		}
		dict = Math.sqrt(dict);//获得点到旋转中心的距离

		if(axis=='y'){//如果旋转y轴，将y轴面向屏幕外方向，则x,z的关系相反，
			other_axis=["z","x"]
		}

		var first = boxes[J][boxes_name[box_num]][other_axis[0]];
		var second = boxes[J][boxes_name[box_num]][other_axis[1]];

		var atan_num = second / first;//正切值
		if (isNaN(atan_num)) {
			atan_num = 999999999;//正切值由NaN设为一个较大的数
		}
		var rot = Math.atan(atan_num);//旋转前点到圆心与other_axis[0]轴角度，0~PI/2

		if ((first< 0 && second > 0)|| (first < 0 && second < 0)) {//第二、三象限的角度+π为真实rot角度
			rot = Math.PI + rot;
		}
		var new_rot = rot + box_rote_info[J][axis] * Math.PI / 180;//求得新角度（原始角度+旋转角度）
		boxes[J][boxes_name[box_num]][other_axis[0]] = dict * Math.cos(new_rot);//根据新角度 更新boxes中的点数据
		boxes[J][boxes_name[box_num]][other_axis[1]] = dict * Math.sin(new_rot);//根据新角度 更新boxes中的点数据
	}

	var  min_z = G_max_z[J];//用于寻找box八个角最小的z
	console.log(J)
	console.log(boxes);
	for(var i=0;i<boxes_name.length;i+=1 ){
		min_z = Math.min(boxes[J][boxes_name[i]].z,min_z);//寻找box八个角最小的z
	}

	G[J].position.z+=Math.abs(min_z)-G_max_z[J];//上升或下降模型(包括旋转中心)
	G_max_z[J] = Math.abs(min_z)//旋转中心到底面的距离
	for(var i=0;i<boxes_name.length;i+=1 ){
		boxes[J][boxes_name[i]].z+=Math.abs(min_z)-G_max_z[J];//改变boxes中z的大小(上调或下降boxes中的z)
	}

}

//改变滑块、输入框数字、模型角度
function changeNum(sid,amt,amtValue,sidVal,axis){
	//判断数据输入是否规范
	if (amtValue >= 180) {
		amt.val(180);
		sidVal=180;
	} else if (amtValue <= -180) {
		amt.val(-180);
		sidVal=-180;
	}else if (amtValue > -180 && amtValue < 180){
		amt.val(amtValue);
	}else if (amt.val()=="") {
		amt.val(sidVal);
	}else{
		amt.val(sidVal);
	};
	//判断点击后是否修改了数据，若没修改，则使用之前的数据
	if (amt.val()!="") {
		sid.slider({
			value: amt.val()
		});
		var change_num=true;
	}else{
		amt.val(sidVal);
		sid.slider({
			value: sidVal
		});
		var change_num=false;
	};
	if(amtValue!='' && sidVal!='') {
		var objectAxis;
		var nowSidVal = sid.slider("value");
		if (axis == "X") {
			objectAxis = new THREE.Vector3(1, 0, 0);
			nowSidVal -= beforeX;
			beforeX = nowSidVal+beforeX;
		} else if (axis == "Y") {
			objectAxis = new THREE.Vector3(0, 1, 0);
			nowSidVal -= beforeY;
			beforeY = nowSidVal+beforeY;
		} else {
			objectAxis = new THREE.Vector3(0, 0, 1);
			nowSidVal -= beforeZ;
			beforeZ = nowSidVal+beforeZ;
		}
		var angle = Math.PI / 180;
		if (nowSidVal < 0) {
			for (nowSidVal; nowSidVal < 0; nowSidVal++) {
				rotateAroundWorldAxis(G[J], objectAxis, -angle);
			}
		} else {
			for (nowSidVal; nowSidVal > 0; nowSidVal--) {
				rotateAroundWorldAxis(G[J], objectAxis, angle);
			}
		}
	}
	return change_num;
}

//去除滑块间隔
function removalOfSliderInterval(uiValue,axis){
	var threeVector3;
	var diff;
	if(axis == "X"){
		diff = uiValue-beforeX;
		beforeX=uiValue;
		threeVector3 = new THREE.Vector3(1,0,0)
	}else if(axis == "Y"){
		diff = uiValue-beforeY;
		beforeY=uiValue;
		threeVector3 = new THREE.Vector3(0,1,0)
	}else{
		diff = uiValue-beforeZ;
		beforeZ=uiValue;
		threeVector3 = new THREE.Vector3(0,0,1)
	}
	if(diff>0){
		for(diff;diff>0;diff--){
			rotateAroundWorldAxis(G[J],threeVector3,Math.PI/180);
		}
	}else{
		for(diff;diff<0;diff++){
			rotateAroundWorldAxis(G[J],threeVector3,-Math.PI/180);
		}
	}
	revolving_box(axis.toLowerCase(),true);//toLowerCase():将XYZ转为xyz
	rote_info[J]=[beforeX,beforeY,beforeZ];
}

var rotWorldMatrix;
function rotateAroundWorldAxis(object, axis, radians) {
	rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(object.matrix);                // pre-multiply
	object.matrix = rotWorldMatrix;
	object.rotation.setFromRotationMatrix(object.matrix);
}

//初始化滑块、输入框、模型等
function backBegin(){
	beforeX=0;
	beforeY=0;
	beforeZ=0;
	sidVal = 0;//输入框暂存，若输入框未修改则一直用这个变量数据
	$(".slider_input").val(0);
	$("#sliderX,#sliderY,#sliderZ").slider({
		value: 0
	});

	rote_info[J]=[0,0,0];//初始化旋转信息
	box_rote_info[J]=new THREE.Vector3(0,0,0);//初始化单次旋转数据信息
	model_box = new Object;
	var max_x = G[J].geometry.boundingBox.max.x;
	var min_x = G[J].geometry.boundingBox.min.x;
	var max_y = G[J].geometry.boundingBox.max.y;
	var min_y = G[J].geometry.boundingBox.min.y;
	var max_z = G[J].geometry.boundingBox.max.z;
	var min_z = G[J].geometry.boundingBox.min.z;
	model_box.aaa = new THREE.Vector3(max_x,max_y,max_z);
	model_box.bbb = new THREE.Vector3(min_x,min_y,min_z);
	model_box.aab = new THREE.Vector3(max_x,max_y,min_z);
	model_box.aba = new THREE.Vector3(max_x,min_y,max_z);
	model_box.baa = new THREE.Vector3(min_x,max_y,max_z);
	model_box.abb = new THREE.Vector3(max_x,min_y,min_z);
	model_box.bab = new THREE.Vector3(min_x,max_y,min_z);
	model_box.bba = new THREE.Vector3(min_x,min_y,max_z);
	boxes[J]=(model_box);//初始化存放模型定点的box
	G_max_z[J]=max_z;//初始化旋转中心到底面的距离初始化为模型二分之一高度
	G[J].position.z = max_z;
}

$(function() {
	Q = {};
	$(document).on("change keyup", "#resize input", function() {
		var a = $(this);
		if($("#resize_ratio").is(":checked")) {
			var b = $("#resize_width").val();
			"resize_height" === a.attr("id") ? b = a.val() * Q.a : "resize_length" === a.attr("id") && (b = a.val() * Q.c);
			"resize_width" !== a.attr("id") && $("#resize_width").val(b.toString());
			"resize_height" !== a.attr("id") && $("#resize_height").val((b / Q.a).toString());
			"resize_length" !== a.attr("id") && $("#resize_length").val((b / Q.c).toString())
		}
	});
	$(document).on("click", "#resize_button",
		function() {
			var a;
			a: {
				a = U;
				for(var b = 0; b < H.length; b++)
					if(a === H[b]) {
						a = b;
						break a
					}
				a = -1
			}

			b = Wa(a);

			G[a].geometry.scale(($("#resize_width").val() / b.width).toString(), $("#resize_height").val() / b.height, $("#resize_length").val() / b.length);
			b = O;
			"plate" == F && (b = 0);
			G[a].position.set(G[a].position.x, G[a].position.y, b - G[a].geometry.boundingBox.min.z)
		})
});

function Wa(a) {
	return {
		width: G[a].geometry.boundingBox.max.x - G[a].geometry.boundingBox.min.x,
		height: G[a].geometry.boundingBox.max.y - G[a].geometry.boundingBox.min.y,
		length: G[a].geometry.boundingBox.max.z - G[a].geometry.boundingBox.min.z
	}
}

function Xa(a, b) {
	var c = Math.floor(b * t + a);
	return v.length < c ? 2 : v[c]
}

function Ya() {
	v = new Uint8Array(Math.ceil(t * u));
	A = parseInt($("#gap").val(), 10) / 2;
	0 < A || (A = 0);
	for(var a = [], b = 0; b < H.length; b++) {
		var c = Wa(b);
		a.push([c.width * c.height, b])
	}
	a.sort(function(a, b) {
		return b[0] - a[0]
	});
	a.forEach(function(a) {
		var b, c;
		a = a[1];
		b = Wa(a);
		a: {
			for(c = 0; c < t; c++)
				for(var d = 0; d < u; d++) {
					var l;
					if(l = !(0 < Xa(c, d))) b: {
						for(l = c; l < c + (b.width + A); l++)
							for(var w = d; w < d + (b.height + A); w++)
								if(0 < Xa(l, w)) {
									l = !1;
									break b
								}
						l = !0
					}
					if(l) {
						b = c;
						c = d;
						break a
					}
				}
			c = b = 0
		}
		d = b;
		b = c;
		c = Wa(a);
		l = c.width + A;
		for(var w = c.height + A, R = d; R <= d + l; R++)
			for(var L =
					b; L <= b + w; L++) v[Math.floor(L * t + R)] = 1;
		res = {
			x: d - t / 2,
			y: b - u / 2
		};
		G[a].position.set(res.x + c.width / 2, res.y + c.height / 2, G[a].position.z)
	})
}

function Ca() {
	v = new Uint8Array(Math.ceil(t * u));
	v = new Uint8Array(Math.ceil(t * u));
	$("#pack_btn").on("click", function() {
		Ya()
	})
}

function la() {
	"" === Z("dst") && ($("#save").hide(), $("#exit").hide());
	$("body").delegate("#export", "click", function(a) {
		a.preventDefault();
		saveAs(Za(), "export.stl")
	}).delegate("#save", "click", function(a) {
		$("#save").hide();
		a.preventDefault();
		var b = Z("dst");
		$.ajax({
			url: b,
			type: "POST",
			contentType: "application/octet-stream",
			data: Za(),
			processData: !1,
		}).done(function() {
//	$("#save").show();
			var fileName = ''; 
			if(decodeURI(getUrlParam('src'))!='null'){
				id = decodeURI(getUrlParam('src')).split('/')[3]
				sub = isHasElementOne(JSON.parse(localStorage.plates_id),id)
				fileName = JSON.parse(localStorage.plates_name)[sub]
			}
			if(fileName!=''){
				fileName += '+'
			}
			for (var key in model_names) {
				fileName += model_names[key]+'+';
         	}
			fileName=fileName.substr(0,fileName.length-1);
			var obj = document.getElementsByTagName("input");
			for(var i=0; i<obj.length; i ++){
				if(obj[i].checked){
					value = obj[i].value;
				}
			}
			window.location = encodeURI(encodeURI(b+'?filename='+fileName+'&value='+value));
//  	$.ajax({
//  	type:"post",
//  	url:"/plate/add-usb",
//  	async:false,
//  	data:{USBFile:file,Path:fileName,ProfileID:1,AutoCenter:0,LowQualityLayerNumber:00,ImageRotate:0},
//  	});
		})
	}).delegate("#exit", "click", function(a) {
		a.preventDefault();
		a = Z("exit");
		"" === a && (a = Z("dst"));
		window.location = a
	})
}

function Za() {
	$a();
	h.remove(P);
	var a = (new THREE.STLBinaryExporter).parse(h),
		a = new Blob([a], {
			type: "binary/stl"
		});
	ya();
	Ta();
	return a
}
var Y = "";

function W() {
	Y = "";
	$("body").css("cursor", "auto")
}

function Na(a, b, c) {
	var d = new THREE.Vector3(0, 0, 1);
	a = new THREE.Vector3(a, b, 0);
	p.set(a.clone(), d);
	d = p.intersectObjects(G);
	//c=d[1].point.z;
	for(a =0; d.length - 1 >=a; a++) d[a].point.z < c && (c = d[a].point.z);//
	return c
}
//a = e;
//d = 2 * b.z;
//d = Na(b.x, b.y, d);
////d = Na(b.x - a.body_dia / 2, b.y - a.body_dia / 2, d);
////d = Na(b.x + a.body_dia / 2, b.y + a.body_dia / 2, d);
////d = Na(b.x + a.body_dia / 2, b.y - a.body_dia / 2, d);
////d = Na(b.x - a.body_dia / 2, b.y + a.body_dia / 2, d);
//b.z = b.z != d ? d : b.z;
//$("#id").click(function(){
//	$("id").width(200);
//});
function Oa(a, b) {
	a.rotation.set(90 * Math.PI / 180, 0, 0);
	a.name = b;
	h.add(a);
	K.push(a);
	M.push(b);
}

function Ja() {
	if(K.length) {
		$a();
		h.remove(P);
		var a = (new THREE.STLBinaryExporter).parse(h);
		ya();
		h.remove(G[J]);
		G.splice(J, 1);
		H.splice(J, 1);
		ab(a.buffer)
	}
}

function Ka() {
	$.each(K, function(a, b) {
		h.remove(b)
	});
	K = [];
	M = [];
	T = [];
	V()
}

function del_support(){
	if($(":focus").is("input")) return;
	U ? Ma(U) : 0 < M.length && Ma(M[M.length - 1]);
	W()
}

function oa() {
	$(document).keyup(function(a) {
		if(46 == a.keyCode) {
			if($(":focus").is("input")) return;
			U ? Ma(U) : 0 < M.length && Ma(M[M.length - 1]);
			W()
		}
		27 == a.keyCode && W()
	});
	$("#unify_base").on("click", function() {
		var a, b, c, d, e, f, g;
		Ma("unified_base");
		if(K.length) {
			for(var l = 0; l < K.length; l++) g = (new THREE.Box3).setFromObject(K[l]), l || (a = g.min.x, b = g.max.x, c = g.min.y, d = g.max.y, e = g.min.z, f = g.max.z), e > g.min.z && (e = g.min.z), f > g.max.z && (f = g.max.z), a > g.min.x && (a = g.min.x), b < g.max.x && (b = g.max.x), c > g.min.y && (c = g.min.y), d < g.max.y &&
				(d = g.max.y);
			g = new THREE.BoxBufferGeometry(b - a, d - c, f - e);
			l = new THREE.MeshLambertMaterial({
				color: 6711039
			});
			g = new THREE.Mesh(g, l);
			g.position.set((b + a) / 2, (d + c) / 2, (f + e) / 2);
			g.name = "unified_base";
			h.add(g);
			K.push(g);
			M.push("unified_base");
			V()
		}
	})
}

function Ma(a) {
	for(var b = M.length - 1; 0 <= b; b--) a == M[b] && (h.remove(K[b]), K.splice(b, 1), M.splice(b, 1));
	for(b = T.length - 1; 0 <= b; b--) a == T[b].key && T.splice(b, 1);
	V()
}

function Ga(a) {
	Ia();
	U = a;
	for(var b = 0; b < M.length; b++) a == M[b] && K[b].material.color.setHex(16737894)
}

function Ia() {
	for(var a = 0; a < M.length; a++) U == M[a] && K[a].material.color.setHex(6711039);
	U = ""
}

function xa() {
	var a = Z("width"),
		b = Z("height");
	a || (a = 500);
	b || (b = 500);
	t = a;
	u = b;
	var c = new THREE.PlaneGeometry(a, b, 10, 10),//创建平面模型对象
		d = [];
	d.push(new THREE.MeshBasicMaterial({
		color: 6710886,
		transparent: !0,
		opacity: .1
	}));
	d.push(new THREE.MeshBasicMaterial({
		color: 0,
		transparent: !0,
		opacity: .1
	}));
	for(var e = c.faces.length / 2, f = 0; f < e; f++) j = 2 * f, c.faces[j].materialIndex = (f + Math.floor(f / 10)) % 2, c.faces[j + 1].materialIndex = (f + Math.floor(f / 10)) % 2;
	q = new THREE.Mesh(c, new THREE.MultiMaterial(d));//创建网格模型对象
	r = new THREE.GridHelper(a / 2, a, 6316128, 6316128);
	r.geometry.rotateX(Math.PI / 2);
	r.position.z = -.2;
	da = new THREE.GridHelper(a / 2, a / 10, 9474192, 9474192);
	da.geometry.rotateX(Math.PI / 2);
	da.position.z = -.1;
	c = new THREE.Geometry;
	d = new THREE.LineBasicMaterial({
		color: 0
	});
	c.vertices.push(new THREE.Vector3(0 - a / 2, 0 - b / 2, 0));
	c.vertices.push(new THREE.Vector3(0 - a / 2, 0 + b / 2, 0));
	c.vertices.push(new THREE.Vector3(0 + a / 2, 0 + b / 2, 0));
	c.vertices.push(new THREE.Vector3(0 + a / 2, 0 - b / 2, 0));
	c.vertices.push(new THREE.Vector3(0 - a / 2, 0 - b / 2, 0));
	ea = new THREE.Line(c, d);
	$(document).on("click",
		"#toggle_grid", bb)
}

function ya() {
	h.add(q);
	h.add(ea)
}

function $a() {
	h.remove(ea);
	h.remove(q);
	cb()
}

function bb() {
	if(ga) return h.add(q), cb();
	h.remove(q);
	h.add(r);
	h.add(da);
	ga = !0
}

function cb() {
	h.remove(r);
	h.remove(da);
	ga = !1
}


///*检测碰撞--射线版*/
//function automatic_alignment(){
//	var movingCube =h.children[6];
//	var originPoint = movingCube.position.clone();
//	var vertices_length = movingCube.geometry.vertices.length
//	var maxdic = 0;
//	for (var vertexIndex = 0; vertexIndex < vertices_length; vertexIndex++) {
//		// 顶点原始坐标
//		var localVertex = movingCube.geometry.vertices[vertexIndex].clone();
//		//console.log(localVertex.x);
//		// 顶点经过变换后的坐标
//		var globalVertex = localVertex.applyMatrix4(movingCube.matrix);
//		//console.log(globalVertex.x)
//		// 获得由中心指向顶点的向量
//		var directionVector = globalVertex.sub(movingCube.position);
//		// 将方向向量初始化
//		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
//		//console.log(ray)
//		// 检测射线与多个物体的相交情况
//		var collisionResults = ray.intersectObject(G[J]);
//		// 如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生了碰撞
//		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
//
//		}else{
//			var crash = false;   // crash 是一个标记变量
//			//break
//		}
//	}
//	G[J].position.z+=maxdic;
//}

//保存模型旋转信息：
var rote_info = new Array;//保存每个模型旋转信息
var box_rote_info = new Array;
//检测点击模型，移动
function Pa(a) {
	if(G.length) {
		var b = new THREE.Vector2;
		x = a.clientX-$("#view_3d").offset().left;
		y = a.clientY-$("#view_3d").offset().top;
		b.x = x / $("#view_3d").width() * 2 - 1;
		b.y = 2 * -(y / $("#view_3d").height()) + 1;
		if(a.which == 1 || a.button==2){
			p.setFromCamera(b, k);
			var min_distance = 9999;//最大为1400多点，设为9999目的是大于上限值,若9999经过循环后没有变化则点击到空地（没有选中任何一个模型）
			for(var model_num=0;model_num< G.length;model_num++){
				//选取模型，根据最近距离，所点击的最近的即为所选
				G[model_num].material = new THREE.MeshLambertMaterial({
					color: 0xe8e8e8
				});//首先重新初始化模型颜色
				var points = p.intersectObjects([G[model_num]]);
				if(points.length > 0){//如果射线与模型交点数量大于0，说明点击到了模型，修改下面参数，从而实现模型的改变。
					if (points[0]["distance"]<min_distance){//distance最小的为最外层的;
						min_distance = points[0]["distance"];
						ha = !0;
						J=model_num;
					}
				}
			}
			if(min_distance!=9999){//不为999则点击到模型
				if(a.button==2) {
					if (flage == 1) {
						step1_model_menu();
					} else if (flage == 2) {
						step2_model_menu();
					}
				}
				//$(".rotates").show();
				G[J].material = new THREE.MeshLambertMaterial({
					color: 1534741
				});//点击模型后变为绿色
				restore_rotation_info()//恢复模型旋转信息
				change_rotates_position(a)//改变 旋转模型框 的位置
			}else{//如果为9999则点击到空地
				//if(a.button==2){
				//	if(flage==1){
				//		step1_set_up_menu("手动排布");
				//	}else if(flage==2){
				//		step2_set_up_menu();
				//	}
				//	console.log(flage)
				//}
				$(".rotates").hide();
				J=-1;
			}
		}
	}
}

//右键复制模型,利用模型原型文件数据
function copy_model(){
	var copy_model = G[J].clone();
	copy_model.material = new THREE.MeshLambertMaterial({
		color: 6534741
	});
	var copy_key = (new Date).getTime();
	copy_model.name = copy_key;
	copy_model.position.set(copy_model.position.x + 10, copy_model.position.y, copy_model.position.z);
	h.add(copy_model);
	G.push(copy_model);
	H.push(copy_key);
	rote_info.push(rote_info[J]);
	var new_box = new Object();
	for(var i=0; i<boxes_name.length;i++){
		new_box[boxes_name[i]] = boxes[J][boxes_name[i]].clone();
	}

	boxes.push(new_box);
	console.log(boxes)
	G_max_z.push(G_max_z[J]);
	box_rote_info.push=new THREE.Vector3(0,0,0);
	V();
}

//删除模型(非支撑)
window.onkeydown=function() {
	if (46 == event.keyCode && J!=-1) {
			del_model();
		}
	}
function del_model(){
		h.remove(G[J]);
		object_file.splice(J,1);
		G_max_z.splice(J,1);
		H.splice(J,1);
		rote_info.splice(J,1);
		boxes.splice(J,1);
		G.splice(J, 1);
		J = G.length - 1;
		if(J>=0){
			restore_rotation_info();//恢复模型旋转信息
			G[J].material = new THREE.MeshLambertMaterial({
				color: 1534741
			});
		}else{
			$("#rotates").hide();
		}
	}
//}
//恢复模型旋转信息
function restore_rotation_info (){
	if(rote_info[J]!=null){
		$("#sliderX").slider({
			value: rote_info[J][0]
		})
		$("#sliderY").slider({
			value: rote_info[J][1]
		})
		$("#sliderZ").slider({
			value: rote_info[J][2]
		})
		$("#amountX").val(rote_info[J][0]);
		$("#amountY").val(rote_info[J][1]);
		$("#amountZ").val(rote_info[J][2]);
		beforeX=rote_info[J][0];
		beforeY=rote_info[J][1];
		beforeZ=rote_info[J][2];
	}else{
		$("#sliderX").slider({
			value: 0
		})
		$("#sliderY").slider({
			value: 0
		})
		$("#sliderZ").slider({
			value: 0
		})
		$("#amountX").val(0);
		$("#amountY").val(0);
		$("#amountZ").val(0);
		rote_info[J]=[0,0,0]
		box_rote_info[J] = new THREE.Vector3(0,0,0);
	}
}

function Aa() {
	$(m.domElement).on("mousemove", function(a) {
	//	if(a.ctrlKey && "support" !== F ) C.enabled = !1, db(), C.enabled = !0;
		//else

		if("layout" === F ) {
			n.enabled = !1;
			if(ha && 0 < G.length) {
				change_rotates_position(a);//改变 旋转模型框 的位置
				G[J].position.x=($("#view_3d").width()/2-a.offsetX)*Math.abs(k.position.z/1400);
				G[J].position.y=($("#view_3d").height()/2-a.offsetY)*-Math.abs(k.position.z/1400);
			}

			//ia = {
			//	x: a.offsetX,
			//	y: a.offsetY
			//}
		}
		if("Z_rot" === F){//相机绕z轴旋转
			if(ha){
				n.enabled = !1;
				var move_dic = Z_rot_end_x + (a.offsetX - Z_rot_begin_x);
				Z_rot(move_dic);//旋转相机
			}
		}
		if("cant_move_model" === F){//相机绕z轴旋转
			n.enabled = !1;
		}
	});
	$("#rotate_btn").on("click", function() {
		db()
	});
	$(m.domElement).on("mouseup", function(a) {
		if("layout" == F|| "Z_rot" == F ||a.ctrlKey) ha = !1, n.enabled = !0,Z_rot_end_x += (a.offsetX - Z_rot_begin_x);//阻止相机运动并记录松开点的坐标
	})
}
//旋转围绕z轴模型
function Z_rot(x) {
	k.up.z=-1;//将z周看为相机上方向
	k.up.x=0;
	k.up.y=0;

	//(k.position.z-100)/2.2775是由实验得出，因为模型区域的降低，导致了缩放时候 z和x、y的倍数 与 实际z和x、y的倍数 存在差距，若整个区域改变，则需要改变倍数；2*k.position.z是因为初始y、x/z=2
	k.position.y = Math.cos( x*0.01 ) * ((k.position.z-100)/2.2775 + 2*k.position.z);
	k.position.x = Math.sin( x*0.01 ) * ((k.position.z-100)/2.2775 + 2*k.position.z);

	k.lookAt( new THREE.Vector3(0,0,18));//第三个数是18，因为降低了模型，并且z=-1模型向上，所以相机从0，0，0看向0，0，18
}
//改变 旋转模型框 的位置
function change_rotates_position(a){
	coordinate_x = a.clientX - $("#view_3d").offset().left;
	coordinate_y = a.clientY - $("#view_3d").offset().top;
	quadrant_x = coordinate_x / $("#view_3d").width() * 2 - 1;
	quadrant_y = 2 * -(coordinate_y / $("#view_3d").height()) + 1;
	//console.log(quadrant_x)
	//console.log(quadrant_y)
	if(quadrant_x<0&&quadrant_y>0){
		$("#rotates").addClass("rotates-change")
	}else if(quadrant_x<0&&quadrant_y<0){
		$("#rotates").removeClass("rotates-change")
	}else{
		$("#rotates").removeClass("rotates-change")
	}
}

function db() {
	"undefined" !== typeof G[J].rotation && (G[J].rotation.order = "YXZ", G[J].rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 60))
}

function Ha(a) {
	U = a;
	for(var b = 0; b < H.length; b++) a == H[b]&& (J = b);
	//if(save_J!=-1){//恢复J,恢复为之前选中的J
	//	J=save_J;
	//}else{
	//	J= G.length-1;
	//}
	b = Wa(J);
	$("#resize_width").val(b.width);
	$("#resize_height").val(b.height);
	$("#resize_length").val(b.length);
	Q.a = $("#resize_width").val() / $("#resize_height").val();
	Q.c = $("#resize_width").val() / $("#resize_length").val();
	"plate" === F && (Qa(), U = a, G[J].material.color.setHex(16737894))
}

function Qa() {
	for(var a = 0; a < H.length; a++) G[a].material.color.setHex(6534741);
	U = ""
}

function Ua() {
	C = new THREE.DragControls(G, k, m.domElement);
	C.addEventListener("dragstart", function() {
		n.enabled = !1
	});
	C.addEventListener("dragend", function() {
		n.enabled = !0
	})
}

function V() {
	var a = 0,
		b = 0;
	$("#items").html("");
	$.each(G, function(b) {
		a++;
		$("#items").append('<div class="item" data-type="model" data-key="' + H[parseInt(b, 10)] + '"><a href="#" class="remove">X</a> <a href="#" class="model">Model ' + a + '</a> <a href="#" class="copy">C</a></div>')
	});
	b = a = 0;
	$.each(K, function(c) {
		M[parseInt(c, 10)] != b && (a++, $("#items").append('<div class="item" data-type="support" data-key="' + M[parseInt(c, 10)] + '"><a href="#" class="remove del_supports">X</a> <a href="#" class="toggle">D</a> Support ' + a + '</div>'));
		b = M[parseInt(c, 10)]
	})
}

function Va() {
	La();
	$.each(G, function(a, b) {
		h.add(b)
	});
	J = G.length - 1
}

function La() {
	ha = !1;
	h.remove(P);
	//$.each(G, function(a, b) {
	//	h.remove(b)
	//})
}

function pa() {
	$(document).on("click", "#support_types a", function(a) {
		a.preventDefault();
		eb($(this).data("key"))
		$('#add_support').css('background-color','#bfbfbf')
	}).on("click", "#new_support", function() {
		eb(-1)
		$('#add_support').css('background-color','#e0e0e0')
	}).on("click", "#support_close", function(a) {
		a.preventDefault();
		$("#support_add_box").fadeOut()
	}).on("click", "#support_types tr", function() {
		$("#support_types tr").removeClass("selected");
		$("#support_types tr").removeClass("selected_button");
		$(this).addClass("selected");
		$(this).addClass("selected_button");
		if(typeof(Storage)!=="undefined") {
			localStorage.supportTypesId = $(this)[0].id;
		}
		W()
	}).on("change keyup", "#support_add", function() {
		fb("support_preview", gb($("#support_add")))
	}).on("submit", "#support_add", function(a) {
		a.preventDefault();
		a = $(this).find("input[type=submit]:focus").val();
		"添加" === a && hb(this);
		"去除" === a && ib();
		"保存" === a && (ib(), hb(this));
		Sa();
		W();
		$("#support_add_box").fadeOut()
	})
}

function eb(a) {
	$("#support_add_box").fadeIn().data("key", a); - 1 !== a ? ($(".only_new").show(), $.each(N[a], function(a, c) {
		$("*[name=" + a + "]").val(c)
	})) : $(".only_new").hide();
	fb("support_preview", gb($("#support_add")))
}

function ib() {
	var a = $("#support_add_box").data("key");
	N.splice(a, 1);
	localStorage.setItem("support_types", JSON.stringify(N))
}

function fb(a, b) {
	var c = document.getElementById(a),
		d = c.getContext("2d");
	d.strokeStyle = "#ea8521";
	d.fillStyle = "#ea8521";
	d.clearRect(0, 0, c.width, c.height);
	if(0 == b.type) {
		var e;
		e = b.head_dia;
		var f = b.body_dia;
		e = e > f ? e : f;
		f = b.base_dia;
		e = e > f ? e : f;
		f = 10 + b.head_len + b.base_len;
		c = c.width / f < c.height / e ? c.width / f : c.height / e;
		f = (e - b.base_dia) / 2;
		d.fillRect(0, f * c, b.base_len * c, b.base_dia * c);
		var g = b.base_len,
			f = (e - b.body_dia) / 2;
		d.fillRect(g * c, f * c, 10 * c, b.body_dia * c);
		g += 10;
		0 === b.head_type && (d.beginPath(), d.moveTo(g * c, (f + b.body_dia) *
			c), d.lineTo(g * c, f * c), f = (e - b.head_dia) / 2, d.lineTo((g + b.head_len) * c, f * c), d.lineTo((g + b.head_len) * c, (f + b.head_dia) * c), d.closePath(), d.fill(), g = g + b.head_len - b.penetration);
		1 === b.head_type && (f = e / 2, d.beginPath(), d.arc((g + b.head_len / 2) * c, f * c, b.head_dia / 2 * c, 0, 2 * Math.PI), d.stroke(), d.fill(), g = g + b.head_len / 2 - b.penetration);
		d.fillStyle = "#000000";
		d.strokeStyle = "#000000";
		d.beginPath();
		d.moveTo(g * c, 0);
		d.lineTo(g * c, e * c);
		d.stroke()
	}
}

function hb(a) {
	a = gb(a);
	N.push(a);
	localStorage.setItem("support_types", JSON.stringify(N));
	Sa();
	W()
}

function gb(a) {
	var b = {};
	$.each($(a).serializeArray(), function() {
		b[this.name] = "name" == this.name ? this.value : parseFloat(this.value)
	});
	return b
}

function Sa() {
	var a = "",
		b = "",
		c = {};
	N = JSON.parse(localStorage.getItem("support_types"));
	for(var d = 0; d < N.length; d++) {
		var e = N[d];
		N.length == d + 1 && (b = "selected");
		//带编辑支撑
		//if((d+1)%2 ==0){
		//	0 == e.type ? (a += '<tr data-key="' + d + '" id="select_support_'+d+'" class="' + b + ' step2_button gray selected_button"><td class="td_name">' + e.name + '<td class="td_canvas"><canvas id="c' + d + '" width="100%" height="20"></canvas><td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>', c[d] = ["c" + d, e]) : a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + "<td>" + e.body_dia + " / " + e.penetration + '<td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>'
		//}
		//else{
		//	0 == e.type ? (a += '<tr data-key="' + d + '" id="select_support_'+d+'" class="' + b + ' step2_button gray"><td class="td_name">' + e.name + '<td class="td_canvas"><canvas id="c' + d + '" width="100%" height="20"></canvas><td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>', c[d] = ["c" + d, e]) : a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + "<td>" + e.body_dia + " / " + e.penetration + '<td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>'
		//}
		if((d+1)%2 ==0){
			0 == e.type ? (a += '<tr data-key="' + d + '" id="select_support_'+d+'" class="' + b + ' step2_button gray selected_button"><td class="td_name">' + e.name + '<td class="td_canvas"><canvas id="c' + d + '" width="100%" height="20"></canvas><td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>', c[d] = ["c" + d, e]) : a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + "<td>" + e.body_dia + " / " + e.penetration + '<td class="td_a"><a href="#" data-key="' + d + '">编辑</a></tr>'
		}
		else{
			0 == e.type ? (a += '<tr data-key="' + d + '" id="select_support_'+d+'" class="' + b + ' step2_button gray"><td class="td_name">' + e.name + '<td class="td_canvas"><canvas id="c' + d + '" width="100%" height="20"></canvas><td class="td_a"></tr>', c[d] = ["c" + d, e]) : a += '<tr data-key="' + d + '" class="' + b + '"><td>' + e.name + "<td>" + e.body_dia + " / " + e.penetration + '<td class="td_a"></tr>'
		}

	}
	$("#support_types").html("<table class='support_type'>" +
		a + "</table>");
	$.each(c, function(a, b) {
		fb(b[0], b[1])
	})
}

function na() {
	$(".toggle_master").each(function() {
		jb($(this))
	});
	$("html").delegate(".toggle_master", "change", function() {
		jb($(this))
	})
}

function jb(a) {
	var b = a.attr("name"),
		c = a.val();
	a.find("option").each(function() {
		var a = "." + b + "_" + $(this).val();
		$(this).val() == c ? $(a).show() : $(a).hide()
	})
}

function ra() {
	O = localStorage.getItem("model_height");
	$("#start_height").val(O);
	$("#helpModal").modal({
		show: !1
	});
	$("#model_elevate").on("click", function() {
		O = $("#start_height").val();
		localStorage.setItem("model_height", O);
		var a = (new THREE.Box3).setFromObject(G[J]);
		G[J].position.set(0, 0, O - a.min.sub(G[J].position).z)
	});
	$(".guide").on("click", function() {
		$("#helpModal").modal("show")
	})
}

function ma() {
	$("#reset").on("click", function() {
		kb()
	});
	localStorage.getItem("model_height") || kb()
}

//支撑样式
function kb() {
	localStorage.setItem("model_height", 5);
	//head_len 前段长度，penetration 前段浸入模型长度，head_dia 前段直径，body_dia 中段直径，base_len 底座厚度，base_dia 底座直径
	localStorage.setItem("support_types", '[{"name":"样式1","type":0,"head_len":1,"penetration":0.3,"head_type":0,"head_dia":0.1,"body_dia":0.3,"base_len":0.2,"base_dia":0.3},{"name":"样式2","type":0,"head_len":1,"penetration":0.3,"head_type":0,"head_dia":0.1,"body_dia":0.3,"base_len":0.1,"base_dia":3}]')
}
var lb = function() {
	function a(a) {
		function e(a) {
			a = l(a);
			if(!a) throw Error("Error on STL ACSII File");
			I++;
			return a
		}

		function l(a) {
			for(; L[I].match(/^\s*$/);) I++;
			return L[I].match(a)
		}
		f = [];
		g = [];
		var L = b(new Uint8Array(a)),
			I = 0;
		a = /^\s*facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/;
		var y = /^\s*vertex\s+([^s]+)\s+([^\s]+)\s+([^\s]+)/,
			z = new THREE.BufferGeometry;
		for(e(/^\s*solid\s(.*)/); !l(/^\s*endsolid/);) {
			var x = e(a);
			e(/^\s*outer\s+loop/);
			var B = e(y),
				fa = e(y),
				X = e(y);
			e(/\s*endloop/);
			e(/\s*endfacet/);
			d(B);
			d(fa);
			d(X);
			c(x)
		}
		z.addAttribute("position", new THREE.BufferAttribute(new Float32Array(f), 3));
		z.addAttribute("normal", new THREE.BufferAttribute(new Float32Array(g), 3));
		return z
	}

	function b(a) {
		for(var b = [], c = 0, d = 0; d < a.length; d++) 10 === a[d] && (b.push(String.fromCharCode.apply(null, a.subarray(c, d))), c = d + 1);
		b.push(String.fromCharCode.apply(null, a.subarray(c)));
		return b
	}

	function c(a) {
		var b = parseFloat(a[1]),
			c = parseFloat(a[2]);
		a = parseFloat(a[3]);
		g.push(b, c, a, b, c, a, b, c, a)
	}

	function d(a) {
		f.push(parseFloat(a[1]), parseFloat(a[2]),
			parseFloat(a[3]))
	}

	function e(a, b) {
		f.push(a.getFloat32(b + 0, !0), a.getFloat32(b + 4, !0), a.getFloat32(b + 8, !0))
	}
	var f = [],
		g = [];
	return function(b) {
		try {
			return a(b)
		} catch(fa) {
			f = [];
			g = [];
			b = new DataView(b);
			for(var c = b.getUint32(80, !0), d = new THREE.BufferGeometry, l = 84, I = 0; I < c; I++) {
				var y = b,
					z = l,
					x = y.getFloat32(z + 0, !0),
					B = y.getFloat32(z + 4, !0),
					y = y.getFloat32(z + 8, !0);
				g.push(x, B, y, x, B, y, x, B, y);
				e(b, l + 12);
				e(b, l + 24);
				e(b, l + 36);
				l += 50
			}
			d.addAttribute("position", new THREE.BufferAttribute(new Float32Array(f), 3));
			d.addAttribute("normal",
				new THREE.BufferAttribute(new Float32Array(g), 3));
			return d
		}
	}
}();

function Fa() {
	$("body").delegate("#weaver", "click", function() {
		var a = parseFloat($("#weaver_dia").val()),
			b = parseFloat($("#max_dist").val());
		b || (b = 9999999);
		for(var c = 0; c < T.length; c++)
			if("weave" === T[c].type) {
				Ma(T[c].key);
				break
			}
		for(var c = b, d = T.length, b = {}, e, f, g, l = 0; l < d; l++) {
			f = 0;
			g = "";
			for(var w = l + 1; w < d; w++) l === w || b[l + "_" + w] || (e = mb(l, w, c), f < e && (f = e, g = w));
			0 < f && (b[l + "_" + g] = [l, g])
		}
		var c = (new Date).getTime(),
			R;
		for(R in b) {
			d = b[R][0];
			e = b[R][1];
			f = c;
			g = a;
			for(var l = nb(d, e), w = T[d].x, L = T[d].y, I = T[e].x, y = T[e].y, z = 0; z <
				mb(d, e, 9999); z++) {
				var x = z * l + g,
					B = new THREE.Vector3(w, L, !(z % 2) * (l + 2 * g) + x),
					x = new THREE.Vector3(I, y, (1 === z % 2) * (l + 2 * g) + x),
					fa = f,
					X = g,
					S = new THREE.MeshLambertMaterial({
						color: 6711039
					}),
					qb = (new THREE.Vector3).subVectors(x, B),
					va = new THREE.Matrix4;
				va.lookAt(B, x, (new THREE.Object3D).up);
				va.multiply((new THREE.Matrix4).set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1));
				X = new THREE.CylinderGeometry(X, X, qb.length(), 8, 1);
				S = new THREE.Mesh(X, S);
				S.applyMatrix(va);
				S.position.set((x.x + B.x) / 2, (x.y + B.y) / 2, (x.z + B.z) / 2);
				S.name = fa;
				h.add(S);
				K.push(S);
				M.push(fa)
			}
		}
		T.push({
			type: "weave",
			key: c,
			dia: a,
			x: 0,
			y: 0,
			z: 20
		});
		V()
	})
}

function nb(a, b) {
	return Math.pow(Math.pow(T[b].y - T[a].y, 2) + Math.pow(T[b].x - T[a].x, 2), .5) - T[a].dia / 2 - T[b].dia / 2
}

function mb(a, b, c) {
	if("m2f" !== T[a].type || "m2f" !== T[b].type) return 0;
	var d = nb(a, b);
	b = T[b].z;
	if(0 >= d || c < d) return 0;
	a = T[a].z;
	b < a && (a = b);
	return Math.floor(a / d)
}


var object_file = [];//用来存放模型原型--->复制模型用
function ja() {
	$("#support_file").on("change", function(a) {
		//$("#support_button_2").show();
		//$("#support_button_3").show();
		La();
		ob(a.target.files[0]);

		object_file[object_file.length] = a.target.files[0];
	});
	$("#plate_file").on("change", function(a) {
		for(var b = 0; b < a.target.files.length; b++) ob(a.target.files[b])
	});
	pb();
	var a = document.body;
	a.addEventListener("dragover", function(a) {
		a.stopPropagation();
		a.preventDefault();
		a.dataTransfer.dropEffect = "copy"
	});
	a.addEventListener("drop", function(a) {
		a.stopPropagation();
		a.preventDefault();
		ob(a.dataTransfer.files[0])
	})
}

function ob(a) {
	var b = new FileReader;
	b.addEventListener("load", function(a) {
		ab(a.target.result);
		var file = $("#support_file").val();
		var strFileName = file.substring(file.lastIndexOf("\\")+1);
		var fileName = strFileName.split('.')[0];
		model_names['"'+G[G.length-1].id+'"'] = fileName
	});
	b.readAsArrayBuffer(a);
}

var taFlg = true;//用来判断ta()函数仅执行一次的标志。ta()只能执行一次，否则会导致输入框点击后连续会执行多次，导致输入失效
var boxes = new Array;
var G_max_z = new Array;//旋转中心到底面的距离初始化
//模型导入 材质、位置、
function ab(a) {
	var b = (new Date).getTime() + Math.random();
	a = lb(a);

	var c = new THREE.MeshLambertMaterial({
			color: 0xe8e8e8
		}),
		c = new THREE.Mesh(a, c),
		d = O;

	//if("plate" == F || "support" == F) d = 0;
	d = 0;
	a.center();

	c.position.set(0, 0, d - c.geometry.boundingBox.min.z);//设置模型导入时的高度
	c.name = b;
	h.add(c);
	G.push(c);
	H.push(b);
	//if(J==-1) J=0;
	//"support" !== F && (J = G.length - 1);
	V();
	Ha(b);
	if (taFlg){//ta()只能执行一次，否则会导致输入框点击后连续会执行多次，导致输入失效
		ta()
		taFlg=false;
	};

	rote_info[G.length-1]=[0,0,0];//初始化旋转信息
	box_rote_info[G.length-1]=new THREE.Vector3(0,0,0);//初始化单次旋转数据信息
	var model_box = new Object;
	var max_x = G[G.length-1].geometry.boundingBox.max.x;
	var min_x = G[G.length-1].geometry.boundingBox.min.x;
	var max_y = G[G.length-1].geometry.boundingBox.max.y;
	var min_y = G[G.length-1].geometry.boundingBox.min.y;
	var max_z = G[G.length-1].geometry.boundingBox.max.z;
	var min_z = G[G.length-1].geometry.boundingBox.min.z;
	model_box.aaa = new THREE.Vector3(max_x,max_y,max_z);
	model_box.bbb = new THREE.Vector3(min_x,min_y,min_z);
	model_box.aab = new THREE.Vector3(max_x,max_y,min_z);
	model_box.aba = new THREE.Vector3(max_x,min_y,max_z);
	model_box.baa = new THREE.Vector3(min_x,max_y,max_z);
	model_box.abb = new THREE.Vector3(max_x,min_y,min_z);
	model_box.bab = new THREE.Vector3(min_x,max_y,min_z);
	model_box.bba = new THREE.Vector3(min_x,min_y,max_z);
	boxes.push(model_box);
	G_max_z.push(max_z)//旋转中心到底面的距离初始化为模型二分之一高度

}

function Z(a) {
	var b = decodeURIComponent(window.location.search.substring(1)).split("&"),
		c, d;
	for(d = 0; d < b.length; d++)
		if(c = b[d].split("="), c[0] === a) return "undefined" === typeof c[1] ? "" : c[1];
	return ""
}

function pb() {
	var a = Z("src");
	"" !== a && rb(a)
}

function rb(a) {
	var b = new XMLHttpRequest;
	b.open("GET", a, !0);
	b.responseType = "arraybuffer";
	b.onload = function() {
		if (200 == b.status){
			object_file[object_file.length] = b.response;
			ab(b.response);
		}
	};
	b.send()
}

function Ea() {
	var a = Z("models");
	"" !== a && (a = a.split(","), Ra("plate"), a.forEach(function(a) {
		rb(a)
	}))
}

function Ta() {
	if(G.length) {
		h.remove(P);
		var a = (new THREE.Box3).setFromObject(G[G.length - 1]),
			b = a.max.x - a.min.x + 10,
			c = a.max.y - a.min.y + 10,
			d = new THREE.PlaneBufferGeometry(b, c);
		P = new THREE.Mesh(d, new THREE.MeshBasicMaterial({
			color: 16777215,
			transparent: !0,
			opacity: .8,
			side: THREE.DoubleSide
		}));
		P.position.set(a.min.x + b / 2 - 5, a.min.y + c / 2 - 5, 0);
		$("#slider").prop("max", a.max.z)
	}
}

function sa() {
	$("#slider").on("change mousemove", function() {
		var a = $(this).val();
		h.remove(P);
		P.position.z = a;
		h.add(P)
	})
};

//window.onload=function() {
//	//var canvas = document.getElementById("cvs");
//	//console.log(canvas)
//	var ctx = m.getContext().canvas.getContext("webgl");
//	console.log(ctx)
//	for (var i = 0; i < 100; i++) {
//		var c = canvas.getImageData(i * 3, i * 3, 1, 1).data;
//		console.log(c)
//	}
//}