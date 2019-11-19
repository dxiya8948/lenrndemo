/*声明全局变量*/
var index = 0, //当前显示图片的索引，默认值为0
    timer = null, //定时器
	prev = byId("prev"),
	pics = byId("banner").getElementsByTagName("div"),
    dots = byId("dots").getElementsByTagName("span"),
	next = byId("next"),
	menuContent = byId("menu-content"),
	menuItems = menuContent.getElementsByClassName("menu-item"),
	subMenu = byId("sub-menu"),
    subItems = subMenu.getElementsByClassName("inner-box"),
	subMenu = byId("sub-menu"),
	size = pics.length;

function addHandler(element, type, handler) {
	//非IE浏览器
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    }
    //IE浏览器支持DOM2级
    else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
    }
    //IE浏览器不支持DOM2级
    else {
        element['on' + type] = handler;
    }
}

//定时器 自动轮播
function startAutoPlay(){
    timer = setInterval(function(){
        index++;
        if(index >= size) index= 0;
        changeImg();
    },3000)
}

//清楚定时器
function stopAutoPlay(){
    if(timer){
        clearInterval(timer);
    }
}

//封装getElemenById（）
function byId(id){
	return typeof(id)==="string"?document.getElementById(id):id;
}

//封装切换图片的函数,遍历图片并控制隐藏和显示属性
function changeImg(){
   for(var i=0,len=dots.length;i<len;i++){
       dots[i].className = "";
       pics[i].style.display = "none";
   }
   dots[index].className = "active";
   pics[index].style.display = "block";
}

//图片切换
function slideImg(){
    startAutoPlay();//开启自动轮播
    var main = byId("main");//获取图片自动切换需要的元素
    var banner = byId("banner");//获取需要的元素

    addHandler(main,"mouseover",stopAutoPlay);//绑定鼠标划入事件
    addHandler(main,"mouseout",startAutoPlay);//绑定划出事件

	//点击原点索引切换图片
	//遍历圆点，给每个圆点设置id=i
    for(var i=0,len=dots.length;i<len;i++){
       dots[i].id = i;
       addHandler(dots[i],"click",function(){
           index = this.id;
           changeImg();
       })
    }

    // 下一张
    addHandler(next,"click",function(){
       index++;
       if(index>=size) index=0;
       changeImg();
    })

    // 上一张
    addHandler(prev,"click",function(){
       index--;
       if(index<0) index=size-1;
       changeImg();
    })

    // 子菜单 遍历menu-Item元素
    for(var m=0,mlen=menuItems.length;m<mlen;m++){
    	//给menuitem每个元素添加data-index属性
    	menuItems[m].setAttribute("data-index",m);

    	//给menuitem绑定划入事件
    	addHandler(menuItems[m],"mouseover",function(){
    		//滑入的时候显示子菜单背景
        	subMenu.className = "sub-menu";
        	//data-index赋值给idx
        	var idx = this.getAttribute("data-index");
        	//遍历inner-box，将子菜单隐藏，取消主菜单的灰度效果
        	for(var j=0,jlen=subItems.length;j<jlen;j++){
            	subItems[j].style.display = 'none';
            	menuItems[j].style.background = "none";
        	}
        	//打开子菜单及增加主菜单的灰度效果
        	subItems[idx].style.display = "block";
        	menuItems[idx].style.background = "rgba(0,0,0,0.1)";
        });
    }

    //鼠标进入子菜单时依旧显示子菜单
    addHandler(subMenu,"mouseover",function(){
        this.className = "sub-menu";
    });

	//移出子菜单时关闭子菜单
    addHandler(subMenu,"mouseout",function(){
        this.className = "sub-menu hide";
    });

    //鼠标离开banner时关闭子菜单
    addHandler(banner,"mouseout",function(){
        subMenu.className = "sub-menu hide";
    });

    //鼠标离开主菜单时关闭子菜单
    addHandler(menuContent,"mouseout",function(){
        subMenu.className = "sub-menu hide";
    });
}

//绑定widow事件，在onload是运行函数slideImg（）
addHandler(window,"load",slideImg);