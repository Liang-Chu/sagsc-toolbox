import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ExcelTools from "./pages/ExcelTools";
import { navOptions } from "./assets/Links";
import { check } from '@tauri-apps/plugin-updater'; // Import the check function
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useEffect(() => {
    // Check for updates when the app starts
    const checkForUpdates = async () => {
      try {
        const update = await check();
        if (update) {
          console.log(`Found update: ${update}`);
          // You can display a notification or prompt the user to update
        } else {
          console.log("No updates available");
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    checkForUpdates();
  }, []);

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
