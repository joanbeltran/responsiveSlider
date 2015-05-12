// Home slider
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "homeSlider",
        dataPlugin = "plugin_" + pluginName,
        defaults = {
            itemClass : '.expo',
            contentClass : '.slidercontent',
            prevClass : '.prev',
            nextClass : '.next',
            timeInterval : 10000 //must be more than 500, use false for disabling
        };

     // PRIVATE METHODS
    var setSlider = function(content, slidesNumber, slideWidth, nextPrev){
        var actual = content.data('actualSlide');
        if(actual > slidesNumber && nextPrev == 'next') {
            content.css({'left' : '0px'});
            content.data('actualSlide' , 1);
        } else if((actual == 1 || actual > slidesNumber) && nextPrev == 'prev') {
            content.css({'left' : (slidesNumber*slideWidth)*(-1)});
            content.data('actualSlide' , slidesNumber+1);
        }
    };
    var animateSlider = function(content, slidesNumber, slideWidth, nextPrev) {
        if(nextPrev == 'prev') {
            var direction = "+";
            var actualize = content.data('actualSlide')-1;
        } else {
            var direction = "-";
            var actualize = content.data('actualSlide')+1;
        }
        content.data('isMoving' , true);
        content.animate({
            'left' : direction+'='+slideWidth+'px'
        }, 250, function() {
            content.data({
                'actualSlide' : actualize,
                'isMoving' : false
            });
            updateCounter(content, slidesNumber);
        });
    };
    var startMagic = function(content, slidesNumber, slideWidth, nextPrev, options) {
        setSlider(content, slidesNumber, slideWidth, nextPrev);
        animateSlider(content, slidesNumber, slideWidth, nextPrev);
        $('#progress-expo > div').animate({'width': slideWidth}, options.timeInterval-250, function() {
            $(this).width(0);
        });  
    };
    var moveByTime = function(content, slidesNumber, slideWidth, options) {
        if(options.timeInterval != false) {
            var interval = setInterval(function(){ 
                startMagic(content, slidesNumber, slideWidth, 'next', options);
            }, options.timeInterval);
            content.data('timer', interval);       
        }
    };
    var leftOrRight = function(content, slidesNumber, slideWidth, nextPrev, options) {
        if(!content.data('isMoving')) {
            if(options.timeInterval != false) {
                clearTimeout(content.data('timer'));
                $('#progress-expo > div').stop().width(0);
            }
            startMagic(content, slidesNumber, slideWidth, nextPrev, options);
            moveByTime(content, slidesNumber, slideWidth, options);
        }
    }
    var movebyButtons = function(content, slidesNumber, slideWidth, options) {
        $('.next').click(function(e) {
            e.preventDefault;
            e.stopPropagation;
            leftOrRight(content, slidesNumber, slideWidth, 'next', options);
        });
        $('.prev').click(function(e) {
            e.preventDefault;
            e.stopPropagation;
            leftOrRight(content, slidesNumber, slideWidth, 'prev', options);
        });
    };
    var setCounter = function(content, slidesNumber, slideWidth) {
        var counter = "<div id='counter'><ul></ul></div>";
        content.parent().before(counter);
        var marginleft = ((slideWidth/2)-((slidesNumber*20)/2))+20;
        $('#counter').css({'margin-left' : marginleft+'px'});
        for(var i = 1; i <= slidesNumber; i++) {
            $('#counter').children().append("<li id='expo"+i+"'>·</li>")
        }
        $('#counter > ul > li:first').addClass('active');
    };
    var updateCounter = function(content, slidesNumber) {
        var actual = content.data('actualSlide');
        $('#counter > ul > li').removeClass('active');
        if(actual == slidesNumber+1) {
            $('#counter > ul > li:first').addClass('active');
        } else {
            $('#counter > ul > li').eq(actual-1).addClass('active');
        }
    };
    var start = function(element, options) {
        var $content = $(options.contentClass);
        var slides = element.find(options.itemClass);
        var slidesNumber = slides.length;
        var slideWidth = slides.width();
        $content.data({
            'actualSlide' : 1,
            'isMoving' : false,
            'timer' : false
        });
        $content.width((slidesNumber +1)*slideWidth);
        var temp = $(options.itemClass).eq(0).clone();
        $content.append(temp);
        temp.addClass('infiniter');
        if(slidesNumber > 1) {
            $content.parent().before('<a href="#" class="prev"></a><a href="#" class="next"></a>');
            setCounter($content, slidesNumber, slideWidth);
            var progressBar = "<div id='progress-expo'><div></div></div>";
            $content.parent().before(progressBar);
            $('#progress-expo > div').animate({'width': slideWidth}, options.timeInterval-250, function() {
                $(this).width(0);
            });
            movebyButtons($content, slidesNumber, slideWidth, options);
            moveByTime($content, slidesNumber, slideWidth, options);
        }
        
    };
    var semiDestroy = function(elem, opts) {
        $('.next').remove();
        $('.prev').remove();
        $('#progress-expo').remove();
        $('#counter').remove();
        $(opts.contentClass).removeAttr('style');
        $('.infiniter').remove();
        clearTimeout($(opts.contentClass).data('timer'));
        $(opts.contentClass).data('timer', false);
    };

    // The actual plugin constructor
    var Plugin = function ( element ) {
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {
        init: function ( options ) {
            $.extend( this.options, options );
            $hSlider = $(this.element);
            start($hSlider, this.options);
        },
        update : function() {
            semiDestroy($hSlider, this.options);
            start($hSlider, this.options);
        }
    };

    $.fn[ pluginName ] = function ( arg ) {
        var args, instance;
        if (!( this.data( dataPlugin ) instanceof Plugin )) {
            this.data( dataPlugin, new Plugin( this ) );
        }
        instance = this.data( dataPlugin );
        instance.element = this;
        if (typeof arg === 'undefined' || typeof arg === 'object') {
            if ( typeof instance['init'] === 'function' ) {
                instance.init( arg );
            }
        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {
            args = Array.prototype.slice.call( arguments, 1 );
            return instance[arg].apply( instance, args );
        } else {
            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);
        }
    };

})( jQuery, window, document );

