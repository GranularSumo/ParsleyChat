package com.parsley.parsley_chat;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class Message {

  private String senderName;
  private String message;
  private String date;
  private long roomId;

  public Message(String sender, String message, long roomId) {
    this.senderName = sender;
    this.message = message;
    this.roomId = roomId;
    this.date = LocalDateTime.now().toString();
  }

}
