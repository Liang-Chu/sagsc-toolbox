// MainLayout.jsx
import React, { useState } from "react"
import NavBar from "../components/Navbar"

const MainLayout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
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
      <main className="main-container ">{children}</main>
    </div>
  )
}

export default MainLayout
