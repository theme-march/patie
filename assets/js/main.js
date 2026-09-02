(function ($) {
  ("use strict");

  // Register GSAP ScrollTrigger
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /*
|--------------------------------------------------------------------------
| Template Name: CRAS
| Author: Thememarch
| Version: 1.0.0
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| TABLE OF CONTENTS:
|--------------------------------------------------------------------------
| 1. Preloader
| 2. Mobile Menu
| 3. Sticky Header
| 4. Dynamic Background
| 5. Slick Slider
| 6. Modal Video
| 7. Scroll Up
| 8. Hover text Animation
| 9. Pagination 
| 10. Company Tab
| 11. Accordion
| 12. Sticky Content
| 13. Comming Soon Counter
| 14. Light Gallery
| 15. Counter

    /*--------------------------------------------------------------
    Scripts initialization
--------------------------------------------------------------*/

  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on("load", function () {
    $(window).trigger("scroll");
    $(window).trigger("resize");
    // preloader();

    // Wait for the preloader to fully fade out before starting AOS,
    // so first-section animations aren't consumed while hidden.
    var aosInitDone = false;
    function initAOS() {
      if (aosInitDone) return;
      aosInitDone = true;
      AOS.init();
      // Trigger CSS keyframe animations that were paused waiting for the preloader
      document.body.classList.add("preloader-done");

      // Hero Grooming Badge — appears last after all AOS hero animations settle
      var heroBadge = document.querySelector(".hero-grooming__badge");
      if (heroBadge) {
        setTimeout(function () {
          heroBadge.classList.add("hero-grooming__badge--visible");
        }, 700);
      }
    }

    var preloaderEl = document.getElementById("preloader");
    if (preloaderEl) {
      // Preloader exists — defer AOS until it signals completion
      document.addEventListener("preloaderDone", initAOS, { once: true });
    } else {
      // No preloader on this page — init immediately
      initAOS();
    }
  });

  $(function () {
    $(window).trigger("resize");
    mainNav();
    setActiveNav();
    stickyHeader();
    dynamicBackground();
    swiperInit();
    modalVideo();
    scrollUp();
    initSearch();
    handleShopSearchFilter();
    initMobileMenu();
    initCountUp();
    initProgressBars();
    beforeAndAfterReveal();
    videoTextParallax();
  });

  $(window).on("scroll", function () {
    showScrollUp();
  });

  /*--------------------------------------------------------------
    Video Section — Background Text Scroll Parallax
  --------------------------------------------------------------*/
  function videoTextParallax() {
    const el = document.querySelector(".video-section__bg-text");
    if (!el || typeof gsap === "undefined") return;

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

  /*--------------------------------------------------------------
    Before & After Image GSAP Slide Reveal
  --------------------------------------------------------------*/
  function beforeAndAfterReveal() {
    const img = document.querySelector(".before-and-after__img");
    if (!img || typeof gsap === "undefined") return;

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
    Count Up Animation (GSAP + ScrollTrigger)
  --------------------------------------------------------------*/
  function initCountUp() {
    const countEls = document.querySelectorAll(".count-up");
    if (!countEls.length || typeof gsap === "undefined") return;

    countEls.forEach(function (el) {
      const target = parseFloat(
        el.getAttribute("data-target") || el.textContent,
      );
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

      el.textContent = (0).toFixed(decimals);

      function runCount() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      }

      const aosParent = el.closest("[data-aos]");
      const watchTarget = aosParent || el;

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              observer.unobserve(watchTarget);
              // small delay so AOS fade-in and count-up start together
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
     Progress Bar Animation (scroll-triggered)
  --------------------------------------------------------------*/
  function initProgressBars() {
    var bars = document.querySelectorAll(".ak-progress-bar[data-width]");
    if (!bars.length) return;

    bars.forEach(function (bar) {
      var targetWidth = bar.getAttribute("data-width");

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              observer.unobserve(bar);
              // small delay so the bar is visible before expanding
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

  /*-------------------------------------------------
      1. preloader  
 --------------------------------------------------------------*/

  // function preloader() {
  //   setTimeout(function () {
  //     $("#preloader").addClass("loaded");
  //     if ($("#preloader").hasClass("loaded")) {
  //       $("#preloader")
  //         .delay(850)
  //         .queue(function () {
  //           $(this).remove();
  //         })
  //         .fadeOut();
  //     }
  //   }, 200);
  // }

  /*--------------------------------------------------------------
     2. Mobile  Menu  
 -----------------------------------------------------------------*/
  function mainNav() {
    $(".ak-nav").append('<span class="ak-munu_toggle"><span></span></span>');
    $(".menu-item-has-children").append(
      '<span class="ak-munu_dropdown_toggle"></span>',
    );
    $(".ak-munu_toggle").on("click", function () {
      $(this)
        .toggleClass("ak-toggle_active")
        .siblings(".ak-nav_list")
        .slideToggle();
    });
    $(".ak-munu_dropdown_toggle").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
      $(this).parent().toggleClass("active");
    });

    $(".menu-item-has-black-section").append(
      '<span class="ak-munu_dropdown_toggle_1"></span>',
    );

    $(".ak-munu_dropdown_toggle_1").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
      $(this).parent().toggleClass("active");
    });

    $(".ak-mode_btn").on("click", function () {
      $(this).toggleClass("active");
      $("body").toggleClass("ak-dark");
    });
    // Side Nav
    $(".ak-icon_btn").on("click", function () {
      $(".ak-side_header").addClass("active");
    });
    $(".ak-close, .ak-side_header_overlay").on("click", function () {
      $(".ak-side_header").removeClass("active");
    });
    //  Menu Text Split
    $(".ak-animo_links > li > a").each(function () {
      let xxx = $(this).html().split("").join("</span><span>");
      $(this).html(`<span class="ak-animo_text"><span>${xxx}</span></span>`);
    });
  }

  /*--------------------------------------------------------------
    2b. Active Navigation State
  --------------------------------------------------------------*/
  function setActiveNav() {
    var path = window.location.pathname;
    var page = path.substring(path.lastIndexOf("/") + 1) || "index.html";

    var $menuItems = $(".site-header__menu-item");
    var $targetItem = null;
    var $targetSubmenuLink = null;

    // First: try to match via submenu links (covers cart.html, checkout.html, etc.)
    $menuItems.each(function () {
      var $item = $(this);
      $item.find(".site-header__submenu-link").each(function () {
        var href = $(this).attr("href") || "";
        var linkPage = href.substring(href.lastIndexOf("/") + 1);
        if (linkPage === page) {
          $targetItem = $item;
          $targetSubmenuLink = $(this); // capture the matched submenu <a>
          return false;
        }
      });
      if ($targetItem) return false;
    });

    // Second: if no submenu matched, try the top-level link href
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

    // Only apply class change and style injection if the correct item is not already active
    if (
      $targetItem &&
      !$targetItem.hasClass("site-header__menu-item--active")
    ) {
      var $noTransStyle = $(
        '<style id="nav-no-transition">' +
          ".site-header__menu-bg, .site-header__menu-item { transition: none !important; }" +
          "</style>",
      );
      $("head").append($noTransStyle);

      $(".site-header__menu-item").removeClass(
        "site-header__menu-item--active",
      );
      $targetItem.addClass("site-header__menu-item--active");

      setTimeout(function () {
        $noTransStyle.remove();
      }, 50);
    }

    // Mark the active submenu link (clear all first, then set the matching one)
    $(".site-header__submenu-link").removeClass(
      "site-header__submenu-link--active",
    );
    if ($targetSubmenuLink) {
      $targetSubmenuLink.addClass("site-header__submenu-link--active");
    }
  }

  /*--------------------------------------------------------------
    3. Sticky Header
--------------------------------------------------------------*/
  function stickyHeader() {
    var $window = $(window);
    var lastScrollTop = 0;
    var $header = $(".ak-sticky_header");
    var enterThreshold = 200;
    var scrollDelta = 10;

    // Create spacer to prevent layout jumping when switching to fixed
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
          // Add spacer height if the header is normally in document flow
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
          $header.addClass("ak-gescout_show"); // Scrolling UP → reveal
        } else {
          $header.removeClass("ak-gescout_show"); // Scrolling DOWN → hide
        }
      }

      lastScrollTop = windowTop;
    });
  }

  /*--------------------------------------------------------------
     4. Dynamic Background
-------------------------------------------------------------*/
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }

  /*--------------------------------------------------------------    
     5. Slick Slider
 --------------------------------------------------------------*/

  function swiperInit() {
    if ($.exists(".ak-slider-hero-1")) {
      var swiperOptions = {
        loop: true,
        speed: 1200,
        parallax: true,
        zoom: {
          maxRatio: 5,
        },
        autoplay: {
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
          nextEl: ".ak-swiper-button-prev",
          prevEl: ".ak-swiper-button-next",
        },
      };

      var swiper = new Swiper(".ak-slider-hero-1", swiperOptions);
    }

    if ($.exists(".pet-grooming-slider")) {
      var groomingSwiper = new Swiper(".pet-grooming-slider", {
        loop: true,
        loopedSlides: 4,
        speed: 1000,
        autoplay: {
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
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          576: {
            slidesPerView: 1,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        },
      });
    }
  }

  /*--------------------------------------------------------------
     6. Modal Video
  --------------------------------------------------------------*/
  function modalVideo() {
    $(document).on("click", ".ak-video-open", function (e) {
      e.preventDefault();
      var video = $(this).attr("href");
      video = video.split("?v=")[1].trim();
      $(".ak-video-popup-container iframe").attr(
        "src",
        `https://www.youtube.com/embed/${video}`,
      );
      $(".ak-video-popup").addClass("active");
    });
    $(".ak-video-popup-close, .ak-video-popup-layer").on("click", function (e) {
      $(".ak-video-popup").removeClass("active");
      $("html").removeClass("overflow-hidden");
      $(".ak-video-popup-container iframe").attr("src", "about:blank");
      e.preventDefault();
    });
  }

  /*--------------------------------------------------------------
     7. Scroll Up
--------------------------------------------------------------*/
  function scrollUp() {
    $(".ak-scrollup").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        0,
      );
    });
  }
  // For Scroll Up
  function showScrollUp() {
    let scroll = $(window).scrollTop();
    if (scroll >= 350) {
      $(".ak-scrollup").addClass("ak-scrollup-show");
    } else {
      $(".ak-scrollup").removeClass("ak-scrollup-show");
    }
  }

  /*--------------------------------------------------------------
    11. Accordion
 --------------------------------------------------------------*/
  if ($.exists(".ak-accordion-title")) {
    $(".ak-accordion-title").click(function () {
      $(this).toggleClass("active");
      var $accordionTab = $(this).next(".ak-accordion-tab");
      $accordionTab.slideToggle();
      $accordionTab
        .parent()
        .siblings()
        .find(".ak-accordion-tab")
        .slideUp()
        .prev()
        .removeClass("active");
    });
  }

  // FAQ Accordion
  if ($.exists(".faq-accordion__header")) {
    $(".faq-accordion__header").on("click", function () {
      var item = $(this).closest(".faq-accordion__item");
      var body = item.find(".faq-accordion__body");
      var icon = item.find(".faq-accordion__icon i");

      if (item.hasClass("faq-accordion__item--active")) {
        // Close it
        item.removeClass("faq-accordion__item--active");
        body.css("height", "0");
        icon.removeClass("fa-minus").addClass("fa-plus");
      } else {
        // Open it
        // Close others
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

    // Initial check
    $(".faq-accordion__item--active").each(function () {
      var body = $(this).find(".faq-accordion__body");
      body.css("height", body[0].scrollHeight + "px");
      $(this)
        .find(".faq-accordion__icon i")
        .removeClass("fa-plus")
        .addClass("fa-minus");
    });
  }

  /*--------------------------------------------------------------
     Testimonial Slider
  --------------------------------------------------------------*/
  /*--------------------------------------------------------------
     Testimonial Slider
  --------------------------------------------------------------*/
  function testimonialSlider() {
    let currentIndex = 1; // Starting with the middle one (index 1)
    const totalAvatars = $(".testimonial__avatar").length;

    // Reviewer data
    const data = [
      {
        name: "JENNY WILSON",
        role: "Graphic Designer",
        rating: 5,
        text: "The grooming staff here is incredibly gentle! My cat is extremely anxious, but they handled her with absolute patience and care. The custom styling recommendations were spot on, and she came back smelling amazing and feeling completely relaxed.",
      },
      {
        name: "SAVANNAH NGUYEN",
        role: "Managing Director",
        rating: 4.5,
        text: "I Absolutely Love How Caring, Professional, And Attentive The Entire Team Is! My Dog Feels Completely At Home, Happy, And Safe—And I Can Check On Him Anytime Through Their Reliable CCTV Monitoring Service. Truly Peace Of Mind For Every Pet Parent!",
      },
      {
        name: "KRISTIN WATSON",
        role: "Marketing Specialist",
        rating: 5,
        text: "Highly recommend their services. The de-shedding treatment worked wonders on my Golden Retriever, and the staff's professionalism is unmatched. The scheduling was seamless and the facility is clean, safe, and welcoming. My Cat Feels Completely At Home, Happy",
      },
    ];

    function updateTestimonial(index, direction) {
      if (totalAvatars === 0) return;

      const content = $(".testimonial__slide-content")[0];
      const wrapper = $(".testimonial__wrapper")[0];
      if (!content || !wrapper) return;

      const slideOut = direction === "next" ? "-60px" : "60px";
      const slideIn = direction === "next" ? "60px" : "-60px";

      // Phase 1: slide + fade OUT (content only, avatars stay put)
      content.style.transition = "opacity 0.22s ease, transform 0.22s ease";
      content.style.opacity = "0";
      content.style.transform = "translateX(" + slideOut + ")";

      setTimeout(function () {
        // Swap content while invisible
        const item = data[index] || data[1];
        const $card = $(".testimonial__card");
        $card.find(".testimonial__name").text(item.name);
        $card.find(".testimonial__designation").text(item.role);
        $card.find(".testimonial__text").text('"' + item.text + '"');

        // Build stars
        let starsHtml = "";
        const fullStars = Math.floor(item.rating);
        const hasHalf = item.rating % 1 !== 0;
        for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
            starsHtml += '<i class="fas fa-star"></i>';
          } else if (i === fullStars && hasHalf) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
          } else {
            starsHtml += '<i class="far fa-star"></i>';
          }
        }
        $card.find(".testimonial__rating").html(starsHtml);

        // Update avatar highlight — side/center states (no slide, just resize)
        $(".testimonial__avatar")
          .removeClass("testimonial__avatar--center")
          .addClass("testimonial__avatar--side");
        $(".testimonial__avatar")
          .eq(index)
          .removeClass("testimonial__avatar--side")
          .addClass("testimonial__avatar--center");

        // Snap content to entry-start position instantly (no transition)
        // Read offsetHeight BEFORE setting the snap position so the reflow
        // commits the previous state, not the new one — prevents a stale frame
        content.style.transition = "none";
        content.offsetHeight; // flush pending styles before snap

        content.style.transform = "translateX(" + slideIn + ")";
        content.style.opacity = "0";

        // Phase 2: rAF — browser has now committed the snap, safe to re-enable
        requestAnimationFrame(function () {
          content.style.transition = "opacity 0.28s ease, transform 0.28s ease";
          content.style.opacity = "1";
          content.style.transform = "translateX(0)";
        });
      }, 240); // wait for phase 1 to finish
    }

    $(".testimonial__nav--next").on("click", function () {
      currentIndex = (currentIndex + 1) % totalAvatars;
      updateTestimonial(currentIndex, "next");
    });

    $(".testimonial__nav--prev").on("click", function () {
      currentIndex = (currentIndex - 1 + totalAvatars) % totalAvatars;
      updateTestimonial(currentIndex, "prev");
    });

    // Also switch on avatar click
    $(".testimonial__avatar").on("click", function () {
      const newIndex = $(this).index();
      if (newIndex === currentIndex) return;
      const direction = newIndex > currentIndex ? "next" : "prev";
      currentIndex = newIndex;
      updateTestimonial(currentIndex, direction);
    });
  }

  function parentTestimonialSlider() {
    let currentIndex = 1; // Middle avatar (index 1)
    const totalAvatars = $(".parent-testimonial__avatar").length;

    // Testimonial data matching avatars in pet-grooming.html
    const data = [
      {
        name: "JENNY WILSON",
        role: "Graphic Designer",
        rating: 5,
        text: "The grooming staff here is incredibly gentle! My cat is extremely anxious, but they handled her with absolute patience and care. The custom styling recommendations were spot on, and she came back smelling amazing and feeling completely relaxed.",
      },
      {
        name: "BROOKLYN SIMMONS",
        role: "E-Commerce Solutions",
        rating: 4.5,
        text: "We Work With Trusted Partners And Monitor The Impact Of Every Program To Ensure Transparency And Accountability All Donations To Our Organization Are Tax-Deductible, And We Provide Receipts For Every Contribution Offer Numerous Volunteer Opportunities Both On-Site And Virtually. Visit Our Volunteer Page Donations",
      },
      {
        name: "KRISTIN WATSON",
        role: "Marketing Specialist",
        rating: 5,
        text: "Highly recommend their services. The de-shedding treatment worked wonders on my Golden Retriever, and the staff's professionalism is unmatched. The scheduling was seamless and the facility is clean, safe, and welcoming. My Cat Feels Completely At Home, Happy",
      },
    ];

    function updateTestimonial(index, direction) {
      if (totalAvatars === 0) return;

      // Update Highlight Immediately
      $(".parent-testimonial__avatar")
        .removeClass("parent-testimonial__avatar--center")
        .addClass("parent-testimonial__avatar--side");
      $(".parent-testimonial__avatar")
        .eq(index)
        .removeClass("parent-testimonial__avatar--side")
        .addClass("parent-testimonial__avatar--center");

      const $content = $(".parent-testimonial__content");
      const leaveClass =
        direction === "next" ? "is-leaving" : "is-leaving-prev";
      const enterClass =
        direction === "next" ? "is-entering" : "is-entering-prev";

      $content
        .removeClass("is-leaving is-leaving-prev is-entering is-entering-prev")
        .addClass(leaveClass);

      setTimeout(function () {
        // Swap content text
        const item = data[index] || data[1];
        $content.find(".parent-testimonial__name").text(item.name);
        $content.find(".parent-testimonial__designation").text(item.role);
        $content.find(".parent-testimonial__text").text(item.text);

        // Build Stars Markup
        let starsHtml = "";
        const fullStars = Math.floor(item.rating);
        const hasHalf = item.rating % 1 !== 0;
        for (let i = 0; i < 5; i++) {
          if (i < fullStars) {
            starsHtml += '<i class="fas fa-star parent-testimonial__star"></i>';
          } else if (i === fullStars && hasHalf) {
            starsHtml +=
              '<i class="fas fa-star-half-alt parent-testimonial__star"></i>';
          } else {
            starsHtml += '<i class="far fa-star parent-testimonial__star"></i>';
          }
        }
        $content.find(".parent-testimonial__rating").html(starsHtml);

        // Snap to entry-start position WITHOUT transition, then animate in
        $content.css("transition", "none");
        $content.removeClass(leaveClass).addClass(enterClass);

        // Force reflow so browser commits the snap
        $content[0].offsetHeight;

        // Re-enable transitions, remove enter class → CSS animates back to base state
        $content.css("transition", "");
        $content.removeClass(enterClass);
      }, 280);
    }

    $(".parent-testimonial__nav--next").on("click", function () {
      currentIndex = (currentIndex + 1) % totalAvatars;
      updateTestimonial(currentIndex, "next");
    });

    $(".parent-testimonial__nav--prev").on("click", function () {
      currentIndex = (currentIndex - 1 + totalAvatars) % totalAvatars;
      updateTestimonial(currentIndex, "prev");
    });

    $(".parent-testimonial__avatar").on("click", function () {
      const newIndex = $(this).index();
      if (newIndex === currentIndex) return;
      const direction = newIndex > currentIndex ? "next" : "prev";
      currentIndex = newIndex;
      updateTestimonial(currentIndex, direction);
    });
  }

  function beforeAfterSlider() {
    const dots = $(".before-and-after__dot");
    const totalDots = dots.length;
    const $img = $(".before-and-after__img");

    if (totalDots === 0 || $img.length === 0) return;

    let currentIndex = dots.filter(".before-and-after__dot--active").index();
    if (currentIndex === -1) currentIndex = 0;

    let isAnimating = false;

    function changeSlide(newIndex, direction) {
      if (isAnimating) return;
      isAnimating = true;

      const $current = $(".before-and-after__img--current");
      const $next = $(".before-and-after__img--next");

      // Set new src on the incoming image
      const newSrc = dots.eq(newIndex).data("src");
      if (newSrc) $next.attr("src", newSrc);

      // Position next image off-screen instantly (no transition)
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
      $next[0].offsetHeight; // force reflow
      $next.css("transition", "");

      // Slide both at the same time
      if (direction === "next") {
        $current.addClass("is-leaving");
        $next.css("transform", "translateX(0)");
      } else {
        $current.addClass("is-leaving-prev");
        $next.css("transform", "translateX(0)");
      }

      setTimeout(function () {
        // Swap roles: next becomes current
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

    let intervalId = setInterval(function () {
      const nextIndex = (currentIndex + 1) % totalDots;
      dots.removeClass("before-and-after__dot--active");
      dots.eq(nextIndex).addClass("before-and-after__dot--active");
      changeSlide(nextIndex, "next");
      currentIndex = nextIndex;
    }, 4000);

    // Allow manual click on dots
    dots.on("click", function () {
      const newIndex = $(this).index();
      if (newIndex === currentIndex || isAnimating) return;

      clearInterval(intervalId);

      const direction = newIndex > currentIndex ? "next" : "prev";
      dots.removeClass("before-and-after__dot--active");
      $(this).addClass("before-and-after__dot--active");

      changeSlide(newIndex, direction);
      currentIndex = newIndex;

      // Restart auto play interval
      intervalId = setInterval(function () {
        const nextIndex = (currentIndex + 1) % totalDots;
        dots.removeClass("before-and-after__dot--active");
        dots.eq(nextIndex).addClass("before-and-after__dot--active");
        changeSlide(nextIndex, "next");
        currentIndex = nextIndex;
      }, 4000);
    });
  }

  function boardingTestimonialSlider() {
    const $prevBtn = $(".boarding-testimonial__nav-btn--prev");
    const $nextBtn = $(".boarding-testimonial__nav-btn--next");
    const $content = $(".boarding-testimonial__right");

    function updateContent() {
      // Fade out the items that should change
      // Specifically the avatar, name, role, main text and stars
      $(
        ".boarding-testimonial__avatar, .boarding-testimonial__name, .boarding-testimonial__role, .boarding-testimonial__text, .boarding-testimonial__stars",
      ).fadeOut(300, function () {
        // In a real application, you would update the text and attributes here
        // $(this).text(newData.text); etc.
        $(this).fadeIn(300);
      });
    }

    $prevBtn.on("click", updateContent);
    $nextBtn.on("click", updateContent);
  }

  function workingProcessSlider() {
    let currentIndex = 1;
    const totalSteps = 4;
    const $progress = $(".working-process__progress-bar");
    const $title = $(".working-process__slide-title");
    const $desc = $(".working-process__slide-desc");
    const $img = $(".working-process__img");
    const $badgeText = $(".working-process__badge-text");

    // Steps details matching working process slides
    const stepsData = [
      {
        title: "01. CARE & LIVE MONITORING",
        desc: "We Provide Attentive Care For Your Pet During Their Stay, Grooming, Or Daycare. Our Trained Team Ensures That Your Pet Is Comfortable, Happy, And Safe At All Times.",
      },
      {
        title: "02. BOOKING & SCHEDULING",
        desc: "Easily book appointments online or over the phone. Choose from our flexible slots that suit your calendar, ensuring complete peace of mind.",
      },
      {
        title: "03. EXPERT GROOMING CARE",
        desc: "Our styling professionals provide complete individualized treatment plans including deshedding, nail clipping, skin checks, and deep baths.",
      },
      {
        title: "04. HAPPY PET PICKUP",
        desc: "Once grooming is completed, pick up your clean, happy, and refreshed pet. We provide a post-session summary of their behavior and skin health.",
      },
    ];

    function updateStep(index, direction) {
      const leaveClass =
        direction === "next" ? "is-leaving" : "is-leaving-prev";
      const enterClass =
        direction === "next" ? "is-entering" : "is-entering-prev";

      // 1. Slide and Fade out targets
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
        // 2. Change contents
        const step = stepsData[index - 1] || stepsData[0];
        $badgeText.text(index.toString().padStart(2, "0"));
        $title.text(step.title);
        $desc.text(step.desc);

        const progressPos = ((index - 1) / totalSteps) * 100;
        $progress.css("left", progressPos + "%");

        // 3. Snap targets offscreen instantly
        $img.css("transition", "none");
        $badgeText.css("transition", "none");
        $title.css("transition", "none");
        $desc.css("transition", "none");

        $img.removeClass(leaveClass).addClass(enterClass);
        $badgeText.removeClass(leaveClass).addClass(enterClass);
        $title.removeClass(leaveClass).addClass(enterClass);
        $desc.removeClass(leaveClass).addClass(enterClass);

        // Force reflow
        $img[0].offsetHeight;

        // 4. Slide back in smoothly
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

    $(".working-process__nav-btn")
      .eq(1)
      .on("click", function () {
        currentIndex = currentIndex < totalSteps ? currentIndex + 1 : 1;
        updateStep(currentIndex, "next");
      });

    $(".working-process__nav-btn")
      .eq(0)
      .on("click", function () {
        currentIndex = currentIndex > 1 ? currentIndex - 1 : totalSteps;
        updateStep(currentIndex, "prev");
      });
  }

  function pricingToggle() {
    $(".pricing__toggle-btn, .grooming-pricing__toggle-btn").on(
      "click",
      function () {
        const $this = $(this);
        const isGrooming = $this.hasClass("grooming-pricing__toggle-btn");
        const btnClass = isGrooming
          ? "grooming-pricing__toggle-btn"
          : "pricing__toggle-btn";
        const sectionClass = isGrooming ? ".grooming-pricing" : ".pricing";

        if ($this.hasClass(`${btnClass}--active`)) return;

        // Toggle Active Class
        $(`.${btnClass}`)
          .removeClass(`${btnClass}--active`)
          .addClass(`${btnClass}--inactive`);
        $this
          .removeClass(`${btnClass}--inactive`)
          .addClass(`${btnClass}--active`);

        const isYearly = $this.text().trim() === "YEARLY";
        const $section = $this.closest(sectionClass);

        // 1. Update elements with explicit data-monthly and data-yearly attributes
        $section
          .find("[data-monthly][data-yearly], .grooming-pricing-card__desc")
          .fadeOut(200, function () {
            const newValue = isYearly
              ? $(this).attr("data-yearly")
              : $(this).attr("data-monthly");
            if (newValue !== undefined && newValue !== false) {
              $(this).text(newValue).fadeIn(200);
            } else {
              $(this).fadeIn(200);
            }
          });

        // 2. Update period text (/ Per Month vs / Per Year) for elements without explicit data attributes
        $section
          .find(".pricing-card__period, .grooming-pricing-card__period")
          .not("[data-monthly]")
          .fadeOut(200, function () {
            const newPeriod = isYearly ? "/ Per Year" : "/ Per Month";
            $(this).text(newPeriod).fadeIn(200);
          });
      },
    );
  }

  testimonialSlider();
  workingProcessSlider();
  pricingToggle();
  parentTestimonialSlider();
  beforeAfterSlider();
  boardingTestimonialSlider();

  //end the scripts
  if ($.exists("#tp-btn-black")) {
    const btn = document.querySelector(".tp-btn-black");
    const blur = document.querySelector("#btnBlur");

    let value = 0;
    let target = 0;

    function animateBlur() {
      value += (target - value) * 0.1;
      blur.setAttribute("stdDeviation", value);

      requestAnimationFrame(animateBlur);
    }

    animateBlur();

    btn.addEventListener("mouseenter", () => (target = 5));
    btn.addEventListener("mouseleave", () => (target = 0));
  }

  /*--------------------------------------------------------------
    16. Price Range Slider
  --------------------------------------------------------------*/
  if ($.exists(".sidebar__filter-slider")) {
    const $slider = $(".sidebar__filter-slider");
    const $track = $(".sidebar__filter-track");
    const $startBullet = $(".sidebar__filter-bullet--start");
    const $endBullet = $(".sidebar__filter-bullet--end");
    const $priceText = $(".sidebar__filter-price");

    let isDragging = null;

    const updateSlider = (bullet, clientX) => {
      const sliderRect = $slider[0].getBoundingClientRect();
      let percent = ((clientX - sliderRect.left) / sliderRect.width) * 100;
      percent = Math.min(Math.max(percent, 0), 100);

      let startPercent = parseFloat($startBullet[0].style.left) || 10;
      let endPercent = 100 - (parseFloat($endBullet[0].style.right) || 20);

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
        `Price : ${Math.round(startPercent * 2)}$ - ${Math.round(endPercent * 2)}$`,
      );
    };

    $(document).on("mousedown", ".sidebar__filter-bullet", function (e) {
      isDragging = $(this).hasClass("sidebar__filter-bullet--start")
        ? "start"
        : "end";
      $("body").addClass("user-select-none");
      e.preventDefault();
    });

    $(document).on("mousemove", function (e) {
      if (isDragging) {
        updateSlider(isDragging, e.clientX);
      }
    });

    $(document).on("mouseup", function () {
      if (isDragging) {
        isDragging = null;
        $("body").removeClass("user-select-none");
      }
    });
  }

  /*--------------------------------------------------------------
     Search Toggle and Box Creation
  --------------------------------------------------------------*/
  function initSearch() {
    const $searchBtn = $(".site-header__search-btn");
    const $searchContainer = $(".site-header__search-container");
    if ($searchBtn.length > 0 && $searchContainer.length > 0) {
      const $input = $searchContainer.find(".site-header__search-input");

      // Click behaviour on the search button
      $searchBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Toggle the active class
        $searchContainer.toggleClass("site-header__search-container--active");

        // If it was opened, focus the input
        if (
          $searchContainer.hasClass("site-header__search-container--active")
        ) {
          $input.focus();
        } else {
          // If closed and has query, redirect to search page
          const query = $input.val().trim();
          if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
          }
        }
      });

      // Prevent closing when clicking inside the input container
      $searchContainer.on("click", function (e) {
        e.stopPropagation();
      });

      // Submit query when pressing Enter key
      $input.on("keypress", function (e) {
        if (e.which === 13) {
          const query = $(this).val().trim();
          if (query) {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
          } else {
            // Close search if empty press enter
            $searchContainer.removeClass(
              "site-header__search-container--active",
            );
          }
        }
      });

      // Close when clicking outside of the search button and input
      $(document).on("click", function () {
        $searchContainer.removeClass("site-header__search-container--active");
      });

      // Close when pressing Escape key
      $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
          $searchContainer.removeClass("site-header__search-container--active");
          $input.blur();
        }
      });
    }
  }

  /*--------------------------------------------------------------
     Shop Page Client-Side Filter by Search Parameter
  --------------------------------------------------------------*/
  function handleShopSearchFilter() {
    if (window.location.pathname.includes("shop.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("search");
      if (searchQuery) {
        const query = searchQuery.trim().toLowerCase();

        // Filter the product cards
        const $products = $(".product-card");
        let matchCount = 0;

        $products.each(function () {
          const $card = $(this);
          const title = $card.find(".product-card__title").text().toLowerCase();

          if (title.indexOf(query) !== -1) {
            $card.show();
            matchCount++;
          } else {
            $card.hide();
          }
        });

        // Update product count label
        const $resultLabel = $(".shop__result-count");
        if ($resultLabel.length > 0) {
          $resultLabel.text(
            `|| Showing ${matchCount} result(s) for "${searchQuery}"`,
          );
        }
      }
    }
  }

  /*--------------------------------------------------------------
     Sidebar Category — selectable items
  --------------------------------------------------------------*/
  $(document).on("click", ".sidebar__category-item", function () {
    var $list = $(this).closest(".sidebar__category-list");
    $list
      .find(".sidebar__category-item")
      .removeClass("sidebar__category-item--active");
    $(this).addClass("sidebar__category-item--active");
  });

  /*--------------------------------------------------------------
     Mobile Menu Sidebar Functionality
  --------------------------------------------------------------*/
  function initMobileMenu() {
    // Check if mobile sidebar exists; if not, create it
    if ($(".mobile-sidebar").length === 0) {
      // Get logo source
      var logoSrc =
        $(".site-header__logo-img").attr("src") ||
        "assets/img/logo/logo-together.svg";
      var logoAlt = $(".site-header__logo-img").attr("alt") || "Patie Logo";

      // Build HTML structure
      var sidebarHtml = `
        <div class="mobile-sidebar">
          <div class="mobile-sidebar__header">
            <div class="mobile-sidebar__logo">
              <a href="index.html" class="mobile-sidebar__logo-link">
                <img src="${logoSrc}" alt="${logoAlt}" class="mobile-sidebar__logo-img">
              </a>
            </div>
            <button class="mobile-sidebar__close-btn" aria-label="Close menu">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="mobile-sidebar__content">
            <div class="mobile-sidebar__nav-wrapper"></div>
          </div>
        </div>
        <div class="mobile-sidebar-overlay"></div>
      `;

      $("body").append(sidebarHtml);

      // Clone & map index navigation links to the sidebar content
      var $clonedMenu = $(".site-header__menu").clone();

      // Clean up cloned structure: convert classes to mobile menu BEM classes to avoid desktop CSS side effects
      $clonedMenu.removeClass("site-header__menu").addClass("mobile-menu");

      $clonedMenu.find("> li").each(function () {
        var $item = $(this);
        $item.removeClass().addClass("mobile-menu__item");

        var $link = $item.find("> a");
        $link.removeClass().addClass("mobile-menu__link");

        // Remove hovered bg decor, bridges or submenu bg images
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

          // Append accordion trigger
          $item.append(
            '<button class="mobile-menu__toggle-btn" aria-label="Toggle submenu"><i class="fas fa-chevron-down"></i></button>',
          );
        }
      });

      $(".mobile-sidebar__nav-wrapper").append($clonedMenu);

      // Setup active states on the cloned items based on desktop active class
      $(".site-header__menu-item").each(function (index) {
        if ($(this).hasClass("site-header__menu-item--active")) {
          $(".mobile-menu__item")
            .eq(index)
            .addClass("mobile-menu__item--active");
        }
      });

      // Overlay & Close handlers
      $(".site-header__mobile-btn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".mobile-sidebar").addClass("mobile-sidebar--open");
        $(".mobile-sidebar-overlay").addClass("mobile-sidebar-overlay--open");
        $("body").addClass("overflow-hidden");
      });

      $(".mobile-sidebar__close-btn, .mobile-sidebar-overlay").on(
        "click",
        function (e) {
          e.preventDefault();
          $(".mobile-sidebar").removeClass("mobile-sidebar--open");
          $(".mobile-sidebar-overlay").removeClass(
            "mobile-sidebar-overlay--open",
          );
          $("body").removeClass("overflow-hidden");
        },
      );

      // Dropdown toggle accordion animation
      $(".mobile-menu__toggle-btn").on("click", function (e) {
        e.preventDefault();
        var $btn = $(this);
        var $submenu = $btn.siblings(".mobile-menu__submenu");
        var $parent = $btn.parent();

        // Slide toggle current
        $submenu.slideToggle(300);
        $parent.toggleClass("mobile-menu__item--open");
        $btn.find("i").toggleClass("fa-chevron-down fa-chevron-up");

        // Close others (accordion style)
        $parent.siblings(".mobile-menu__item--open").each(function () {
          var $sibling = $(this);
          $sibling.removeClass("mobile-menu__item--open");
          $sibling.find(".mobile-menu__submenu").slideUp(300);
          $sibling
            .find(".mobile-menu__toggle-btn i")
            .removeClass("fa-chevron-up")
            .addClass("fa-chevron-down");
        });
      });
    }
  }
})(jQuery);

