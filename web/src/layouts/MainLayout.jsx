import React, { useState } from "react"
import { check } from "@tauri-apps/plugin-updater" // Import necessary functions
import { relaunch } from '@tauri-apps/plugin-process';
import NavBar from "../components/Navbar"
import packageJson from "../../package.json" // Import package.json to get the version

const MainLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false) // Track Update state

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

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

  return (
    <div className="App">
      <NavBar isVisible={isSidebarVisible} />
      <button
        onClick={toggleSidebar}
        className={`toggle-btn ${isSidebarVisible ? "expanded" : "collapsed"}`}
      >
        {isSidebarVisible ? "<<" : ">>"}
      </button>
      <main className="main-container">{children}</main>
      {/* Display version in the top right */}
      <div
        className="version-info"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
        }}
        onClick={checkForUpdates}
      >
        <p>Versiont : {packageJson.version}</p>
      </div>

      {/* Show a loading message while updating */}
      {isUpdating && (
        <div
          className="updating-info"
          style={{ position: "absolute", top: "50px", right: "10px" }}
        >
          <p>Downloading and installing Update...</p>
        </div>
      )}
    </div>
  )
}

export default MainLayout
