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

  // Register GSAP plugins globally (required for ScrollTrigger & SplitText)
  gsap.registerPlugin(ScrollTrigger, SplitText);

  $(window).on("load", function () {
    $(window).trigger("scroll");
    $(window).trigger("resize");
    // preloader();
    AOS.init();
    heroAnimations();
    aboutAnimations();
    serviceAnimations();
    videoAnimations();
    testimonialAnimations();
    teamAnimations();
    workingProcessAnimations();
    pricingAnimations();
    chooseUsAnimations();
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
   * HERO ANIMATIONS
   * Uses GSAP + SplitText for a premium entrance sequence.
   * Plays once on window load (above-the-fold, no ScrollTrigger needed).
   *-------------------------------------------------*/

  function heroAnimations() {
    // Only run on pages that actually have a hero section
    if (!document.querySelector(".hero")) return;

    // Register GSAP plugin
    gsap.registerPlugin(SplitText);

    // ── Safety net: guarantee buttons are always visible ─────────────────────
    // GSAP `from()` sets opacity:0 immediately. If the timeline ever errors out,
    // this fallback fires after 2s to make sure nothing stays hidden.
    var safetyTimer = setTimeout(function () {
      gsap.set(".hero__actions .common-btn, .hero__subtitle, .hero__title, .hero__paws-rating", {
        clearProps: "all",
      });
    }, 2000);

    // ── 1. SplitText: split the title into words ──────────────────────────────
    var titleEl = document.querySelector(".hero__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) {
      splitTitle = null;
    }

    // ── 2. Build the main GSAP timeline (all positions are ABSOLUTE seconds) ──
    var tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () {
        // Clear safety timer — animation completed cleanly
        clearTimeout(safetyTimer);
        // Revert any inline styles GSAP left on split words so CSS takes over
        if (splitTitle) splitTitle.revert();
      },
    });

    // ── 3. Floating shapes: pop in, then CSS loops take over ──────────────────
    tl.from(
      [".hero__shape--bone", ".hero__shape--paw", ".hero__shape--bowl", ".hero__shape--ball"],
      { opacity: 0, scale: 0.3, duration: 0.6, stagger: 0.1, ease: "back.out(2)" },
      0
    );

    // ── 4. Avatar images: stagger left-to-right ───────────────────────────────
    tl.from(
      ".hero__avatar-img",
      { opacity: 0, x: -12, scale: 0.7, duration: 0.5, stagger: 0.08, ease: "back.out(1.8)" },
      0.2
    );

    // ── 5. Rating text: fade up ───────────────────────────────
    tl.from(".hero__rating-text", { opacity: 0, y: 15, duration: 0.5 }, 0.4);

    // ── 6. Title: word-by-word cascade (SplitText) ───────────────────────────
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(
        splitTitle.words,
        {
          opacity: 0,
          y: 60,
          rotateX: -20,
          transformOrigin: "0% 50% -20",
          duration: 0.75,
          stagger: 0.06,
          ease: "power4.out",
        },
        0.45
      );
      // Subtle colour-span pulse — at a FIXED time, NOT relative to yoyo
      tl.fromTo(
        ".hero__title span",
        { scale: 1 },
        { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" },
        1.6  // fixed timestamp: well after last word lands
      );
    } else {
      // Fallback if SplitText unavailable
      tl.from(".hero__title", { opacity: 0, y: 50, duration: 0.8 }, 0.45);
    }

    // ── 7. Subtitle: fade up — FIXED timestamp ────────────────────────────────
    tl.from(".hero__subtitle", { opacity: 0, y: 25, duration: 0.65 }, 1.25);

    // ── 8. CTA Buttons: pop in — FIXED timestamp ──────────────────────────────
    tl.from(
      ".hero__actions .common-btn",
      {
        opacity: 0,
        scale: 0.82,
        y: 15,
        duration: 0.55,
        stagger: 0.15,
        ease: "back.out(1.7)",
        clearProps: "opacity,transform",  // ensure final state is clean
      },
      1.45
    );

    // ── 9. Cat slides in from left ────────────────────────────────────────────
    tl.from(
      ".hero__image-cat",
      {
        opacity: 0,
        x: -160,
        duration: 1,
        ease: "back.out(1.4)",
      },
      0.3 // concurrent with content start
    );

    // ── 10. Dog slides in from right ─────────────────────────────────────────
    tl.from(
      ".hero__image-dog",
      { opacity: 0, x: 160, duration: 1, ease: "back.out(1.4)" },
      0.4
    );
  }

  /*-------------------------------------------------
   * ABOUT US ANIMATIONS
   * ScrollTrigger-activated entrance animations.
   * Features a premium clip-path curtain reveal, and GSAP counter rollup.
   *-------------------------------------------------*/

  function aboutAnimations() {
    if (!document.querySelector(".about")) return;

    // Safety net: clean up target values if animation fails
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".about__image-main-wrap, .about__mission-card, .about__pet-deco, .about__sofa-deco .about__sofa-img, .about__content-col .section-header__paw, .about__content-col .section-header__label, .about__content-col .section-header__title, .about__stat-item, .about__description, .about__button .common-btn",
        { clearProps: "all" }
      );
    }, 4000);

    // Initial setup for the clip-path image wrap
    gsap.set(".about__image-main-wrap", { clipPath: "inset(100% 0% 0% 0%)" });

    // Handle SplitText for About heading
    var headingEl = document.querySelector(".about__content-col .section-header__title");
    var splitHeading = null;
    try {
      if (headingEl && typeof SplitText !== "undefined") {
        splitHeading = new SplitText(headingEl, { type: "lines" });
      }
    } catch (e) {
      splitHeading = null;
    }

    // Main Timeline
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitHeading) splitHeading.revert();
        // Counter roll-up animation trigger
        animateCounters();
      }
    });

    // 1. Left image curtain wipe
    tl.to(
      ".about__image-main-wrap",
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.95,
        ease: "power3.out",
      },
      0
    );

    // 2. Mission card slide up
    tl.from(
      ".about__mission-card",
      {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: "power3.out",
      },
      0.2
    );

    // 3. Paw icon & label
    tl.from(
      ".about__content-col .section-header__paw",
      {
        rotate: -30,
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "back.out(2)",
      },
      0.15
    );
    tl.from(
      ".about__content-col .section-header__label",
      {
        x: -15,
        opacity: 0,
        duration: 0.5,
      },
      0.25
    );

    // 4. Heading line reveal
    if (splitHeading && splitHeading.lines && splitHeading.lines.length) {
      tl.from(
        splitHeading.lines,
        {
          opacity: 0,
          y: 40,
          rotateX: -10,
          transformOrigin: "0% 50% -20",
          duration: 0.75,
          stagger: 0.12,
          ease: "power4.out",
        },
        0.3
      );
    } else {
      tl.from(
        ".about__content-col .section-header__title",
        {
          opacity: 0,
          y: 35,
          duration: 0.75,
        },
        0.3
      );
    }

    // 5. Stat items fade up
    tl.from(
      ".about__stat-item",
      {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      },
      0.55
    );

    // 6. Description & Button
    tl.from(
      ".about__description",
      {
        opacity: 0,
        y: 20,
        duration: 0.65,
      },
      0.85
    );
    tl.from(
      ".about__button .common-btn",
      {
        opacity: 0,
        scale: 0.85,
        y: 12,
        duration: 0.55,
        ease: "back.out(1.7)",
        clearProps: "opacity,transform",
      },
      0.95
    );

    // 7. Decorative Background Images
    tl.from(
      ".about__pet-deco",
      {
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power2.out",
      },
      0.1
    );
    tl.from(
      ".about__sofa-deco .about__sofa-img",
      {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power2.out",
      },
      0.3
    );
  }

  // Helper function for counter rollup animation
  function animateCounters() {
    var targets = document.querySelectorAll(".about__stat-item .stat-number");
    targets.forEach(function (el) {
      var text = el.innerText.trim();
      var numMatch = text.match(/^([0-9.]+)(.*)$/);
      if (!numMatch) return;

      var targetVal = parseFloat(numMatch[1]);
      var suffix = numMatch[2] || "";
      var obj = { val: 0 };

      gsap.to(obj, {
        val: targetVal,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: function () {
          // Format integers or floats nicely
          var formatted = Math.floor(obj.val);
          el.innerText = formatted + suffix;
        }
      });
    });
  }

  /*-------------------------------------------------
   * SERVICES ANIMATIONS
   * ScrollTrigger-activated card staggering.
   * Features interleaved odd/even horizontal sliding.
   *-------------------------------------------------*/

  function serviceAnimations() {
    if (!document.querySelector(".service")) return;

    // Safety net fallback
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".service-card, .service__section-title .section-header__paw, .service__section-title .section-header__label, .service__section-title .section-header__title",
        { clearProps: "all" }
      );
    }, 4000);

    // Split text on service title
    var titleEl = document.querySelector(".service__section-title .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) {
      splitTitle = null;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".service",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Paws pop-in
    tl.from(
      ".service__section-title .section-header__paw",
      {
        opacity: 0,
        scale: 0.3,
        rotation: function (i) { return i === 0 ? -30 : 30; },
        x: function (i) { return i === 0 ? -30 : 30; },
        duration: 0.55,
        ease: "back.out(2)",
      },
      0
    );

    // 2. Label fade down
    tl.from(
      ".service__section-title .section-header__label",
      {
        opacity: 0,
        y: -15,
        duration: 0.5,
      },
      0.1
    );

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(
        splitTitle.words,
        {
          opacity: 0,
          y: 35,
          duration: 0.7,
          stagger: 0.05,
          ease: "power4.out",
        },
        0.2
      );
    } else {
      tl.from(
        ".service__section-title .section-header__title",
        {
          opacity: 0,
          y: 30,
          duration: 0.7,
        },
        0.2
      );
    }

    // 4. Staggered Alternating Cards Reveal
    var cards = Array.from(document.querySelectorAll(".service-card"));
    var oddCards = cards.filter(function (_, i) { return i % 2 === 0; }); // index 0,2,4,6 (Odd visual cards 1,3,5,7)
    var evenCards = cards.filter(function (_, i) { return i % 2 !== 0; }); // index 1,3,5,7 (Even visual cards 2,4,6,8)

    // Odd cards enter from Left (x: -60)
    tl.from(
      oddCards,
      {
        opacity: 0,
        x: -60,
        y: 30,
        scale: 0.95,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      },
      0.65
    );

    // Even cards enter from Right (x: 60)
    tl.from(
      evenCards,
      {
        opacity: 0,
        x: 60,
        y: 30,
        scale: 0.95,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all",
      },
      0.75
    );
  }

  /*-------------------------------------------------
   * VIDEO SECTION ANIMATIONS
   * ScrollTrigger-activated play button & parallax.
   * Features horizontal text drift, vertical bg offset, and scale-up entrance.
   *-------------------------------------------------*/

  function videoAnimations() {
    if (!document.querySelector(".video-section")) return;

    // 1. Watermark fade-in (play-once on section enter)
    gsap.from(".video-section__bg-text", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".video-section",
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });

    // 2. Parallax vertical offset on BG Image (scrub — tied to scroll)
    gsap.fromTo(
      ".video-section__bg-img",
      { y: 0 },
      {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".video-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    );

    // 3. Parallax horizontal offset on Watermark Text (scrub — tied to scroll)
    gsap.fromTo(
      ".video-section__bg-text",
      { x: -40 },
      {
        x: 40,
        ease: "none",
        scrollTrigger: {
          trigger: ".video-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      }
    );
  }

  /*-------------------------------------------------
   * TESTIMONIAL ANIMATIONS
   * ScrollTrigger-activated typographic slide cascades.
   * Features scaling backdrops, sliding nav controls, and staggered avatars.
   *-------------------------------------------------*/

  function testimonialAnimations() {
    if (!document.querySelector(".testimonial")) return;

    // Safety fallback
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".testimonial__bg, .testimonial__bg-outline, .testimonial__nav, .testimonial__rating, .testimonial__text, .testimonial__quote-icon, .testimonial__author, .testimonial__avatar",
        { clearProps: "all" }
      );
    }, 4000);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonial",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
      }
    });

    // 1. Backgrounds scale in (using individual CSS scale property to protect absolute position translates)
    tl.from(
      [".testimonial__bg-outline", ".testimonial__bg"],
      {
        scale: 0.75,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power2.out",
      },
      0
    );

    // 2. Navigation slide-in
    tl.from(
      ".testimonial__nav--prev",
      {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      0.3
    );

    tl.from(
      ".testimonial__nav--next",
      {
        x: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      0.3
    );

    // 3. Review content cascades
    tl.from(
      ".testimonial__rating",
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(2)",
      },
      0.5
    );

    tl.from(
      ".testimonial__text",
      {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      0.65
    );

    tl.from(
      ".testimonial__quote-icon",
      {
        y: -20,
        rotation: -15,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.5)",
      },
      0.85
    );

    tl.from(
      ".testimonial__author",
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      1.0
    );

    // 4. Avatars scale in left-to-right staggered
    tl.from(
      ".testimonial__avatar",
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "back.out(2.2)",
        // Clear inline overrides so CSS hover scale(1.1) takes over cleanly
        clearProps: "scale,opacity",
      },
      1.2
    );
  }

  /*-------------------------------------------------
   * TEAM ANIMATIONS
   * ScrollTrigger-activated team member card cascades.
   * Introduces headers and team grids with back easing curves.
   *-------------------------------------------------*/

  function teamAnimations() {
    if (!document.querySelector(".team")) return;

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".team",
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });

    // ── 1. Header left block — wipe reveal and slide-up elements
    tl.from(
      ".team__header-left .section-header__paw, .team__header-left .section-header__label",
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      },
      0
    );

    tl.from(
      ".team__header-left .section-header__title",
      {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      0.15
    );

    // ── 2. Header right — "Explore All Team" button elastic slide from right
    tl.from(
      ".team__header-right",
      {
        x: 50,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2.2)",
        clearProps: "transform,opacity",
      },
      0.3
    );

    // ── 3. Card body (colored rectangle) slides UP from below — staggered
    // These arrive first, setting the stage
    tl.from(
      ".team .team-card__content",
      {
        y: 90,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      },
      0.5
    );

    // ── 4. Card photo wraps DROP FROM ABOVE with a bounce — staggered to match cards
    // The image arrives after the card body, "landing" into position
    // This "self-assembly" sequence is the premium feel
    tl.from(
      ".team .team-card__img-wrap",
      {
        y: -70,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "back.out(2)",
        clearProps: "transform,opacity",
      },
      0.65
    );
  }

  /*-------------------------------------------------
   * WORKING PROCESS ANIMATIONS
   * ScrollTrigger-activated form, split-dividers, and slides.
   * Features falling/rising dividers, form row staggers, and vector scrub.
   *-------------------------------------------------*/

  function workingProcessAnimations() {
    if (!document.querySelector(".working-process")) return;

    // Safety fallback
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".working-process__divider-part--upper, .working-process__divider-part--lower, .working-process__form-row, .working-process__submit, .working-process__right .section-header, .working-process__right .section-header__title, .working-process__image-box, .working-process__badge, .working-process__slide-title, .working-process__slide-desc, .working-process__slider-nav",
        { clearProps: "all" }
      );
    }, 5000);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".working-process",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
      }
    });

    // 1. Center split-divider parts (upper drops down, lower rises up)
    tl.from(
      ".working-process__divider-part--upper",
      {
        yPercent: -100,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      0
    );

    tl.from(
      ".working-process__divider-part--lower",
      {
        yPercent: 100,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      },
      0
    );

    // 2. Background vector slow parallax scrub drift (tied to scrolling)
    gsap.fromTo(
      ".working-process__bg-vector",
      { y: -30 },
      {
        y: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".working-process",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        }
      }
    );

    // 3. Left column form rows slide-in from left (staggered)
    tl.from(
      ".working-process__form-row",
      {
        x: -40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: "power3.out",
      },
      0.15
    );

    tl.from(
      ".working-process__submit",
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
        clearProps: "transform,opacity",
      },
      0.55
    );

    // 4. Right column headings cascade
    tl.from(
      [".working-process__right .section-header .section-header__paw", ".working-process__right .section-header .section-header__label"],
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
      0.15
    );

    tl.from(
      ".working-process__right .section-header__title",
      {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      0.3
    );

    // 5. Slider image box scales + rotates in
    tl.from(
      ".working-process__image-circle",
      {
        scale: 0.6,
        rotation: -15,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
      },
      0.4
    );

    // 6. Text details fade and slide-up
    tl.from(
      ".working-process__slide-title",
      {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      0.8
    );

    tl.from(
      ".working-process__slide-desc",
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      0.95
    );

    // 7. Slider number badge pops in
    tl.from(
      ".working-process__badge",
      {
        scale: 0,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(2.5)",
      },
      0.95
    );

    // 8. Nav bar container fade up
    tl.from(
      ".working-process__slider-nav",
      {
        y: 15,
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        ease: "back.out(1.8)",
        clearProps: "transform,opacity",
      },
      1.1
    );
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

    function updateTestimonial(index, direction) {
      const card = document.querySelector(".testimonial__card");
      if (!card) return;

      const slideOutX = direction === "next" ? -50 : 50;
      const slideInX = direction === "next" ? 50 : -50;

      // Smooth GSAP slide-out transition
      gsap.to(card, {
        opacity: 0,
        x: slideOutX,
        duration: 0.25,
        ease: "power2.in",
        onComplete: function () {
          // Update Avatars Border in the DOM
          $(".testimonial__avatar").removeClass("testimonial__avatar--middle");
          $(".testimonial__avatar").eq(index).addClass("testimonial__avatar--middle");

          // Reset positioning to opposite side before animating back in
          gsap.set(card, { x: slideInX });

          // Smooth slide-in
          gsap.to(card, {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "x"
          });
        }
      });
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
    const $desc = $(".working-process__slide-desc");
    const $imageBox = $(".working-process__image-box");

    function updateStep(index, direction) {
      const slideOutX = direction === "next" ? -40 : 40;
      const slideInX = direction === "next" ? 40 : -40;

      // Group elements to animate together
      const animElements = [$title[0], $desc[0]];

      // Step 1: Slide out texts and fade out image wrapper
      gsap.to(animElements, {
        opacity: 0,
        x: slideOutX,
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.05
      });

      gsap.to($imageBox[0], {
        opacity: 0,
        scale: 0.85,
        rotation: direction === "next" ? -15 : 15,
        duration: 0.3,
        ease: "power2.in",
        onComplete: function () {
          // Update contents inside DOM
          $badge.text(index.toString().padStart(2, "0"));
          const currentTitle = $title.text().trim();
          const newTitle = currentTitle.replace(/^\d+/, index.toString().padStart(2, "0"));
          $title.text(newTitle);

          // Update progress position bar
          const progressPos = ((index - 1) / totalSteps) * 100;
          $progress.css("left", progressPos + "%");

          // Reset element positions on opposite sides
          gsap.set(animElements, { x: slideInX });
          gsap.set($imageBox[0], { scale: 0.85, rotation: direction === "next" ? 15 : -15 });

          // Step 2: Slide in texts and bounce/rotate in the image wrapper
          gsap.to(animElements, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            clearProps: "x"
          });

          gsap.to($imageBox[0], {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
            clearProps: "scale,rotation"
          });
        }
      });
    }

    $(".working-process__nav-btn").eq(1).on("click", function () {
      currentIndex = currentIndex < totalSteps ? currentIndex + 1 : 1;
      updateStep(currentIndex, "next");
    });

    $(".working-process__nav-btn").eq(0).on("click", function () {
      currentIndex = currentIndex > 1 ? currentIndex - 1 : totalSteps;
      updateStep(currentIndex, "prev");
    });
  }

  function pricingToggle() {
    $(".pricing__toggle-btn, .grooming-pricing__toggle-btn").on("click", function () {
      const $this = $(this);
      const isGrooming = $this.hasClass("grooming-pricing__toggle-btn");
      const btnClass = isGrooming ? "grooming-pricing__toggle-btn" : "pricing__toggle-btn";
      const sectionClass = isGrooming ? ".grooming-pricing" : ".pricing";

      if ($this.hasClass(`${btnClass}--active`)) return;

      // Toggle Active Class
      $(`.${btnClass}`).removeClass(`${btnClass}--active`).addClass(`${btnClass}--inactive`);
      $this.removeClass(`${btnClass}--inactive`).addClass(`${btnClass}--active`);

      const isYearly = $this.text().trim() === "YEARLY";
      const $section = $this.closest(sectionClass);

      // 1. Update elements with explicit data-monthly and data-yearly attributes
      $section.find("[data-monthly][data-yearly], .grooming-pricing-card__desc").fadeOut(200, function () {
        const newValue = isYearly ? $(this).attr("data-yearly") : $(this).attr("data-monthly");
        if (newValue !== undefined && newValue !== false) {
          $(this).text(newValue).fadeIn(200);
        } else {
          $(this).fadeIn(200);
        }
      });

      // 2. Update period text (/ Per Month vs / Per Year) for elements without explicit data attributes
      $section.find(".pricing-card__period, .grooming-pricing-card__period").not("[data-monthly]").fadeOut(200, function () {
        const newPeriod = isYearly ? "/ Per Year" : "/ Per Month";
        $(this).text(newPeriod).fadeIn(200);
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

  /*-------------------------------------------------
   * PRICING SECTION ANIMATIONS
   *-------------------------------------------------*/
  function pricingAnimations() {
    if (!document.querySelector(".pricing")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".pricing__header-left .section-header__paw, .pricing__header-left .section-header__label, .pricing__header-left .section-header__title, .pricing__toggle, .pricing-col, .pricing-card__ribbon, .pricing-card__price, .pricing-card__info, .pricing-card__list-item, .pricing-btn",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".pricing__header-left .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pricing",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        animatePriceCounters();
      }
    });

    tl.from(".pricing__header-left .section-header__paw", { opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    tl.from(".pricing__header-left .section-header__label", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" }, 0.1);

    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, { opacity: 0, y: 40, rotateX: -10, transformOrigin: "0% 50% -20", duration: 0.75, stagger: 0.12, ease: "power4.out" }, 0.2);
    } else {
      tl.from(".pricing__header-left .section-header__title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, 0.2);
    }

    tl.from(".pricing__toggle", { opacity: 0, scale: 0.7, duration: 0.6, ease: "back.out(2.2)" }, 0.5);

    tl.from(".pricing-col", { opacity: 0, y: 70, scale: 0.94, duration: 0.75, stagger: 0.18, ease: "power3.out", clearProps: "transform,opacity,scale" }, 0.65);

    tl.from(".pricing-card__ribbon", { opacity: 0, scale: 0, rotation: 90, duration: 0.6, ease: "back.out(1.8)" }, 1.0);

    tl.from(".pricing-card__info", { opacity: 0, y: 20, scaleY: 0.8, duration: 0.6, ease: "power3.out" }, 1.2);

    tl.from(".pricing-card__list-item", { opacity: 0, x: -20, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 1.35);

    tl.from(".pricing-btn", { opacity: 0, y: 15, scale: 0.82, duration: 0.55, stagger: 0.15, ease: "back.out(1.7)", clearProps: "opacity,transform" }, 1.65);
  }

  function animatePriceCounters() {
    document.querySelectorAll(".pricing-card__price").forEach(function (el) {
      var activeBtn = document.querySelector(".pricing__toggle-btn--active");
      var isYearly = activeBtn && activeBtn.textContent.trim() === "YEARLY";
      var targetAttr = isYearly ? el.dataset.yearly : el.dataset.monthly;
      if (!targetAttr) return;
      var targetVal = parseFloat(targetAttr.replace(/[^0-9.]/g, ""));
      var obj = { val: 0 };
      gsap.to(obj, {
        val: targetVal,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: function () {
          el.innerText = "$" + obj.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
      });
    });
  }
  /*-------------------------------------------------
   * CHOOSE US ANIMATIONS
   *-------------------------------------------------*/
  function chooseUsAnimations() {
    if (!document.querySelector(".choose-us")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".choose-us__main-wrapper, .choose-us__top-pet, .choose-us__header .section-header__paw, .choose-us__header .section-header__label, .choose-us__header .section-header__title, .choose-us__line, .choose-us__center-ring, .choose-us__center-pet, .choose-us__features--left .choose-us__feature, .choose-us__features--right .choose-us__feature, .choose-us__abstract-bg, .choose-us__triangle-bg, .choose-us__feature-title, .choose-us__feature-text",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".choose-us__header .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".choose-us",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        gsap.set(
          ".choose-us__main-wrapper, .choose-us__top-pet, .choose-us__header .section-header__paw, .choose-us__header .section-header__label, .choose-us__header .section-header__title, .choose-us__line, .choose-us__center-ring, .choose-us__center-pet, .choose-us__features--left .choose-us__feature, .choose-us__features--right .choose-us__feature, .choose-us__abstract-bg, .choose-us__triangle-bg, .choose-us__feature-title, .choose-us__feature-text",
          { clearProps: "all" }
        );
      }
    });

    tl.from(".choose-us__main-wrapper", {
      opacity: 0,
      y: 40,
      duration: 0.95,
      ease: "power3.out"
    }, 0);

    tl.from(".choose-us__triangle-bg", {
      opacity: 0,
      scale: 0.85,
      y: 30,
      duration: 1.1,
      ease: "power2.out"
    }, 0.1);

    tl.from(".choose-us__abstract-bg", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    }, 0.15);

    tl.from(".choose-us__top-pet", {
      opacity: 0,
      y: -60,
      scale: 0.8,
      duration: 0.85,
      ease: "back.out(1.5)"
    }, 0.25);

    tl.from(".choose-us__header .section-header__paw", {
      opacity: 0,
      scale: 0.5,
      rotation: -30,
      duration: 0.55,
      stagger: 0.1,
      ease: "back.out(2)"
    }, 0.3);

    tl.from(".choose-us__header .section-header__label", {
      opacity: 0,
      y: -15,
      duration: 0.5,
      ease: "power2.out"
    }, 0.4);

    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, {
        opacity: 0,
        y: 35,
        rotateX: -10,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.12,
        ease: "power4.out"
      }, 0.45);
    } else {
      tl.from(".choose-us__header .section-header__title", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: "power3.out"
      }, 0.45);
    }

    tl.from(".choose-us__center-ring", {
      opacity: 0,
      scale: 0.7,
      rotation: -10,
      duration: 0.8,
      ease: "back.out(1.6)"
    }, 0.55);

    tl.from(".choose-us__center-pet", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: "power2.out"
    }, 0.8);

    tl.from(".choose-us__line", {
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: "power2.out"
    }, 0.7);

    // Symmetrical Features Slide
    tl.from(".choose-us__features--left .choose-us__feature", {
      opacity: 0,
      x: -50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, 0.85);

    tl.from(".choose-us__features--left .choose-us__feature-title, .choose-us__features--left .choose-us__feature-text", {
      opacity: 0,
      y: 15,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    }, 1.05);

    tl.from(".choose-us__features--right .choose-us__feature", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    }, 0.85);

    tl.from(".choose-us__features--right .choose-us__feature-title, .choose-us__features--right .choose-us__feature-text", {
      opacity: 0,
      y: 15,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    }, 1.05);
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