if ($.exists(".working-process__item")) {
  const items = document.querySelectorAll(".working-process__item");

  // 👉 Page load fix (important)
  window.addEventListener("load", () => {
    const activeItem = document.querySelector(".working-process__item.active");

    if (activeItem) {
      const content = activeItem.querySelector(".working-process__content");
      content.style.height = content.scrollHeight + "px";

      content.addEventListener(
        "transitionend",
        function () {
          content.style.height = "auto";
        },
        { once: true },
      );
    }
  });

  // 👉 Click accordion logic (same)
  items.forEach((item) => {
    const btn = item.querySelector(".working-process__toggle");
    const content = item.querySelector(".working-process__content");

    btn.addEventListener("click", () => {
      // Close others
      items.forEach((otherItem) => {
        const otherContent = otherItem.querySelector(
          ".working-process__content",
        );

        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherContent.style.height = "0px";
        }
      });

      // Toggle current
      if (item.classList.contains("active")) {
        content.style.height = content.scrollHeight + "px";

        requestAnimationFrame(() => {
          content.style.height = "0px";
        });

        item.classList.remove("active");
      } else {
        item.classList.add("active");
        content.style.height = content.scrollHeight + "px";

        content.addEventListener(
          "transitionend",
          function () {
            content.style.height = "auto";
          },
          { once: true },
        );
      }
    });
  });
}

