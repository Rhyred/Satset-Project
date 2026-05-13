package com.kelompok4.satset.service;

import com.kelompok4.satset.model.ContactMessage;
import com.kelompok4.satset.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactMessageService {
    
    private final ContactMessageRepository contactMessageRepository;
    
    public ContactMessage saveMessage(ContactMessage message) {
        return contactMessageRepository.save(message);
    }
    
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalse();
    }
    
    public Optional<ContactMessage> getMessageById(Long id) {
        return contactMessageRepository.findById(id);
    }
    
    public ContactMessage markAsRead(Long id) {
        return contactMessageRepository.findById(id)
                .map(message -> {
                    message.setIsRead(true);
                    return contactMessageRepository.save(message);
                })
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
    }
    
    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }
    
    public long getTotalMessages() {
        return contactMessageRepository.count();
    }
    
    public long getUnreadCount() {
        return contactMessageRepository.findByIsReadFalse().size();
    }
}
