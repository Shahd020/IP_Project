<<<<<<< HEAD
<<<<<<< HEAD
﻿import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
=======
<<<<<<< HEAD
=======
>>>>>>> 432d1fd7e21526f0e67bf425c6eced46f0b9c868
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';
<<<<<<< HEAD
=======
﻿import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
>>>>>>> 9e18abd (phase 2 test lilly)
>>>>>>> e924226 (phase 2 lilly testing)
=======
>>>>>>> 432d1fd7e21526f0e67bf425c6eced46f0b9c868

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
