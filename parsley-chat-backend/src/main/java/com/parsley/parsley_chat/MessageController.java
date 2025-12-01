package com.parsley.parsley_chat;

import java.util.ArrayList;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  private final SimpMessagingTemplate template;

  /***
   * This handles incoming messages for a specific chat room and broadcasts it to
   * the room's subscribers.
   * 
   * @param roomId  the id of the room that the user(client) is currently in.
   * @param message the message payload sent by the client.
   * @return the message that gets broadcast to the subscribers of the room.
   */

  @MessageMapping("/message/{roomId}")
  @SendTo("/chatroom/{roomId}")
  public Message sendMessage(@DestinationVariable String roomId, @Payload Message message) {
    if (!messageService.getMessageMap().containsKey(roomId)) {
      messageService.getMessageMap().put(roomId, new ArrayList<Message>());
    }
    messageService.getMessageMap().get(roomId).add(message);
    return message;
  }

  /***
   * I don't know if this is the best way to do this, but im using this to
   * retrieve the
   * message history for the room when a client connects.
   *
   * @param roomId the id of the room that the user(client) is currently in.
   */

  @MessageMapping("/join/{roomId}")
  public void getMessageHistory(@DestinationVariable String roomId) {
    if (!messageService.getMessageMap().containsKey(roomId)) {
      messageService.getMessageMap().put(roomId, new ArrayList<Message>());
    }

    template.convertAndSend("/chatroom/" + roomId + "/history", messageService.getMessageMap().get(roomId));
  }

}
