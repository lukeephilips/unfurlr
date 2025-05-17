import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Unfurlr Chat
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", py: 2 }}
      >
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            mb: 2,
            p: 2,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <List sx={{ flexGrow: 1 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    backgroundColor:
                      message.sender === "user" ? "#e3f2fd" : "#f5f5f5",
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText
                    primary={message.text}
                    secondary={message.timestamp.toLocaleTimeString()}
                  />
                </Paper>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            sx={{ alignSelf: "flex-end" }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
