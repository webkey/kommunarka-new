'use strict';

var $WINDOW = $(window), $DOC = $(document), $BODY = $('body');

/**
 * !resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !debouncedresize only width
 * */
var debouncedresizeByWidth = true;

var debouncedPrevWidth = -1;
$(window).on('debouncedresize', function () {
  var currentWidth = $('body').outerWidth();
  debouncedresizeByWidth = debouncedPrevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('debouncedresizeByWidth');
    debouncedPrevWidth = currentWidth;
  }
});

/**
 * !device detected
 * */
var DESKTOP = device.desktop();
var MOBILE = device.mobile();
var TABLET = device.tablet();

/**
 *  Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Show print page by click on the button
 * */
function printShow() {
  $('.view-print').on('click', function (e) {
    e.preventDefault();
    window.print();
  })
}

/**
 * !Get size of scroll
 * */

function getScrollSize() {
  // создадим элемент с прокруткой
  var div = document.createElement('div');

  div.style.overflow = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  div.style.position = 'fixed';
  div.style.left = '0px';
  div.style.bottom = '0px';
  div.style.visibility = 'hidden';

  // добавить элемент на страницу
  document.body.appendChild(div);

  // удалить элемент со страницы
  document.body.removeChild(div);

  // определить размеры скролла
  var scrollWidth = window.innerWidth - document.body.offsetWidth;
  var scrollHeight = window.innerHeight - document.body.offsetHeight;

  return {
    'width': scrollWidth,
    'height': scrollHeight
  };

  /** getScrollSize().width - получить ширину скролла */
  /** getScrollSize().height - получить высоту скролла */
}

/**
 * !Add class on scroll page
 * */
$(function () {
  // external js:
  // 1) resizeByWidth (resize only width);

  var $page = $('html'),
      currentScrollTop,
      headerIsTopClass = 'header-is-top',
      $header = $('.header');

  addClassScrollPosition();

  $(window).on('scroll resizeByWidth', function () {
    addClassScrollPosition();
  });

  function addClassScrollPosition() {
    currentScrollTop = $(window).scrollTop();

    $page.toggleClass(headerIsTopClass, $header.offset().top <= currentScrollTop);
  }
});

/**
 * !Sticky element on page
 * */
function stickyInit() {
  // header sticky
  var $headerSticky = $('.header');

  if ($headerSticky.length) {
    stickybits('.header', {
      useStickyClasses: true,
      stickyBitStickyOffset: 0
    });
  }
}

/**
 * !Toggle shutters
 * */
function toggleShutters() {
  var $overlay = $('.shutter-overlay-js'),
      $html = $('html'),
      $elemens = $('.header, .main, .footer'),
      activeClass = 'active';

  var $nav = $('.shutter--nav-js');

  var $btnNav = $('.btn-nav-js');

  $btnNav.on('click', function (e) {
    var $curOpener = $(this);
    $curOpener.toggleClass(activeClass);

    $nav.toggleClass(activeClass);

    if ($curOpener.hasClass(activeClass)) {
      $elemens.css({
        'padding-right': getScrollSize().width,
        'padding-bottom': getScrollSize().height
      });
    } else {
      $elemens.css({
        'padding-right': '',
        'padding-bottom': ''
      });
    }

    $overlay.toggleClass(activeClass, $curOpener.hasClass(activeClass));
    $html.toggleClass('shutter-after-open css-scroll-fixed shutter-only-mob', $curOpener.hasClass(activeClass));

    e.preventDefault();
  });

  // close
  $('.shutter-overlay-js').on('click', function (e) {
    $btnNav.removeClass(activeClass);

    $nav.removeClass(activeClass);

    $overlay.removeClass(activeClass);

    $html.removeClass('shutter-after-open css-scroll-fixed shutter-only-mob');

    e.preventDefault();
  })
}

/**
 * !parallax initial
 * */
function parallaxInit() {
  var scene = $('.scene').get(0);
  if ($(scene).length) {
    var parallaxInstance = new Parallax(scene);
  }
}

/**
 * !scroll to top
 * */
$(function () {
  var $btnToTop = $('.btn-to-top-js');

  if ($btnToTop.length) {
    var $page = $('html, body'),
        minScrollTop = 300;

    $(window).on('load scroll resizeByWidth', function () {
      var currentScrollTop = $(window).scrollTop();

      $btnToTop.toggleClass('btn-to-top--show', (currentScrollTop >= minScrollTop));
    });

    $btnToTop.on('click', function (e) {
      e.preventDefault();

      if (!$page.is(':animated')) {
        $page.stop().animate({scrollTop: 0}, 300);
      }
    })
  }
});

