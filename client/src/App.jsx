import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [showUsername, setShowUsername] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("recieve-message", ({ message, user }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: message,
          user: user,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSetUsername = (e) => {
    e.preventDefault();
    setShowUsername(username);
    setUser({
      username: username,
      socketId: socketId,
    });
  };

  const handleSend = (e) => {
    e.preventDefault();
    socket.emit("message", { message, sendTo, user });
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: message,
        senderSocketId: socketId,
      },
    ]);
    setMessage("");
  };
  return (
    <Box margin={23}>
      <Flex justifyContent={"space-between"}>
        <Text mb={23} fontSize="lg">
          {socketId}
        </Text>

        <Text color={"green"}>{showUsername}</Text>
      </Flex>
      <Stack>
        <Input
          type="text"
          width={400}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          name="Username"
          placeholder="Your Username"
        />
        <Button onClick={handleSetUsername}>Set Username</Button>

        <Text>Messenger</Text>

        <Input
          type="text"
          width={400}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          name="Message"
          placeholder="Message"
        />

        <Input
          type="text"
          width={400}
          value={sendTo}
          onChange={(e) => {
            setSendTo(e.target.value);
          }}
          name="sendTo"
          placeholder="Send to?"
        />

        <Button width={130} bg={"blue"} color={"white"} onClick={handleSend}>
          Send
        </Button>
      </Stack>

      <Box margin={3} borderRadius={10} bgColor={"orange.200"}>
        {/* <Stack>
          {messages.map((msg, i) => (
            <Text key={i}>{msg}</Text>
          ))}
        </Stack> */}
        <Stack>
          {messages.map((msg, i) =>
            msg.senderSocketId === socketId ? (
              <Flex flexDirection={"row-reverse"} key={i}>
                <Text margin={1} align={"left"} >
                  : You
                </Text>
                <Text margin={1} align={"right"}>
                  {msg.message}
                </Text>
              </Flex>
            ) : (
              <Flex key={i}>
                <Text margin={1} align={"right"} >
                  {msg.user.username} {" : "}
                </Text>
                <Text margin={1} align={"left"}>
                  {msg.message}
                </Text>
              </Flex>
            )
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default App;
