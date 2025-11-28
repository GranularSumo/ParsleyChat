package com.parsley.parsley_chat;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MessageHistoryController {

  private final MessageService messageService;

  @GetMapping("/chatroom/{id}/history")
  public List<MessageDTO> getMessageHistoryByRoomId(@PathVariable Long id) {
    return messageService.getMessageHistoryByRoomId(id);
  }

}
