package com.parsley.parsley_chat;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

  private final MessageRepository messageRepository;

  public Message saveMessage(Message message) {
    message.setTimestamp(LocalDateTime.now());
    message.setId(null);
    return messageRepository.save(message);
  }

  public List<MessageDTO> getMessageHistoryByRoomId(Long roomId) {
    return messageRepository.findByRoomIdOrderByTimestampAsc(roomId).stream().map(MessageDTO::fromEntity).toList();
  }

}