(function () {
  "use strict";

  const compare = document.querySelector(".tp-compare");
  if (!compare) return;

  const range = compare.querySelector(".tp-compare__range");

  range.addEventListener("input", (e) => {
    compare.style.setProperty("--pos", `${e.target.value}%`);
  });
})();

(function () {
  "use strict";

  const tooltip = document.getElementById("doctorTooltip");
  if (!tooltip) return;

  let hideTimer = null;
  let rafId = null;

  const showTooltip = (item) => {
    const rect = item.getBoundingClientRect();

    // set content safely
    tooltip.querySelector("img").src =
      item.dataset.img || "assets/img/avatars/doctor-toolt.png";
    tooltip.querySelector(".doctor-tooltip__name").textContent =
      item.dataset.name || "";
    tooltip.querySelector(".doctor-tooltip__deg").textContent =
      item.dataset.deg || "";

    // reset for correct height calc
    tooltip.style.left = "-9999px";
    tooltip.style.top = "-9999px";
    tooltip.classList.add("doctor-tooltip--active");

    cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const tooltipHeight = tooltip.offsetHeight;

      let left = rect.left + rect.width / 2 + window.scrollX;
      let top = rect.top + window.scrollY - tooltipHeight - 12;

      // 🔥 smart flip (top → bottom)
      if (top < window.scrollY) {
        top = rect.bottom + window.scrollY + 12;
        tooltip.classList.add("doctor-tooltip--bottom");
      } else {
        tooltip.classList.remove("doctor-tooltip--bottom");
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
    });
  };

  const hideTooltip = () => {
    tooltip.classList.remove("doctor-tooltip--active");
  };

  document.querySelectorAll(".cs-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      clearTimeout(hideTimer);
      showTooltip(item);
    });

    item.addEventListener("mouseleave", () => {
      hideTimer = setTimeout(() => {
        if (!tooltip.matches(":hover")) {
          hideTooltip();
        }
      }, 120);
    });
  });

  tooltip.addEventListener("mouseenter", () => {
    clearTimeout(hideTimer);
  });

  tooltip.addEventListener("mouseleave", () => {
    hideTooltip();
  });
})();

