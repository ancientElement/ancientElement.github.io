$(function () {
    $(".codehim-dropdown").CodehimDropdown({
        skin: "deep-purple"
    });
    timer = setInterval(function () {
        $('.swiper-button-next').click();
    }, 4000)
    //阻止点击事件冒泡
    $('.swiper-button-next').on('click', function (e) {
        e.stopPropagation();
    })
    $('#swiper1').on('mouseleave touchend', function () {
        console.log(22);
        timer = setInterval(function () {
            $('.swiper-button-next').click();
        }, 4000)
    })
    $('#swiper1').on('mouseover touchstart', function () {
        clearInterval(timer);
    })
    var swiper = new Swiper("#swiper1", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        }
    });
     //滑动小item
     var starX = 0;
     var moveX = 0;
     $('.manerout').on('touchstart',function(e) {
        starX = e.targetTouches[0].pageX;
     })
     $('.manerout').on('touchmove',function(e) {
        moveX = e.targetTouches[0].pageX - starX;
        if(moveX > 0) return;
        $('.mainnr')[0].style.transform = 'translate(' + moveX + 'px)'
     })
     //倒计时
     function countDown(time) {
        var nowTime = +new Date();
        var inputTime = +new Date(time);
        var times = (inputTime - nowTime) / 1000;
        d = parseInt(times / 60 / 60 / 24);
        d = d < 10 ? '0' + d : d;
        h = parseInt(times / 60 / 60 % 24);
        h = h < 10 ? '0' + h : h;
        m = parseInt(times / 60 % 60);
        m = m < 10 ? '0' + m : m;
        s = parseInt(times % 60);
        s = s < 10 ? '0' + s : s;
        return d + '天' + h + '小时' + m + '分钟' + s + '秒';
    }
    function countSecond(time) {
        var nowTime = +new Date();
        var inputTime = +new Date(time);
        var times = (inputTime - nowTime) / 1000;
        return parseInt(times);
    }
    console.log(countDown('2025-8-4 24:00:00'));
    setInterval(function () {
        $('.timedown2').html(countDown('2025-8-4 24:00:00'));
        $('.timedown1').html(countSecond('2025-8-4 24:00:00')+'S');
    }, 1000)
})