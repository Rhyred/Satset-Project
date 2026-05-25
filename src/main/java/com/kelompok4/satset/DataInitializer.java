package com.kelompok4.satset;

import com.kelompok4.satset.model.Feature;
import com.kelompok4.satset.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final FeatureRepository featureRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize default features if table is empty
        if (featureRepository.count() == 0) {
            featureRepository.save(new Feature(null, "REST API", 
                "Fully functional REST API with clean endpoints and proper status codes.", 
                "⚙️", true));
            
            featureRepository.save(new Feature(null, "Database Integration",
                "PostgreSQL integration with Hibernate ORM for data persistence.",
                "💾", true));
            
            featureRepository.save(new Feature(null, "Responsive Design",
                "Mobile-friendly interface that works on all device sizes.",
                "📱", true));
            
            featureRepository.save(new Feature(null, "Security Ready",
                "Spring Security configuration ready for authentication and authorization.",
                "🔒", true));
            
            featureRepository.save(new Feature(null, "Testing Framework",
                "JUnit 5 and Spring Boot Test integrated for quality assurance.",
                "✅", true));
            
            featureRepository.save(new Feature(null, "Auto-Reload",
                "Spring DevTools enabled for rapid development cycles.",
                "🔄", true));
        }
    }
}