/*--------------------------------------------------------------
  10. Shop Details Functionality
----------------------------------------------------------------*/
(function () {
  "use strict";

  // Color Picker
  const colorBtns = document.querySelectorAll(
    ".shop-details__color-picker-btn",
  );
  if (colorBtns.length > 0) {
    colorBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        colorBtns.forEach((b) =>
          b.classList.remove("shop-details__color-picker-btn--active"),
        );
        btn.classList.add("shop-details__color-picker-btn--active");
      });
    });
  }

  // Gallery Thumbnails
  const thumbItems = document.querySelectorAll(".shop-details__thumb-item");
  const mainImg = document.querySelector(".shop-details__main-img");
  if (thumbItems.length > 0 && mainImg) {
    thumbItems.forEach((item) => {
      item.addEventListener("click", () => {
        const newSrc = item.querySelector("img").src;
        mainImg.src = newSrc;
        thumbItems.forEach((i) =>
          i.classList.remove("shop-details__thumb-item--active"),
        );
        item.classList.add("shop-details__thumb-item--active");
      });
    });
  }

  // Quantity Selector (Generic)
  const quantityGroups = document.querySelectorAll(
    ".shop-details__quantity, .cart__quantity",
  );

  // Store original values for cart inputs so we can detect changes
  const updateBtn = document.querySelector(".cart__update-btn");
  const originalValues = new Map();
  quantityGroups.forEach((group) => {
    const input = group.querySelector("input");
    if (input && group.closest(".cart__quantity")) {
      originalValues.set(input, parseInt(input.value));
    }
  });

  function syncUpdateBtn() {
    if (!updateBtn) return;
    const hasChange = Array.from(originalValues.entries()).some(
      ([input, orig]) => parseInt(input.value) !== orig,
    );
    if (hasChange) {
      updateBtn.classList.add("cart__update-btn--active");
    } else {
      updateBtn.classList.remove("cart__update-btn--active");
    }
  }

  quantityGroups.forEach((group) => {
    const input = group.querySelector("input");
    const up = group.querySelector(
      ".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type",
    );
    const down = group.querySelector(
      ".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type",
    );

    if (input && up && down) {
      up.addEventListener("click", (e) => {
        e.preventDefault();
        input.value = parseInt(input.value) + 1;
        syncUpdateBtn();
      });

      down.addEventListener("click", (e) => {
        e.preventDefault();
        const val = parseInt(input.value);
        if (val > 1) {
          input.value = val - 1;
        }
        syncUpdateBtn();
      });
    }
  });

  // Remove Item from Cart
  const removeBtns = document.querySelectorAll(".cart__remove");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const row = btn.closest("tr");
      if (row) {
        row.style.transition = "all 0.3s ease";
        row.style.opacity = "0";
        setTimeout(() => {
          row.remove();
        }, 300);
      }
    });
  });
})();

