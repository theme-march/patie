(function ($) {
  ("use strict");

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
    AOS.init();
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
  });

  $(window).on("scroll", function () {
    showScrollUp();
  });



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
      '<span class="ak-munu_dropdown_toggle"></span>'
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
      '<span class="ak-munu_dropdown_toggle_1"></span>'
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
    var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    var $menuItems = $('.site-header__menu-item');
    var $targetItem = null;

    // First: try to match via submenu links (covers cart.html, checkout.html, etc.)
    $menuItems.each(function () {
      var $item = $(this);
      $item.find('.site-header__submenu-link').each(function () {
        var href = $(this).attr('href') || '';
        var linkPage = href.substring(href.lastIndexOf('/') + 1);
        if (linkPage === page) {
          $targetItem = $item;
          return false;
        }
      });
      if ($targetItem) return false;
    });

    // Second: if no submenu matched, try the top-level link href
    if (!$targetItem) {
      $menuItems.each(function () {
        var $item = $(this);
        var href = $item.find('> .site-header__menu-link').attr('href') || '';
        var linkPage = href.substring(href.lastIndexOf('/') + 1);
        if (linkPage === page) {
          $targetItem = $item;
          return false;
        }
      });
    }

    // Only apply class change and style injection if the correct item is not already active
    if ($targetItem && !$targetItem.hasClass('site-header__menu-item--active')) {
      var $noTransStyle = $('<style id="nav-no-transition">' +
        '.site-header__menu-bg, .site-header__menu-item { transition: none !important; }' +
        '</style>');
      $('head').append($noTransStyle);

      $('.site-header__menu-item').removeClass('site-header__menu-item--active');
      $targetItem.addClass('site-header__menu-item--active');

      setTimeout(function () {
        $noTransStyle.remove();
      }, 50);
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
    var $spacer = $('<div class="ak-sticky-spacer" style="display: none;"></div>');
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
          var $noTransStyle = $('<style id="sticky-no-transition">.site-header { transition: none !important; }</style>');
          $('head').append($noTransStyle);
          
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
          var isOut = $header.css("position") === "absolute" || $header.css("position") === "fixed";
          if (!isOut) {
            $spacer.css({
              "height": $header.outerHeight() + "px",
              "display": "block",
              "width": "100%"
            });
          }
          
          var $noTransStyle = $('<style id="sticky-no-transition">.site-header { transition: none !important; }</style>');
          $('head').append($noTransStyle);

          $header.addClass("ak-gescout_sticky");
          
          setTimeout(function () {
             $noTransStyle.remove();
          }, 50);
        }

        if (windowTop < lastScrollTop) {
          $header.addClass("ak-gescout_show");    // Scrolling UP → reveal
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
            spaceBetween: 20
          },
          576: {
            slidesPerView: 1,
            spaceBetween: 25
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 25
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30
          }
        }
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
        `https://www.youtube.com/embed/${video}`
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
        0
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
          $(this).find(".faq-accordion__icon i").removeClass("fa-minus").addClass("fa-plus");
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
      $(this).find(".faq-accordion__icon i").removeClass("fa-plus").addClass("fa-minus");
    });
  }


  /*--------------------------------------------------------------
     Testimonial Slider
  --------------------------------------------------------------*/
  function testimonialSlider() {
    let currentIndex = 1; // Starting with the middle one (index 1)
    const totalAvatars = $(".testimonial__avatar").length;

    function updateTestimonial(index) {
      // Fade out and back in to simulate content change
      $(".testimonial__card").fadeOut(300, function () {
        // Update Avatars Border
        $(".testimonial__avatar").removeClass("testimonial__avatar--middle");
        $(".testimonial__avatar").eq(index).addClass("testimonial__avatar--middle");
        $(this).fadeIn(300);
      });
    }

    $(".testimonial__nav--next").on("click", function () {
      currentIndex = (currentIndex + 1) % totalAvatars;
      updateTestimonial(currentIndex);
    });

    $(".testimonial__nav--prev").on("click", function () {
      currentIndex = (currentIndex - 1 + totalAvatars) % totalAvatars;
      updateTestimonial(currentIndex);
    });

    // Also switch on avatar click
    $(".testimonial__avatar").on("click", function () {
      currentIndex = $(this).index();
      updateTestimonial(currentIndex);
    });
  }

  function parentTestimonialSlider() {
    let currentIndex = 1; // Middle avatar (index 1)
    const totalAvatars = $(".parent-testimonial__avatar").length;

    function updateTestimonial(index) {
      if (totalAvatars === 0) return;

      // Update Highlight Immediately
      $(".parent-testimonial__avatar").removeClass("parent-testimonial__avatar--center").addClass("parent-testimonial__avatar--side");
      $(".parent-testimonial__avatar").eq(index).removeClass("parent-testimonial__avatar--side").addClass("parent-testimonial__avatar--center");

      // Animate Content
      $(".parent-testimonial__content").fadeOut(300, function () {
        // In a real app, you'd change the text/name here.
        // For demonstration, we just fade back in.
        $(this).fadeIn(300);
      });
    }

    $(".parent-testimonial__nav--next").on("click", function () {
      currentIndex = (currentIndex + 1) % totalAvatars;
      updateTestimonial(currentIndex);
    });

    $(".parent-testimonial__nav--prev").on("click", function () {
      currentIndex = (currentIndex - 1 + totalAvatars) % totalAvatars;
      updateTestimonial(currentIndex);
    });

    $(".parent-testimonial__avatar").on("click", function () {
      currentIndex = $(this).index();
      updateTestimonial(currentIndex);
    });
  }

  function beforeAfterSlider() {
    let currentIndex = 1; // Starting with the active dot (index 2)
    const dots = $(".before-and-after__dot");
    const totalDots = dots.length;
    const img = $(".before-and-after__img");

    if (totalDots === 0) return;

    setInterval(function () {
      currentIndex = (currentIndex + 1) % totalDots;

      // Update Dots
      dots.removeClass("before-and-after__dot--active");
      dots.eq(currentIndex).addClass("before-and-after__dot--active");

      // Animate Image swap (even if it's the same one, we simulate the effect)
      img.fadeOut(400, function () {
        // Here you could change img src if you had multiple
        $(this).fadeIn(400);
      });
    }, 3000);

    // Allow manual click on dots
    dots.on("click", function () {
      currentIndex = $(this).index();
      dots.removeClass("before-and-after__dot--active");
      $(this).addClass("before-and-after__dot--active");
      
      img.fadeOut(400, function () {
        $(this).fadeIn(400);
      });
    });
  }

  function boardingTestimonialSlider() {
    const $prevBtn = $(".boarding-testimonial__nav-btn--prev");
    const $nextBtn = $(".boarding-testimonial__nav-btn--next");
    const $content = $(".boarding-testimonial__right");

    function updateContent() {
      // Fade out the items that should change
      // Specifically the avatar, name, role, main text and stars
      $(".boarding-testimonial__avatar, .boarding-testimonial__name, .boarding-testimonial__role, .boarding-testimonial__text, .boarding-testimonial__stars").fadeOut(300, function () {
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
    const $badge = $(".working-process__badge");
    const $title = $(".working-process__slide-title");
    const $sliderContent = $(".working-process__slider");

    function updateStep(index) {
      $sliderContent.fadeOut(300, function () {
        $badge.text(index.toString().padStart(2, "0"));
        const currentTitle = $title.text().trim();
        const newTitle = currentTitle.replace(/^\d+/, index.toString().padStart(2, "0"));
        $title.text(newTitle);
        const progressPos = ((index - 1) / totalSteps) * 100;
        $progress.css("left", progressPos + "%");
        $(this).fadeIn(300);
      });
    }

    $(".working-process__nav-btn").eq(1).on("click", function () {
      currentIndex = currentIndex < totalSteps ? currentIndex + 1 : 1;
      updateStep(currentIndex);
    });

    $(".working-process__nav-btn").eq(0).on("click", function () {
      currentIndex = currentIndex > 1 ? currentIndex - 1 : totalSteps;
      updateStep(currentIndex);
    });
  }

  function pricingToggle() {
    $(".pricing__toggle-btn, .grooming-pricing__toggle-btn").on("click", function () {
      const $this = $(this);
      const isGrooming = $this.hasClass("grooming-pricing__toggle-btn");
      const btnClass = isGrooming ? "grooming-pricing__toggle-btn" : "pricing__toggle-btn";
      const priceClass = isGrooming ? ".grooming-pricing-card__price" : ".pricing-card__price";

      if ($this.hasClass(`${btnClass}--active`)) return;

      // Toggle Active Class
      $(`.${btnClass}`).removeClass(`${btnClass}--active`).addClass(`${btnClass}--inactive`);
      $this.removeClass(`${btnClass}--inactive`).addClass(`${btnClass}--active`);

      const isYearly = $this.text().trim() === "YEARLY";

      // Update Prices with Animation
      $(priceClass).fadeOut(200, function () {
        const newPrice = isYearly ? $(this).data("yearly") : $(this).data("monthly");
        $(this).text(newPrice).fadeIn(200);
      });
    });
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

    btn.addEventListener("mouseenter", () => target = 5);
    btn.addEventListener("mouseleave", () => target = 0);
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
          $endBullet.css("right", (100 - percent) + "%");
          $track.css("right", (100 - percent) + "%");
          endPercent = percent;
        }
      }

      $priceText.text(`Price : ${Math.round(startPercent * 2)}$ - ${Math.round(endPercent * 2)}$`);
    };

    $(document).on("mousedown", ".sidebar__filter-bullet", function (e) {
      isDragging = $(this).hasClass("sidebar__filter-bullet--start") ? "start" : "end";
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
        if ($searchContainer.hasClass("site-header__search-container--active")) {
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
            $searchContainer.removeClass("site-header__search-container--active");
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
          $resultLabel.text(`|| Showing ${matchCount} result(s) for "${searchQuery}"`);
        }
      }
    }
  }

  /*--------------------------------------------------------------
     Mobile Menu Sidebar Functionality
  --------------------------------------------------------------*/
  function initMobileMenu() {
    // Check if mobile sidebar exists; if not, create it
    if ($(".mobile-sidebar").length === 0) {
      // Get logo source
      var logoSrc = $(".site-header__logo-img").attr("src") || "assets/img/logo/logo-together.svg";
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
      
      $clonedMenu.find("> li").each(function() {
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
          
          $submenu.find("li").removeClass().addClass("mobile-menu__submenu-item");
          $submenu.find("a").removeClass().addClass("mobile-menu__submenu-link");
          
          // Append accordion trigger
          $item.append('<button class="mobile-menu__toggle-btn" aria-label="Toggle submenu"><i class="fas fa-chevron-down"></i></button>');
        }
      });
      
      $(".mobile-sidebar__nav-wrapper").append($clonedMenu);
      
      // Setup active states on the cloned items based on desktop active class
      $(".site-header__menu-item").each(function(index) {
        if ($(this).hasClass("site-header__menu-item--active")) {
          $(".mobile-menu__item").eq(index).addClass("mobile-menu__item--active");
        }
      });
      
      // Overlay & Close handlers
      $(".site-header__mobile-btn").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".mobile-sidebar").addClass("mobile-sidebar--open");
        $(".mobile-sidebar-overlay").addClass("mobile-sidebar-overlay--open");
        $("body").addClass("overflow-hidden");
      });
      
      $(".mobile-sidebar__close-btn, .mobile-sidebar-overlay").on("click", function(e) {
        e.preventDefault();
        $(".mobile-sidebar").removeClass("mobile-sidebar--open");
        $(".mobile-sidebar-overlay").removeClass("mobile-sidebar-overlay--open");
        $("body").removeClass("overflow-hidden");
      });
      
      // Dropdown toggle accordion animation
      $(".mobile-menu__toggle-btn").on("click", function(e) {
        e.preventDefault();
        var $btn = $(this);
        var $submenu = $btn.siblings(".mobile-menu__submenu");
        var $parent = $btn.parent();
        
        // Slide toggle current
        $submenu.slideToggle(300);
        $parent.toggleClass("mobile-menu__item--open");
        $btn.find("i").toggleClass("fa-chevron-down fa-chevron-up");
        
        // Close others (accordion style)
        $parent.siblings(".mobile-menu__item--open").each(function() {
          var $sibling = $(this);
          $sibling.removeClass("mobile-menu__item--open");
          $sibling.find(".mobile-menu__submenu").slideUp(300);
          $sibling.find(".mobile-menu__toggle-btn i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
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
        { once: true }
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
        const otherContent = otherItem.querySelector(".working-process__content");

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
          { once: true }
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
    tooltip.querySelector("img").src = item.dataset.img || "assets/img/avatars/doctor-toolt.png";
    tooltip.querySelector(".doctor-tooltip__name").textContent = item.dataset.name || "";
    tooltip.querySelector(".doctor-tooltip__deg").textContent = item.dataset.deg || "";

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

  document.querySelectorAll(".cs-item").forEach(item => {

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
  const colorBtns = document.querySelectorAll(".shop-details__color-picker-btn");
  if (colorBtns.length > 0) {
    colorBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        colorBtns.forEach((b) => b.classList.remove("shop-details__color-picker-btn--active"));
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
        thumbItems.forEach((i) => i.classList.remove("shop-details__thumb-item--active"));
        item.classList.add("shop-details__thumb-item--active");
      });
    });
  }

  // Quantity Selector (Generic)
  const quantityGroups = document.querySelectorAll(".shop-details__quantity, .cart__quantity");
  quantityGroups.forEach(group => {
    const input = group.querySelector("input");
    const up = group.querySelector(".shop-details__quantity-btn:first-of-type, .cart__quantity-btn:first-of-type");
    const down = group.querySelector(".shop-details__quantity-btn:last-of-type, .cart__quantity-btn:last-of-type");

    if (input && up && down) {
      up.addEventListener("click", (e) => {
        e.preventDefault();
        input.value = parseInt(input.value) + 1;
      });

      down.addEventListener("click", (e) => {
        e.preventDefault();
        const val = parseInt(input.value);
        if (val > 1) {
          input.value = val - 1;
        }
      });
    }
  });

  // Remove Item from Cart
  const removeBtns = document.querySelectorAll(".cart__remove");
  removeBtns.forEach(btn => {
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
