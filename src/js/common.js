'use strict';

// var $WINDOW = $(window), $DOC = $(document), $BODY = $('body');

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
// var MOBILE = device.mobile();
// var TABLET = device.tablet();

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

  $(window)
      .off('scroll resizeByWidth')
      .on('scroll resizeByWidth', function () {
    addClassScrollPosition();
  });

  function addClassScrollPosition() {
    currentScrollTop = $(window).scrollTop();

    var cond = $header.offset().top <= currentScrollTop;

    $page.toggleClass(headerIsTopClass, cond);

    if (cond) {
      $header.css('min-height', $header.children().outerHeight());
    } else {
      $header.css('min-height', '');
    }
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

// ==================================================
// jquery.switch-class.js
// Version: 2.0
// Description: Extended toggle class
// ==================================================

(function (window, document, $) {
  'use strict';

  // Нужно для корректной работы с доп. классом фиксирования скролла
  var countFixedScroll = 0;

  var $W = $(window);
  var $D = $(document);

  // Inner Plugin Modifiers
  var CONST_MOD = {
    instanceClass: 'swc-instance',
    initClass: 'swc-initialized',
    activeClass: 'swc-active',
    preventRemoveClass: 'swc-prevent-remove'
  };

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self = this, elem;
    self.element = element;
    self.config = config;
    self.mixedClasses = {
      initialized: CONST_MOD.initClass + ' ' + (config.modifiers.initClass || ''),
      active: CONST_MOD.activeClass + ' ' + (config.modifiers.activeClass || ''),
      scrollFixedClass: 'css-scroll-fixed'
    };
    self.$switchClassTo = $(config.toggleEl).add(config.addEl).add(config.removeEl).add(config.switchClassTo);
    self._classIsAdded = false;
  };

  $.extend(SwitchClass.prototype, {
    callbacks: function () {
      var self = this;
      /** track events */
      $.each(self.config, function (key, value) {
        if (typeof value === 'function') {
          $(self.element).on('switchClass.' + key, function (e, param) {
            return value(e, $(self.element), param);
          });
        }
      });
    },
    prevent: function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    toggleFixedScroll: function () {
      var self = this;
      $('html').toggleClass(self.mixedClasses.scrollFixedClass, !!countFixedScroll);
    },
    add: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (self._classIsAdded) return;

      // Callback before added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.beforeAdd')
          .trigger('switchClass.beforeChange');

      if (self.config.removeExisting) {
        $.switchClass.remove(true);
      }

      // Добавить активный класс на:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .addClass(self.mixedClasses.active);

      // Сохранить в дата-атрибут текущий объект this
      // $(self.element).data('SwitchClass', self);
      $currentEl.addClass(CONST_MOD.instanceClass).data('SwitchClass', self);

      self._classIsAdded = true;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
        ++countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback after added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.afterAdd')
          .trigger('switchClass.afterChange');
    },
    remove: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (!self._classIsAdded) return;

      // callback beforeRemove
      $currentEl
          .trigger('switchClass.beforeRemove')
          .trigger('switchClass.beforeChange');

      // Удалять активный класс с:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .removeClass(self.mixedClasses.active);

      // Удалить дата-атрибут, в котором хранится объект
      $currentEl.removeClass(CONST_MOD.instanceClass).removeData('SwitchClass');

      self._classIsAdded = false;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
        --countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback afterRemove
      $currentEl
          .trigger('switchClass.afterRemove')
          .trigger('switchClass.afterChange');
    },
    events: function () {
      var self = this;

      function _toggleClass (e) {
        if (self._classIsAdded) {
          self.remove();

          e.preventDefault();
          return false;
        }

        self.add();

        self.prevent(e);
      }

      if (self.config.selector) {
        $(self.element)
            .off('click', self.config.selector)
            .on('click', self.config.selector, _toggleClass);
      } else {
        $(self.element)
            .off('click')
            .on('click', _toggleClass);
      }

      $(self.config.toggleEl).on('click', _toggleClass);

      $(self.config.addEl).on('click', function (event) {
        self.add();
        self.prevent(event);
      });

      $(self.config.removeEl).on('click', function (event) {
        self.remove();
        self.prevent(event);
      })

    },
    removeByClickOutside: function () {
      var self = this;

      $('html').on('click', function (event) {

        if ($(event.target).closest('.' + CONST_MOD.preventRemoveClass).length) {
          return;
        }

        if (self.config.preventRemoveClass && $(event.target).closest('.' + self.config.preventRemoveClass).length) {
          return;
        }

        if (self._classIsAdded && self.config.removeOutsideClick) {
          self.remove();
        }
      });
    },
    removeByClickEsc: function () {
      var self = this;

      $('html').keyup(function (event) {
        if (self._classIsAdded && self.config.removeEscClick && event.keyCode === 27) {
          self.remove();
        }
      });
    },
    init: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if ($currentEl.hasClass(self.config.modifiers.activeClass)) {
        self.add();
      }

      $currentEl.addClass(self.mixedClasses.initialized);
      $currentEl.trigger('switchClass.afterInit');
      // $(self.element).addClass(self.mixedClasses.initialized);
      // $(self.element).trigger('switchClass.afterInit');
    }
  });

  $.switchClass = {
    version: "2.0",

    getInstance: function (command) {
      var instance = $('.' + CONST_MOD.instanceClass + '.' + CONST_MOD.activeClass + ':last').data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

      if (instance instanceof SwitchClass) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },
    remove: function (all) {
      // Получить текущий инстанс
      var instance = this.getInstance();

      // Если инстанс существует
      if (instance) {

        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          this.remove(all);
        }
      }
    },
  };

  function _run (el) {
    el.switchClass.callbacks();
    el.switchClass.events();
    el.switchClass.removeByClickOutside();
    el.switchClass.removeByClickEsc();
    el.switchClass.init();
  }

  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        _run(self[i]);
      } else {
        ret = self[i].switchClass[options].apply(self[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.switchClass.defaultOptions = {
    // Remove existing classes
    // Set this to false if you do not need to stack multiple instances
    removeExisting: false,

    // Бывает необходимо инициализировать плагин на динамически добавленном элемента.
    // Чтобы повесить на этот елемент событие, нужно добавить его через совойство selector
    // Example:
    // $('.parents-element').switchClass({
    //     selector : '.box a.opener:visible'
    // });
    selector: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    addEl: null,

    // Дополнительный элемент, которым можно УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    removeEl: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    toggleEl: null,

    // Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
    // Example 1: $('html, .popup-js, .overlay-js')
    // Example 2: $('html').add('.popup-js').add('.overlay-js')
    switchClassTo: null,

    // Удалать класс по клику по пустому месту на странице?
    // Если по клику на определенный элемент удалять класс не нужно,
    // то на этот элемент нужно добавить класс ".swc-prevent-remove",
    // или класс указанный в параметре "preventRemoveClass"
    // Example: true or false
    removeOutsideClick: true,

    // Если кликнуть по елементу с этим классом, то событие удаления активного класса не будет вызвано
    // Example: class = "some-class"
    preventRemoveClass: null,

    // Удалять класс по клику на клавишу Esc?
    // Example: true or false
    removeEscClick: true,

    // Добавлять на html дополнительный класс 'css-scroll-fixed'?
    // Через этот класс можно фиксировать скролл методами css
    // _mixins.sass, scroll-blocked()
    // Example: true or false
    cssScrollFixed: false,

    // Классы-модификаторы
    modifiers: {
      initClass: null,
      activeClass: 'active'
    }
  };

})(window, document, jQuery);

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

    // if ($curOpener.hasClass(activeClass)) {
    //   $elemens.css({
    //     'padding-right': getScrollSize().width,
    //     'padding-bottom': getScrollSize().height
    //   });
    // } else {
    //   $elemens.css({
    //     'padding-right': '',
    //     'padding-bottom': ''
    //   });
    // }

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
 * !Toggle search field
 * */
function searchFieldToggle() {
  var $searchFieldSwitcher = $('.searchicon-js');

  if ($searchFieldSwitcher.length) {
    var $searchInput = $('.searchform-input-js');

    $searchFieldSwitcher.switchClass({
      switchClassTo: $('.searchform-js'),
      preventRemoveClass: 'searchform-js',
      modifiers: {
        activeClass: "active"
      },
      afterAdd: function () {
        setTimeout(function () {
          $searchInput.focus();
        }, 50);
      },
      afterRemove: function () {
        setTimeout(function () {
          $searchInput.blur();
        }, 50);
      }
    });
  }
}

/**
 * !Toggle Catalog
 * */
function catalogToggle() {
  var $catalogOpener = $('.catalog-opener-js');

  if ($catalogOpener.length) {
    $catalogOpener.switchClass({
      switchClassTo: $('.catalog-shutter-js').add('.catalog-shutter-overlay-js'),
      preventRemoveClass: 'catalog-shutter-prevent-js',
      removeEl: $('.catalog-shutter-close'),
      cssScrollFixed: true,
      modifiers: {
        activeClass: "catalog-is-open"
      }
    });
  }
}

// ==================================================
// jquery.tabs.js
// Version: 2.0
// Description: Switch panels
// ==================================================

(function ($) {
  'use strict';

  var MsTabs = function (element, config) {
    var self,
        $element = $(element),
        $anchor = $element.find(config.anchor),
        $panels = $element.find(config.panels),
        $panel = $element.find(config.panel),
        $select = $element.find(config.compactView.elem),
        $selectDrop = $element.find(config.compactView.drop),
        $html = $('html'),
        isAnimated = false,
        activeId,
        isOpen = false,
        isSelectOpen = false,
        collapsible = $element.data('tabs-collapsible') || config.collapsible,
        pref = 'ms-tabs',
        pluginClasses = {
          initialized: pref + '_initialized',
          active: pref + '_active-tab',
          collapsible: pref + '_is-collapsible',
          selectOpen: pref + '_select-open'
        },
        mixedClasses = {
          initialized: pluginClasses.initialized + ' ' + (config.modifiers.initClass || ''),
          active: pluginClasses.active + ' ' + (config.modifiers.activeClass || ''),
          collapsible: pluginClasses.collapsible + ' ' + (config.modifiers.collapsibleClass || ''),
          selectOpen: pluginClasses.selectOpen + ' ' + (config.compactView.openClass || '')
        };

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('msTabs.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },

        prevent = function (event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },

        changeSelect = function () {
          // Изменить контент селекта при изменении активного таба
          $select.html($anchor.filter('[href="#' + activeId + '"]').html() + '<i>&#9660;</i>');
          $element.trigger('msTabs.afterSelectValChange');
        },

        eventsSelect = function () {
          // Открыть переключатели табов
          $select.on('click', function () {
            // $element.add($select).toggleClass(mixedClasses.selectOpen);
            if (isSelectOpen) {
              closeSelect();
            } else {
              openSelect();
            }

            prevent(event);
          })
        },

        openSelect = function () {
          isSelectOpen = true;
          $element.add($select).add($selectDrop).addClass(mixedClasses.selectOpen);
          $element.trigger('msTabs.afterSelectOpen');
        },

        closeSelect = function () {
          isSelectOpen = false;
          $element.add($select).add($selectDrop).removeClass(mixedClasses.selectOpen);
          $element.trigger('msTabs.afterSelectClose');
        },

        closeSelectByClickOutside = function () {
          $html.on('click', function (event) {
            if (isSelectOpen && config.compactView.closeByClickOutside && !$(event.target).closest($selectDrop).length) {
              closeSelect();
            }
          });
        },

        closeSelectByClickEsc = function () {
          $html.keyup(function (event) {
            if (isSelectOpen && config.compactView.closeByClickEsc && event.keyCode === 27) {
              closeSelect();
            }
          });
        },

        show = function () {
          // Определяем текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]'),
              $otherPanel = $panel.not('[id="' + activeId + '"]'),
              $activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

          if (!isAnimated) {
            // console.log('Показать таб:', activeId);
            isAnimated = true;

            // Удалить активный класс со всех элементов
            $panel.add($anchor).removeClass(mixedClasses.active);

            // Добавить класс на каждый активный элемент
            $activePanel.add($activeAnchor).addClass(mixedClasses.active);

            // Анимирование высоты табов
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': $activePanel.outerHeight()
                }, config.animationSpeed);

            // Скрыть все табы, кроме активного
            hideTab($otherPanel);

            // Показать активный таб
            $activePanel
                .css({
                  'z-index': 2,
                  'visibility': 'visible'
                })
                .animate({
                  'opacity': 1
                }, config.animationSpeed, function () {
                  $activePanel
                      .css({
                        'position': 'relative',
                        'left': 'auto',
                        'top': 'auto',
                        'pointer-events': ''
                      });
                  // .attr('tabindex', 0);

                  $panels.css({
                    'height': '',
                    'overflow': ''
                  });

                  // Анимация полностью завершена
                  isOpen = true;
                  isAnimated = false;
                });
          }

          // callback after showed tab
          $element.trigger('msTabs.afterOpen');
          $element.trigger('msTabs.afterChange');
        },

        hide = function () {
          // Определить текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]');

          if (!isAnimated) {
            // console.log("Скрыть таб: ", activeId);

            isAnimated = true;

            // Удалить активный класс со всех элементов
            $panel.add($anchor).removeClass(mixedClasses.active);

            // Анимирование высоты табов
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': 0
                }, config.animationSpeed);

            hideTab($activePanel, function () {
              $panels.css({
                'height': ''
              });

              isOpen = false;
              isAnimated = false;
            });
          }

          // callback after tab hidden
          $element.trigger('msTabs.afterClose');
          $element.trigger('msTabs.afterChange');
        },

        hideTab = function ($_panel) {
          var callback = arguments[1];
          $_panel
              .css({
                'z-index': -1
              })
              // .attr('tabindex', -1)
              .animate({
                'opacity': 0
              }, config.animationSpeed, function () {
                $_panel.css({
                  'position': 'absolute',
                  'left': 0,
                  'top': 0,
                  'visibility': 'hidden',
                  'pointer-events': 'none'
                });

                // Анимация полностью завершена
                if (typeof callback === "function") {
                  callback();
                }
              });
        },

        events = function () {
          $anchor.on('click', function (event) {
            event.preventDefault();

            var curId = $(this).attr('href').substring(1);
            // console.log("Таб анимируется?: ", isAnimated);
            // console.log("Текущий таб открыт?: ", isOpen);
            // console.log("Таб нужно закрывать, если открыт?: ", collapsible);
            // console.log("activeId (Предыдущий): ", activeId);

            if (isAnimated || !collapsible && curId === activeId) {
              return false;
            }

            if (collapsible && isOpen && curId === activeId) {
              hide();
            } else {
              activeId = curId;
              // console.log("activeId (Текущий): ", activeId);
              show();
            }

            // Изменить контент селекта
            if (config.compactView) {
              changeSelect();
              closeSelect();
            }
          });
        },

        init = function () {

          $anchor.filter('.' + pluginClasses.active).addClass(mixedClasses.active);
          $anchor.filter('.' + config.modifiers.activeClass).addClass(mixedClasses.active);

          $panels.css({
            'display': 'block',
            'position': 'relative'
          });

          $panel
              .css({
                'position': 'absolute',
                'left': 0,
                'top': 0,
                'opacity': 0,
                'width': '100%',
                'visibility': 'hidden',
                'z-index': -1,
                'pointer-events': 'none'
              });
          // .attr('tabindex', -1);

          // console.log("config.activeIndex === 0 || config.activeIndex: ", config.activeIndex === 0 || config.activeIndex);

          if ($anchor.filter('.' + pluginClasses.active).length) {
            activeId = $anchor.filter('.' + pluginClasses.active).attr('href').substring(1);
          } else if (config.activeIndex === 0 || config.activeIndex) {
            activeId = $anchor.eq(config.activeIndex).attr('href').substring(1);
          }

          // console.log("activeId (сразу после инициализации): ", activeId);

          if (activeId) {
            var $activeAnchor = $anchor.filter('[href="#' + activeId + '"]'),
                $activePanel = $panel.filter('[id="' + activeId + '"]');

            // Добавить класс на каждый активный элемент
            $activePanel.add($activeAnchor).addClass(mixedClasses.active);

            // Показать активный таб
            $activePanel
                .css({
                  'position': 'relative',
                  'left': 'auto',
                  'top': 'auto',
                  'opacity': 1,
                  'visibility': 'visible',
                  'z-index': 2,
                  'pointer-events': ''
                });
            // .attr('tabindex', 0);

            isOpen = true;
          }

          // Изменить контент селекта
          if (config.compactView.elem) {
            changeSelect();
            // !Предупреждение, если не задан элемент, котрый будет выполнять роль опшинов
            if (!config.compactView.drop) {
              console.warn('You must choose a DOM element as select drop! Pun in a compactView.drop');
            }
          }

          // Добавить специальный класс, если включена возможность
          // разворачивать/сворачивать активный таб
          if (collapsible) {
            $element.addClass(mixedClasses.collapsible);
          }

          // После инициализации плагина добавить внутренний класс и,
          // если указан в опициях, пользовательский класс
          $element.addClass(mixedClasses.initialized);

          $element.trigger('msTabs.afterInit');
        };

    self = {
      callbacks: callbacks,
      eventsSelect: eventsSelect,
      closeSelectByClickOutside: closeSelectByClickOutside,
      closeSelectByClickEsc: closeSelectByClickEsc,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msTabs = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].msTabs = new MsTabs(_[i], $.extend(true, {}, $.fn.msTabs.defaultOptions, opt));
        _[i].msTabs.init();
        _[i].msTabs.callbacks();
        _[i].msTabs.eventsSelect();
        _[i].msTabs.closeSelectByClickOutside();
        _[i].msTabs.closeSelectByClickEsc();
        _[i].msTabs.events();
      } else {
        ret = _[i].msTabs[opt].apply(_[i].msTabs, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msTabs.defaultOptions = {
    anchor: '.tabs__anchor-js',
    panels: '.tabs__panels-js',
    panel: '.tabs__panel-js',
    animationSpeed: 300,
    // Индекс активного таба при инициализации плагина
    // Если указать false, то все табы будут закрыты
    // Важно! Указание активного класса в html имеет приоритет выше
    activeIndex: 0,
    // Позволить открывать и закрывать таб по клику на один и тот же переключатель
    collapsible: false,
    // Настройки компактного вида (для девайсов, например)
    compactView: {
      // Элемент, который будет селектом
      elem: null,
      // Элемент, который будет выпадающим списком селекта
      drop: null,
      // Закрывать выпадающий список селекта по клику на "пустом" месте
      closeByClickOutside: true,
      // Закрывать выпадающий список селекта по клавише Esc
      closeByClickEsc: true,
      // Класс, который добавляется после открытия списка селекта
      openClass: null
    },
    // Пользовательские классы
    modifiers: {
      initClass: null,
      collapsibleClass: null,
      activeClass: null
    }
  };

})(jQuery);

