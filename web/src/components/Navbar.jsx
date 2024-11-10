// Navbar.jsx
import React from "react"
import { Link } from "react-router-dom"
import { navOptions } from "../assets/Links" // Adjust the path if needed
import "../css/Navbar.css"

function NavBar({ isVisible }) {
  return (
    <div className={`navbar ${isVisible ? 'expanded' : 'collapsed'}`}>
      <ul className="navbar-links">
        {Object.entries(navOptions).map(([title, path]) => (
          <li key={title}>
            <Link to={path}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NavBar
