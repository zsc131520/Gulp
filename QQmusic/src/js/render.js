//实现页面渲染 包括img+info+like-btn
//模块化   封装作用域
(function ($, root) {
    // //借助jQuery封装作用域的方法
    // function jQuery(){}
    // //把jQuery对象挂载到window上，以便实现在外界能够使用该对象提供的方法
    // window.$ = window.jQuery = jQuery;
    //渲染body图片为模糊
    function renderImg(src) {
        var img = new Image();
        img.src = src;
        img.onload = function () {
            $('.img_box img').attr('src', src);
            //引用高斯模糊模块
            root.blurImg(img, $('body'));
        }

    }
    //渲染歌曲信息
    function renderInfo(info) {
        // console.log(info)
        var str = '';
        str += '<div class="song-name">' + info.song + '</div>\
        <div class="singer-name">' + info.singer + '</div>\
        <div class="album-name">' + info.album + '</div>';
        $('.song_info').html(str);
    }
    //渲染是否喜欢
    function renderIsLike(like) {
        if (like) {
            $('.like').addClass('liking');
        } else {
            $('.like').removeClass('liking');
        }
    }
    //暴露方法
    root.render = function (data) {
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    }
})(window.Zepto, window.player || (window.player = {})) //把所需要模块以参数传进来，这样以免在全局再次获取，影响性能