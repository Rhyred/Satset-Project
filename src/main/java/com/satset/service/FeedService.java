package com.satset.service;

import com.satset.model.CommunityFeed;
import com.satset.model.TipePost;

import java.util.List;

public interface FeedService {
    CommunityFeed postingPengumuman(Long adminId, String judul, String konten, String imageUrl);
    CommunityFeed postingBarangHilang(Long userId, String judul, String konten, String imageUrl);
    List<CommunityFeed> getAllFeed();
}
