tailwind.config = {
    theme: {
        extend: {
            colors: {
                cr7gold: '#d4af37',
                cr7dark: '#111111',
                cr7black: '#050505',
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
            backgroundImage: {
                'page-glow': 'radial-gradient(1200px circle at 18% 12%, rgba(212, 175, 55, 0.09), transparent 62%), radial-gradient(1400px circle at 82% 18%, rgba(212, 175, 55, 0.05), transparent 68%), radial-gradient(1100px circle at 50% 88%, rgba(212, 175, 55, 0.07), transparent 62%), linear-gradient(180deg, #050505 0%, #070707 45%, #050505 100%)',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0px)' },
                },
                reveal: {
                    '0%': { opacity: '0', transform: 'scale(0.96)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                fadeUp: 'fadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
                reveal: 'reveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
            },
        },
    },
};

(() => {
    'use strict';

    // ==================== MOBILE NAVIGATION ====================
    const setupMobileNavigation = () => {
        const navToggle = document.getElementById('navToggle');
        const mobileMenu = document.getElementById('mobileNav');

        if (!navToggle || !mobileMenu) return;

        const panel = mobileMenu.querySelector('[data-mobile="panel"]');
        const backdrop = mobileMenu.querySelector('[data-mobile="backdrop"]');
        const closeBtn = mobileMenu.querySelector('[data-mobile="close"]');
        const menuLinks = mobileMenu.querySelectorAll('[data-mobile="link"]');

        const iconTop = navToggle.querySelector('[data-bar="top"]');
        const iconMid = navToggle.querySelector('[data-bar="mid"]');
        const iconBot = navToggle.querySelector('[data-bar="bot"]');

        const openMenu = () => {
            mobileMenu.classList.remove('hidden');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('overflow-hidden');

            requestAnimationFrame(() => {
                backdrop?.classList.replace('opacity-0', 'opacity-100');
                panel?.classList.remove('opacity-0', 'translate-y-[-10px]', 'scale-[0.98]');
                panel?.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            });

            iconTop?.classList.add('translate-y-[6px]', 'rotate-45');
            iconTop?.classList.remove('-translate-y-[6px]');
            iconMid?.classList.add('opacity-0');
            iconBot?.classList.add('-translate-y-[6px]', '-rotate-45');
            iconBot?.classList.remove('translate-y-[6px]');
        };

        const closeMenu = () => {
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('overflow-hidden');

            backdrop?.classList.replace('opacity-100', 'opacity-0');
            panel?.classList.add('opacity-0', 'translate-y-[-10px]', 'scale-[0.98]');
            panel?.classList.remove('opacity-100', 'translate-y-0', 'scale-100');

            iconTop?.classList.remove('translate-y-[6px]', 'rotate-45');
            iconTop?.classList.add('-translate-y-[6px]');
            iconMid?.classList.remove('opacity-0');
            iconBot?.classList.remove('-translate-y-[6px]', '-rotate-45');
            iconBot?.classList.add('translate-y-[6px]');

            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
        };

        navToggle.addEventListener('click', () => {
            mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
        });

        menuLinks.forEach((link) => link.addEventListener('click', closeMenu));
        backdrop?.addEventListener('click', closeMenu);
        closeBtn?.addEventListener('click', closeMenu);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) closeMenu();
        });
    };

    // ==================== SCROLL REVEAL ANIMATION ====================
    const setupScrollReveal = () => {
        const elements = document.querySelectorAll('[data-animate]');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!elements.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('opacity-100'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                el.style.animationDelay = `${el.getAttribute('data-delay') || 0}ms`;
                el.classList.add('animate-fadeUp');
                observer.unobserve(el);
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach((el) => observer.observe(el));
    };

    // ==================== POPUPS & LIGHTBOX ====================
    const setupPopups = () => {
        // Milkyway Popup
        const milkywayPopup = document.getElementById('milkyway-popup');
        const milkywayClose = document.getElementById('milkyway-popup-close');

        // Client Gallery Popups
        const clientPopups = {
            jawara: document.getElementById('jawara-popup'),
            oho: document.getElementById('oho-popup'),
            katsugo: document.getElementById('katsugo-popup')
        };

        // Lightbox
        const lightbox = document.getElementById('image-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeLightboxBtn = document.getElementById('close-lightbox');

        // ── Lightbox open/close ──────────────────────────────────
        const openLightbox = (imgSrc, caption = "") => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = imgSrc;
            if (lightboxCaption) lightboxCaption.textContent = caption;

            lightbox.classList.remove('hidden');
            requestAnimationFrame(() => {
                lightbox.classList.add('opacity-100');
                lightbox.classList.remove('opacity-0', 'pointer-events-none');
            });
        };

        const closeLightbox = () => {
            if (!lightbox) return;
            lightbox.classList.remove('opacity-100');
            lightbox.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => lightbox.classList.add('hidden'), 300);
        };

        // ── Helper: bind lightbox to all imgs inside a container ──
        const bindGalleryImages = (container) => {
            if (!container) return;
            container.querySelectorAll('img').forEach(img => {
                // avoid duplicate listeners
                if (img.dataset.lightboxBound) return;
                img.dataset.lightboxBound = 'true';
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    openLightbox(img.src, img.alt || '');
                });
            });
        };

        // ── Milkyway Popup ────────────────────────────────────────
        // Tetap sama / tidak diubah (referensi)
        window.showMilkywayPopup = () => {
            if (!milkywayPopup) return;

            // Instantly show (no hidden -> flex reflow delay)
            milkywayPopup.classList.remove('hidden');
            milkywayPopup.classList.remove('opacity-0', 'pointer-events-none');
            milkywayPopup.classList.add('opacity-100');
            document.body.style.overflow = 'hidden';

            // Bind lightbox to milkyway gallery images
            // Debounce to avoid double-binding
            if (!milkywayPopup.__imagesBound) {
                bindGalleryImages(document.getElementById('gallery-grid'));
                milkywayPopup.__imagesBound = true;
            }
        };

        const closeMilkywayPopup = () => {
            if (!milkywayPopup) return;

            milkywayPopup.classList.remove('opacity-100');
            milkywayPopup.classList.add('opacity-0', 'pointer-events-none');
            // Hide "faster" on close for snappier UI, no wait for 310ms
            setTimeout(() => {
                milkywayPopup.classList.add('hidden');
                document.body.style.overflow = '';
            }, 150); // Reduced delay for more lightweight effect
        };

        // ── Client Gallery Popups ( OHO / KatsuGO) ───────
        // Disamakan dengan logic milkyway: efek show/hide cepat, dan bind lightbox hanya sekali per popup
        window.showClientGalleryPopup = (client) => {
            const popup = clientPopups[client];
            if (!popup) return;

            // Instantly show (no hidden -> flex reflow delay)
            popup.classList.remove('hidden');
            popup.classList.remove('opacity-0', 'pointer-events-none');
            popup.classList.add('opacity-100');
            document.body.style.overflow = 'hidden';

            // Bind lightbox to this popup's images just once per popup
            // Sama seperti milkyway: bind hanya sekali per modal
            if (!popup.__imagesBound) {
                // Cari grid galeri utama dalam popup (versi aman)
                // Kalau ada "gallery-grid" child di masing-masing popup, bisa ganti dengan: 
                //   bindGalleryImages(popup.querySelector('.gallery-grid'))
                // Tapi dari HTML, tidak ada .gallery-grid untuk OHO/KatsuGO, jadi bind langsung ke seluruh popup
                bindGalleryImages(popup);
                popup.__imagesBound = true;
            }
        };

        window.closeClientGalleryPopup = (client) => {
            const popup = clientPopups[client];
            if (!popup) return;

            popup.classList.remove('opacity-100');
            popup.classList.add('opacity-0', 'pointer-events-none');
            // Samakan delayed hide (150ms) seperti milkywayPopup
            setTimeout(() => {
                popup.classList.add('hidden');
                document.body.style.overflow = '';
            }, 150);
        };

        // ── Event Listeners ───────────────────────────────────────
        milkywayClose?.addEventListener('click', closeMilkywayPopup);
        closeLightboxBtn?.addEventListener('click', closeLightbox);

        milkywayPopup?.addEventListener('mousedown', (e) => {
            if (e.target === milkywayPopup) closeMilkywayPopup();
        });

        // Samakan: tutup popup client gallery jika backdrop diklik (di luar modal content)
        Object.keys(clientPopups).forEach(clientKey => {
            const popup = clientPopups[clientKey];
            if (popup) {
                popup.addEventListener('mousedown', (e) => {
                    if (e.target === popup) window.closeClientGalleryPopup(clientKey);
                });
            }
        });

        lightbox?.addEventListener('mousedown', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (lightbox && !lightbox.classList.contains('hidden')) {
                    closeLightbox();
                } else if (milkywayPopup && !milkywayPopup.classList.contains('hidden')) {
                    closeMilkywayPopup();
                } else {
                    Object.keys(clientPopups).forEach(key => {
                        const popup = clientPopups[key];
                        if (popup && !popup.classList.contains('hidden')) {
                            window.closeClientGalleryPopup(key);
                        }
                    });
                }
            }
        });
    };

    // ==================== INITIALIZE ALL ====================
    const init = () => {
        setupMobileNavigation();
        setupScrollReveal();
        setupPopups();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();