// ── service-btn dashed-circle deceleration on mouse-leave ───────────────────
// Uses event delegation on document so Swiper-cloned slides work automatically.
(function () {
  const FAST_SPEED = 20; // px per second while hovered

  // Per-button state keyed by the circle element itself
  const state = new WeakMap();

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
    const s = getState(circle);
    if (s.isHovered) return;

    if (!s.lastTime) s.lastTime = timestamp;
    const elapsed = timestamp - s.lastTime;
    s.lastTime = timestamp;

    s.currentSpeed *= Math.pow(0.7, elapsed / 100);

    if (s.currentSpeed < 0.3) {
      circle.style.animation = "marchServiceDashes 8s linear infinite";
      circle.style.strokeDashoffset = "";
      s.rafId = null;
      return;
    }

    const current = parseFloat(circle.style.strokeDashoffset) || 0;
    circle.style.strokeDashoffset = current - (s.currentSpeed * elapsed) / 1000;
    s.rafId = requestAnimationFrame((ts) => decelLoop(circle, ts));
  }

  document.addEventListener(
    "mouseenter",
    function (e) {
      if (!(e.target instanceof Element)) return;
      const btn = e.target.closest(".service-btn");
      if (!btn) return;
      const circle = btn.querySelector(".service-btn__dashed-circle circle");
      if (!circle) return;

      const s = getState(circle);
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
  ); // capture phase so it fires on every element including clones

  document.addEventListener(
    "mouseleave",
    function (e) {
      if (!(e.target instanceof Element)) return;
      const btn = e.target.closest(".service-btn");
      if (!btn) return;
      const circle = btn.querySelector(".service-btn__dashed-circle circle");
      if (!circle) return;

      const s = getState(circle);
      s.isHovered = false;

      // Snapshot current offset and kill CSS animation
      const offset = parseFloat(getComputedStyle(circle).strokeDashoffset) || 0;
      circle.style.animation = "none";
      circle.style.strokeDashoffset = offset;

      s.currentSpeed = FAST_SPEED;
      s.lastTime = null;
      s.rafId = requestAnimationFrame((ts) => decelLoop(circle, ts));
    },
    true,
  ); // capture phase
})();

