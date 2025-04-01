document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const DOM = {
        navToggle: document.querySelector('.nav-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        navbar: document.querySelector('.navbar'),
        themeToggle: document.getElementById('theme-toggle'),
        contactForm: document.getElementById('contact-form'),
        skillsSection: document.querySelector('#skills'),
        skillBars: document.querySelectorAll('.circular-progress circle:last-child'),
        downloadCvBtn: document.getElementById('download-cv'),
        year: document.getElementById('year')
    };

    // State Management
    const state = {
        currentTheme: localStorage.getItem('theme') || 'light',
        menuOpen: false
    };

    // Initialize
    function init() {
        initTheme();
        updateNavbarOnScroll();
        setupEventListeners();
        animateSkillsOnScroll();
        setCurrentYear();
    }

    // Set current year in footer
    function setCurrentYear() {
        DOM.year.textContent = new Date().getFullYear();
    }

    // Initialize Theme
    function initTheme() {
        document.body.setAttribute('data-theme', state.currentTheme);
        updateToggleIcon();
    }

    // Update Theme Toggle Icon
    function updateToggleIcon() {
        const icon = DOM.themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon', state.currentTheme === 'light');
        icon.classList.toggle('fa-sun', state.currentTheme === 'dark');
    }

    // Toggle Theme
    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', state.currentTheme);
        localStorage.setItem('theme', state.currentTheme);
        updateToggleIcon();
        updateNavbarOnScroll(); // Update navbar colors after theme change
    }

    // Toggle Navigation Menu
    function toggleNavMenu() {
        state.menuOpen = !state.menuOpen;
        DOM.navMenu.classList.toggle('active');
        DOM.navToggle.classList.toggle('active');
        
        // Update aria-expanded attribute for accessibility
        DOM.navToggle.setAttribute('aria-expanded', state.menuOpen);
    }

    // Close Navigation Menu
    function closeNavMenu() {
        state.menuOpen = false;
        DOM.navMenu.classList.remove('active');
        DOM.navToggle.classList.remove('active');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
    }

    // Smooth Scroll for Anchor Links
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Update Navbar on Scroll
    function updateNavbarOnScroll() {
        const scrolled = window.scrollY > 50;
        DOM.navbar.classList.toggle('scrolled', scrolled);
    }

    // Animate Skills on Scroll
    function animateSkills() {
        DOM.skillBars.forEach(bar => {
            const value = bar.style.strokeDashoffset;
            bar.style.strokeDashoffset = '440';
            setTimeout(() => {
                bar.style.strokeDashoffset = value;
            }, 100);
        });
    }

    // Setup Intersection Observer for Skills Animation
    function animateSkillsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (DOM.skillsSection) {
            observer.observe(DOM.skillsSection);
        }
    }

    // Handle Contact Form Submission
    async function handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                alert(result.message || 'Message sent successfully! Thank you for contacting me.');
                form.reset();
            } else {
                // Show error message
                alert(result.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    // Handle CV Download
    function handleCvDownload(e) {
        e.preventDefault();
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = '/public/CV.docx';
        link.download = 'CV.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Track download event
        console.log('CV downloaded');
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Navigation
        DOM.navToggle.addEventListener('click', toggleNavMenu);
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNavMenu);
            link.addEventListener('click', smoothScroll);
        });
        
        // Theme toggle
        DOM.themeToggle.addEventListener('click', toggleTheme);
        
        // Contact form
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', handleContactForm);
        }
        
        // CV download
        if (DOM.downloadCvBtn) {
            DOM.downloadCvBtn.addEventListener('click', handleCvDownload);
        }
        
        // Window scroll
        window.addEventListener('scroll', updateNavbarOnScroll);
    }

    // Initialize the app
    init();
});