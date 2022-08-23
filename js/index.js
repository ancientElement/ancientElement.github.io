$(function() {
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
        $('.mySwiper').on('mouseleave touchend', function () {
            console.log(22);
            timer = setInterval(function () {
                $('.swiper-button-next').click();
            }, 4000)
        })
        $('.mySwiper').on('mouseover touchstart', function () {
            clearInterval(timer);
        })
        var swiper = new Swiper(".mySwiper", {
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
})