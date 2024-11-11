import React, { useState } from "react";
import { check } from '@tauri-apps/plugin-updater'; // Import the check function
import NavBar from "../components/Navbar";
import packageJson from "../../package.json"; // Import package.json to get the version

const MainLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const checkForUpdates = async () => {
    try {
      const update = await check();
      if (update) {
        console.log(`Found update: ${update}`);
        // Handle update logic here, e.g., prompt user to install
      } else {
        console.log("No updates available");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
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
      <main className="main-container ">
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
    </div>
  );
};

export default MainLayout;
