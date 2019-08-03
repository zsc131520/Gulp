(function ($, root) {
    var duration = 0,
        frameId = null,
        startTime = null,
        lastper = 0; //  切换歌曲需要初始化上一段播放进度
    //渲染总时间
    function renderAllTime(allTime) {
        // console.log(allTime);
        duration = allTime;
        var time = formatTime(allTime);
        $('.all-time').html(time);
    }
    //转换时间格式
    function formatTime(t) {
        //取整
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }
    //进度条开始运动 音乐播放时
    function start(p) {
        cancelAnimationFrame(frameId);
        //以毫秒为单位  全局变量，为了在结束好获取
        startTime = new Date().getTime();
        //拖拽时候传入p，如果没有，取lastper,有指传入p
        lastper = p === undefined ? lastper : p;

        function frame() {
            var curTime = new Date().getTime();
            // 当前歌曲播放的总进度 = 上一段的进度 + 当前段的进度
            //以毫秒为单位 duration以秒为单位,所以乘上1000   lastper上一次结束的时间
            var per = lastper + (curTime - startTime) / (duration * 1000);
            // console.log(per)
            if (per < 1) {
                //更新进度条
                update(per);
            } else {
                //下面三个 播放到100%时自动播放下一首歌曲
                var i = control.next();
                $('body').trigger('playChange', i);
                console.log(i)
                root.pro.start(0);
                //当达到100%时 清除定时器 不在更新进度条
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    function update(per) {
        //更新对应时间  更新进度条
        var time = formatTime(per * duration);
        // console.log(time);
        $('.cur-time').html(time);
        //取到进度条运动的百分数
        var x = (per - 1) * 100;
        $('.pro-top').css({
            transform: 'translateX(' + x + '%)'
        })
    }
    //结束当前进度条运动的函数
    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        //全局变量
        lastper = lastper + (stopTime - startTime) / (duration * 1000);
    }
    //暴露函数
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update

    }
})(window.Zepto, window.player || (window.player = {}))