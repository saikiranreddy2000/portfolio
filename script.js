/**
 * Portfolio Website - JavaScript Module
 * Handles interactive features including resume downloads, navigation, animations, and UX enhancements
 * 
 * Features:
 * - Resume download with email tracking
 * - Mobile navigation menu toggle
 * - Scroll animations with Intersection Observer
 * - Smooth scroll navigation
 * - Dynamic navbar shadow on scroll
 * - Scroll-to-top button functionality
 * 
 * @author Saikiran Reddy
 * @version 1.0.0
 */

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

/**
 * Google Drive URL for resume download
 * Points to a shared Drive file with automatic download
 * @type {string}
 */
const RESUME_DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1KSrrKW6pnqJEkzAlzJLiUm3X0t_mq1ry';

/**
 * Google Apps Script deployment URL for email tracking
 * Stores visitor emails in Google Sheets for lead tracking
 * @type {string}
 */
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/-AKfycbwovlI3f_6DtiRRfG4iwLQ7GLN9rOJLVykiLumPeiPAo7yycBfbyiaCgezy9_yMSbAx/userweb?v=1';

// ==========================================
// RESUME DOWNLOAD FUNCTIONALITY
// ==========================================

/**
 * Opens the resume download modal dialog
 * Sets focus to email input for better UX
 * @function
 * @returns {void}
 */
function openResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.style.display = 'block';
    document.getElementById('emailInput').focus();
}

/**
 * Closes the resume download modal and resets the form
 * @function
 * @returns {void}
 */
function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    modal.style.display = 'none';
    document.getElementById('resumeForm').reset();
}

/**
 * Handles resume download with email validation and tracking
 * Steps: Validate → Save email to Google Sheet → Trigger download → Close modal
 * @function
 * @param {Event} event - Form submission event
 * @returns {void}
 */
function downloadResume(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    
    // Validate email format
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Save email to Google Sheet for tracking
    saveEmailToSheet(email);
    
    // Trigger resume download from Google Drive
    window.location.href = RESUME_DOWNLOAD_URL;
    
    // Close modal after brief delay to allow download initialization
    setTimeout(() => {
        closeResumeModal();
    }, 500);
}

/**
 * Saves visitor email to Google Sheet for lead tracking
 * Uses Google Apps Script for server-side storage (no backend needed)
 * @function
 * @param {string} email - Visitor's email address
 * @returns {Promise<void>} - Resolves when email is saved
 */
function saveEmailToSheet(email) {
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: new URLSearchParams({
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email saved successfully:', data);
    })
    .catch(error => {
        console.error('Error saving email to tracking sheet:', error);
        // Don't prevent download even if tracking fails
    });
}

/**
 * Validates email format using regex pattern
 * Matches standard email format: local@domain.extension
 * @function
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
}

// ==========================================
// MODAL EVENT LISTENERS
// ==========================================

/**
 * Close modal when clicking outside of it (backdrop click)
 * Implements standard modal UX pattern
 */
window.addEventListener('click', (event) => {
    const modal = document.getElementById('resumeModal');
    if (event.target === modal) {
        closeResumeModal();
    }
});

/**
 * Close modal when pressing Escape key
 * Standard keyboard accessibility pattern
 */
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeResumeModal();
    }
});

// ==========================================
// MOBILE NAVIGATION FUNCTIONALITY
// ==========================================

/**
 * Toggles mobile navigation menu visibility
 * Used for responsive navigation on screens < 768px
 * @function
 * @returns {void}
 */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

/**
 * Close navigation menu when a link is clicked
 * Improves mobile UX by auto-closing menu after navigation
 */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ==========================================
// SMOOTH SCROLL & NAVIGATION
// ==========================================

/**
 * Smooth scroll navigation for anchor links
 * Provides enhanced scroll-to behavior with smooth animation
 */
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

// ==========================================
// SCROLL EFFECTS & ANIMATIONS
// ==========================================

/**
 * Dynamic navbar shadow effect on scroll
 * Enhances visual depth as user scrolls down
 */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

/**
 * Intersection Observer Configuration
 * Detects when elements enter viewport for triggering animations
 * @type {Object}
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

/**
 * Intersection Observer callback
 * Triggers fade-in animations for elements entering viewport
 * @param {IntersectionObserverEntry[]} entries - Observable entries
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

/**
 * Observe skill cards, project cards, and experience items
 * Animates them in as user scrolls to section
 */
document.querySelectorAll('.skill-category, .project-card, .experience-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

/**
 * Highlight active navigation link based on scroll position
 * Updates active link as user scrolls through sections
 * Improves navigation context awareness
 */
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

// ==========================================
// BUTTON HOVER EFFECTS
// ==========================================

/**
 * Add elevation animation to buttons on hover
 * Provides visual feedback for interactive elements
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

/**
 * Lazy load images using Intersection Observer
 * Defers image loading until they're needed
 * Improves initial page load performance
 */
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

// ==========================================
// SCROLL-TO-TOP BUTTON
// ==========================================

/**
 * Create and configure scroll-to-top button
 * Dynamically added to DOM for accessibility
 * @type {HTMLButtonElement}
 */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
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

/**
 * Show/hide scroll-to-top button based on scroll position
 * Appears after scrolling 300px down
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.alignItems = 'center';
        scrollTopBtn.style.justifyContent = 'center';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

/**
 * Smooth scroll to top when button clicked
 * Provides smooth return to top of page
 */
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/**
 * Enhance scroll-to-top button on hover
 * Changes color and scales up for visual feedback
 */
scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.background = 'var(--secondary-color)';
    this.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.background = 'var(--primary-color)';
    this.style.transform = 'scale(1)';
});
