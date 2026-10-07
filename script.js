/* ==========================================================================
   VICTORY SOCCER ARENA — Interactive Experience
   Vanilla JavaScript | No dependencies
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     PAGE LOADER
     ---------------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 400);
    });
    // Fallback in case load doesn't fire
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
    }, 3000);
  }


  /* ----------------------------------------------------------------------
     THEME TOGGLE — persistent light/dark mode
     ---------------------------------------------------------------------- */
  (function () {
    var root = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    var mobileToggle = document.getElementById('mobileThemeToggle');
    var saved = localStorage.getItem('victory-theme');
    var theme = saved || 'light';

    function applyTheme(next) {
      theme = next === 'dark' ? 'dark' : 'light';
      root.setAttribute('data-theme', theme);
      localStorage.setItem('victory-theme', theme);
      var dark = theme === 'dark';
      [toggle, mobileToggle].forEach(function (btn) {
        if (!btn) return;
        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        var text = btn.querySelector('.theme-toggle__text');
        if (text) text.textContent = dark ? 'Light mode' : 'Dark mode';
        var icon = btn.querySelector('.theme-toggle__icon');
        if (icon) icon.textContent = dark ? '☀' : '☾';
        if (btn.classList.contains('mobile-theme-toggle')) btn.innerHTML = '<span aria-hidden="true">' + (dark ? '☀' : '☾') + '</span> ' + (dark ? 'Light mode' : 'Dark mode');
      });
    }
    applyTheme(theme);
    if (toggle) toggle.addEventListener('click', function () { applyTheme(theme === 'dark' ? 'light' : 'dark'); });
    if (mobileToggle) mobileToggle.addEventListener('click', function () { applyTheme(theme === 'dark' ? 'light' : 'dark'); });
  })();

  /* ----------------------------------------------------------------------
     NAVIGATION SCROLL
     ---------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const whatsappFloat = document.getElementById('whatsappFloat');

  function handleScroll() {
    const scrolled = window.pageYOffset > 60;
    if (nav) nav.classList.toggle('nav--scrolled', scrolled);
    if (whatsappFloat) whatsappFloat.classList.toggle('visible', window.pageYOffset > 400);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----------------------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ----------------------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
     ---------------------------------------------------------------------- */
  var revealElements = document.querySelectorAll('.reveal, .reveal-text, .reveal-image');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------------------
     THE VICTORY EXPERIENCE — Sticky scroll word/image switching
     ---------------------------------------------------------------------- */
  var experiencePanels = document.getElementById('experiencePanels');
  var experienceBg = document.getElementById('experienceBg');
  var experienceWord = document.getElementById('experienceWord');
  var experienceDesc = document.getElementById('experienceDesc');
  var experienceProgress = document.getElementById('experienceProgress');

  if (experiencePanels && experienceBg) {
    var bgImages = experienceBg.querySelectorAll('img');
    var progressItems = experienceProgress ? experienceProgress.querySelectorAll('.experience__progress-item') : [];

    var words = ['PLAY', 'EAT', 'CONNECT', 'UNWIND'];
    var descs = [
      'The pitch is just the beginning. Quality artificial turf, floodlights and space for every kind of game.',
      'Restaurant and bar on site. Great food, cold drinks and no reason to leave hungry.',
      'Where people meet. Friends, teams, rivals and regulars — Victory is where the community gathers.',
      'Stay back, relax, let the night settle. The arena is as much about after the game as during it.'
    ];

    function updateExperience() {
      var rect = experiencePanels.getBoundingClientRect();
      var panelHeight = experiencePanels.offsetHeight;
      var stickyHeight = window.innerHeight;
      var scrollable = panelHeight - stickyHeight;

      if (scrollable <= 0) return;

      var scrolled = Math.max(0, -rect.top);
      var progress = Math.min(1, scrolled / scrollable);
      var index = Math.min(words.length - 1, Math.floor(progress * words.length));

      // Update background images
      bgImages.forEach(function (img, i) {
        img.classList.toggle('active', i === index);
      });

      // Update word
      if (experienceWord && experienceWord.textContent !== words[index] + '.') {
        experienceWord.style.opacity = '0';
        experienceWord.style.transform = 'translateY(20px)';

        setTimeout(function () {
          experienceWord.innerHTML = words[index] + '<span class="accent-dot">.</span>';
          experienceWord.style.opacity = '1';
          experienceWord.style.transform = 'translateY(0)';
        }, 200);
      }

      // Update description
      if (experienceDesc) {
        experienceDesc.classList.remove('active');
        setTimeout(function () {
          experienceDesc.textContent = descs[index];
          experienceDesc.classList.add('active');
        }, 200);
      }

      // Update progress
      progressItems.forEach(function (item, i) {
        item.classList.toggle('active', i === index);
      });
    }

    // Only run on larger screens (sticky requires height)
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', updateExperience, { passive: true });
      updateExperience();
    } else {
      // On mobile, just show all images stacked with the first active
      if (bgImages.length > 0) bgImages[0].classList.add('active');
    }
  }

  /* ----------------------------------------------------------------------
     FACILITY SHOWCASE — Interactive image switching
     ---------------------------------------------------------------------- */
  var facilityList = document.getElementById('facilityList');
  var facilityVisual = document.getElementById('facilityVisual');
  var facilityLabel = document.getElementById('facilityLabel');
  var facilityCaption = document.getElementById('facilityCaption');

  if (facilityList && facilityVisual) {
    var items = facilityList.querySelectorAll('.facility-showcase__item');
    var images = facilityVisual.querySelectorAll('img');

    var captions = [
      { label: 'Artificial Turf', text: 'Professional-grade turf for a true game experience, day or night.' },
      { label: 'Floodlights', text: 'Full pitch illumination so the game never has to stop.' },
      { label: 'Changing Rooms', text: 'Clean, private changing rooms for pre-match and post-match.' },
      { label: 'Private Lockers', text: 'Secure storage for your belongings while you play.' },
      { label: 'Free Parking', text: 'Ample on-site parking at no cost to visitors.' },
      { label: 'Wheelchair Access', text: 'Accessible facilities designed for everyone to enjoy.' },
      { label: 'Restaurant', text: 'Fresh food served daily — from quick bites to full meals.' },
      { label: 'Bar', text: 'A stocked bar with drinks for every taste and occasion.' },
      { label: 'Car Wash', text: 'Professional car wash while you enjoy your game.' }
    ];

    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        activateFacility(parseInt(item.dataset.img, 10));
      });
      item.addEventListener('click', function () {
        activateFacility(parseInt(item.dataset.img, 10));
      });
    });

    function activateFacility(index) {
      items.forEach(function (it, i) {
        it.classList.toggle('active', i === index);
      });
      images.forEach(function (img, i) {
        img.classList.toggle('active', i === index);
      });
      if (facilityLabel) facilityLabel.textContent = captions[index].label;
      if (facilityCaption) facilityCaption.textContent = captions[index].text;
    }
  }

  /* ----------------------------------------------------------------------
     GALLERY — Filtering
     ---------------------------------------------------------------------- */
  var galleryFilters = document.querySelectorAll('.gallery-filter');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryFilters.length > 0) {
    galleryFilters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var category = filter.dataset.filter;

        galleryFilters.forEach(function (f) {
          f.classList.remove('active');
        });
        filter.classList.add('active');

        galleryItems.forEach(function (item) {
          var itemCat = item.dataset.category;
          if (category === 'all' || itemCat === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     GALLERY — Lightbox
     ---------------------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  if (lightbox && galleryItems.length > 0) {
    var currentLightboxIndex = 0;
    var visibleGalleryItems = [];

    function getVisibleItems() {
      return Array.from(galleryItems).filter(function (item) {
        return !item.classList.contains('hidden');
      });
    }

    function openLightbox(index) {
      visibleGalleryItems = getVisibleItems();
      currentLightboxIndex = index;
      showLightboxImage();
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    }

    function showLightboxImage() {
      var item = visibleGalleryItems[currentLightboxIndex];
      if (!item) return;
      var img = item.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      if (lightboxCaption) {
        lightboxCaption.textContent = img ? img.alt : '';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }

    function nextLightbox() {
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
      showLightboxImage();
    }

    function prevLightbox() {
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
      showLightboxImage();
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        var visible = getVisibleItems();
        var visibleIndex = visible.indexOf(item);
        if (visibleIndex >= 0) openLightbox(visibleIndex);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    });
  }

  /* ----------------------------------------------------------------------
     BOOKING FORM — WhatsApp submission
     ---------------------------------------------------------------------- */
  var bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var date = document.getElementById('date').value;
      var time = document.getElementById('time').value;
      var players = document.getElementById('players').value;
      var gameType = document.getElementById('gameType').value;
      var message = document.getElementById('message').value.trim();

      var waMessage = '*New Booking Request — Victory Soccer Arena*\n\n';
      waMessage += '*Name:* ' + (name || '—') + '\n';
      waMessage += '*Phone:* ' + (phone || '—') + '\n';
      waMessage += '*Date:* ' + (date || '—') + '\n';
      waMessage += '*Time:* ' + (time || '—') + '\n';
      waMessage += '*Players:* ' + (players || '—') + '\n';
      waMessage += '*Game Type:* ' + (gameType || '—') + '\n';
      waMessage += '*Message:* ' + (message || '—') + '\n';

      var waUrl = 'https://wa.me/256772519128?text=' + encodeURIComponent(waMessage);
      var waUrl = 'https://wa.me/256772519128?text=' + encodeURIComponent(waMessage);
      window.open(waUrl, '_blank');

      // Show confirmation
      var confirmation = document.getElementById('bookingConfirmation');
      if (confirmation) {
        confirmation.style.display = 'flex';
        bookingForm.style.display = 'none';
      }
    });
  }

  /* ----------------------------------------------------------------------
     EVENT ENQUIRY FORM — WhatsApp submission
     ---------------------------------------------------------------------- */
  var eventForm = document.getElementById('eventForm');

  if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('eventName').value.trim();
      var phone = document.getElementById('eventPhone').value.trim();
      var eventType = document.getElementById('eventType').value;
      var date = document.getElementById('eventDate').value;
      var participants = document.getElementById('eventParticipants').value;
      var message = document.getElementById('eventMessage').value.trim();

      var waMessage = '*Event Enquiry — Victory Soccer Arena*\n\n';
      waMessage += '*Name:* ' + (name || '—') + '\n';
      waMessage += '*Phone:* ' + (phone || '—') + '\n';
      waMessage += '*Event Type:* ' + (eventType || '—') + '\n';
      waMessage += '*Date:* ' + (date || '—') + '\n';
      waMessage += '*Participants:* ' + (participants || '—') + '\n';
      waMessage += '*Details:* ' + (message || '—') + '\n';

      var waUrl = 'https://wa.me/256772519128?text=' + encodeURIComponent(waMessage);
      window.open(waUrl, '_blank');

      var confirmation = document.getElementById('eventConfirmation');
      if (confirmation) {
        confirmation.style.display = 'flex';
        eventForm.style.display = 'none';
      }
    });
  }

  /* ----------------------------------------------------------------------
     ACADEMY ENQUIRY FORM — WhatsApp submission
     ---------------------------------------------------------------------- */
  var academyForm = document.getElementById('academyForm');

  if (academyForm) {
    academyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('academyName').value.trim();
      var phone = document.getElementById('academyPhone').value.trim();
      var childName = document.getElementById('childName').value.trim();
      var age = document.getElementById('childAge').value;
      var message = document.getElementById('academyMessage').value.trim();

      var waMessage = '*Academy Enquiry — Victory Soccer Arena*\n\n';
      waMessage += '*Parent/Guardian Name:* ' + (name || '—') + '\n';
      waMessage += '*Phone:* ' + (phone || '—') + '\n';
      waMessage += '*Child Name:* ' + (childName || '—') + '\n';
      waMessage += '*Child Age:* ' + (age || '—') + '\n';
      waMessage += '*Message:* ' + (message || '—') + '\n';

      var waUrl = 'https://wa.me/256792554114?text=' + encodeURIComponent(waMessage);
      window.open(waUrl, '_blank');

      var confirmation = document.getElementById('academyConfirmation');
      if (confirmation) {
        confirmation.style.display = 'flex';
        academyForm.style.display = 'none';
      }
    });
  }

  /* ----------------------------------------------------------------------
     CUSTOM CURSOR — Desktop only
     ---------------------------------------------------------------------- */
  var cursor = document.getElementById('cursor');

  if (cursor && window.matchMedia('(pointer: fine)').matches && window.innerWidth > 1024) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.classList.add('visible');
    });

    // Hover effect on interactive elements
    var hoverElements = document.querySelectorAll('a, button, .gallery-item, .facility-showcase__item, input, select, textarea');
    hoverElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('visible');
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ----------------------------------------------------------------------
     SMOOTH SCROLL — For anchor links within the same page
     ---------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------------------
     SUBTLE PARALLAX — Hero background
     ---------------------------------------------------------------------- */
  var heroBg = document.querySelector('.hero__bg img');
  var pageHeaderBg = document.querySelector('.page-header__bg img');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches === false) {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;

      if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = 'scale(1) translateY(' + scrolled * 0.3 + 'px)';
      }

      if (pageHeaderBg && scrolled < window.innerHeight * 0.7) {
        pageHeaderBg.style.transform = 'scale(1) translateY(' + scrolled * 0.25 + 'px)';
      }
    }, { passive: true });
  }

})();
