import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Avatar, 
    Box, 
    Slide 
} from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const TaskChatRoom = () => {
    const { taskId } = useParams(); 
    const location = useLocation();
    const userId = location.state?.userId; 

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [isSending, setIsSending] = useState(false); 

    // Fetch messages and task users
    useEffect(() => {
        const fetchMessages = async () => {
            const response = await axios.get(`http://localhost:5000/api/message/${taskId}`);
            setMessages(response.data);
        };

        const fetchTaskUsers = async () => {
            const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}/users`);
            setUsers(response.data);
        };

        fetchMessages();
        fetchTaskUsers();
    }, [taskId]);

    const sendMessage = async () => {
        if (message.trim() && !isSending) {
            const newMessage = {
                taskId,
                userId,
                content: message,
                timestamp: new Date().toISOString(),
            };

            setIsSending(true); 
            socket.emit('taskMessage', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            try {
                await axios.post('http://localhost:5000/api/message', newMessage);
                // window.location.reload(); // Avoid using reload, will be managed via socket
            } catch (error) {
                console.error('Error saving message to server', error);
            } finally {
                setMessage(''); 
                setIsSending(false); 
            }
        }
    };

    useEffect(() => {
        socket.emit('joinTaskRoom', { taskId });

        const handleMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage); 
        };
    }, [taskId]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
                Task Chat Room
            </Typography>

            <Paper className="mb-4 p-3" elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                    Users Assigned to Task
                </Typography>
                <List>
                    {users.map((user) => (
                        <ListItem key={user._id}>
                            <Avatar sx={{ mr: 2 }} />
                            <ListItemText primary={user.name} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Paper className="mb-4 p-3" elevation={3} style={{ maxHeight: '400px', overflowY: 'auto', backgroundColor: '#e3f2fd' }}>
                <Typography variant="h6" gutterBottom>
                    Messages
                </Typography>
                <List>
                    {messages.map((msg, index) => (
                        <Slide direction="up" in key={index} mountOnEnter unmountOnExit>
                            <ListItem>
                                <ListItemText
                                    primary={msg.content} 
                                    secondary={`${msg.userId?.name || 'Unknown'} - ${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'No time'}`}
                                />
                                <Divider />
                            </ListItem>
                        </Slide>
                    ))}
                </List>
            </Paper>

            <Box sx={{ display: 'flex', marginTop: '16px' }}>
                <TextField
                    label="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': { 
                            '&:hover fieldset': { borderColor: '#1976d2' },
                        }
                    }}
                />
                <Button 
                    onClick={sendMessage} 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginLeft: '8px', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                >
                    Send
                </Button>
            </Box>
        </Container>
    );
};

export default TaskChatRoom;
