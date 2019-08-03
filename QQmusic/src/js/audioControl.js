(function ($, root) {
    //play pause getAudio
    function AudioManager() {
        //创建一个audio对象
        this.audio = new Audio();
        //audio默认状态
        this.status = 'pause';
    }
    AudioManager.prototype = {
        play: function () {
            // console.log(this)
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function (src) {
            // console.log(src)
            this.audio.src = src;
            //加载音频
            this.audio.load();
        },
        //拖拽到那个时间点接下来播放的歌曲
        playTo:function(t){
            this.audio.currentTime = t;
        }
    }
    root.audioManager = new AudioManager();
})(window.Zepto, window.player || (window.player = {}))