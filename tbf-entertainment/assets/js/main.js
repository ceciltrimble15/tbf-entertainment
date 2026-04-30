/**
 * TBF Entertainment — Main JS v1.1.1
 */
(function () {
    'use strict';

    /* ── NAV SCROLL STATE ── */
    var nav = document.getElementById('tbf-nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    /* ── MOBILE MENU ── */
    var burger = document.getElementById('tbf-burger');
    var mobileMenu = document.getElementById('tbf-mobile-menu');
    if (burger && mobileMenu) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        var mobileLinks = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < mobileLinks.length; i++) {
            mobileLinks[i].addEventListener('click', function () {
                burger.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        }
    }

    /* ── SCROLL REVEAL ── */
    var reveals = document.querySelectorAll('.tbf-reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ── CONTACT FORM HANDLER ── */
    var contactForm = document.getElementById('tbf-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Received — We\'ll Be in Touch';
                btn.disabled = true;
                btn.style.background = '#145DCC';
                btn.style.color = '#F4F4F1';
                btn.style.borderColor = '#145DCC';
            }
        });
    }
})();