/**
 * !Tabs for catalog navigation
 */
// Choose the products' group in the catalog switcher

function catalogNavTabs() {
  var $catalogNavTabs = $('.catalog-nav-tabs-js');

  if ($catalogNavTabs.length) {
    var $catalogNavTabsPanels = $('.catalog-nav-tabs__panels-js');
    $catalogNavTabs.msTabs({
      anchor: $('.catalog-nav-tabs__thumbs-js').find('a'),
      panels: $catalogNavTabsPanels,
      panel: $catalogNavTabsPanels.children(),
      modifiers: {
        activeClass: 'current'
      }
    });
  }
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
      // Дефолтные значения указаны для
      // следующей структуры DOM:
      // =====================
      // <ul>     - меню (container)
      //   <li>   - пункт меню (item)
      //     <a>  - ссылка
      //     <ul> - подменю (drop)
      // =====================
      container: 'ul',
      item: 'li',
      drop: 'ul',

      // Добавлять классы только на пункты
      // имеющие подпункты
      onlyHasDrop: false,

      // Задержка перед добавлением/удалением класса
      // По умолчанию 50ms
      // Можно указать отдельно для добавления и удаления класса
      // timeout: {
      //   add: 50,
      //   remove: 500
      // }
      // timeout: 50,

      // Устанавливать дополнительные классы
      // на соседние пункты активного
      siblings: false,

      // Условие, при котором нужно добавлять классы.
      // Например, если классы нужно добавлять только в браузерах шире 1400px:
      // condition: function () {
      //   return window.innerWidth > 1400;
      // }
      condition: true,

      // Удалять классы по клику вне активного пункта
      removeOutsideClick: true,

      // Удалять классы по клику на клавишу Esc
      removeEscClick: true,

      // Добавляемые классы
      modifiers: {
        hover: 'hover',
        hoverNext: 'hover_next',
        hoverPrev: 'hover_prev'
      }
    }, settings || {});

    var self = this;
    self.options = options;

    var $container = $(options.container);
    self.$container = $container;
    self.$item = $(options.item, $container);
    self.$drop = $(options.drop, $container);
    self._classIsAdded = false;

    self.removeByClickOutside();
    self.toggleClassHover();
    self.clearHoverClassOnResize();
    self.removeByClickEsc();
  };

  var $html = $('html');

  HoverClass.prototype.addClasses = function () {
    var self = this;
    var item = arguments[0];

    if (item && item.length) {
      var $item = $(item);

      // console.log("Hover ADD: ", $item);
      $item
          .addClass(self.options.modifiers.hover)
          // Установить флаг активного состояния
          .prop('isActive', true);

      if (self.options.siblings) {
        $item.next().addClass(self.options.modifiers.hoverNext);
        $item.prev().addClass(self.options.modifiers.hoverPrev);
      }

      self._classIsAdded = true;
    }
  };

  HoverClass.prototype.removeClasses = function () {
    var self = this;
    var item = arguments[0] || self.$item;
    var $item = $(item);

    if ($item.length) {

      // console.log("Hover REM: ", $item);

      $item
          .removeClass(self.options.modifiers.hover)
          // Удалить флаг активного состояния
          .prop('isActive', false);

      if (self.options.siblings) {
        $item.next().removeClass(self.options.modifiers.hoverNext);
        $item.prev().removeClass(self.options.modifiers.hoverPrev);
      }

      self._classIsAdded = false;
    }
  };

  HoverClass.prototype.deepClean = function () {
    var self = this;
    var item = arguments[0] || self.$item;
    // var $item = $(item).filter('.' + self.options.modifiers.hover);
    var $item = $(item);
    var arg1 = arguments[1];

    // Перебрать все элементы
    // ======================
    $.each($item, function () {
      var $curItem = $(this);

      // Проверить, наличие пунктов с удалением с задержкой
      // или в активном состоянии
      var itemHT = $curItem.prop('hoverTimeout');
      if (!itemHT && !$curItem.prop('isActive')) return;
      // console.log("deepClean Item: ", $curItem);

      // 1) Очистить задержку удаления классов
      $curItem.prop('hoverTimeout', clearTimeout(itemHT));
      // 2) Удалить классы на активных пунктах
      self.removeClasses($curItem);

      // Чтобы провести очиску и в дочерних элементах,
      // нужно передать на вход функции вторым аргументом true
      if (arg1) {
        // Перебрать всей детям активных пунктов
        // =====================================
        $.each($curItem.find(self.$item), function () {
          var $subItemCh = $(this);

          // Проверить, наличие пунктов с удалением с задержкой
          // или в активном состоянии
          var chHT = $subItemCh.prop('hoverTimeout');
          if (!chHT && !$curItem.prop('isActive')) return;
          // console.log("deepClean Child: ", $subItemCh);

          // 1) Очистить задержку удаления классов
          $subItemCh.prop('hoverTimeout', clearTimeout(chHT));
          // 2) Удалить классы на активных пунктах
          self.removeClasses($subItemCh);
        })
      }
    });
  };

  HoverClass.prototype.clearHoverClassOnResize = function () {
    var self = this;
    $(window).on('resize', function () {
      self.removeClasses(self.$item.filter('.' + self.options.modifiers.hover));
    });
  };

  HoverClass.prototype.removeByClickOutside = function () {
    var self = this;

    $html.on('click', function (event) {

      if (self._classIsAdded && !self.options.removeOutsideClick) return;

      // if ($(event.target).closest(self.$item.filter('.' + self.options.modifiers.hover)).length) return;

      self.deepClean();
    });
  };

  HoverClass.prototype.removeByClickEsc = function () {
    var self = this;

    $('html').keyup(function (event) {
      if (self._classIsAdded && self.options.removeEscClick && event.keyCode === 27) {
        self.deepClean();
      }
    });

    return false;
  };

  HoverClass.prototype.toggleClassHover = function () {
    var self = this,
        item = self.options.item,
        $item = self.$item,
        $container = self.$container,
        timeoutAdd,
        timeoutRemove;

    // Время задержки добавления/удаления классов
    // ==========================================
    timeoutAdd = timeoutRemove = self.options.timeout;

    if (typeof self.options.timeout === "object") {
      timeoutAdd = self.options.timeout.add;
      timeoutRemove = self.options.timeout.remove;
    }

    // Обработка событий прикосновения к тачскрину,
    // а также ввода и вывода курсора
    // ==============================
    $container.off('touchend mouseenter mouseleave', item).on('touchend mouseenter mouseleave', item, function (e) {
      var $curItem = $(this),
          event = e;

      // Родительские пункты текущего пункта
      // ===================================
      var $curParentItems = $curItem.parentsUntil(self.options.container, self.options.item);

      // Если параметр cancel возвращает false
      // то выполнение функции прекратить
      // ================================
      var condition = (typeof self.options.condition === "function") ? self.options.condition() : self.options.condition;
      if (!condition) return;

      // Если:
      // 1) текущий пункт не содержит подменю,
      // 2) в настройках указанно, что нужно проводить такую проверку,
      // то выполнение функции прекратить
      // ================================
      if (self.options.onlyHasDrop && !$curItem.has(self.$drop).length) return;

      // console.log("event.handleObj.origType: ", event.handleObj.origType);

      // События на TOUCHEND
      //    (для тачскринов)
      // ===================
      if (event.handleObj.origType === "touchend") {
        // console.log('Touchend to: ', $curItem);

        // Если пункт уже АКТИВЕН
        // =============================
        if ($curItem.prop('isActive')) {
          // Прекратить дальнейшее выполнение функции
          // ========================================

          return;
        }

        // Если пункт НЕ АКТИВЕН
        // =====================

        // Удалить все классы hover со всех активных пунктов,
        // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
        // =============================
        self.removeClasses(self.$item.filter('.' + self.options.modifiers.hover).not($curItem).not($curParentItems));

        // Если текущий пункт не содержит подменю,
        // то выполнение функции прекратить
        // !!! Эта проверка проводится в самом конце,
        //     чтобы можно было удалять активные классы
        //     при клике на любой пункт, а не только
        //     содержащий в себе подменю.
        // ================================
        if (!$curItem.has(self.$drop).length) return;

        // Добавить классы hover на ТЕКУЩИЙ пункт
        // ======================================
        self.addClasses($curItem);

        event.preventDefault();

        return;
      }

      // События на ВВОД курсора
      // =======================
      if (event.handleObj.origType === "mouseenter") {

        // Если перевод курсора происходит на соседние пункты,
        // (а не дочерние), то
        // очищаем задержку удаления классов на активных элементах,
        // а затем удаляем классы без задержки.
        //==========================
        var $curSiblings = $curItem.siblings();
        self.deepClean($curSiblings, true);

        // Перед добавлением класса
        // очистить очередь удаления класса
        // (отменить удаления класса) c текущего пункта,
        // если она запущена
        // =================
        var hoverTimeoutAddFn = $curItem.prop('hoverTimeout');
        if (hoverTimeoutAddFn) {
          $curItem.prop('hoverTimeout', clearTimeout(hoverTimeoutAddFn));
        }

        // Если пункт уже активен,
        // то повторный ввод курсора в его область
        // останавливает дальнейшее выполнение функции
        if ($curItem.prop('isActive')) return;

        // console.log('Mouseenter to +=+=+=+=+=+=+: ', $curItem);

        // Запустить очередь добавления класса,
        // одновременно записав ее в аттрибут "prop"
        // =========================================
        $curItem.prop('hoverIntent', setTimeout(function () {

          // Удалить все классы hover со всех активных пунктов,
          // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
          // =============================
          self.removeClasses(self.$item.filter('.' + self.options.modifiers.hover).not($curItem).not($curParentItems));

          // Добавить классы hover на ТЕКУЩИЙ пункт
          self.addClasses($curItem);

        }, timeoutAdd || 50));

        return;
      }

      if (event.handleObj.origType === "mouseleave") {

        // console.log('Mouseleave from +=+=+=+=+=+=+: ', $curItem);

        // Перед удалением класса
        // очистить очередь добавления класса
        // (отменить добавление класса) на текущем пункта,
        // если она запущена
        // =================
        var hoverTimeoutRemoveFn = $curItem.prop('hoverIntent');
        if (hoverTimeoutRemoveFn) {
          $curItem.prop('hoverIntent', clearTimeout(hoverTimeoutRemoveFn));
        }

        // Запустить очередь удаления класса,
        // одновременно записав ее в аттрибут "prop"
        // =========================================

        $curItem.prop('hoverTimeout', setTimeout(function () {

          // Удалить все классы hover
          // ========================
          self.removeClasses(self.$item.filter('.' + self.options.modifiers.hover).not($curParentItems));

        }, timeoutRemove || 50));
      }
    });
  };

  window.HoverClass = HoverClass;

}(jQuery));

