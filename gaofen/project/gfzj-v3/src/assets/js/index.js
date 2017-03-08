/**
 * Created by Administrator on 2016-8-5.
 */
$(function () {

    var $loadingPercent  = $("#load-present-bar"),
        $progressBar = $("#progress-bar"),
        $progressBarWrap = $("#audio-time-bar"),
        $barPoint = $("#bar-point"),
        $playTime = $("#playTime"),
        $totalTime = $("#totalTime"),
        $audio = $("#audio-player"),
        $playBtn = $("#btn-play");

    var barWrapWidth = $progressBarWrap.width(),
        barWrapLeft = $progressBarWrap.offset().left;

    var currentTime = $audio[0].currentTime;

    var isMoveState = false,
        canMove = false,
        totalTimeSec = 0,
        movePlaySec = 0,
        isUpdatePlayTime = false,
        loadPercent = null;

    $playBtn.css('height',$playBtn.width());
    getDuration();

    var url = $audio[0].src,
        _time = $totalTime.text();

    var list = [{
        name: '',
        url: url,
        time: _time
    }];

    var audioPlayerCtrl = {

        audioHandler : null,

        init : function () {
            var _t = this;
            _t.audioHandler = new AudioPlayer({
                id: 'audio-player'
            });

            _t.audioHandler.add(list);

            _t.bindEvent();

            _t.audioHandler.loadIndex(0);
        },

        bindEvent: function () {
            var _t = this;

            // 开始加载 重置下UI
            _t.audioHandler.on('loadstart', function () {
                canMove = false;
                totalTimeSec = 0;
                $progressBar.css('width', '0%');
                $loadingPercent.css('width', '0%');
            });

            // 可以播放状态
            // totalTime 总时间
            // name 音频的name
            // item 音频的所有信息
            _t.audioHandler.on('canplay', function (totalTime, name, item) {
                canMove = true;
                totalTimeSec = formatTimeToSec(totalTime);
                $playTime.text('00:00');
                $totalTime.text(totalTime);
                getDuration();
            });

            // 更新时间
            // formatTime 格式化后的当前播放时间
            // playedPercent 已播放时间占总时间的百分比 0 - 100
            // position 已播放的秒数
            // duration 音频总秒数
            _t.audioHandler.on('timeupdate', function (formatTime, playedPercent, position, duration) {
                if( !isMoveState ) {
                    $playTime.text(formatTime);
                    $progressBar.css('width', playedPercent+'%');
                }
            });

            // 加载进度
            // percent 已加载进度 0 - 100
            _t.audioHandler.on('progress', function (percent) {
                if (percent > 100) {
                    percent = 100;
                }
                loadPercent = percent;
                $loadingPercent.css('width', percent+'%');
            });

            // 音频加载出错
            _t.audioHandler.on('error', function (e) {
                console.log('音频出错');
            });

            // 音频播放完毕
            _t.audioHandler.on('ended', function (e) {
                console.log('音频播放结束');
                $playBtn.addClass('stop').attr('data-state', 'pause');
                $playBtn.parent().removeClass('play');
                $('.item-play').addClass('item-stop');
            });
        }
    };

    function bindEvent () {

        // 播放按钮
        $playBtn.on('click', function (e) {
            e.preventDefault();
            getDuration();
            // canMove为false表示还没触发 canplay 事件
            if (!canMove) {
                Common.MS.alert('音频加载中...');
                return;
            }

            var state = $(this).attr('data-state');
            if( state == 'playing' ) {
                audioPlayerCtrl.audioHandler.pause();
                $(this).addClass('stop').attr('data-state', 'pause');
                $(this).parent().removeClass('play');
                $('.item-play').addClass('item-stop')

            } else {
                // 针对预加载失败的hack
                if(loadPercent != null && Number(loadPercent) == 0) {
                    audioPlayerCtrl.audioHandler.pause();
                    audioPlayerCtrl.audioHandler.progress(1);
                }

                audioPlayerCtrl.audioHandler.play();

                $(this).removeClass('stop').attr('data-state', 'playing');
                $(this).parent().addClass('play');
                $('.item-play').removeClass('item-stop')
            }
        });

        // 拖动进度条播放
        $barPoint.on('touchmove', function (e) {
            e.preventDefault();
            audioPlayerCtrl.audioHandler.pause();
            if (!canMove) return;
            isMoveState = true;
            var left = e.changedTouches[0].clientX - barWrapLeft;
            var movePercent = ((left / barWrapWidth) * 100).toFixed(6);
            if ( left >= barWrapWidth ) {
                movePercent = 100;
            } else if (left <= 0) {
                movePercent = 0;
            }

            movePlaySec = totalTimeSec * movePercent / 100;
            $progressBar.css('width', movePercent+'%');
            $playTime.text(formatSec(movePlaySec));
        })
            .on('touchend', function () {
                if (!canMove) return;
                isMoveState = false;
                audioPlayerCtrl.audioHandler.pause();
                audioPlayerCtrl.audioHandler.progress(movePlaySec);
                audioPlayerCtrl.audioHandler.play();
                $playBtn.removeClass('stop').attr('data-state', 'playing');
                $playBtn.parent().addClass('play');
                $('.item-play').removeClass('item-stop')
            });

        // 点击进度条播放
        $progressBarWrap.on('touchend', function (e){
            e.preventDefault();
            audioPlayerCtrl.audioHandler.pause();
            if (!canMove) return;

            var left = e.changedTouches[0].clientX - barWrapLeft;
            var movePercent = ((left / barWrapWidth) * 100).toFixed(6);
            if ( left >= barWrapWidth ) {
                movePercent = 100;
            } else if (left <= 0) {
                movePercent = 0;
            }

            totalTimeSec = $audio[0].duration;

            movePlaySec = parseInt(totalTimeSec * movePercent / 100, 10);

            $progressBar.css('width', movePercent+'%');
            $playTime.text(formatSec(movePlaySec));
            $playBtn.removeClass('stop').attr('data-state', 'playing');
            $playBtn.parent().addClass('play');
            $('.item-play').removeClass('item-stop');

            audioPlayerCtrl.audioHandler.progress(movePlaySec);
            audioPlayerCtrl.audioHandler.play();
        });
    }
    function getDuration(){
        setTimeout(function () {
            var totalTime = $audio[0].duration;
            if(isNaN(totalTime)){
                getDuration();
            }
            else{
                var time = formatSec(totalTime);
                $totalTime.text(time);
                _time = $totalTime.text();
            }
        }, 200);
    }
    function formatTimeToSec (time) {
        var times = time.split(':');
        return Number(times[0]) * 60 + Number(times[1]);
    }
    function formatSec (second) {
        var _min,
            _sec;

        _min = parseInt(second / 60);
        _sec = parseInt(second % 60);

        return (_min >= 10 ? _min : '0' + _min) + ':'
            + (_sec >= 10 ? _sec : '0' + _sec);
    }
    function init () {
        audioPlayerCtrl.init();

        bindEvent();
    }

    init();

    $('.item').on('click', function () {
        $(this).addClass('item-play').siblings('.item-play').removeClass('item-play');
        $('.item').removeClass('item-stop');
        getDuration();

        var _url = $(this).find('.audio-src').val(),
            imgSrc = $(this).find('.ui-avatar img').attr('src'),
            title = $(this).find('.item-title strong').text(),
            info = $(this).find('.audio-src').data('info');

        $('.audio-img').attr('src',imgSrc);
        $('#audio-play').attr('src',_url);

        list = [{
            name: '',
            url: _url,
            time: _time
        }];
        audioPlayerCtrl.init();
        audioPlayerCtrl.bindEvent();
        audioPlayerCtrl.audioHandler.play();
        $playBtn.removeClass('stop').attr('data-state', 'playing');
        $playBtn.parent().addClass('play');
        $('#audio-title').text(title);
        $('#audio-brief').text(info);
        getDuration();

        var idx = $(this).index();

        window.location.hash = idx;
    });

    $('.icon-fav').click(function () {
        $(this).toggleClass('had-fav');
        if($(this).hasClass('had-fav')){
            $(this).text('已关注')
        }else{
            $(this).text('关注')
        }
    });

    var _hash = window.location.hash,
        _idx = _hash.replace('#','') - 1;

    if(_hash && _idx > 0){
        $('.item').eq(_idx).trigger('click');
    }else{
        $('.item').eq(0).trigger('click');
    }
});