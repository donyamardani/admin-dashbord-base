import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import "@fontsource/vazirmatn";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './Store'



createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
      <App />
  </Provider>
  </StrictMode>,
)