/**
 * !Plugin HoverClass
 * */
(function ($) {
  var HoverClass = function (settings) {
    var options = $.extend({
      container: 'ul',
      item: 'li',
      drop: 'ul'
    },settings || {});

    var self = this;
    self.options = options;

    var container = $(options.container);
    self.$container = container;
    self.$item = $(options.item, container);
    self.$drop = $(options.drop, container);
    self.$html = $('html');

    self.modifiers = {
      hover: 'hover',
      hoverNext: 'hover_next',
      hoverPrev: 'hover_prev'
    };

    self.addClassHover();

    if (!DESKTOP) {
      $(window).on('debouncedresize', function () {
        self.removeClassHover();
      });
    }
  };

  HoverClass.prototype.addClassHover = function () {
    var self = this,
        _hover = this.modifiers.hover,
        _hoverNext = this.modifiers.hoverNext,
        _hoverPrev = this.modifiers.hoverPrev,
        $item = self.$item,
        item = self.options.item,
        $container = self.$container;

    if (!DESKTOP) {

      $container.on('click', ''+item+'', function (e) {
        var $currentAnchor = $(this);
        var currentItem = $currentAnchor.closest($item);

        if (!currentItem.has(self.$drop).length){ return; }

        e.stopPropagation();

        if (currentItem.hasClass(_hover)){
          // self.$html.removeClass('css-scroll-fixed');

          // if($('.main-sections-js').length) {
          // 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
          // }

          currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);

          return;
        }

        // self.$html.addClass('css-scroll-fixed');
        // if($('.main-sections-js').length) {
        // 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
        // }

        $('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
            .removeClass(_hover)
            .find('.'+_hover+'')
            .removeClass(_hover);
        currentItem.addClass(_hover);

        e.preventDefault();
      });

      $container.on('click', ''+self.options.drop+'', function (e) {
        e.stopPropagation();
      });

      $(document).on('click', function () {
        $item.removeClass(_hover);
      });

    } else {
      $container.on('mouseenter', ''+item+'', function () {

        var currentItem = $(this);

        if (currentItem.prop('hoverTimeout')) {
          currentItem.prop('hoverTimeout', clearTimeout(currentItem.prop('hoverTimeout')));
        }

        currentItem.prop('hoverIntent', setTimeout(function () {
          // self.$html.addClass('css-scroll-fixed');
          // if($('.main-sections-js').length) {
          // 	$.fn.fullpage.setAllowScrolling(false); // blocked fullpage scroll
          // }

          currentItem.addClass(_hover);
          currentItem.next().addClass(_hoverNext);
          currentItem.prev().addClass(_hoverPrev);

        }, 50));

      }).on('mouseleave', ''+ item+'', function () {

        var currentItem = $(this);

        if (currentItem.prop('hoverIntent')) {
          currentItem.prop('hoverIntent', clearTimeout(currentItem.prop('hoverIntent')));
        }

        currentItem.prop('hoverTimeout', setTimeout(function () {
          // self.$html.removeClass('css-scroll-fixed');
          // if($('.main-sections-js').length) {
          // 	$.fn.fullpage.setAllowScrolling(true); // unblocked fullpage scroll
          // }

          currentItem.removeClass(_hover);
          currentItem.next().removeClass(_hoverNext);
          currentItem.prev().removeClass(_hoverPrev);
        }, 50));

      });

    }
  };

  HoverClass.prototype.removeClassHover = function () {
    var self = this;
    self.$item.removeClass(self.modifiers.hover );
  };

  window.HoverClass = HoverClass;

}(jQuery));

/**
 * !Toggle "hover" class by hover on the item of the list
 * */
function initHoverClass() {
  if ($('.nav__list-js').length) {
    new HoverClass({
      container: '.nav__list-js', drop: '.nav__drop-js'
    });
  }
}

/**
 * !Multi accordion jquery plugin
 * */
