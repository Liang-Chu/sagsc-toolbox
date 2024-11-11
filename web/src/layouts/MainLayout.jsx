import React, { useState } from "react";
import { check, Update } from '@tauri-apps/plugin-updater'; // Import necessary functions
import NavBar from "../components/Navbar";
import packageJson from "../../package.json"; // Import package.json to get the version

const MainLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Track update state

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const checkForUpdates = async () => {
    try {
      const update = await check();
      console.log(`update: ${update}`);
      if (update) {
        console.log(`Found update: ${update.version}`);
        // Start the download and installation process
        setIsUpdating(true); // Show loading state
        await Update();
        setIsUpdating(false); // Reset loading state after installation
        console.log("Update installed successfully.");
      } else {
        console.log("No updates available");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      setIsUpdating(false); // Reset loading state if an error occurs
    }
  };

  return (
    <div className="App">
      <NavBar isVisible={isSidebarVisible} />
      <button
        onClick={toggleSidebar}
        className={`toggle-btn ${isSidebarVisible ? "expanded" : "collapsed"}`}
      >
        {isSidebarVisible ? "<<" : ">>"}
      </button>
      <main className="main-container">
        {children}
      </main>
      {/* Display version in the top right */}
      <div 
        className="version-info" 
        style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
        onClick={checkForUpdates}
      >
        <p>Version: {packageJson.version}</p>
      </div>

      {/* Show a loading message while updating */}
      {isUpdating && (
        <div className="updating-info" style={{ position: 'absolute', top: '50px', right: '10px' }}>
          <p>Downloading and installing update...</p>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