/**
 * !Toggle "hover" class
 * */
function initHoverClass() {
  if ($('.nav__list-js').length) {
    new HoverClass({
      container: '.nav__list-js',
      drop: 'ul',
      siblings: false,
      onlyHasDrop: true,
      condition: function () {
        return window.innerWidth > 991; // Если ширина меньше 992 то классы не добавлять
      },
      timeout: {add: 50, remove: 200}
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

        if ($currentHandler.siblings(panel).is(':visible')) {
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

    $currentHandler.siblings(panel).slideDown(self._animateSpeed, function () {
      self.$container.trigger('mAccordionAfterOpened').trigger('mAccordionAfterChange');
    });
  };

  window.MultiAccordion = MultiAccordion;
}(jQuery));

/**
 * !Menu accordion
 * */
function menuAccordionInit() {
  // Main navigation
  var nav = '.nav__list-js';

  if ($(nav).length) {
    new MultiAccordion({
      container: nav,
      item: 'li',
      handler: '.nav__angle-js',
      panel: 'ul',
      openClass: 'is-open',
      animateSpeed: 250,
      collapsible: true
    });
  }

  // Sidebar menu
  var menuContainer = '.menu-js';

  if ($(menuContainer).length) {
    new MultiAccordion({
      container: menuContainer,
      item: 'li',
      handler: '.menu-arr-js',
      panel: 'ul',
      openClass: 'is-open',
      animateSpeed: 200,
      collapsible: false
    });
  }
}

/**
 * !Sliders initial
 * */
function slidersInit() {
  // Footer slider with news and a video
  var footerSlider = '.footerSlider';
  if ( $(footerSlider).length ) {
    $(footerSlider).slick({
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      lazyLoad: 'ondemand'
    });
  }

  // Promo slider on the main page
  var promoSlider = '.promo-slider-js';
  if ($(promoSlider).length) {
    new Swiper(promoSlider, {
      spaceBetween: 0,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  // Similar slider
  var similarSlider = '.similar-slider-js';
  if ($(similarSlider).length) {
    $.each($(similarSlider), function () {
      var $thisSlider = $(this);
      var $thisSliderParent = $thisSlider.parent();
      new Swiper($thisSlider, {
        slidesPerView: 6,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: $thisSliderParent.find('.swiper-button-next'),
          prevEl: $thisSliderParent.find('.swiper-button-prev')
        },
        breakpoints: {
          1599: {
            slidesPerView: 5
          },
          1439: {
            slidesPerView: 4
          },
          1199: {
            slidesPerView: 3
          },
          1023: {
            slidesPerView: 2
          },
          991: {
            slidesPerView: 3
          },
          767: {
            slidesPerView: 2
          }
        }
      })
    })
  }

  // Years slider
  var yearsSlider = '.years-slider-js';
  if ($(yearsSlider).length) {
    $.each($(yearsSlider), function () {
      var $thisSlider = $(this);
      var $thisSliderParent = $thisSlider.parent();
      new Swiper($thisSlider, {
        slidesPerView: 6,
        spaceBetween: 20,
        loop: false,
        navigation: {
          nextEl: $thisSliderParent.find('.swiper-button-next'),
          prevEl: $thisSliderParent.find('.swiper-button-prev')
        },
        breakpoints: {
          1599: {
            slidesPerView: 5
          },
          1439: {
            slidesPerView: 4
          },
          1199: {
            slidesPerView: 3
          },
          1023: {
            slidesPerView: 2
          },
          991: {
            slidesPerView: 3
          },
          767: {
            slidesPerView: 2
          },
          639: {
            slidesPerView: 2,
            spaceBetween: 10
          }
        }
      })
    })
  }
}

/**
 * Cotalogue. Additional info
 */
function catalogueShowInfo() {
  // Каталог. Вызов доп. информации
  // $('.catalogue .item').on('click', function(){
  $('.catalogue .item').hover( function(){
    $(this).parents('li').siblings('li.active').removeClass('active');
    $(this).parents('li').toggleClass('active');
    return false;
  });
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(document).ready(function () {
  // Define support of touchevents
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touchevents";
  } else {
    document.documentElement.className += " touchevents";
  }

  placeholderInit();
  printShow();
  objectFitImages(); // object-fit-images initial
  // stickyInit();
  toggleShutters();
  searchFieldToggle();
  catalogToggle();
  // catalogNavTabs();
  parallaxInit();
  initHoverClass();
  menuAccordionInit();
  slidersInit();
  catalogueShowInfo();
});