/* =====================================================
   Preloader dismissal
   Matches the CSS in assets/css/preloader.css.
   MIN_DISPLAY ensures at least one full animation
   cycle (~0.93 s × 3 ≈ 2.8 s) is always visible.
   ===================================================== */
(function () {
  var preloader = document.getElementById("preloader");
  if (!preloader) return;

  var scriptStart = Date.now();
  var MIN_DISPLAY = 2500;

  function dismiss() {
    preloader.classList.add("preloader--hidden");

    // After the CSS fade-out transition completes, set display:none
    // so the overlay can never block clicks or hover events.
    preloader.addEventListener("transitionend", function handler() {
      preloader.removeEventListener("transitionend", handler);
      preloader.classList.add("preloader--done");
      // Signal that the preloader is fully gone so AOS can start
      document.dispatchEvent(new CustomEvent("preloaderDone"));
    });

    // Fallback for prefers-reduced-motion or browsers that skip transitionend.
    setTimeout(function () {
      preloader.classList.add("preloader--done");
      document.dispatchEvent(new CustomEvent("preloaderDone"));
    }, 1000);
  }

  window.addEventListener("load", function () {
    var elapsed = Date.now() - scriptStart;
    var remaining = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(dismiss, remaining);
  });
})();

/*--------------------------------------------------------------
    Sign In — Password show/hide toggle
  --------------------------------------------------------------*/
$(function () {
  $(".sign-in__eye-toggle").on("click", function () {
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
});

/*--------------------------------------------------------------
    Sign Up — Password show/hide toggle
  --------------------------------------------------------------*/
$(function () {
  $(".sign-up__eye-toggle").on("click", function () {
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
});

/*--------------------------------------------------------------
    Password Reset — OTP input auto-advance, backspace, paste
  --------------------------------------------------------------*/
$(function () {
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
});
