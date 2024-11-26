import React, { useEffect } from 'react';
import './App.css';
import HomePage from './homePage';

function App() {
  useEffect(() => {
    // Request Notification Permission on App Load
    if (Notification.permission !== 'granted') {
      
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.warn('Notification permission denied.');
        }
      });
    }
  }, []);

  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
