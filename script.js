// Resume Download Configuration
const RESUME_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1KSrrKW6pnqJEkzAlzJLiUm3X0t_mq1ry';
// Google Apps Script Deployment URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/-AKfycbwovlI3f_6DtiRRfG4iwLQ7GLN9rOJLVykiLumPeiPAo7yycBfbyiaCgezy9_yMSbAx/userweb?v=1';

// Open Resume Modal
function openResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.style.display = 'block';
    document.getElementById('emailInput').focus();
}

// Close Resume Modal
function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.style.display = 'none';
    document.getElementById('resumeForm').reset();
}

// Download Resume
function downloadResume(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    
    // Validate email
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Save email to Google Sheet
    saveEmailToSheet(email);
    
    // Trigger download
    window.location.href = RESUME_DOWNLOAD_URL;
    
    // Close modal after a short delay
    setTimeout(() => {
        closeResumeModal();
    }, 500);
}

// Save email to Google Sheet via Google Apps Script
function saveEmailToSheet(email) {
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams({
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email saved:', data);
    })
    .catch(error => {
        console.error('Error saving email:', error);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('resumeModal');
    if (event.target === modal) {
        closeResumeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeResumeModal();
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards and project cards
document.querySelectorAll('.skill-category, .project-card, .experience-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Highlight active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = 'var(--text-dark)';
        }
    });
});

// Add a little animation to buttons on hover
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Scroll to top button (optional enhancement)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    font-size: 20px;
    font-weight: bold;
    z-index: 99;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.background = 'var(--secondary-color)';
    this.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.background = 'var(--primary-color)';
    this.style.transform = 'scale(1)';
});
