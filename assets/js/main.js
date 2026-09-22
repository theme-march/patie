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
| 9. Before & After Image Reveal
| 10. Count Up Animation
| 11. Progress Bar Animation
| 12. Accordion
| 13. Testimonial Slider
| 14. Price Range Slider
| 15. Search Toggle
| 16. Shop Search Filter
| 17. Mobile Menu Sidebar
| 18. Dashboard Sidebar
| 19. Working Process Accordion
| 20. Doctor Tooltip
| 21. Shop Details Functionality
| 22. Service Button Dash Animation
| 23. Button Blur Animation
| 24. Password Toggle (Sign In / Sign Up)
| 25. OTP Input
| 26. Sales Performance Chart
| 27. Services Doughnut Chart
| 28. Table Controls (Select All / Delete)
| 29. Image Compare Slider
| 30. Video Text Parallax
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
    handleShopSearchFilter();
    handleCategoryFilter();
    initMobileMenu();
    initDashboardSidebar();
    initCountUp();
    initProgressBars();
    beforeAndAfterReveal();
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
    doctorTooltip();
    shopDetails();
    serviceBtnDashAnimation();
    passwordToggle();
    otpInput();
    salesChart();
    servicesDoughnutChart();
    tableControls();
    initAccordions();
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

    if (typeof AOS !== "undefined") {
      AOS.init({
        once: true,
        startEvent: "aosStart",
      });
    }

    function onPreloaderDone() {
      document.body.classList.add("preloader-done");

      if (typeof AOS !== "undefined") {
        document.dispatchEvent(new Event("aosStart"));
      }

      var heroBadge = document.querySelector(".hero-grooming__badge");
      if (heroBadge) {
        setTimeout(function () {
          heroBadge.classList.add("hero-grooming__badge--visible");
        }, 700);
      }
    }

    if (!preloaderEl) {
      onPreloaderDone();
      return;
    }

    document.addEventListener("preloaderDone", onPreloaderDone, { once: true });

    var MIN_DISPLAY = 2500;

    function dismiss() {
      preloaderEl.classList.add("preloader--hidden");
      document.dispatchEvent(new CustomEvent("preloaderDone"));

      preloaderEl.addEventListener("transitionend", function handler() {
        preloaderEl.removeEventListener("transitionend", handler);
        preloaderEl.classList.add("preloader--done");
      });

      setTimeout(function () {
        preloaderEl.classList.add("preloader--done");
      }, 1000);
    }

    var elapsed = Date.now() - scriptStart;
    var remaining = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(dismiss, remaining);
  }

  /*--------------------------------------------------------------
  2. Mobile Menu
  --------------------------------------------------------------*/
  function mainNav() {
    $(".ak-nav").each(function () {
      if (!$(this).find(".ak-menu_toggle").length) {
        $(this).append(
          '<button type="button" class="ak-menu_toggle" aria-label="Open menu" aria-expanded="false">' +
            '<span aria-hidden="true"></span>' +
            "</button>",
        );
      }
    });
    $(".ak-nav .menu-item-has-children").each(function () {
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

    $(".ak-nav .menu-item-has-black-section").each(function () {
      if (!$(this).children(".ak-menu_dropdown_toggle_1").length) {
        $(this).append(
          '<button type="button" class="ak-menu_dropdown_toggle_1" aria-label="Toggle submenu" aria-expanded="false"></button>',
        );
      }
    });

    $document.on("click", ".ak-menu_dropdown_toggle_1", function () {
      var $btn = $(this);
      var $submenu = $btn.siblings("ul");
      var expanded = $btn.attr("aria-expanded") === "true";
      $btn.attr("aria-expanded", String(!expanded)).toggleClass("active");
      $submenu.stop(true, true).slideToggle();
      $btn.parent().toggleClass("active");
    });

    $document.on("click", ".ak-mode_btn", function () {
      $(this).toggleClass("active");
      $body.toggleClass("ak-dark");
    });

    $document.on("click", ".ak-icon_btn", function () {
      $(".ak-side_header").addClass("active");
    });

    $document.on("click", ".ak-close, .ak-side_header_overlay", function () {
      $(".ak-side_header").removeClass("active");
    });

    $(".ak-animo_links > li > a").each(function () {
      var splitLetters = $(this).html().split("").join("</span><span>");
      $(this).html(
        '<span class="ak-animo_text"><span>' + splitLetters + "</span></span>",
      );
    });
  }

  /*--------------------------------------------------------------
  3. Active Navigation State
  --------------------------------------------------------------*/
  function setActiveNav() {
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    var $menuItems = $(".site-header__menu-item");
    var $targetItem = null;
    var $targetSubmenuLink = null;

    $menuItems.each(function () {
      var $item = $(this);
      $item.find(".site-header__submenu-link").each(function () {
        var href = $(this).attr("href") || "";
        var linkPage = href.substring(href.lastIndexOf("/") + 1);
        if (linkPage === page) {
          $targetItem = $item;
          $targetSubmenuLink = $(this);
          return false;
        }
      });
      if ($targetItem) return false;
    });

    if (!$targetItem) {
      $menuItems.each(function () {
        var $item = $(this);
        var href = $item.find("> .site-header__menu-link").attr("href") || "";
        var linkPage = href.substring(href.lastIndexOf("/") + 1);
        if (linkPage === page) {
          $targetItem = $item;
          return false;
        }
      });
    }

    if (
      $targetItem &&
      !$targetItem.hasClass("site-header__menu-item--active")
    ) {
      $(".site-header__menu-item").removeClass(
        "site-header__menu-item--active",
      );
      $targetItem.addClass("site-header__menu-item--active");

      $body.addClass("nav-no-transition");
      setTimeout(function () {
        $body.removeClass("nav-no-transition");
      }, 50);
    }

    $(".site-header__submenu-link").removeClass(
      "site-header__submenu-link--active",
    );
    if ($targetSubmenuLink) {
      $targetSubmenuLink.addClass("site-header__submenu-link--active");
    }
  }

  /*--------------------------------------------------------------
  4. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    var $window = $(window);
    var lastScrollTop = 0;
    var $header = $(".ak-sticky_header");
    var enterThreshold = 200;
    var scrollDelta = 10;
    var $spacer = $(
      '<div class="ak-sticky-spacer" style="display: none;"></div>',
    );
    if ($header.length) {
      $header.before($spacer);
    }

    $window.scroll(function () {
      var windowTop = $window.scrollTop();
      var stickyThreshold = 50;
      if ($header.hasClass("boarding-header") && window.innerWidth > 991) {
        stickyThreshold = 40;
        enterThreshold = 200;
        scrollDelta = 10;
      }

      if (windowTop <= stickyThreshold) {
        if ($header.hasClass("ak-gescout_sticky")) {
          var $noTransStyle = $(
            '<style id="sticky-no-transition">.site-header { transition: none !important; }</style>',
          );
          $("head").append($noTransStyle);

          $header.removeClass("ak-gescout_sticky ak-gescout_show");
          $spacer.hide();

          setTimeout(function () {
            $noTransStyle.remove();
          }, 50);
        }
        lastScrollTop = windowTop;
        return;
      }

      var diff = Math.abs(windowTop - lastScrollTop);
      if (diff < scrollDelta) return;

      if (windowTop >= enterThreshold) {
        if (!$header.hasClass("ak-gescout_sticky")) {
          var isOut =
            $header.css("position") === "absolute" ||
            $header.css("position") === "fixed";
          if (!isOut) {
            $spacer.css({
              height: $header.outerHeight() + "px",
              display: "block",
              width: "100%",
            });
          }

          var $noTransStyle = $(
            '<style id="sticky-no-transition">.site-header { transition: none !important; }</style>',
          );
          $("head").append($noTransStyle);

          $header.addClass("ak-gescout_sticky");

          setTimeout(function () {
            $noTransStyle.remove();
          }, 50);
        }

        if (windowTop < lastScrollTop) {
          $header.addClass("ak-gescout_show");
        } else {
          $header.removeClass("ak-gescout_show");
        }
      }

      lastScrollTop = windowTop;
    });
  }

  /*--------------------------------------------------------------
  5. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      if (!src) return;
      $(this).css({ "background-image": "url(" + src + ")" });
    });
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
        autoplay: reduceMotion
          ? false
          : {
              delay: 6500,
              disableOnInteraction: false,
            },
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
        autoplay: reduceMotion
          ? false
          : {
              delay: 3000,
              disableOnInteraction: false,
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
    $document.on("click", ".ak-video-open", function (e) {
      e.preventDefault();

      var videoUrl = $(this).attr("href");
      if (!videoUrl || videoUrl === "#") return;

      var videoId = videoUrl.includes("?v=")
        ? videoUrl.split("?v=")[1].split("&")[0]
        : videoUrl.split("/").pop();

      if (!videoId) return;

      $(".ak-video-popup-container iframe").attr(
        "src",
        "https://www.youtube.com/embed/" + videoId,
      );
      $(".ak-video-popup").addClass("active");
      $("html").addClass("overflow-hidden");
    });

    $document.on(
      "click",
      ".ak-video-popup-close, .ak-video-popup-layer",
      function (e) {
        e.preventDefault();
        $(".ak-video-popup").removeClass("active");
        $("html").removeClass("overflow-hidden");
        $(".ak-video-popup-container iframe").attr("src", "about:blank");
      },
    );
  }

  /*--------------------------------------------------------------
  8. Scroll Up
  --------------------------------------------------------------*/
  function scrollUp() {
    $document.on("click", ".ak-scrollup", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 600);
    });
  }

  function showScrollUp() {
    var scroll = $window.scrollTop();
    if (scroll >= 350) {
      $(".ak-scrollup").addClass("ak-scrollup-show");
    } else {
      $(".ak-scrollup").removeClass("ak-scrollup-show");
    }
  }

  /*--------------------------------------------------------------
  9. Before & After Image GSAP Slide Reveal
  --------------------------------------------------------------*/
  function beforeAndAfterReveal() {
    var img = document.querySelector(".before-and-after__img");
    if (
      !img ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      reduceMotion
    )
      return;

    gsap.fromTo(
      img,
      { x: "100%", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: ".before-and-after__right-wrap",
          start: "top 80%",
          once: true,
        },
      },
    );
  }

  /*--------------------------------------------------------------
  10. Count Up Animation (GSAP + IntersectionObserver)
  --------------------------------------------------------------*/
  function initCountUp() {
    var countEls = document.querySelectorAll(".count-up");
    if (!countEls.length || typeof gsap === "undefined") return;

    countEls.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-target") || el.textContent);
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

      el.textContent = (0).toFixed(decimals);

      function runCount() {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      }

      var aosParent = el.closest("[data-aos]");
      var watchTarget = aosParent || el;

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              observer.unobserve(watchTarget);
              setTimeout(runCount, 100);
            }
          });
        },
        { threshold: 0.3 },
      );

      observer.observe(watchTarget);
    });
  }

  /*--------------------------------------------------------------
  11. Progress Bar Animation (scroll-triggered)
  --------------------------------------------------------------*/
  function initProgressBars() {
    if ($.exists(".ak-progress-bar")) {
      var bars = document.querySelectorAll(".ak-progress-bar[data-width]");
      if (!bars.length) return;

      bars.forEach(function (bar) {
        var targetWidth = bar.getAttribute("data-width");

        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                observer.unobserve(bar);
                setTimeout(function () {
                  bar.style.width = targetWidth;
                }, 150);
              }
            });
          },
          { threshold: 0.4 },
        );

        observer.observe(bar);
      });
    }
  }

  /*--------------------------------------------------------------
  12. Accordion
  --------------------------------------------------------------*/
  function initAccordions() {
    if ($.exists(".ak-accordion-title")) {
      $document.on("click", ".ak-accordion-title", function () {
        $(this).toggleClass("active");
        var $accordionTab = $(this).next(".ak-accordion-tab");
        $accordionTab.stop(true, true).slideToggle();
        $accordionTab
          .parent()
          .siblings()
          .find(".ak-accordion-tab")
          .stop(true, true)
          .slideUp()
          .prev()
          .removeClass("active");
      });
    }

    if ($.exists(".faq-accordion__header")) {
      $document.on("click", ".faq-accordion__header", function () {
        var item = $(this).closest(".faq-accordion__item");
        var body = item.find(".faq-accordion__body");
        var icon = item.find(".faq-accordion__icon i");

        if (item.hasClass("faq-accordion__item--active")) {
          item.removeClass("faq-accordion__item--active");
          body.css("height", "0");
          icon.removeClass("fa-minus").addClass("fa-plus");
        } else {
          $(".faq-accordion__item--active").each(function () {
            $(this).removeClass("faq-accordion__item--active");
            $(this).find(".faq-accordion__body").css("height", "0");
            $(this)
              .find(".faq-accordion__icon i")
              .removeClass("fa-minus")
              .addClass("fa-plus");
          });

          item.addClass("faq-accordion__item--active");
          body.css("height", body[0].scrollHeight + "px");
          icon.removeClass("fa-plus").addClass("fa-minus");
        }
      });

      $(".faq-accordion__item--active").each(function () {
        var body = $(this).find(".faq-accordion__body");
        body.css("height", body[0].scrollHeight + "px");
        $(this)
          .find(".faq-accordion__icon i")
          .removeClass("fa-plus")
          .addClass("fa-minus");
      });
    }
  }

  /*--------------------------------------------------------------
  13. Testimonial Slider
  --------------------------------------------------------------*/
  function testimonialSlider() {
    var $avatars = $(".testimonial__avatar");
    var $slides = $(".testimonial__slide-content");
    var total = $avatars.length;
    if (!total) return;

    var currentIndex = $avatars.index(
      $avatars.filter(".testimonial__avatar--center"),
    );
    if (currentIndex < 0) currentIndex = 1;

    function showSlide(index, direction) {
      var $current = $slides.filter(":visible");
      var $next = $slides.eq(index);
      if ($current.is($next)) return;

      var slideOut = direction === "next" ? "-60px" : "60px";
      var slideIn = direction === "next" ? "60px" : "-60px";

      $current.css({
        transition: "opacity 0.22s ease, transform 0.22s ease",
        opacity: 1,
        transform: "translateX(0)",
      });
      $current[0].style.transition = "opacity 0.22s ease, transform 0.22s ease";
      $current[0].style.opacity = "0";
      $current[0].style.transform = "translateX(" + slideOut + ")";

      setTimeout(function () {
        $current.hide().css({ transition: "", opacity: "", transform: "" });

        $avatars
          .removeClass("testimonial__avatar--center")
          .addClass("testimonial__avatar--side");
        $avatars
          .eq(index)
          .removeClass("testimonial__avatar--side")
          .addClass("testimonial__avatar--center");

        $next.css({
          display: "",
          opacity: "0",
          transform: "translateX(" + slideIn + ")",
          transition: "none",
        });
        $next.show();

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            $next[0].style.transition =
              "opacity 0.28s ease, transform 0.28s ease";
            $next[0].style.opacity = "1";
            $next[0].style.transform = "translateX(0)";
          });
        });
      }, 240);
    }

    $slides.hide();
    $slides.eq(currentIndex).show();

    $document.on("click", ".testimonial__nav--next", function () {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex, "next");
    });

    $document.on("click", ".testimonial__nav--prev", function () {
      currentIndex = (currentIndex - 1 + total) % total;
      showSlide(currentIndex, "prev");
    });

    $document.on("click", ".testimonial__avatar", function () {
      var newIndex = $avatars.index(this);
      if (newIndex === currentIndex) return;
      var direction = newIndex > currentIndex ? "next" : "prev";
      currentIndex = newIndex;
      showSlide(currentIndex, direction);
    });
  }

  function parentTestimonialSlider() {
    var $avatars = $(".parent-testimonial__avatar");
    var $slides = $(".parent-testimonial__slide");
    var total = $avatars.length;
    if (!total) return;

    var currentIndex = $avatars.index(
      $avatars.filter(".parent-testimonial__avatar--center"),
    );
    if (currentIndex < 0) currentIndex = 1;

    function showSlide(index, direction) {
      var $current = $slides.filter(":visible");
      var $next = $slides.eq(index);
      if ($current.is($next)) return;

      var slideOut = direction === "next" ? "-50px" : "50px";
      var slideIn = direction === "next" ? "50px" : "-50px";

      $current[0].style.transition = "opacity 0.22s ease, transform 0.22s ease";
      $current[0].style.opacity = "0";
      $current[0].style.transform = "translateX(" + slideOut + ")";

      setTimeout(function () {
        $current.hide().css({ transition: "", opacity: "", transform: "" });

        $avatars
          .removeClass("parent-testimonial__avatar--center")
          .addClass("parent-testimonial__avatar--side");
        $avatars
          .eq(index)
          .removeClass("parent-testimonial__avatar--side")
          .addClass("parent-testimonial__avatar--center");

        $next.show().css({
          opacity: "0",
          transform: "translateX(" + slideIn + ")",
          transition: "none",
        });

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            $next[0].style.transition =
              "opacity 0.28s ease, transform 0.28s ease";
            $next[0].style.opacity = "1";
            $next[0].style.transform = "translateX(0)";
          });
        });
      }, 240);
    }

    $slides.hide();
    $slides.eq(currentIndex).show();

    $document.on("click", ".parent-testimonial__nav--next", function () {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex, "next");
    });

    $document.on("click", ".parent-testimonial__nav--prev", function () {
      currentIndex = (currentIndex - 1 + total) % total;
      showSlide(currentIndex, "prev");
    });

    $document.on("click", ".parent-testimonial__avatar", function () {
      var newIndex = $avatars.index(this);
      if (newIndex === currentIndex) return;
      var direction = newIndex > currentIndex ? "next" : "prev";
      currentIndex = newIndex;
      showSlide(currentIndex, direction);
    });
  }

  function beforeAfterSlider() {
    var dots = $(".before-and-after__dot");
    var totalDots = dots.length;
    var $imgEl = $(".before-and-after__img");

    if (totalDots === 0 || $imgEl.length === 0) return;

    var currentIndex = dots.filter(".before-and-after__dot--active").index();
    if (currentIndex === -1) currentIndex = 0;

    var isAnimating = false;

    function changeSlide(newIndex, direction) {
      if (isAnimating) return;
      isAnimating = true;

      var $current = $(".before-and-after__img--current");
      var $next = $(".before-and-after__img--next");

      var newSrc = dots.eq(newIndex).data("img-src");
      if (newSrc) $next.attr("src", newSrc);

      $next.css("transition", "none");
      if (direction === "next") {
        $next
          .css("transform", "translateX(100%)")
          .removeClass("is-entering is-entering-prev");
      } else {
        $next
          .css("transform", "translateX(-100%)")
          .removeClass("is-entering is-entering-prev");
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
      if (intervalId || !isVisible) return;
      intervalId = setInterval(function () {
        var nextIndex = (currentIndex + 1) % totalDots;
        dots.removeClass("before-and-after__dot--active");
        dots.eq(nextIndex).addClass("before-and-after__dot--active");
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

    dots.on("click", function () {
      var newIndex = $(this).index();
      if (newIndex === currentIndex || isAnimating) return;

      stopAutoPlay();

      var direction = newIndex > currentIndex ? "next" : "prev";
      dots.removeClass("before-and-after__dot--active");
      $(this).addClass("before-and-after__dot--active");
      changeSlide(newIndex, direction);
      currentIndex = newIndex;

      startAutoPlay();
    });
  }

  function boardingTestimonialSlider() {
    var $prevBtn = $(".boarding-testimonial__nav-btn--prev");
    var $nextBtn = $(".boarding-testimonial__nav-btn--next");
    if (!$prevBtn.length && !$nextBtn.length) return;

    var $slides = $(".boarding-testimonial__slide");
    var total = $slides.length;
    if (!total) return;

    var currentIndex = 0;
    var animating = false;

    function showSlide(index, direction) {
      if (animating) return;
      var $current = $slides.filter(".boarding-testimonial__slide--active");
      var $next = $slides.eq(index);
      if ($current.is($next)) return;

      animating = true;

      var slideOut = direction === "next" ? "-50px" : "50px";
      var slideIn = direction === "next" ? "50px" : "-50px";

      $current.css({
        transition: "opacity 0.22s ease, transform 0.22s ease",
        opacity: "1",
        transform: "translateX(0)",
      });
      requestAnimationFrame(function () {
        $current.css({
          opacity: "0",
          transform: "translateX(" + slideOut + ")",
        });
      });

      setTimeout(function () {
        $current
          .removeClass("boarding-testimonial__slide--active")
          .css({ transition: "", opacity: "", transform: "" });

        $next.css({
          transition: "none",
          opacity: "0",
          transform: "translateX(" + slideIn + ")",
        });
        $next.addClass("boarding-testimonial__slide--active");

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            $next.css({
              transition: "opacity 0.28s ease, transform 0.28s ease",
              opacity: "1",
              transform: "translateX(0)",
            });
            setTimeout(function () {
              $next.css({ transition: "", opacity: "", transform: "" });
              animating = false;
            }, 300);
          });
        });
      }, 240);
    }

    $document.on("click", ".boarding-testimonial__nav-btn--next", function () {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex, "next");
    });

    $document.on("click", ".boarding-testimonial__nav-btn--prev", function () {
      currentIndex = (currentIndex - 1 + total) % total;
      showSlide(currentIndex, "prev");
    });
  }

  function workingProcessSlider() {
    if (!$.exists(".working-process__progress-bar")) return;

    var $slides = $(".working-process__slide-data");
    var totalSteps = $slides.length;
    if (!totalSteps) return;

    var currentIndex = 1;
    var $progress = $(".working-process__progress-bar");
    var $title = $(".working-process__slide-title");
    var $desc = $(".working-process__slide-desc");
    var $img = $(".working-process__img");
    var $badgeText = $(".working-process__badge-text");

    function updateStep(index, direction) {
      var leaveClass = direction === "next" ? "is-leaving" : "is-leaving-prev";
      var enterClass =
        direction === "next" ? "is-entering" : "is-entering-prev";

      $img
        .removeClass("is-leaving is-leaving-prev is-entering is-entering-prev")
        .addClass(leaveClass);
      $badgeText
        .removeClass("is-leaving is-leaving-prev is-entering is-entering-prev")
        .addClass(leaveClass);
      $title
        .removeClass("is-leaving is-leaving-prev is-entering is-entering-prev")
        .addClass(leaveClass);
      $desc
        .removeClass("is-leaving is-leaving-prev is-entering is-entering-prev")
        .addClass(leaveClass);

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
      }, 280);
    }

    var $navBtns = $(".working-process__nav-btn");
    if (!$navBtns.length) return;

    $navBtns.eq(1).on("click", function () {
      currentIndex = currentIndex < totalSteps ? currentIndex + 1 : 1;
      updateStep(currentIndex, "next");
    });

    $navBtns.eq(0).on("click", function () {
      currentIndex = currentIndex > 1 ? currentIndex - 1 : totalSteps;
      updateStep(currentIndex, "prev");
    });
  }

  function pricingToggle() {
    $document.on(
      "click",
      ".pricing__toggle-btn, .grooming-pricing__toggle-btn",
      function () {
        var $this = $(this);
        var isGrooming = $this.hasClass("grooming-pricing__toggle-btn");
        var btnClass = isGrooming
          ? "grooming-pricing__toggle-btn"
          : "pricing__toggle-btn";
        var sectionClass = isGrooming ? ".grooming-pricing" : ".pricing";

        if ($this.hasClass(btnClass + "--active")) return;

        $("." + btnClass)
          .removeClass(btnClass + "--active")
          .addClass(btnClass + "--inactive");
        $this
          .removeClass(btnClass + "--inactive")
          .addClass(btnClass + "--active");

        var isYearly = $this.text().trim() === "YEARLY";
        var $section = $this.closest(sectionClass);

        $section
          .find("[data-monthly][data-yearly], .grooming-pricing-card__desc")
          .fadeOut(200, function () {
            var newValue = isYearly
              ? $(this).attr("data-yearly")
              : $(this).attr("data-monthly");
            if (newValue !== undefined && newValue !== false) {
              $(this).text(newValue).fadeIn(200);
            } else {
              $(this).fadeIn(200);
            }
          });

        $section
          .find(".pricing-card__period, .grooming-pricing-card__period")
          .not("[data-monthly]")
          .fadeOut(200, function () {
            var newPeriod = isYearly ? "/ Per Year" : "/ Per Month";
            $(this).text(newPeriod).fadeIn(200);
          });
      },
    );
  }

  /*--------------------------------------------------------------
  14. Price Range Slider
  --------------------------------------------------------------*/
  function priceRangeSlider() {
    if (!$.exists(".sidebar__filter-slider")) return;

    var $slider = $(".sidebar__filter-slider");
    var $track = $(".sidebar__filter-track");
    var $startBullet = $(".sidebar__filter-bullet--start");
    var $endBullet = $(".sidebar__filter-bullet--end");
    var $priceText = $(".sidebar__filter-price");

    var isDragging = null;

    function updateSlider(bullet, clientX) {
      var sliderRect = $slider[0].getBoundingClientRect();
      var percent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
      percent = Math.min(Math.max(percent, 0), 100);

      var startPercent = parseFloat($startBullet[0].style.left) || 10;
      var endPercent = 100 - (parseFloat($endBullet[0].style.right) || 20);

      if (bullet === "start") {
        if (percent < endPercent - 5) {
          $startBullet.css("left", percent + "%");
          $track.css("left", percent + "%");
          startPercent = percent;
        }
      } else {
        if (percent > startPercent + 5) {
          $endBullet.css("right", 100 - percent + "%");
          $track.css("right", 100 - percent + "%");
          endPercent = percent;
        }
      }

      $priceText.text(
        "Price : " +
          Math.round(startPercent * 2) +
          "$ - " +
          Math.round(endPercent * 2) +
          "$",
      );
    }

    $document.on("pointerdown", ".sidebar__filter-bullet", function (e) {
      isDragging = $(this).hasClass("sidebar__filter-bullet--start")
        ? "start"
        : "end";
      e.currentTarget.setPointerCapture(e.originalEvent.pointerId);
      $body.addClass("user-select-none");
      e.preventDefault();
    });

    $document.on("pointermove", function (e) {
      if (isDragging) {
        updateSlider(isDragging, e.originalEvent.clientX);
      }
    });

    $document.on("pointerup pointercancel", function () {
      if (isDragging) {
        isDragging = null;
        $body.removeClass("user-select-none");
      }
    });

    $document.on("keydown", ".sidebar__filter-bullet", function (e) {
      var bullet = $(this).hasClass("sidebar__filter-bullet--start")
        ? "start"
        : "end";
      var sliderRect = $slider[0].getBoundingClientRect();
      var step = sliderRect.width * 0.05;

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        var current = $(this)[0].getBoundingClientRect().left;
        updateSlider(bullet, current - step);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        var current = $(this)[0].getBoundingClientRect().left;
        updateSlider(bullet, current + step);
      }
    });
  }

  /*--------------------------------------------------------------
  15. Search Toggle
  --------------------------------------------------------------*/
  function initSearch() {
    var $searchBtn = $(".site-header__search-btn");
    var $searchContainer = $(".site-header__search-container");
    if (!$searchBtn.length || !$searchContainer.length) return;

    var $input = $searchContainer.find(".site-header__search-input");

    $searchBtn.on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      $searchContainer.toggleClass("site-header__search-container--active");

      if ($searchContainer.hasClass("site-header__search-container--active")) {
        $input.focus();
      } else {
        var query = $input.val().trim();
        if (query) {
          window.location.href =
            "shop.html?search=" + encodeURIComponent(query);
        }
      }
    });

    $searchContainer.on("click", function (e) {
      e.stopPropagation();
    });

    $input.on("keydown", function (e) {
      if (e.key === "Enter") {
        var query = $(this).val().trim();
        if (query) {
          window.location.href =
            "shop.html?search=" + encodeURIComponent(query);
        } else {
          $searchContainer.removeClass("site-header__search-container--active");
        }
      }
    });

    $document.on("click.searchClose", function () {
      $searchContainer.removeClass("site-header__search-container--active");
    });

    $document.on("keydown.searchEsc", function (e) {
      if (e.key === "Escape") {
        $searchContainer.removeClass("site-header__search-container--active");
        $input.blur();
      }
    });
  }

  /*--------------------------------------------------------------
  16. Shop Search Filter
  --------------------------------------------------------------*/
  function handleShopSearchFilter() {
    if (!$(".product-card").length) return;

    var urlParams = new URLSearchParams(window.location.search);
    var searchQuery = urlParams.get("search");
    if (!searchQuery) return;

    var query = searchQuery.trim().toLowerCase();
    var $products = $(".product-card");
    var matchCount = 0;

    $products.each(function () {
      var $card = $(this);
      var title = $card.find(".product-card__title").text().toLowerCase();

      if (title.indexOf(query) !== -1) {
        $card.show();
        matchCount++;
      } else {
        $card.hide();
      }
    });

    var $resultLabel = $(".shop__result-count");
    if ($resultLabel.length) {
      $resultLabel.text(
        "|| Showing " + matchCount + ' result(s) for "' + searchQuery + '"',
      );
    }
  }

  function handleCategoryFilter() {
    $document.on("click", ".sidebar__category-item", function () {
      var $list = $(this).closest(".sidebar__category-list");
      $list
        .find(".sidebar__category-item")
        .removeClass("sidebar__category-item--active");
      $(this).addClass("sidebar__category-item--active");
    });
  }

  /*--------------------------------------------------------------
  17. Mobile Menu Sidebar
  --------------------------------------------------------------*/
  function initMobileMenu() {
    if ($(".site-header").length === 0) return;
    if ($(".mobile-sidebar").length > 0) return;

    var logoSrc = $(".site-header__logo-img").attr("src") || "";
    var logoAlt = $(".site-header__logo-img").attr("alt") || "Patie Logo";

    var sidebarHtml =
      '<div class="mobile-sidebar">' +
      '<div class="mobile-sidebar__header">' +
      '<div class="mobile-sidebar__logo">' +
      '<a href="index.html" class="mobile-sidebar__logo-link">' +
      '<img src="' +
      logoSrc +
      '" alt="' +
      logoAlt +
      '" class="mobile-sidebar__logo-img">' +
      "</a>" +
      "</div>" +
      '<button class="mobile-sidebar__close-btn" aria-label="Close menu">' +
      '<i class="fas fa-times"></i>' +
      "</button>" +
      "</div>" +
      '<div class="mobile-sidebar__content">' +
      '<div class="mobile-sidebar__nav-wrapper"></div>' +
      "</div>" +
      "</div>" +
      '<div class="mobile-sidebar-overlay"></div>';

    $body.append(sidebarHtml);

    var $clonedMenu = $(".site-header__menu").clone();
    $clonedMenu.removeClass("site-header__menu").addClass("mobile-menu");
    $clonedMenu
      .find(
        ".ak-menu_dropdown_toggle, .ak-menu_dropdown_toggle_1, .ak-menu_toggle",
      )
      .remove();

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
            "</button>",
        );
      }
    });

    $(".mobile-sidebar__nav-wrapper").append($clonedMenu);

    $(".site-header__menu-item").each(function (index) {
      if ($(this).hasClass("site-header__menu-item--active")) {
        var $mobileItem = $(".mobile-menu__item").eq(index);
        $mobileItem.addClass("mobile-menu__item--active");
        $mobileItem
          .find("> .mobile-menu__link")
          .addClass("mobile-menu__link--active");
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

    $document.on("click", ".site-header__mobile-btn", function (e) {
      e.preventDefault();
      e.stopPropagation();
      $(".mobile-sidebar").addClass("mobile-sidebar--open");
      $(".mobile-sidebar-overlay").addClass("mobile-sidebar-overlay--open");
      $body.addClass("overflow-hidden");
      setTimeout(function () {
        $(".mobile-sidebar__close-btn").trigger("focus");
      }, 50);
    });

    $document.on(
      "click",
      ".mobile-sidebar__close-btn, .mobile-sidebar-overlay",
      function (e) {
        e.preventDefault();
        $(".mobile-sidebar").removeClass("mobile-sidebar--open");
        $(".mobile-sidebar-overlay").removeClass(
          "mobile-sidebar-overlay--open",
        );
        $body.removeClass("overflow-hidden");
      },
    );

    $document.on("keydown.mobileSidebar", function (e) {
      if (
        e.key === "Escape" &&
        $(".mobile-sidebar").hasClass("mobile-sidebar--open")
      ) {
        $(".mobile-sidebar").removeClass("mobile-sidebar--open");
        $(".mobile-sidebar-overlay").removeClass(
          "mobile-sidebar-overlay--open",
        );
        $body.removeClass("overflow-hidden");
        $(".site-header__mobile-btn").trigger("focus");
      }
    });

    $document.on("click", ".mobile-menu__toggle-btn", function (e) {
      e.preventDefault();
      var $btn = $(this);
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
    });
  }

  /*--------------------------------------------------------------
  18. Dashboard Sidebar
  --------------------------------------------------------------*/
  function initDashboardSidebar() {
    var $toggle = $("#sidebarToggle");
    var $sidebar = $("#dashboardSidebar");
    var $overlay = $("#sidebarOverlay");
    var $close = $("#sidebarClose");

    if (!$toggle.length || !$sidebar.length) return;

    function openSidebar() {
      $sidebar.addClass("is-open");
      $overlay.addClass("is-visible");
      $toggle.attr("aria-expanded", "true");
      $body.css("overflow", "hidden");
    }

    function closeSidebar() {
      $sidebar.removeClass("is-open");
      $overlay.removeClass("is-visible");
      $toggle.attr("aria-expanded", "false");
      $body.css("overflow", "");

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

    $toggle.on("click", function (e) {
      e.stopPropagation();
      if ($sidebar.hasClass("is-open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    $overlay.on("click", closeSidebar);

    $close.on("click", function () {
      closeSidebar();
      $toggle.trigger("focus");
    });

    $document.on("keydown.dashboardSidebar", function (e) {
      if (e.key === "Escape" && $sidebar.hasClass("is-open")) {
        closeSidebar();
        $toggle.trigger("focus");
      }
    });

    $window.on("resize.dashboardSidebar", function () {
      if (window.innerWidth > 992) {
        closeSidebar();
      }
    });
  }

  /*--------------------------------------------------------------
  19. Working Process Accordion
  --------------------------------------------------------------*/
  function workingProcessAccordion() {
    if (!$.exists(".working-process__item")) return;

    var items = document.querySelectorAll(".working-process__item");

    function openItem(item) {
      var content = item.querySelector(".working-process__content");
      if (!content) return;

      item.classList.add("active");
      content.style.height = "0px";

      requestAnimationFrame(function () {
        content.style.height = content.scrollHeight + "px";
      });

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
      if (!content) return;

      content.style.height = content.scrollHeight + "px";

      requestAnimationFrame(function () {
        content.style.height = "0px";
      });

      item.classList.remove("active");
    }

    items.forEach(function (item) {
      var content = item.querySelector(".working-process__content");
      if (!content) return;
      content.style.height = item.classList.contains("active") ? "auto" : "0px";
    });

    $document.on("click", ".working-process__toggle", function () {
      var item = this.closest(".working-process__item");
      if (!item) return;

      var isActive = item.classList.contains("active");

      items.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          closeItem(otherItem);
        }
      });

      if (isActive) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  }

  /*--------------------------------------------------------------
  20. Doctor Tooltip
  --------------------------------------------------------------*/
  function doctorTooltip() {
    var tooltip = document.getElementById("doctorTooltip");
    if (!tooltip) return;

    var hideTimer = null;
    var rafId = null;

    function showTooltip(item) {
      var rect = item.getBoundingClientRect();

      tooltip.querySelector("img").src =
        item.dataset.img || "assets/img/avatars/doctor-toolt.png";
      tooltip.querySelector(".doctor-tooltip__name").textContent =
        item.dataset.name || "";
      tooltip.querySelector(".doctor-tooltip__deg").textContent =
        item.dataset.deg || "";

      tooltip.style.left = "-9999px";
      tooltip.style.top = "-9999px";
      tooltip.classList.add("doctor-tooltip--active");

      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(function () {
        var tooltipHeight = tooltip.offsetHeight;
        var left = rect.left + rect.width / 2 + window.scrollX;
        var top = rect.top + window.scrollY - tooltipHeight - 12;

        if (top < window.scrollY) {
          top = rect.bottom + window.scrollY + 12;
          tooltip.classList.add("doctor-tooltip--bottom");
        } else {
          tooltip.classList.remove("doctor-tooltip--bottom");
        }

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
      });
    }

    function hideTooltip() {
      tooltip.classList.remove("doctor-tooltip--active");
    }

    document.querySelectorAll(".cs-item").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        clearTimeout(hideTimer);
        showTooltip(item);
      });

      item.addEventListener("mouseleave", function () {
        hideTimer = setTimeout(function () {
          if (!tooltip.matches(":hover")) {
            hideTooltip();
          }
        }, 120);
      });
    });

    tooltip.addEventListener("mouseenter", function () {
      clearTimeout(hideTimer);
    });

    tooltip.addEventListener("mouseleave", function () {
      hideTooltip();
    });
  }

  /*--------------------------------------------------------------
  21. Shop Details Functionality
  --------------------------------------------------------------*/
  function shopDetails() {
    var colorBtns = document.querySelectorAll(
      ".shop-details__color-picker-btn",
    );
    if (colorBtns.length > 0) {
      colorBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          colorBtns.forEach(function (b) {
            b.classList.remove("shop-details__color-picker-btn--active");
          });
          btn.classList.add("shop-details__color-picker-btn--active");
        });
      });
    }

    var thumbItems = document.querySelectorAll(".shop-details__thumb-item");
    var mainImg = document.querySelector(".shop-details__main-img");
    if (thumbItems.length > 0 && mainImg) {
      thumbItems.forEach(function (item) {
        item.addEventListener("click", function () {
          var newSrc = item.querySelector("img").src;
          mainImg.src = newSrc;
          thumbItems.forEach(function (i) {
            i.classList.remove("shop-details__thumb-item--active");
          });
          item.classList.add("shop-details__thumb-item--active");
        });
      });
    }

    var quantityGroups = document.querySelectorAll(
      ".shop-details__quantity, .cart__quantity",
    );
    var updateBtn = document.querySelector(".cart__update-btn");
    var originalValues = new Map();

    quantityGroups.forEach(function (group) {
      var input = group.querySelector("input");
      if (input && group.closest(".cart__quantity")) {
        originalValues.set(input, parseInt(input.value));
      }
    });

    function syncUpdateBtn() {
      if (!updateBtn) return;
      var hasChange = Array.from(originalValues.entries()).some(
        function (entry) {
          return parseInt(entry[0].value) !== entry[1];
        },
      );
      if (hasChange) {
        updateBtn.classList.add("cart__update-btn--active");
      } else {
        updateBtn.classList.remove("cart__update-btn--active");
      }
    }

    quantityGroups.forEach(function (group) {
      var input = group.querySelector("input");
      var up = group.querySelector(
        ".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type",
      );
      var down = group.querySelector(
        ".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type",
      );

      if (input && up && down) {
        up.addEventListener("click", function (e) {
          e.preventDefault();
          input.value = parseInt(input.value) + 1;
          syncUpdateBtn();
        });

        down.addEventListener("click", function (e) {
          e.preventDefault();
          var val = parseInt(input.value);
          if (val > 1) {
            input.value = val - 1;
          }
          syncUpdateBtn();
        });
      }
    });

    var removeBtns = document.querySelectorAll(".cart__remove");
    removeBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var row = btn.closest("tr");
        if (row) {
          row.style.transition = "all 0.3s ease";
          row.style.opacity = "0";
          setTimeout(function () {
            row.remove();
          }, 300);
        }
      });
    });
  }

  /*--------------------------------------------------------------
  22. Service Button Dash Animation
  --------------------------------------------------------------*/
  function serviceBtnDashAnimation() {
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
      circle.style.strokeDashoffset =
        current - (s.currentSpeed * elapsed) / 1000;
      s.rafId = requestAnimationFrame(function (ts) {
        decelLoop(circle, ts);
      });
    }

    document.addEventListener(
      "mouseenter",
      function (e) {
        if (!(e.target instanceof Element)) return;
        var btn = e.target.closest(".service-btn");
        if (!btn) return;
        var circle = btn.querySelector(".service-btn__dashed-circle circle");
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
      },
      true,
    );

    document.addEventListener(
      "mouseleave",
      function (e) {
        if (!(e.target instanceof Element)) return;
        var btn = e.target.closest(".service-btn");
        if (!btn) return;
        var circle = btn.querySelector(".service-btn__dashed-circle circle");
        if (!circle) return;

        var s = getState(circle);
        s.isHovered = false;

        var offset = parseFloat(getComputedStyle(circle).strokeDashoffset) || 0;
        circle.style.animation = "none";
        circle.style.strokeDashoffset = offset;

        s.currentSpeed = FAST_SPEED;
        s.lastTime = null;
        s.rafId = requestAnimationFrame(function (ts) {
          decelLoop(circle, ts);
        });
      },
      true,
    );
  }

  /*--------------------------------------------------------------
  23. Button Blur Animation
  --------------------------------------------------------------*/
  function buttonBlurAnimation() {
    if (!$.exists("[data-tp-btn]")) return;

    document.querySelectorAll("[data-tp-btn]").forEach(function (btn, index) {
      var filter = btn.querySelector("filter");
      var filterTarget = btn.querySelector(".tp-btn__filter");

      if (!filter || !filterTarget) return;

      var blur = filter.querySelector("feGaussianBlur");
      if (!blur) return;

      var filterId = "buttonFilter-" + index;
      filter.setAttribute("id", filterId);
      filterTarget.style.filter = "url(#" + filterId + ")";

      var state = { value: 0, target: 0, rafId: null };

      function animate() {
        state.value += (state.target - state.value) * 0.15;
        blur.setAttribute("stdDeviation", state.value.toFixed(2));

        if (Math.abs(state.target - state.value) < 0.01) {
          state.value = state.target;
          blur.setAttribute("stdDeviation", state.value.toFixed(2));
          state.rafId = null;
          return;
        }

        state.rafId = requestAnimationFrame(animate);
      }

      function startBlur(target) {
        state.target = target;
        if (!state.rafId) {
          state.rafId = requestAnimationFrame(animate);
        }
      }

      btn.addEventListener("mouseenter", function () {
        startBlur(5);
      });
      btn.addEventListener("mouseleave", function () {
        startBlur(0);
      });
    });
  }

  /*--------------------------------------------------------------
  24. Password Toggle (Sign In / Sign Up)
  --------------------------------------------------------------*/
  function passwordToggle() {
    $document.on("click", ".sign-in__eye-toggle", function () {
      var $btn = $(this);
      var $input = $("#" + $btn.data("target"));
      var $icon = $btn.find("i");
      if (!$input.length) return;

      if ($input.attr("type") === "password") {
        $input.attr("type", "text");
        if ($icon.hasClass("fa-lock")) {
          $icon.removeClass("fa-lock").addClass("fa-lock-open");
        } else if ($icon.hasClass("fa-eye")) {
          $icon.removeClass("fa-eye").addClass("fa-eye-slash");
        }
        $btn.attr("aria-label", "Hide password");
      } else {
        $input.attr("type", "password");
        if ($icon.hasClass("fa-lock-open")) {
          $icon.removeClass("fa-lock-open").addClass("fa-lock");
        } else if ($icon.hasClass("fa-eye-slash")) {
          $icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
        $btn.attr("aria-label", "Show password");
      }
    });

    $document.on("click", ".sign-up__eye-toggle", function () {
      var $btn = $(this);
      var $input = $("#" + $btn.data("target"));
      var $icon = $btn.find("i");
      if (!$input.length) return;

      if ($input.attr("type") === "password") {
        $input.attr("type", "text");
        $icon.removeClass("fa-lock").addClass("fa-lock-open");
        $btn.attr("aria-label", "Hide password");
      } else {
        $input.attr("type", "password");
        $icon.removeClass("fa-lock-open").addClass("fa-lock");
        $btn.attr("aria-label", "Show password");
      }
    });
  }

  /*--------------------------------------------------------------
  25. OTP Input
  --------------------------------------------------------------*/
  function otpInput() {
    var $inputs = $(".password-reset__otp-input");
    if (!$inputs.length) return;

    $inputs.on("input", function () {
      var $this = $(this);
      var index = $inputs.index($this);
      $this.val($this.val().replace(/[^0-9]/g, ""));
      if ($this.val().length === 1) {
        $this.addClass("is-filled");
        if (index < $inputs.length - 1) {
          $inputs.eq(index + 1).trigger("focus");
        }
      } else {
        $this.removeClass("is-filled");
      }
    });

    $inputs.on("keydown", function (e) {
      var $this = $(this);
      var index = $inputs.index($this);
      if (e.key === "Backspace" && $this.val() === "" && index > 0) {
        $inputs.eq(index - 1).trigger("focus");
      }
    });

    $inputs.on("paste", function (e) {
      e.preventDefault();
      var $this = $(this);
      var index = $inputs.index($this);
      var pasted = (e.originalEvent.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, $inputs.length - index);
      $.each(pasted.split(""), function (i, char) {
        if ($inputs.eq(index + i).length) {
          $inputs
            .eq(index + i)
            .val(char)
            .addClass("is-filled");
        }
      });
      var nextEmpty = index + pasted.length;
      if ($inputs.eq(nextEmpty).length) {
        $inputs.eq(nextEmpty).trigger("focus");
      }
    });
  }

  /*--------------------------------------------------------------
  26. Sales Performance Chart
  --------------------------------------------------------------*/
  function salesChart() {
    var salesChartEl = document.getElementById("salesChart");
    if (!salesChartEl || typeof Chart === "undefined") return;

    var rs = getComputedStyle(document.documentElement);
    var primaryColor = rs.getPropertyValue("--primary-color").trim();
    var secondaryColor = rs.getPropertyValue("--secondary-color").trim();
    var whiteColor = rs.getPropertyValue("--white-color").trim();
    var bodyColor = rs.getPropertyValue("--body-color").trim();
    var headingColor = rs.getPropertyValue("--heading-color").trim();

    function hexToRgba(hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    }

    var ctx = salesChartEl.getContext("2d");
    var ds = salesChartEl.dataset;
    var months = ds.labels.split(",");
    var data2021 = ds["2021"].split(",").map(Number);
    var data2020 = ds["2020"].split(",").map(Number);

    var verticalLinePlugin = {
      id: "verticalLine",
      afterDraw: function (chart) {
        var active = chart.getActiveElements();
        if (!active || !active.length) return;
        var ctx2 = chart.ctx,
          x = active[0].element.x;
        ctx2.save();
        ctx2.beginPath();
        ctx2.moveTo(x, chart.scales.y.top);
        ctx2.lineTo(x, chart.scales.y.bottom);
        ctx2.lineWidth = 1.5;
        ctx2.strokeStyle = hexToRgba(primaryColor, 0.4);
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
            label: "2021",
            data: data2021,
            borderColor: primaryColor,
            backgroundColor: hexToRgba(primaryColor, 0.08),
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
            label: "2020",
            data: data2020,
            borderColor: secondaryColor,
            backgroundColor: hexToRgba(secondaryColor, 0.05),
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
                return "$" + (c.raw / 1000).toFixed(0) + "K";
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: bodyColor, font: { size: 12, family: "Poppins" } },
            border: { display: false },
          },
          y: {
            min: 10000,
            max: 100000,
            ticks: {
              color: bodyColor,
              font: { size: 11, family: "Poppins" },
              callback: function (v) {
                return v / 1000 + "K";
              },
              stepSize: 20000,
            },
            grid: { color: hexToRgba(headingColor, 0.05) },
            border: { display: false },
          },
        },
      },
    });
  }

  /*--------------------------------------------------------------
  27. Services Doughnut Chart
  --------------------------------------------------------------*/
  function servicesDoughnutChart() {
    var servicesChartEl = document.getElementById("servicesChart");
    if (
      !servicesChartEl ||
      typeof Chart === "undefined" ||
      typeof ChartDataLabels === "undefined"
    )
      return;

    var rs = getComputedStyle(document.documentElement);
    var primaryColor = rs.getPropertyValue("--primary-color").trim();
    var whiteColor = rs.getPropertyValue("--white-color").trim();

    var ctx = servicesChartEl.getContext("2d");
    var ds = servicesChartEl.dataset;
    var sliceLabels = ds.labels.split(",");
    var sliceData = ds.values.split(",").map(Number);
    var sliceColors = ds.colors.split(",").map(function (c) {
      var v = c.trim();
      return v.startsWith("var(")
        ? rs.getPropertyValue(v.slice(4, -1).trim()).trim()
        : v;
    });

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
        cutout: "65%",
        layout: { padding: { top: 30, bottom: 30, left: 95, right: 75 } },
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
              return sliceColors[ctx2.dataIndex];
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

  /*--------------------------------------------------------------
  28. Table Controls (Select All / Delete)
  --------------------------------------------------------------*/
  function tableControls() {
    function initTableControls(selectAllId, tbodyId) {
      var selectAll = document.getElementById(selectAllId);
      var tbody = document.getElementById(tbodyId);
      if (!selectAll || !tbody) return;

      selectAll.addEventListener("change", function () {
        tbody
          .querySelectorAll(".lead-table__checkbox, .order-table__checkbox")
          .forEach(function (cb) {
            cb.checked = selectAll.checked;
          });
      });

      tbody.addEventListener("change", function (e) {
        var isRowCb =
          e.target.classList.contains("lead-table__checkbox") ||
          e.target.classList.contains("order-table__checkbox");
        if (!isRowCb) return;

        var all = tbody.querySelectorAll(
          ".lead-table__checkbox, .order-table__checkbox",
        );
        var checked = tbody.querySelectorAll(
          ".lead-table__checkbox:checked, .order-table__checkbox:checked",
        );

        selectAll.checked = checked.length === all.length;
        selectAll.indeterminate =
          checked.length > 0 && checked.length < all.length;
      });

      tbody.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-row-delete]");
        if (!btn) return;
        e.preventDefault();

        var row = btn.closest("tr");
        if (!row) return;

        row.style.transition = "opacity 0.25s ease";
        row.style.opacity = "0";

        setTimeout(function () {
          row.remove();

          var all = tbody.querySelectorAll(
            ".lead-table__checkbox, .order-table__checkbox",
          );
          var checked = tbody.querySelectorAll(
            ".lead-table__checkbox:checked, .order-table__checkbox:checked",
          );

          selectAll.checked = all.length > 0 && checked.length === all.length;
          selectAll.indeterminate =
            checked.length > 0 && checked.length < all.length;
        }, 250);
      });
    }

    initTableControls("lead-select-all", "lead-table-body");
    initTableControls("order-select-all", "order-table-body");
  }

  /*--------------------------------------------------------------
  29. Image Compare Slider
  --------------------------------------------------------------*/
  function imageCompare() {
    var compareEl = document.querySelector(".tp-compare");
    if (!compareEl) return;

    var range = compareEl.querySelector(".tp-compare__range");
    if (!range) return;

    range.addEventListener("input", function (e) {
      compareEl.style.setProperty("--pos", e.target.value + "%");
    });
  }

  /*--------------------------------------------------------------
  30. Video Text Parallax (GSAP)
  --------------------------------------------------------------*/
  function videoTextParallax() {
    var el = document.querySelector(".video-section__bg-text");
    if (
      !el ||
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      reduceMotion
    )
      return;

    gsap.to(el, {
      y: 80,
      ease: "none",
      scrollTrigger: {
        trigger: ".video-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }
})(jQuery);
