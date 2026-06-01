package com.kelompok4.satset.service;

import com.kelompok4.satset.model.Feature;
import com.kelompok4.satset.repository.FeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeatureService {
    
    private final FeatureRepository featureRepository;
    
    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }
    
    public List<Feature> getActiveFeatures() {
        return featureRepository.findByIsActiveTrue();
    }
    
    public Optional<Feature> getFeatureById(Long id) {
        return featureRepository.findById(id);
    }
    
    public Feature createFeature(Feature feature) {
        if (feature.getIsActive() == null) {
            feature.setIsActive(true);
        }
        return featureRepository.save(feature);
    }
    
    public Feature updateFeature(Long id, Feature feature) {
        return featureRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(feature.getTitle());
                    existing.setDescription(feature.getDescription());
                    existing.setIcon(feature.getIcon());
                    existing.setIsActive(feature.getIsActive());
                    return featureRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Feature not found with id: " + id));
    }
    
    public void deleteFeature(Long id) {
        featureRepository.deleteById(id);
    }
}
