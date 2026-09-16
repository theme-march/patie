================================================================
  PATIE – Pet Care Services HTML Template
  Version:  1.0.0
  Author:   Thememarch
================================================================


----------------------------------------------------------------
  TABLE OF CONTENTS
----------------------------------------------------------------
  1. Template Overview
  2. File Structure
  3. Pages Included
  4. Getting Started
  5. PHP Mail Setup
  6. Third-Party Credits & Licenses
  7. Changelog


----------------------------------------------------------------
  1. TEMPLATE OVERVIEW
----------------------------------------------------------------

Patie is a clean, modern HTML template built for pet care
businesses – including grooming salons, pet boarding facilities,
veterinary clinics, and pet care service providers.

Features:
  - 3 Homepage Variations (Pet Home Care, Pet Grooming, Pet Boarding)
  - 26 HTML pages total
  - Fully responsive (mobile, tablet, desktop)
  - Built with Bootstrap 5
  - GSAP & ScrollTrigger animations
  - AOS (Animate On Scroll) integration
  - Swiper.js sliders
  - Light Gallery image viewer
  - Dashboard UI pages
  - Shop, Cart & Checkout pages
  - Blog & Blog Details pages
  - Working contact & appointment PHP mail scripts
  - SASS/SCSS source files included


----------------------------------------------------------------
  2. FILE STRUCTURE
----------------------------------------------------------------

patie/
├── index.html               (Homepage – Pet Home Care)
├── pet-grooming.html        (Homepage – Pet Grooming)
├── pet-boarding.html        (Homepage – Pet Boarding)
├── about.html
├── service.html
├── service-details.html
├── team.html
├── team-details.html
├── blog.html
├── blog-standard.html
├── blog-details.html
├── shop.html
├── shop-details.html
├── cart.html
├── checkout.html
├── contact.html
├── sign-in.html
├── sign-up.html
├── forget-password.html
├── password-reset.html
├── set-newpassword.html
├── dashboard.html
├── 404.html
├── dashboard/
│   ├── order.html
│   ├── lead-management.html
│   └── change-password.html
├── assets/
│   ├── css/
│   │   ├── style.css            (compiled stylesheet)
│   │   ├── preloader.css
│   │   └── plugins/             (third-party CSS)
│   ├── js/
│   │   ├── main.js              (custom scripts)
│   │   └── plugins/             (third-party JS)
│   ├── sass/                    (SCSS source files)
│   ├── img/                     (all template images)
│   └── php/                     (mail handler scripts)
└── readme.txt


----------------------------------------------------------------
  3. PAGES INCLUDED
----------------------------------------------------------------

  HOMEPAGES
  - index.html            Pet Home Care
  - pet-grooming.html     Pet Grooming
  - pet-boarding.html     Pet Boarding

  INNER PAGES
  - about.html            About Us
  - service.html          Services
  - service-details.html  Service Details
  - team.html             Team
  - team-details.html     Team Member Details
  - blog.html             Blog (Grid)
  - blog-standard.html    Blog (Standard/List)
  - blog-details.html     Blog Single Post
  - shop.html             Shop
  - shop-details.html     Product Details
  - cart.html             Shopping Cart
  - checkout.html         Checkout
  - contact.html          Contact Us
  - 404.html              404 Error Page

  AUTH PAGES
  - sign-in.html
  - sign-up.html
  - forget-password.html
  - password-reset.html
  - set-newpassword.html

  DASHBOARD PAGES
  - dashboard.html
  - dashboard/order.html
  - dashboard/lead-management.html
  - dashboard/change-password.html


----------------------------------------------------------------
  4. GETTING STARTED
----------------------------------------------------------------

1. Unzip the downloaded package.
2. Open any .html file in your browser to preview locally.
3. To customize styles, edit the SCSS files in assets/sass/
   and recompile to assets/css/style.css using a Sass compiler
   (e.g. VS Code Live Sass Compiler, or `sass --watch`).
4. To deploy, upload all files to your web server.
5. Update the PHP mail scripts before going live (see section 5).


----------------------------------------------------------------
  5. PHP MAIL SETUP
----------------------------------------------------------------

The template includes three PHP scripts for form handling:

  assets/php/mail.php          (contact form)
  assets/php/appointment.php   (appointment/booking form)
  assets/php/footeremail.php   (footer newsletter subscription)

IMPORTANT: Before going live, open each file and replace:

  $to = 'youremail@yourdomain.com';

...with your actual email address.

All inputs are sanitized using htmlspecialchars(), strip_tags(),
and filter_var() to prevent injection attacks.

Note: The PHP mail() function requires a server with mail
enabled. For production use, consider a transactional email
service such as PHPMailer with SMTP (e.g. SendGrid, Mailgun).


----------------------------------------------------------------
  6. THIRD-PARTY CREDITS & LICENSES
----------------------------------------------------------------

The following libraries are used in this template. All are
included locally in the assets/js/plugins/ or
assets/css/plugins/ directories.

  Bootstrap 5.x
  License: MIT
  https://getbootstrap.com

  Font Awesome 6.x
  License: SIL OFL 1.1 (icons), MIT (code)
  https://fontawesome.com

  GSAP (GreenSock Animation Platform) 3.15+
  License: Standard License (free for commercial use)
  https://gsap.com

  SplitText (GSAP plugin) 3.15+
  License: Standard License (free for commercial use)
  https://gsap.com/docs/v3/Plugins/SplitText

  ScrollTrigger (GSAP plugin) 3.15+
  License: Standard License (free for commercial use)
  https://gsap.com/docs/v3/Plugins/ScrollTrigger

  AOS – Animate On Scroll 2.x
  License: MIT
  https://michalsnik.github.io/aos/

  Swiper 8.x
  License: MIT
  https://swiperjs.com

  LightGallery
  License: GPLv3 (free for personal/open-source)
  https://www.lightgalleryjs.com
  Note: A commercial license is required for commercial use.
  Purchase at: https://www.lightgalleryjs.com/license/

  jQuery 3.7.1
  License: MIT
  https://jquery.com

  Chart.js 4.4.0
  License: MIT
  https://www.chartjs.org

  chartjs-plugin-datalabels 2.2.0
  License: MIT
  https://chartjs-plugin-datalabels.netlify.app

  Simple Pagination
  License: MIT
  https://github.com/flaviusmatis/simplePagination.js

  Google Fonts
  License: SIL Open Font License
  https://fonts.google.com

  Demo images are NOT included in the download.
  All placeholder images are for demonstration purposes only
  and are NOT licensed for redistribution.


----------------------------------------------------------------
  7. CHANGELOG
----------------------------------------------------------------

  Version 1.0.0 – Initial Release
  - 26 HTML pages
  - 3 homepage variations
  - Full SCSS source included
  - Dashboard UI
  - PHP mail handlers with input sanitization
  - GSAP 3.15 (free standard license)

================================================================
  Thank you for purchasing Patie!
  For support, please contact us via our ThemeForest profile.
================================================================
