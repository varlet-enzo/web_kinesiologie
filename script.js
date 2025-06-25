// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu mobile quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling pour les ancres
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

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.kinesiology-card, .benefit-item, .qualification-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Validation des champs de date
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            
            if (selectedDate < today) {
                this.value = '';
            }
        });
    }

    // Amélioration de l'expérience utilisateur
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Ajout d'une classe quand le champ est rempli
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        
        // Validation en temps réel pour l'email
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (this.value && !emailRegex.test(this.value)) {
                    this.style.borderColor = '#f44336';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    });

    // Effet de parallaxe léger pour les sections hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSections = document.querySelectorAll('.hero, .presentation-hero, .contact-hero');
        
        heroSections.forEach(section => {
            const rate = scrolled * -0.5;
            section.style.transform = `translateY(${rate}px)`;
        });
    });

    // Lazy loading pour les images (si ajoutées plus tard)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Amélioration de l'accessibilité
    document.addEventListener('keydown', function(e) {
        // Fermer le menu mobile avec la touche Escape
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Focus management pour le menu mobile
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Fonction pour formater les prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Fonction pour valider un numéro de téléphone français
function validatePhoneNumber(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
}

// Fonction pour formater une date
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function showPopupConfirmation(message) {
    var popup = document.getElementById('popup-confirmation');
    popup.textContent = message;
    popup.style.display = 'block';
    popup.style.background = '#4CAF50';
    popup.style.color = 'white';
    popup.style.padding = '1rem 2rem';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    popup.style.fontWeight = '600';
    popup.style.fontSize = '1.1rem';
    popup.style.transition = 'opacity 0.3s';
    popup.style.opacity = '1';
    setTimeout(function() {
        popup.style.opacity = '0';
        setTimeout(function() {
            popup.style.display = 'none';
            popup.textContent = '';
        }, 400);
    }, 3500);
}

const SUPABASE_URL = 'https://uiasddcfatwdcccdnxap.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpYXNkZGNmYXR3ZGNjY2RueGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MTgwNzcsImV4cCI6MjA2NjM5NDA3N30.uL9EVcahC_kkj9nkJrR2sIyXNPNVe1cb0i_8TOldSWQ';

async function sendAppointment(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
    });
    return res.ok;
}

function showConfirmation(e) {
    setTimeout(function() {
        document.getElementById('appointmentForm').style.display = 'none';
        showPopupConfirmation('Merci, votre demande a bien été envoyée !');
    }, 100); // Laisse le temps à Formspree d'envoyer
} 