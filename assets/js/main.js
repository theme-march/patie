(function ($) {
  "use strict";

  /*
|--------------------------------------------------------------------------
| Template Name: PATIE
| Author: Thememarch
| Version: 1.0.0
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| TABLE OF CONTENTS:
|--------------------------------------------------------------------------
| 1. Preloader
| 2. Mobile Menu
| 3. Active Navigation State
| 4. Sticky Header
| 5. Dynamic Background
| 6. Swiper Slider
| 7. Modal Video
| 8. Scroll Up
| 9. Count Up Animation
| 10. Progress Bar Animation
| 11. Accordion
| 12. Testimonial Slider
| 13. Pricing Toggle
| 14. Shop Page Filter
| 15. Search Toggle & Cart Badge
| 16. Shop Filter & Sorting
| 17. Mobile Menu Sidebar
| 18. Dashboard Sidebar
| 19. Working Process Accordion
| 20. Shop Details Functionality
| 21. Service Button Dash Animation
| 22. Button Blur Animation
| 23. Password Toggle (Sign In / Sign Up)
| 24. OTP Input
| 25. Sales Performance Chart
| 26. Services Doughnut Chart
| 27. Table Controls (Select All / Delete)
| 28. Image Compare Slider
| 29. Parallax (GSAP) Animation
| 30. Form Validation & Submissions
| 31. Lightbox Popup
|--------------------------------------------------------------------------
*/

  /*--------------------------------------------------------------
  Scripts initialization
  --------------------------------------------------------------*/
  var scriptStart = Date.now();
  var $window = $(window);
  var $document = $(document);
  var $body = $("body");

  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  if (typeof gsap !== "undefined") {
    var gsapPlugins = [];

    if (typeof ScrollTrigger !== "undefined") {
      gsapPlugins.push(ScrollTrigger);
    }

    if (typeof ScrollToPlugin !== "undefined") {
      gsapPlugins.push(ScrollToPlugin);
    }

    if (gsapPlugins.length) {
      gsap.registerPlugin.apply(gsap, gsapPlugins);
    }
  }

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  
  var $scrollUpBtn = null;
  var salesChartInstance = null;
  var servicesChartInstance = null;

  var updateStickyHeader = null;

  var scrollTicking = false;
  $window.on("scroll.patie", function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      showScrollUp();
      if (typeof updateStickyHeader === "function") {
        updateStickyHeader();
      }
      scrollTicking = false;
    });
  });

  $(function () {
    $window.trigger("resize");
    mainNav();
    setActiveNav();
    stickyHeader();
    dynamicBackground();
    swiperInit();
    modalVideo();
    scrollUp();
    initSearch();
    initCartBadge();
    handleShopSearchFilter();
    handleCategoryFilter();
    handleShopSort();
    initMobileMenu();
    initDashboardSidebar();
    initCountUp();
    initProgressBars();
    videoTextParallax();
    testimonialSlider();
    workingProcessSlider();
    pricingToggle();
    parentTestimonialSlider();
    beforeAfterSlider();
    boardingTestimonialSlider();
    buttonBlurAnimation();
    priceRangeSlider();
    workingProcessAccordion();
    imageCompare();
    shopDetails();
    serviceBtnDashAnimation();
    passwordToggle();
    otpInput();
    salesChart();
    servicesDoughnutChart();
    tableControls();
    initAccordions();
    formHandling();
    initLightbox();
  });

  $window.on("load", function () {
    $window.trigger("scroll");
    $window.trigger("resize");
    preloader();
  });

  /*--------------------------------------------------------------
  1. Preloader
  --------------------------------------------------------------*/
  function preloader() {
    var preloaderEl = document.getElementById("preloader");
    var isDone = false;

    if (typeof AOS !== "undefined") {
      AOS.init({
        once: true,
        startEvent: "aosStart",
      });
    }

    function onPreloaderDone() {
      if (isDone) return;
      isDone = true;

      document.body.classList.add("preloader-done");

      if (typeof AOS !== "undefined") {
        document.dispatchEvent(new Event("aosStart"));
      }

      var heroBadge = document.querySelector(".hero-grooming__badge");
      if (heroBadge) {
        setTimeout(function () {
          heroBadge.classList.add("hero-grooming__badge--visible");
        }, 500);
      }
    }

    if (!preloaderEl) {
      onPreloaderDone();
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
      return;
    }

    var minDisplay = parseInt(preloaderEl.getAttribute("data-min-display"), 10) || 500;
    var doneTimeout = null;

    function finish() {
      if (preloaderEl.classList.contains("preloader--done")) return;
      preloaderEl.classList.add("preloader--done");
      preloaderEl.setAttribute("aria-hidden", "true");

      if (doneTimeout) {
        clearTimeout(doneTimeout);
        doneTimeout = null;
      }

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }

    function dismiss() {
      preloaderEl.classList.add("preloader--hidden");
      onPreloaderDone();

      preloaderEl.addEventListener("transitionend", finish, { once: true });
      doneTimeout = setTimeout(finish, 800);
    }

    var elapsed = Date.now() - scriptStart;
    var remaining = Math.max(0, minDisplay - elapsed);
    setTimeout(dismiss, remaining);
  }

  /*--------------------------------------------------------------
  2. Mobile Menu
  --------------------------------------------------------------*/
  function mainNav() {
    if ($.exists(".ak-nav")) {
      $(".ak-nav").each(function () {
        if (!$(this).find(".ak-menu_toggle").length) {
          $(this).append(
            '<button type="button" class="ak-menu_toggle" aria-label="Open menu" aria-expanded="false">' +
              '<span aria-hidden="true"></span>' +
              "</button>",
          );
        }
      });

      $(".ak-nav .menu-item-has-children, .ak-nav .menu-item-has-black-section").each(function () {
        if (!$(this).children(".ak-menu_dropdown_toggle").length) {
          $(this).append(
            '<button type="button" class="ak-menu_dropdown_toggle" aria-label="Toggle submenu" aria-expanded="false"></button>',
          );
        }
      });

      $document.on("click", ".ak-menu_toggle", function () {
        var $btn = $(this);
        var expanded = $btn.attr("aria-expanded") === "true";
        $btn
          .attr("aria-expanded", String(!expanded))
          .toggleClass("ak-toggle_active")
          .siblings(".ak-nav_list")
          .stop(true, true)
          .slideToggle();
      });

      $document.on("click", ".ak-menu_dropdown_toggle", function () {
        var $btn = $(this);
        var $submenu = $btn.siblings("ul");
        var expanded = $btn.attr("aria-expanded") === "true";
        $btn.attr("aria-expanded", String(!expanded)).toggleClass("active");
        $submenu.stop(true, true).slideToggle();
        $btn.parent().toggleClass("active");
      });
    }
  }

  /*--------------------------------------------------------------
  3. Active Navigation State
  --------------------------------------------------------------*/
  function setActiveNav() {
    if ($.exists(".site-header__menu-item")) {
      function getCleanPage(url) {
        if (!url) return "index.html";
        var clean = url.split("?")[0].split("#")[0];
        var lastSlash = clean.lastIndexOf("/");
        var file = lastSlash !== -1 ? clean.substring(lastSlash + 1) : clean;
        if (file.indexOf("./") === 0) {
          file = file.substring(2);
        }
        return (!file || file === "/") ? "index.html" : file;
      }

      var currentPage = getCleanPage(window.location.pathname);
      var $menuItems = $(".site-header__menu-item");
      var $targetItem = null;
      var $targetSubmenuLink = null;

      $menuItems.each(function () {
        var $item = $(this);
        var directHref = $item.find("> .site-header__menu-link").attr("href");
        if (getCleanPage(directHref) === currentPage) {
          $targetItem = $item;
        }

        $item.find(".site-header__submenu-link").each(function () {
          var subHref = $(this).attr("href");
          if (getCleanPage(subHref) === currentPage) {
            $targetItem = $item;
            $targetSubmenuLink = $(this);
            return false;
          }
        });

        if ($targetSubmenuLink) return false;
      });

      $(".site-header__menu-item").removeClass("site-header__menu-item--active");
      $(".site-header__menu-link, .site-header__submenu-link").removeAttr("aria-current");
      $(".site-header__submenu-link").removeClass("site-header__submenu-link--active");

      if ($targetItem) {
        $targetItem.addClass("site-header__menu-item--active");
        $targetItem.find("> .site-header__menu-link").attr("aria-current", "page");

        $body.addClass("nav-no-transition");
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            $body.removeClass("nav-no-transition");
          });
        });
      }

      if ($targetSubmenuLink) {
        $targetSubmenuLink.addClass("site-header__submenu-link--active").attr("aria-current", "page");
      }
    }
  }

  /*--------------------------------------------------------------
  4. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    if ($.exists(".ak-sticky_header")) {
      var lastScrollTop = 0;
      var $header = $(".ak-sticky_header");
      var enterThreshold = 200;
      var scrollDelta = 10;
      var $spacer = $('<div class="ak-sticky-spacer" style="display: none;"></div>');

      if ($header.length) {
        $header.before($spacer);
      }

      $window.on("resize.stickySpacer", function () {
        if ($spacer.is(":visible")) {
          $spacer.css("height", $header.outerHeight() + "px");
        }
      });

      updateStickyHeader = function () {
        var windowTop = $window.scrollTop();
        var stickyThreshold = ($header.hasClass("boarding-header") && window.innerWidth > 991) ? 40 : 50;

        if (windowTop <= stickyThreshold) {
          if ($header.hasClass("ak-gescout_sticky")) {
            $header.css("transition", "none");
            $header.removeClass("ak-gescout_sticky ak-gescout_show");
            $spacer.hide();

            requestAnimationFrame(function () {
              $header.css("transition", "");
            });
          }
          lastScrollTop = windowTop;
          return;
        }

        var diff = Math.abs(windowTop - lastScrollTop);
        if (diff < scrollDelta) return;

        if (windowTop >= enterThreshold) {
          if (!$header.hasClass("ak-gescout_sticky")) {
            var isOut = $header.css("position") === "absolute" || $header.css("position") === "fixed";
            if (!isOut) {
              $spacer.css({
                height: $header.outerHeight() + "px",
                display: "block",
                width: "100%",
              });
            }

            $header.css("transition", "none");
            $header.addClass("ak-gescout_sticky");

            requestAnimationFrame(function () {
              $header.css("transition", "");
            });
          }

          if (windowTop < lastScrollTop) {
            $header.addClass("ak-gescout_show");
          } else {
            $header.removeClass("ak-gescout_show");
          }
        }

        lastScrollTop = windowTop;
      };
    }
  }

  /*--------------------------------------------------------------
  5. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    var $bgElements = $("[data-src]:not(img):not(iframe):not(video)").not(".shop-details__main-img-wrap");
    if ($bgElements.length) {
      $bgElements.each(function () {
        var src = this.getAttribute("data-src");
        if (src) {
          this.style.backgroundImage = 'url("' + src + '")';
        }
      });
    }
  }

  /*--------------------------------------------------------------
  6. Swiper Slider
  --------------------------------------------------------------*/
  function swiperInit() {
    if (typeof Swiper === "undefined") return;

    if ($.exists(".ak-slider-hero-1")) {
      new Swiper(".ak-slider-hero-1", {
        loop: true,
        speed: 1200,
        parallax: true,
        zoom: { maxRatio: 5 },
        autoplay: reduceMotion ? false : { delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true },
        watchSlidesProgress: true,
        slidesPerView: "auto",
        pagination: {
          el: ".hero-swiper-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return '<p class="' + className + '">' + (index + 1) + "</p>";
          },
        },
        navigation: {
          nextEl: ".ak-swiper-button-next",
          prevEl: ".ak-swiper-button-prev",
        },
      });
    }

    if ($.exists(".pet-grooming-slider")) {
      new Swiper(".pet-grooming-slider", {
        loop: true,
        loopedSlides: 4,
        speed: 1000,
        grabCursor: true,
        watchSlidesProgress: true,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        autoplay: reduceMotion
          ? false
          : {
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
        slidesPerView: 4,
        spaceBetween: 30,
        pagination: {
          el: ".pet-grooming-service__pagination",
          clickable: true,
          bulletClass: "common-pagination__dot",
          bulletActiveClass: "common-pagination__dot--active",
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 20 },
          576: { slidesPerView: 1, spaceBetween: 25 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          992: { slidesPerView: 3, spaceBetween: 30 },
          1200: { slidesPerView: 4, spaceBetween: 30 },
        },
      });
    }
  }

  /*--------------------------------------------------------------
  7. Modal Video
  --------------------------------------------------------------*/
  function modalVideo() {
    if ($.exists(".ak-video-open")) {
      var $activeTrigger = null;

      function extractVideoEmbedUrl(url) {
        if (!url || url === "#") return null;

        var ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
          return "https://www.youtube.com/embed/" + ytMatch[1] + "?autoplay=1&rel=0";
        }

        var vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
          return "https://player.vimeo.com/video/" + vimeoMatch[1] + "?autoplay=1";
        }

        return null;
      }

      function closeVideoPopup() {
        $(".ak-video-popup").removeClass("active");
        $("html, body").removeClass("overflow-hidden");
        $(".ak-video-popup-container iframe").attr("src", "about:blank");

        if ($activeTrigger && $activeTrigger.length) {
          $activeTrigger.trigger("focus");
          $activeTrigger = null;
        }
      }

      $document.on("click", ".ak-video-open", function (e) {
        e.preventDefault();
        $activeTrigger = $(this);

        var embedUrl = extractVideoEmbedUrl($activeTrigger.attr("href"));
        if (!embedUrl) return;

        $(".ak-video-popup-container iframe").attr("src", embedUrl);
        $(".ak-video-popup").addClass("active");
        $("html, body").addClass("overflow-hidden");
        $(".ak-video-popup-close").trigger("focus");
      });

      $document.on("click", ".ak-video-popup-close, .ak-video-popup-layer", function (e) {
        e.preventDefault();
        closeVideoPopup();
      });

      $document.on("keydown.videoPopup", function (e) {
        if (e.key === "Escape" && $(".ak-video-popup").hasClass("active")) {
          closeVideoPopup();
        }
      });
    }
  }

  /*--------------------------------------------------------------
  8. Scroll Up
  --------------------------------------------------------------*/
  function scrollUp() {
    $scrollUpBtn = $(".ak-scrollup");
    if ($scrollUpBtn.length) {
      if (!$scrollUpBtn.attr("aria-label")) {
        $scrollUpBtn.attr("aria-label", "Scroll to top");
      }

      $document.on("click", ".ak-scrollup", function (e) {
        e.preventDefault();
        $("html, body").stop(true).animate({ scrollTop: 0 }, 600);
      });
    }
  }

  function showScrollUp() {
    if (!$scrollUpBtn) {
      $scrollUpBtn = $(".ak-scrollup");
    }
    if ($scrollUpBtn.length) {
      $scrollUpBtn.toggleClass("ak-scrollup-show", $window.scrollTop() >= 350);
    }
  }

  /*--------------------------------------------------------------
  9. Count Up Animation
  --------------------------------------------------------------*/
  function initCountUp() {
    if (!$.exists(".count-up")) return;
    var countEls = document.querySelectorAll(".count-up");
    if (!countEls.length) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatNumber(val, decimals, separator) {
      var str = val.toFixed(decimals);
      if (separator) {
        var parts = str.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return parts.join(".");
      }
      return str;
    }

    function animateEl(el) {
      if (el.getAttribute("data-counted") === "true") return;
      el.setAttribute("data-counted", "true");

      var rawTarget = el.getAttribute("data-target") || el.textContent.trim();
      var cleanTarget = rawTarget.replace(/[^0-9.-]+/g, "");
      var target = parseFloat(cleanTarget);
      if (isNaN(target)) return;

      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = parseFloat(el.getAttribute("data-duration") || "2");
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var separator = el.getAttribute("data-separator") || "";

      if (prefersReducedMotion || typeof gsap === "undefined") {
        el.textContent = prefix + formatNumber(target, decimals, separator) + suffix;
        return;
      }

      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: duration,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = prefix + formatNumber(obj.val, decimals, separator) + suffix;
        },
        onComplete: function () {
          el.textContent = prefix + formatNumber(target, decimals, separator) + suffix;
        }
      });
    }

    if (!("IntersectionObserver" in window)) {
      countEls.forEach(animateEl);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          if (entry.target.classList.contains("count-up")) {
            animateEl(entry.target);
          } else {
            var nested = entry.target.querySelectorAll(".count-up");
            nested.forEach(animateEl);
          }
        }
      });
    }, { threshold: 0.2 });

    var observedTargets = new Set();
    countEls.forEach(function (el) {
      var aosParent = el.closest("[data-aos]");
      var watchTarget = aosParent || el;
      if (!observedTargets.has(watchTarget)) {
        observedTargets.add(watchTarget);
        observer.observe(watchTarget);
      }
    });
  }

  /*--------------------------------------------------------------
  10. Progress Bar Animation (scroll-triggered)
  --------------------------------------------------------------*/
  function initProgressBars() {
    if (!$.exists(".ak-progress-bar")) return;
    var bars = document.querySelectorAll(".ak-progress-bar[data-width]");
    if (!bars.length) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function activateBar(bar) {
      if (bar.getAttribute("data-animated") === "true") return;
      bar.setAttribute("data-animated", "true");

      var targetWidth = bar.getAttribute("data-width") || "0%";
      var numericVal = parseInt(targetWidth, 10) || 0;

      bar.setAttribute("role", "progressbar");
      bar.setAttribute("aria-valuenow", numericVal);
      bar.setAttribute("aria-valuemin", "0");
      bar.setAttribute("aria-valuemax", "100");

      if (prefersReducedMotion) {
        bar.style.transition = "none";
        bar.style.width = targetWidth;
        return;
      }

      setTimeout(function () {
        bar.style.width = targetWidth;
      }, 100);
    }

    if (!("IntersectionObserver" in window)) {
      bars.forEach(activateBar);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          activateBar(entry.target);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  /*--------------------------------------------------------------
  11. Accordion
  --------------------------------------------------------------*/
  function initAccordions() {
    if ($.exists(".ak-accordion-title")) {
      $(".ak-accordion-title").attr({ role: "button", tabindex: "0" });
      $(".ak-accordion-title").each(function () {
        $(this).attr("aria-expanded", $(this).hasClass("active") ? "true" : "false");
      });

      function toggleAkAccordion($title) {
        $title.toggleClass("active");
        var isExpanded = $title.hasClass("active");
        $title.attr("aria-expanded", isExpanded ? "true" : "false");
        var $accordionTab = $title.next(".ak-accordion-tab");
        $accordionTab.stop(true, true).slideToggle();
        var $siblings = $title.parent().siblings();
        $siblings.find(".ak-accordion-tab").stop(true, true).slideUp();
        $siblings.find(".ak-accordion-title").removeClass("active").attr("aria-expanded", "false");
      }

      $document.on("click", ".ak-accordion-title", function () {
        toggleAkAccordion($(this));
      });

      $document.on("keydown", ".ak-accordion-title", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleAkAccordion($(this));
        }
      });
    }

    if ($.exists(".faq-accordion__header")) {
      $(".faq-accordion").each(function () {
        var $container = $(this);
        $container.find(".faq-accordion__header").attr({ role: "button", tabindex: "0" });

        $container.find(".faq-accordion__item").each(function () {
          var $item = $(this);
          var $header = $item.find(".faq-accordion__header");
          var $body = $item.find(".faq-accordion__body");
          var $icon = $item.find(".faq-accordion__icon i");
          var isActive = $item.hasClass("faq-accordion__item--active");

          $header.attr("aria-expanded", isActive ? "true" : "false");
          $body.attr("role", "region");

          if (isActive) {
            $body.css("height", "auto");
            $icon.removeClass("fa-plus").addClass("fa-minus");
          } else {
            $body.css("height", "0");
            $icon.removeClass("fa-minus").addClass("fa-plus");
          }
        });
      });

      function closeFaqItem($item) {
        var $header = $item.find(".faq-accordion__header");
        var $body = $item.find(".faq-accordion__body");
        var $icon = $item.find(".faq-accordion__icon i");

        $item.removeClass("faq-accordion__item--active");
        $header.attr("aria-expanded", "false");
        $icon.removeClass("fa-minus").addClass("fa-plus");

        $body.css("height", $body[0].scrollHeight + "px");
        $body[0].offsetHeight;
        $body.css("height", "0");
      }

      function openFaqItem($item) {
        var $header = $item.find(".faq-accordion__header");
        var $body = $item.find(".faq-accordion__body");
        var $icon = $item.find(".faq-accordion__icon i");

        $item.addClass("faq-accordion__item--active");
        $header.attr("aria-expanded", "true");
        $icon.removeClass("fa-plus").addClass("fa-minus");

        $body.css("height", $body[0].scrollHeight + "px");
        $body.one("transitionend", function () {
          if ($item.hasClass("faq-accordion__item--active")) {
            $body.css("height", "auto");
          }
        });
      }

      function toggleFaqItem($header) {
        var $item = $header.closest(".faq-accordion__item");
        if ($item.hasClass("faq-accordion__item--active")) {
          closeFaqItem($item);
        } else {
          $item.siblings(".faq-accordion__item--active").each(function () {
            closeFaqItem($(this));
          });
          openFaqItem($item);
        }
      }

      $document.on("click", ".faq-accordion__header", function () {
        toggleFaqItem($(this));
      });

      $document.on("keydown", ".faq-accordion__header", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFaqItem($(this));
        }
      });
    }
  }

  /*--------------------------------------------------------------
  12. Testimonial Slider
  --------------------------------------------------------------*/
  function testimonialSlider() {
    if ($.exists(".testimonial__avatar")) {
      var $avatars = $(".testimonial__avatar");
      var $slides = $(".testimonial__slide-content");
      var total = $avatars.length;
      if (!total) return;

      var isAnimating = false;
      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var currentIndex = $avatars.index(
        $avatars.filter(".testimonial__avatar--center"),
      );
      if (currentIndex < 0) currentIndex = 0;

      $avatars.attr({ role: "button", tabindex: "0" }).each(function (idx) {
        $(this).attr("aria-label", "View testimonial " + (idx + 1));
      });
      $(".testimonial__nav--next").attr("aria-label", "Next testimonial");
      $(".testimonial__nav--prev").attr("aria-label", "Previous testimonial");

      $slides.attr("aria-hidden", "true").hide();
      $slides.eq(currentIndex).attr("aria-hidden", "false").show();

      function updateActiveAvatar(index) {
        $avatars.removeClass("testimonial__avatar--center").addClass("testimonial__avatar--side");
        $avatars.eq(index).removeClass("testimonial__avatar--side").addClass("testimonial__avatar--center");
      }

      function showSlide(index, direction) {
        if (isAnimating) return;
        var $current = $slides.filter(":visible");
        var $next = $slides.eq(index);
        if ($current.is($next)) return;

        isAnimating = true;
        updateActiveAvatar(index);

        if (prefersReducedMotion) {
          $current.attr("aria-hidden", "true").hide();
          $next.attr("aria-hidden", "false").show();
          isAnimating = false;
          return;
        }

        var slideOut = direction === "next" ? "-60px" : "60px";
        var slideIn = direction === "next" ? "60px" : "-60px";

        $current.css({
          transition: "opacity 0.22s ease, transform 0.22s ease",
          opacity: "0",
          transform: "translateX(" + slideOut + ")"
        });

        setTimeout(function () {
          $current.hide().attr("aria-hidden", "true").css({ transition: "", opacity: "", transform: "" });

          $next.css({
            display: "block",
            opacity: "0",
            transform: "translateX(" + slideIn + ")",
            transition: "none"
          }).attr("aria-hidden", "false");

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              $next.css({
                transition: "opacity 0.28s ease, transform 0.28s ease",
                opacity: "1",
                transform: "translateX(0)"
              });
              setTimeout(function () {
                $next.css({ transition: "", transform: "" });
                isAnimating = false;
              }, 280);
            });
          });
        }, 220);
      }

      $document.on("click", ".testimonial__nav--next", function () {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % total;
        showSlide(currentIndex, "next");
      });

      $document.on("click", ".testimonial__nav--prev", function () {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + total) % total;
        showSlide(currentIndex, "prev");
      });

      function handleAvatarSelect($el) {
        if (isAnimating) return;
        var newIndex = $avatars.index($el);
        if (newIndex === currentIndex || newIndex < 0) return;
        var direction = newIndex > currentIndex ? "next" : "prev";
        currentIndex = newIndex;
        showSlide(currentIndex, direction);
      }

      $document.on("click", ".testimonial__avatar", function () {
        handleAvatarSelect($(this));
      });

      $document.on("keydown", ".testimonial__avatar", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAvatarSelect($(this));
        }
      });
    }
  }

  function parentTestimonialSlider() {
    if ($.exists(".parent-testimonial")) {
      var $avatars = $(".parent-testimonial__avatar");
      var $slides = $(".parent-testimonial__slide");
      var total = $avatars.length;
      if (!total) return;

      var isAnimating = false;
      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var currentIndex = $avatars.index(
        $avatars.filter(".parent-testimonial__avatar--center"),
      );
      if (currentIndex < 0) currentIndex = 0;

      $avatars.attr({ role: "button", tabindex: "0" }).each(function (idx) {
        $(this).attr("aria-label", "View testimonial " + (idx + 1));
      });
      $(".parent-testimonial__nav--next").attr("aria-label", "Next testimonial");
      $(".parent-testimonial__nav--prev").attr("aria-label", "Previous testimonial");

      $slides.attr("aria-hidden", "true").hide();
      $slides.eq(currentIndex).attr("aria-hidden", "false").show();

      function updateActiveAvatar(index) {
        $avatars.removeClass("parent-testimonial__avatar--center").addClass("parent-testimonial__avatar--side");
        $avatars.eq(index).removeClass("parent-testimonial__avatar--side").addClass("parent-testimonial__avatar--center");
      }

      function showSlide(index, direction) {
        if (isAnimating) return;
        var $current = $slides.filter(":visible");
        var $next = $slides.eq(index);
        if ($current.is($next)) return;

        isAnimating = true;
        updateActiveAvatar(index);

        if (prefersReducedMotion) {
          $current.attr("aria-hidden", "true").hide();
          $next.attr("aria-hidden", "false").show();
          isAnimating = false;
          return;
        }

        var slideOut = direction === "next" ? "-50px" : "50px";
        var slideIn = direction === "next" ? "50px" : "-50px";

        $current.css({
          transition: "opacity 0.22s ease, transform 0.22s ease",
          opacity: "0",
          transform: "translateX(" + slideOut + ")"
        });

        setTimeout(function () {
          $current.hide().attr("aria-hidden", "true").css({ transition: "", opacity: "", transform: "" });

          $next.css({
            display: "block",
            opacity: "0",
            transform: "translateX(" + slideIn + ")",
            transition: "none"
          }).attr("aria-hidden", "false");

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              $next.css({
                transition: "opacity 0.28s ease, transform 0.28s ease",
                opacity: "1",
                transform: "translateX(0)"
              });
              setTimeout(function () {
                $next.css({ transition: "", transform: "" });
                isAnimating = false;
              }, 280);
            });
          });
        }, 220);
      }

      $document.on("click", ".parent-testimonial__nav--next", function () {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % total;
        showSlide(currentIndex, "next");
      });

      $document.on("click", ".parent-testimonial__nav--prev", function () {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + total) % total;
        showSlide(currentIndex, "prev");
      });

      function handleAvatarSelect($el) {
        if (isAnimating) return;
        var newIndex = $avatars.index($el);
        if (newIndex === currentIndex || newIndex < 0) return;
        var direction = newIndex > currentIndex ? "next" : "prev";
        currentIndex = newIndex;
        showSlide(currentIndex, direction);
      }

      $document.on("click", ".parent-testimonial__avatar", function () {
        handleAvatarSelect($(this));
      });

      $document.on("keydown", ".parent-testimonial__avatar", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAvatarSelect($(this));
        }
      });
    }
  }

  function beforeAfterSlider() {
    if ($.exists(".before-and-after__dot")) {
      var $dots = $(".before-and-after__dot");
      var totalDots = $dots.length;
      var $imgEl = $(".before-and-after__img");

      if (totalDots === 0 || $imgEl.length === 0) return;

      var currentIndex = $dots.filter(".before-and-after__dot--active").index();
      if (currentIndex === -1) currentIndex = 0;

      var isAnimating = false;
      var isHovered = false;
      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      $dots.attr({ role: "button", tabindex: "0" }).each(function (idx) {
        $(this).attr("aria-label", "Show comparison " + (idx + 1));
      });

      function changeSlide(newIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;

        var $current = $(".before-and-after__img--current");
        var $next = $(".before-and-after__img--next");

        var newSrc = $dots.eq(newIndex).data("img-src");
        if (newSrc) $next.attr("src", newSrc);

        if (prefersReducedMotion) {
          $current.removeClass("before-and-after__img--current").addClass("before-and-after__img--next");
          $next.addClass("before-and-after__img--current").removeClass("before-and-after__img--next");
          isAnimating = false;
          return;
        }

        $next.css("transition", "none");
        if (direction === "next") {
          $next.css("transform", "translateX(100%)").removeClass("is-entering is-entering-prev");
        } else {
          $next.css("transform", "translateX(-100%)").removeClass("is-entering is-entering-prev");
        }
        $next[0].offsetHeight;
        $next.css("transition", "");

        if (direction === "next") {
          $current.addClass("is-leaving");
          $next.css("transform", "translateX(0)");
        } else {
          $current.addClass("is-leaving-prev");
          $next.css("transform", "translateX(0)");
        }

        setTimeout(function () {
          $current
            .removeClass("is-leaving is-leaving-prev")
            .addClass("before-and-after__img--next")
            .removeClass("before-and-after__img--current")
            .css("transform", "");
          $next
            .addClass("before-and-after__img--current")
            .removeClass("before-and-after__img--next")
            .css("transform", "");

          isAnimating = false;
        }, 620);
      }

      var intervalId = null;
      var isVisible = false;

      function startAutoPlay() {
        if (intervalId || !isVisible || isHovered || prefersReducedMotion) return;
        intervalId = setInterval(function () {
          var nextIndex = (currentIndex + 1) % totalDots;
          $dots.removeClass("before-and-after__dot--active");
          $dots.eq(nextIndex).addClass("before-and-after__dot--active");
          changeSlide(nextIndex, "next");
          currentIndex = nextIndex;
        }, 4000);
      }

      function stopAutoPlay() {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }

      var sectionEl = document.querySelector(".before-and-after");
      if (sectionEl) {
        $(sectionEl).on("mouseenter focusin", function () {
          isHovered = true;
          stopAutoPlay();
        }).on("mouseleave focusout", function () {
          isHovered = false;
          startAutoPlay();
        });

        if ("IntersectionObserver" in window) {
          var visibilityObserver = new IntersectionObserver(
            function (entries) {
              isVisible = entries[0].isIntersecting;
              if (isVisible) {
                startAutoPlay();
              } else {
                stopAutoPlay();
              }
            },
            { threshold: 0.2 },
          );
          visibilityObserver.observe(sectionEl);
        } else {
          isVisible = true;
          startAutoPlay();
        }
      } else {
        isVisible = true;
        startAutoPlay();
      }

      function selectDot($dot) {
        var newIndex = $dot.index();
        if (newIndex === currentIndex || isAnimating || newIndex < 0) return;

        stopAutoPlay();
        var direction = newIndex > currentIndex ? "next" : "prev";
        $dots.removeClass("before-and-after__dot--active");
        $dot.addClass("before-and-after__dot--active");
        changeSlide(newIndex, direction);
        currentIndex = newIndex;
        startAutoPlay();
      }

      $document.on("click", ".before-and-after__dot", function () {
        selectDot($(this));
      });

      $document.on("keydown", ".before-and-after__dot", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectDot($(this));
        }
      });
    }
  }

  function boardingTestimonialSlider() {
    if ($.exists(".boarding-testimonial__nav-btn--prev, .boarding-testimonial__nav-btn--next")) {
      var $prevBtn = $(".boarding-testimonial__nav-btn--prev");
      var $nextBtn = $(".boarding-testimonial__nav-btn--next");
      if (!$prevBtn.length && !$nextBtn.length) return;

      var $slides = $(".boarding-testimonial__slide");
      var total = $slides.length;
      if (!total) return;

      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var initialIndex = $slides.filter(".boarding-testimonial__slide--active").index();
      var currentIndex = initialIndex >= 0 ? initialIndex : 0;
      var animating = false;

      $prevBtn.attr("aria-label", "Previous testimonial");
      $nextBtn.attr("aria-label", "Next testimonial");

      $slides.each(function (idx) {
        $(this).attr("aria-hidden", idx === currentIndex ? "false" : "true");
      });

      function showSlide(index, direction) {
        if (animating) return;
        var $current = $slides.filter(".boarding-testimonial__slide--active");
        var $next = $slides.eq(index);
        if ($current.is($next)) return;

        animating = true;

        if (prefersReducedMotion) {
          $current.removeClass("boarding-testimonial__slide--active").attr("aria-hidden", "true");
          $next.addClass("boarding-testimonial__slide--active").attr("aria-hidden", "false");
          animating = false;
          return;
        }

        var slideOut = direction === "next" ? "-50px" : "50px";
        var slideIn = direction === "next" ? "50px" : "-50px";

        var $currentContent = $current.find(
          "> *:not(.boarding-testimonial__user), .boarding-testimonial__user-info",
        );
        var $nextContent = $next.find(
          "> *:not(.boarding-testimonial__user), .boarding-testimonial__user-info",
        );

        $currentContent.css({
          transition: "opacity 0.22s ease, transform 0.22s ease",
          opacity: "1",
          transform: "translateX(0)",
        });
        requestAnimationFrame(function () {
          $currentContent.css({
            opacity: "0",
            transform: "translateX(" + slideOut + ")",
          });
        });

        setTimeout(function () {
          $current.removeClass("boarding-testimonial__slide--active").attr("aria-hidden", "true");
          $currentContent.css({ transition: "", opacity: "", transform: "" });

          $nextContent.css({
            transition: "none",
            opacity: "0",
            transform: "translateX(" + slideIn + ")",
          });
          $next.addClass("boarding-testimonial__slide--active").attr("aria-hidden", "false");

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              $nextContent.css({
                transition: "opacity 0.28s ease, transform 0.28s ease",
                opacity: "1",
                transform: "translateX(0)",
              });
              setTimeout(function () {
                $nextContent.css({
                  transition: "",
                  opacity: "",
                  transform: "",
                });
                animating = false;
              }, 300);
            });
          });
        }, 240);
      }

      $document.on("click", ".boarding-testimonial__nav-btn--next", function () {
        if (animating) return;
        currentIndex = (currentIndex + 1) % total;
        showSlide(currentIndex, "next");
      });

      $document.on("click", ".boarding-testimonial__nav-btn--prev", function () {
        if (animating) return;
        currentIndex = (currentIndex - 1 + total) % total;
        showSlide(currentIndex, "prev");
      });
    }
  }

  function workingProcessSlider() {
    if ($.exists(".working-process__progress-bar")) {
      var $slides = $(".working-process__slide-data");
      var totalSteps = $slides.length;
      if (!totalSteps) return;

      var currentIndex = 1;
      var isAnimating = false;
      var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var $progress = $(".working-process__progress-bar");
      var $title = $(".working-process__slide-title");
      var $desc = $(".working-process__slide-desc");
      var $img = $(".working-process__img");
      var $badgeText = $(".working-process__badge-text");

      $progress.attr({
        role: "progressbar",
        "aria-valuemin": "1",
        "aria-valuemax": totalSteps,
        "aria-valuenow": "1"
      });

      $(".working-process__nav-btn").each(function () {
        var isNext = $(this).find(".fa-chevron-right").length > 0 || $(this).is(":last-child");
        $(this).attr("aria-label", isNext ? "Next step" : "Previous step");
      });

      function updateStep(index, direction) {
        if (isAnimating) return;
        isAnimating = true;

        $progress.attr("aria-valuenow", index);

        if (prefersReducedMotion) {
          var $slide = $slides.eq(index - 1);
          $badgeText.text($slide.data("badge"));
          $title.text($slide.data("title"));
          $desc.text($slide.data("desc"));
          var progressPos = ((index - 1) / totalSteps) * 100;
          $progress.css("left", progressPos + "%");
          isAnimating = false;
          return;
        }

        var leaveClass = direction === "next" ? "is-leaving" : "is-leaving-prev";
        var enterClass = direction === "next" ? "is-entering" : "is-entering-prev";

        $img.removeClass("is-leaving is-leaving-prev is-entering is-entering-prev").addClass(leaveClass);
        $badgeText.removeClass("is-leaving is-leaving-prev is-entering is-entering-prev").addClass(leaveClass);
        $title.removeClass("is-leaving is-leaving-prev is-entering is-entering-prev").addClass(leaveClass);
        $desc.removeClass("is-leaving is-leaving-prev is-entering is-entering-prev").addClass(leaveClass);

        setTimeout(function () {
          var $slide = $slides.eq(index - 1);
          var badge = $slide.data("badge");
          var slideTitle = $slide.data("title");
          var slideDesc = $slide.data("desc");

          $badgeText.text(badge);
          $title.text(slideTitle);
          $desc.text(slideDesc);

          var progressPos = ((index - 1) / totalSteps) * 100;
          $progress.css("left", progressPos + "%");

          $img.css("transition", "none");
          $badgeText.css("transition", "none");
          $title.css("transition", "none");
          $desc.css("transition", "none");

          $img.removeClass(leaveClass).addClass(enterClass);
          $badgeText.removeClass(leaveClass).addClass(enterClass);
          $title.removeClass(leaveClass).addClass(enterClass);
          $desc.removeClass(leaveClass).addClass(enterClass);

          $img[0].offsetHeight;

          $img.css("transition", "");
          $badgeText.css("transition", "");
          $title.css("transition", "");
          $desc.css("transition", "");

          $img.removeClass(enterClass);
          $badgeText.removeClass(enterClass);
          $title.removeClass(enterClass);
          $desc.removeClass(enterClass);

          isAnimating = false;
        }, 280);
      }

      $document.on("click", ".working-process__nav-btn", function () {
        if (isAnimating) return;
        var isNext = $(this).find(".fa-chevron-right").length > 0 || $(this).is(":last-child");
        if (isNext) {
          currentIndex = currentIndex < totalSteps ? currentIndex + 1 : 1;
          updateStep(currentIndex, "next");
        } else {
          currentIndex = currentIndex > 1 ? currentIndex - 1 : totalSteps;
          updateStep(currentIndex, "prev");
        }
      });
    }
  }

  /*--------------------------------------------------------------
  13. Pricing Toggle
  --------------------------------------------------------------*/
  function pricingToggle() {
    if (!$.exists(".pricing__toggle-btn, .grooming-pricing__toggle-btn")) return;

    var isAnimating = false;
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    $(".pricing__toggle, .grooming-pricing__toggle").each(function () {
      var $container = $(this);
      var $buttons = $container.find(".pricing__toggle-btn, .grooming-pricing__toggle-btn");
      $buttons.attr({ role: "button", tabindex: "0" }).each(function () {
        var isActive = $(this).hasClass("pricing__toggle-btn--active") || $(this).hasClass("grooming-pricing__toggle-btn--active");
        $(this).attr("aria-pressed", isActive ? "true" : "false");
      });
    });

    function handleToggle($btn) {
      if (isAnimating) return;
      var isGrooming = $btn.hasClass("grooming-pricing__toggle-btn");
      var btnClass = isGrooming ? "grooming-pricing__toggle-btn" : "pricing__toggle-btn";
      var sectionClass = isGrooming ? ".grooming-pricing" : ".pricing";

      if ($btn.hasClass(btnClass + "--active")) return;

      var $container = $btn.closest(".pricing__toggle, .grooming-pricing__toggle");
      $container.find("." + btnClass)
        .removeClass(btnClass + "--active")
        .addClass(btnClass + "--inactive")
        .attr("aria-pressed", "false");

      $btn
        .removeClass(btnClass + "--inactive")
        .addClass(btnClass + "--active")
        .attr("aria-pressed", "true");

      var isYearly = $btn.text().trim() === "YEARLY";
      var $section = $btn.closest(sectionClass);

      var $targets = $section.find(
        "[data-monthly][data-yearly], .grooming-pricing-card__desc, .pricing-card__period, .grooming-pricing-card__period",
      );

      function updateText() {
        $targets.each(function () {
          var $el = $(this);
          if ($el.is("[data-monthly][data-yearly]")) {
            var newValue = isYearly ? $el.attr("data-yearly") : $el.attr("data-monthly");
            if (newValue !== undefined && newValue !== false) {
              $el.text(newValue);
            }
          } else if ($el.is(".pricing-card__period, .grooming-pricing-card__period")) {
            var newPeriod = isYearly ? "/ Per Year" : "/ Per Month";
            $el.text(newPeriod);
          }
        });
      }

      if (prefersReducedMotion || typeof gsap === "undefined") {
        updateText();
        return;
      }

      isAnimating = true;
      var $cards = $section.find(".pricing-card, .grooming-pricing-card");
      var $cardInnerBoxes = $section.find(".pricing-card__info, .grooming-pricing-card__head");

      var startHeights = [];
      $cards.each(function () {
        startHeights.push($(this).outerHeight());
      });

      var startInnerHeights = [];
      $cardInnerBoxes.each(function () {
        startInnerHeights.push($(this).outerHeight());
      });

      gsap.to($targets.toArray(), {
        y: -12,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: function () {
          updateText();

          $cardInnerBoxes.each(function (index) {
            var $box = $(this);
            var oldBoxH = startInnerHeights[index];
            $box.css("height", "auto");
            var newBoxH = $box.outerHeight();

            if (oldBoxH && newBoxH && oldBoxH !== newBoxH) {
              gsap.fromTo(
                $box[0],
                { height: oldBoxH },
                {
                  height: newBoxH,
                  delay: 0.08,
                  duration: 0.35,
                  ease: "power2.out",
                  clearProps: "height",
                },
              );
            } else {
              $box.css("height", "");
            }
          });

          $cards.each(function (index) {
            var $card = $(this);
            var oldH = startHeights[index];
            $card.css("height", "auto");
            var newH = $card.outerHeight();

            if (oldH && newH && oldH !== newH) {
              gsap.fromTo(
                $card[0],
                { height: oldH },
                {
                  height: newH,
                  delay: 0.08,
                  duration: 0.35,
                  ease: "power2.out",
                  clearProps: "height",
                },
              );
            } else {
              $card.css("height", "");
            }
          });

          gsap.fromTo(
            $targets.toArray(),
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.28,
              stagger: 0.02,
              ease: "power2.out",
              clearProps: "transform,opacity",
              onComplete: function () {
                isAnimating = false;
              }
            },
          );
        },
      });
    }

    $document.on("click", ".pricing__toggle-btn, .grooming-pricing__toggle-btn", function () {
      handleToggle($(this));
    });

    $document.on("keydown", ".pricing__toggle-btn, .grooming-pricing__toggle-btn", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle($(this));
      }
    });
  }

  /*--------------------------------------------------------------
  14. Shop Page Filter
  --------------------------------------------------------------*/
  function priceRangeSlider() {
    if (!$.exists(".sidebar__filter-slider")) return;

    var $slider = $(".sidebar__filter-slider");
    var $track = $(".sidebar__filter-track");
    var $startBullet = $(".sidebar__filter-bullet--start");
    var $endBullet = $(".sidebar__filter-bullet--end");
    var $priceText = $(".sidebar__filter-price");

    var productPrices = $(".product-card")
      .map(function () {
        return (
          parseFloat($(this).data("price")) ||
          parseFloat(
            $(this)
              .find(".product-card__price")
              .text()
              .replace(/[^0-9.]/g, ""),
          ) || 0
        );
      })
      .get()
      .filter(function (val) {
        return val > 0;
      });

    var minPrice = productPrices.length ? Math.floor(Math.min.apply(null, productPrices)) : 0;
    var maxPrice = productPrices.length ? Math.ceil(Math.max.apply(null, productPrices)) : 300;

    if (maxPrice <= minPrice) {
      maxPrice = minPrice + 100;
    }

    var currentMin = minPrice;
    var currentMax = maxPrice;

    $slider.css("touch-action", "none");
    $startBullet.css({ left: "0%", "touch-action": "none" });
    $endBullet.css({ right: "0%", "touch-action": "none" });
    $track.css({ left: "0%", right: "0%" });
    $priceText.text("Price : " + currentMin + "$ - " + currentMax + "$");

    $startBullet.attr({
      role: "slider",
      tabindex: "0",
      "aria-label": "Minimum price",
      "aria-valuemin": minPrice,
      "aria-valuemax": maxPrice,
      "aria-valuenow": currentMin
    });

    $endBullet.attr({
      role: "slider",
      tabindex: "0",
      "aria-label": "Maximum price",
      "aria-valuemin": minPrice,
      "aria-valuemax": maxPrice,
      "aria-valuenow": currentMax
    });

    var isDragging = null;

    function updateSlider(bullet, clientX) {
      var sliderRect = $slider[0].getBoundingClientRect();
      if (!sliderRect.width) return;
      var percent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
      percent = Math.min(Math.max(percent, 0), 100);

      var startPercent = parseFloat($startBullet[0].style.left) || 0;
      var endPercent = 100 - (parseFloat($endBullet[0].style.right) || 0);

      if (bullet === "start") {
        if (percent < endPercent - 4) {
          $startBullet.css("left", percent + "%");
          $track.css("left", percent + "%");
          startPercent = percent;
        }
      } else {
        if (percent > startPercent + 4) {
          $endBullet.css("right", 100 - percent + "%");
          $track.css("right", 100 - percent + "%");
          endPercent = percent;
        }
      }

      var priceRange = maxPrice - minPrice;
      currentMin = Math.round(minPrice + (startPercent / 100) * priceRange);
      currentMax = Math.round(minPrice + (endPercent / 100) * priceRange);

      $startBullet.attr("aria-valuenow", currentMin);
      $endBullet.attr("aria-valuenow", currentMax);
      $priceText.text("Price : " + currentMin + "$ - " + currentMax + "$");
    }

    $document.on("pointerdown", ".sidebar__filter-bullet", function (e) {
      isDragging = $(this).hasClass("sidebar__filter-bullet--start") ? "start" : "end";
      if (e.currentTarget.setPointerCapture && e.originalEvent && e.originalEvent.pointerId !== undefined) {
        try {
          e.currentTarget.setPointerCapture(e.originalEvent.pointerId);
        } catch (err) {}
      }
      $body.addClass("user-select-none");
      e.preventDefault();
    });

    $document.on("pointermove", function (e) {
      if (isDragging && e.originalEvent) {
        updateSlider(isDragging, e.originalEvent.clientX);
      }
    });

    $document.on("pointerup pointercancel", function () {
      if (isDragging) {
        isDragging = null;
        $body.removeClass("user-select-none");
      }
    });

    $document.on("click", ".sidebar__filter-slider", function (e) {
      if ($(e.target).hasClass("sidebar__filter-bullet")) return;
      var sliderRect = $slider[0].getBoundingClientRect();
      if (!sliderRect.width) return;
      var percent = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
      var startPercent = parseFloat($startBullet[0].style.left) || 0;
      var endPercent = 100 - (parseFloat($endBullet[0].style.right) || 0);

      var distStart = Math.abs(percent - startPercent);
      var distEnd = Math.abs(percent - endPercent);
      updateSlider(distStart <= distEnd ? "start" : "end", e.clientX);
    });

    $document.on("keydown", ".sidebar__filter-bullet", function (e) {
      var bullet = $(this).hasClass("sidebar__filter-bullet--start") ? "start" : "end";
      var sliderRect = $slider[0].getBoundingClientRect();
      var step = sliderRect.width * 0.05;
      var bulletRect = $(this)[0].getBoundingClientRect();
      var center = bulletRect.left + bulletRect.width / 2;

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        updateSlider(bullet, center - step);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        updateSlider(bullet, center + step);
      }
    });

    $document.on("click", ".sidebar__filter-btn", function (e) {
      e.preventDefault();
      if (typeof applyShopFilters === "function") {
        applyShopFilters(currentMin, currentMax);
      }
    });

    $document.on("click", ".sidebar__filter-clear", function (e) {
      e.preventDefault();
      currentMin = minPrice;
      currentMax = maxPrice;
      $startBullet.css("left", "0%").attr("aria-valuenow", minPrice);
      $endBullet.css("right", "0%").attr("aria-valuenow", maxPrice);
      $track.css({ left: "0%", right: "0%" });
      $priceText.text("Price : " + minPrice + "$ - " + maxPrice + "$");

      $(".sidebar__category-item").removeClass("sidebar__category-item--active");
      $(".sidebar__category-item[data-category='all']").addClass("sidebar__category-item--active");

      if (typeof applyShopFilters === "function") {
        applyShopFilters(minPrice, maxPrice);
      }

      var message = $(this).data("success-message");
      if (message && typeof toastr !== "undefined") {
        toastr.info(message);
      }
    });
  }

  /*--------------------------------------------------------------
  15. Search Toggle & Cart Badge
  --------------------------------------------------------------*/
  function initSearch() {
    if (!$.exists(".site-header__search-btn")) return;

    var $searchBtn = $(".site-header__search-btn");
    var $searchContainer = $(".site-header__search-container");
    if (!$searchBtn.length || !$searchContainer.length) return;

    var $input = $searchContainer.find(".site-header__search-input");

    $searchBtn.attr({
      "aria-expanded": "false",
      "aria-label": "Toggle search"
    });
    $input.attr("aria-label", "Search products");

    function openSearch() {
      $searchContainer.addClass("site-header__search-container--active");
      $searchBtn.attr("aria-expanded", "true");
      setTimeout(function () {
        $input.trigger("focus");
      }, 50);
    }

    function closeSearch(restoreFocus) {
      if (!$searchContainer.hasClass("site-header__search-container--active")) return;
      $searchContainer.removeClass("site-header__search-container--active");
      $searchBtn.attr("aria-expanded", "false");
      $input.trigger("blur");
      if (restoreFocus) {
        $searchBtn.trigger("focus");
      }
    }

    function submitSearch() {
      var query = $input.val().trim();
      if (query) {
        window.location.href = "shop.html?search=" + encodeURIComponent(query);
      } else {
        closeSearch(true);
      }
    }

    $document.on("click", ".site-header__search-btn", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if ($searchContainer.hasClass("site-header__search-container--active")) {
        var query = $input.val().trim();
        if (query) {
          submitSearch();
        } else {
          closeSearch(false);
        }
      } else {
        openSearch();
      }
    });

    $document.on("click", ".site-header__search-container", function (e) {
      e.stopPropagation();
    });

    $document.on("keydown", ".site-header__search-input", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitSearch();
      }
    });

    $document.on("click.searchClose", function () {
      closeSearch(false);
    });

    $document.on("keydown.searchEsc", function (e) {
      if (e.key === "Escape") {
        closeSearch(true);
      }
    });
  }

  function getCartCount() {
    try {
      var stored = localStorage.getItem("patie_cart_count");
      return stored !== null ? parseInt(stored, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  function updateCartCountBadge(newCount, animate) {
    var $badge = $(".site-header__cart-count");
    if (!$badge.length) return;
    $badge.attr("aria-live", "polite");

    if (newCount > 0) {
      $badge.text(newCount).addClass("site-header__cart-count--active");
      $badge.attr("aria-label", newCount + " items in cart");
      if (animate) {
        $badge.addClass("site-header__cart-count--bump");
        setTimeout(function () {
          $badge.removeClass("site-header__cart-count--bump");
        }, 300);
      }
    } else {
      $badge.removeClass("site-header__cart-count--active site-header__cart-count--bump");
      $badge.attr("aria-label", "Cart is empty");
      setTimeout(function () {
        if (!$badge.hasClass("site-header__cart-count--active")) {
          $badge.text("0");
        }
      }, 300);
    }
  }

  function addCartCount(qty) {
    var current = getCartCount();
    var updated = current + (parseInt(qty, 10) || 1);
    try {
      localStorage.setItem("patie_cart_count", updated);
    } catch (e) {}
    updateCartCountBadge(updated, true);
    return updated;
  }

  function resetCartCount() {
    try {
      localStorage.setItem("patie_cart_count", "0");
    } catch (e) {}
    updateCartCountBadge(0, false);
  }

  function initCartBadge() {
    updateCartCountBadge(getCartCount(), false);

    window.addEventListener("storage", function (e) {
      if (e.key === "patie_cart_count") {
        updateCartCountBadge(getCartCount(), false);
      }
    });

    $document.on("click", ".cart__summary-checkout-btn", function (e) {
      var $btn = $(this);
      var targetUrl = $btn.attr("href") || "checkout.html";
      resetCartCount();
      if ($btn.is("a")) {
        e.preventDefault();
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 350);
      }
    });

    $document.on("click", ".checkout-section__submit-btn", function () {
      resetCartCount();
    });
  }

  /*--------------------------------------------------------------
  16. Shop Filter & Sorting
  --------------------------------------------------------------*/
  function handleShopSearchFilter() {
    if (!$.exists(".product-card")) return;
    var urlParams = new URLSearchParams(window.location.search);
    var searchQuery = urlParams.get("search");
    if (!searchQuery) return;

    if (typeof applyShopFilters === "function") {
      applyShopFilters();
    }
  }

  function applyShopFilters(minPrice, maxPrice) {
    if (!$.exists(".product-card")) return;

    var $cards = $(".product-card");
    var activeCategory = $(".sidebar__category-item--active").data("category") || "all";

    var urlParams = new URLSearchParams(window.location.search);
    var searchQuery = (urlParams.get("search") || "").trim().toLowerCase();

    if (minPrice === undefined || maxPrice === undefined) {
      var priceText = $(".sidebar__filter-price").text();
      var matches = priceText.match(/(\d+)\s*\$\s*-\s*(\d+)\s*\$/);
      if (matches) {
        minPrice = parseFloat(matches[1]);
        maxPrice = parseFloat(matches[2]);
      } else {
        minPrice = 0;
        maxPrice = 999999;
      }
    }

    var matchCount = 0;
    $cards.each(function () {
      var $card = $(this);
      var cardCat = $card.data("category") || "food";
      var cardTitle = $card.find(".product-card__title").text().toLowerCase();
      var cardPrice =
        parseFloat($card.data("price")) ||
        parseFloat(
          $card
            .find(".product-card__price")
            .text()
            .replace(/[^0-9.]/g, ""),
        ) ||
        0;

      var matchesCategory = activeCategory === "all" || cardCat === activeCategory;
      var matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice;
      var matchesSearch = !searchQuery || cardTitle.indexOf(searchQuery) !== -1;

      if (matchesCategory && matchesPrice && matchesSearch) {
        $card.show();
        matchCount++;
      } else {
        $card.hide();
      }
    });

    var $container = $(".product__grid, .shop__grid");
    var $emptyMsg = $container.find(".shop__no-results-msg");
    if (matchCount === 0) {
      if (!$emptyMsg.length) {
        $container.append(
          '<div class="shop__no-results-msg col-12 text-center py-5">' +
          '<i class="fas fa-search fa-3x text-muted mb-3"></i>' +
          '<h4>No products found</h4>' +
          '<p class="text-muted">Try adjusting your category, price range, or search criteria.</p>' +
          '</div>'
        );
      } else {
        $emptyMsg.show();
      }
    } else if ($emptyMsg.length) {
      $emptyMsg.hide();
    }

    var $resultLabel = $(".shop__result-count");
    if ($resultLabel.length) {
      if (searchQuery) {
        $resultLabel.text("|| Showing " + matchCount + ' result(s) for "' + searchQuery + '"');
      } else {
        $resultLabel.text("|| Showing " + matchCount + " result(s)");
      }
    }

    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }
  window.applyShopFilters = applyShopFilters;

  function handleCategoryFilter() {
    if (!$.exists(".sidebar__category-item")) return;

    $(".sidebar__category-list").attr("role", "radiogroup");
    $(".sidebar__category-item").attr({ role: "radio", tabindex: "0" }).each(function () {
      var isActive = $(this).hasClass("sidebar__category-item--active");
      $(this).attr("aria-checked", isActive ? "true" : "false");
    });

    function selectCategory($item) {
      var $list = $item.closest(".sidebar__category-list");
      $list.find(".sidebar__category-item").removeClass("sidebar__category-item--active").attr("aria-checked", "false");
      $item.addClass("sidebar__category-item--active").attr("aria-checked", "true");

      if (typeof applyShopFilters === "function") {
        applyShopFilters();
      }
    }

    $document.on("click", ".sidebar__category-item", function (e) {
      e.preventDefault();
      selectCategory($(this));
    });

    $document.on("keydown", ".sidebar__category-item", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCategory($(this));
      }
    });
  }

  function handleShopSort() {
    var $sortSelect = $(".shop__sort-select, .shop__select, #shop-sort");
    if (!$sortSelect.length) return;

    $document.on("change", ".shop__sort-select, .shop__select, #shop-sort", function () {
      var sortVal = $(this).val();
      var $container = $(".product__grid, .shop__grid");
      if (!$container.length) return;
      var $cards = $container.children(".product-card").get();

      $cards.sort(function (a, b) {
        var $a = $(a);
        var $b = $(b);

        var priceA =
          parseFloat($a.data("price")) ||
          parseFloat($a.find(".product-card__price").text().replace(/[^0-9.]/g, "")) || 0;
        var priceB =
          parseFloat($b.data("price")) ||
          parseFloat($b.find(".product-card__price").text().replace(/[^0-9.]/g, "")) || 0;

        var ratingA =
          parseFloat($a.data("rating")) ||
          parseFloat($a.find(".product-card__rating-text").text().replace(/[^0-9.]/g, "")) || 0;
        var ratingB =
          parseFloat($b.data("rating")) ||
          parseFloat($b.find(".product-card__rating-text").text().replace(/[^0-9.]/g, "")) || 0;

        var idA = parseInt($a.data("id"), 10) || 0;
        var idB = parseInt($b.data("id"), 10) || 0;

        if (sortVal === "price-low" || sortVal === "low-to-high") {
          return priceA - priceB;
        } else if (sortVal === "price-high" || sortVal === "high-to-low") {
          return priceB - priceA;
        } else if (sortVal === "top-rating") {
          return ratingB - ratingA;
        } else if (sortVal === "latest") {
          return idB - idA;
        }
        return 0;
      });

      $.each($cards, function (idx, item) {
        $container.append(item);
      });

      var $emptyMsg = $container.find(".shop__no-results-msg");
      if ($emptyMsg.length) {
        $container.append($emptyMsg);
      }

      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    });
  }

  /*--------------------------------------------------------------
  17. Mobile Menu Sidebar
  --------------------------------------------------------------*/
  function initMobileMenu() {
    if (!$.exists(".site-header")) return;
    if ($(".mobile-sidebar").length > 0) return;

    var logoSrc = $(".site-header__logo-img").attr("src") || "";
    var logoAlt = $(".site-header__logo-img").attr("alt") || "Patie Logo";

    var sidebarHtml =
      '<div class="mobile-sidebar" role="dialog" aria-modal="true" aria-label="Mobile Navigation">' +
      '<div class="mobile-sidebar__header">' +
      '<div class="mobile-sidebar__logo">' +
      '<a href="index.html" class="mobile-sidebar__logo-link">' +
      '<img src="' + logoSrc + '" alt="' + logoAlt + '" class="mobile-sidebar__logo-img">' +
      '</a>' +
      '</div>' +
      '<button class="mobile-sidebar__close-btn" aria-label="Close menu">' +
      '<i class="fas fa-times"></i>' +
      '</button>' +
      '</div>' +
      '<div class="mobile-sidebar__content">' +
      '<div class="mobile-sidebar__nav-wrapper"></div>' +
      '</div>' +
      '</div>' +
      '<div class="mobile-sidebar-overlay" aria-hidden="true"></div>';

    $body.append(sidebarHtml);

    var $mobileBtn = $(".site-header__mobile-btn");
    $mobileBtn.attr({
      "aria-expanded": "false",
      "aria-haspopup": "dialog",
      "aria-label": "Open navigation menu"
    });

    var $clonedMenu = $(".site-header__menu").clone();
    $clonedMenu.removeClass("site-header__menu").addClass("mobile-menu");
    $clonedMenu.find(".ak-menu_dropdown_toggle, .ak-menu_dropdown_toggle_1, .ak-menu_toggle").remove();

    $clonedMenu.find("> li").each(function () {
      var $item = $(this);
      $item.removeClass().addClass("mobile-menu__item");

      var $link = $item.find("> a");
      $link.removeClass().addClass("mobile-menu__link");
      $item.find("> img, > span").not("a *").remove();

      var $submenu = $item.find("> ul");
      if ($submenu.length > 0) {
        $item.addClass("mobile-menu__item--has-children");
        $submenu.removeClass().addClass("mobile-menu__submenu");
        $submenu.find("li").removeClass().addClass("mobile-menu__submenu-item");
        $submenu.find("a").removeClass().addClass("mobile-menu__submenu-link");
        $item.append(
          '<button class="mobile-menu__toggle-btn" aria-label="Toggle submenu" aria-expanded="false">' +
            '<i class="fas fa-chevron-down"></i>' +
          '</button>',
        );
      }
    });

    $(".mobile-sidebar__nav-wrapper").append($clonedMenu);

    $(".site-header__menu-item").each(function (index) {
      if ($(this).hasClass("site-header__menu-item--active")) {
        var $mobileItem = $(".mobile-menu__item").eq(index);
        $mobileItem.addClass("mobile-menu__item--active");
        $mobileItem.find("> .mobile-menu__link").addClass("mobile-menu__link--active");
      }
    });

    var $activeSubmenuLink = $(".site-header__submenu-link--active");
    if ($activeSubmenuLink.length) {
      var activeHref = $activeSubmenuLink.attr("href") || "";
      $(".mobile-menu__submenu-link").each(function () {
        var href = $(this).attr("href") || "";
        if (href === activeHref) {
          $(this).addClass("mobile-menu__submenu-link--active");
          var $parentItem = $(this).closest(".mobile-menu__item");
          $parentItem.find("> .mobile-menu__submenu").show();
          $parentItem.addClass("mobile-menu__item--open");
          $parentItem
            .find("> .mobile-menu__toggle-btn")
            .attr("aria-expanded", "true")
            .find("i")
            .removeClass("fa-chevron-down")
            .addClass("fa-chevron-up");
        }
      });
    }

    function openMobileMenu() {
      $(".mobile-sidebar").addClass("mobile-sidebar--open");
      $(".mobile-sidebar-overlay").addClass("mobile-sidebar-overlay--open");
      $mobileBtn.attr("aria-expanded", "true");
      $body.css("overflow", "hidden");
      setTimeout(function () {
        $(".mobile-sidebar__close-btn").trigger("focus");
      }, 50);
    }

    function closeMobileMenu(restoreFocus) {
      if (!$(".mobile-sidebar").hasClass("mobile-sidebar--open")) return;
      $(".mobile-sidebar").removeClass("mobile-sidebar--open");
      $(".mobile-sidebar-overlay").removeClass("mobile-sidebar-overlay--open");
      $mobileBtn.attr("aria-expanded", "false");
      $body.css("overflow", "");
      if (restoreFocus) {
        $mobileBtn.trigger("focus");
      }
    }

    $document.on("click", ".site-header__mobile-btn", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    });

    $document.on("click", ".mobile-sidebar__close-btn, .mobile-sidebar-overlay", function (e) {
      e.preventDefault();
      closeMobileMenu(true);
    });

    $document.on("keydown.mobileSidebar", function (e) {
      if (e.key === "Escape" && $(".mobile-sidebar").hasClass("mobile-sidebar--open")) {
        closeMobileMenu(true);
      }
    });

    $window.on("resize.mobileMenu", function () {
      if ($window.width() > 991 && $(".mobile-sidebar").hasClass("mobile-sidebar--open")) {
        closeMobileMenu(false);
      }
    });

    function toggleSubmenu($btn) {
      var $submenu = $btn.siblings(".mobile-menu__submenu");
      var $parent = $btn.parent();
      var isExpanded = $btn.attr("aria-expanded") === "true";

      $submenu.stop(true, true).slideToggle(300);
      $parent.toggleClass("mobile-menu__item--open");
      $btn.attr("aria-expanded", String(!isExpanded));
      $btn.find("i").toggleClass("fa-chevron-down fa-chevron-up");

      $parent.siblings(".mobile-menu__item--open").each(function () {
        var $sibling = $(this);
        $sibling.removeClass("mobile-menu__item--open");
        $sibling.find(".mobile-menu__submenu").stop(true, true).slideUp(300);
        $sibling
          .find(".mobile-menu__toggle-btn")
          .attr("aria-expanded", "false")
          .find("i")
          .removeClass("fa-chevron-up")
          .addClass("fa-chevron-down");
      });
    }

    $document.on("click", ".mobile-menu__toggle-btn", function (e) {
      e.preventDefault();
      toggleSubmenu($(this));
    });

    $document.on("click", ".mobile-menu__item--has-children > a", function (e) {
      var href = $(this).attr("href");
      if (!href || href === "#" || href === "javascript:void(0)") {
        e.preventDefault();
        toggleSubmenu($(this).siblings(".mobile-menu__toggle-btn"));
      }
    });
  }

  /*--------------------------------------------------------------
  18. Dashboard Sidebar
  --------------------------------------------------------------*/
  function initDashboardSidebar() {
    if (!$.exists("#sidebarToggle")) return;

    var $toggle = $("#sidebarToggle");
    var $sidebar = $("#dashboardSidebar");
    var $overlay = $("#sidebarOverlay");
    var $close = $("#sidebarClose");

    if (!$toggle.length || !$sidebar.length) return;

    function resizeCharts() {
      if (typeof Chart !== "undefined") {
        setTimeout(function () {
          if (salesChartInstance) {
            salesChartInstance.resize();
          }
          if (servicesChartInstance) {
            servicesChartInstance.resize();
          }
        }, 320);
      }
    }

    function openSidebar() {
      $sidebar.addClass("is-open").attr("aria-hidden", "false");
      $overlay.addClass("is-visible").attr("aria-hidden", "false");
      $toggle.attr("aria-expanded", "true");
      $body.css("overflow", "hidden");
      setTimeout(function () {
        if ($close.length) {
          $close.trigger("focus");
        }
      }, 50);
      resizeCharts();
    }

    function closeSidebar(restoreFocus) {
      if (!$sidebar.hasClass("is-open")) return;
      $sidebar.removeClass("is-open").attr("aria-hidden", "true");
      $overlay.removeClass("is-visible").attr("aria-hidden", "true");
      $toggle.attr("aria-expanded", "false");
      $body.css("overflow", "");
      if (restoreFocus) {
        $toggle.trigger("focus");
      }
      resizeCharts();
    }

    $document.on("click", "#sidebarToggle", function (e) {
      e.stopPropagation();
      if ($sidebar.hasClass("is-open")) {
        closeSidebar(true);
      } else {
        openSidebar();
      }
    });

    $document.on("click", "#sidebarOverlay", function () {
      closeSidebar(true);
    });

    $document.on("click", "#sidebarClose", function () {
      closeSidebar(true);
    });

    $document.on("keydown.dashboardSidebar", function (e) {
      if (e.key === "Escape" && $sidebar.hasClass("is-open")) {
        closeSidebar(true);
      }
    });

    $window.on("resize.dashboardSidebar", function () {
      if ($sidebar.hasClass("is-open") && window.innerWidth > 992) {
        closeSidebar(false);
      }
    });
  }

  /*--------------------------------------------------------------
  19. Working Process Accordion
  --------------------------------------------------------------*/
  function workingProcessAccordion() {
    if (!$.exists(".working-process__item")) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    $(".working-process__item").each(function () {
      var $item = $(this);
      var $toggle = $item.find(".working-process__toggle");
      var $content = $item.find(".working-process__content");
      var isActive = $item.hasClass("active");

      $toggle.attr({
        role: "button",
        tabindex: "0",
        "aria-expanded": isActive ? "true" : "false"
      });

      $content.attr("role", "region");

      if (isActive) {
        $content.css("height", "auto");
      } else {
        $content.css("height", "0px");
      }
    });

    function openItem(item) {
      var content = item.querySelector(".working-process__content");
      var toggle = item.querySelector(".working-process__toggle");
      if (!content) return;

      item.classList.add("active");
      if (toggle) toggle.setAttribute("aria-expanded", "true");

      if (prefersReducedMotion) {
        content.style.height = "auto";
        return;
      }

      content.style.height = "0px";
      content.offsetHeight;
      content.style.height = content.scrollHeight + "px";

      content.addEventListener(
        "transitionend",
        function handleTransitionEnd(e) {
          if (e.target !== content) return;
          if (item.classList.contains("active")) {
            content.style.height = "auto";
          }
        },
        { once: true },
      );
    }

    function closeItem(item) {
      var content = item.querySelector(".working-process__content");
      var toggle = item.querySelector(".working-process__toggle");
      if (!content) return;

      item.classList.remove("active");
      if (toggle) toggle.setAttribute("aria-expanded", "false");

      if (prefersReducedMotion) {
        content.style.height = "0px";
        return;
      }

      content.style.height = content.scrollHeight + "px";
      content.offsetHeight;
      content.style.height = "0px";
    }

    function handleToggle(toggleEl) {
      var item = toggleEl.closest(".working-process__item");
      if (!item) return;

      var parentContainer = item.parentElement;
      var siblingItems = parentContainer ? parentContainer.querySelectorAll(".working-process__item") : [];

      var isActive = item.classList.contains("active");

      siblingItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          closeItem(otherItem);
        }
      });

      if (isActive) {
        closeItem(item);
      } else {
        openItem(item);
      }
    }

    $document.on("click", ".working-process__toggle", function () {
      handleToggle(this);
    });

    $document.on("keydown", ".working-process__toggle", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle(this);
      }
    });
  }

  /*--------------------------------------------------------------
  20. Shop Details Functionality
  --------------------------------------------------------------*/
  function shopDetails() {
    if (
      !$.exists(
        ".shop-details__color-picker-btn, .shop-details__thumb-item, .shop-details__quantity, .cart__quantity, .cart__remove, .shop-details__add-to-cart, .shop-details__wishlist",
      )
    ) return;

    $(".shop-details__color-picker-btn").attr({ role: "button", tabindex: "0" }).each(function () {
      var color = $(this).data("color") || "color";
      $(this).attr("aria-label", "Select " + color);
      var isActive = $(this).hasClass("shop-details__color-picker-btn--active");
      $(this).attr("aria-pressed", isActive ? "true" : "false");
    });

    $(".shop-details__thumb-item").attr({ role: "button", tabindex: "0" }).each(function (idx) {
      $(this).attr("aria-label", "Product thumbnail " + (idx + 1));
    });

    $(".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type, .cart__quantity-btn--inc").attr("aria-label", "Increase quantity");
    $(".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type, .cart__quantity-btn--dec").attr("aria-label", "Decrease quantity");
    $(".shop-details__quantity input, .cart__quantity input").attr({ "aria-label": "Quantity", min: "1" });

    var $wishlistBtn = $(".shop-details__wishlist");
    if ($wishlistBtn.length) {
      var isWishActive = $wishlistBtn.hasClass("shop-details__wishlist--active");
      $wishlistBtn.attr({
        role: "button",
        "aria-pressed": isWishActive ? "true" : "false",
        "aria-label": isWishActive ? "Remove from wishlist" : "Add to wishlist"
      });
    }

    function setShopDetailsProductImage(imgSrc, color) {
      if (!imgSrc) return;
      $(".shop-details__main-img").attr("src", imgSrc);
      $(".shop-details__zoom-preview-img").attr("src", imgSrc);
      $(".shop-details__main-img-wrap").attr("data-lightbox-src", imgSrc);

      var $thumbs = $(".shop-details__thumb-item");
      $thumbs.removeClass("shop-details__thumb-item--active");

      if (color) {
        $thumbs.filter("[data-color='" + color + "']").addClass("shop-details__thumb-item--active");
      } else {
        $thumbs
          .filter(function () {
            return $(this).find("img").attr("src") === imgSrc;
          })
          .addClass("shop-details__thumb-item--active");
      }
    }

    function selectColor($btn) {
      var color = $btn.data("color");
      var newImg = $btn.data("image");

      $(".shop-details__color-picker-btn")
        .removeClass("shop-details__color-picker-btn--active")
        .attr("aria-pressed", "false");
      $btn
        .addClass("shop-details__color-picker-btn--active")
        .attr("aria-pressed", "true");

      if (!newImg && color) {
        var $matchingThumb = $(".shop-details__thumb-item[data-color='" + color + "']");
        if ($matchingThumb.length) {
          newImg = $matchingThumb.find("img").attr("src");
        }
      }

      setShopDetailsProductImage(newImg, color);
    }

    $document.on("click", ".shop-details__color-picker-btn", function () {
      selectColor($(this));
    });

    $document.on("keydown", ".shop-details__color-picker-btn", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectColor($(this));
      }
    });

    function selectThumb($thumb) {
      var newSrc = $thumb.find("img").attr("src");
      var color = $thumb.data("color");

      setShopDetailsProductImage(newSrc, color);

      var $pickerBtns = $(".shop-details__color-picker-btn");
      $pickerBtns.removeClass("shop-details__color-picker-btn--active").attr("aria-pressed", "false");
      if (color) {
        $pickerBtns.filter("[data-color='" + color + "']").addClass("shop-details__color-picker-btn--active").attr("aria-pressed", "true");
      } else if (newSrc) {
        $pickerBtns.filter("[data-image='" + newSrc + "']").addClass("shop-details__color-picker-btn--active").attr("aria-pressed", "true");
      }
    }

    $document.on("click", ".shop-details__thumb-item", function () {
      selectThumb($(this));
    });

    $document.on("keydown", ".shop-details__thumb-item", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectThumb($(this));
      }
    });

    $document.on("mouseenter", ".shop-details__main-img-wrap", function () {
      if (window.innerWidth <= 991) return;
      var imgSrc = $(this).find(".shop-details__main-img").attr("src");
      if (imgSrc) {
        $(".shop-details__zoom-preview-img").attr("src", imgSrc);
      }
      $(".shop-details__zoom-lens").addClass("shop-details__zoom-lens--active");
      $(".shop-details__zoom-preview").addClass("shop-details__zoom-preview--active");
    });

    $document.on("mouseleave", ".shop-details__main-img-wrap", function () {
      $(".shop-details__zoom-lens").removeClass("shop-details__zoom-lens--active");
      $(".shop-details__zoom-preview").removeClass("shop-details__zoom-preview--active");
    });

    $document.on("mousemove", ".shop-details__main-img-wrap", function (e) {
      if (window.innerWidth <= 991) return;
      var wrap = this;
      var $wrap = $(wrap);
      var $lens = $wrap.find(".shop-details__zoom-lens");
      var $preview = $(".shop-details__zoom-preview");
      var $previewImg = $preview.find(".shop-details__zoom-preview-img");

      var wrapRect = wrap.getBoundingClientRect();
      if (!wrapRect.width || !wrapRect.height) return;

      var lensWidth = $lens.outerWidth() || 300;
      var lensHeight = $lens.outerHeight() || 300;

      var mouseX = e.clientX - wrapRect.left;
      var mouseY = e.clientY - wrapRect.top;

      var lensLeft = mouseX - lensWidth / 2;
      var lensTop = mouseY - lensHeight / 2;

      var maxLeft = wrapRect.width - lensWidth;
      var maxTop = wrapRect.height - lensHeight;

      lensLeft = Math.max(0, Math.min(lensLeft, maxLeft));
      lensTop = Math.max(0, Math.min(lensTop, maxTop));

      $lens.css({
        left: lensLeft + "px",
        top: lensTop + "px",
      });

      var previewWidth = $preview.width() || 500;
      var previewHeight = $preview.height() || 500;

      var scaleX = previewWidth / lensWidth;
      var scaleY = previewHeight / lensHeight;

      var bgWidth = wrapRect.width * scaleX;
      var bgHeight = wrapRect.height * scaleY;

      var previewImgLeft = -(lensLeft * scaleX);
      var previewImgTop = -(lensTop * scaleY);

      $previewImg.css({
        width: bgWidth + "px",
        height: bgHeight + "px",
        left: previewImgLeft + "px",
        top: previewImgTop + "px",
      });
    });

    $document.on("click", ".shop-details__main-img-wrap", function (e) {
      e.preventDefault();
      var $wrap = $(this);
      var currentSrc = $wrap.attr("data-lightbox-src") || $wrap.find(".shop-details__main-img").attr("src");

      var dynamicEl = [];
      var activeIndex = 0;

      $(".shop-details__thumb-list .shop-details__thumb-item").each(function (i) {
        var $thumb = $(this);
        var src = $thumb.find("img").attr("src");
        if (src) {
          dynamicEl.push({
            src: src,
            thumb: src,
          });
          if ($thumb.hasClass("shop-details__thumb-item--active") || src === currentSrc) {
            activeIndex = i;
          }
        }
      });

      if (!dynamicEl.length && currentSrc) {
        dynamicEl.push({
          src: currentSrc,
          thumb: currentSrc,
        });
      }

      if ($.fn.lightGallery && dynamicEl.length) {
        $wrap.lightGallery({
          dynamic: true,
          dynamicEl: dynamicEl,
          index: activeIndex,
          download: false,
          actualSize: false,
          hash: false,
          closable: true,
          escKey: true,
          keyPress: true,
          controls: true,
          zoom: true,
          scale: 1,
        });
      }
    });

    function calculateCartSubtotal() {
      var subtotal = 0;
      $(".cart__table tbody tr").each(function () {
        var $tr = $(this);
        var price = parseFloat($tr.find(".cart__price").text().replace(/[^0-9.]/g, "")) || 0;
        var qty = parseInt($tr.find(".cart__quantity input").val(), 10) || 1;
        subtotal += price * qty;
      });
      return subtotal;
    }

    function getSelectedShippingCost() {
      var $checked = $('input[name="shipping"]:checked');
      if (!$checked.length) return 0;
      var cost = parseFloat($checked.data("price"));
      if (isNaN(cost)) {
        cost = parseFloat($checked.closest(".cart__summary-shipping-option").find(".cart__summary-shipping-option-price").text().replace(/[^0-9.]/g, "")) || 0;
      }
      return cost;
    }

    function updateCartSummaryDisplay() {
      var subtotal = calculateCartSubtotal();
      var shippingCost = getSelectedShippingCost();
      var total = subtotal > 0 ? subtotal + shippingCost : 0;

      $(".cart__summary-row:not(.cart__summary-row--total) .cart__summary-value").text("$" + subtotal.toFixed(2));
      $(".cart__summary-row--total .cart__summary-value").text("$" + total.toFixed(2));
    }

    function updateRowTotal($input) {
      var $tr = $input.closest("tr");
      var price = parseFloat($tr.find(".cart__price").text().replace(/[^0-9.]/g, "")) || 0;
      var qty = parseInt($input.val(), 10) || 1;
      $tr.find(".cart__total").text("$" + (price * qty).toFixed(2));
    }

    function getCartStateSignature() {
      var items = [];
      $(".cart__table tbody tr").each(function () {
        var $tr = $(this);
        var title = $tr.find(".cart__product-title").text().trim();
        var qty = parseInt($tr.find(".cart__quantity input").val(), 10) || 1;
        items.push(title + ":" + qty);
      });
      return items.join("|");
    }

    var initialCartState = getCartStateSignature();

    function checkCartModificationState() {
      var currentState = getCartStateSignature();
      var isModified = currentState !== initialCartState;
      var $updateBtn = $(".cart__update-btn");
      if ($updateBtn.length) {
        $updateBtn.prop("disabled", !isModified).toggleClass("cart__update-btn--active", isModified);
      }
    }

    function syncCartItemCount() {
      var totalQty = 0;
      $(".cart__table tbody tr").each(function () {
        var q = parseInt($(this).find(".cart__quantity input").val(), 10) || 1;
        totalQty += q;
      });
      try {
        localStorage.setItem("patie_cart_count", totalQty);
      } catch (e) {}
      if (typeof updateCartCountBadge === "function") {
        updateCartCountBadge(totalQty, true);
      }
    }

    $document.on("click", ".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type, .cart__quantity-btn--inc", function (e) {
      e.preventDefault();
      var $container = $(this).closest(".shop-details__quantity, .cart__quantity");
      var $input = $container.find("input");
      var val = parseInt($input.val(), 10) || 1;
      $input.val(val + 1);

      if ($container.hasClass("cart__quantity")) {
        updateRowTotal($input);
        checkCartModificationState();
        syncCartItemCount();
      }
    });

    $document.on("click", ".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type, .cart__quantity-btn--dec", function (e) {
      e.preventDefault();
      var $container = $(this).closest(".shop-details__quantity, .cart__quantity");
      var $input = $container.find("input");
      var val = parseInt($input.val(), 10) || 1;
      if (val > 1) {
        $input.val(val - 1);
        if ($container.hasClass("cart__quantity")) {
          updateRowTotal($input);
          checkCartModificationState();
          syncCartItemCount();
        }
      }
    });

    $document.on("change input", ".cart__quantity input", function () {
      var val = parseInt($(this).val(), 10);
      if (isNaN(val) || val < 1) {
        $(this).val(1);
      }
      updateRowTotal($(this));
      checkCartModificationState();
      syncCartItemCount();
    });

    $document.on("click", ".cart__remove", function (e) {
      e.preventDefault();
      var $row = $(this).closest("tr");
      var $tbody = $row.closest("tbody");
      $row.remove();
      checkCartModificationState();
      updateCartSummaryDisplay();
      syncCartItemCount();

      if ($tbody.find("tr").length === 0) {
        $tbody.append('<tr><td colspan="6" class="text-center py-5">Your cart is currently empty.</td></tr>');
        $(".cart__summary-checkout-btn").addClass("disabled").css("pointer-events", "none");
      }
    });

    $document.on("click", ".cart__update-btn", function (e) {
      e.preventDefault();
      var $btn = $(this);
      if ($btn.prop("disabled") && !$btn.hasClass("cart__update-btn--active")) return;

      updateCartSummaryDisplay();
      initialCartState = getCartStateSignature();
      checkCartModificationState();
      syncCartItemCount();

      var successMsg = $btn.data("success-message");
      if (typeof toastr !== "undefined" && successMsg) {
        toastr.success(successMsg);
      }
    });

    $document.on("change", 'input[name="shipping"]', function () {
      updateCartSummaryDisplay();
    });

    $document.on("click", ".shop-details__add-to-cart", function (e) {
      e.preventDefault();
      var $btn = $(this);
      var successMsg = $btn.data("success-message");
      var qty = parseInt($("#product-quantity").val(), 10) || 1;
      addCartCount(qty);
      if (typeof toastr !== "undefined" && successMsg) {
        var finalMsg = successMsg.replace(/{qty}/g, qty);
        toastr.success(finalMsg);
      }
    });

    $document.on("click", ".shop-details__wishlist", function (e) {
      e.preventDefault();
      var $btn = $(this);
      var $icon = $btn.find(".shop-details__wishlist-icon");
      var $text = $btn.find(".shop-details__wishlist-text");
      var successMsg = $btn.data("success-message");
      var removeMsg = $btn.data("remove-message");

      var isAdded = $btn.hasClass("shop-details__wishlist--active");
      var activeText = $btn.data("active-text") || "Added to Wishlist";
      var inactiveText = $btn.data("inactive-text") || "Add to Wishlist";

      if (!isAdded) {
        $btn.addClass("shop-details__wishlist--active").attr("aria-pressed", "true").attr("aria-label", "Remove from wishlist");
        $icon.removeClass("far fa-heart").addClass("fas fa-heart");
        if ($text.length) {
          $text.text(activeText);
        } else {
          $btn.html('<i class="fas fa-heart shop-details__wishlist-icon"></i> ' + activeText);
        }
        if (typeof toastr !== "undefined" && successMsg) {
          toastr.success(successMsg);
        }
      } else {
        $btn.removeClass("shop-details__wishlist--active").attr("aria-pressed", "false").attr("aria-label", "Add to wishlist");
        $icon.removeClass("fas fa-heart").addClass("far fa-heart");
        if ($text.length) {
          $text.text(inactiveText);
        } else {
          $btn.html('<i class="far fa-heart shop-details__wishlist-icon"></i> ' + inactiveText);
        }
        if (typeof toastr !== "undefined" && removeMsg) {
          toastr.info(removeMsg);
        }
      }
    });
  }

  /*--------------------------------------------------------------
  21. Service Button Dash Animation
  --------------------------------------------------------------*/
  function serviceBtnDashAnimation() {
    if (!$.exists(".service-btn")) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    var FAST_SPEED = 20;
    var state = new WeakMap();

    function getState(circle) {
      if (!state.has(circle)) {
        state.set(circle, {
          rafId: null,
          isHovered: false,
          lastTime: null,
          currentSpeed: 0,
        });
      }
      return state.get(circle);
    }

    function decelLoop(circle, timestamp) {
      var s = getState(circle);
      if (s.isHovered) return;

      if (!s.lastTime) s.lastTime = timestamp;
      var elapsed = timestamp - s.lastTime;
      s.lastTime = timestamp;

      s.currentSpeed *= Math.pow(0.7, elapsed / 100);

      if (s.currentSpeed < 0.3) {
        circle.style.animation = "marchServiceDashes 8s linear infinite";
        circle.style.strokeDashoffset = "";
        s.rafId = null;
        return;
      }

      var current = parseFloat(circle.style.strokeDashoffset) || 0;
      circle.style.strokeDashoffset = (current - (s.currentSpeed * elapsed) / 1000) + "px";
      s.rafId = requestAnimationFrame(function (ts) {
        decelLoop(circle, ts);
      });
    }

    function startAnimation(el) {
      var circle = el.querySelector(".service-btn__dashed-circle circle");
      if (!circle) return;

      var s = getState(circle);
      s.isHovered = true;

      if (s.rafId) {
        cancelAnimationFrame(s.rafId);
        s.rafId = null;
      }

      circle.style.animation = "marchServiceDashes 0.6s linear infinite";
      circle.style.strokeDashoffset = "";
      s.currentSpeed = FAST_SPEED;
    }

    function stopAnimation(el) {
      var circle = el.querySelector(".service-btn__dashed-circle circle");
      if (!circle) return;

      var s = getState(circle);
      s.isHovered = false;

      var offset = parseFloat(circle.style.strokeDashoffset) || 0;
      circle.style.animation = "none";
      circle.style.strokeDashoffset = offset + "px";

      s.currentSpeed = FAST_SPEED;
      s.lastTime = null;
      s.rafId = requestAnimationFrame(function (ts) {
        decelLoop(circle, ts);
      });
    }

    $document.on("mouseenter focusin", ".service-btn", function () {
      startAnimation(this);
    });

    $document.on("mouseleave focusout", ".service-btn", function () {
      stopAnimation(this);
    });
  }

  /*--------------------------------------------------------------
  22. Button Blur Animation
  --------------------------------------------------------------*/
  function buttonBlurAnimation() {
    if (!$.exists("[data-tp-btn]")) return;

    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    var btnStates = new WeakMap();

    $("[data-tp-btn]").each(function (index) {
      var btn = this;
      var filter = btn.querySelector("filter");
      var filterTarget = btn.querySelector(".tp-btn__filter");
      if (!filter || !filterTarget) return;

      var blur = filter.querySelector("feGaussianBlur");
      if (!blur) return;

      var filterId = "buttonFilter-" + index;
      filter.setAttribute("id", filterId);
      filterTarget.style.filter = "url(#" + filterId + ")";

      btnStates.set(btn, {
        blur: blur,
        value: 0,
        target: 0,
        rafId: null
      });
    });

    function stepBlur(btn, state) {
      state.value += (state.target - state.value) * 0.15;
      state.blur.setAttribute("stdDeviation", state.value.toFixed(2));

      if (Math.abs(state.target - state.value) < 0.01) {
        state.value = state.target;
        state.blur.setAttribute("stdDeviation", state.value.toFixed(2));
        state.rafId = null;
        return;
      }

      state.rafId = requestAnimationFrame(function () {
        stepBlur(btn, state);
      });
    }

    function setBtnBlur(btn, targetVal) {
      var state = btnStates.get(btn);
      if (!state) return;

      state.target = targetVal;
      if (!state.rafId) {
        state.rafId = requestAnimationFrame(function () {
          stepBlur(btn, state);
        });
      }
    }

    $document.on("mouseenter focusin", "[data-tp-btn]", function () {
      setBtnBlur(this, 5);
    });

    $document.on("mouseleave focusout", "[data-tp-btn]", function () {
      setBtnBlur(this, 0);
    });
  }

  /*--------------------------------------------------------------
  23. Password Toggle (Sign In / Sign Up)
  --------------------------------------------------------------*/
  function passwordToggle() {
    if (!$.exists(".sign-in__eye-toggle, .sign-up__eye-toggle, .password-toggle-btn")) return;

    $(".sign-in__eye-toggle, .sign-up__eye-toggle, .password-toggle-btn").each(function () {
      var $btn = $(this);
      var targetId = $btn.data("target");
      if (targetId) {
        $btn.attr("aria-controls", targetId);
      }
      $btn.attr({
        role: "button",
        "aria-pressed": "false"
      });
    });

    $document.on("click", ".sign-in__eye-toggle, .sign-up__eye-toggle, .password-toggle-btn", function (e) {
      e.preventDefault();
      var $btn = $(this);
      var targetId = $btn.data("target");
      var $input = targetId ? $("#" + targetId) : $();

      if (!$input.length) {
        $input = $btn.siblings("input");
      }
      if (!$input.length) {
        $input = $btn.closest("div").find("input");
      }
      if (!$input.length) return;

      var $icon = $btn.find("i");
      var isPassword = $input.attr("type") === "password";

      if (isPassword) {
        $input.attr("type", "text");
        $btn.attr({
          "aria-label": "Hide password",
          "aria-pressed": "true"
        });

        if ($icon.hasClass("fa-lock")) {
          $icon.removeClass("fa-lock").addClass("fa-lock-open");
        } else if ($icon.hasClass("fa-eye")) {
          $icon.removeClass("fa-eye").addClass("fa-eye-slash");
        }
      } else {
        $input.attr("type", "password");
        $btn.attr({
          "aria-label": "Show password",
          "aria-pressed": "false"
        });

        if ($icon.hasClass("fa-lock-open")) {
          $icon.removeClass("fa-lock-open").addClass("fa-lock");
        } else if ($icon.hasClass("fa-eye-slash")) {
          $icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
      }

      $input.trigger("focus");
      var inputEl = $input[0];
      if (inputEl.setSelectionRange) {
        var len = inputEl.value.length;
        inputEl.setSelectionRange(len, len);
      }
    });
  }

  /*--------------------------------------------------------------
  24. OTP Input
  --------------------------------------------------------------*/
  function otpInput() {
    if (!$.exists(".password-reset__otp-input")) return;

    function getGroupInputs($el) {
      var $group = $el.closest(".password-reset__otp-group, form");
      return $group.length ? $group.find(".password-reset__otp-input") : $(".password-reset__otp-input");
    }

    $document.on("focus", ".password-reset__otp-input", function () {
      var el = this;
      setTimeout(function () {
        if (el.select) el.select();
      }, 10);
    });

    $document.on("input", ".password-reset__otp-input", function () {
      var $this = $(this);
      var $allInputs = getGroupInputs($this);
      var index = $allInputs.index($this);

      var cleanVal = $this.val().replace(/[^0-9]/g, "");
      if (cleanVal.length > 1) {
        cleanVal = cleanVal.charAt(cleanVal.length - 1);
      }
      $this.val(cleanVal);

      if (cleanVal.length === 1) {
        $this.addClass("is-filled");
        if (index < $allInputs.length - 1) {
          $allInputs.eq(index + 1).trigger("focus");
        }
      } else {
        $this.removeClass("is-filled");
      }
    });

    $document.on("keydown", ".password-reset__otp-input", function (e) {
      var $this = $(this);
      var $allInputs = getGroupInputs($this);
      var index = $allInputs.index($this);

      if (e.key === "Backspace") {
        if ($this.val() === "" && index > 0) {
          e.preventDefault();
          var $prev = $allInputs.eq(index - 1);
          $prev.val("").removeClass("is-filled").trigger("focus");
        } else {
          $this.removeClass("is-filled");
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        $allInputs.eq(index - 1).trigger("focus");
      } else if (e.key === "ArrowRight" && index < $allInputs.length - 1) {
        e.preventDefault();
        $allInputs.eq(index + 1).trigger("focus");
      }
    });

    $document.on("paste", ".password-reset__otp-input", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $allInputs = getGroupInputs($this);
      var index = $allInputs.index($this);

      var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
      if (!clipboardData) return;

      var pasted = clipboardData.getData("text").replace(/[^0-9]/g, "");
      if (!pasted) return;

      var startIndex = (pasted.length === $allInputs.length) ? 0 : index;
      var chars = pasted.split("");

      $.each(chars, function (i, char) {
        var targetIdx = startIndex + i;
        if (targetIdx < $allInputs.length) {
          $allInputs.eq(targetIdx).val(char).addClass("is-filled");
        }
      });

      var nextIdx = Math.min(startIndex + chars.length, $allInputs.length - 1);
      $allInputs.eq(nextIdx).trigger("focus");
    });
  }

  /*--------------------------------------------------------------
  25. Sales Chart
  --------------------------------------------------------------*/
  function salesChart() {
    if ($.exists("#salesChart")) {
      var salesChartEl = document.getElementById("salesChart");
      if (!salesChartEl || typeof Chart === "undefined") return;

      if (salesChartInstance && typeof salesChartInstance.destroy === "function") {
        salesChartInstance.destroy();
        salesChartInstance = null;
      }

      var rs = getComputedStyle(document.documentElement);
      var primaryColor = rs.getPropertyValue("--primary-color").trim() || "#fd6412";
      var secondaryColor = rs.getPropertyValue("--secondary-color").trim() || "#292929";
      var whiteColor = rs.getPropertyValue("--white-color").trim() || "#ffffff";
      var bodyColor = rs.getPropertyValue("--body-color").trim() || "#666666";
      var headingColor = rs.getPropertyValue("--heading-color").trim() || "#111111";

      function colorToRgba(color, alpha) {
        if (!color) return "rgba(0,0,0," + alpha + ")";
        var hex = color.replace("#", "").trim();
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length === 6) {
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
        }
        if (color.indexOf("rgb") === 0) {
          var parts = color.replace(/rgba?\(|\)/g, "").split(",");
          if (parts.length >= 3) {
            return "rgba(" + parseInt(parts[0], 10) + "," + parseInt(parts[1], 10) + "," + parseInt(parts[2], 10) + "," + alpha + ")";
          }
        }
        return color;
      }

      salesChartEl.setAttribute("role", "img");
      salesChartEl.setAttribute("aria-label", "Monthly Sales Line Chart");

      var ctx = salesChartEl.getContext("2d");
      var ds = salesChartEl.dataset;
      var months = ds.labels ? ds.labels.split(",").map(function (s) { return s.trim(); }) : [];

      var series1Label =
        ds.series1Label ||
        salesChartEl.getAttribute("data-series-1-label") ||
        ds.label1 ||
        "2021";
      var series1DataRaw =
        ds.series1Values ||
        salesChartEl.getAttribute("data-series-1-values") ||
        ds["2021"] ||
        "";
      var dataSeries1 = series1DataRaw
        ? series1DataRaw.split(",").map(function (v) { return Number(v.trim()); })
        : [];

      var series2Label =
        ds.series2Label ||
        salesChartEl.getAttribute("data-series-2-label") ||
        ds.label2 ||
        "2020";
      var series2DataRaw =
        ds.series2Values ||
        salesChartEl.getAttribute("data-series-2-values") ||
        ds["2020"] ||
        "";
      var dataSeries2 = series2DataRaw
        ? series2DataRaw.split(",").map(function (v) { return Number(v.trim()); })
        : [];

      var currencySymbol = ds.currency || "$";
      var unitSuffix = ds.unit || "K";
      var minY = ds.min ? Number(ds.min) : 10000;
      var maxY = ds.max ? Number(ds.max) : 100000;
      var stepSizeY = ds.stepSize ? Number(ds.stepSize) : 20000;

      var verticalLinePlugin = {
        id: "verticalLine",
        afterDraw: function (chart) {
          var active = chart.getActiveElements();
          if (!active || !active.length) return;
          var ctx2 = chart.ctx;
          var x = active[0].element.x;
          ctx2.save();
          ctx2.beginPath();
          ctx2.moveTo(x, chart.scales.y.top);
          ctx2.lineTo(x, chart.scales.y.bottom);
          ctx2.lineWidth = 1.5;
          ctx2.strokeStyle = colorToRgba(primaryColor, 0.4);
          ctx2.setLineDash([4, 4]);
          ctx2.stroke();
          ctx2.restore();
        },
      };

      salesChartInstance = new Chart(ctx, {
        type: "line",
        plugins: [verticalLinePlugin],
        data: {
          labels: months,
          datasets: [
            {
              label: series1Label,
              data: dataSeries1,
              borderColor: primaryColor,
              backgroundColor: colorToRgba(primaryColor, 0.08),
              borderWidth: 2.5,
              tension: 0.45,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: primaryColor,
              pointHoverBorderColor: whiteColor,
              pointHoverBorderWidth: 2,
            },
            {
              label: series2Label,
              data: dataSeries2,
              borderColor: secondaryColor,
              backgroundColor: colorToRgba(secondaryColor, 0.05),
              borderWidth: 2.5,
              tension: 0.45,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: secondaryColor,
              pointHoverBorderColor: whiteColor,
              pointHoverBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: primaryColor,
              titleColor: whiteColor,
              bodyColor: whiteColor,
              padding: 10,
              displayColors: false,
              callbacks: {
                title: function () {
                  return "";
                },
                label: function (c) {
                  return (
                    currencySymbol + (c.raw / 1000).toFixed(0) + unitSuffix
                  );
                },
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: bodyColor,
                font: { size: 12, family: "Poppins" },
              },
              border: { display: false },
            },
            y: {
              min: minY,
              max: maxY,
              ticks: {
                color: bodyColor,
                font: { size: 11, family: "Poppins" },
                callback: function (v) {
                  return v / 1000 + unitSuffix;
                },
                stepSize: stepSizeY,
              },
              grid: { color: colorToRgba(headingColor, 0.05) },
              border: { display: false },
            },
          },
        },
      });
    }
  }

  /*--------------------------------------------------------------
  26. Services Doughnut Chart
  --------------------------------------------------------------*/
  function servicesDoughnutChart() {
    if ($.exists("#servicesChart")) {
      var servicesChartEl = document.getElementById("servicesChart");
      if (
        !servicesChartEl ||
        typeof Chart === "undefined" ||
        typeof ChartDataLabels === "undefined"
      )
        return;

      if (servicesChartInstance && typeof servicesChartInstance.destroy === "function") {
        servicesChartInstance.destroy();
        servicesChartInstance = null;
      }

      servicesChartEl.setAttribute("role", "img");
      servicesChartEl.setAttribute("aria-label", "Services Distribution Doughnut Chart");

      var rs = getComputedStyle(document.documentElement);
      var primaryColor = rs.getPropertyValue("--primary-color").trim() || "#fd6412";
      var whiteColor = rs.getPropertyValue("--white-color").trim() || "#ffffff";

      var ctx = servicesChartEl.getContext("2d");
      var ds = servicesChartEl.dataset;
      var sliceLabels = ds.labels ? ds.labels.split(",").map(function (s) { return s.trim(); }) : [];
      var sliceData = ds.values ? ds.values.split(",").map(function (v) { return Number(v.trim()); }) : [];
      var sliceColors = ds.colors
        ? ds.colors.split(",").map(function (c) {
            var v = c.trim();
            return v.startsWith("var(")
              ? rs.getPropertyValue(v.slice(4, -1).trim()).trim()
              : v;
          })
        : [];

      var cutoutVal = ds.cutout || "65%";
      var padTop = ds.paddingTop ? Number(ds.paddingTop) : 30;
      var padBottom = ds.paddingBottom ? Number(ds.paddingBottom) : 30;
      var padLeft = ds.paddingLeft ? Number(ds.paddingLeft) : 95;
      var padRight = ds.paddingRight ? Number(ds.paddingRight) : 75;

      servicesChartInstance = new Chart(ctx, {
        type: "doughnut",
        plugins: [ChartDataLabels],
        data: {
          labels: sliceLabels,
          datasets: [
            {
              data: sliceData,
              backgroundColor: sliceColors,
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: cutoutVal,
          layout: {
            padding: {
              top: padTop,
              bottom: padBottom,
              left: padLeft,
              right: padRight,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: primaryColor,
              titleColor: whiteColor,
              bodyColor: whiteColor,
              padding: 10,
              displayColors: false,
            },
            datalabels: {
              anchor: "end",
              align: "end",
              offset: 12,
              clip: false,
              color: function (ctx2) {
                return sliceColors[ctx2.dataIndex] || primaryColor;
              },
              font: {
                family: "'Poppins', 'Passion One'",
                size: 14,
                weight: "600",
              },
              formatter: function (value, ctx2) {
                return ctx2.chart.data.labels[ctx2.dataIndex];
              },
            },
          },
        },
      });
    }
  }

  /*--------------------------------------------------------------
  27. Table Controls (Select All / Delete)
  --------------------------------------------------------------*/
  function tableControls() {
    if ($.exists("#lead-select-all, #order-select-all, .order-table, .lead-table")) {
      var lastFocusedBtn = null;

      function updateSelectAllState(tbodyId, selectAllId) {
        var $tbody = $("#" + tbodyId);
        var $selectAll = $("#" + selectAllId);
        if (!$tbody.length || !$selectAll.length) return;

        var emptyClass =
          tbodyId === "lead-table-body"
            ? "lead-table__empty-row"
            : "order-table__empty-row";
        var $visibleRows = $tbody.find("tr:visible").not("." + emptyClass);
        var $checkboxes = $visibleRows.find(
          ".lead-table__checkbox, .order-table__checkbox",
        );
        var $checked = $checkboxes.filter(":checked");

        $selectAll.prop(
          "checked",
          $checkboxes.length > 0 && $checked.length === $checkboxes.length,
        );
        $selectAll.prop(
          "indeterminate",
          $checked.length > 0 && $checked.length < $checkboxes.length,
        );
      }

      $document.on("change", "#lead-select-all, #order-select-all", function () {
        var isChecked = this.checked;
        var selectAllId = this.id;
        var tbodyId =
          selectAllId === "lead-select-all"
            ? "lead-table-body"
            : "order-table-body";
        var emptyClass =
          tbodyId === "lead-table-body"
            ? "lead-table__empty-row"
            : "order-table__empty-row";
        var $tbody = $("#" + tbodyId);

        $tbody
          .find("tr:visible")
          .not("." + emptyClass)
          .find(".lead-table__checkbox, .order-table__checkbox")
          .prop("checked", isChecked);

        this.indeterminate = false;
      });

      $document.on(
        "change",
        ".lead-table__checkbox, .order-table__checkbox",
        function () {
          var $tbody = $(this).closest("tbody");
          var tbodyId = $tbody.attr("id");
          var selectAllId =
            tbodyId === "lead-table-body"
              ? "lead-select-all"
              : "order-select-all";
          updateSelectAllState(tbodyId, selectAllId);
        },
      );

      $document.on("click", "[data-row-delete]", function (e) {
        e.preventDefault();
        var $row = $(this).closest("tr");
        if (!$row.length) return;

        var $tbody = $row.closest("tbody");
        var tbodyId = $tbody.attr("id");
        var selectAllId =
          tbodyId === "lead-table-body"
            ? "lead-select-all"
            : "order-select-all";
        var emptyClass =
          tbodyId === "lead-table-body"
            ? "lead-table__empty-row"
            : "order-table__empty-row";
        var colCount =
          $tbody.closest("table").find("thead th").length || 10;

        $row.css({ transition: "opacity 0.25s ease", opacity: "0" });

        setTimeout(function () {
          $row.remove();
          updateSelectAllState(tbodyId, selectAllId);

          if ($tbody.find("tr").not("." + emptyClass).length === 0) {
            $tbody.append(
              '<tr class="' +
                emptyClass +
                '"><td colspan="' +
                colCount +
                '">No records available</td></tr>',
            );
          }
        }, 250);
      });

      $document.on("click", "[data-row-edit]", function (e) {
        e.preventDefault();
        var row = this.closest("tr");
        if (!row) return;

        lastFocusedBtn = this;
        var $tbody = $(row).closest("tbody");
        var isLead = $tbody.attr("id") === "lead-table-body";

        if (isLead) {
          var leadModal = document.getElementById("leadStatusModal");
          if (!leadModal) return;

          var leadStatusEl = row.querySelector(".lead-table__status");
          var leadNameEl = row.querySelector(".lead-table__name");
          var leadContactEl = row.querySelector(".lead-table__contact");

          var modalLeadName = document.getElementById("modalLeadName");
          var modalLeadContact = document.getElementById("modalLeadContact");

          if (modalLeadName && leadNameEl) {
            modalLeadName.textContent = leadNameEl.textContent.trim();
          }
          if (modalLeadContact && leadContactEl) {
            modalLeadContact.textContent = leadContactEl.textContent.trim();
          }

          var currentLeadStatus = leadStatusEl
            ? leadStatusEl.textContent.trim()
            : "On going";
          $("#leadStatusInput").val(currentLeadStatus);
          $("#leadCustomSelectText").text(currentLeadStatus);

          $("#leadCustomSelect .lead-modal__custom-select-option").each(
            function () {
              var val = $(this).data("value");
              if (val === currentLeadStatus) {
                $(this).addClass("is-selected").attr("aria-selected", "true");
              } else {
                $(this).removeClass("is-selected").attr("aria-selected", "false");
              }
            },
          );

          $("#leadCustomSelect")
            .removeClass("is-open")
            .attr("aria-expanded", "false");

          leadModal.currentEditingRow = row;
          leadModal.classList.add("is-visible");
          leadModal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          $("#leadCustomSelectTrigger").trigger("focus");
          return;
        }

        var modal = document.getElementById("orderStatusModal");
        if (!modal) return;

        var currentStatusEl = row.querySelector(".order-table__status");
        var trackingEl = row.querySelector(".order-table__tracking");
        var nameEl = row.querySelector(".order-table__product-name");
        var imgEl = row.querySelector(".order-table__product-img");

        var modalImg = document.getElementById("modalProductImg");
        var modalName = document.getElementById("modalProductName");
        var modalTracking = document.getElementById("modalProductTracking");

        if (modalImg && imgEl) modalImg.src = imgEl.src;
        if (modalName && nameEl) {
          modalName.textContent = nameEl.textContent.trim();
        }
        if (modalTracking && trackingEl) {
          modalTracking.textContent = trackingEl.textContent.trim();
        }

        var currentStatus = currentStatusEl
          ? currentStatusEl.textContent.trim()
          : "Delivered";
        $("#orderStatusInput").val(currentStatus);
        $("#orderCustomSelectText").text(currentStatus);

        $("#orderCustomSelect .order-modal__custom-select-option").each(
          function () {
            var val = $(this).data("value");
            if (val === currentStatus) {
              $(this).addClass("is-selected").attr("aria-selected", "true");
            } else {
              $(this).removeClass("is-selected").attr("aria-selected", "false");
            }
          },
        );

        $("#orderCustomSelect")
          .removeClass("is-open")
          .attr("aria-expanded", "false");

        modal.currentEditingRow = row;
        modal.classList.add("is-visible");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        $("#orderCustomSelectTrigger").trigger("focus");
      });

      var $statusModal = $("#orderStatusModal");
      if ($statusModal.length) {
        function closeModal() {
          $statusModal.removeClass("is-visible").attr("aria-hidden", "true");
          $("#orderCustomSelect")
            .removeClass("is-open")
            .attr("aria-expanded", "false");
          document.body.style.overflow = "";
          $statusModal[0].currentEditingRow = null;
          if (lastFocusedBtn) {
            $(lastFocusedBtn).trigger("focus");
            lastFocusedBtn = null;
          }
        }

        $document.on("click", "#orderStatusModal [data-modal-close]", function (e) {
          e.preventDefault();
          closeModal();
        });

        $document.on("click", "#orderStatusModal", function (e) {
          if (e.target === this) {
            closeModal();
          }
        });

        $document.on("click", "#orderCustomSelectTrigger", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $select = $("#orderCustomSelect");
          var isOpen = $select.hasClass("is-open");
          $select
            .toggleClass("is-open", !isOpen)
            .attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $document.on(
          "click",
          "#orderStatusModal .order-modal__custom-select-option",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            var val = $(this).data("value");
            $("#orderStatusInput").val(val);
            $("#orderCustomSelectText").text(val);

            $("#orderCustomSelect .order-modal__custom-select-option")
              .removeClass("is-selected")
              .attr("aria-selected", "false");
            $(this).addClass("is-selected").attr("aria-selected", "true");

            $("#orderCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
            $("#orderCustomSelectTrigger").trigger("focus");
          },
        );

        $document.on("click.orderCustomSelect", function (e) {
          if (
            $statusModal.hasClass("is-visible") &&
            !$(e.target).closest("#orderCustomSelect").length
          ) {
            $("#orderCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
          }
        });

        $document.on("keydown.orderStatusModal", function (e) {
          if (e.key === "Escape" && $statusModal.hasClass("is-visible")) {
            closeModal();
          }
        });

        $document.on("submit", "#orderStatusForm", function (e) {
          e.preventDefault();
          var editingRow = $statusModal[0].currentEditingRow;
          var newStatus = $("#orderStatusInput").val();

          if (editingRow && newStatus) {
            var $statusBadge = $(editingRow).find(".order-table__status");
            if ($statusBadge.length) {
              $statusBadge
                .removeClass(
                  "order-table__status--delivered order-table__status--process order-table__status--cancelled",
                )
                .addClass("order-table__status--" + newStatus.toLowerCase())
                .text(newStatus);
            }

            var msg = $("#orderStatusForm").data("success-message");
            if (typeof toastr !== "undefined" && msg) {
              toastr.success(msg.replace("{status}", newStatus));
            }
          }

          closeModal();
        });
      }

      var $leadStatusModal = $("#leadStatusModal");
      if ($leadStatusModal.length) {
        function closeLeadModal() {
          $leadStatusModal
            .removeClass("is-visible")
            .attr("aria-hidden", "true");
          $("#leadCustomSelect")
            .removeClass("is-open")
            .attr("aria-expanded", "false");
          document.body.style.overflow = "";
          $leadStatusModal[0].currentEditingRow = null;
          if (lastFocusedBtn) {
            $(lastFocusedBtn).trigger("focus");
            lastFocusedBtn = null;
          }
        }

        $document.on("click", "#leadStatusModal [data-modal-close]", function (e) {
          e.preventDefault();
          closeLeadModal();
        });

        $document.on("click", "#leadStatusModal", function (e) {
          if (e.target === this) {
            closeLeadModal();
          }
        });

        $document.on("click", "#leadCustomSelectTrigger", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $select = $("#leadCustomSelect");
          var isOpen = $select.hasClass("is-open");
          $select
            .toggleClass("is-open", !isOpen)
            .attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $document.on(
          "click",
          "#leadStatusModal .lead-modal__custom-select-option",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            var val = $(this).data("value");
            $("#leadStatusInput").val(val);
            $("#leadCustomSelectText").text(val);

            $("#leadCustomSelect .lead-modal__custom-select-option")
              .removeClass("is-selected")
              .attr("aria-selected", "false");
            $(this).addClass("is-selected").attr("aria-selected", "true");

            $("#leadCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
            $("#leadCustomSelectTrigger").trigger("focus");
          },
        );

        $document.on("click.leadCustomSelect", function (e) {
          if (
            $leadStatusModal.hasClass("is-visible") &&
            !$(e.target).closest("#leadCustomSelect").length
          ) {
            $("#leadCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
          }
        });

        $document.on("keydown.leadStatusModal", function (e) {
          if (e.key === "Escape" && $leadStatusModal.hasClass("is-visible")) {
            closeLeadModal();
          }
        });

        $document.on("submit", "#leadStatusForm", function (e) {
          e.preventDefault();
          var editingRow = $leadStatusModal[0].currentEditingRow;
          var newStatus = $("#leadStatusInput").val();

          if (editingRow && newStatus) {
            var $statusBadge = $(editingRow).find(".lead-table__status");
            if ($statusBadge.length) {
              var statusClass = newStatus.toLowerCase().replace(/\s+/g, "");
              $statusBadge
                .removeClass(
                  "lead-table__status--ongoing lead-table__status--new lead-table__status--completed",
                )
                .addClass("lead-table__status--" + statusClass)
                .text(newStatus);
            }

            var msg = $("#leadStatusForm").data("success-message");
            if (typeof toastr !== "undefined" && msg) {
              toastr.success(msg.replace("{status}", newStatus));
            }
          }

          closeLeadModal();
        });
      }

      function initTableSearch(inputId, tbodyId, selectAllId) {
        var $input = $("#" + inputId);
        var $tbody = $("#" + tbodyId);
        if (!$input.length || !$tbody.length) return;

        var colCount = $tbody.closest("table").find("thead th").length || 10;
        var emptyClass =
          tbodyId === "lead-table-body"
            ? "lead-table__empty-row"
            : "order-table__empty-row";

        $document.on("input", "#" + inputId, function () {
          var query = $(this).val().toLowerCase().trim();
          var $rows = $tbody.find("tr").not("." + emptyClass);
          var matchCount = 0;

          $rows.each(function () {
            var $row = $(this);
            var text = $row.text().toLowerCase();
            var matches = !query || text.indexOf(query) !== -1;
            $row.toggle(matches);
            if (matches) matchCount++;
          });

          $tbody.find("." + emptyClass).remove();

          if (matchCount === 0 && query) {
            $tbody.append(
              '<tr class="' +
                emptyClass +
                '"><td colspan="' +
                colCount +
                '">No matching records found</td></tr>',
            );
          }

          updateSelectAllState(tbodyId, selectAllId);
        });
      }

      initTableSearch("lead-search", "lead-table-body", "lead-select-all");
      initTableSearch("product-search", "order-table-body", "order-select-all");

      function initStatusFilter(
        triggerId,
        menuId,
        tbodyId,
        statusSelector,
        selectAllId,
      ) {
        var $trigger = $("#" + triggerId);
        var $menu = $("#" + menuId);
        var $tbody = $("#" + tbodyId);
        if (!$trigger.length || !$menu.length || !$tbody.length) return;

        $document.on("click", "#" + triggerId, function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = $menu.hasClass("is-open");
          $(".dashboard-filter-menu").not($menu).removeClass("is-open");
          $menu.toggleClass("is-open", !isOpen);
          $trigger.attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $document.on(
          "click",
          "#" + menuId + " .dashboard-filter-menu__item",
          function (e) {
            e.preventDefault();
            var filterVal = $(this).data("filter");

            $menu.find(".dashboard-filter-menu__item").removeClass("is-active");
            $(this).addClass("is-active");

            filterRows(filterVal);
            $menu.removeClass("is-open");
            $trigger.attr("aria-expanded", "false");
          },
        );

        $document.on(
          "click",
          "#" + menuId + " .dashboard-filter-menu__reset",
          function (e) {
            e.preventDefault();
            $menu.find(".dashboard-filter-menu__item").removeClass("is-active");
            $menu
              .find(".dashboard-filter-menu__item[data-filter='all']")
              .addClass("is-active");
            filterRows("all");
            $menu.removeClass("is-open");
            $trigger.attr("aria-expanded", "false");
          },
        );

        function filterRows(filterVal) {
          var $rows = $tbody
            .find("tr")
            .not(".order-table__empty-row, .lead-table__empty-row");
          var emptyClass =
            tbodyId === "lead-table-body"
              ? "lead-table__empty-row"
              : "order-table__empty-row";
          var colCount = $tbody.closest("table").find("thead th").length || 10;
          var visibleCount = 0;

          $rows.each(function () {
            var $row = $(this);
            var statusText = $row
              .find(statusSelector)
              .text()
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "");
            var matches =
              filterVal === "all" || statusText.indexOf(filterVal) !== -1;
            $row.toggle(matches);
            if (matches) visibleCount++;
          });

          $tbody.find("." + emptyClass).remove();
          if (visibleCount === 0) {
            $tbody.append(
              '<tr class="' +
                emptyClass +
                '"><td colspan="' +
                colCount +
                '">No matching records for selected filter</td></tr>',
            );
          }

          updateSelectAllState(tbodyId, selectAllId);
        }
      }

      initStatusFilter(
        "orderFilterBtn",
        "orderFilterMenu",
        "order-table-body",
        ".order-table__status",
        "order-select-all",
      );
      initStatusFilter(
        "leadFilterBtn",
        "leadFilterMenu",
        "lead-table-body",
        ".lead-table__status",
        "lead-select-all",
      );

      $document.on("click", function (e) {
        if (!$(e.target).closest(".dashboard-filter-dropdown").length) {
          $(".dashboard-filter-menu").removeClass("is-open");
          $(".order-toolbar__filter-btn, .lead-toolbar__filter-btn").attr(
            "aria-expanded",
            "false",
          );
        }
      });

      $document.on("click", ".order-toolbar__icon-btn--excel", function (e) {
        e.preventDefault();
        var $table = $(".order-table");
        if (!$table.length) return;

        var rows = [];
        var headers = [
          "Tracking ID",
          "Product",
          "Type",
          "Added Date",
          "Price",
          "Category",
          "Brand",
          "Stock",
          "Status",
        ];
        rows.push(headers);

        $("#order-table-body tr:visible")
          .not(".order-table__empty-row")
          .each(function () {
            var $tr = $(this);
            var tracking = $tr.find(".order-table__tracking").text().trim();
            var product = $tr.find(".order-table__product-name").text().trim();
            var type = $tr.find(".order-table__type").text().trim();
            var date = $tr.find("td:nth-child(5)").text().trim();
            var price = $tr.find(".order-table__price").text().trim();
            var category = $tr.find("td:nth-child(7)").text().trim();
            var brand = $tr.find("td:nth-child(8)").text().trim();
            var stock = $tr.find("td:nth-child(9)").text().trim();
            var status = $tr.find(".order-table__status").text().trim();

            rows.push([
              tracking,
              product,
              type,
              date,
              price,
              category,
              brand,
              stock,
              status,
            ]);
          });

        var $excelBtn = $(".order-toolbar__icon-btn--excel");
        if (rows.length <= 1) {
          var warnMsg = $excelBtn.data("warning-message");
          if (typeof toastr !== "undefined" && warnMsg) {
            toastr.warning(warnMsg);
          }
          return;
        }

        var csvContent =
          "\uFEFF" +
          rows
            .map(function (row) {
              return row
                .map(function (val) {
                  return '"' + String(val).replace(/"/g, '""') + '"';
                })
                .join(",");
            })
            .join("\r\n");

        var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        var today = new Date().toISOString().slice(0, 10);
        var filename = "patie-orders-" + today + ".csv";
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 100);

        var successMsg = $excelBtn.data("success-message");
        if (typeof toastr !== "undefined" && successMsg) {
          toastr.success(successMsg.replace("{count}", rows.length - 1));
        }
      });

      var $addProductModal = $("#addProductModal");
      if ($addProductModal.length) {
        function closeAddProductModal() {
          $addProductModal
            .removeClass("is-visible")
            .attr("aria-hidden", "true");
          document.body.style.overflow = "";
          if (lastFocusedBtn) {
            $(lastFocusedBtn).trigger("focus");
            lastFocusedBtn = null;
          }
        }

        $document.on("click", ".order-toolbar__add-btn", function (e) {
          e.preventDefault();
          lastFocusedBtn = this;
          $addProductModal.addClass("is-visible").attr("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          $("#addProductName").trigger("focus");
        });

        $document.on("click", "#addProductModal [data-modal-close]", function (e) {
          e.preventDefault();
          closeAddProductModal();
        });

        $document.on("click", "#addProductModal", function (e) {
          if (e.target === this) {
            closeAddProductModal();
          }
        });

        $document.on(
          "click",
          "#addProductModal .dashboard-modal-img-option",
          function () {
            $addProductModal
              .find(".dashboard-modal-img-option")
              .removeClass("is-active");
            $(this).addClass("is-active");
            $(this).find("input[type='radio']").prop("checked", true);
          },
        );

        $document.on("keydown.addProductModal", function (e) {
          if (e.key === "Escape" && $addProductModal.hasClass("is-visible")) {
            closeAddProductModal();
          }
        });

        $document.on("submit", "#addProductForm", function (e) {
          e.preventDefault();
          var name = $("#addProductName").val().trim();
          var price = $("#addProductPrice").val().trim();
          var stock = $("#addProductStock").val().trim();

          var $form = $(this);
          if (!name || !price || !stock) {
            var errMsg = $form.data("error-message");
            if (typeof toastr !== "undefined" && errMsg) {
              toastr.error(errMsg);
            }
            return;
          }

          var type = $("#addProductType").val();
          var category = $("#addProductCategory").val().trim() || "N/A";
          var brand = $("#addProductBrand").val().trim() || "N/A";
          var status = $("#addProductStatus").val();
          var imgSrc =
            $("input[name='product_img_preset']:checked").val() ||
            "assets/img/dashboard/order-food-1.png";

          var d = new Date();
          var dateStr =
            ("0" + d.getDate()).slice(-2) +
            "/" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            d.getFullYear();
          var randomId = "#" + (Math.floor(Math.random() * 90000) + 10000);

          var statusClass = status.toLowerCase();
          var newRowHtml =
            "<tr>" +
            '<td class="order-table__check-col"><input type="checkbox" name="order-row-select" class="order-table__checkbox" aria-label="Select row" /></td>' +
            '<td><span class="order-table__tracking">' +
            randomId +
            "</span></td>" +
            '<td><div class="order-table__product"><img src="' +
            imgSrc +
            '" alt="' +
            name +
            '" class="order-table__product-img" /><span class="order-table__product-name">' +
            name +
            "</span></div></td>" +
            '<td><span class="order-table__type">' +
            type +
            "</span></td>" +
            "<td>" +
            dateStr +
            "</td>" +
            '<td><span class="order-table__price">' +
            (price.startsWith("$") ? price : "$" + price) +
            "</span></td>" +
            "<td>" +
            category +
            "</td>" +
            "<td>" +
            brand +
            "</td>" +
            "<td>" +
            stock +
            "</td>" +
            '<td><span class="order-table__status order-table__status--' +
            statusClass +
            '">' +
            status +
            "</span></td>" +
            '<td><div class="order-table__actions"><a href="shop-details.html" class="order-table__action-btn" aria-label="View"><i class="fas fa-eye" aria-hidden="true"></i></a><button type="button" class="order-table__action-btn" aria-label="Edit" data-row-edit><i class="fas fa-pen" aria-hidden="true"></i></button><a href="#" class="order-table__action-btn order-table__action-btn--delete" data-row-delete aria-label="Delete"><i class="fas fa-trash" aria-hidden="true"></i></a></div></td>' +
            "</tr>";

          $("#order-table-body .order-table__empty-row").remove();
          $("#order-table-body").prepend(newRowHtml);
          this.reset();
          $addProductModal
            .find(".dashboard-modal-img-option")
            .removeClass("is-active")
            .first()
            .addClass("is-active");
          closeAddProductModal();
          updateSelectAllState("order-table-body", "order-select-all");

          var successMsg = $form.data("success-message");
          if (typeof toastr !== "undefined" && successMsg) {
            toastr.success(successMsg.replace("{name}", name));
          }
        });
      }

      var $addLeadModal = $("#addLeadModal");
      if ($addLeadModal.length) {
        function closeAddLeadModal() {
          $addLeadModal.removeClass("is-visible").attr("aria-hidden", "true");
          document.body.style.overflow = "";
          if (lastFocusedBtn) {
            $(lastFocusedBtn).trigger("focus");
            lastFocusedBtn = null;
          }
        }

        $document.on("click", ".lead-toolbar__add-btn", function (e) {
          e.preventDefault();
          lastFocusedBtn = this;
          $addLeadModal.addClass("is-visible").attr("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          $("#addLeadName").trigger("focus");
        });

        $document.on("click", "#addLeadModal [data-modal-close]", function (e) {
          e.preventDefault();
          closeAddLeadModal();
        });

        $document.on("click", "#addLeadModal", function (e) {
          if (e.target === this) {
            closeAddLeadModal();
          }
        });

        $document.on("keydown.addLeadModal", function (e) {
          if (e.key === "Escape" && $addLeadModal.hasClass("is-visible")) {
            closeAddLeadModal();
          }
        });

        $document.on("submit", "#addLeadForm", function (e) {
          e.preventDefault();
          var name = $("#addLeadName").val().trim();
          var contact = $("#addLeadContact").val().trim();

          var $form = $(this);
          if (!name || !contact) {
            var errMsg = $form.data("error-message");
            if (typeof toastr !== "undefined" && errMsg) {
              toastr.error(errMsg);
            }
            return;
          }

          var status = $("#addLeadStatus").val();
          var source = $("#addLeadSource").val().trim() || "Website";
          var assigned = $("#addLeadAssigned").val().trim() || "N/A";

          var d = new Date();
          var dateStr =
            ("0" + d.getDate()).slice(-2) +
            "/" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "/" +
            d.getFullYear();
          var statusClass = status.toLowerCase().replace(/\s+/g, "");

          var newRowHtml =
            "<tr>" +
            '<td class="lead-table__check-col"><input type="checkbox" name="lead-row-select" class="lead-table__checkbox" aria-label="Select row" /></td>' +
            '<td><span class="lead-table__name">' +
            name +
            "</span></td>" +
            '<td><span class="lead-table__status lead-table__status--' +
            statusClass +
            '">' +
            status +
            "</span></td>" +
            "<td>" +
            source +
            "</td>" +
            "<td>" +
            assigned +
            "</td>" +
            '<td><span class="lead-table__contact">' +
            contact +
            "</span></td>" +
            "<td>" +
            dateStr +
            "</td>" +
            '<td><div class="lead-table__actions"><a href="team-details.html" class="lead-table__action-btn" aria-label="View"><i class="fas fa-eye" aria-hidden="true"></i></a><button type="button" class="lead-table__action-btn" aria-label="Edit" data-row-edit><i class="fas fa-pen" aria-hidden="true"></i></button><a href="#" class="lead-table__action-btn lead-table__action-btn--delete" data-row-delete aria-label="Delete"><i class="fas fa-trash" aria-hidden="true"></i></a></div></td>' +
            "</tr>";

          $("#lead-table-body .lead-table__empty-row").remove();
          $("#lead-table-body").prepend(newRowHtml);
          this.reset();
          closeAddLeadModal();
          updateSelectAllState("lead-table-body", "lead-select-all");

          var successMsg = $form.data("success-message");
          if (typeof toastr !== "undefined" && successMsg) {
            toastr.success(successMsg.replace("{name}", name));
          }
        });
      }
    }
  }

  /*--------------------------------------------------------------
  28. Image Compare Slider
  --------------------------------------------------------------*/
  function imageCompare() {
    if ($.exists(".tp-compare")) {
      $(".tp-compare").each(function () {
        var $compare = $(this);
        var $range = $compare.find(".tp-compare__range");
        if ($range.length) {
          var val = $range.val() || 50;
          $compare[0].style.setProperty("--pos", val + "%");
          $range.attr({
            "aria-label": $range.attr("aria-label") || "Image comparison slider",
            "aria-valuenow": val,
            "aria-valuemin": $range.attr("min") || "0",
            "aria-valuemax": $range.attr("max") || "100",
          });
        }
      });

      $document.on("input change", ".tp-compare__range", function () {
        var $range = $(this);
        var $compare = $range.closest(".tp-compare");
        if ($compare.length) {
          var val = this.value;
          $compare[0].style.setProperty("--pos", val + "%");
          $range.attr("aria-valuenow", val);
        }
      });
    }
  }

  /*--------------------------------------------------------------
  29. Parallax (GSAP) Animation
  --------------------------------------------------------------*/
  function videoTextParallax() {
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      reduceMotion
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var parallaxConfigs = [
      {
        wrapSelector: ".about-grooming__image-wrap",
        imgSelector: ".about-grooming__img",
        bgSelector: ".about-grooming__bg",
        rotateStart: -4,
        rotateEnd: 4,
        sectionSelector: null,
      },
      {
        wrapSelector: ".grooming-choose-us__image-wrap",
        imgSelector: ".grooming-choose-us__img",
        bgSelector: ".grooming-choose-us__img-bg",
        rotateStart: -5,
        rotateEnd: 5,
        sectionSelector: null,
      },
      {
        wrapSelector: ".boarding-choose-us__img-wrap",
        imgSelector: ".boarding-choose-us__img",
        bgSelector: ".boarding-choose-us__img-bg",
        rotateStart: -5,
        rotateEnd: 5,
        sectionSelector: ".boarding-choose-us",
      },
    ];

    parallaxConfigs.forEach(function (cfg) {
      var wraps = document.querySelectorAll(cfg.wrapSelector);
      if (!wraps.length) return;

      wraps.forEach(function (wrap) {
        var petImg = wrap.querySelector(cfg.imgSelector);
        var bgImg = wrap.querySelector(cfg.bgSelector);
        var triggerEl = cfg.sectionSelector
          ? wrap.closest(cfg.sectionSelector) || wrap
          : wrap;

        if (petImg) {
          gsap.fromTo(
            petImg,
            { y: 35, force3D: true },
            {
              y: -35,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: triggerEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (bgImg) {
          gsap.fromTo(
            bgImg,
            { y: -25, rotate: cfg.rotateStart, force3D: true },
            {
              y: 25,
              rotate: cfg.rotateEnd,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: triggerEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
    });

    var boardingHeroes = document.querySelectorAll(".boarding-hero__images");
    if (boardingHeroes.length) {
      boardingHeroes.forEach(function (heroWrap) {
        var parallaxItems = heroWrap.querySelectorAll(
          ".boarding-hero__floating--cat, .boarding-hero__floating--dog, .boarding-hero__line",
        );
        var section = heroWrap.closest(".boarding-hero") || heroWrap;

        if (parallaxItems.length) {
          gsap.to(parallaxItems, {
            y: 50,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }
  }

  /*--------------------------------------------------------------
  30. Form Validation & Submissions
  --------------------------------------------------------------*/
  function formHandling() {
    if (typeof toastr !== "undefined") {
      toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "4000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
      };
    }

    function getFieldContainer($input) {
      var $container = $input.closest(
        ".checkout-section__input-wrapper, .checkout-section__select-wrap, .working-process__form-group, .contact-section__input-group, .form-group",
      );
      return $container.length ? $container : $input.parent();
    }

    $document.on(
      "input change",
      "form input, form select, form textarea",
      function () {
        var $field = $(this);
        if (this.checkValidity()) {
          $field
            .removeClass("is-invalid")
            .removeAttr("aria-invalid")
            .removeAttr("aria-describedby");
          getFieldContainer($field)
            .find(".form-error-message, .working-process__error-message")
            .remove();
        }
      },
    );

    $document.on("submit", "form", function (e) {
      var form = this;
      var $form = $(form);
      if (
        $form.is(
          "#addProductForm, #addLeadForm, #orderStatusForm, #leadStatusForm, .header-search__form, .shop-search, .search-form",
        )
      ) {
        return;
      }
      var action = $form.attr("action");

      if (
        $form.attr("novalidate") !== undefined ||
        $form.data("error-message")
      ) {
        $form
          .find(".form-error-message, .working-process__error-message")
          .remove();
        $form
          .find(".is-invalid")
          .removeClass("is-invalid")
          .removeAttr("aria-invalid")
          .removeAttr("aria-describedby");

        var isValid = true;
        var firstInvalid = null;

        $form
          .find("input, select, textarea")
          .not(":button, :submit, :reset, :disabled, [type='hidden']")
          .each(function () {
            if (!this.checkValidity()) {
              isValid = false;
              var $input = $(this);
              var errorId =
                "err-" +
                ($input.attr("id") ||
                  $input.attr("name") ||
                  Math.floor(Math.random() * 10000));

              $input
                .addClass("is-invalid")
                .attr("aria-invalid", "true")
                .attr("aria-describedby", errorId);

              var errorText =
                $input.data("error-message") || this.validationMessage;
              if (errorText) {
                getFieldContainer($input).append(
                  '<span class="form-error-message" id="' +
                    errorId +
                    '" role="alert">' +
                    errorText +
                    "</span>",
                );
              }

              if (!firstInvalid) {
                firstInvalid = $input;
              }
            }
          });

        if (!isValid) {
          e.preventDefault();
          if (firstInvalid) {
            firstInvalid.trigger("focus");
          }
          var formError = $form.data("error-message");
          if (formError && typeof toastr !== "undefined") {
            toastr.error(formError);
          }
          return;
        }
      } else if (form.checkValidity && !form.checkValidity()) {
        return;
      }

      if (!action || action === "#" || action.indexOf("javascript") !== -1) {
        e.preventDefault();

        var message = $form.data("success-message");

        if (message && typeof toastr !== "undefined") {
          toastr.success(message);
        }

        form.reset();
        $form
          .find(".is-invalid")
          .removeClass("is-invalid")
          .removeAttr("aria-invalid")
          .removeAttr("aria-describedby");
        $form
          .find(".form-error-message, .working-process__error-message")
          .remove();
      }
    });
  }

  /*--------------------------------------------------------------
  31. Lightbox Popup
  --------------------------------------------------------------*/
  function initLightbox() {
    var lastFocusedTrigger = null;

    $(".blog-details__main-img-wrap, .blog-details__sub-img, [data-lightbox]").each(function () {
      var $el = $(this);
      if (!$el.attr("tabindex")) {
        $el.attr("tabindex", "0");
      }
      if (!$el.attr("role")) {
        $el.attr("role", "button");
      }
      if (!$el.attr("aria-label")) {
        $el.attr("aria-label", "View image in lightbox");
      }
    });

    function openLightbox($el) {
      lastFocusedTrigger = $el[0];
      var currentSrc =
        $el.attr("data-lightbox-src") ||
        $el.attr("data-src") ||
        $el.find("img").attr("src") ||
        $el.attr("src");

      var dynamicEl = [];
      var activeIndex = 0;

      if ($el.hasClass("blog-details__sub-img")) {
        var $subImages = $(".blog-details__sub-images .blog-details__sub-img");
        $subImages.each(function (i) {
          var src = $(this).attr("data-lightbox-src") || $(this).attr("src");
          if (src) {
            dynamicEl.push({ src: src, thumb: src });
            if (src === currentSrc) {
              activeIndex = i;
            }
          }
        });
      } else {
        dynamicEl.push({ src: currentSrc, thumb: currentSrc });
      }

      if ($.fn.lightGallery && dynamicEl.length) {
        var existingLg = $el.data("lightGallery");
        if (existingLg && typeof existingLg.destroy === "function") {
          existingLg.destroy(true);
        }

        $el.lightGallery({
          dynamic: true,
          dynamicEl: dynamicEl,
          index: activeIndex,
          download: false,
          actualSize: false,
          hash: false,
          closable: true,
          escKey: true,
          keyPress: true,
          controls: true,
          zoom: true,
          scale: 1,
        });
      }
    }

    $document.on(
      "click",
      ".blog-details__main-img-wrap, .blog-details__sub-img, [data-lightbox]",
      function (e) {
        if ($(e.target).closest(".blog-details__meta-pill").length) {
          return;
        }
        e.preventDefault();
        openLightbox($(this));
      },
    );

    $document.on(
      "keydown",
      ".blog-details__main-img-wrap, .blog-details__sub-img, [data-lightbox]",
      function (e) {
        if (e.key === "Enter" || e.key === " ") {
          if ($(e.target).closest(".blog-details__meta-pill").length) {
            return;
          }
          e.preventDefault();
          openLightbox($(this));
        }
      },
    );

    $document.on("wheel", ".lg-outer", function (e) {
      if (e.cancelable) {
        e.preventDefault();
      }
      var $image = $(this).find(".lg-current .lg-image");
      if (!$image.length) return;

      var currentScale = parseFloat($image.attr("data-scale")) || 1;
      var delta = e.originalEvent ? e.originalEvent.deltaY : 0;

      var zoomStep = 0.25;
      if (delta < 0) {
        currentScale += zoomStep;
      } else {
        currentScale -= zoomStep;
      }

      currentScale = Math.min(Math.max(currentScale, 1), 4);
      $image.attr("data-scale", currentScale);

      if (currentScale > 1) {
        $(".lg-outer").addClass("lg-zoomed");
        $image.css({
          transform: "scale3d(" + currentScale + ", " + currentScale + ", 1)",
          "transform-origin": "50% 50%",
          "-webkit-transform-origin": "50% 50%",
          transition: "transform 0.12s ease-out",
        });
      } else {
        $(".lg-outer").removeClass("lg-zoomed");
        $image.css({
          transform: "scale3d(1, 1, 1)",
          "transform-origin": "50% 50%",
          "-webkit-transform-origin": "50% 50%",
          transition: "transform 0.15s ease-out",
        });
        $image.parent().removeAttr("style");
      }
    });

    $document.on("onBeforeSlide.lg.tm onBeforeClose.lg.tm", function () {
      var $images = $(".lg-outer .lg-image");
      $images.attr("data-scale", 1).css("transform", "scale3d(1, 1, 1)");
      $(".lg-outer").removeClass("lg-zoomed");
    });

    $document.on("onCloseAfter.lg.tm", function () {
      if (lastFocusedTrigger) {
        $(lastFocusedTrigger).trigger("focus");
        lastFocusedTrigger = null;
      }
    });
  }
})(jQuery);
