// Spark Backbone JS application

(function($){

// Spark Application
  var AppView = Backbone.View.extend({
  		el: '#infograph_application',

  		// Default Variables for Application
  		defaults: function() {
  			return {
                sidebarTop: null
  			}
  		},

  		//Delegated Events for user actions
  		events: {
            "click .menu-button"            : "toggleNav",
      		"click #site-menu .close"        : "closeNav",
            "click .post-preview"           : "toggleInfographic",
            "click a#about"                 : "activateModal",
            "click a#commenting"            : "activateModal",
            "click .close"                  : "closeModal",
            "click .customNavigation .next" : "nextOwl",
            "click .customNavigation .prev" : "prevOwl"
  		},

  		//Initialization function
  		initialize: function(){
            var self = this;

            this.initOwl();
            this.initInfograph();
            // this.recommendedFixed(); 
            this.scrollSharebar();
  		},

  		initOwl: function(){

            var owl = $('#menu');

            owl.owlCarousel({

            lazyLoad : true,
            center: true,
            items: 2,
            margin: 20,
            loop: true,
                navigation : false, // Show next and prev buttons
                pagination: false,
                autoHeight: true,
                responsiveRefreshRate: 0,
                responsive:{
                    0: {
                        items: 1
                    },
                    500:{
                        items:2
                    },
                    1000:{
                        items:3
                    }
                }
            });
            
            $('header .next').click(function() {
                owl.trigger('next.owl.carousel');
            })
            
            // Go to the previous item
            $('header .prev').click(function() {
                // With optional speed parameter
                // Parameters has to be in square bracket '[]'
                owl.trigger('prev.owl.carousel', [300]);
            });
                
            var sync1 = $('#opinionpieces'),
            sync2 = $('#opinionsources'),
            flag = false,
            duration = 300;
            
            sync1.owlCarousel({
                autoHeight: true,
                animateIn: 'fadeInDown',
                center: true,
                items: 1,
                margin: 100,
                mouseDrag: false,
                nav: false,
                responsiveRefreshRate: 0,
                stagePadding:0,
            })
            .on('changed.owl.carousel', function (e) {
                if (!flag) {
                    flag = true;
                    sync2.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });
            
            sync2.owlCarousel({
                items: 3,
                nav: false,
                responsiveRefreshRate: 0,
                responsive:{
                    0: {
                        items: 1,
                        margin: 60
                    },
                    500:{
                        items:2,
                        margin: 60
                    },
                    800: {
                        margin: 40
                    },
                    1000:{
                        // margin: 120
                    }
                },
                startPosition: 1,
            })
            .on('click', '.owl-item', function () {
                sync1.trigger('to.owl.carousel', [$(this).index(), duration, true]);

            })
            .on('changed.owl.carousel', function (e) {
                if (!flag) {
                    flag = true;        
                    sync1.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });
            //Hide/Show Opinion Pieces
            sync1.hide();
            $('.source').click(function() {
                if (sync1.hasClass('closed')) {
                    sync1.slideToggle();
                    sync1.removeClass('closed');
                }
                else if ($(this).hasClass('current')) {
                    if (!sync1.hasClass('closed')) {
                        sync1.slideToggle();
                        sync1.addClass('closed');
                    }
                }
            });
            $('.closequote').click(function() {
                if (!sync1.hasClass('closed')) {
                    sync1.slideToggle();
                    sync1.addClass('closed');
                }
            });
            $('.source').click(function() {
                $(this).toggleClass( 'current');
                $('.source').not(this).removeClass('current');
            });
  		},

        nextOwl: function(){
            var owl = $('#menu').data('owlCarousel');
            owl.next();
        },

        prevOwl: function(){
            var owl = $('#menu').data('owlCarousel');
            owl.prev();            
        },

        initInfograph: function(){
            $('.card')
                .on('click', function(){  
                    $(this).toggleClass('flip');
                })
                .on('mouseleave', function(){
                    $(this).removeClass('flip');
                });
        },

        toggleNav: function(){
            $("#site-menu").toggleClass('on');
            $("header").toggleClass('on');
        },        
        closeNav: function(){
            $("#site-menu").removeClass('on');
            $("header").removeClass('on');
        },

        toggleInfographic: function(){
            $('#infographic').toggleClass('open');
            $('#article').toggleClass('open');
        },

        recommendedFixed: function(){
            var self = this;
            var elem = $("#recommended-articles");
            self.defaults.sidebarTop = elem.offset().top;
            $('.tiles').on( 'transitionend', function() { 
                 self.defaults.sidebarTop = elem.offset().top;1 
            });

            $(window).scroll(function(){
                var windowTop = $(this).scrollTop();
                var opinionOffset = $('#opinions').offset().top;
                console.log(opinionOffset - windowTop);
                if ( self.defaults.sidebarTop < windowTop && !elem.hasClass('sticky') ){
                    elem.addClass('sticky');
                }  
                else if ( ( opinionOffset - windowTop ) < 900 ){
                    elem.addClass( 'sticky-bottom' );
                } 
                else if ( ( opinionOffset - windowTop ) > 900 && elem.hasClass('sticky-bottom')) {
                    elem.removeClass('sticky-bottom');
                }
                else if ( self.defaults.sidebarTop > windowTop && elem.is('.sticky') ) {
                    elem.removeClass('sticky');
                }

            })
        },

        scrollSharebar: function(){
            $(window).scroll(function(){
                if ( $(window).scrollTop() > 100 && !$('#share-bar').hasClass('open') ) {
                    $('#share-bar').addClass('open');
                } else if ( $(this).scrollTop() <= 100 ) {
                    $('#share-bar').removeClass('open');
                }   
            });         
        },

        activateModal: function(elem){
            $('.infograph-modal').addClass('on');

            var box = '#' + $(elem.srcElement).attr('id');
            $('.infograph-modal').find(box).addClass('on');
        },

        closeModal: function(elem){
            $(".infograph-modal.on").removeClass('on');
            $(".box.on").removeClass('on');
        }

  });

  $(document).ready(function(){
  		var App = new AppView;
  })
  

})(jQuery);