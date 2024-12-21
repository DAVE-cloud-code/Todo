import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URLS; 
console.log(BACKEND_URL)

const useStyles = makeStyles({
  container: {
    marginTop: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  todoCard: {
    backgroundColor: '#f0f8ff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1rem',
  },
  button: {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293',
    },
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#9a0007',
    },
  },
  completeButton: {
    backgroundColor: '#388e3c',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1b5e20',
    },
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  loader: {
    color: '#fff',
  },
});

const HomePage = () => {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [loading, setLoading] = useState(null); // For button loading states

  // Request notification permissions on load
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() =>
        toast.warning('Notification permission denied')
      );
    }

    // Fetch todos when the component loads
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/todos`);
      setTodos(response.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error.response?.data || error.message);
      toast.error('Failed to fetch todos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task || !dueDate || !dueTime) {
      toast.error('All fields are required');
      return;
    }

    const todoData = {
      task,
      dueDateTime: new Date(`${dueDate} ${dueTime}`),
    };

    setLoading('add');
    setTimeout(async () => {
      try {
        await axios.post(`${BACKEND_URL}/api/todos`, todoData);
        toast.success('Todo added successfully');
        setTask('');
        setDueDate('');
        setDueTime('');
        fetchTodos();
      } catch (error) {
        console.error('Error adding todo:', error.response?.data || error.message);
        toast.error('Failed to add todo');
      } finally {
        setLoading(null);
      }
    }, 10000); // Delay for 10 seconds
  };

  const handleDelete = async (id) => {
    setLoading(`delete-${id}`);
    setTimeout(async () => {
      try {
        await axios.delete(`${BACKEND_URL}/api/todos/${id}`);
        toast.success('Todo deleted successfully');
        fetchTodos();
      } catch (error) {
        console.error('Error deleting todo:', error.response?.data || error.message);
        toast.error('Failed to delete todo');
      } finally {
        setLoading(null);
      }
    }, 10000); // Delay for 10 seconds
  };

  const handleComplete = async (id, task) => {
    setLoading(`complete-${id}`);
    setTimeout(async () => {
      try {
        await axios.delete(`${BACKEND_URL}/api/todos/${id}`);
        toast.success(`Todo "${task}" marked as completed`);
        fetchTodos();
      } catch (error) {
        console.error('Error marking todo as completed:', error);
        toast.error('Failed to mark todo as completed');
      } finally {
        setLoading(null);
      }
    }, 10000); // Delay for 10 seconds
  };

  const sendNotification = (task) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('Todo Reminder', {
          body: `Task "${task}" is due in 1 hour!`,
          icon: '../public/vite.svg', // Replace with your icon path
          vibrate: [200, 100, 200],
          tag: 'todo-notification',
        });
      });
    } else {
      console.error('Service Worker or Notifications API not supported.');
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" className={classes.header}>
        Todo List
      </Typography>

      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Task"
          variant="outlined"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          required
        />

        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <TextField
          label="Due Time"
          type="time"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          className={classes.button}
          disabled={loading === 'add'}
        >
          {loading === 'add' ? <CircularProgress size={24} className={classes.loader} /> : 'Add Todo'}
        </Button>
      </form>

      <Grid container spacing={2} style={{ marginTop: '2rem' }}>
        {todos.map((todo) => (
          <Grid item xs={12} sm={6} md={4} key={todo._id}>
            <Card className={classes.todoCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {todo.task}
                </Typography>
                <Typography variant="body2">
                  Due: {new Date(todo.dueDateTime).toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  className={classes.completeButton}
                  onClick={() => handleComplete(todo._id, todo.task)}
                  disabled={loading === `complete-${todo._id}`}
                  style={{ marginTop: '1rem', marginRight: '0.5rem' }}
                >
                  {loading === `complete-${todo._id}` ? (
                    <CircularProgress size={24} className={classes.loader} />
                  ) : (
                    'Mark as Completed'
                  )}
                </Button>
                <Button
                  variant="contained"
                  className={classes.deleteButton}
                  onClick={() => handleDelete(todo._id)}
                  disabled={loading === `delete-${todo._id}`}
                  style={{ marginTop: '1rem' }}
                >
                  {loading === `delete-${todo._id}` ? (
                    <CircularProgress size={24} className={classes.loader} />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
