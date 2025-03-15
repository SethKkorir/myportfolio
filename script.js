// Navigation menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Save Theme Preference
const saveThemePreference = (theme) => {
    fetch('http://localhost:5000/api/theme', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Theme preference saved:', data.theme);
        })
        .catch((error) => {
            console.error('Error saving theme preference:', error);
        });
};

// Retrieve Theme Preference
const getThemePreference = () => {
    fetch('http://localhost:5000/api/theme')
        .then((response) => response.json())
        .then((data) => {
            const theme = data.theme;
            body.setAttribute('data-theme', theme);
            updateToggleIcon(theme);
        })
        .catch((error) => {
            console.error('Error retrieving theme preference:', error);
        });
};

// Update the toggle icon based on the theme
function updateToggleIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toggle Theme on Button Click
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    saveThemePreference(newTheme);
    updateToggleIcon(newTheme);
});

// Initialize Theme on Page Load
getThemePreference();

// Skills animation on scroll
const skillBars = document.querySelectorAll('.progress');
const animateSkills = () => {
    skillBars.forEach(bar => {
        const value = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = value;
        }, 100);
    });
};

// Reinitialize skill animations when scrolling to skills section
const skillsSection = document.querySelector('#skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
        }
    });
}, { threshold: 0.5 });

observer.observe(skillsSection);

// Contact form handling
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form inputs
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const messageInput = contactForm.querySelector('textarea');

    // Validate name
    if (nameInput.value.trim() === '') {
        alert('Please enter your name.');
        nameInput.focus();
        return;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
    }

    // Validate message
    if (messageInput.value.trim() === '') {
        alert('Please enter your message.');
        messageInput.focus();
        return;
    }

    // Prepare form data
    const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
    };

    // Send data to the backend
    fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            alert(result.message || 'Message sent successfully!');
            contactForm.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        });
});

// Initialize animations when the page loads
window.addEventListener('load', () => {
    animateSkills();
});