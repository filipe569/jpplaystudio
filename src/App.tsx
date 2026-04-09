import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainSite from './MainSite';
import Admin from './Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
