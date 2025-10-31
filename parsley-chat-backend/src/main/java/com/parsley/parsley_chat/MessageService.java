package com.parsley.parsley_chat;

import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.Getter;

@Service
@Getter
public class MessageService {

  private List<Message> messages = new ArrayList<>();
  private Map<String, List<Message>> messageMap = new HashMap<>();

}
