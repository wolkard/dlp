(function($){
    var _count = 0;
	var Mynumkb = function(element, options){
        _count++;
        this.count = _count;
        this.$element = $(element);
        this.$element.attr("data-count",this.count);
		this.options = $.extend({},$.fn.mynumkb.defaults, options);
		this.init();
	}
	Mynumkb.prototype = {
	    constructor: Mynumkb, 
		init:function(){
			var me= this;
			me.render();
			me.bind();
            me.initHtml();
		},
		render:function(){
			var me = this;
            me.$eparentNode = me.$element.parent();
		},
		bind:function(){
            var me = this;
            me.$element.on("click",$.proxy(me['_eClick'],me));
          
            $(document).on("mousedown","#mykeyboard"+me.count+" li",$.proxy(me['_limousedown'],me));
            $(document).on("mouseup","#mykeyboard"+me.count+" li",$.proxy(me['_limouseup'],me));
            $(document).on("click","#mykeyboard"+me.count+" li",$.proxy(me['_liclick'],me));
		},
		initHtml:function(){
            var me = this;
            var _html = [
                '<div class="mykb-box" id="mykeyboard'+me.count+'">',
                    '<ul class="num-key clearfix">',
                        '<li class="number">1</li>',
                        '<li class="number">2</li>',
                        '<li class="number">3</li>',
                        '<li class="func del"></li>',
                        '<li class="number">4</li>',
                        '<li class="number">5</li>',
                        '<li class="number">6</li>',
                        '<li class="func clearall">clear</li>',
                        '<li class="number">7</li>',
                        '<li class="number">8</li>',
                        '<li class="number">9</li>',
                        '<li class="func sure"></li>',
                        '<li class="number numkb">.</li>',
                        '<li class="number numkb">0</li>',
                        '<li class="number numkb">-</li>',
                    '</ul>',
                '</div>',
            ].join("");
            
            $("body").append(_html);
            me.setPosition();
        },
        setPosition:function(){
            var me = this;
            var parentNode = me.$eparentNode;
            var $element = me.$element;
            $("body").css("position","relative");
            var height = $element.outerHeight();
            var width = $element.outerWidth();
            var position = $element.position();
            var $keyboard = $("#mykeyboard"+me.count);
            var ulWidth = $keyboard.outerWidth();
            var ulHeight = $keyboard.outerHeight();
            var left = position.left;
            $keyboard.css({
                top:position.top+height+30+"px",
                left:left+width+30+"px"
            });
        },
        _eClick:function(e){
            var me = this;
            var count = me.$element.data("count");
            var $keyboard = $("#mykeyboard"+count);
            sidVal = me.$element.val();//获取到现有的值
            me.$element.val('');
            $keyboard.fadeIn(100).siblings(".mykb-box").hide();
        },
        _liclick:function(e){
            var me = this;
            var $target = $(e.target);
            if($target.hasClass("del")){//退格
                me.setValue("del");
            }else if($target.hasClass("exit")||$target.hasClass("sure")){//退出--确定
                me.close();
            }else if($target.hasClass("clearall")){//清除
                me.$element.val("");
            }else{//输入其他数字
                var str = $target.text();
                me.setValue("add",str);
            }
        },
		_limousedown:function(e){
            var me = this;
            var val = $(e.target).html();
            $(e.target).addClass("active").siblings().removeClass("active");
        },
		_limouseup:function(e){
            var me = this;
            var val = $(e.target).html();
            $(e.target).removeClass("active");
            
        },
        setValue:function(type,str){
            var me = this;
            var curpos = me.getCursorPosition();
            var val = me.$element.val();
            var newstr = "";
            if(type == 'add'){
                newstr = me.insertstr(val,str,curpos);
                me.$element.val(newstr);
                me.$element.textFocus(curpos+1);
            }else if(type == 'del'){
                newstr = me.delstr(val,curpos);
                me.$element.val(newstr);
                me.$element.textFocus(curpos-1);
            }
        },
        insertstr:function(str,insertstr,pos){
            var str = str.toString();
            var newstr = str.substr(0,pos)+''+insertstr+''+str.substr(pos);
            return newstr;
        },
        delstr:function(str,pos){
            var str = str.toString();
            var newstr = "";
            if(pos != 0){
                newstr = str.substr(0,pos-1)+str.substr(pos);
            }else{
                newstr = str;
            }
            return newstr;
        },
        getCursorPosition:function(){
            var me = this;
            var $element = me.$element[0];
            var cursurPosition=-1;
            if($element.selectionStart!=undefined && $element.selectionStart!=null){//非IE浏览器
                cursurPosition= $element.selectionStart;
            }else{//IE
                var range = document.selection.createRange();
                range.moveStart("character",-$element.value.length);
                cursurPosition=range.text.length;
            }
            return cursurPosition;
        },
        close:function(){
            var me = this;
            var count = me.$element.data("count");
            var $keyboard = $("#mykeyboard"+count);
      		var amt = me.$element;//获取到有焦点输入框的dom
			if(count==1){
				axis='X';
			}
			else if(count==2){
				axis='Y';
			}
			else{
				axis='Z'
			}
			if(axis!="V"){//XYZ轴
				var sid = $( "#slider"+axis);//获取到有焦点滑块的dom
				var amtValue = amt[0].value;//获取到有焦点输入框的值
				var change_num = changeNum(sid,amt,amtValue,sidVal,axis);//改变数据，改变滑块，旋转模型
				revolving_box(axis.toLowerCase(),change_num);//toLowerCase():将XYZ转换为xyz
				rote_info[J]=[beforeX,beforeY,beforeZ];//保存模型旋转信息
			}else{//体积
	
			}
            $keyboard.fadeOut(100);
//          me.$element.attr("isshowkb","false");
        }
	};
	$.fn.mynumkb = function (option) {
	    return this.each(function () {
            var options = typeof option == 'object' ? option : {};
	        var data = new Mynumkb(this, options);
	    })
    }
	$.fn.mynumkb.defaults = {
		
	};
	$.fn.mynumkb.Constructor = Mynumkb;
	
	
})(jQuery);
(function($){
    $.fn.textFocus=function(v){
        var range,len,v=v===undefined?0:parseInt(v);
        this.each(function(){
            if(navigator.userAgent.msie){
                range=this.createTextRange();
                v===0?range.collapse(false):range.move("character",v);
                range.select();
            }else{
                len=this.value.length;
                v===0?this.setSelectionRange(len,len):this.setSelectionRange(v,v);
            }
            this.focus();
        });
        return this;
    }
})(jQuery);