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
    productAnimations();
    blogAnimations();
    footerAnimations();
    heroGroomingAnimations();
    aboutGroomingAnimations();
    groomingServicesAnimations();
    parentTestimonialAnimations();
    faqAnimations();
    groomingChooseUsAnimations();
    groomingPricingAnimations();
    groomingTeamAnimations();
    beforeAndAfterAnimations();
    groomingBlogAnimations();
    footerV2Animations();
    boardingHeroAnimations();
    boardingAboutAnimations();
    boardingServiceAnimations();
    boardingTestimonialAnimations();
    boardingChooseUsAnimations();
    boardingPricingAnimations();
    boardingBlogAnimations();
    footerV3Animations();
    commonBannerAnimations();
    blogPageAnimations();
    serviceDetailsAnimations();
    teamDetailsAnimations();
    blogStandardAnimations();
    blogDetailsAnimations();
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

    // Testimonial slides content array
    var testimonialSlides = [
      {
        name: "BROOKLYN SIMMONS",
        designation: "E-Commerce Solutions",
        text: "We Work With Trusted Partners And Monitor The Impact Of Every Program To Ensure Transparency And Accountability All Donations To Our Organization Are Tax-Deductible, And We Provide Receipts For Every Contribution Offer Numerous Volunteer Opportunities Both On-Site And Virtually. Visit Our Volunteer Page Donations",
        rating: 4.5
      },
      {
        name: "ROSEMARY COOPER",
        designation: "Pet Owner",
        text: "The grooming team was absolutely fantastic with my cat! She is usually very anxious around strangers, but they treated her with so much care and patience. Her coat has never looked cleaner and shinier. I highly recommend their specialized services!",
        rating: 5
      },
      {
        name: "DANIEL SMITH",
        designation: "Dog Trainer",
        text: "Finding grooming specialists who understand different breeds and hygiene requirements is a challenge, but this team exceeded all expectations. The facility is extremely clean, and their professional approach is top tier.",
        rating: 5
      }
    ];

    function updateTestimonial(index, direction) {
      if (totalAvatars === 0) return;

      const content = document.querySelector(".parent-testimonial__content");
      const bodyEl = document.querySelector(".parent-testimonial__body");
      if (!content || !bodyEl) return;

      const slideOutX = direction === "next" ? -50 : 50;
      const slideInX = direction === "next" ? 50 : -50;

      // 1. Measure and freeze current body height
      const currentHeight = bodyEl.offsetHeight;
      gsap.set(bodyEl, { height: currentHeight });

      // Smooth GSAP slide-out transition
      gsap.to(content, {
        opacity: 0,
        x: slideOutX,
        duration: 0.25,
        ease: "power2.in",
        onComplete: function () {
          // Update Highlight Immediately
          $(".parent-testimonial__avatar").removeClass("parent-testimonial__avatar--center").addClass("parent-testimonial__avatar--side");
          $(".parent-testimonial__avatar").eq(index).removeClass("parent-testimonial__avatar--side").addClass("parent-testimonial__avatar--center");

          // Update texts
          var nextData = testimonialSlides[index % testimonialSlides.length] || testimonialSlides[0];
          var nameEl = document.querySelector(".parent-testimonial__name");
          var descEl = document.querySelector(".parent-testimonial__designation");
          var textEl = document.querySelector(".parent-testimonial__text");
          if (nameEl) nameEl.textContent = nextData.name;
          if (descEl) descEl.textContent = nextData.designation;
          if (textEl) textEl.textContent = nextData.text;

          // Rebuild rating stars
          var ratingContainer = document.querySelector(".parent-testimonial__rating");
          if (ratingContainer) {
            ratingContainer.innerHTML = "";
            var rating = nextData.rating;
            for (var i = 1; i <= 5; i++) {
              var star = document.createElement("i");
              if (i <= Math.floor(rating)) {
                star.className = "fas fa-star parent-testimonial__star";
              } else if (i - 0.5 === rating) {
                star.className = "fas fa-star-half-alt parent-testimonial__star";
              } else {
                star.className = "far fa-star parent-testimonial__star";
              }
              ratingContainer.appendChild(star);
            }
          }

          // 2. Temporarily set to auto, measure new target height, and restore currentHeight for transition
          gsap.set(bodyEl, { height: "auto" });
          const targetHeight = bodyEl.offsetHeight;
          gsap.set(bodyEl, { height: currentHeight });

          // 3. Animate height smoothly
          gsap.to(bodyEl, {
            height: targetHeight,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "height"
          });

          // Reset positioning to opposite side before animating back in
          gsap.set(content, { x: slideInX });

          // Smooth slide-in
          gsap.to(content, {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "x"
          });
        }
      });
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

  /*-------------------------------------------------
   * PRODUCT SECTION ANIMATIONS
   * ScrollTrigger-activated "product shelf reveal".
   * Cards rise up, badges pop in, info cascades up.
   *-------------------------------------------------*/
  function productAnimations() {
    if (!document.querySelector(".product")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".product__header-left .section-header__paw, .product__header-left .section-header__label, .product__header-left .section-header__title, .product__header-right .common-btn, .product-card, .product-card__badge, .product-card__price, .product-card__title, .product-card__rating",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".product__header-left .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".product",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── 1. Header: paw icon pops in
    tl.from(".product__header-left .section-header__paw", {
      opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)"
    }, 0);

    // ── 2. Header: label slides in from left
    tl.from(".product__header-left .section-header__label", {
      opacity: 0, x: -15, duration: 0.5, ease: "power2.out"
    }, 0.1);

    // ── 3. Header: title line-by-line cascade (SplitText)
    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, {
        opacity: 0, y: 40, rotateX: -10, transformOrigin: "0% 50% -20",
        duration: 0.75, stagger: 0.12, ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".product__header-left .section-header__title", {
        opacity: 0, y: 35, duration: 0.75, ease: "power3.out"
      }, 0.2);
    }

    // ── 4. Header: "View All" button pops in from right
    tl.from(".product__header-right .common-btn", {
      opacity: 0, x: 40, scale: 0.88, duration: 0.6, ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 0.4);

    // ── 5. Cards: floating rise stagger (left → right, shelf reveal)
    tl.from(".product-card", {
      opacity: 0, y: 60, scale: 0.88,
      duration: 0.75, stagger: 0.14, ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 0.55);

    // ── 6. Badges: elastic pop-in after cards land
    tl.from(".product-card__badge", {
      opacity: 0, scale: 0,
      duration: 0.45, stagger: 0.06, ease: "back.out(2.5)"
    }, 0.9);

    // ── 7. Price: slide up per card (staggered)
    tl.from(".product-card__price", {
      opacity: 0, y: 15, duration: 0.55, stagger: 0.12, ease: "power3.out"
    }, 1.0);

    // ── 8. Title: slide up per card (staggered, slightly after price)
    tl.from(".product-card__title", {
      opacity: 0, y: 12, duration: 0.5, stagger: 0.12, ease: "power3.out"
    }, 1.1);

    // ── 9. Rating: scale + fade, per card — the finishing touch
    tl.from(".product-card__rating", {
      opacity: 0, y: 10, scale: 0.8,
      duration: 0.45, stagger: 0.12, ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 1.22);
  }

  /*-------------------------------------------------
   * BLOG SECTION ANIMATIONS
   * ScrollTrigger-activated "magazine reveal".
   * Large card curtains down, small cards stagger from right.
   *-------------------------------------------------*/
  function blogAnimations() {
    if (!document.querySelector(".blog--homepage")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".blog__header .section-header__paw, .blog__header .section-header__label, .blog__header .section-header__title, .blog-card--lg, .blog-card--lg .blog-card__img, .blog-card--lg .blog-card__date, .blog-card--lg .blog-card__meta, .blog-card--lg .blog-card__title, .blog-card--lg .blog-card__desc, .blog-card--lg .service-btn, .blog-card--sm, .blog-card--sm .blog-card__date, .blog-card--sm .blog-card__meta, .blog-card--sm .blog-card__title, .blog-card--sm .blog-card__desc, .blog-card--sm .service-btn",
        { clearProps: "all" }
      );
    }, 5000);

    // Initial setup for large card curtain reveal
    gsap.set(".blog-card--lg", { clipPath: "inset(0% 0% 100% 0%)" });

    var titleEl = document.querySelector(".blog__header .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".blog--homepage",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        gsap.set(".blog-card--lg", { clearProps: "clip-path" });
      }
    });

    // ── 1. Header: Paw icons fan in symmetrically
    var paws = document.querySelectorAll(".blog__header .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, scale: 0.5, x: -20, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
      tl.from(paws[1], { opacity: 0, scale: 0.5, x: 20, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0);
    } else {
      tl.from(".blog__header .section-header__paw", { opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    }

    // ── 2. Header: Label slides down
    tl.from(".blog__header .section-header__label", {
      opacity: 0, y: -12, duration: 0.5, ease: "power2.out"
    }, 0.12);

    // ── 3. Header: Title word cascade (SplitText)
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.05, ease: "power4.out"
      }, 0.22);
    } else {
      tl.from(".blog__header .section-header__title", {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out"
      }, 0.22);
    }

    // ── 4. Large Card: Curtain wipe
    tl.to(".blog-card--lg", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.0,
      ease: "power3.out"
    }, 0.45);

    // ── 5. Large Card Image: Parallax zoom out reveal
    tl.from(".blog-card--lg .blog-card__img", {
      scale: 1.08,
      duration: 1.2,
      ease: "power2.out"
    }, 0.45);

    // ── 6. Large Card Date: Elastic stamp pop
    tl.from(".blog-card--lg .blog-card__date", {
      opacity: 0, scale: 0, duration: 0.55, ease: "back.out(2.5)"
    }, 0.85);

    // ── 7. Large Card Content: Sequential text reading-flow cascade
    tl.from(".blog-card--lg .blog-card__meta", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" }, 0.9);
    tl.from(".blog-card--lg .blog-card__title", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }, 1.0);
    tl.from(".blog-card--lg .blog-card__desc", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" }, 1.1);
    tl.from(".blog-card--lg .service-btn", {
      opacity: 0, scale: 0.82, duration: 0.5, ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 1.2);

    // ── 8. Small Cards: Staggered entry from right
    tl.from(".blog-card--sm", {
      opacity: 0, x: 60, scale: 0.93,
      duration: 0.8, stagger: 0.2, ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 0.55);

    // ── 9. Small Cards Dates: Elastic pop
    tl.from(".blog-card--sm .blog-card__date", {
      opacity: 0, scale: 0, duration: 0.55, stagger: 0.2, ease: "back.out(2.5)", clearProps: "transform,opacity,scale"
    }, 0.9);

    // ── 10. Small Cards Content: Cascaded info reveals
    tl.from(".blog-card--sm .blog-card__meta", { opacity: 0, x: 12, duration: 0.5, stagger: 0.2, ease: "power2.out", clearProps: "transform,opacity" }, 1.0);
    tl.from(".blog-card--sm .blog-card__title", { opacity: 0, y: 12, duration: 0.55, stagger: 0.2, ease: "power3.out", clearProps: "transform,opacity" }, 1.1);
    tl.from(".blog-card--sm .blog-card__desc", { opacity: 0, y: 10, duration: 0.5, stagger: 0.2, ease: "power2.out", clearProps: "transform,opacity" }, 1.18);
    tl.from(".blog-card--sm .service-btn", {
      opacity: 0, scale: 0.82, duration: 0.5, stagger: 0.2, ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 1.28);

    // ── 11. Background Parallax (Independent Scroll Trigger)
    gsap.fromTo(
      ".blog--homepage .blog__bg",
      { y: -40 },
      {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: ".blog--homepage",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      }
    );
  }

  function blogPageAnimations() {
    if (!document.querySelector(".blog--no-padding")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".blog--no-padding .blog-card--sm, .blog--no-padding .blog-card__img-wrap, .blog--no-padding .blog-card__date, .blog--no-padding .blog-card__meta, .blog--no-padding .blog-card__title, .blog--no-padding .blog-card__desc, .blog--no-padding .service-btn, .blog--no-padding .pagination, .blog--no-padding .pagination__item",
        { clearProps: "all" }
      );
    }, 5000);

    gsap.set(".blog--no-padding .blog-card__img-wrap", { clipPath: "inset(0% 0% 100% 0%)" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".blog--no-padding",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        gsap.set(".blog--no-padding .blog-card__img-wrap", { clearProps: "clip-path" });
      }
    });

    // 1. Cards float up stagger
    tl.from(".blog--no-padding .blog-card--sm", {
      opacity: 0,
      y: 70,
      duration: 0.8,
      stagger: 0.14,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0);

    // 2. Image curtain wipe
    tl.to(".blog--no-padding .blog-card__img-wrap", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.85,
      stagger: 0.14,
      ease: "power3.out"
    }, 0.2);

    // 3. Elastic stamp pop for dates
    tl.from(".blog--no-padding .blog-card__date", {
      opacity: 0,
      scale: 0,
      duration: 0.55,
      stagger: 0.14,
      ease: "back.out(2.5)",
      clearProps: "transform,opacity"
    }, 0.55);

    // 4. Content cascade
    tl.from(".blog--no-padding .blog-card__meta", { opacity: 0, x: -15, duration: 0.5, stagger: 0.14, ease: "power2.out", clearProps: "transform,opacity" }, 0.7);
    tl.from(".blog--no-padding .blog-card__title", { opacity: 0, y: 18, duration: 0.55, stagger: 0.14, ease: "power3.out", clearProps: "transform,opacity" }, 0.82);
    tl.from(".blog--no-padding .blog-card__desc", { opacity: 0, y: 10, duration: 0.5, stagger: 0.14, ease: "power2.out", clearProps: "transform,opacity" }, 0.94);
    tl.from(".blog--no-padding .service-btn", {
      opacity: 0,
      scale: 0.8,
      duration: 0.55,
      stagger: 0.14,
      ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 1.05);

    // 5. Pagination entry
    tl.from(".blog--no-padding .pagination", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 1.2);

    tl.from(".blog--no-padding .pagination__item", {
      opacity: 0,
      scale: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "back.out(2)",
      clearProps: "transform,opacity"
    }, 1.35);
  }

  /*-------------------------------------------------
   * FOOTER SECTION ANIMATIONS
   * ScrollTrigger-activated theatrical final sequence.
   * Pets slide in, columns stagger, middle marquee fades, bottom bar enters.
   *-------------------------------------------------*/
  function footerAnimations() {
    if (!document.querySelector(".footer")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".footer__pet-left, .footer__pet-right, .footer__col, .footer__col--newsletter .footer__title, .footer__col--newsletter .footer__desc, .footer__col--newsletter .footer__form, .footer__col--newsletter .footer__social-link, .footer__col-inner .footer__title, .footer__col-inner .footer__title-line, .footer__list-item, .footer__contact-item, .footer__contact-icon, .footer__middle, .footer__bottom",
        { clearProps: "all" }
      );
    }, 5000);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
      }
    });

    // ── 1. Pets: Slide in from outer edges
    tl.from(".footer__pet-left", { x: -80, opacity: 0, duration: 1.2, ease: "power3.out" }, 0);
    tl.from(".footer__pet-right", { x: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, 0);

    // ── 2. Columns: Rise up stagger (left to right)
    tl.from(".footer__col", {
      y: 50, opacity: 0, scale: 0.96,
      duration: 0.75, stagger: 0.15, ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 0.2);

    // ── 3. Newsletter Column Cascade
    tl.from(".footer__col--newsletter .footer__title", { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, 0.45);
    tl.from(".footer__col--newsletter .footer__desc", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out" }, 0.55);
    tl.from(".footer__col--newsletter .footer__form", {
      opacity: 0, y: 15, scale: 0.95, duration: 0.55, ease: "back.out(1.5)",
      clearProps: "transform,opacity"
    }, 0.65);
    tl.from(".footer__col--newsletter .footer__social-link", {
      opacity: 0, scale: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 0.8);

    // ── 4. Underlines & Titles of Links/Services/Contact
    tl.from(".footer__col-inner .footer__title", {
      opacity: 0, y: 20, duration: 0.5, stagger: 0.15, ease: "power3.out"
    }, 0.45);
    tl.from(".footer__col-inner .footer__title-line", {
      opacity: 0, scaleX: 0, duration: 0.5, stagger: 0.15, transformOrigin: "left center", ease: "power3.out"
    }, 0.5);

    // ── 5. List Items (Links + Services)
    tl.from(".footer__list-item", {
      opacity: 0, x: -15, duration: 0.4, stagger: 0.06, ease: "power2.out"
    }, 0.75);

    // ── 6. Contact details
    tl.from(".footer__contact-item", {
      opacity: 0, x: -20, duration: 0.55, stagger: 0.1, ease: "power3.out"
    }, 0.75);
    tl.from(".footer__contact-icon", {
      scale: 0, duration: 0.45, stagger: 0.1, ease: "back.out(2)",
      clearProps: "transform"
    }, 0.75);

    // ── 7. Middle Zone (Marquee Wrapper Only - avoiding conflict with marquee keyframes)
    tl.from(".footer__middle", {
      opacity: 0, duration: 0.8, ease: "power2.out"
    }, 0.85);

    // ── 8. Bottom bar copyrights & links
    tl.from(".footer__bottom", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.0);
  }

  /*-------------------------------------------------
   * HERO GROOMING ANIMATIONS
   * Above-the-fold load entrance for pet-grooming.html.
   * Title splits, dog rises, side columns sweep inward.
   *-------------------------------------------------*/
  function heroGroomingAnimations() {
    if (!document.querySelector(".hero-grooming")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".hero-grooming__title, .hero-grooming__badge, .hero-grooming__image-wrapper, .hero-grooming__offer-box, .hero-grooming__offer-price, .hero-grooming__specialist-box, .hero-grooming__avatar-img, .hero-grooming__specialist-btn",
        { clearProps: "all" }
      );
    }, 2500);

    var titleEl = document.querySelector(".hero-grooming__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── 1. Title SplitText cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0, y: 70, rotateX: -20, transformOrigin: "0% 50% -20",
        duration: 0.8, stagger: 0.06, ease: "power4.out"
      }, 0);
    } else {
      tl.from(".hero-grooming__title", { opacity: 0, y: 50, duration: 0.8 }, 0);
    }

    // ── 2. 100% Stamp Badge spin-pop
    tl.from(".hero-grooming__badge", {
      opacity: 0, scale: 0, rotation: 90, duration: 0.75, ease: "back.out(2.0)"
    }, 0.6);

    // ── 3. Dog slide up
    tl.from(".hero-grooming__image-wrapper", {
      opacity: 0, y: 120, scale: 0.94, duration: 0.95, ease: "power3.out"
    }, 0.35);

    // ── 4. Left Offer Box
    tl.from(".hero-grooming__offer-box", {
      opacity: 0, x: -70, scale: 0.95, duration: 0.8, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.7);

    // ── 5. Offer price label bubble pop
    tl.from(".hero-grooming__offer-price", {
      opacity: 0, scale: 0, duration: 0.6, ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 1.1);

    // ── 6. Right Specialist Box
    tl.from(".hero-grooming__specialist-box", {
      opacity: 0, x: 70, scale: 0.95, duration: 0.8, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.85);

    // ── 7. Specialist Avatars stagger pop
    tl.from(".hero-grooming__avatar-img", {
      opacity: 0, scale: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2.0)",
      clearProps: "transform,opacity"
    }, 1.2);

    // ── 8. Specialist CTA contact button pop
    tl.from(".hero-grooming__specialist-btn", {
      opacity: 0, scale: 0.85, duration: 0.55, ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 1.35);
  }

  /*-------------------------------------------------
   * BOARDING HERO ANIMATIONS
   * Above-the-fold load entrance for pet-boarding.html.
   * Background clip wipes, text cascades, character slides.
   *-------------------------------------------------*/
  function boardingHeroAnimations() {
    if (!document.querySelector(".boarding-hero")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-hero__bg-1, .boarding-hero__bg-2, .boarding-hero .section-header__paw, .boarding-hero .section-header__label, .boarding-hero__title, .boarding-hero__desc, .boarding-hero .common-btn, .boarding-hero__girl, .boarding-hero__line, .boarding-hero__floating--cat, .boarding-hero__floating--dog",
        { clearProps: "all" }
      );
    }, 3000);

    var titleEl = document.querySelector(".boarding-hero__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // Initial setups for clip wipe
    gsap.set(".boarding-hero__bg-1", { clipPath: "inset(100% 0% 0% 0%)" });

    // 1. BG wipe
    tl.to(".boarding-hero__bg-1", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.95,
      ease: "power3.out"
    }, 0);

    // 2. BG Inner Card Pop
    tl.from(".boarding-hero__bg-2", {
      opacity: 0,
      scale: 0.92,
      duration: 0.8,
      ease: "back.out(1.4)",
      clearProps: "transform,opacity"
    }, 0.1);

    // 3. Paw icon
    tl.from(".boarding-hero .section-header__paw", {
      opacity: 0,
      scale: 0,
      rotation: -30,
      duration: 0.55,
      ease: "back.out(2)"
    }, 0.2);

    // 4. Label
    tl.from(".boarding-hero .section-header__label", {
      opacity: 0,
      y: -12,
      duration: 0.5,
      ease: "power2.out"
    }, 0.3);

    // 5. Title words
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 60,
        rotateX: -20,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.4);

      // Subtle pulse to highlights
      tl.fromTo(
        ".boarding-hero__title-highlight",
        { scale: 1 },
        { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" },
        1.6
      );
    } else {
      tl.from(".boarding-hero__title", { opacity: 0, y: 50, duration: 0.8 }, 0.4);
    }

    // 6. Desc
    tl.from(".boarding-hero__desc", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out"
    }, 1.3);

    // 7. CTA Button
    tl.from(".boarding-hero .common-btn", {
      opacity: 0,
      scale: 0.82,
      y: 15,
      duration: 0.55,
      ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 1.45);

    // 8. Girl slide up
    tl.from(".boarding-hero__girl", {
      opacity: 0,
      y: 80,
      duration: 1.1,
      ease: "power3.out"
    }, 0.35);

    // 9. SVG Line circle
    tl.from(".boarding-hero__line", {
      opacity: 0,
      scale: 0.6,
      duration: 0.8,
      ease: "power2.out"
    }, 0.55);

    // 10. Cat floating (preserving vertical centering)
    tl.from(".boarding-hero__floating--cat", {
      opacity: 0,
      x: -60,
      duration: 0.8,
      ease: "back.out(1.5)",
      clearProps: "x,opacity"
    }, 0.5);

    // 11. Dog floating (preserving positions)
    tl.from(".boarding-hero__floating--dog", {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: "back.out(1.5)",
      clearProps: "y,opacity"
    }, 0.65);
  }

  /*-------------------------------------------------
   * BOARDING ABOUT ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Deco photos, dual paws, label, title,
   * button, icons, dark card, avatars, image curtain,
   * absolute white stats card.
   *-------------------------------------------------*/
  function boardingAboutAnimations() {
    if (!document.querySelector(".boarding-about")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-about__deco-left, .boarding-about__deco-right, .boarding-about .section-header__paw, .boarding-about .section-header__label, .boarding-about__main-title, .boarding-about__btn-wrap, .boarding-about__icon-circle, .boarding-about__icon-title, .boarding-about__dark-card, .boarding-about__dark-avatar, .boarding-about__main-img-wrap, .boarding-about__white-card",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-about__main-title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-about",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // Initial setup for image wrap clip-path
    gsap.set(".boarding-about__main-img-wrap", { clipPath: "inset(0% 0% 100% 0%)" });

    // 1 & 2. Deco images sliding from edges (preserving left/right SASS settings)
    tl.from(".boarding-about__deco-left", { opacity: 0, x: -80, duration: 0.8, ease: "power3.out", clearProps: "x,opacity" }, 0);
    tl.from(".boarding-about__deco-right", { opacity: 0, x: 80, duration: 0.8, ease: "power3.out", clearProps: "x,opacity" }, 0);

    // 3. Paw icons
    var paws = document.querySelectorAll(".boarding-about .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0.15);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0.15);
    } else {
      tl.from(".boarding-about .section-header__paw", { opacity: 0, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0.15);
    }

    // 4. Label
    tl.from(".boarding-about .section-header__label", { opacity: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.25);

    // 5. Main Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 50,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.05,
        ease: "power4.out"
      }, 0.35);

      tl.fromTo(
        ".boarding-about__main-title span",
        { scale: 1 },
        { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" },
        1.5
      );
    } else {
      tl.from(".boarding-about__main-title", { opacity: 0, y: 40, duration: 0.75, ease: "power3.out" }, 0.35);
    }

    // 6. CTA Button wrap
    tl.from(".boarding-about__btn-wrap", { opacity: 0, scale: 0.85, duration: 0.55, ease: "back.out(1.7)", clearProps: "transform,opacity" }, 1.25);

    // 7. Icon circles
    tl.from(".boarding-about__icon-circle", { opacity: 0, scale: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2.5)", clearProps: "transform,opacity" }, 0.55);

    // 8. Icon titles
    tl.from(".boarding-about__icon-title", { opacity: 0, y: 12, duration: 0.5, stagger: 0.15, ease: "power2.out", clearProps: "transform,opacity" }, 0.7);

    // 9. Dark Card float-up
    tl.from(".boarding-about__dark-card", { opacity: 0, y: 50, duration: 0.75, ease: "power3.out", clearProps: "transform,opacity" }, 0.85);

    // 10. Dark Card Avatars stagger pop
    tl.from(".Ak-boarding-about__dark-avatar, .boarding-about__dark-avatar", { opacity: 0, scale: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.2)", clearProps: "transform,opacity" }, 0.95);

    // 11. Main photo curtain wipe
    tl.to(".boarding-about__main-img-wrap", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power3.out" }, 0.85);

    // 12. White absolute card slide up
    tl.from(".boarding-about__white-card", { opacity: 0, y: 40, duration: 0.7, ease: "back.out(1.5)", clearProps: "y,opacity" }, 1.1);
  }

  /*-------------------------------------------------
   * BOARDING SERVICE ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Paw icon, label, SplitText title cascade,
   * CTA button, service card float-up, SVG background blob,
   * card photo slide, and arrow button.
   *-------------------------------------------------*/
  function boardingServiceAnimations() {
    if (!document.querySelector(".boarding-service")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-service .section-header__paw, .boarding-service .section-header__label, .boarding-service__title, .Ak-boarding-service__header-right .common-btn, .boarding-service__header-right .common-btn, .boarding-service-card, .boarding-service-card__bg-svg, .boarding-service-card__img, .boarding-service-card__btn",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-service__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-service",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Paw icon
    tl.from(".boarding-service .section-header__paw", {
      opacity: 0,
      scale: 0,
      rotation: -30,
      duration: 0.55,
      ease: "back.out(2)"
    }, 0);

    // 2. Label
    tl.from(".boarding-service .section-header__label", {
      opacity: 0,
      y: -12,
      duration: 0.5,
      ease: "power2.out"
    }, 0.1);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 50,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);

      tl.fromTo(
        ".boarding-service__title span",
        { scale: 1 },
        { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" },
        1.4
      );
    } else {
      tl.from(".boarding-service__title", { opacity: 0, y: 40, duration: 0.75, ease: "power3.out" }, 0.2);
    }

    // 4. View all services CTA
    tl.from(".Ak-boarding-service__header-right .common-btn, .boarding-service__header-right .common-btn", {
      opacity: 0,
      scale: 0.85,
      duration: 0.55,
      ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 1.2);

    // 5. Cards float-up stagger
    tl.from(".boarding-service-card", {
      opacity: 0,
      y: 70,
      scale: 0.94,
      duration: 0.75,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 6. SVG background blobs scale-in
    tl.from(".boarding-service-card__bg-svg", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 0.7);

    // 7. Card photos slide-up (preserving CSS top/left positions)
    tl.from(".boarding-service-card__img", {
      opacity: 0,
      y: 30,
      duration: 0.65,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "y,opacity"
    }, 0.85);

    // 8. Arrow buttons pop
    tl.from(".boarding-service-card__btn", {
      opacity: 0,
      scale: 0,
      duration: 0.55,
      stagger: 0.15,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 1.05);
  }

  /*-------------------------------------------------
   * BOARDING TESTIMONIAL & STATS ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Testimonial box, title cascade, quote pop,
   * stars drop, user details, navigation, stats item float.
   * Features: Dynamic numeric counter rollup roll.
   *-------------------------------------------------*/
  function boardingTestimonialAnimations() {
    if (!document.querySelector(".boarding-testimonial")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-testimonial__box, .boarding-testimonial .section-header__paw, .boarding-testimonial .section-header__label, .boarding-testimonial__left .section-header__title, .boarding-testimonial__rating, .boarding-testimonial__quote-icon, .boarding-testimonial__stars i, .boarding-testimonial__text, .boarding-testimonial__user, .boarding-testimonial__stat-item",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-testimonial__left .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-testimonial",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        // Roll up statistics counters
        animateBoardingStatsCounters();
      }
    });

    // 1. Box container
    tl.from(".boarding-testimonial__box", {
      opacity: 0,
      y: 80,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0);

    // 2. Paw icon
    tl.from(".boarding-testimonial .section-header__paw", {
      opacity: 0,
      scale: 0,
      rotation: -30,
      duration: 0.5,
      ease: "back.out(2)"
    }, 0.25);

    // 3. Label
    tl.from(".boarding-testimonial .section-header__label", {
      opacity: 0,
      y: -12,
      duration: 0.5,
      ease: "power2.out"
    }, 0.35);

    // 4. Title Cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 45,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.05,
        ease: "power4.out"
      }, 0.45);

      tl.fromTo(
        ".boarding-testimonial__left .section-header__title span",
        { scale: 1 },
        { scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" },
        1.5
      );
    } else {
      tl.from(".boarding-testimonial__left .section-header__title", { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" }, 0.45);
    }

    // 5. Rating block
    tl.from(".boarding-testimonial__rating", {
      opacity: 0,
      y: 20,
      duration: 0.55,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.85);

    // 6. Quote icon pop
    tl.from(".boarding-testimonial__quote-icon", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 0.55);

    // 7. Stars drop
    tl.from(".boarding-testimonial__stars i", {
      opacity: 0,
      y: -15,
      duration: 0.45,
      stagger: 0.06,
      ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 0.65);

    // 8. Testimonial Text
    tl.from(".boarding-testimonial__text", {
      opacity: 0,
      y: 15,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.75);

    // 9. User Info block
    tl.from(".boarding-testimonial__user", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.9);

    // 10. Stat Items float-up
    tl.from(".boarding-testimonial__stat-item", {
      opacity: 0,
      y: 50,
      duration: 0.75,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.95);
  }

  /*-------------------------------------------------
   * STATS COUNTERS ANIMATION
   * GSAP Snap-numeric rollups for boarding statistics.
   * Handles formats: 1.5K+, 45+, 12K+, 100%
   *-------------------------------------------------*/
  function animateBoardingStatsCounters() {
    var targets = document.querySelectorAll(".boarding-testimonial__stat-number");
    if (!targets.length) return;

    targets.forEach(function (el) {
      var raw = el.textContent.trim();
      var value = parseFloat(raw.replace(/[^\d.]/g, ""));
      var isK = raw.indexOf("K") !== -1;
      var hasPlus = raw.indexOf("+") !== -1;
      var hasPercent = raw.indexOf("%") !== -1;

      var obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: function () {
          var displayVal = obj.val;
          // Support decimal rollups for values like 1.5
          if (isK && value % 1 !== 0) {
            displayVal = displayVal.toFixed(1);
          } else {
            displayVal = Math.floor(displayVal);
          }
          el.textContent = displayVal + (isK ? "K" : "") + (hasPlus ? "+" : "") + (hasPercent ? "%" : "");
        }
      });
    });
  }

  /*-------------------------------------------------
   * BOARDING CHOOSE US ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Paw icon, label, title, grid rows stagger,
   * outer icon pop, connector lines scaleY draw, right background,
   * and right main photo slide-in.
   *-------------------------------------------------*/
  function boardingChooseUsAnimations() {
    if (!document.querySelector(".boarding-choose-us")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-choose-us .section-header__paw, .boarding-choose-us .section-header__label, .boarding-choose-us .section-header__title, .boarding-choose-us__item, .boarding-choose-us__icon-outer, .boarding-choose-us__line, .boarding-choose-us__img-bg, .boarding-choose-us__img",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-choose-us .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-choose-us",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Paw icon
    tl.from(".boarding-choose-us .section-header__paw", {
      opacity: 0,
      scale: 0,
      rotation: -30,
      duration: 0.55,
      ease: "back.out(2)"
    }, 0);

    // 2. Label
    tl.from(".boarding-choose-us .section-header__label", {
      opacity: 0,
      y: -12,
      duration: 0.5,
      ease: "power2.out"
    }, 0.1);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 45,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".boarding-choose-us .section-header__title", { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" }, 0.2);
    }

    // 4. Feature rows
    tl.from(".boarding-choose-us__item", {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 5. Circular icon pop
    tl.from(".boarding-choose-us__icon-outer", {
      opacity: 0,
      scale: 0,
      duration: 0.65,
      stagger: 0.2,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 0.65);

    // 6. Connector lines drawing
    tl.from(".boarding-choose-us__line", {
      scaleY: 0,
      duration: 0.6,
      stagger: 0.2,
      transformOrigin: "top center",
      ease: "power2.out",
      clearProps: "transform"
    }, 0.85);

    // 7. Right side background shape
    tl.from(".boarding-choose-us__img-bg", {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.5);

    // 8. Right side image slide
    tl.from(".boarding-choose-us__img", {
      opacity: 0,
      x: 80,
      duration: 0.85,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.65);
  }

  /*-------------------------------------------------
   * BOARDING PRICING ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Paw icons, label, title, cards,
   * card backgrounds, price circles, features, CTA button.
   *-------------------------------------------------*/
  function boardingPricingAnimations() {
    if (!document.querySelector(".boarding-pricing")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-pricing .section-header__paw, .boarding-pricing .section-header__label, .boarding-pricing .section-header__title, .boarding-pricing-card, .boarding-pricing-card__bg, .boarding-pricing-card__price-wrap, .boarding-pricing-card__list-item, .boarding-pricing-card__btn",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-pricing .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-pricing",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Paw icons
    var paws = document.querySelectorAll(".boarding-pricing .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0);
    } else {
      tl.from(".boarding-pricing .section-header__paw", { opacity: 0, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    }

    // 2. Label
    tl.from(".boarding-pricing .section-header__label", { opacity: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.1);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 45,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".boarding-pricing .section-header__title", { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" }, 0.2);
    }

    // 4. Cards float-up stagger
    tl.from(".boarding-pricing-card", {
      opacity: 0,
      y: 70,
      scale: 0.94,
      duration: 0.75,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 5. Card background shapes
    tl.from(".boarding-pricing-card__bg", {
      opacity: 0,
      scale: 0.85,
      duration: 0.7,
      stagger: 0.18,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.7);

    // 6. Price circles pop
    tl.from(".boarding-pricing-card__price-wrap", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      stagger: 0.18,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 0.85);

    // 7. Bullet items slide-in
    tl.from(".boarding-pricing-card__list-item", {
      opacity: 0,
      x: -15,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.0);

    // 8. CTA Buttons pop
    tl.from(".boarding-pricing-card__btn", {
      opacity: 0,
      scale: 0.8,
      duration: 0.55,
      stagger: 0.15,
      ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 1.2);
  }

  /*-------------------------------------------------
   * BOARDING BLOG ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Paw icons, label, title cascade, cards,
   * card image curtain, date badge pop, read more button,
   * and share icon pop.
   *-------------------------------------------------*/
  function boardingBlogAnimations() {
    if (!document.querySelector(".boarding-blog")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".boarding-blog .section-header__paw, .boarding-blog .section-header__label, .boarding-blog .section-header__title, .boarding-blog-card, .boarding-blog-card__img, .boarding-blog-card__date, .boarding-blog-card .service-btn, .boarding-blog-card__share-link",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".boarding-blog .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".boarding-blog",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // Setup initial clipPath on images
    gsap.set(".boarding-blog-card__img", { clipPath: "inset(0% 0% 100% 0%)" });

    // 1. Paw icons
    var paws = document.querySelectorAll(".boarding-blog .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0);
    } else {
      tl.from(".boarding-blog .section-header__paw", { opacity: 0, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    }

    // 2. Label
    tl.from(".boarding-blog .section-header__label", { opacity: 0, y: -12, duration: 0.5, ease: "power2.out" }, 0.1);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 45,
        rotateX: -15,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".boarding-blog .section-header__title", { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" }, 0.2);
    }

    // 4. Cards float-up stagger
    tl.from(".boarding-blog-card", {
      opacity: 0,
      y: 60,
      duration: 0.75,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 5. Card images curtain wipe
    tl.to(".boarding-blog-card__img", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.85,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "clip-path"
    }, 0.7);

    // 6. Date badges bounce pop
    tl.from(".boarding-blog-card__date", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      stagger: 0.18,
      ease: "back.out(2.5)",
      clearProps: "transform,opacity"
    }, 0.85);

    // 7. Read more buttons pop
    tl.from(".boarding-blog-card .service-btn", {
      opacity: 0,
      scale: 0.8,
      duration: 0.55,
      stagger: 0.18,
      ease: "back.out(1.8)",
      clearProps: "transform,opacity"
    }, 1.0);

    // 8. Share link icons pop
    tl.from(".boarding-blog-card__share-link", {
      opacity: 0,
      scale: 0,
      duration: 0.55,
      stagger: 0.18,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 1.1);
  }

  /*-------------------------------------------------
   * FOOTER V3 ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Elements: Background parallax, subscribe col,
   * link lists cols, contact info col, bottom brand panel,
   * and social icon links.
   *-------------------------------------------------*/
  function footerV3Animations() {
    if (!document.querySelector(".footer-v3")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".footer-v3__bg, .footer-v3__col--subscribe, .footer-v3__col, .footer-v3__bottom, .footer-v3__social-link",
        { clearProps: "all" }
      );
    }, 5000);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-v3",
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
      }
    });

    // 1. Background image slide
    tl.from(".footer-v3__bg", {
      opacity: 0.8,
      y: -50,
      scale: 1.05,
      duration: 1.0,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0);

    // 2. Subscribe newsletter column
    tl.from(".footer-v3__col--subscribe", {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.2);

    // 3. Middle columns stagger (Links)
    tl.from(".footer-v3__col:not(.footer-v3__col--subscribe):not(:last-child)", {
      opacity: 0,
      y: 30,
      duration: 0.75,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.35);

    // 4. Contact column slide-in
    tl.from(".footer-v3__col:last-child", {
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.5);

    // 5. Bottom card panel scale-up
    tl.from(".footer-v3__bottom", {
      opacity: 0,
      scaleY: 0.9,
      duration: 0.75,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.65);

    // 6. Social icons pop
    tl.from(".footer-v3__social-link", {
      opacity: 0,
      scale: 0,
      duration: 0.65,
      stagger: 0.08,
      ease: "back.out(2)",
      clearProps: "transform,opacity"
    }, 0.85);
  }

  /*-------------------------------------------------
   * COMMON BANNER ANIMATIONS
   * Above-the-fold load timeline for inner subpages.
   * Elements: Background scale, breadcrumb slide,
   * SplitText title cascade, and illustration slide.
   *-------------------------------------------------*/
  function commonBannerAnimations() {
    if (!document.querySelector(".common-banner")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".common-banner, .common-banner .section-header__breadcrumb, .common-banner .section-header__title, .common-banner__img-wrap",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".common-banner .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Background image zoom scale-down
    tl.fromTo(".common-banner", 
      { backgroundSize: "110%", opacity: 0.8 },
      { backgroundSize: "100%", opacity: 1, duration: 1.2, ease: "power2.out", clearProps: "background-size,opacity" },
      0
    );

    // 2. Breadcrumb links
    tl.from(".common-banner .section-header__breadcrumb", {
      opacity: 0,
      y: 15,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.15);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 40,
        rotateX: -10,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.05,
        ease: "power4.out"
      }, 0.25);
    } else {
      tl.from(".common-banner .section-header__title", { opacity: 0, y: 30, duration: 0.75, ease: "power3.out" }, 0.25);
    }

    // 4. Dog/Cat photo slide
    tl.from(".common-banner__img-wrap", {
      opacity: 0,
      x: 60,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);
  }

  /*-------------------------------------------------
   * ABOUT GROOMING ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Image scale-zoom on left, headers and lists stagger.
   *-------------------------------------------------*/
  function aboutGroomingAnimations() {
    if (!document.querySelector(".about-grooming")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".about-grooming__bg, .about-grooming__img, .about-grooming__content-col .section-header__paw, .about-grooming__content-col .section-header__label, .about-grooming__content-col .section-header__title, .about-grooming__desc, .about-grooming__feature-item, .about-grooming__video, .about-grooming__bottom .common-btn, .about-grooming__author-img, .about-grooming__author-info",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".about-grooming__content-col .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-grooming",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── 1. Left Images depth reveal
    tl.from(".about-grooming__bg", { opacity: 0, scale: 0.85, duration: 0.9, ease: "power2.out" }, 0);
    tl.from(".about-grooming__img", { opacity: 0, x: -40, scale: 0.94, duration: 1.0, ease: "power3.out" }, 0.15);

    // ── 2. Content Header: paw & label
    tl.from(".about-grooming__content-col .section-header__paw", {
      opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2.0)"
    }, 0.2);
    tl.from(".about-grooming__content-col .section-header__label", {
      opacity: 0, x: -15, duration: 0.5, ease: "power2.out"
    }, 0.3);

    // ── 3. Title split reveal
    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, {
        opacity: 0, y: 35, rotateX: -8, transformOrigin: "0% 50% -20",
        duration: 0.75, stagger: 0.1, ease: "power4.out"
      }, 0.4);
    } else {
      tl.from(".about-grooming__content-col .section-header__title", {
        opacity: 0, y: 30, duration: 0.75, ease: "power3.out"
      }, 0.4);
    }

    // ── 4. Description
    tl.from(".about-grooming__desc", {
      opacity: 0, y: 20, duration: 0.65, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.65);

    // ── 5. Features & Video
    tl.from(".about-grooming__feature-item", {
      opacity: 0, x: -30, duration: 0.5, stagger: 0.1, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.75);
    tl.from(".about-grooming__video", {
      opacity: 0, scale: 0.85, duration: 0.7, ease: "back.out(1.5)"
    }, 0.85);

    // ── 6. Bottom Button & Author Info
    tl.from(".about-grooming__bottom .common-btn", {
      opacity: 0, scale: 0.82, y: 12, duration: 0.6, ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 0.95);
    tl.from(".about-grooming__author-img", {
      opacity: 0, scale: 0, duration: 0.55, ease: "back.out(2.0)",
      clearProps: "transform,opacity"
    }, 1.1);
    tl.from(".about-grooming__author-info", {
      opacity: 0, x: 15, duration: 0.5, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.2);
  }

  /*-------------------------------------------------
   * PET GROOMING SERVICES ANIMATIONS
   * ScrollTrigger-activated carousel slide reveal.
   * Header cascades, cards float up, backgrounds elastic pop.
   *-------------------------------------------------*/
  function groomingServicesAnimations() {
    if (!document.querySelector(".pet-grooming-service")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".pet-grooming-service__heading .section-header__paw, .pet-grooming-service__heading .section-header__label, .pet-grooming-service__heading .section-header__title, .pet-grooming-service__btn-wrap .common-btn, .swiper-slide .pet-grooming-card, .pet-grooming-card__bg-svg, .pet-grooming-card__img-wrap, .pet-grooming-card__title, .pet-grooming-card__desc, .pet-grooming-card .service-btn",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".pet-grooming-service__heading .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pet-grooming-service",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── 1. Header: Paw & Label
    tl.from(".pet-grooming-service__heading .section-header__paw", {
      opacity: 0, scale: 0.5, rotation: -30, duration: 0.45, ease: "back.out(2.0)"
    }, 0);
    tl.from(".pet-grooming-service__heading .section-header__label", {
      opacity: 0, x: -15, duration: 0.4, ease: "power2.out"
    }, 0.05);

    // ── 2. Header: Title lines split reveal
    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, {
        opacity: 0, y: 25, rotateX: -6, transformOrigin: "0% 50% -20",
        duration: 0.45, stagger: 0.05, ease: "power4.out"
      }, 0.1);
    } else {
      tl.from(".pet-grooming-service__heading .section-header__title", {
        opacity: 0, y: 15, duration: 0.45, ease: "power3.out"
      }, 0.1);
    }

    // ── 3. Header CTA Button
    tl.from(".pet-grooming-service__btn-wrap .common-btn", {
      opacity: 0, scale: 0.85, y: 10, duration: 0.4, ease: "back.out(1.7)",
      clearProps: "transform,opacity"
    }, 0.1);

    // ── 4. Swiper Slides: Floating wave stagger (y, scale)
    tl.from(".swiper-slide .pet-grooming-card", {
      opacity: 0, y: 25, scale: 0.97,
      duration: 0.45, stagger: 0.04, ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 0.15);

    // ── 5. Background SVG shape elastic pops
    tl.from(".pet-grooming-card__bg-svg", {
      opacity: 0, scale: 0.92, duration: 0.35, stagger: 0.04, ease: "back.out(1.8)"
    }, 0.25);

    // ── 6. Card Image wrap slide-up
    tl.from(".pet-grooming-card__img-wrap", {
      opacity: 0, y: 8, duration: 0.3, stagger: 0.04, ease: "power2.out"
    }, 0.3);

    // ── 7. Title, Desc, and Arrow icon button sequential slide-ups
    tl.from(".pet-grooming-card__title", {
      opacity: 0, y: 6, duration: 0.3, stagger: 0.04, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.35);
    tl.from(".pet-grooming-card__desc", {
      opacity: 0, y: 4, duration: 0.25, stagger: 0.04, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.38);
    tl.from(".pet-grooming-card .service-btn", {
      opacity: 0, scale: 0.85, duration: 0.3, stagger: 0.04, ease: "back.out(2.0)",
      clearProps: "transform,opacity"
    }, 0.42);
  }

  /*-------------------------------------------------
   * PARENT TESTIMONIAL ANIMATIONS
   * ScrollTrigger-activated radial sequence.
   * Paws spin, card body expands, lines draw, avatars pop, nav items sweep.
   *-------------------------------------------------*/
  function parentTestimonialAnimations() {
    if (!document.querySelector(".parent-testimonial")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".parent-testimonial__heading .section-header__paw, .parent-testimonial__heading .section-header__label, .parent-testimonial__heading .section-header__title, .parent-testimonial__body, .parent-testimonial__bg, .parent-testimonial__line, .parent-testimonial__avatar, .parent-testimonial__nav, .parent-testimonial__name, .parent-testimonial__designation, .parent-testimonial__text, .parent-testimonial__star",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".parent-testimonial__heading .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parent-testimonial",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── 1. Header: Flanking Paw icons & Label
    // Target both paw icons inside the centered header
    var paws = document.querySelectorAll(".parent-testimonial__heading .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2.0)" }, 0);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2.0)" }, 0);
    } else {
      tl.from(".parent-testimonial__heading .section-header__paw", { opacity: 0, scale: 0, duration: 0.5 }, 0);
    }
    tl.from(".parent-testimonial__heading .section-header__label", { opacity: 0, y: -10, duration: 0.4, ease: "power2.out" }, 0.1);

    // ── 2. Header: Title SplitText words cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0, y: 30, duration: 0.5, stagger: 0.05, ease: "power4.out"
      }, 0.15);
    } else {
      tl.from(".parent-testimonial__heading .section-header__title", {
        opacity: 0, y: 20, duration: 0.5, ease: "power3.out"
      }, 0.15);
    }

    // ── 3. Testimonial Card Body Expansion
    tl.from(".parent-testimonial__body", {
      opacity: 0, scale: 0.94, duration: 0.7, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.3);
    tl.from(".parent-testimonial__bg", { opacity: 0, duration: 0.5, ease: "power2.out" }, 0.3);

    // ── 4. Decorative Lines Drawing Outwards
    tl.from(".parent-testimonial__line", {
      opacity: 0, scaleX: 0, duration: 0.55, ease: "power3.out",
      stagger: {
        amount: 0.1,
        from: "center"
      }
    }, 0.45);

    // ── 5. Nav Arrows Sliding In from outside edges
    tl.from(".parent-testimonial__nav--prev", {
      opacity: 0, x: -30, duration: 0.5, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);
    tl.from(".parent-testimonial__nav--next", {
      opacity: 0, x: 30, duration: 0.5, ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // ── 6. Avatars pop-in staggered
    tl.from(".parent-testimonial__avatar--side", {
      opacity: 0, scale: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.0)",
      clearProps: "transform,opacity"
    }, 0.5);
    tl.from(".parent-testimonial__avatar--center", {
      opacity: 0, scale: 0, duration: 0.55, ease: "back.out(2.5)",
      clearProps: "transform,opacity"
    }, 0.6);

    // ── 7. Text Details & stars cascade
    tl.from(".parent-testimonial__name", { opacity: 0, y: 15, duration: 0.45, ease: "power3.out" }, 0.65);
    tl.from(".parent-testimonial__designation", { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" }, 0.72);
    tl.from(".parent-testimonial__text", {
      opacity: 0, y: 10, duration: 0.45, ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.78);
    tl.from(".parent-testimonial__star", {
      opacity: 0, scale: 0.8, duration: 0.45, stagger: 0.05, ease: "back.out(2.0)",
      clearProps: "transform"
    }, 0.85);
  }

  /*-------------------------------------------------
   * FAQ SECTION ANIMATIONS
   * ScrollTrigger-activated premium entrance sequence.
   * Features: horizontal clip-path curtain on photo, play-button pop-in,
   * paw/label/SplitText heading cascade, accordion stagger, bg parallax,
   * and an ambient heartbeat pulse on the play button.
   *-------------------------------------------------*/
  function faqAnimations() {
    if (!document.querySelector(".faq")) return;

    // Safety net: clear all GSAP inline styles if animation errors out
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".faq__video, .play-btn, .faq .section-header__paw, .faq .section-header__label, .faq .section-header__title, .faq-accordion__item",
        { clearProps: "all" }
      );
    }, 5000);

    // SplitText on the FAQ heading
    var titleEl = document.querySelector(".faq .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    // Initial state for the curtain wipe (set by GSAP, not CSS, to avoid flash on pages without scroll)
    gsap.set(".faq__video", { clipPath: "inset(0% 100% 0% 0%)" });

    // ── Main entrance timeline ───────────────────────────────────────────────
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".faq",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── Beat 1: Left photo — horizontal curtain wipe (left → right reveal) ──
    tl.to(
      ".faq__video",
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.0,
        ease: "power3.out",
        clearProps: "clip-path",
      },
      0
    );

    // ── Beat 2: Play button — fade in after image arrives ───────────────────
    tl.from(
      ".faq .play-btn",
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "opacity",
      },
      0.6
    );

    // ── Beat 3: Paw icon — rotate + scale pop ───────────────────────────────
    tl.from(
      ".faq .section-header__paw",
      {
        opacity: 0,
        scale: 0.5,
        rotation: -30,
        duration: 0.55,
        ease: "back.out(2)",
      },
      0.15
    );

    // ── Beat 4: Label — slide in from left ──────────────────────────────────
    tl.from(
      ".faq .section-header__label",
      {
        opacity: 0,
        x: -15,
        duration: 0.5,
        ease: "power2.out",
      },
      0.25
    );

    // ── Beat 5: Title — SplitText word cascade ──────────────────────────────
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(
        splitTitle.words,
        {
          opacity: 0,
          y: 40,
          rotateX: -10,
          transformOrigin: "0% 50% -20",
          duration: 0.75,
          stagger: 0.06,
          ease: "power4.out",
        },
        0.35
      );
    } else {
      tl.from(
        ".faq .section-header__title",
        { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" },
        0.35
      );
    }

    // ── Beat 6: Accordion items — staggered slide-up ────────────────────────
    tl.from(
      ".faq-accordion__item",
      {
        opacity: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.13,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      0.7
    );
  }

  /*-------------------------------------------------
   * GROOMING CHOOSE US ANIMATIONS
   * ScrollTrigger-activated premium entrance sequence.
   * Features: dual paw fan-in, SplitText title cascade, blob spin + cat rise,
   * symmetrical feature stagger (left from left, right from right),
   * icon elastic pop-ins, and dog decoration slide-up.
   *
   * IMPORTANT: Each .grooming-choose-us__feature has a CSS translateX offset
   * (--1 to --6). GSAP animates only `opacity` so the CSS transform is
   * never overwritten. clearProps: "opacity" only.
   *-------------------------------------------------*/
  function groomingChooseUsAnimations() {
    if (!document.querySelector(".grooming-choose-us")) return;

    // Safety net
    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".grooming-choose-us .section-header__paw, .grooming-choose-us .section-header__label, .grooming-choose-us .section-header__title, .grooming-choose-us__img-bg, .grooming-choose-us__img, .grooming-choose-us__feature, .grooming-choose-us__feature-icon-wrap, .grooming-choose-us__dog",
        { clearProps: "all" }
      );
    }, 5000);

    // SplitText on the heading title
    var titleEl = document.querySelector(".grooming-choose-us .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".grooming-choose-us",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // ── Beat 1: Dual paw icons — fan-in from opposite sides ───────────────
    var paws = document.querySelectorAll(".grooming-choose-us .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0);
    } else {
      tl.from(".grooming-choose-us .section-header__paw", { opacity: 0, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    }

    // ── Beat 2: Label — slide down ─────────────────────────────────────
    tl.from(
      ".grooming-choose-us .section-header__label",
      { opacity: 0, y: -15, duration: 0.5, ease: "power2.out" },
      0.1
    );

    // ── Beat 3: Title — SplitText word cascade ──────────────────────────
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(
        splitTitle.words,
        {
          opacity: 0,
          y: 40,
          rotateX: -10,
          transformOrigin: "0% 50% -20",
          duration: 0.75,
          stagger: 0.06,
          ease: "power4.out",
        },
        0.2
      );
    } else {
      tl.from(
        ".grooming-choose-us .section-header__title",
        { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" },
        0.2
      );
    }

    // ── Beat 4: Orange blob SVG — unwrap spin reveal ────────────────────
    tl.from(
      ".grooming-choose-us__img-bg",
      {
        opacity: 0,
        scale: 0.8,
        rotation: -15,
        duration: 1.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      0.3
    );

    // ── Beat 5: Cat — rises up and lands on blob ───────────────────────
    tl.from(
      ".grooming-choose-us__img",
      {
        opacity: 0,
        y: 70,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      0.5
    );

    // ── Beat 6: Left features — stagger slide from left ──────────────────
    // Animate opacity only — CSS translateX offsets (--1 to --3) must be preserved
    tl.from(
      ".grooming-choose-us__col--left .grooming-choose-us__feature",
      {
        opacity: 0,
        x: -60,
        duration: 0.75,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "x,opacity",
      },
      0.65
    );

    // ── Beat 7: Right features — stagger slide from right ────────────────
    tl.from(
      ".grooming-choose-us__col--right .grooming-choose-us__feature",
      {
        opacity: 0,
        x: 60,
        duration: 0.75,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "x,opacity",
      },
      0.75
    );

    // ── Beat 8: Feature icons — elastic pop-in across all 6 ──────────────
    tl.from(
      ".grooming-choose-us__feature-icon-wrap",
      {
        opacity: 0,
        scale: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "back.out(2.5)",
        clearProps: "transform,opacity",
      },
      0.85
    );

    // ── Beat 9: Dog decoration — slides up from below ──────────────────
    tl.from(
      ".grooming-choose-us__dog",
      {
        opacity: 0,
        y: 80,
        duration: 1.0,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
      1.1
    );
  }

  /*-------------------------------------------------
   * GROOMING PRICING ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Features: paw pop-in, label slide-in, title line cascade,
   * toggle pill pop-in, card stagger slide-up, card icon pop,
   * list item stagger slide-in, CTA button scale-up.
   * On completion, triggers the price counter rollup.
   *-------------------------------------------------*/
  function groomingPricingAnimations() {
    if (!document.querySelector(".grooming-pricing")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".grooming-pricing__header-left .section-header__paw, .grooming-pricing__header-left .section-header__label, .grooming-pricing__header-left .section-header__title, .grooming-pricing__toggle, .grooming-pricing-card, .grooming-pricing-card__icon, .grooming-pricing-card__list-item, .grooming-pricing-card__btn",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".grooming-pricing__header-left .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "lines" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".grooming-pricing",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        animateGroomingPriceCounters();
      }
    });

    tl.from(".grooming-pricing__header-left .section-header__paw", { opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    tl.from(".grooming-pricing__header-left .section-header__label", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" }, 0.1);

    if (splitTitle && splitTitle.lines && splitTitle.lines.length) {
      tl.from(splitTitle.lines, { opacity: 0, y: 40, rotateX: -10, transformOrigin: "0% 50% -20", duration: 0.75, stagger: 0.12, ease: "power4.out" }, 0.2);
    } else {
      tl.from(".grooming-pricing__header-left .section-header__title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, 0.2);
    }

    tl.from(".grooming-pricing__toggle", { opacity: 0, scale: 0.7, duration: 0.6, ease: "back.out(2.2)" }, 0.5);

    tl.from(".grooming-pricing-card", { opacity: 0, y: 70, scale: 0.94, duration: 0.75, stagger: 0.18, ease: "power3.out", clearProps: "transform,opacity,scale" }, 0.65);

    tl.from(".grooming-pricing-card__icon", { opacity: 0, scale: 0, rotation: 90, duration: 0.6, ease: "back.out(1.8)" }, 1.0);

    tl.from(".grooming-pricing-card__list-item", { opacity: 0, x: -20, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 1.25);

    tl.from(".grooming-pricing-card__btn", { opacity: 0, y: 15, scale: 0.82, duration: 0.55, stagger: 0.15, ease: "back.out(1.7)", clearProps: "opacity,transform" }, 1.55);
  }

  function animateGroomingPriceCounters() {
    document.querySelectorAll(".grooming-pricing-card__price").forEach(function (el) {
      var activeBtn = document.querySelector(".grooming-pricing__toggle-btn--active");
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
          el.innerText = "$" + obj.val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
      });
    });
  }

  /*-------------------------------------------------
   * GROOMING TEAM ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   *-------------------------------------------------*/
  function groomingTeamAnimations() {
    if (!document.querySelector(".grooming-team")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".grooming-team .section-header__paw, .grooming-team .section-header__label, .grooming-team .section-header__title, .grooming-team__desc, .grooming-team__text .common-btn, .grooming-team__thumb, .grooming-team__card-bg, .grooming-team__card-img, .grooming-team__card-info",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".grooming-team .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    // Dog parallax vertical scroll scrub
    gsap.fromTo(
      ".grooming-team__thumb",
      { y: 60 },
      {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".grooming-team",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        }
      }
    );

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".grooming-team",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    tl.from(".grooming-team .section-header__paw", { opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    tl.from(".grooming-team .section-header__label", { opacity: 0, y: -15, duration: 0.5, ease: "power2.out" }, 0.1);

    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 35,
        rotateX: -10,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.18);
    } else {
      tl.from(".grooming-team .section-header__title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, 0.18);
    }

    tl.from([".grooming-team__desc", ".grooming-team__text .common-btn"], {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.4);

    tl.from(".grooming-team__thumb", { opacity: 0, y: 120, duration: 1.0, ease: "power3.out" }, 0.5);

    tl.from(".grooming-team__card-bg", { opacity: 0, y: 80, duration: 0.7, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity" }, 0.6);

    tl.from(".grooming-team__card-img", { opacity: 0, y: -60, duration: 0.85, stagger: 0.12, ease: "back.out(1.8)", clearProps: "transform,opacity" }, 0.75);

    tl.from(".grooming-team__card-info", { opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "transform,opacity" }, 0.9);
  }

  /*-------------------------------------------------
   * BEFORE AND AFTER ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   *-------------------------------------------------*/
  function beforeAndAfterAnimations() {
    if (!document.querySelector(".before-and-after")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".before-and-after__bg, .before-and-after__left-content .section-header__paw, .before-and-after__left-content .section-header__label, .before-and-after__left-content .section-header__title, .before-and-after__desc, .before-and-after__right-wrap, .before-and-after__item, .before-and-after__slider",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".before-and-after__left-content .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    gsap.set(".before-and-after__bg", { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".before-and-after__right-wrap", { clipPath: "inset(0% 0% 0% 100%)" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".before-and-after",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    tl.to(".before-and-after__bg", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.out", clearProps: "clip-path" }, 0);

    tl.from(".before-and-after__left-content .section-header__paw", { opacity: 0, scale: 0.5, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0.15);

    tl.from(".before-and-after__left-content .section-header__label", { opacity: 0, x: -20, duration: 0.5, ease: "power2.out" }, 0.22);

    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 35,
        rotateX: -10,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.3);
    } else {
      tl.from(".before-and-after__left-content .section-header__title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, 0.3);
    }

    tl.from(".before-and-after__desc", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out", clearProps: "transform,opacity" }, 0.5);

    tl.to(".before-and-after__right-wrap", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out", clearProps: "clip-path" }, 0.55);

    tl.from(".before-and-after__item", { opacity: 0, y: 35, duration: 0.7, stagger: 0.18, ease: "power3.out", clearProps: "transform,opacity" }, 0.65);

    tl.from(".before-and-after__slider", { opacity: 0, scale: 0, y: "-40%", duration: 0.8, ease: "back.out(2.5)", clearProps: "transform,opacity,scale" }, 0.9);
  }

  /*-------------------------------------------------
   * GROOMING BLOG ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Features: dual paw fan-in, label slide-down,
   * title word cascade, card stagger float-up,
   * card SVG border pop-in, date badge slide-in,
   * footer button + share icon reveal.
   *-------------------------------------------------*/
  function groomingBlogAnimations() {
    if (!document.querySelector(".grooming-blog")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".grooming-blog .section-header__paw, .grooming-blog .section-header__label, .grooming-blog .section-header__title, .grooming-blog-card, .grooming-blog-card__bg-svg, .grooming-blog-card__date, .grooming-blog-card__footer",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".grooming-blog .section-header__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".grooming-blog",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    var paws = document.querySelectorAll(".grooming-blog .section-header__paw");
    if (paws.length >= 2) {
      tl.from(paws[0], { opacity: 0, x: -20, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
      tl.from(paws[1], { opacity: 0, x: 20, scale: 0, rotation: 30, duration: 0.55, ease: "back.out(2)" }, 0);
    } else {
      tl.from(".grooming-blog .section-header__paw", { opacity: 0, scale: 0, rotation: -30, duration: 0.55, ease: "back.out(2)" }, 0);
    }

    tl.from(".grooming-blog .section-header__label", { opacity: 0, y: -15, duration: 0.5, ease: "power2.out" }, 0.1);

    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 40,
        rotateX: -10,
        transformOrigin: "0% 50% -20",
        duration: 0.75,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".grooming-blog .section-header__title", { opacity: 0, y: 35, duration: 0.75, ease: "power3.out" }, 0.2);
    }

    tl.from(".grooming-blog-card", {
      opacity: 0,
      y: 70,
      scale: 0.94,
      duration: 0.75,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 0.45);

    tl.from(".grooming-blog-card__bg-svg", {
      opacity: 0,
      scale: 0.85,
      duration: 0.65,
      stagger: 0.2,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity"
    }, 0.75);

    tl.from(".grooming-blog-card__date", {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.9);

    tl.from(".grooming-blog-card__footer", {
      opacity: 0,
      y: 15,
      duration: 0.55,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.15);
  }

  /*-------------------------------------------------
   * FOOTER V2 ANIMATIONS
   * ScrollTrigger-activated entrance sequence.
   * Features: logo + desc slide-up, title stagger,
   * underline wipe, nav list stagger, newsletter scale-in,
   * info items stagger, socials bounce, bottom bar fade.
   *-------------------------------------------------*/
  function footerV2Animations() {
    if (!document.querySelector(".footer-v2")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".footer-v2__logo, .footer-v2__desc, .footer-v2__title, .footer-v2__title-line, .footer-v2__list-item, .footer-v2__newsletter-box, .footer-v2__info-item, .footer-v2__social-link, .footer-v2 .footer__bottom",
        { clearProps: "all" }
      );
    }, 5000);

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-v2",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
      }
    });

    // 1. Logo
    tl.from(".footer-v2__logo", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }, 0);

    // 2. Description
    tl.from(".footer-v2__desc", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out", clearProps: "transform,opacity" }, 0.1);

    // 3. Titles
    tl.from(".footer-v2__title", { opacity: 0, y: 20, duration: 0.5, stagger: 0.15, ease: "power3.out", clearProps: "transform,opacity" }, 0.2);

    // 4. Lines
    tl.from(".footer-v2__title-line", {
      opacity: 0,
      scaleX: 0,
      duration: 0.5,
      stagger: 0.15,
      transformOrigin: "left center",
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.25);

    // 5. Lists
    tl.from(".footer-v2__list-item", {
      opacity: 0,
      x: -15,
      duration: 0.45,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 6. Newsletter box
    tl.from(".footer-v2__newsletter-box", {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: "back.out(1.6)",
      clearProps: "transform,opacity"
    }, 0.3);

    // 7. Info items
    tl.from(".footer-v2__info-item", {
      opacity: 0,
      y: 25,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.7);

    // 8. Socials
    tl.from(".footer-v2__social-link", {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "back.out(2.2)",
      clearProps: "transform,opacity"
    }, 0.85);

    // 9. Copyright / bottom wrap
    tl.from(".footer-v2 .footer__bottom", {
      opacity: 0,
      y: 15,
      duration: 0.6,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.05);
  }

  function serviceDetailsAnimations() {
    if (!document.querySelector(".service-details")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".service-details__main-img-wrap, .service-details__main-img, .service-details__title, .service-details__desc, .service-details__subtitle, .service-details__list-item, .service-details__sub-img-wrap, .service-details__subsubtitle, .sidebar__widget, .sidebar__cat-item",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".service-details__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".service-details",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
        gsap.set(".service-details__main-img-wrap", { clearProps: "clip-path" });
      }
    });

    // 1. Setup elements initial state
    gsap.set(".service-details__main-img-wrap", { clipPath: "inset(0% 0% 100% 0%)" });

    // 2. Main image curtain wipe + zoom out
    tl.to(".service-details__main-img-wrap", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.0,
      ease: "power3.out"
    }, 0);
    tl.fromTo(".service-details__main-img", 
      { scale: 1.06 },
      { scale: 1.0, duration: 1.2, ease: "power2.out", clearProps: "transform" },
      0
    );

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.05,
        ease: "power4.out"
      }, 0.25);
    } else {
      tl.from(".service-details__title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, 0.25);
    }

    // 4. Description paragraphs stagger in (first two paragraphs)
    tl.from(".service-details__desc:nth-of-type(1), .service-details__desc:nth-of-type(2)", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.5);

    // 5. Subtitle slide from left
    tl.from(".service-details__subtitle", {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0.75);

    // 6. Remaining description paragraphs
    tl.from(".service-details__desc:nth-of-type(3)", {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.85);

    // 7. Checklist items pop in
    tl.from(".service-details__list--2col .service-details__list-item", {
      opacity: 0,
      x: -20,
      scale: 0.92,
      duration: 0.55,
      stagger: 0.08,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity,scale"
    }, 0.95);

    // 8. Sub-images reveal
    tl.from(".service-details__sub-img-wrap", {
      opacity: 0,
      y: 35,
      scale: 0.95,
      duration: 0.75,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "transform,opacity,scale"
    }, 1.15);

    // 9. Bottom subtitle, desc, and checklist
    tl.from(".service-details__subsubtitle", { opacity: 0, y: 20, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" }, 1.35);
    tl.from(".service-details__desc:nth-of-type(4)", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" }, 1.45);
    tl.from(".service-details__list:not(.service-details__list--2col) .service-details__list-item", {
      opacity: 0,
      x: -20,
      scale: 0.92,
      duration: 0.55,
      stagger: 0.08,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity,scale"
    }, 1.55);

    // 10. Sidebar widgets reveal
    tl.from(".sidebar__widget", {
      opacity: 0,
      x: 50,
      duration: 0.8,
      stagger: 0.18,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 1.25);

    // 11. Category list links stagger in
    tl.from(".sidebar__cat-item", {
      opacity: 0,
      x: 20,
      duration: 0.55,
      stagger: 0.06,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.55);
  }

  /*-------------------------------------------------
   * TEAM DETAILS ANIMATIONS
   * ScrollTrigger timeline for team profile section.
   * Image col slides left, content cascades right,
   * progress bars animate from 0% to their set widths.
   *-------------------------------------------------*/
  function teamDetailsAnimations() {
    if (!document.querySelector(".team-details")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".team-details__img-col, .team-details__img-wrap, .team-details__title, .team-details__designation, .team-details__desc, .team-details__list-item, .team-details__contact-item, .team-details__social-link, .team-details__skills-title, .ak-progress",
        { clearProps: "all" }
      );
    }, 5000);

    var titleEl = document.querySelector(".team-details__title");
    var splitTitle = null;
    try {
      if (titleEl && typeof SplitText !== "undefined") {
        splitTitle = new SplitText(titleEl, { type: "words" });
      }
    } catch (e) { splitTitle = null; }

    // Read each progress bar's target width BEFORE we reset it
    var progressBars = document.querySelectorAll(".ak-progress-bar");
    var progressTargets = [];
    progressBars.forEach(function (bar) {
      progressTargets.push(bar.style.width || "0%");
      bar.style.width = "0%";
    });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".team-details",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onComplete: function () {
        clearTimeout(safetyTimer);
        if (splitTitle) splitTitle.revert();
      }
    });

    // 1. Image col slides in from left
    tl.from(".team-details__img-col", {
      opacity: 0,
      x: -60,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform,opacity"
    }, 0);

    // 2. Image wrap scale pop on top of slide
    tl.from(".team-details__img-wrap", {
      scale: 0.92,
      duration: 0.75,
      ease: "back.out(1.4)",
      clearProps: "transform"
    }, 0.1);

    // 3. Title cascade
    if (splitTitle && splitTitle.words && splitTitle.words.length) {
      tl.from(splitTitle.words, {
        opacity: 0,
        y: 35,
        duration: 0.65,
        stagger: 0.06,
        ease: "power4.out"
      }, 0.2);
    } else {
      tl.from(".team-details__title", { opacity: 0, y: 30, duration: 0.65, ease: "power3.out" }, 0.2);
    }

    // 4. Designation fade up
    tl.from(".team-details__designation", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.45);

    // 5. Description fade up
    tl.from(".team-details__desc", {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.55);

    // 6. List items bounce in
    tl.from(".team-details__list-item", {
      opacity: 0,
      x: -15,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.08,
      ease: "back.out(1.5)",
      clearProps: "transform,opacity,scale"
    }, 0.65);

    // 7. Contact items stagger up
    tl.from(".team-details__contact-item", {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 0.95);

    // 8. Social icons pop in
    tl.from(".team-details__social-link", {
      opacity: 0,
      scale: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "back.out(2)",
      clearProps: "transform,opacity,scale"
    }, 1.15);

    // 9. Skills title slides in
    tl.from(".team-details__skills-title", {
      opacity: 0,
      x: -20,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.35);

    // 10. Progress bar heading fade in
    tl.from(".ak-progress", {
      opacity: 0,
      y: 10,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out",
      clearProps: "transform,opacity"
    }, 1.45);

    // 11. Animate each bar from 0% to its target width
    progressBars.forEach(function (bar, i) {
      gsap.to(bar, {
        width: progressTargets[i],
        duration: 1.2,
        ease: "power2.out",
        delay: 1.5 + (i * 0.2)
      });
    });
  }

  /*-------------------------------------------------
   * BLOG STANDARD PAGE ANIMATIONS
   * Each card and sidebar widget gets its own independent ScrollTrigger
   * so animations fire as the user scrolls to each element.
   *-------------------------------------------------*/
  function blogStandardAnimations() {
    if (!document.querySelector(".blog__standard-container")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".blog__standard-list .blog-card--lg, .blog__standard-list .blog-card__img-wrap, .blog__standard-list .blog-card__meta, .blog__standard-list .blog-card__title, .blog__standard-list .blog-card__desc, .blog__standard-list .service-btn, .blog__standard-container .sidebar__widget, .blog__standard-container .sidebar__cat-item, .blog__standard-container .sidebar__news-item",
        { clearProps: "all" }
      );
    }, 8000);

    // — — — BLOG CARDS: each card gets its own ScrollTrigger — — —
    var cards = document.querySelectorAll(".blog__standard-list .blog-card--lg");

    cards.forEach(function (card) {
      var imgWrap = card.querySelector(".blog-card__img-wrap");
      var meta    = card.querySelector(".blog-card__meta");
      var title   = card.querySelector(".blog-card__title");
      var desc    = card.querySelector(".blog-card__desc");
      var btn     = card.querySelector(".service-btn");

      var st = {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none none",
      };

      // Card itself slides up
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: st
      });

      // Image curtain wipe
      if (imgWrap) {
        gsap.set(imgWrap, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.to(imgWrap, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: st,
          onComplete: function () { gsap.set(imgWrap, { clearProps: "clip-path" }); }
        });
      }

      // Meta fade up
      if (meta) {
        gsap.from(meta, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          delay: 0.25,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: st
        });
      }

      // Title slide left
      if (title) {
        gsap.from(title, {
          opacity: 0,
          x: -15,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: st
        });
      }

      // Desc fade
      if (desc) {
        gsap.from(desc, {
          opacity: 0,
          y: 10,
          duration: 0.45,
          delay: 0.38,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: st
        });
      }

      // Read More button pop
      if (btn) {
        gsap.from(btn, {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          delay: 0.45,
          ease: "back.out(1.5)",
          clearProps: "transform,opacity,scale",
          scrollTrigger: st
        });
      }
    });

    // — — — SIDEBAR WIDGETS: each independently — — —
    document.querySelectorAll(".blog__standard-container .sidebar__widget").forEach(function (widget) {
      gsap.from(widget, {
        opacity: 0,
        x: 50,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: widget,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });

      var cats = widget.querySelectorAll(".sidebar__cat-item");
      var news = widget.querySelectorAll(".sidebar__news-item");
      var items = cats.length ? cats : news;
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          x: 15,
          duration: 0.4,
          stagger: 0.07,
          delay: 0.25,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: widget,
            start: "top 88%",
            toggleActions: "play none none none",
          }
        });
      }
    });
  }

  /*--------------------------------------------------------------
   * Blog Details Animations
   * Each section has its own independent ScrollTrigger so animations
   * fire as the user scrolls to each element — not all at once.
   *-------------------------------------------------------------*/
  function blogDetailsAnimations() {
    if (!document.querySelector(".blog-details__layout")) return;

    var safetyTimer = setTimeout(function () {
      gsap.set(
        ".blog-details__main-img-wrap, .blog-details__meta-pill, .blog-details__title, .blog-details__desc, .blog-details__list-item, .blog-details__video-wrap, .blog-details__blockquote, .blog-details__blockquote-line, .blog-details__sub-img-wrap, .blog-details__footer, .blog-details__comment-item, .blog-details__form-wrap, .blog-details .sidebar__widget, .blog-details .sidebar__cat-item, .blog-details .sidebar__news-item",
        { clearProps: "all" }
      );
    }, 8000);

    var mainImgWrap = document.querySelector(".blog-details__main-img-wrap");
    var subImgWraps = document.querySelectorAll(".blog-details__sub-img-wrap");
    var videoWrap = document.querySelector(".blog-details__video-wrap");

    // — — — GROUP 1: Main Image Wrap — — —
    if (mainImgWrap) {
      gsap.set(mainImgWrap, { clipPath: "inset(0% 0% 100% 0%)" });

      gsap.to(mainImgWrap, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: mainImgWrap,
          start: "top 85%",
          toggleActions: "play none none none",
          onComplete: function () { gsap.set(mainImgWrap, { clearProps: "clip-path" }); }
        },
        onComplete: function () { gsap.set(mainImgWrap, { clearProps: "clip-path" }); }
      });

      gsap.from(".blog-details__meta-pill", {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.5)",
        delay: 0.6,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: mainImgWrap,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 2: Title — — —
    gsap.from(".blog-details__title", {
      opacity: 0,
      y: 35,
      duration: 0.7,
      ease: "power3.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".blog-details__title",
        start: "top 88%",
        toggleActions: "play none none none",
      }
    });

    // — — — GROUP 3: Descriptions (each individually) — — —
    document.querySelectorAll(".blog-details__content > .blog-details__desc").forEach(function (desc) {
      gsap.from(desc, {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: desc,
          start: "top 90%",
          toggleActions: "play none none none",
        }
      });
    });

    // — — — GROUP 4: Checklist Items — — —
    var listEl = document.querySelector(".blog-details__list");
    if (listEl) {
      gsap.from(".blog-details__list-item", {
        opacity: 0,
        x: -22,
        duration: 0.45,
        stagger: 0.09,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: listEl,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 5: Video Wrap — — —
    if (videoWrap) {
      gsap.set(videoWrap, { clipPath: "inset(0% 0% 100% 0%)" });

      gsap.to(videoWrap, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: videoWrap,
          start: "top 88%",
          toggleActions: "play none none none",
          onComplete: function () { gsap.set(videoWrap, { clearProps: "clip-path" }); }
        },
        onComplete: function () { gsap.set(videoWrap, { clearProps: "clip-path" }); }
      });

      gsap.from(".blog-details__video-wrap .play-btn", {
        opacity: 0,
        scale: 0.5,
        duration: 0.55,
        delay: 0.55,
        ease: "back.out(1.8)",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: videoWrap,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 6: Blockquote — — —
    var blockquote = document.querySelector(".blog-details__blockquote");
    if (blockquote) {
      gsap.from(blockquote, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: blockquote,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });

      gsap.from(".blog-details__blockquote-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: blockquote,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 7: Sub Images — — —
    if (subImgWraps.length) {
      gsap.set(subImgWraps, { clipPath: "inset(0% 0% 100% 0%)" });
      var subImgGrid = document.querySelector(".blog-details__sub-images");

      subImgWraps.forEach(function (wrap, i) {
        gsap.to(wrap, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.85,
          delay: i * 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subImgGrid || wrap,
            start: "top 88%",
            toggleActions: "play none none none",
            onComplete: function () { gsap.set(wrap, { clearProps: "clip-path" }); }
          },
          onComplete: function () { gsap.set(wrap, { clearProps: "clip-path" }); }
        });
      });
    }

    // — — — GROUP 8: Footer (Tags + Share) — — —
    var footerEl = document.querySelector(".blog-details__footer");
    if (footerEl) {
      gsap.from(footerEl, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: footerEl,
          start: "top 90%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 9: Comments — — —
    var commentsEl = document.querySelector(".blog-details__comments");
    if (commentsEl) {
      gsap.from(".blog-details__comment-item", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        stagger: 0.16,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: commentsEl,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 10: Leave a Comment Form — — —
    var formWrap = document.querySelector(".blog-details__form-wrap");
    if (formWrap) {
      gsap.from(formWrap, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: formWrap,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    }

    // — — — GROUP 11: Sidebar Widgets (each independently) — — —
    document.querySelectorAll(".blog-details .sidebar__widget").forEach(function (widget, i) {
      gsap.from(widget, {
        opacity: 0,
        x: 50,
        duration: 0.75,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: widget,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });

      // Stagger items inside each widget
      var cats = widget.querySelectorAll(".sidebar__cat-item");
      var news = widget.querySelectorAll(".sidebar__news-item");
      var items = cats.length ? cats : news;
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          x: 15,
          duration: 0.4,
          stagger: 0.07,
          delay: 0.25,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: widget,
            start: "top 88%",
            toggleActions: "play none none none",
          }
        });
      }
    });
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
