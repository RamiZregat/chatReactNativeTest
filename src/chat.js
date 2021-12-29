import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Button, TextInput } from 'react-native';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const messages = (enteredText) => {
    setCurrentMessage(enteredText);
  };

  return (
    <View className="chat-window" style={{width:300}}>
      <View className="chat-header" style={{width:300}}>
        <Text>Live Chat</Text>
      </View>
      <View className="chat-body" style={{marginTop:100, width:300}}>
        <ScrollView  className="message-container">
          {messageList.map((messageContent) => {
            return (
              <View
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <View>
                  <View className="message-content">
                    <Text>{messageContent.message}</Text>
                  </View>
                  <View className="message-meta">
                    <Text id="time">{messageContent.time}</Text>
                    <Text id="author">{messageContent.author}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView >
      </View>
      <View className="chat-footer">
        <TextInput
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChangeText={messages}
          onKeypress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <Button onPress={sendMessage} title='Send'/>
      </View>
    </View>
  );
}

export default Chat;