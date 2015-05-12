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

/*!
 * imagesLoaded PACKAGED v3.0.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},"function"==typeof define&&define.amd?define(function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){"use strict";var t=document.documentElement,n=function(){};t.addEventListener?n=function(e,t,n){e.addEventListener(t,n,!1)}:t.attachEvent&&(n=function(t,n,i){t[n+i]=i.handleEvent?function(){var t=e.event;t.target=t.target||t.srcElement,i.handleEvent.call(i,t)}:function(){var n=e.event;n.target=n.target||n.srcElement,i.call(t,n)},t.attachEvent("on"+n,t[n+i])});var i=function(){};t.removeEventListener?i=function(e,t,n){e.removeEventListener(t,n,!1)}:t.detachEvent&&(i=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var r={bind:n,unbind:i};"function"==typeof define&&define.amd?define(r):e.eventie=r}(this),function(e){"use strict";function t(e,t){for(var n in t)e[n]=t[n];return e}function n(e){return"[object Array]"===c.call(e)}function i(e){var t=[];if(n(e))t=e;else if("number"==typeof e.length)for(var i=0,r=e.length;r>i;i++)t.push(e[i]);else t.push(e);return t}function r(e,n){function r(e,n,s){if(!(this instanceof r))return new r(e,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=i(e),this.options=t({},this.options),"function"==typeof n?s=n:t(this.options,n),s&&this.on("always",s),this.getImages(),o&&(this.jqDeferred=new o.Deferred);var a=this;setTimeout(function(){a.check()})}function c(e){this.img=e}r.prototype=new e,r.prototype.options={},r.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},r.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},r.prototype.check=function(){function e(e,r){return t.options.debug&&a&&s.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},r.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify(t,e)})},r.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},o&&(o.fn.imagesLoaded=function(e,t){var n=new r(this,e,t);return n.jqDeferred.promise(o(this))});var f={};return c.prototype=new e,c.prototype.check=function(){var e=f[this.img.src];if(e)return this.useCached(e),void 0;if(f[this.img.src]=this,this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this.proxyImage=new Image;n.bind(t,"load",this),n.bind(t,"error",this),t.src=this.img.src},c.prototype.useCached=function(e){if(e.isConfirmed)this.confirm(e.isLoaded,"cached was confirmed");else{var t=this;e.on("confirm",function(e){return t.confirm(e.isLoaded,"cache emitted confirmed"),!0})}},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindProxyEvents()},c.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindProxyEvents()},c.prototype.unbindProxyEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this)},r}var o=e.jQuery,s=e.console,a=s!==void 0,c=Object.prototype.toString;"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],r):e.imagesLoaded=r(e.EventEmitter,e.eventie)}(window);


/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh) mousewheel
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

/*
* @fileOverview TouchSwipe - jQuery Plugin
* @version 1.6.6
*
* @author Matt Bryson http://www.github.com/mattbryson
* @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
* @see http://labs.skinkers.com/touchSwipe/
* @see http://plugins.jquery.com/project/touchSwipe
*
* Copyright (c) 2010 Matt Bryson
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/
(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(f){var p="left",o="right",e="up",x="down",c="in",z="out",m="none",s="auto",l="swipe",t="pinch",A="tap",j="doubletap",b="longtap",y="hold",D="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled,d=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,B="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe"};f.fn.swipe=function(G){var F=f(this),E=F.data(B);if(E&&typeof G==="string"){if(E[G]){return E[G].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+G+" does not exist on jQuery.swipe")}}else{if(!E&&(typeof G==="object"||!G)){return w.apply(this,arguments)}}return F};f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:z};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:D,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:i};function w(E){if(E&&(E.allowPageScroll===undefined&&(E.swipe!==undefined||E.swipeStatus!==undefined))){E.allowPageScroll=m}if(E.click!==undefined&&E.tap===undefined){E.tap=E.click}if(!E){E={}}E=f.extend({},f.fn.swipe.defaults,E);return this.each(function(){var G=f(this);var F=G.data(B);if(!F){F=new C(this,E);G.data(B,F)}})}function C(a4,av){var az=(a||d||!av.fallbackToMouseEvents),J=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ay=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",U=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",S=az?null:"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,ab=0,a1=0,aZ=0,G=1,aq=0,aJ=0,M=null;var aR=f(a4);var Z="start";var W=0;var aQ=null;var T=0,a2=0,a5=0,ad=0,N=0;var aW=null,af=null;try{aR.bind(J,aN);aR.bind(aD,a9)}catch(ak){f.error("events not supported "+J+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(J,aN);aR.bind(aD,a9);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(B,null);return aR};this.option=function(bc,bb){if(av[bc]!==undefined){if(bb===undefined){return av[bc]}else{av[bc]=bb}}else{f.error("Option "+bc+" does not exist on jQuery.swipe.options")}return null};function aN(bd){if(aB()){return}if(f(bd.target).closest(av.excludedElements,aR).length>0){return}var be=bd.originalEvent?bd.originalEvent:bd;var bc,bb=a?be.touches[0]:be;Z=g;if(a){W=be.touches.length}else{bd.preventDefault()}ag=0;aP=null;aJ=null;ab=0;a1=0;aZ=0;G=1;aq=0;aQ=aj();M=aa();R();if(!a||(W===av.fingers||av.fingers===i)||aX()){ai(0,bb);T=at();if(W==2){ai(1,be.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}if(av.swipeStatus||av.pinchStatus){bc=O(be,Z)}}else{bc=false}if(bc===false){Z=q;O(be,Z);return bc}else{if(av.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[be.target]);if(av.hold){bc=av.hold.call(aR,be,be.target)}},this),av.longTapThreshold)}ao(true)}return null}function a3(be){var bh=be.originalEvent?be.originalEvent:be;if(Z===h||Z===q||am()){return}var bd,bc=a?bh.touches[0]:bh;var bf=aH(bc);a2=at();if(a){W=bh.touches.length}if(av.hold){clearTimeout(af)}Z=k;if(W==2){if(a1==0){ai(1,bh.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}else{aH(bh.touches[1]);aZ=au(aQ[0].end,aQ[1].end);aJ=ar(aQ[0].end,aQ[1].end)}G=a7(a1,aZ);aq=Math.abs(a1-aZ)}if((W===av.fingers||av.fingers===i)||!a||aX()){aP=aL(bf.start,bf.end);al(be,aP);ag=aS(bf.start,bf.end);ab=aM();aI(aP,ag);if(av.swipeStatus||av.pinchStatus){bd=O(bh,Z)}if(!av.triggerOnTouchEnd||av.triggerOnTouchLeave){var bb=true;if(av.triggerOnTouchLeave){var bg=aY(this);bb=E(bf.end,bg)}if(!av.triggerOnTouchEnd&&bb){Z=aC(k)}else{if(av.triggerOnTouchLeave&&!bb){Z=aC(h)}}if(Z==q||Z==h){O(bh,Z)}}}else{Z=q;O(bh,Z)}if(bd===false){Z=q;O(bh,Z)}}function L(bb){var bc=bb.originalEvent;if(a){if(bc.touches.length>0){F();return true}}if(am()){W=ad}a2=at();ab=aM();if(ba()||!an()){Z=q;O(bc,Z)}else{if(av.triggerOnTouchEnd||(av.triggerOnTouchEnd==false&&Z===k)){bb.preventDefault();Z=h;O(bc,Z)}else{if(!av.triggerOnTouchEnd&&a6()){Z=h;aF(bc,Z,A)}else{if(Z===k){Z=q;O(bc,Z)}}}}ao(false);return null}function a9(){W=0;a2=0;T=0;a1=0;aZ=0;G=1;R();ao(false)}function K(bb){var bc=bb.originalEvent;if(av.triggerOnTouchLeave){Z=aC(h);O(bc,Z)}}function aK(){aR.unbind(J,aN);aR.unbind(aD,a9);aR.unbind(ay,a3);aR.unbind(U,L);if(S){aR.unbind(S,K)}ao(false)}function aC(bf){var be=bf;var bd=aA();var bc=an();var bb=ba();if(!bd||bb){be=q}else{if(bc&&bf==k&&(!av.triggerOnTouchEnd||av.triggerOnTouchLeave)){be=h}else{if(!bc&&bf==h&&av.triggerOnTouchLeave){be=q}}}return be}function O(bd,bb){var bc=undefined;if(I()||V()){bc=aF(bd,bb,l)}else{if((P()||aX())&&bc!==false){bc=aF(bd,bb,t)}}if(aG()&&bc!==false){bc=aF(bd,bb,j)}else{if(ap()&&bc!==false){bc=aF(bd,bb,b)}else{if(ah()&&bc!==false){bc=aF(bd,bb,A)}}}if(bb===q){a9(bd)}if(bb===h){if(a){if(bd.touches.length==0){a9(bd)}}else{a9(bd)}}return bc}function aF(be,bb,bd){var bc=undefined;if(bd==l){aR.trigger("swipeStatus",[bb,aP||null,ag||0,ab||0,W,aQ]);if(av.swipeStatus){bc=av.swipeStatus.call(aR,be,bb,aP||null,ag||0,ab||0,W,aQ);if(bc===false){return false}}if(bb==h&&aV()){aR.trigger("swipe",[aP,ag,ab,W,aQ]);if(av.swipe){bc=av.swipe.call(aR,be,aP,ag,ab,W,aQ);if(bc===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ab,W,aQ]);if(av.swipeLeft){bc=av.swipeLeft.call(aR,be,aP,ag,ab,W,aQ)}break;case o:aR.trigger("swipeRight",[aP,ag,ab,W,aQ]);if(av.swipeRight){bc=av.swipeRight.call(aR,be,aP,ag,ab,W,aQ)}break;case e:aR.trigger("swipeUp",[aP,ag,ab,W,aQ]);if(av.swipeUp){bc=av.swipeUp.call(aR,be,aP,ag,ab,W,aQ)}break;case x:aR.trigger("swipeDown",[aP,ag,ab,W,aQ]);if(av.swipeDown){bc=av.swipeDown.call(aR,be,aP,ag,ab,W,aQ)}break}}}if(bd==t){aR.trigger("pinchStatus",[bb,aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchStatus){bc=av.pinchStatus.call(aR,be,bb,aJ||null,aq||0,ab||0,W,G,aQ);if(bc===false){return false}}if(bb==h&&a8()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchIn){bc=av.pinchIn.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break;case z:aR.trigger("pinchOut",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchOut){bc=av.pinchOut.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break}}}if(bd==A){if(bb===q||bb===h){clearTimeout(aW);clearTimeout(af);if(Y()&&!H()){N=at();aW=setTimeout(f.proxy(function(){N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}},this),av.doubleTapThreshold)}else{N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}}}}else{if(bd==j){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("doubletap",[be.target]);if(av.doubleTap){bc=av.doubleTap.call(aR,be,be.target)}}}else{if(bd==b){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("longtap",[be.target]);if(av.longTap){bc=av.longTap.call(aR,be,be.target)}}}}}return bc}function an(){var bb=true;if(av.threshold!==null){bb=ag>=av.threshold}return bb}function ba(){var bb=false;if(av.cancelThreshold!==null&&aP!==null){bb=(aT(aP)-ag)>=av.cancelThreshold}return bb}function ae(){if(av.pinchThreshold!==null){return aq>=av.pinchThreshold}return true}function aA(){var bb;if(av.maxTimeThreshold){if(ab>=av.maxTimeThreshold){bb=false}else{bb=true}}else{bb=true}return bb}function al(bb,bc){if(av.allowPageScroll===m||aX()){bb.preventDefault()}else{var bd=av.allowPageScroll===s;switch(bc){case p:if((av.swipeLeft&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case o:if((av.swipeRight&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case e:if((av.swipeUp&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break;case x:if((av.swipeDown&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break}}}function a8(){var bc=aO();var bb=X();var bd=ae();return bc&&bb&&bd}function aX(){return !!(av.pinchStatus||av.pinchIn||av.pinchOut)}function P(){return !!(a8()&&aX())}function aV(){var be=aA();var bg=an();var bd=aO();var bb=X();var bc=ba();var bf=!bc&&bb&&bd&&bg&&be;return bf}function V(){return !!(av.swipe||av.swipeStatus||av.swipeLeft||av.swipeRight||av.swipeUp||av.swipeDown)}function I(){return !!(aV()&&V())}function aO(){return((W===av.fingers||av.fingers===i)||!a)}function X(){return aQ[0].end.x!==0}function a6(){return !!(av.tap)}function Y(){return !!(av.doubleTap)}function aU(){return !!(av.longTap)}function Q(){if(N==null){return false}var bb=at();return(Y()&&((bb-N)<=av.doubleTapThreshold))}function H(){return Q()}function ax(){return((W===1||!a)&&(isNaN(ag)||ag<av.threshold))}function a0(){return((ab>av.longTapThreshold)&&(ag<r))}function ah(){return !!(ax()&&a6())}function aG(){return !!(Q()&&Y())}function ap(){return !!(a0()&&aU())}function F(){a5=at();ad=event.touches.length+1}function R(){a5=0;ad=0}function am(){var bb=false;if(a5){var bc=at()-a5;if(bc<=av.fingerReleaseThreshold){bb=true}}return bb}function aB(){return !!(aR.data(B+"_intouch")===true)}function ao(bb){if(bb===true){aR.bind(ay,a3);aR.bind(U,L);if(S){aR.bind(S,K)}}else{aR.unbind(ay,a3,false);aR.unbind(U,L,false);if(S){aR.unbind(S,K,false)}}aR.data(B+"_intouch",bb===true)}function ai(bc,bb){var bd=bb.identifier!==undefined?bb.identifier:0;aQ[bc].identifier=bd;aQ[bc].start.x=aQ[bc].end.x=bb.pageX||bb.clientX;aQ[bc].start.y=aQ[bc].end.y=bb.pageY||bb.clientY;return aQ[bc]}function aH(bb){var bd=bb.identifier!==undefined?bb.identifier:0;var bc=ac(bd);bc.end.x=bb.pageX||bb.clientX;bc.end.y=bb.pageY||bb.clientY;return bc}function ac(bc){for(var bb=0;bb<aQ.length;bb++){if(aQ[bb].identifier==bc){return aQ[bb]}}}function aj(){var bb=[];for(var bc=0;bc<=5;bc++){bb.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return bb}function aI(bb,bc){bc=Math.max(bc,aT(bb));M[bb].distance=bc}function aT(bb){if(M[bb]){return M[bb].distance}return undefined}function aa(){var bb={};bb[p]=aw(p);bb[o]=aw(o);bb[e]=aw(e);bb[x]=aw(x);return bb}function aw(bb){return{direction:bb,distance:0}}function aM(){return a2-T}function au(be,bd){var bc=Math.abs(be.x-bd.x);var bb=Math.abs(be.y-bd.y);return Math.round(Math.sqrt(bc*bc+bb*bb))}function a7(bb,bc){var bd=(bc/bb)*1;return bd.toFixed(2)}function ar(){if(G<1){return z}else{return c}}function aS(bc,bb){return Math.round(Math.sqrt(Math.pow(bb.x-bc.x,2)+Math.pow(bb.y-bc.y,2)))}function aE(be,bc){var bb=be.x-bc.x;var bg=bc.y-be.y;var bd=Math.atan2(bg,bb);var bf=Math.round(bd*180/Math.PI);if(bf<0){bf=360-Math.abs(bf)}return bf}function aL(bc,bb){var bd=aE(bc,bb);if((bd<=45)&&(bd>=0)){return p}else{if((bd<=360)&&(bd>=315)){return p}else{if((bd>=135)&&(bd<=225)){return o}else{if((bd>45)&&(bd<135)){return x}else{return e}}}}}function at(){var bb=new Date();return bb.getTime()}function aY(bb){bb=f(bb);var bd=bb.offset();var bc={left:bd.left,right:bd.left+bb.outerWidth(),top:bd.top,bottom:bd.top+bb.outerHeight()};return bc}function E(bb,bc){return(bb.x>bc.left&&bb.x<bc.right&&bb.y>bc.top&&bb.y<bc.bottom)}}}));

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
            timerTime :         1500, // milliseconds
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

    var makeTotalSize = function(elem, slidesNumber, size, options) {
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

    var markPager = function(elem, options) {
        var theSlide = elem.data('actualSlide');
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
        var theSlide = elem.data('actualSlide');
        var keepMoving = true;
        if(!options.infinite) {
            if(theSlide == 0) {
                keepMoving = false;
            }
        }
        if(options.direction == 'horizontal' && keepMoving) {
            var move = (size.width * theSlide) - size.width;
            elem.find('.rs-wrap').animate({scrollLeft: move}, options.moveTime, 'swing');
            theSlide -= 1;
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
            markPager(elem, options);
        }
    };

    var moveNext = function(elem, size, slidesNumber, options) {
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
                var move = (size.width * theSlide) + size.width;
                console.log('weah', slidesNumber);
            } else {
                var move = (size.width * theSlide) + size.width;
                
            }
            theSlide += 1;
            console.log(move);
            elem.find('.rs-wrap').animate({scrollLeft: move}, options.moveTime, 'swing');
        } else if(options.direction == 'vertical' && keepMoving) {
            if(options.infinite && theSlide == slidesNumber) {
                elem.find('.rs-wrap').scrollTop(0);
                theSlide = 0;

            } else {
                theSlide += 1;
            }
            var move = (size.height * theSlide) + size.height;
            elem.find('.rs-wrap').animate({scrollTop: move}, options.moveTime, 'swing');
        }
        elem.data('actualSlide', theSlide);
        if(options.controls.buttons) {
            markButtons(elem, slidesNumber, options);
        }
        if(options.pager) {
            markPager(elem, options);
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
            markPager(elem, options);
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
        markPager(elem, options);
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
        var position = {
            'width' : thelSlide * size.width,
            'height' : thelSlide * size.height
        };
        elem.scrollLeft(position.width);
        elem.scrollTop(position.height);
    };

    var start = function(elem, options) {
        var $slides = elem.find('.rs-slide');
        var slidesNumber = $slides.length;
        var size = getSize(elem);
        elem.children().wrap( "<div class='rs-wrap' style='width:" + size.width + "px; height:" + size.height + "px;'></div>" );
        if(options.infinite) {
            var temp = $slides.eq(0).clone();
            elem.find('.rs-content').append(temp);
            temp.addClass('infiniter');
        }
        makeTotalSize(elem, slidesNumber, size, options);
        keepPosition(elem, size);
        var $allSlides = elem.find('.rs-slide');
        $allSlides.css({
            'width' : size.width,
            'height' : size.height
        });
        elem.find('.rs-slide-bg').fitImages();
        for(var i = 0; i < slidesNumber; i++) {
            $($slides[i]).attr('id', 's' + i);
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
                'timer' : false
            });
            start($slider, options);
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
                    start($slider, options);
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