/* 
========================================================================
   INTERACTION ENGINE: BOLD LIFE LADIES INITIATIVE
   Author: Antigravity AI
======================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. THEME SWITCHER (LIGHT / DARK)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  // Load saved theme preference, defaulting to light mode (logo theme)
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  }

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  // ==========================================
  // 1. MOBILE SIDEBAR MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
      item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 2. NAVBAR SCROLL STATE & ACTIVE LINK TRACKING
  // ==========================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section, header');
  
  const handleScroll = () => {
    // Toggle scrolled state on header navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll active link highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Offset by navbar height (approx 80px)
      if (window.scrollY >= (sectionTop - 120)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinksItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  // Initial run in case page starts scrolled
  handleScroll();


  // ==========================================
  // 3. INTERSECTION OBSERVER FOR ENTRANCE REVEALS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop tracking to optimize layout rendering
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // Viewport
    threshold: 0.12, // Trigger when 12% is visible
    rootMargin: '0px 0px -50px 0px' // Slightly offset the bottom trigger
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ==========================================
  // 4. INTERACTIVE DONATION IMPACT SELECTOR
  // ==========================================
  const tierBtns = document.querySelectorAll('.tier-btn');
  const customDonationInput = document.getElementById('custom-donation');
  const donationImpactIcon = document.getElementById('donation-impact-icon');
  const donationImpactTitle = document.getElementById('donation-impact-title');
  const donationImpactDesc = document.getElementById('donation-impact-desc');
  const donateSubmitBtn = document.getElementById('donate-submit-btn');
  const impacts = {
    under5000: {
      icon: '❤️',
      title: 'Community Support Circle',
      desc: 'Your donation of ₦[value] funds printing of mental health safety brochures and support materials for local girls.'
    },
    tier5000: {
      icon: '🎒',
      title: 'Educational Starter Kit',
      desc: 'Your ₦5,000 donation supplies books, writing pads, mathematical sets, and a durable schoolbag for an entire school term.'
    },
    tier15000: {
      icon: '💻',
      title: 'Digital Skills Training',
      desc: 'Your ₦15,000 donation covers 1 month of high-speed internet subscription and learning-portal credits for our coding bootcamp.'
    },
    tier50000: {
      icon: '🎓',
      title: 'Tertiary Registration Fund',
      desc: 'Your ₦50,000 donation covers first-year admission processing costs and syllabus books for a high-achieving high school graduate.'
    },
    tier100000: {
      icon: '🧵',
      title: 'Sovereign Business Startup Kit',
      desc: 'Your ₦100,000 donation directly buys a vocational graduate her toolkits (such as an industrial sewing machine or bakery equipment).'
    }
  };

  const updateDonationImpact = (amount) => {
    let selectedImpact;
    
    if (amount < 5000) {
      selectedImpact = { ...impacts.under5000 };
      selectedImpact.desc = selectedImpact.desc.replace('[value]', amount.toLocaleString());
    } else if (amount >= 5000 && amount < 15000) {
      selectedImpact = impacts.tier5000;
    } else if (amount >= 15000 && amount < 50000) {
      selectedImpact = impacts.tier15000;
    } else if (amount >= 50000 && amount < 100000) {
      selectedImpact = impacts.tier50000;
    } else {
      selectedImpact = impacts.tier100000;
    }

    donationImpactIcon.textContent = selectedImpact.icon;
    donationImpactTitle.textContent = selectedImpact.title;
    donationImpactDesc.textContent = selectedImpact.desc;
  };

  // Preset button clicks
  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const amount = btn.dataset.amount;
      customDonationInput.value = amount;
      updateDonationImpact(parseInt(amount));
    });
  });

  // Custom input typing
  customDonationInput.addEventListener('input', (e) => {
    let amount = parseInt(e.target.value) || 0;
    
    // Sync presets button styling
    tierBtns.forEach(btn => {
      if (parseInt(btn.dataset.amount) === amount) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    updateDonationImpact(amount);
  });

  // Submit Donation Handler
  if (donateSubmitBtn) {
    donateSubmitBtn.addEventListener('click', () => {
      const donationVal = parseInt(customDonationInput.value) || 0;
      if (donationVal <= 0) {
        alert('Please enter a valid donation amount greater than 0.');
        return;
      }
      alert(`Note: Need to connect Paystack/Flutterwave API here to collect this ₦${donationVal.toLocaleString()} donation.`);
    });
  }

  // ==========================================
  // 5. VOLUNTEER & CONTACT FORM VALIDATIONS
  // ==========================================

  // Validation styling helpers
  const showFieldError = (input) => {
    input.style.borderColor = 'var(--primary)';
    input.style.boxShadow = '0 0 10px rgba(255, 94, 126, 0.2)';
  };

  const clearFieldError = (input) => {
    input.style.borderColor = 'var(--glass-border)';
    input.style.boxShadow = 'none';
  };

  const handleFormSubmission = (formId, successId) => {
    const form = document.getElementById(formId);
    const successMessage = document.getElementById(successId);

    if (!form || !successMessage) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input, select, textarea');

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          showFieldError(input);
          
          // Add instant reset on keystroke
          input.addEventListener('input', function handler() {
            if (this.checkValidity()) {
              clearFieldError(this);
              this.removeEventListener('input', handler);
            }
          });
        } else {
          clearFieldError(input);
        }
      });

      if (isValid) {
        // Collect form data (for simulation demo console check)
        const formData = {};
        inputs.forEach(input => {
          formData[input.id] = input.value;
        });
        console.log(`[Form Submitted: ${formId}]`, formData);

        // Transition fade out form, fade in success banner
        form.style.display = 'none';
        successMessage.style.display = 'block';
      }
    });
  };

  handleFormSubmission('volunteer-form', 'volunteer-success');
  handleFormSubmission('contact-form', 'contact-success');


  // ==========================================
  // 6. NEWSLETTER REGISTRATION SUBMIT
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.checkValidity()) {
        alert(`TODO: Connect newsletter subscription for ${input.value} to Mailchimp or a database.`);
        input.value = '';
      }
    });
  }

});
