(function (window, document, $, undefined) {
    'use strict';

    let aceorbitJs = {
        i: function (e) {
            aceorbitJs.d();
            aceorbitJs.methods();
        },
        d: function (e) {
            this._window = $(window),
                this._document = $(document),
                this._body = $('body'),
                this._html = $('html')
        },

        methods: function (e) {
            aceorbitJs.salActive();
            aceorbitJs.wowActivation();
            // Keep header positioning stable: old sticky handler shifts the page while scrolling.
            aceorbitJs.popupMobileMenu();
            aceorbitJs.searchPopup();
            aceorbitJs.pricingPlan();
            aceorbitJs.slickSlider();
            aceorbitJs.boxHover();
            aceorbitJs.counterUp();
        },
        
        
        headerSticky: function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 250) {
                    $('.header-sticky').addClass('sticky')
                } else {
                    $('.header-sticky').removeClass('sticky')
                }
            })
        },
        
        popupMobileMenu: function (e) {
            $('.hamberger-button').on('click', function (e) {
                $('.popup-mobile-menu').addClass('active');
            });
            $('.close-menu').on('click', function (e) {
                $('.popup-mobile-menu').removeClass('active');
                $('.popup-mobile-menu .mainmenu .has-droupdown > a').siblings('.submenu, .rn-megamenu').removeClass('active').slideUp('400');
                $('.popup-mobile-menu .mainmenu .has-droupdown > a').removeClass('open')
            });
            $('.popup-mobile-menu .mainmenu .has-droupdown > a').on('click', function (e) {
                e.preventDefault();
                $(this).siblings('.submenu, .rn-megamenu').toggleClass('active').slideToggle('400');
                $(this).toggleClass('open')
            })
            $('.popup-mobile-menu').on('click', function (e) {
                e.target === this && $('.popup-mobile-menu').removeClass('active') && $('.popup-mobile-menu .mainmenu .has-droupdown > a').siblings('.submenu, .rn-megamenu').removeClass('active').slideUp('400') && $('.popup-mobile-menu .mainmenu .has-droupdown > a').removeClass('open');
            });
        },

        searchPopup: function () {
            $('.search-trigger').on('click', function () {
                $('.ace-search-popup').addClass('open')
            })
            $('.close-trigger').on('click', function () {
                $('.ace-search-popup').removeClass('open')
            })
            $( '.ace-search-popup' ).on( 'click', function () {
                $('.ace-search-popup').removeClass( 'open' );
            } )
            $('.ace-search-popup .aceorbit-search-popup-field').on('click', function (e) {
                e.stopPropagation();
            })
        },

        pricingPlan: function () {
            var yearlySelectBtn = $('#yearly-plan-btn'),
                monthlySelectBtn = $('#monthly-plan-btn'),
                monthlyPrice = $('.monthly-pricing'),
                yearlyPrice = $('.yearly-pricing'),
                buttonSlide = $('#pricing-checkbox');
            
            $(monthlySelectBtn).on('click', function() {
                buttonSlide.prop('checked', true);
                $(this).addClass('active').parent('.nav-item').siblings().children().removeClass('active');
                monthlyPrice.css('display', 'block');
                yearlyPrice.css('display', 'none');

            });
            
            $(yearlySelectBtn).on('click', function() {
                buttonSlide.prop('checked', false);
                $(this).addClass('active').parent('.nav-item').siblings().children().removeClass('active');
                monthlyPrice.css('display', 'none');
                yearlyPrice.css('display', 'block');
            });

            $(buttonSlide).change(function() {
                if ($('input[id="pricing-checkbox"]:checked').length > 0) {
                    monthlySelectBtn.addClass('active');
                    yearlySelectBtn.removeClass('active');
                    monthlyPrice.css('display', 'block');
                    yearlyPrice.css('display', 'none');

                }else {
                    yearlySelectBtn.addClass('active');
                    monthlySelectBtn.removeClass('active');
                    monthlyPrice.css('display', 'none');
                    yearlyPrice.css('display', 'block');
                    
                }
            });
        },

        slickSlider: function () {
            $('.testimonial-item-3').slick({
                dots: true,
                infinite: true,
                arrows: false,
                speed: 500,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    }, 
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }, 
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

            $('.just-one-click').slick({
                dots: true,
                infinite: true,
                arrows: false,
                speed: 500,
                slidesToShow: 6,
                slidesToScroll: 5,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    }, 
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 3
                        }
                    }, 
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 520,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }
                ]
            });

            $('.new-items').slick({
                dots: true,
                infinite: true,
                arrows: false,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }, 
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }, 
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 520,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

             $('.homepageslider').slick({
                dots: true,
                infinite: true,
                arrows: false,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }, 
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }, 
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 520,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        },

        counterUp: function () {
            var odo = $('.odometer');
            odo.each(function() {
                $('.odometer').appear(function(e) {
                    var countNumber = $(this).attr('data-count');
                    $(this).html(countNumber);
                });
            });
        },

        boxHover: function(){
            jQuery( '.ace-instructor-design-visible, .aceorbit-hover-item-visible' ).on( 'mouseenter', function(){
                let selector = jQuery(this).parent().parent();
                selector.find( '.ace-instructor-design-visible, .aceorbit-hover-item-visible' ).removeClass( 'aceorbit-hover-active' );
                jQuery(this).addClass( 'aceorbit-hover-active' );
            });
        },


        salActive: function () {
            sal({
                threshold: 0.01,
                once: true,
            });
        },

        wowActivation: function () {
            new WOW().init();
        }
        
    }

    aceorbitJs.i();

})(window, document, jQuery)


