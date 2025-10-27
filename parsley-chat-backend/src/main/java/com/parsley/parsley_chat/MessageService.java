package com.parsley.parsley_chat;

import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class MessageService {

  private List<Message> messages;

}
