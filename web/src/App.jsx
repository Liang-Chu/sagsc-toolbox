import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { relaunch } from '@tauri-apps/plugin-process';
import MainLayout from "./layouts/MainLayout";
import ExcelTools from "./pages/ExcelTools";
import { navOptions } from "./assets/Links";
import { check } from '@tauri-apps/plugin-updater'; // Import the check function
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isUpdating, setIsUpdating] = useState(false) // Track Update state
  useEffect(() => {
    // Check for updates when the app starts
    const checkForUpdates = async () => {
      try {
        const updateInfo = await check() // Check for updates
        console.log(`Update: ${JSON.stringify(updateInfo)}`)
  
        if (updateInfo && updateInfo.version !== updateInfo.currentVersion) {
          let downloaded = 0
          let contentLength = 0
          await updateInfo.downloadAndInstall((event) => {
            switch (event.event) {
              case "Started":
                contentLength = event.data.contentLength
                console.log(
                  `started downloading ${event.data.contentLength} bytes`
                )
                break
              case "Progress":
                downloaded += event.data.chunkLength
                console.log(`downloaded ${downloaded} from ${contentLength}`)
                break
              case "Finished":
                console.log("download finished")
                break
              default:
                break
            }
          })
          console.log("update installed")
          await relaunch()
        } else {
          console.log("No updates available")
        }
      } catch (error) {
        console.error("Error checking for updates:", error)
        setIsUpdating(false) // Reset loading state if an error occurs
      }
    }

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
