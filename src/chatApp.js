
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./chat";
import { Text, View, Button, TextInput } from 'react-native';


const socket = io.connect("https://chat-test-bugmakers.herokuapp.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showEmergency, setShowEmergency] = useState(true);
  const [showForm, setShowForm] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      setShowForm(false)
    }
  };
  const joinChat = (enteredText) => {
    setUsername(enteredText);
  };
  const chatRoom = (enteredText) => {
    setRoom(enteredText);
  };

  return (
    <>
    <View>
      {showEmergency ? (
        <Button
        class='emergencybtn'
        onPress={() => {
            setShowEmergency(false);
        }}
        title="Emergancy"
        />
        
      ) : showForm? (
        <View>
          <Text>Join A Chat</Text>
          <TextInput
            type="text"
            placeholder="John..."
            onChangeText={joinChat}
          />
          <TextInput
            type="text"
            placeholder="Room ID..."
            onChangeText={chatRoom}
          />
          <Button class='joinroombtn' onPress={joinRoom} title="Join A Room"/>
        </View>
      ): null}
      {showChat ? (
        <Chat socket={socket} username={username} room={room} />
      ) : null}
      </View>
    </>
  );
}

export default App;
