package com.parsley.parsley_chat;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

  private Long id;
  private Long roomId;
  private String senderName;
  private String content;
  private LocalDateTime timestamp;

  public static MessageDTO fromEntity(Message message) {
    return new MessageDTO(
        message.getId(),
        message.getRoomId(),
        message.getSenderName(),
        message.getContent(),
        message.getTimestamp());
  }

  public Message toMessage() {
    return new Message(
        this.id,
        this.roomId,
        this.senderName,
        this.content,
        this.timestamp);
  }
}
