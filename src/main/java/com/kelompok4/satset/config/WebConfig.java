package com.kelompok4.satset.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/login", "/register",
                        "/api/auth/**",
                        "/css/**", "/js/**", "/images/**",
                        "/error", "/favicon.ico"
                );
    }

    static class AuthInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("user") != null) {
                return true;
            }
            // For API calls, return 401
            if (request.getRequestURI().startsWith("/api/")) {
                response.setStatus(401);
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Silakan login terlebih dahulu\"}");
                return false;
            }
            // For page requests, redirect to login
            response.sendRedirect("/login");
            return false;
        }
    }
}
