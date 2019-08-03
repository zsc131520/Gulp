var root = window.player,
    len,
    dataList = [],
    audio = root.audioManager,
    control,
    timer = null;

function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        datatype: 'json',
        success: function (data) {
            // console.log(data);
            len = data.length;
            //把数据总长度传进去
            control = new root.controlIndex(len);
            dataList = data;
            // root.render(data[0]);
            // audio.getAudio(data[0].audio);
            // root.pro.renderAllTime(data[0].duration);
            bindEvent();
            bindTouch();
            //创建列表结构
            root.playList.renderList(data);
            $('body').trigger('playChange', 0);
        },
        error: function () {
            console.log('请重试，感谢支持');
        }

    })
}
//点击按钮
function bindEvent() {
    //优化代码 ，事件参数e必须传进去，否则报错
    $('body').on('playChange', function (e, index) {
        //点击下一首，自动渲染页面
        root.render(dataList[index]);
        //点击拿到总时间
        root.pro.renderAllTime(dataList[index].duration);
        //点击前一首，自动加载音频
        audio.getAudio(dataList[index].audio);
        //当点击下一首，如果是播放play状态下，就让他自动播放
        if (audio.status == 'play') {
            audio.play();
            rotated(0);
        }
        //css角度为零
        $('.img_box').attr('data-deg', 0);
        $('.img_box').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        });

    });
    $('.prev').on('click', function () {
        var i = control.prev();
        $('body').trigger('playChange', i);
        //点击进度条为0开始运动
        root.pro.start(0);
        //如果状态时暂停的话，进度条停止
        if (audio.status == 'pause') {
            root.pro.stop();
        }
    });
    $('.next').on('click', function () {
        var i = control.next();
        $('body').trigger('playChange', i);
        //点击进度条为0开始运动
        root.pro.start(0);
        //如果状态时暂停的话，进度条停止
        if (audio.status == 'pause') {
            root.pro.stop();
        }
    });
    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play();
            //开始进度条运动
            root.pro.start();
            var deg = $('.img_box').attr('data-deg') || 0;
            rotated(deg);
        } else {
            audio.pause();
            //结束进度条运动
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    });
    //点击list按钮显示歌单
    $('.list').on('click', function () {
        root.playList.show(control);
    });
    //点击是否喜欢
    $('.like').on('click', function () {
        var i = control.index; //获取索引值
        if (dataList[i].isLike) {
            $(this).removeClass('liking');
            //更新对应boolean值
            dataList[i].isLike = false;
            // console.log(dataList[i].isLike );
            // console.log(dataList[i]);
        } else {
            $(this).addClass('liking');
             //更新对应boolean值
            dataList[i].isLike = true;
            // console.log(dataList[i].isLike );
            // console.log(dataList[i]);
        }
    });
}
//进度条拖拽事件
function bindTouch() {
    var dot = $('.dot');
    var bottom = $('.pro-bottom').offset();
    var l = bottom.left;
    var w = bottom.width;
    dot.on('touchstart', function (e) {
        root.pro.stop();
    }).on('touchmove', function (e) {
        //移动端的横坐标
        var x = e.changedTouches[0].clientX;
        //拖动的距离=用x横坐标减去进度条left距离
        //拖动的距离除以进度条的总宽度
        var per = (x - l) / w;
        if (per >= 0 && per < 1) {
            root.pro.update(per);
        }
        //移动端的纵坐标
        // var y = e.changedTouches[0].clientY;
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        //拖动的距离=用x横坐标减去进度条left距离
        //拖动的距离除以进度条的总宽度
        var per = (x - l) / w;
        if (per >= 0 && per < 1) {
            // console.log(control);
            var time = per * dataList[control.index].duration;
            // console.log(time)
            root.pro.start(per);
            //拖拽到那个时间点接下来播放的歌曲
            audio.playTo(time);

            audio.play();
            audio.status = 'play';
            $('.play').addClass('playing');
        }
    })
}
//图片旋转
function rotated(deg) {
    //把字符串转换数字
    deg = +deg;
    //清理定时器，防止叠加
    clearInterval(timer);
    timer = setInterval(function () {
        deg += 2;
        //记录图片的角度值
        $('.img_box').attr('data-deg', deg);
        $('.img_box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all .2s linear'
        })
    }, 200);
}
getData('../mock/data.json');
//信息+图片渲染到页面上 render
//点击按钮
//音频的播放与暂停    切歌   audioControl
//进度条运动与拖拽
//图片旋转
//列表切歌