(function($,root){
    var $wrap = $('.wrapper');
    var control;
    //创建结构
    var $playList = $("<div class = 'play-list'>"+
        "<div class='play-header'>播放列表</div>" + 
        "<ul class = 'list-wrapper'></ul>" +
        "<div class='close-btn'>关闭</div>"+
    "</div>") 
    //渲染我们的播放列表dom 
    function renderList(data){
        // console.log(data.length);
        var html = '';
        for(var i = 0;i < data.length;i++){
            html += "<li><h3 >"+data[i].song+"-<span>"+data[i].singer+"</span></h3></li>"
        }
        //插入指定父级中
        $playList.find("ul").html(html);
        $wrap.append($playList);
        bindEvent();
    }  
    function show(controlmanager){
        control = controlmanager;
        $playList.addClass("show");
        signSong(control.index);
    }
    function bindEvent(){
        $playList.on("click",".close-btn",function(){
            $playList.removeClass("show");
        })
        $playList.find("li").on("click",function(){
            var index = $(this).index();
            signSong(index);
            control.index = index;
            $wrap.trigger("playChange",[index,true]);
            $wrap.find(".play-btn").addClass("playing");
            root.pro.start(0);//点击歌单时间归零
            audio.play();//点了其他歌单自动播放
            $('.play').addClass('playing'); //改变为播放状态
            setTimeout(function(){
                $playList.removeClass("show");
            }, 200);
        })
    }
    function signSong(index){
        $playList.find(".sign").removeClass("sign");
        $playList.find("ul li").eq(index).addClass("sign");
    }
    //暴露模块
    root.playList = {
        renderList : renderList,
        show : show
    }
})(window.Zepto,window.player || (window.player = {}))