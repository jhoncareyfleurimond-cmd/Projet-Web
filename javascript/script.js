/* ===== PROFESSIONAL UNIVERSITY WEBSITE SCRIPT ===== */
'use strict';

//hero background
const hero = document.querySelector(".hero");
const backgrounds = [
  { src: "images/vie-1.jpg", position: "center center" },
  { src: "images/back.jpg", position: "center center" },
  { src: "images/12.jpg", position: "center 30%" },
  { src: "images/back2.jpg", position: "center center" },
  { src: "images/first-grad.jpg", position: "center 30%" },
  { src: "images/cos.jpg", position: "center center" },
  { src: "images/grad1.jpg", position: "center 20%" }
];
let currentImage = 2;

function changeBackground() {
  const currentBackground = backgrounds[currentImage];
  hero.style.background = `linear-gradient(rgba(2, 8, 23, 0.35), rgba(2, 8, 23, 0.55)), url(${currentBackground.src}) ${currentBackground.position} / cover no-repeat`;
  hero.style.backgroundAttachment = "slide";
  currentImage = (currentImage + 1) % backgrounds.length;
}
setInterval(changeBackground, 5000);
changeBackground();

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
const contactForm = document.getElementById('contactForm');
const loginModal = document.getElementById('loginModal');
const searchForm = document.querySelector('.search-bar');

// Demo student data
const demoStudents = {
  "ITA2026-001": {
    name: "Jean Paul",
    password: "1234",
    gpa: "3.72",
    credits: "18",
    presence: "96%",
    notes: [
      "Développement web avancé - 88/100",
      "Base de données - 91/100",
      "Réseaux informatiques - 84/100"
    ],
    schedule: [
      "Lundi : Génie logiciel",
      "Mardi : Base de données",
      "Mercredi : Réseaux",
      "Jeudi : Projet tutoré"
    ],
    messages: [
      "Nouvelle publication de notes.",
      "Rappel : paiement des frais avant vendredi.",
      "Réunion de classe à 14h00."
    ]
  },
  "ITA2026-002": {
    name: "Marie Claire",
    password: "1234",
    gpa: "3.91",
    credits: "21",
    presence: "98%",
    notes: [
      "Algorithmique - 94/100",
      "Développement mobile - 90/100",
      "Cybersécurité - 89/100"
    ],
    schedule: [
      "Lundi : Algorithmique",
      "Mardi : Développement mobile",
      "Mercredi : Sécurité réseau",
      "Vendredi : Stage"
    ],
    messages: [
      "Votre relevé est disponible.",
      "Conférence IA ce jeudi.",
      "Aucun retard administratif."
    ]
  }
};

// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.initTheme();
  }

  initTheme() {
    if (this.theme === 'dark') {
      body.classList.add('theme-dark');
      if (themeToggle) themeToggle.textContent = '☀️';
    }
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    body.classList.toggle('theme-dark');
    localStorage.setItem('theme', this.theme);
    if (themeToggle) {
      themeToggle.textContent = this.theme === 'dark' ? '☀️' : '🌓';
    }
  }
}

// ===== MOBILE MENU MANAGEMENT =====
class MobileMenu {
  constructor() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (mobilePanel) {
      mobilePanel.classList.toggle('open', this.isOpen);
    }
  }

  close() {
    this.isOpen = false;
    if (mobilePanel) {
      mobilePanel.classList.remove('open');
    }
  }
}

// ===== LOGIN MODAL MANAGEMENT =====
class LoginModalManager {
  constructor() {
    this.currentTab = 'student';
  }

  init() {
    this.setupTabSwitching();
    this.setupFormSubmissions();
    this.setupLoginButtons();
    this.setupModalClose();
  }

  setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');

        // Update active states
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const content = document.getElementById(`${tabName}Content`);
        if (content) content.classList.add('active');

