package com.satset.service.impl;

import com.satset.model.Admin;
import com.satset.model.CommunityFeed;
import com.satset.model.TipePost;
import com.satset.model.User;
import com.satset.repository.AdminRepository;
import com.satset.repository.CommunityFeedRepository;
import com.satset.repository.UserRepository;
import com.satset.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {

    private final CommunityFeedRepository feedRepository;
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    @Override
    public CommunityFeed postingPengumuman(Long adminId, String judul, String konten, String imageUrl) {
        Admin admin = adminRepository.findById(adminId).orElseThrow();
        CommunityFeed feed = createFeed(judul, konten, imageUrl);
        feed.setAdmin(admin);
        feed.setTipePost(TipePost.PENGUMUMAN);
        return feedRepository.save(feed);
    }

    @Override
    public CommunityFeed postingBarangHilang(Long userId, String judul, String konten, String imageUrl) {
        User user = userRepository.findById(userId).orElseThrow();
        CommunityFeed feed = createFeed(judul, konten, imageUrl);
        feed.setUser(user);
        feed.setTipePost(TipePost.BARANG_HILANG);
        return feedRepository.save(feed);
    }

    @Override
    public List<CommunityFeed> getAllFeed() {
        return feedRepository.findAllByOrderByPublishedAtDesc();
    }

    private CommunityFeed createFeed(String judul, String konten, String imageUrl) {
        CommunityFeed feed = new CommunityFeed();
        feed.setJudulPost(judul);
        feed.setKonten(konten);
        feed.setImageUrl(imageUrl);
        feed.setPublishedAt(LocalDateTime.now());
        return feed;
    }
}
