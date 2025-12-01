package com.parsley.parsley_chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;

  @MessageMapping("/message/{roomId}")
  @SendTo("/chatroom/{roomId}")
  public MessageDTO sendMessage(@DestinationVariable Long roomId, @Payload MessageDTO message) {
    Message savedMessage = messageService.saveMessage(message.toMessage());
    return MessageDTO.fromEntity(savedMessage);
  }

}
