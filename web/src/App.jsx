import React, { useState, createContext, useEffect, useContext } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useLocation } from "react-router-dom";
import ExcelTools from "./pages/ExcelTools";
import { navOptions } from "./assets/Links";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route
              path={navOptions.Home}
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
             <Route
              path={navOptions.ExcelTools}
              element={
                <MainLayout>
                  <ExcelTools />
                </MainLayout>
              }
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
