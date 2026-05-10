package com.satset.repository;

import com.satset.model.CommunityFeed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityFeedRepository extends JpaRepository<CommunityFeed, Long> {
    List<CommunityFeed> findAllByOrderByPublishedAtDesc();
}
