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
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { config } from "./config";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

function App() {
}


const queryClient = new QueryClient();

const useCreatePreview = () => {
  return useMutation({
    mutationFn: async (url: string) => {
      const response = await axios.post<PreviewResponse>(
        `${config.apiUrl}/api/previews`,
        { url }
      );
      return response.data;
    },
  });
};

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const createPreview = useCreatePreview();

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      console.log("newMessage", newMessage);
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Check if the message contains a URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = newMessage.match(urlRegex);

      if (urls) {
        console.log("urls", urls);
        try {
          const preview = await createPreview.mutateAsync(urls[0]);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === message.id ? { ...msg, preview } : msg
            )
          );
          console.log("preview", preview);
        } catch (error) {
          console.error("Failed to create preview:", error);
        }
      }
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
            placeholder="Type a message or paste a URL..."
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  );
}

export default App;
