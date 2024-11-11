import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import ExcelTools from "./pages/ExcelTools"
import { navOptions } from "./assets/Links"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"

import { check } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"

// Import the entire package.json as a module
import packageJson from "../package.json" 

function App() {
  const [updateInfo, setUpdateInfo] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  // Function to check for updates
  const checkForUpdates = async () => {
    try {
      const update = await check()
      if (update) {
        console.log(
          `Found update ${update.version} from ${update.date} with notes: ${update.body}`
        )
        setUpdateInfo(update)
      } else {
        console.log("No updates available")
        setUpdateInfo(null) // Reset if no update
      }
    } catch (error) {
      console.error("Error checking for updates:", error)
    }
  }

  // Function to download and install the update
  const downloadAndInstallUpdate = async () => {
    if (updateInfo) {
      setDownloading(true)
      let downloaded = 0
      let contentLength = 0

      // Start the update process
      await updateInfo.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength
            console.log(`Started downloading ${contentLength} bytes`)
            break
          case "Progress":
            downloaded += event.data.chunkLength
            setDownloadProgress((downloaded / contentLength) * 100)
            console.log(`Downloaded ${downloaded} of ${contentLength}`)
            break
          case "Finished":
            console.log("Download finished")
            break
          default:
            break
        }
      })

      console.log("Update installed")
      await relaunch() // Relaunch the app after installing the update
      setDownloading(false)
    }
  }

  // Check for updates when the app starts
  useEffect(() => {
    checkForUpdates()
  }, [])

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

        {/* Show update information if available */}
        <div className="version-info">
          <p>Current Version: {packageJson.version}</p>
          {updateInfo ? (
            <div className="update-info border">
              <p>
                Update available: {updateInfo.version} - {updateInfo.body}
              </p>
              <button onClick={downloadAndInstallUpdate}>Update Now</button>
            </div>
          ) : (
            <p>No updates available.</p>
          )}

          {/* Button to manually check for updates */}
          <button onClick={checkForUpdates} className="check-update-btn">
            Check for Updates
          </button>

          {/* Show download progress if updating */}
          {downloading && (
            <div className="downloading-info">
              <p>Downloading update... {Math.round(downloadProgress)}%</p>
            </div>
          )}
        </div>
      </Router>
    </div>
  )
}

export default App
