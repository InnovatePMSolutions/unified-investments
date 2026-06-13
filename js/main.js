/**
 * UNIFIED INVESTMENTS INC.
 * js/main.js — Isolated Behavior Layer
 *
 * Architecture: All logic wrapped in DOMContentLoaded.
 * No globals polluted. No inline event handlers in HTML.
 * Each feature is a self-contained init function.
 *
 * Feature Modules:
 *  1. Navigation Scroll State
 *  2. Mobile Drawer Toggle
 *  3. Dynamic Copyright Year
 *  4. Mobile Sticky CTA Bar
 *  5. Bid Request Form Validation
 *  6. Smooth Anchor Scroll (augmented)
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ============================================================
  // 1. NAVIGATION SCROLL STATE
  //    Adds a .scrolled class to the header after 40px of scroll
  //    for a subtle background darkening effect.
  // ============================================================
  (function initNavScrollState() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var SCROLL_THRESHOLD = 40;
    var ticking = false;

    function updateNavState() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateNavState);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load in case page is loaded mid-scroll
    updateNavState();
  })();


  // ============================================================
  // 2. MOBILE DRAWER TOGGLE
  //    Handles burger open/close, overlay click-out to dismiss,
  //    ESC key to close, and body scroll lock.
  // ============================================================
  (function initMobileDrawer() {
    var burger = document.getElementById('nav-burger');
    var drawer = document.getElementById('mobile-drawer');
    var body   = document.body;
    if (!burger || !drawer) return;

    var isOpen = false;

    function openDrawer() {
      isOpen = true;
      burger.classList.add('is-open');
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close navigation menu');
      body.classList.add('drawer-open');
      // Move focus into the drawer for keyboard accessibility
      var firstLink = drawer.querySelector('a, button');
      if (firstLink) {
        firstLink.focus();
      }
    }

    function closeDrawer() {
      isOpen = false;
      burger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open navigation menu');
      body.classList.remove('drawer-open');
      burger.focus();
    }

    // Burger toggle
    burger.addEventListener('click', function () {
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close drawer when any link inside it is clicked (data-drawer-close)
    var drawerCloseLinks = drawer.querySelectorAll('[data-drawer-close]');
    drawerCloseLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });

    // ESC key closes the drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    });

    // Close if user clicks outside the drawer on a wide viewport that
    // somehow triggers the event (belt-and-suspenders)
    document.addEventListener('click', function (e) {
      if (
        isOpen &&
        !drawer.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeDrawer();
      }
    });
  })();


  // ============================================================
  // 3. DYNAMIC COPYRIGHT YEAR
  //    Injects the current year into the footer copyright line
  //    so no one ever needs to manually update it.
  // ============================================================
  (function initCopyrightYear() {
    var yearEl = document.getElementById('footer-year');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear().toString();
  })();


  // ============================================================
  // 4. MOBILE STICKY CTA BAR
  //    Displays a fixed bottom bar on mobile after the user
  //    scrolls past the hero section. Hides when the user
  //    reaches the bid form section (redundant at that point).
  // ============================================================
  (function initMobileStickyBar() {
    var bar     = document.getElementById('mobile-sticky-bar');
    var hero    = document.getElementById('hero');
    var bidForm = document.getElementById('bid-form');
    if (!bar) return;

    var ticking = false;
    var MOBILE_BREAKPOINT = 768;

    function updateBarVisibility() {
      // Only apply on mobile viewports
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        bar.classList.remove('is-visible');
        ticking = false;
        return;
      }

      var scrollY       = window.scrollY;
      var heroBottom    = hero ? (hero.offsetTop + hero.offsetHeight) : 300;
      var formTop       = bidForm ? bidForm.offsetTop : Infinity;
      var windowBottom  = scrollY + window.innerHeight;

      // Show after hero, hide when bid form is in view
      var pastHero    = scrollY > heroBottom;
      var formVisible = windowBottom > formTop + 100;

      if (pastHero && !formVisible) {
        bar.classList.add('is-visible');
      } else {
        bar.classList.remove('is-visible');
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateBarVisibility);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateBarVisibility);
        ticking = true;
      }
    }, { passive: true });

    updateBarVisibility();
  })();


  // ============================================================
  // 5. BID REQUEST FORM VALIDATION
  //    Client-side validation with real-time error states and
  //    accessible ARIA-live error messages. Submits to Netlify
  //    on success (native form handling takes over after validation).
  // ============================================================
  (function initFormValidation() {
    var form       = document.getElementById('bid-request-form');
    var submitBtn  = document.getElementById('bid-submit-btn');
    if (!form || !submitBtn) return;

    // ---- Validation Rules ----------------------------------------
    var validators = {
      'field-name': {
        errorId: 'error-name',
        validate: function (val) {
          if (!val.trim()) return 'Please enter your full name.';
          if (val.trim().length < 2) return 'Name must be at least 2 characters.';
          return null;
        }
      },
      'field-company': {
        errorId: 'error-company',
        validate: function (val) {
          if (!val.trim()) return 'Please enter your company or organization name.';
          return null;
        }
      },
      'field-email': {
        errorId: 'error-email',
        validate: function (val) {
          if (!val.trim()) return 'Please enter your email address.';
          // RFC-5321 simplified pattern
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailPattern.test(val.trim())) {
            return 'Please enter a valid email address (e.g. name@company.com).';
          }
          return null;
        }
      },
      'field-address': {
        errorId: 'error-address',
        validate: function (val) {
          if (!val.trim()) return 'Please enter the property address.';
          if (val.trim().length < 8) return 'Please enter a complete street address.';
          return null;
        }
      },
      'field-service': {
        errorId: 'error-service',
        validate: function (val) {
          if (!val) return 'Please select a service type.';
          return null;
        }
      },
      'field-urgency': {
        errorId: 'error-urgency',
        validate: function (val) {
          if (!val) return 'Please select an urgency level.';
          return null;
        }
      }
    };

    // ---- Helper: show/clear single field error --------------------
    function showError(fieldId, message) {
      var field    = document.getElementById(fieldId);
      var errorEl  = document.getElementById(validators[fieldId].errorId);
      if (!field || !errorEl) return;

      field.classList.add('has-error');
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', validators[fieldId].errorId);
    }

    function clearError(fieldId) {
      var field   = document.getElementById(fieldId);
      var errorEl = document.getElementById(validators[fieldId].errorId);
      if (!field || !errorEl) return;

      field.classList.remove('has-error');
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
    }

    // ---- Validate a single field by its ID -----------------------
    function validateField(fieldId) {
      var field = document.getElementById(fieldId);
      if (!field) return true;
      var error = validators[fieldId].validate(field.value);
      if (error) {
        showError(fieldId, error);
        return false;
      } else {
        clearError(fieldId);
        return true;
      }
    }

    // ---- Validate all fields, return true if all pass ------------
    function validateAll() {
      var valid = true;
      var firstInvalidId = null;

      Object.keys(validators).forEach(function (fieldId) {
        var fieldValid = validateField(fieldId);
        if (!fieldValid) {
          valid = false;
          if (!firstInvalidId) {
            firstInvalidId = fieldId;
          }
        }
      });

      // Scroll to and focus the first invalid field for accessibility
      if (firstInvalidId) {
        var firstInvalidEl = document.getElementById(firstInvalidId);
        if (firstInvalidEl) {
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalidEl.focus();
        }
      }

      return valid;
    }

    // ---- Real-time validation: clear errors on input/change ------
    Object.keys(validators).forEach(function (fieldId) {
      var field = document.getElementById(fieldId);
      if (!field) return;

      // Validate on blur (when leaving a field)
      field.addEventListener('blur', function () {
        validateField(fieldId);
      });

      // Clear error on input/change (user is correcting)
      field.addEventListener('input', function () {
        if (field.classList.contains('has-error')) {
          clearError(fieldId);
        }
      });

      field.addEventListener('change', function () {
        if (field.classList.contains('has-error')) {
          validateField(fieldId);
        }
      });
    });

    // ---- Form submit handler -------------------------------------
    form.addEventListener('submit', function (e) {
      var isValid = validateAll();

      if (!isValid) {
        e.preventDefault();
        return;
      }

      // Valid: show loading state on button before Netlify submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
      submitBtn.setAttribute('aria-busy', 'true');

      // Netlify's native form handler takes over after this point.
      // The form will POST to /success (configured in action attr).
      // If you need to intercept with fetch() instead of native POST,
      // uncomment the block below and comment out the native submit above.

      /*
      e.preventDefault();
      var formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(function () {
          showSuccessMessage();
        })
        .catch(function (err) {
          console.error('Form submission error:', err);
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Submit Bid Request';
          submitBtn.removeAttribute('aria-busy');
          alert('There was a problem submitting your request. Please try again or contact us directly.');
        });
      */
    });

    // ---- Optional: post-AJAX success state (used if fetch block enabled) ---
    function showSuccessMessage() {
      var formPanel = form.closest('.bid-section__form-panel');
      if (!formPanel) return;

      formPanel.innerHTML = [
        '<div class="bid-form-success" role="alert" aria-live="assertive">',
        '  <div class="bid-form-success__icon" aria-hidden="true">',
        '    <i class="fa-solid fa-circle-check"></i>',
        '  </div>',
        '  <h3 class="bid-form-success__title">Bid Request Submitted</h3>',
        '  <p class="bid-form-success__body">',
        '    Thank you — a Unified Investments field operations manager will respond',
        '    with a written estimate within 2–4 business hours.',
        '    Emergency assignments will be acknowledged within 60 minutes.',
        '  </p>',
        '  <a href="#services" class="btn btn--outline-dark">',
        '    <i class="fa-solid fa-list-check" aria-hidden="true"></i>',
        '    Review Our Services',
        '  </a>',
        '</div>'
      ].join('');
    }
  })();


  // ============================================================
  // 6. SMOOTH ANCHOR SCROLL (AUGMENTED)
  //    The CSS scroll-behavior: smooth handles most cases,
  //    but this JS augmentation ensures sticky header offset is
  //    respected on older browsers and for dynamically calculated
  //    positions. Also fires the mobile drawer close if needed.
  // ============================================================
  (function initAnchorScroll() {
    var NAV_HEIGHT = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
      10
    );
    var EXTRA_OFFSET = 16; // Breathing room below nav

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        var targetTop    = targetEl.getBoundingClientRect().top + window.scrollY;
        var scrollTarget = targetTop - NAV_HEIGHT - EXTRA_OFFSET;

        window.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });

        // Update URL hash without triggering a jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }

        // If target is the bid form, put focus on the first input
        if (targetId === '#bid-form') {
          setTimeout(function () {
            var firstInput = document.getElementById('field-name');
            if (firstInput) firstInput.focus();
          }, 600);
        }
      });
    });
  })();


  // ============================================================
  // END OF MAIN.JS
  // ============================================================

});