/*
fitImages 1.3 author: Joan Beltran
MIT License
*/ 
;(function ( $, window, document, undefined ) {

    var fitImages = "fitImages",
    dataPlugin = "plugin_" + fitImages,
    // default options
    defaults = {
        animation : 'fade', // fade or nothing
        animationTime: 400, // animation time
        fitMethod : 'crop', // crop or resize
        responsive : true // true or false
    };
    
    // PRIVATE METHODS
    var getDims = function(elem) {
        var offset = $(elem).offset();
        return {
            offsetTop: offset.top,
            offsetLeft: offset.left,
            width: $(elem).outerWidth(),
            height: $(elem).outerHeight(),
            innerWidth: $(elem).innerWidth(),
            innerHeight: $(elem).innerHeight()
        };
    };
    var getProportion = function(containerDims, imageDims, options) {
        var prop = containerDims.innerWidth/imageDims.width;
        if (options.fitMethod && options.fitMethod=='resize') {
            if (containerDims.innerHeight/imageDims.height < prop) {
                prop = containerDims.innerHeight/imageDims.height;
            }
        } else {
            if (containerDims.innerHeight/imageDims.height > prop) {
                prop = containerDims.innerHeight/imageDims.height;
            }
        }
        return prop;
    };
    var showImage = function(image, ih, iw, left, top, options) {
        image.css({
            'width':iw,
            'height':ih,
            'top':top,
            'left':left
        });
        if (options.animation == 'fade') {
            image.fadeIn(options.animationTime);

        } else {
            image.css('display','inline');
        }
    };
    var resize = function(image, imageDims, container, containerDims, prop, options) {
        var iw = imageDims.width * prop;
        var ih = imageDims.height * prop;
        var top = 0, left = 0, diff;
        if (ih<containerDims.innerHeight) {
            top=-(ih-containerDims.innerHeight)/2;
        } else if (ih>containerDims.innerHeight) {
            top=-(ih-containerDims.innerHeight)/2;
        }
        if (iw<containerDims.innerWidth) {
            left=-(iw-containerDims.innerWidth)/2;
        } else if (iw>containerDims.innerWidth) {
            left=-(iw-containerDims.innerWidth)/2;
        }
        showImage(image, ih, iw, left, top, options);
    };
    var fitImage = function(image, container, options) {
        var imageDims = getDims(image);
        var containerDims = getDims(container);
        var prop = getProportion(containerDims,imageDims,options);
        resize(image, imageDims, container, containerDims, prop, options);  
    };
    var setImage = function(element) {
        var image = element.find('img').first();
        image.css('position', 'relative');
        return image;
    };
    var startOnLoad = function(image, container, options) {  
        image.one('load', function() {
            fitImage(image, container, options);
        }).each(function() {
          if(this.complete) $(this).load();
        });
        var src = image.attr('src');
        image.attr('src',null).attr('src',src);
    };

    var semiDestroy = function(elem) {
        elem.find('img').removeAttr('style');
        elem.removeAttr('style');
    };
    
    // CONSTRUCTOR
    var Plugin = function ( element ) {
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {
        init: function(options) {
            $.extend( this.options, options );
            var $element = $(this.element);
            var options = this.options;
            var image = setImage($element);
            startOnLoad(image, $element, options);
            if (options.responsive) {
                $(window).resize(function() {
                    fitImage(image, $element, options);
                });
            }
        },
        destroy: function() {
            semiDestroy(this.element);
            this.element.data( dataPlugin, null );
        },
        update: function(){
            semiDestroy(this.element);
            var $element = $(this.element);
            var image = setImage($element, this.options);
            fitImage(image, $element, this.options);
        }

    };

    $.fn[fitImages] = function ( arg ) {
        var args, instance;
        return this.each(function () {
            if (!( $(this).data( dataPlugin ) instanceof Plugin )) {
                $(this).data( dataPlugin, new Plugin( $(this) ) );
            }
            instance = $(this).data( dataPlugin );
            instance.element = $(this);
            if (typeof arg === 'undefined' || typeof arg === 'object') {
                if ( typeof instance['init'] === 'function' ) {
                    instance.init( arg );
                }
            } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {
                args = Array.prototype.slice.call( arguments, 1 );
                return instance[arg].apply( instance, args );
            } else {
                $.error('Method ' + arg + ' does not exist on jQuery.' + fitImages);
            }
        });
    };

})( jQuery, window, document );

/*
responsiveSlider 1.0 
author: Joan Beltran
MIT License
*/ 
// depends on imagesLoaded, fitImages, mousewheel & TouchSwipe
;(function ( $, window, document, undefined ) {

    var pluginName = "responsiveSlider",
        dataPlugin = "plugin_" + pluginName,
    // default options
        defaults = {
            direction : 'horizontal', // vertical or horizontal
            pager :             true,
            pagerClickable :    true,
            controls : {
                buttons :       true,
                keyboard :      false,
            },
            fadeTime :          1000, // milliseconds
            moveTime :          800, // milliseconds
            moveByTimer :       true,
            timerTime :         15000, // milliseconds
            responsive :        true,
            infinite :          true
        };

    // PRIVATE METHODS
    var getSize = function(elem) {
        return {
            'width' : elem.width(),
            'height' : elem.height()
        };
    };

    var makeTotalSize = function(elem, slidesNumber, size, first, options) {
        var $content = elem.find('.rs-content');
        var contentSize = {
            'width' : size.width,
            'height' : size.height
        }
        var sum = 0;
        if(options.infinite) {
            sum = 1;
        }
        
        if(options.direction == 'horizontal') {
            contentSize.width *= (slidesNumber + sum);
        } else {
            contentSize.height *= (slidesNumber + sum);
        }
        $content.css({
            'width' : contentSize.width,
            'height' : contentSize.height
        });
        elem.fadeIn(options.fadeTime);
    };

    var markPager = function(elem, slidesNumber, options) {
        var theSlide = elem.data('actualSlide');
        if(options.infinite && theSlide == slidesNumber) {
            theSlide = 0;
        }
        var pager = elem.find('.rs-pager');
        var previousActive = pager.find('.active');
        if(previousActive) {
            previousActive.removeClass('active');
        }
        var activePager = $('.rs-pager').find('#pager-' + theSlide);
        activePager.addClass('active');
    };

    var markButtons = function(elem, slidesNumber, options) {
        if(!options.infinite) {
            var theSlide = elem.data('actualSlide');
            if(theSlide == 0) {
                $('.rs-previous').css({
                    'display': 'none'
                });
            } else if(theSlide == 1) {
                $('.rs-previous').fadeIn(options.fadeTime);
            }
            if(theSlide == (slidesNumber -1)) {
                $('.rs-next').fadeOut(options.fadeTime);
            } else if(theSlide != (slidesNumber -1)) {
                $('.rs-next').fadeIn(options.fadeTime);
            }
        }  
    };

    var movePrevious = function(elem, size, slidesNumber, options) {
        if(elem.data('isMoving')) {
            return;
        }
        var theSlide = elem.data('actualSlide');
        var keepMoving = true;
        if(!options.infinite) {
            if(theSlide == 0) {
                keepMoving = false;
            }
        }
        if(options.direction == 'horizontal' && keepMoving) {
            if(options.infinite && theSlide == 0) {
                var moveTheLast = slidesNumber * size.width;
                elem.find('.rs-wrap').scrollLeft(moveTheLast);
                theSlide = slidesNumber;
            } 
            var move = (size.width * theSlide) - size.width;
            theSlide -= 1;
            elem.data('isMoving', true);
            elem.find('.rs-wrap').animate({scrollLeft: move}, options.moveTime, 'swing', function() {
                elem.data('isMoving', false);
            });
            
        } else if(options.direction == 'vertical' && keepMoving) {
            var move = (size.height * theSlide) - size.height;
            elem.find('.rs-wrap').animate({scrollTop: move}, options.moveTime, 'swing');
            theSlide -= 1;
        }
        elem.data('actualSlide', theSlide);
        if(options.controls.buttons) {
            markButtons(elem, slidesNumber, options);
        }
        if(options.pager) {
            markPager(elem, slidesNumber, options);
        }
    };

    var moveNext = function(elem, size, slidesNumber, options) {
        if(elem.data('isMoving')) {
            return;
        }
        var theSlide = elem.data('actualSlide');
        var keepMoving = true;
        if(!options.infinite) {
            var maxSlides = slidesNumber - 1;
            if(theSlide == maxSlides) {
                keepMoving = false;
            }
        }
        if(options.direction == 'horizontal' && keepMoving) {
            if(options.infinite && theSlide == slidesNumber) {
                elem.find('.rs-wrap').scrollLeft(0);
                theSlide = 0;
            } 
            var move = (size.width * theSlide) + size.width;
            theSlide += 1;
            elem.data('isMoving', true);
            elem.find('.rs-wrap').animate({scrollLeft: move}, options.moveTime, 'swing', function() {
                elem.data('isMoving', false);
            });
        } else if(options.direction == 'vertical' && keepMoving) {
            if(options.infinite && theSlide == slidesNumber) {
                elem.find('.rs-wrap').scrollTop(0);
                theSlide = 0;
            } 
            var move = (size.height * theSlide) + size.height;
            theSlide += 1;
            elem.data('isMoving', true);
            elem.find('.rs-wrap').animate({scrollTop: move}, options.moveTime, 'swing', function() {
                elem.data('isMoving', false);
            });
        }
        elem.data('actualSlide', theSlide);
        if(options.controls.buttons) {
            markButtons(elem, slidesNumber, options);
        }
        if(options.pager) {
            markPager(elem, slidesNumber, options);
        }
        
    };

    var moveByPager = function(elem, size, slidesNumber, options) {
        var $pagerButtons = elem.find('.rs-pager > div > div');
        $pagerButtons.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(options.moveByTimer) {
                stopTimerMoving(elem, options);
            }
            var $slideToGoClass = $(this).attr('id');
            var slideToGo = parseInt($slideToGoClass.slice(6));
            if(options.direction == 'horizontal') {
                var move = slideToGo * size.width;
                elem.find('.rs-wrap').scrollLeft(move);
            } else {
                var move = slideToGo * size.height;
                elem.find('.rs-wrap').scrollTop(move);
            }
            elem.data('actualSlide', slideToGo);
            if(options.controls.buttons) {
                markButtons(elem, slidesNumber, options);
            }
            markPager(elem, slidesNumber, options);
        });
    };

    var makeTimerBar = function(elem, size, slidesNumber, options) {
        var timerBar = "<div id='timer-bar' class='"+ options.direction +"'><div></div></div>";
        elem.append(timerBar);
        if(options.direction == 'horizontal') {
            $('#timer-bar > div').animate({'width' : size.width+'px'}, options.timerTime);
        } else {
            $('#timer-bar > div').animate({'height' : size.height+'px'}, options.timerTime);
        }
    };

    var stopTimerMoving = function(elem, options) {
        clearTimeout(elem.data('timer'));
        $('#timer-bar').remove();

    };

    var startTimerMoving = function(elem, size, slidesNumber, options) {
        var theSlide = elem.data('actualSlide');
        makeTimerBar(elem, size, slidesNumber, options);
        var interval = setInterval(function(){ 
            var theActualSlide = elem.data('actualSlide');
            if(theActualSlide == (slidesNumber - 1) && !options.infinite) {
                moveNext(elem, size, slidesNumber, options);
                stopTimerMoving(elem, options);
            } else {
                moveNext(elem, size, slidesNumber, options);
                $('#timer-bar').remove();
                makeTimerBar(elem, size, slidesNumber, options);
            }  
        }, options.timerTime);
        elem.data('timer', interval);
    };

    var makeButtons = function(elem, size, slidesNumber, options) {
        var buttonsUrl = 'statics/img/buttons-' + options.direction + '.png';
        var buttonWidth = 120;
        var buttonHeight = 120;
        if(options.direction == 'horizontal') { 
            var buttonMargin = 'margin-top:' + (size.height - buttonHeight) / 2 + "px;";
        } else {
            var buttonMargin = "margin-left:" + (size.width - buttonWidth) / 2 + "px;";
        }
        var controlButtons = "<div class='rs-previous " + options.direction + "' style='" + buttonMargin + "'><div class='inside'><img src='" + buttonsUrl + "'></div></div><div class='rs-next " + options.direction +"' style='" + buttonMargin + "'><div class='inside'><img src='" + buttonsUrl + "'></div></div>"
        elem.append(controlButtons);
        markButtons(elem, slidesNumber, options);
        elem.find('.rs-previous').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(options.moveByTimer) {
                stopTimerMoving(elem, options);
            }
            movePrevious(elem, size, slidesNumber, options);
        });
        elem.find('.rs-next').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(options.moveByTimer) {
                stopTimerMoving(elem, options);
            }
            moveNext(elem, size, slidesNumber, options);
        });
    };

    var makePager = function(elem, size, slidesNumber, options) {
        var pages = '';
        var i = 0;
        for(i; i < slidesNumber; i++) {
            pages += "<div><div id='pager-"+ i +"'></div></div>";
        }
        // ARREGLAR AIXÒ!! S'ha de tenir en compte la mida per si te cover o no, no pot anar per css
        var shortSideSize = 20;
        var longSideSize = slidesNumber * shortSideSize;
        if(options.direction == 'horizontal') {
            var pagerSize = 'height: ' + shortSideSize + 'px; width:' + longSideSize +'px; ';
            var pagerPosition = 'top: 0; ';
            var pagerMargin = 'margin: 6px ' + ((size.width - longSideSize) / 2) + 'px;';
        } else {
            var pagerSize = 'height: ' + longSideSize +'px; width: ' + shortSideSize + 'px; ';
            var pagerPosition = 'right: 0; ';
            var pagerMargin = 'margin: '+ ((size.height - longSideSize) / 2) +'px 6px; ';
        }
        var pager = "<div class='rs-pager' style='"+ pagerSize + pagerPosition + pagerMargin + "'>"+ pages +"</div>"
        elem.append(pager);
        markPager(elem, slidesNumber, options);
        if(options.pagerClickable) {
            moveByPager(elem, size, slidesNumber, options);
        }
    };

    var makeKeys = function(elem, size, slidesNumber, options) {
        var theSlide = elem.data('actualSlide');
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: 
                movePrevious(elem, size, slidesNumber, options); // left
                break;

                case 38: movePrevious(elem, size, slidesNumber, options); // up
                break;

                case 39: moveNext(elem, size, slidesNumber, options); // right
                break;

                case 40: moveNext(elem, size, slidesNumber, options); // down
                break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
            e.stopPropagation();
        });
        if(options.moveByTimer) {
            $(document).keydown(function(e) {
                switch(e.which) {
                    case 37:
                    case 38:
                    case 39:
                    case 40: 
                        stopTimerMoving(elem, options);
                    break;

                    default: return; // exit this handler for other keys
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
                e.stopPropagation();
            });
        }
    };

    var keepPosition = function(elem, size) {
        var thelSlide = elem.data('actualSlide');
        var wrap = elem.find('.rs-wrap');
        var position = {
            'width' : thelSlide * size.width,
            'height' : thelSlide * size.height
        };
        wrap.scrollLeft(position.width);
        wrap.scrollTop(position.height);
    };

    var start = function(elem, first, options) {
        var $slides = elem.find('.rs-slide');
        var slidesNumber = $slides.length;
        var size = getSize(elem);
        if(first) {
            elem.children().wrap( "<div class='rs-wrap' style='width:" + size.width + "px; height:" + size.height + "px;'></div>" );
            if(options.infinite) {
                var temp = $slides.eq(0).clone();
                elem.find('.rs-content').append(temp);
                temp.addClass('infiniter');
            }
        } else {
            elem.find('.rs-wrap').css({
                'width' : size.width,
                'height' : size.height
            });
            slidesNumber -= 1;
        }
        makeTotalSize(elem, slidesNumber, size, first, options);
        keepPosition(elem, size);
        var $allSlides = elem.find('.rs-slide');
        if(!first) {
            $allSlides = $slides;
        }
        $allSlides.css({
            'width' : size.width,
            'height' : size.height
        });
        if(first) {
            elem.find('.rs-slide-bg').fitImages({
                fitMethod : 'resize'
            });
            for(var i = 0; i < slidesNumber; i++) {
                $($slides[i]).attr('id', 's' + i);
            }
        }
        if(options.controls.buttons) {
            makeButtons(elem, size, slidesNumber, options);
        }
        if(options.controls.keyboard) {
            makeKeys(elem, size, slidesNumber, options);
        }
        if(options.pager) {
            makePager(elem, size, slidesNumber, options);
        }
        if(options.moveByTimer && elem.data('actualSlide') != slidesNumber-1) {
            startTimerMoving(elem, size, slidesNumber, options);
        }
    };

    // The actual plugin constructor
    var Plugin = function ( element ) {
        this.options = $.extend( {}, defaults );
    };

    Plugin.prototype = {
        init: function ( options ) {
            $.extend( this.options, options );
            var slider = this.element;
            var $slider = $(slider);
            var options = this.options;
            $slider.data({
                'actualSlide': 0,
                'timer' : false,
                'isMoving' : false
            });
            start($slider, true, options);
            if (options.responsive) {
                $(window).resize(function() {
                    // es desactiven els moviments abans de reiniciar, ja que les mides canvien i es tornen a reinicialitzar
                    if(options.controls.buttons) {
                        $slider.find('.rs-next, .rs-previous').remove();
                    }
                    if(options.pager) {
                        $slider.find('.rs-pager').remove();
                    }
                    if(options.controls.keyboard) {
                        $(document).unbind('keydown');
                    }
                    if(options.moveByTimer) {
                        stopTimerMoving($slider, options);
                    }
                    start($slider, false, options);
                });
            }
        }
    }


    $.fn[ pluginName ] = function ( arg ) {
        var args, instance;
        if (!( this.data( dataPlugin ) instanceof Plugin )) {
            this.data( dataPlugin, new Plugin( this ) );
        }
        instance = this.data( dataPlugin );
        instance.element = this;
        if (typeof arg === 'undefined' || typeof arg === 'object') {
            if ( typeof instance['init'] === 'function' ) {
                instance.init( arg );
            }
        } else if ( typeof arg === 'string' && typeof instance[arg] === 'function' ) {
            args = Array.prototype.slice.call( arguments, 1 );
            return instance[arg].apply( instance, args );
        } else {
            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);
        }
    };

}(jQuery, window, document));