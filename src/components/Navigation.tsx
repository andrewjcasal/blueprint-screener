import { useState } from "react"
import "../styles/Navigation.css"

type NavigationProps = {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">Blueprint Screener</div>
        <div className="nav-links">
          <button
            className={`nav-link ${activeTab === "assessment" ? "active" : ""}`}
            onClick={() => onTabChange("assessment")}
          >
            Take Assessment
          </button>
          <button
            className={`nav-link ${
              activeTab === "submissions" ? "active" : ""
            }`}
            onClick={() => onTabChange("submissions")}
          >
            Submissions
          </button>
        </div>
      </div>
    </nav>
  )
}
