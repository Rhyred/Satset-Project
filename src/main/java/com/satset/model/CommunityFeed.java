package com.satset.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "community_feed")
public class CommunityFeed extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin")
    private Admin admin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipePost tipePost;

    @Column(nullable = false)
    private String judulPost;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String konten;

    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime publishedAt;
}
