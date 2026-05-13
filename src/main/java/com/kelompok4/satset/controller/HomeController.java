package com.kelompok4.satset.controller;

import com.kelompok4.satset.service.ContactMessageService;
import com.kelompok4.satset.service.FeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class HomeController {
    
    private final FeatureService featureService;
    private final ContactMessageService contactMessageService;

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return """
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SATSET - Kelompok 4</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        min-height: 100vh;
                        color: #333;
                    }

                    header {
                        background: #fff;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }

                    nav {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 70px;
                    }

                    .logo {
                        font-size: 24px;
                        font-weight: 700;
                        color: #1e40af;
                        text-decoration: none;
                    }

                    .nav-links {
                        display: flex;
                        gap: 30px;
                        list-style: none;
                    }

                    .nav-links a {
                        text-decoration: none;
                        color: #555;
                        font-weight: 500;
                        transition: color 0.3s ease;
                    }

                    .nav-links a:hover {
                        color: #1e40af;
                    }

                    .nav-links a.active {
                        color: #1e40af;
                        border-bottom: 2px solid #1e40af;
                        padding-bottom: 5px;
                    }

                    main {
                        max-width: 1200px;
                        margin: 60px auto;
                        padding: 0 20px;
                    }

                    .hero {
                        background: #fff;
                        border-radius: 12px;
                        padding: 80px 40px;
                        text-align: center;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        margin-bottom: 60px;
                    }

                    .hero h1 {
                        font-size: 48px;
                        color: #1e40af;
                        margin-bottom: 20px;
                        font-weight: 700;
                    }

                    .hero p {
                        font-size: 18px;
                        color: #666;
                        margin-bottom: 30px;
                        line-height: 1.6;
                    }

                    .hero .subtitle {
                        font-size: 14px;
                        color: #999;
                        font-weight: 400;
                    }

                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 60px;
                    }

                    .stat-card {
                        background: #fff;
                        border-radius: 12px;
                        padding: 30px;
                        text-align: center;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
                    }

                    .stat-icon {
                        font-size: 40px;
                        margin-bottom: 15px;
                    }

                    .stat-value {
                        font-size: 28px;
                        font-weight: 700;
                        color: #1e40af;
                        margin-bottom: 8px;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #999;
                        font-weight: 500;
                    }

                    .features {
                        background: #fff;
                        border-radius: 12px;
                        padding: 40px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        margin-bottom: 60px;
                    }

                    .features h2 {
                        font-size: 32px;
                        color: #1e40af;
                        margin-bottom: 30px;
                        text-align: center;
                    }

                    .features-list {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 30px;
                    }

                    .feature-item {
                        padding-left: 40px;
                        position: relative;
                    }

                    .feature-item::before {
                        content: "✓";
                        position: absolute;
                        left: 0;
                        font-size: 24px;
                        color: #10b981;
                        font-weight: 700;
                    }

                    .feature-item h3 {
                        font-size: 18px;
                        color: #333;
                        margin-bottom: 8px;
                    }

                    .feature-item p {
                        font-size: 14px;
                        color: #666;
                        line-height: 1.6;
                    }

                    .status-banner {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 20px 30px;
                        border-radius: 12px;
                        margin-bottom: 60px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }

                    .status-indicator {
                        width: 12px;
                        height: 12px;
                        background: white;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    footer {
                        background: #fff;
                        border-top: 1px solid #e5e7eb;
                        padding: 40px 20px;
                        text-align: center;
                        margin-top: 80px;
                    }

                    footer p {
                        color: #666;
                        font-size: 14px;
                    }

                    @media (max-width: 768px) {
                        .hero {
                            padding: 40px 20px;
                        }

                        .hero h1 {
                            font-size: 32px;
                        }

                        .nav-links {
                            gap: 15px;
                            font-size: 14px;
                        }

                        .stats-grid {
                            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        }

                        .features {
                            padding: 20px;
                        }
                    }

                    .contact-form {
                        background: #fff;
                        border-radius: 12px;
                        padding: 40px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        margin-bottom: 60px;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .contact-form h2 {
                        font-size: 32px;
                        color: #1e40af;
                        margin-bottom: 30px;
                        text-align: center;
                    }

                    .form-group {
                        margin-bottom: 20px;
                    }

                    .form-group label {
                        display: block;
                        font-weight: 500;
                        color: #333;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }

                    .form-group input,
                    .form-group textarea {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-family: inherit;
                        font-size: 14px;
                        transition: border-color 0.3s ease;
                    }

                    .form-group input:focus,
                    .form-group textarea:focus {
                        outline: none;
                        border-color: #1e40af;
                        box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
                    }

                    .form-group textarea {
                        resize: vertical;
                        min-height: 150px;
                    }

                    .btn {
                        background: #1e40af;
                        color: white;
                        padding: 12px 30px;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        width: 100%;
                    }

                    .btn:hover {
                        background: #1e3a8a;
                    }

                    .btn:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                    }

                    .alert {
                        padding: 15px;
                        border-radius: 6px;
                        margin-bottom: 20px;
                        display: none;
                    }

                    .alert.success {
                        background: #d1fae5;
                        color: #065f46;
                        border: 1px solid #6ee7b7;
                        display: block;
                    }

                    .alert.error {
                        background: #fee2e2;
                        color: #991b1b;
                        border: 1px solid #fca5a5;
                        display: block;
                    }

                    .loading {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        border: 2px solid #f3f4f6;
                        border-top: 2px solid #1e40af;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                </style>
            </head>
            <body>
                <header>
                    <nav>
                        <a href="/" class="logo">SATSET</a>
                        <ul class="nav-links">
                            <li><a href="/" class="active">Home</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </header>

                <main>
                    <div class="hero">
                        <h1>Welcome to SATSET</h1>
                        <p>Sistem Aplikasi Terpadu Satuan Eksekusi Tim</p>
                        <p class="subtitle">Kelompok 4 - Production Ready Backend</p>
                    </div>

                    <div class="status-banner">
                        <div class="status-indicator"></div>
                        <span>✓ Server is running and fully operational</span>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">🟢</div>
                            <div class="stat-value">ONLINE</div>
                            <div class="stat-label">Server Status</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">☕</div>
                            <div class="stat-value">Spring Boot</div>
                            <div class="stat-label">Framework</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">💾</div>
                            <div class="stat-value">PostgreSQL</div>
                            <div class="stat-label">Database</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🚀</div>
                            <div class="stat-value">v1.0</div>
                            <div class="stat-label">Current Version</div>
                        </div>
                    </div>

                    <div class="features" id="features">
                        <h2>Features & Capabilities</h2>
                        <div class="features-list" id="features-list">
                            <div style="text-align: center; color: #999;">Loading features...</div>
                        </div>
                    </div>

                    <div class="contact-form" id="contact">
                        <h2>Get in Touch</h2>
                        <div id="message-alert" class="alert"></div>
                        <form id="contact-form">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" required></textarea>
                            </div>
                            <button type="submit" class="btn" id="submit-btn">Send Message</button>
                        </form>
                    </div>

                    <div class="features" id="about">
                        <h2>About This Project</h2>
                        <p style="text-align: center; color: #666; margin-bottom: 0;">
                            SATSET is a modern Spring Boot application built by Kelompok 4 with clean architecture,
                            professional UI/UX, and production-ready code standards. This project demonstrates best practices
                            in enterprise Java development.
                        </p>
                    </div>
                </main>

                <footer>
                    <p>&copy; 2026 SATSET - Kelompok 4. Built with ❤️ using Spring Boot</p>
                    <p style="margin-top: 10px; font-size: 12px; color: #999;">
                        Contact: satset.team@example.com | Version 1.0.0
                    </p>
                </footer>

                <script>
                    // Load features from API
                    async function loadFeatures() {
                        try {
                            const response = await fetch('/api/features/active');
                            if (!response.ok) throw new Error('Failed to load features');
                            const features = await response.json();
                            
                            const container = document.getElementById('features-list');
                            if (features.length === 0) {
                                container.innerHTML = '<div style="text-align: center; color: #999;">No features available</div>';
                                return;
                            }
                            
                            container.innerHTML = features.map(feature => `
                                <div class="feature-item">
                                    <h3>${feature.title}</h3>
                                    <p>${feature.description}</p>
                                </div>
                            `).join('');
                        } catch (error) {
                            console.error('Error loading features:', error);
                            document.getElementById('features-list').innerHTML = '<div style="text-align: center; color: #999;">Failed to load features</div>';
                        }
                    }

                    // Handle contact form submission
                    document.getElementById('contact-form').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const submitBtn = document.getElementById('submit-btn');
                        const alertDiv = document.getElementById('message-alert');
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
                        
                        try {
                            const formData = {
                                name: document.getElementById('name').value,
                                email: document.getElementById('email').value,
                                subject: document.getElementById('subject').value,
                                message: document.getElementById('message').value
                            };
                            
                            const response = await fetch('/api/messages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData)
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok && result.success) {
                                alertDiv.className = 'alert success';
                                alertDiv.textContent = '✓ ' + result.message;
                                document.getElementById('contact-form').reset();
                                
                                setTimeout(() => {
                                    alertDiv.className = 'alert';
                                }, 5000);
                            } else {
                                alertDiv.className = 'alert error';
                                alertDiv.textContent = '✗ ' + (result.message || 'Failed to send message');
                            }
                        } catch (error) {
                            alertDiv.className = 'alert error';
                            alertDiv.textContent = '✗ Error sending message: ' + error.message;
                            console.error('Error:', error);
                        } finally {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = 'Send Message';
                        }
                    });

                    // Load features when page loads
                    document.addEventListener('DOMContentLoaded', loadFeatures);

                    // Smooth scroll for navigation links
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
                </script>
            </body>
        </html>
            """;
    }
}