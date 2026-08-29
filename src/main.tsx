import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { ExperienceShell } from './app/ExperienceShell';
createRoot(document.getElementById('root')!).render(
  <StrictMode><ExperienceShell /></StrictMode>,
);