        this.currentTab = tabName;
      });
    });
  }

  setupFormSubmissions() {
    // Student login
    const studentForm = document.getElementById('studentLoginModal');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleStudentLogin(studentForm);
      });
    }

    // Admin login
    const adminForm = document.getElementById('adminLoginModal');
    if (adminForm) {
      adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAdminLogin(adminForm);
      });
    }
  }

  handleStudentLogin(form) {
    const idInput = form.querySelector('[name="studentId"]');
    const passwordInput = form.querySelector('[name="studentPassword"]');

    if (!idInput || !passwordInput) return;

    const id = idInput.value.trim().toUpperCase();
    const password = passwordInput.value;

    // Validate
    if (!id || !password) {
      this.showFormError(form, 'Veuillez remplir tous les champs');
      return;
    }

    // Check credentials
    const student = demoStudents[id];
    if (student && student.password === password) {
      this.loginSuccess('student', id, student.name, student);
      form.reset();
      this.closeModal();
    } else {
      this.showFormError(form, 'Identifiants invalides');
    }
  }

  handleAdminLogin(form) {
    const emailInput = form.querySelector('[name="adminEmail"]');
    const passwordInput = form.querySelector('[name="adminPassword"]');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate
    if (!email || !password) {
      this.showFormError(form, 'Veuillez remplir tous les champs');
      return;
    }

    // Check credentials
    const demoAdmin = { email: 'admin@ita-cayes.edu.ht', password: 'admin1234' };
    if (email === demoAdmin.email && password === demoAdmin.password) {
      this.loginSuccess('admin', email, 'Administrateur');
      form.reset();
      this.closeModal();
    } else {
      this.showFormError(form, 'Identifiants administrateur invalides');
    }
  }

  loginSuccess(type, identifier, name, studentData = null) {
    // Save login state
    localStorage.setItem('loginType', type);
    localStorage.setItem('userId', identifier);
    localStorage.setItem('userName', name);

    if (type === 'student' && studentData) {
      StudentPortal.showPortal(name, studentData);
    } else if (type === 'admin') {
      AdminPanel.showAdmin(name);
    }
  }

  setupLoginButtons() {
    const buttons = document.querySelectorAll('.btn-login');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });
  }

  openModal() {
    if (loginModal) {
      loginModal.classList.add('active');
      body.classList.add('no-scroll');
    }
  }

  closeModal() {
    if (loginModal) {
      loginModal.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  }

  setupModalClose() {
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Close on backdrop click
    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) this.closeModal();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal?.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  showFormError(form, message) {
    const errorDiv = form.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      padding: var(--spacing-lg);
      border-radius: 8px;
      margin-bottom: var(--spacing-lg);
      border-left: 4px solid var(--error);
      font-size: 14px;
    `;

    if (!form.querySelector('.error-message')) {
      form.insertBefore(errorDiv, form.firstChild);
    }
  }
}

// ===== FORM VALIDATION =====
class FormValidator {
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validateRequired(value) {
    return value && value.trim().length > 0;
  }

  static validatePasswordStrength(password) {
    return password && password.length >= 4;
  }

  static showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      background: #fee;
      color: #c33;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #c33;
      font-size: 14px;
    `;
    return errorElement;
  }

  static showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.cssText = `
      background: #efe;
      color: #3c3;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border-left: 4px solid #3c3;
      font-size: 14px;
    `;
    return successElement;
  }
}

// ===== STUDENT PORTAL =====
class StudentPortal {
  static showPortal(name, studentData) {
    const portal = document.getElementById('portal');
    if (!portal) return;

    portal.classList.add('active');

    // Show greeting
    const greeting = document.getElementById('studentGreeting');
    const greetingText = document.getElementById('greetingText');

    if (greeting && greetingText) {
      greetingText.textContent = `Bienvenue ${this.escapeHtml(name)}. Votre portail étudiant est maintenant accessible.`;
      greeting.style.display = 'block';
    }

    // Show logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    // Update dashboard
    this.updateDashboard(studentData);

    // Scroll to portal
    portal.scrollIntoView({ behavior: 'smooth' });
  }

  static login(studentId, password) {
    const id = studentId.trim().toUpperCase();
    const student = demoStudents[id];

    if (!student) {
      return {
        success: false,
        message: 'Matricule ou mot de passe incorrect.'
      };
    }

    if (!FormValidator.validatePasswordStrength(password)) {
      return {
        success: false,
        message: 'Mot de passe invalide (minimum 4 caractères).'
      };
    }

    this.updateDashboard(student);
    return {
      success: true,
      message: `Bienvenue ${student.name}. Votre portail étudiant a été chargé.`
    };
  }

