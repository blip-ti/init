/**
 * ИНЖЕНЕРНАЯ ШКОЛА - Landing Page Interactive Logic
 * Handles Roadmap Navigation, Filters, Interactive Checklist,
 * FAQ Accordion, Mobile Menu, and Smooth Scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRoadmapControls();
  initChecklistTracker();
  initFaqAccordion();
  initSmoothScroll();
});

/* ==========================================================================
   1. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   2. Interactive Roadmap Controls & Modes
   ========================================================================== */
function initRoadmapControls() {
  const stepButtons = document.querySelectorAll('.step-btn');
  const stageCards = document.querySelectorAll('.stage-card');
  const viewAllBtn = document.getElementById('view-all-btn');
  const viewTabbedBtn = document.getElementById('view-tabbed-btn');
  let currentMode = 'all'; // 'all' or 'tabbed'

  function updateActiveStage(index) {
    stepButtons.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (currentMode === 'tabbed') {
      stageCards.forEach((card, i) => {
        if (i === index) {
          card.style.display = 'block';
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          card.style.display = 'none';
        }
      });
    } else {
      // In 'all' view mode, smooth scroll to the selected card
      const targetCard = document.getElementById(`stage-card-${index}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const stageIdx = parseInt(btn.getAttribute('data-stage'), 10);
      updateActiveStage(stageIdx);
    });
  });

  if (viewAllBtn && viewTabbedBtn) {
    viewAllBtn.addEventListener('click', () => {
      currentMode = 'all';
      viewAllBtn.classList.add('active');
      viewTabbedBtn.classList.remove('active');
      stageCards.forEach(card => card.style.display = 'block');
    });

    viewTabbedBtn.addEventListener('click', () => {
      currentMode = 'tabbed';
      viewTabbedBtn.classList.add('active');
      viewAllBtn.classList.remove('active');
      // Show currently active stage only
      const activeBtn = document.querySelector('.step-btn.active') || stepButtons[0];
      const stageIdx = parseInt(activeBtn.getAttribute('data-stage'), 10);
      updateActiveStage(stageIdx);
    });
  }
}

/* ==========================================================================
   3. Interactive Checklist & Progress Tracker
   ========================================================================== */
function initChecklistTracker() {
  const checkboxes = document.querySelectorAll('.kpi-check');
  const countDisplay = document.getElementById('checked-count');
  const totalTasks = checkboxes.length;
  const viewChecklistBtn = document.getElementById('view-checklist-btn');

  // Load from localStorage if present
  const savedChecks = JSON.parse(localStorage.getItem('engineering_school_kpi_checks') || '{}');

  checkboxes.forEach(cb => {
    const key = cb.getAttribute('data-item');
    if (savedChecks[key]) {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
      savedChecks[key] = cb.checked;
      localStorage.setItem('engineering_school_kpi_checks', JSON.stringify(savedChecks));
      updateCheckCount();

      if (cb.checked) {
        showToast('Пункт дорожной карты отмечен как выполненный');
      }
    });
  });

  function updateCheckCount() {
    const checked = document.querySelectorAll('.kpi-check:checked').length;
    if (countDisplay) {
      countDisplay.textContent = checked;
    }
  }

  updateCheckCount();

  if (viewChecklistBtn) {
    viewChecklistBtn.addEventListener('click', () => {
      const checked = document.querySelectorAll('.kpi-check:checked').length;
      showToast(`Прогресс внедрения: ${checked} из ${totalTasks} задач выполнено`);
      const targetCard = document.getElementById('roadmap');
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('active');
          const btn = i.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

/* ==========================================================================
   5. Smooth Scroll Navigation
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   6. Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
}
