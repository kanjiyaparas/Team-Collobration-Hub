import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Card, 
    CardContent, 
    CardHeader, 
    Fade, 
    Box 
} from '@mui/material';
import { createTask, getTasks, getUsers } from '../common/api';
import { Link } from 'react-router-dom';

const TaskManager = () => {
    const [title, setTitle] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const result = await getUsers();
            if (result) {
                setUsers(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        const response = await getTasks();
        setTasks(response.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        if (!title || userIds.length === 0) return; 
        const newTask = { title, userIds };
        await createTask(newTask);
        setTitle('');
        setUserIds([]);
        fetchTasks();
    };

    const handleUserChange = (event) => {
        setUserIds(event.target.value);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
                Task Manager
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#616161' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#1976d2' }}>Back To Dashboard</Link>
            </Typography>

            <Card variant="outlined" sx={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
                <CardHeader 
                    title="Create New Task" 
                    sx={{ backgroundColor: '#1976d2', color: 'white' }}
                />
                <CardContent>
                    <TextField
                        label="Task Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiOutlinedInput-root': { borderColor: '#1976d2' }}}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Users</InputLabel>
                        <Select
                            multiple
                            value={userIds}
                            onChange={handleUserChange}
                            label="Users"
                            renderValue={(selected) =>
                                selected
                                    .map((userId) => users.find((user) => user._id === userId)?.name)
                                    .join(', ')
                            }
                            sx={{
                                '& .MuiOutlinedInput-root': { borderColor: '#1976d2' },
                                '&:hover .MuiOutlinedInput-root': { borderColor: '#115293' },
                            }}
                        >
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCreateTask} 
                        sx={{ mt: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' }}}
                    >
                        Create Task
                    </Button>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom align="center" style={{ marginTop: '20px', color: '#1976d2' }}>
                Task List
            </Typography>

            <Fade in={tasks.length > 0} timeout={500}>
                <List sx={{ animation: 'fade-in 1s' }}>
                    {tasks.map((task) => (
                        <ListItem key={task._id} sx={{ transition: 'background-color 0.3s', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                            <ListItemText
                                primary={task.title}
                                secondary={`Assigned to: ${task.userIds.map((userId) =>
                                    users.find((user) => user._id === userId._id)?.name).join(', ')}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Fade>
        </Container>
    );
};

export default TaskManager;