  static updateDashboard(student) {
    // Update stats
    const stats = document.querySelectorAll('.mini-stat strong');
    if (stats.length >= 3) {
      stats[0].textContent = student.gpa;
      stats[1].textContent = student.credits;
      stats[2].textContent = student.presence;
    }

    // Update panels
    const panels = document.querySelectorAll('.panel ul');
    if (panels.length >= 3) {
      panels[0].innerHTML = student.notes
        .map(note => `<li>${this.escapeHtml(note)}</li>`)
        .join('');
      panels[1].innerHTML = student.schedule
        .map(item => `<li>${this.escapeHtml(item)}</li>`)
        .join('');
      panels[2].innerHTML = student.messages
        .map(msg => `<li>${this.escapeHtml(msg)}</li>`)
        .join('');
    }
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static logout() {
    localStorage.removeItem('loginType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    const portal = document.getElementById('portal');
    if (portal) {
      portal.classList.remove('active');
      const greeting = document.getElementById('studentGreeting');
      if (greeting) greeting.style.display = 'none';
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ===== ADMIN PANEL =====
class AdminPanel {
  static showAdmin(name) {
    const admin = document.getElementById('admin');
    if (!admin) return;

    admin.classList.add('active');

    // Show logout button
    const logoutBtn = document.getElementById('logoutAdminBtn');
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    // Scroll to admin
    admin.scrollIntoView({ behavior: 'smooth' });
  }

  static logout() {
    localStorage.removeItem('loginType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    const admin = document.getElementById('admin');
    if (admin) {
      admin.classList.remove('active');
      const logoutBtn = document.getElementById('logoutAdminBtn');
      if (logoutBtn) logoutBtn.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ===== STAT COUNTER =====
class StatCounter {
  static init() {
    this.animateStats();
  }

  static animateStats() {
    const stats = document.querySelectorAll('.stat-number, .stat strong, .mini-stat strong, .admin-box strong');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          this.countUp(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  }

  static countUp(element) {
    const text = element.textContent.trim();
    const match = text.match(/\d+/);

    if (!match) return;

    element.dataset.counted = 'true';
    const target = parseInt(match[0]);
    const duration = 2000;
    const start = Date.now();
    const suffix = text.replace(/\d+/, '').trim();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * progress);

      element.textContent = current + (suffix ? ' ' + suffix : '');

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target + (suffix ? ' ' + suffix : '');
      }
    };

    animate();
  }
}
class SearchManager {
  static search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return false;

    const sections = document.querySelectorAll('section');
    let found = false;

    sections.forEach(sec => {
      const text = sec.textContent.toLowerCase();
      if (text.includes(q)) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.highlightSection(sec);
        found = true;
      }
    });

    return found;
  }

  static highlightSection(element) {
    element.style.outline = '3px solid #1d4ed8';
    element.style.outlineOffset = '6px';
    element.style.transition = 'outline 0.3s ease';

    setTimeout(() => {
      element.style.outline = 'none';
      element.style.outlineOffset = '0';
    }, 1500);
  }
}

// ===== INITIALIZATION =====
class App {
  constructor() {
    this.themeManager = new ThemeManager();
    this.mobileMenu = new MobileMenu();
    this.loginModal = new LoginModalManager();
    this.initEventListeners();
    this.checkLoginState();
  }

  initEventListeners() {
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.themeManager.toggle();
      });
    }

    // Mobile menu toggle
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        this.mobileMenu.toggle();
      });
    }

    // Close mobile menu when clicking on nav link
    const navLinks = document.querySelectorAll('.nav-links-mobile a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileMenu.close();
      });
    });

    // Login modal
    this.loginModal.init();

    // Student logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      StudentPortal.logout();
    });

    // Admin logout
    document.getElementById('logoutAdminBtn')?.addEventListener('click', () => {
      AdminPanel.logout();
    });

    // Contact form
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        this.handleContactForm(e);
      });
    }

    // Search form
    if (searchForm) {
      const searchInput = searchForm.querySelector('input');
      const searchBtn = searchForm.querySelector('button');

      if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleSearch(searchInput?.value);
        });
      }

      if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSearch(searchInput.value);
          }
        });
      }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) searchInput.focus();
      }
    });

    // Stat counter
    StatCounter.init();
  }

  checkLoginState() {
    const loginType = localStorage.getItem('loginType');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (loginType === 'student' && userId && userName) {
      const student = demoStudents[userId];
      if (student) {
        StudentPortal.showPortal(userName, student);
      }
    } else if (loginType === 'admin' && userName) {
      AdminPanel.showAdmin(userName);
    }
  }

  handleContactForm(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    if (!nameInput || !emailInput || !subjectInput || !messageInput) return;

    const name = nameInput.value;
    const email = emailInput.value;
    const subject = subjectInput.value;
    const message = messageInput.value;

    // Validation
    if (!FormValidator.validateRequired(name)) {
      alert('Veuillez entrer votre nom.');
      return;
    }

    if (!FormValidator.validateEmail(email)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!FormValidator.validateRequired(subject)) {
      alert('Veuillez entrer un sujet.');
      return;
    }

    if (!FormValidator.validateRequired(message)) {
      alert('Veuillez entrer un message.');
      return;
    }

    // Success message
    const successDiv = FormValidator.showSuccess(
      'Merci pour votre message. Nous vous répondrons bientôt.'
    );
    contactForm.insertBefore(successDiv, contactForm.firstChild);

    // Clear form
    contactForm.reset();

    setTimeout(() => successDiv.remove(), 4000);
  }

  handleSearch(query) {
    const found = SearchManager.search(query);

    if (!found && query?.trim()) {
      alert('Aucun résultat trouvé. Essayez un autre mot-clé.');
    }

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.value = '';
  }
}

// ===== APP START =====
document.addEventListener('DOMContentLoaded', () => {
  new App();
  console.log('ITAC University Website - Initialized Successfully');
});

// Smooth scroll polyfill support
if (!CSS.supports('scroll-behavior: smooth')) {
  document.documentElement.style.scrollBehavior = 'auto';
}