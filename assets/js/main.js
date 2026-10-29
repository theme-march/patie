(function ($) {
  ("use strict");

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
| 14. Shop Page Filter
| 15. Search Toggle
| 16. Shop Search Filter
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
| 29. Video Text Parallax
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
    handleShopSort();
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
          '<span class="ak-animo_text"><span>' +
            splitLetters +
            "</span></span>",
        );
      });
    }
  }

  /*--------------------------------------------------------------
  3. Active Navigation State
  --------------------------------------------------------------*/
  function setActiveNav() {
    if ($.exists(".site-header__menu-item")) {
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
  }

  /*--------------------------------------------------------------
  4. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    if ($.exists(".ak-sticky_header")) {
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
  }

  /*--------------------------------------------------------------
  5. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    if ($.exists("[data-src]")) {
      $("[data-src]")
        .not(".shop-details__main-img-wrap")
        .each(function () {
          var src = $(this).attr("data-src");
          if (!src) return;
          $(this).css({ "background-image": "url(" + src + ")" });
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
    if ($.exists(".ak-video-open")) {
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

      $document.on("keydown.videoPopup", function (e) {
        if (e.key === "Escape" && $(".ak-video-popup").hasClass("active")) {
          $(".ak-video-popup").removeClass("active");
          $("html").removeClass("overflow-hidden");
          $(".ak-video-popup-container iframe").attr("src", "about:blank");
        }
      });
    }
  }

  /*--------------------------------------------------------------
  8. Scroll Up
  --------------------------------------------------------------*/
  function scrollUp() {
    if ($.exists(".ak-scrollup")) {
      $document.on("click", ".ak-scrollup", function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 600);
      });
    }
  }

  function showScrollUp() {
    if ($.exists(".ak-scrollup")) {
      var scroll = $window.scrollTop();
      if (scroll >= 350) {
        $(".ak-scrollup").addClass("ak-scrollup-show");
      } else {
        $(".ak-scrollup").removeClass("ak-scrollup-show");
      }
    }
  }

  /*--------------------------------------------------------------
  9. Before & After Image GSAP Slide Reveal
  --------------------------------------------------------------*/
  function beforeAndAfterReveal() {
    if ($.exists(".before-and-after__img")) {
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
  }

  /*--------------------------------------------------------------
  10. Count Up Animation (GSAP + IntersectionObserver)
  --------------------------------------------------------------*/
  function initCountUp() {
    if ($.exists(".count-up")) {
      var countEls = document.querySelectorAll(".count-up");
      if (!countEls.length || typeof gsap === "undefined") return;

      countEls.forEach(function (el) {
        var target = parseFloat(
          el.getAttribute("data-target") || el.textContent,
        );
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
    if ($.exists(".testimonial__avatar")) {
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
        $current[0].style.transition =
          "opacity 0.22s ease, transform 0.22s ease";
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
  }

  function parentTestimonialSlider() {
    if ($.exists(".parent-testimonial")) {
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

        $current[0].style.transition =
          "opacity 0.22s ease, transform 0.22s ease";
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
  }

  function beforeAfterSlider() {
    if ($.exists(".before-and-after__dot")) {
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
  }

  function boardingTestimonialSlider() {
    if (
      $.exists(
        ".boarding-testimonial__nav-btn--prev, .boarding-testimonial__nav-btn--next",
      )
    ) {
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

        var $currentContent = $current.find("> *:not(.boarding-testimonial__user), .boarding-testimonial__user-info");
        var $nextContent = $next.find("> *:not(.boarding-testimonial__user), .boarding-testimonial__user-info");

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
          $current
            .removeClass("boarding-testimonial__slide--active");
          $currentContent.css({ transition: "", opacity: "", transform: "" });

          $nextContent.css({
            transition: "none",
            opacity: "0",
            transform: "translateX(" + slideIn + ")",
          });
          $next.addClass("boarding-testimonial__slide--active");

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              $nextContent.css({
                transition: "opacity 0.28s ease, transform 0.28s ease",
                opacity: "1",
                transform: "translateX(0)",
              });
              setTimeout(function () {
                $nextContent.css({ transition: "", opacity: "", transform: "" });
                animating = false;
              }, 300);
            });
          });
        }, 240);
      }

      $document.on(
        "click",
        ".boarding-testimonial__nav-btn--next",
        function () {
          currentIndex = (currentIndex + 1) % total;
          showSlide(currentIndex, "next");
        },
      );

      $document.on(
        "click",
        ".boarding-testimonial__nav-btn--prev",
        function () {
          currentIndex = (currentIndex - 1 + total) % total;
          showSlide(currentIndex, "prev");
        },
      );
    }
  }

  function workingProcessSlider() {
    if ($.exists(".working-process__progress-bar")) {
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
        var leaveClass =
          direction === "next" ? "is-leaving" : "is-leaving-prev";
        var enterClass =
          direction === "next" ? "is-entering" : "is-entering-prev";

        $img
          .removeClass(
            "is-leaving is-leaving-prev is-entering is-entering-prev",
          )
          .addClass(leaveClass);
        $badgeText
          .removeClass(
            "is-leaving is-leaving-prev is-entering is-entering-prev",
          )
          .addClass(leaveClass);
        $title
          .removeClass(
            "is-leaving is-leaving-prev is-entering is-entering-prev",
          )
          .addClass(leaveClass);
        $desc
          .removeClass(
            "is-leaving is-leaving-prev is-entering is-entering-prev",
          )
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
  }

  function pricingToggle() {
    if ($.exists(".pricing__toggle-btn, .grooming-pricing__toggle-btn")) {
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
  }

  /*--------------------------------------------------------------
  14. Shop Page Filter
  --------------------------------------------------------------*/
  function priceRangeSlider() {
    if ($.exists(".sidebar__filter-slider")) {
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
            ) ||
            0
          );
        })
        .get()
        .filter(function (val) {
          return val > 0;
        });

      var minPrice = productPrices.length
        ? Math.floor(Math.min.apply(null, productPrices))
        : 0;
      var maxPrice = productPrices.length
        ? Math.ceil(Math.max.apply(null, productPrices))
        : 300;

      if (maxPrice <= minPrice) {
        maxPrice = minPrice + 100;
      }

      var currentMin = minPrice;
      var currentMax = maxPrice;

      $startBullet.css("left", "0%");
      $endBullet.css("right", "0%");
      $track.css({
        left: "0%",
        right: "0%",
      });
      $priceText.text("Price : " + currentMin + "$ - " + currentMax + "$");

      var isDragging = null;

      function updateSlider(bullet, clientX) {
        var sliderRect = $slider[0].getBoundingClientRect();
        if (!sliderRect.width) return;
        var percent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
        percent = Math.min(Math.max(percent, 0), 100);

        var startPercent = parseFloat($startBullet[0].style.left) || 0;
        var endPercent = 100 - (parseFloat($endBullet[0].style.right) || 0);

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

        var priceRange = maxPrice - minPrice;
        currentMin = Math.round(minPrice + (startPercent / 100) * priceRange);
        currentMax = Math.round(minPrice + (endPercent / 100) * priceRange);

        $priceText.text("Price : " + currentMin + "$ - " + currentMax + "$");
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

      $document.on("click", ".sidebar__filter-btn", function (e) {
        e.preventDefault();
        if (typeof window.applyShopFilters === "function") {
          window.applyShopFilters(currentMin, currentMax);
        }
      });

      $document.on("click", ".sidebar__filter-clear", function (e) {
        e.preventDefault();
        currentMin = minPrice;
        currentMax = maxPrice;
        $startBullet.css("left", "0%");
        $endBullet.css("right", "0%");
        $track.css({ left: "0%", right: "0%" });
        $priceText.text("Price : " + minPrice + "$ - " + maxPrice + "$");

        $(".sidebar__category-item").removeClass(
          "sidebar__category-item--active",
        );
        $(".sidebar__category-item[data-category='all']").addClass(
          "sidebar__category-item--active",
        );

        if (typeof window.applyShopFilters === "function") {
          window.applyShopFilters(minPrice, maxPrice);
        }

        var message = $(this).data("success-message");
        if (message && typeof toastr !== "undefined") {
          toastr.info(message);
        }
      });
    }
  }

  /*--------------------------------------------------------------
  15. Search Toggle
  --------------------------------------------------------------*/
  function initSearch() {
    if ($.exists(".site-header__search-btn")) {
      var $searchBtn = $(".site-header__search-btn");
      var $searchContainer = $(".site-header__search-container");
      if (!$searchBtn.length || !$searchContainer.length) return;

      var $input = $searchContainer.find(".site-header__search-input");

      $searchBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        $searchContainer.toggleClass("site-header__search-container--active");

        if (
          $searchContainer.hasClass("site-header__search-container--active")
        ) {
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
            $searchContainer.removeClass(
              "site-header__search-container--active",
            );
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
  }

  /*--------------------------------------------------------------
  16. Shop Search Filter
  --------------------------------------------------------------*/
  function handleShopSearchFilter() {
    if ($.exists(".product-card")) {
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
  }

  window.applyShopFilters = function (minPrice, maxPrice) {
    if (!$.exists(".product-card")) return;

    var $cards = $(".product-card");
    var activeCategory =
      $(".sidebar__category-item--active").data("category") || "all";

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
      var cardPrice =
        parseFloat($card.data("price")) ||
        parseFloat(
          $card
            .find(".product-card__price")
            .text()
            .replace(/[^0-9.]/g, ""),
        ) ||
        0;

      var matchesCategory =
        activeCategory === "all" || cardCat === activeCategory;
      var matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice;

      if (matchesCategory && matchesPrice) {
        $card.show();
        matchCount++;
      } else {
        $card.hide();
      }
    });

    var $resultLabel = $(".shop__result-count");
    if ($resultLabel.length) {
      $resultLabel.text("|| Showing " + matchCount + " result(s)");
    }
  };

  function handleCategoryFilter() {
    if ($.exists(".sidebar__category-item")) {
      $document.on("click", ".sidebar__category-item", function (e) {
        e.preventDefault();
        var $item = $(this);

        $item
          .closest(".sidebar__category-list")
          .find(".sidebar__category-item")
          .removeClass("sidebar__category-item--active");
        $item.addClass("sidebar__category-item--active");

        if (typeof window.applyShopFilters === "function") {
          window.applyShopFilters();
        }
      });
    }
  }

  function handleShopSort() {
    var $sortSelect = $(".shop__sort-select, .shop__select, #shop-sort");
    if ($sortSelect.length) {
      $document.on(
        "change",
        ".shop__sort-select, .shop__select, #shop-sort",
        function () {
          var sortVal = $(this).val();
          var $container = $(".product__grid, .shop__grid");
          if (!$container.length) return;
          var $cards = $container.children(".product-card").get();

          $cards.sort(function (a, b) {
            var $a = $(a);
            var $b = $(b);

            var priceA =
              parseFloat($a.data("price")) ||
              parseFloat(
                $a
                  .find(".product-card__price")
                  .text()
                  .replace(/[^0-9.]/g, ""),
              ) ||
              0;
            var priceB =
              parseFloat($b.data("price")) ||
              parseFloat(
                $b
                  .find(".product-card__price")
                  .text()
                  .replace(/[^0-9.]/g, ""),
              ) ||
              0;

            var ratingA =
              parseFloat($a.data("rating")) ||
              parseFloat(
                $a
                  .find(".product-card__rating-text")
                  .text()
                  .replace(/[^0-9.]/g, ""),
              ) ||
              0;
            var ratingB =
              parseFloat($b.data("rating")) ||
              parseFloat(
                $b
                  .find(".product-card__rating-text")
                  .text()
                  .replace(/[^0-9.]/g, ""),
              ) ||
              0;

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
        },
      );
    }
  }

  /*--------------------------------------------------------------
  17. Mobile Menu Sidebar
  --------------------------------------------------------------*/
  function initMobileMenu() {
    if ($.exists(".site-header")) {
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
          $submenu
            .find("li")
            .removeClass()
            .addClass("mobile-menu__submenu-item");
          $submenu
            .find("a")
            .removeClass()
            .addClass("mobile-menu__submenu-link");
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
  }

  /*--------------------------------------------------------------
  18. Dashboard Sidebar
  --------------------------------------------------------------*/
  function initDashboardSidebar() {
    if ($.exists("#sidebarToggle")) {
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
  }

  /*--------------------------------------------------------------
  19. Working Process Accordion
  --------------------------------------------------------------*/
  function workingProcessAccordion() {
    if ($.exists(".working-process__item")) {
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
        content.style.height = item.classList.contains("active")
          ? "auto"
          : "0px";
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
  }

  /*--------------------------------------------------------------
  20. Shop Details Functionality
  --------------------------------------------------------------*/
  function shopDetails() {
    if (
      $.exists(
        ".shop-details__color-picker-btn, .shop-details__thumb-item, .shop-details__quantity, .cart__quantity, .cart__remove",
      )
    ) {
      function setShopDetailsProductImage(imgSrc, color) {
        if (!imgSrc) return;
        $(".shop-details__main-img").attr("src", imgSrc);
        $(".shop-details__zoom-preview-img").attr("src", imgSrc);
        $(".shop-details__main-img-wrap").attr("data-lightbox-src", imgSrc);

        var $thumbs = $(".shop-details__thumb-item");
        $thumbs.removeClass("shop-details__thumb-item--active");

        if (color) {
          $thumbs
            .filter("[data-color='" + color + "']")
            .addClass("shop-details__thumb-item--active");
        } else {
          $thumbs
            .filter(function () {
              return $(this).find("img").attr("src") === imgSrc;
            })
            .addClass("shop-details__thumb-item--active");
        }
      }

      $document.on("click", ".shop-details__color-picker-btn", function () {
        var $btn = $(this);
        var color = $btn.data("color");
        var newImg = $btn.data("image");

        $(".shop-details__color-picker-btn").removeClass(
          "shop-details__color-picker-btn--active",
        );
        $btn.addClass("shop-details__color-picker-btn--active");

        if (!newImg && color) {
          var $matchingThumb = $(
            ".shop-details__thumb-item[data-color='" + color + "']",
          );
          if ($matchingThumb.length) {
            newImg = $matchingThumb.find("img").attr("src");
          }
        }

        setShopDetailsProductImage(newImg, color);
      });

      $document.on("click", ".shop-details__thumb-item", function () {
        var $thumb = $(this);
        var newSrc = $thumb.find("img").attr("src");
        var color = $thumb.data("color");

        setShopDetailsProductImage(newSrc, color);

        $(".shop-details__color-picker-btn").removeClass(
          "shop-details__color-picker-btn--active",
        );
        if (color) {
          $(
            ".shop-details__color-picker-btn[data-color='" + color + "']",
          ).addClass("shop-details__color-picker-btn--active");
        } else if (newSrc) {
          $(
            ".shop-details__color-picker-btn[data-image='" + newSrc + "']",
          ).addClass("shop-details__color-picker-btn--active");
        }
      });

      var $mainWrap = $(".shop-details__main-img-wrap");
      var $lens = $(".shop-details__zoom-lens");
      var $preview = $(".shop-details__zoom-preview");
      var $previewImg = $(".shop-details__zoom-preview-img");

      $document.on("mouseenter", ".shop-details__main-img-wrap", function () {
        if (window.innerWidth <= 991) return;
        var imgSrc = $(this).find(".shop-details__main-img").attr("src");
        if (imgSrc) {
          $(".shop-details__zoom-preview-img").attr("src", imgSrc);
        }
        $(".shop-details__zoom-lens").addClass(
          "shop-details__zoom-lens--active",
        );
        $(".shop-details__zoom-preview").addClass(
          "shop-details__zoom-preview--active",
        );
      });

      $document.on("mouseleave", ".shop-details__main-img-wrap", function () {
        $(".shop-details__zoom-lens").removeClass(
          "shop-details__zoom-lens--active",
        );
        $(".shop-details__zoom-preview").removeClass(
          "shop-details__zoom-preview--active",
        );
      });

      $document.on("mousemove", ".shop-details__main-img-wrap", function (e) {
        if (window.innerWidth <= 991) return;
        var wrap = this;
        var $wrap = $(wrap);
        var $lens = $wrap.find(".shop-details__zoom-lens");
        var $preview = $(".shop-details__zoom-preview");
        var $previewImg = $preview.find(".shop-details__zoom-preview-img");

        var wrapRect = wrap.getBoundingClientRect();
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
        var currentSrc =
          $wrap.attr("data-lightbox-src") ||
          $wrap.find(".shop-details__main-img").attr("src");

        var dynamicEl = [];
        var activeIndex = 0;

        $(".shop-details__thumb-list .shop-details__thumb-item").each(
          function (i) {
            var $thumb = $(this);
            var src = $thumb.find("img").attr("src");
            if (src) {
              dynamicEl.push({
                src: src,
                thumb: src,
              });
              if (
                $thumb.hasClass("shop-details__thumb-item--active") ||
                src === currentSrc
              ) {
                activeIndex = i;
              }
            }
          },
        );

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
          var price =
            parseFloat(
              $tr
                .find(".cart__price")
                .text()
                .replace(/[^0-9.]/g, ""),
            ) || 0;
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
          cost =
            parseFloat(
              $checked
                .closest(".cart__summary-shipping-option")
                .find(".cart__summary-shipping-option-price")
                .text()
                .replace(/[^0-9.]/g, ""),
            ) || 0;
        }
        return cost;
      }

      function updateCartSummaryDisplay() {
        var subtotal = calculateCartSubtotal();
        var shippingCost = getSelectedShippingCost();
        var total = subtotal > 0 ? subtotal + shippingCost : 0;

        $(
          ".cart__summary-row:not(.cart__summary-row--total) .cart__summary-value",
        ).text("$" + subtotal.toFixed(2));
        $(".cart__summary-row--total .cart__summary-value").text(
          "$" + total.toFixed(2),
        );
      }

      function updateRowTotal($input) {
        var $tr = $input.closest("tr");
        var price =
          parseFloat(
            $tr
              .find(".cart__price")
              .text()
              .replace(/[^0-9.]/g, ""),
          ) || 0;
        var qty = parseInt($input.val(), 10) || 1;
        $tr.find(".cart__total").text("$" + (price * qty).toFixed(2));
      }

      function getCartStateSignature() {
        var items = [];
        $(".cart__table tbody tr").each(function (index) {
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
          $updateBtn
            .prop("disabled", !isModified)
            .toggleClass("cart__update-btn--active", isModified);
        }
      }

      $document.on(
        "click",
        ".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type, .cart__quantity-btn--inc",
        function (e) {
          e.preventDefault();
          var $container = $(this).closest(
            ".shop-details__quantity, .cart__quantity",
          );
          var $input = $container.find("input");
          var val = parseInt($input.val(), 10) || 1;
          $input.val(val + 1);

          if ($container.hasClass("cart__quantity")) {
            updateRowTotal($input);
            checkCartModificationState();
          }
        },
      );

      $document.on(
        "click",
        ".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type, .cart__quantity-btn--dec",
        function (e) {
          e.preventDefault();
          var $container = $(this).closest(
            ".shop-details__quantity, .cart__quantity",
          );
          var $input = $container.find("input");
          var val = parseInt($input.val(), 10) || 1;
          if (val > 1) {
            $input.val(val - 1);
            if ($container.hasClass("cart__quantity")) {
              updateRowTotal($input);
              checkCartModificationState();
            }
          }
        },
      );

      $document.on("change input", ".cart__quantity input", function () {
        var val = parseInt($(this).val(), 10);
        if (isNaN(val) || val < 1) {
          $(this).val(1);
        }
        updateRowTotal($(this));
        checkCartModificationState();
      });

      $document.on("click", ".cart__remove", function (e) {
        e.preventDefault();
        var $row = $(this).closest("tr");
        $row.fadeOut(300, function () {
          $row.remove();
          checkCartModificationState();
        });
      });

      $document.on("click", ".cart__update-btn", function (e) {
        e.preventDefault();
        var $btn = $(this);
        if ($btn.prop("disabled") && !$btn.hasClass("cart__update-btn--active"))
          return;

        updateCartSummaryDisplay();
        initialCartState = getCartStateSignature();
        checkCartModificationState();

        var successMsg = $btn.data("success-message");
        if (typeof toastr !== "undefined" && successMsg) {
          toastr.success(successMsg);
        }
      });

      $document.on("change", 'input[name="shipping"]', function () {
        var subtotal = calculateCartSubtotal();
        var shippingCost = getSelectedShippingCost();
        var total = subtotal > 0 ? subtotal + shippingCost : 0;
        $(".cart__summary-row--total .cart__summary-value").text(
          "$" + total.toFixed(2),
        );
      });

      $document.on("click", ".cart__summary-checkout-btn", function (e) {
        var $btn = $(this);
        var successMsg = $btn.data("success-message");
        if (typeof toastr !== "undefined" && successMsg) {
          toastr.info(successMsg);
        }
      });

      $document.on("click", ".shop-details__add-to-cart", function (e) {
        e.preventDefault();
        var $btn = $(this);
        var successMsg = $btn.data("success-message");
        if (typeof toastr !== "undefined" && successMsg) {
          var qty = parseInt($("#product-quantity").val(), 10) || 1;
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

        var activeText = $btn.data("active-text");
        var inactiveText = $btn.data("inactive-text");

        if (!isAdded) {
          $btn.addClass("shop-details__wishlist--active");
          $icon.removeClass("far fa-heart").addClass("fas fa-heart");
          if ($text.length) {
            $text.text(activeText);
          } else {
            $btn.html(
              '<i class="fas fa-heart shop-details__wishlist-icon"></i> ' +
                activeText,
            );
          }
          if (typeof toastr !== "undefined" && successMsg) {
            toastr.success(successMsg);
          }
        } else {
          $btn.removeClass("shop-details__wishlist--active");
          $icon.removeClass("fas fa-heart").addClass("far fa-heart");
          if ($text.length) {
            $text.text(inactiveText);
          } else {
            $btn.html(
              '<i class="far fa-heart shop-details__wishlist-icon"></i> ' +
                inactiveText,
            );
          }
          if (typeof toastr !== "undefined" && removeMsg) {
            toastr.info(removeMsg);
          }
        }
      });
    }
  }

  /*--------------------------------------------------------------
  21. Service Button Dash Animation
  --------------------------------------------------------------*/
  function serviceBtnDashAnimation() {
    if ($.exists(".service-btn")) {
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

          var offset =
            parseFloat(getComputedStyle(circle).strokeDashoffset) || 0;
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
  }

  /*--------------------------------------------------------------
  22. Button Blur Animation
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
  23. Password Toggle (Sign In / Sign Up)
  --------------------------------------------------------------*/
  function passwordToggle() {
    if ($.exists(".sign-in__eye-toggle, .sign-up__eye-toggle")) {
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
  }

  /*--------------------------------------------------------------
  24. OTP Input
  --------------------------------------------------------------*/
  function otpInput() {
    if ($.exists(".password-reset__otp-input")) {
      var $inputs = $(".password-reset__otp-input");

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
  }

  /*--------------------------------------------------------------
  25. Sales Performance Chart
  --------------------------------------------------------------*/
  function salesChart() {
    if ($.exists("#salesChart")) {
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
      var months = ds.labels ? ds.labels.split(",") : [];

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
        ? series1DataRaw.split(",").map(Number)
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
        ? series2DataRaw.split(",").map(Number)
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
              label: series1Label,
              data: dataSeries1,
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
              label: series2Label,
              data: dataSeries2,
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
              grid: { color: hexToRgba(headingColor, 0.05) },
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

      var rs = getComputedStyle(document.documentElement);
      var primaryColor = rs.getPropertyValue("--primary-color").trim();
      var whiteColor = rs.getPropertyValue("--white-color").trim();

      var ctx = servicesChartEl.getContext("2d");
      var ds = servicesChartEl.dataset;
      var sliceLabels = ds.labels ? ds.labels.split(",") : [];
      var sliceData = ds.values ? ds.values.split(",").map(Number) : [];
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
  }

  /*--------------------------------------------------------------
  27. Table Controls (Select All / Delete)
  --------------------------------------------------------------*/
  function tableControls() {
    if ($.exists("#lead-select-all, #order-select-all")) {
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
          var deleteBtn = e.target.closest("[data-row-delete]");
          if (deleteBtn) {
            e.preventDefault();

            var deleteRow = deleteBtn.closest("tr");
            if (!deleteRow) return;

            deleteRow.style.transition = "opacity 0.25s ease";
            deleteRow.style.opacity = "0";

            setTimeout(function () {
              deleteRow.remove();

              var all = tbody.querySelectorAll(
                ".lead-table__checkbox, .order-table__checkbox",
              );
              var checked = tbody.querySelectorAll(
                ".lead-table__checkbox:checked, .order-table__checkbox:checked",
              );

              selectAll.checked =
                all.length > 0 && checked.length === all.length;
              selectAll.indeterminate =
                checked.length > 0 && checked.length < all.length;
            }, 250);
            return;
          }

          var editBtn = e.target.closest("[data-row-edit]");
          if (editBtn) {
            e.preventDefault();

            var row = editBtn.closest("tr");
            if (!row) return;

            var isLead = $(tbody).attr("id") === "lead-table-body";
            if (isLead) {
              var leadModal = document.getElementById("leadStatusModal");
              if (!leadModal) return;

              var leadStatusEl = row.querySelector(".lead-table__status");
              var leadNameEl = row.querySelector(".lead-table__name");
              var leadContactEl = row.querySelector(".lead-table__contact");

              var modalLeadName = document.getElementById("modalLeadName");
              var modalLeadContact =
                document.getElementById("modalLeadContact");

              if (modalLeadName && leadNameEl)
                modalLeadName.textContent = leadNameEl.textContent.trim();
              if (modalLeadContact && leadContactEl)
                modalLeadContact.textContent = leadContactEl.textContent.trim();

              var currentLeadStatus = leadStatusEl
                ? leadStatusEl.textContent.trim()
                : "On going";
              $("#leadStatusInput").val(currentLeadStatus);
              $("#leadCustomSelectText").text(currentLeadStatus);
              $("#leadCustomSelect .lead-modal__custom-select-option").each(
                function () {
                  var val = $(this).data("value");
                  if (val === currentLeadStatus) {
                    $(this)
                      .addClass("is-selected")
                      .attr("aria-selected", "true");
                  } else {
                    $(this)
                      .removeClass("is-selected")
                      .attr("aria-selected", "false");
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
            if (modalName && nameEl)
              modalName.textContent = nameEl.textContent.trim();
            if (modalTracking && trackingEl)
              modalTracking.textContent = trackingEl.textContent.trim();

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
                  $(this)
                    .removeClass("is-selected")
                    .attr("aria-selected", "false");
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
          }
        });
      }

      var $statusModal = $("#orderStatusModal");
      if ($statusModal.length) {
        function closeModal() {
          $statusModal.removeClass("is-visible").attr("aria-hidden", "true");
          $("#orderCustomSelect")
            .removeClass("is-open")
            .attr("aria-expanded", "false");
          document.body.style.overflow = "";
          $statusModal[0].currentEditingRow = null;
        }

        $statusModal.on("click", "[data-modal-close]", function (e) {
          e.preventDefault();
          closeModal();
        });

        $statusModal.on("click", "#orderCustomSelectTrigger", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $select = $("#orderCustomSelect");
          var isOpen = $select.hasClass("is-open");
          $select
            .toggleClass("is-open", !isOpen)
            .attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $statusModal.on(
          "click",
          ".order-modal__custom-select-option",
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
          },
        );

        $statusModal.on("click", function (e) {
          if (!$(e.target).closest("#orderCustomSelect").length) {
            $("#orderCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
          }
        });

        $(document).on("keydown", function (e) {
          if (e.key === "Escape" && $statusModal.hasClass("is-visible")) {
            closeModal();
          }
        });

        $("#orderStatusForm").on("submit", function (e) {
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
        }

        $leadStatusModal.on("click", "[data-modal-close]", function (e) {
          e.preventDefault();
          closeLeadModal();
        });

        $leadStatusModal.on("click", "#leadCustomSelectTrigger", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $select = $("#leadCustomSelect");
          var isOpen = $select.hasClass("is-open");
          $select
            .toggleClass("is-open", !isOpen)
            .attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $leadStatusModal.on(
          "click",
          ".lead-modal__custom-select-option",
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
          },
        );

        $leadStatusModal.on("click", function (e) {
          if (!$(e.target).closest("#leadCustomSelect").length) {
            $("#leadCustomSelect")
              .removeClass("is-open")
              .attr("aria-expanded", "false");
          }
        });

        $(document).on("keydown", function (e) {
          if (e.key === "Escape" && $leadStatusModal.hasClass("is-visible")) {
            closeLeadModal();
          }
        });

        $("#leadStatusForm").on("submit", function (e) {
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

        $input.on("input", function () {
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

          var $selectAll = $("#" + selectAllId);
          if ($selectAll.length) {
            var $visibleCheckboxes = $tbody.find(
              "tr:visible .lead-table__checkbox, tr:visible .order-table__checkbox",
            );
            var $checkedVisible = $visibleCheckboxes.filter(":checked");
            $selectAll.prop(
              "checked",
              $visibleCheckboxes.length > 0 &&
                $checkedVisible.length === $visibleCheckboxes.length,
            );
            $selectAll.prop(
              "indeterminate",
              $checkedVisible.length > 0 &&
                $checkedVisible.length < $visibleCheckboxes.length,
            );
          }
        });
      }

      initTableControls("lead-select-all", "lead-table-body");
      initTableControls("order-select-all", "order-table-body");

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

        $trigger.on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var isOpen = $menu.hasClass("is-open");
          $(".dashboard-filter-menu").not($menu).removeClass("is-open");
          $menu.toggleClass("is-open", !isOpen);
          $trigger.attr("aria-expanded", !isOpen ? "true" : "false");
        });

        $menu.on("click", ".dashboard-filter-menu__item", function (e) {
          e.preventDefault();
          var filterVal = $(this).data("filter");

          $menu.find(".dashboard-filter-menu__item").removeClass("is-active");
          $(this).addClass("is-active");

          filterRows(filterVal);
          $menu.removeClass("is-open");
          $trigger.attr("aria-expanded", "false");
        });

        $menu.find(".dashboard-filter-menu__reset").on("click", function (e) {
          e.preventDefault();
          $menu.find(".dashboard-filter-menu__item").removeClass("is-active");
          $menu
            .find(".dashboard-filter-menu__item[data-filter='all']")
            .addClass("is-active");
          filterRows("all");
          $menu.removeClass("is-open");
          $trigger.attr("aria-expanded", "false");
        });

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

          var $selectAll = $("#" + selectAllId);
          if ($selectAll.length) {
            var $visibleCheckboxes = $tbody.find(
              "tr:visible .lead-table__checkbox, tr:visible .order-table__checkbox",
            );
            var $checkedVisible = $visibleCheckboxes.filter(":checked");
            $selectAll.prop(
              "checked",
              $visibleCheckboxes.length > 0 &&
                $checkedVisible.length === $visibleCheckboxes.length,
            );
            $selectAll.prop(
              "indeterminate",
              $checkedVisible.length > 0 &&
                $checkedVisible.length < $visibleCheckboxes.length,
            );
          }
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
          "data:text/csv;charset=utf-8," +
          rows
            .map(function (row) {
              return row
                .map(function (val) {
                  return '"' + String(val).replace(/"/g, '""') + '"';
                })
                .join(",");
            })
            .join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        var today = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "patie-orders-" + today + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
        }

        $document.on("click", ".order-toolbar__add-btn", function (e) {
          e.preventDefault();
          $addProductModal.addClass("is-visible").attr("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          $("#addProductName").trigger("focus");
        });

        $addProductModal.on("click", "[data-modal-close]", function (e) {
          e.preventDefault();
          closeAddProductModal();
        });

        $addProductModal.on(
          "click",
          ".dashboard-modal-img-option",
          function () {
            $addProductModal
              .find(".dashboard-modal-img-option")
              .removeClass("is-active");
            $(this).addClass("is-active");
            $(this).find("input[type='radio']").prop("checked", true);
          },
        );

        $(document).on("keydown", function (e) {
          if (e.key === "Escape" && $addProductModal.hasClass("is-visible")) {
            closeAddProductModal();
          }
        });

        $("#addProductForm").on("submit", function (e) {
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
        }

        $document.on("click", ".lead-toolbar__add-btn", function (e) {
          e.preventDefault();
          $addLeadModal.addClass("is-visible").attr("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          $("#addLeadName").trigger("focus");
        });

        $addLeadModal.on("click", "[data-modal-close]", function (e) {
          e.preventDefault();
          closeAddLeadModal();
        });

        $(document).on("keydown", function (e) {
          if (e.key === "Escape" && $addLeadModal.hasClass("is-visible")) {
            closeAddLeadModal();
          }
        });

        $("#addLeadForm").on("submit", function (e) {
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
      var compareEl = document.querySelector(".tp-compare");
      if (!compareEl) return;

      var range = compareEl.querySelector(".tp-compare__range");
      if (!range) return;

      range.addEventListener("input", function (e) {
        compareEl.style.setProperty("--pos", e.target.value + "%");
      });
    }
  }

  /*--------------------------------------------------------------
  29. Video Text Parallax (GSAP)
  --------------------------------------------------------------*/
  function videoTextParallax() {
    if ($.exists(".video-section__bg-text")) {
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
          $field.removeClass("is-invalid");
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
          "#addProductForm, #addLeadForm, #orderStatusForm, #leadStatusForm",
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
        $form.find(".is-invalid").removeClass("is-invalid");

        var isValid = true;
        var firstInvalid = null;

        $form.find("input, select, textarea").each(function () {
          if (!this.checkValidity()) {
            isValid = false;
            var $input = $(this);
            $input.addClass("is-invalid");

            var errorText =
              $input.data("error-message") || this.validationMessage;
            if (errorText) {
              getFieldContainer($input).append(
                '<span class="form-error-message">' + errorText + "</span>",
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
            firstInvalid.focus();
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
        $form.find(".is-invalid").removeClass("is-invalid");
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
    $document.on(
      "click",
      ".blog-details__main-img-wrap, .blog-details__sub-img",
      function (e) {
        if ($(e.target).closest(".blog-details__meta-pill").length) {
          return;
        }
        e.preventDefault();
        var $el = $(this);
        var currentSrc =
          $el.attr("data-lightbox-src") ||
          $el.find("img").attr("src") ||
          $el.attr("src");

        var dynamicEl = [];
        var activeIndex = 0;

        if ($el.hasClass("blog-details__sub-img")) {
          var $subImages = $(".blog-details__sub-images .blog-details__sub-img");
          $subImages.each(function (i) {
            var src = $(this).attr("src");
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
      },
    );

    $document.on("wheel", ".lg-outer", function (e) {
      e.preventDefault();
      var $image = $(this).find(".lg-current .lg-image");
      if (!$image.length) return;

      var currentScale = parseFloat($image.attr("data-scale")) || 1;
      var delta = e.originalEvent.deltaY;

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
  }
})(jQuery);
