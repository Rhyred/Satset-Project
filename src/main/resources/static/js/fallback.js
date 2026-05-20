/**
 * CDN Fallback Handler
 * Detects if external CDN resources fail to load and applies fallback styles
 */

(function() {
    const checkCDNResources = () => {
        // Check if Tailwind CDN loaded
        if (!window.tailwind) {
            console.warn('Tailwind CSS CDN failed to load. Using local fallback styles.');
            loadFallbackStyles();
        }

        // Check if Alpine.js loaded
        if (typeof Alpine === 'undefined') {
            console.warn('Alpine.js CDN failed to load. Attempting to load local version.');
            // Alpine.js specific handling can be added here
        }

        // Check if Google Fonts loaded
        checkFontLoading();
    };

    const loadFallbackStyles = () => {
        // Ensure utilities.css is loaded as fallback
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/utilities.css?v=' + Date.now();
        document.head.appendChild(link);

        // Apply additional fallback styles
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            /* Ensure containers are visible */
            .container {
                max-width: 100%;
                margin: 0 auto;
            }

            /* Ensure buttons are clickable */
            button, [role="button"] {
                cursor: pointer;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 0.375rem;
                background-color: #1e40af;
                color: white;
                font-weight: 600;
                transition: all 0.2s;
            }

            button:hover, [role="button"]:hover {
                background-color: #1e3a8a;
                transform: translateY(-2px);
            }

            /* Ensure forms work */
            input, textarea, select {
                font-family: inherit;
                padding: 0.5rem;
                border: 1px solid #cbd5e1;
                border-radius: 0.375rem;
            }
        `;
        document.head.appendChild(style);

        // Show warning to user if critical resources fail
        showCDNWarning();
    };

    const checkFontLoading = () => {
        // Use FontFaceObserver pattern or simpler check
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                console.log('Fonts loaded successfully');
            }).catch(() => {
                console.warn('Fonts failed to load, using system fonts');
                document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            });
        }
    };

    const showCDNWarning = () => {
        // Only show warning if actually needed (optional)
        const isProduction = window.location.hostname !== 'localhost' &&
                           window.location.hostname !== '127.0.0.1';

        if (!isProduction) {
            console.warn('CDN resources not fully loaded. Running in offline/fallback mode.');
        }
    };

    // Run checks when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkCDNResources);
    } else {
        checkCDNResources();
    }

    // Also check after a delay to catch late-loading resources
    setTimeout(checkCDNResources, 2000);

    // Monitor for Alpine.js initialization
    window.addEventListener('alpine:init', () => {
        console.log('Alpine.js initialized successfully');
    });

    // Provide global fallback utilities
    window.SatSetUtils = {
        // Show notification
        notify: (message, type = 'info') => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 9999;
                animation: slideInUp 0.3s ease-out;
                background-color: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#f0fdf4' : '#dbeafe'};
                color: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#2563eb'};
                border: 1px solid ${type === 'error' ? '#fecaca' : type === 'success' ? '#bbf7d0' : '#bfdbfe'};
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        },

        // Show loading
        showLoading: (element) => {
            if (element) {
                element.classList.add('loading');
                element.style.opacity = '0.6';
                element.style.pointerEvents = 'none';
            }
        },

        // Hide loading
        hideLoading: (element) => {
            if (element) {
                element.classList.remove('loading');
                element.style.opacity = '1';
                element.style.pointerEvents = 'auto';
            }
        }
    };

})();