(function ($) {
  var MultiAccordion = function (settings) {
    var options = $.extend({
      collapsibleAll: false, // если установить значение true, сворачиваются идентичные панели НА СТРАНИЦЕ, кроме текущего
      resizeCollapsible: false, // если установить значение true, при ресайзе будут соворачиваться все элементы
      container: null, // общий контейнер
      item: null, // непосредственный родитель открывающегося элемента
      handler: null, // открывающий элемента
      handlerWrap: null, // если открывающий элемент не является непосредственным соседом открывающегося элемента, нужно указать элемент, короный является оберткой открывающего элемета и лежит непосредственно перед открывающимся элементом (условно, является табом)
      panel: null, // открывающийся элемент
      openClass: 'active', // класс, который добавляется при открытии
      currentClass: 'current', // класс текущего элемента
      animateSpeed: 300, // скорость анимации
      collapsible: false // сворачивать соседние панели
    }, settings || {});

    this.options = options;
    var container = $(options.container);
    this.$container = container;
    this.$item = $(options.item, container);
    this.$handler = $(options.handler, container);
    this.$handlerWrap = $(options.handlerWrap, container);
    this._animateSpeed = options.animateSpeed;
    this.$totalCollapsible = $(options.totalCollapsible);
    this._resizeCollapsible = options.resizeCollapsible;

    this.modifiers = {
      active: options.openClass,
      current: options.currentClass
    };

    this.bindEvents();
    this.totalCollapsible();
    this.totalCollapsibleOnResize();

  };

  MultiAccordion.prototype.totalCollapsible = function () {
    var self = this;
    self.$totalCollapsible.on('click', function () {
      self.$panel.slideUp(self._animateSpeed, function () {
        self.$container.trigger('accordionChange');
      });
      self.$item.removeClass(self.modifiers.active);
    })
  };

  MultiAccordion.prototype.totalCollapsibleOnResize = function () {
    var self = this;
    $(window).on('resize', function () {
      if (self._resizeCollapsible) {
        self.$panel.slideUp(self._animateSpeed, function () {
          self.$container.trigger('accordionChange');
        });
        self.$item.removeClass(self.modifiers.active);
      }
    });
  };

  MultiAccordion.prototype.bindEvents = function () {
    var self = this;
    var $container = this.$container;
    var $item = this.$item;
    var panel = this.options.panel;

    $container.on('click', self.options.handler, function (e) {
      var $currentHandler = self.options.handlerWrap ? $(this).closest(self.options.handlerWrap) : $(this);
      var $currentItem = $currentHandler.closest($item);

      if ($currentItem.has($(panel)).length) {
        e.preventDefault();

        if ($currentHandler.next(panel).is(':visible')) {
          self.closePanel($currentItem);

          return;
        }

        if (self.options.collapsibleAll) {
          self.closePanel($($container).not($currentHandler.closest($container)).find($item));
        }

        if (self.options.collapsible) {
          self.closePanel($currentItem.siblings());
        }

        self.openPanel($currentItem, $currentHandler);
      }
    })
  };

  MultiAccordion.prototype.closePanel = function ($currentItem) {
    var self = this;
    var panel = self.options.panel;
    var openClass = self.modifiers.active;

    $currentItem.removeClass(openClass).find(panel).filter(':visible').slideUp(self._animateSpeed, function () {
      self.$container.trigger('mAccordionAfterClose').trigger('mAccordionAfterChange');
    });

    $currentItem
        .find(self.$item)
        .removeClass(openClass);
  };

  MultiAccordion.prototype.openPanel = function ($currentItem, $currentHandler) {
    var self = this;
    var panel = self.options.panel;

    $currentItem.addClass(self.modifiers.active);

    $currentHandler.next(panel).slideDown(self._animateSpeed, function () {
      self.$container.trigger('mAccordionAfterOpened').trigger('mAccordionAfterChange');
    });
  };

  window.MultiAccordion = MultiAccordion;
}(jQuery));

/**
 * !Navigation accordion initial
 * */
function navAccordionInit() {
  var navMenu = '.nav__list-js';

  if ($(navMenu).length) {
    new MultiAccordion({
      container: navMenu,
      item: 'li',
      handler: '.nav-handler-js',
      handlerWrap: '.nav__tab-js',
      panel: '.nav__drop-js',
      openClass: 'is-open',
      animateSpeed: 200,
      collapsible: true
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
  // add functions
});

$(window).on('debouncedresize', function () {
  // $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
  // Define support of touchevents
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touchevents";
  } else {
    document.documentElement.className += " touch";
  }
  placeholderInit();
  printShow();
  objectFitImages(); // object-fit-images initial
  stickyInit();
  toggleShutters();
  parallaxInit();
  initHoverClass();
  navAccordionInit();
});