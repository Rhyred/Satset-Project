package com.kelompok4.satset.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

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
                        <div class="features-list">
                            <div class="feature-item">
                                <h3>REST API</h3>
                                <p>Fully functional REST API with clean endpoints and proper status codes.</p>
                            </div>
                            <div class="feature-item">
                                <h3>Database Integration</h3>
                                <p>PostgreSQL integration with Hibernate ORM for data persistence.</p>
                            </div>
                            <div class="feature-item">
                                <h3>Responsive Design</h3>
                                <p>Mobile-friendly interface that works on all device sizes.</p>
                            </div>
                            <div class="feature-item">
                                <h3>Security Ready</h3>
                                <p>Spring Security configuration ready for authentication and authorization.</p>
                            </div>
                            <div class="feature-item">
                                <h3>Testing Framework</h3>
                                <p>JUnit 5 and Spring Boot Test integrated for quality assurance.</p>
                            </div>
                            <div class="feature-item">
                                <h3>Auto-Reload</h3>
                                <p>Spring DevTools enabled for rapid development cycles.</p>
                            </div>
                        </div>
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

                <footer id="contact">
                    <p>&copy; 2026 SATSET - Kelompok 4. Built with ❤️ using Spring Boot</p>
                    <p style="margin-top: 10px; font-size: 12px; color: #999;">
                        Contact: satset.team@example.com | Version 1.0.0
                    </p>
                </footer>

                    </div>
                    <div class="rainbow-bar"></div>
                </div>
            </body>
            </html>
            """;
    }
}