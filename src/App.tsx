import { useState } from "react"
import { Screener } from "./components/Screener"
import { Navigation } from "./components/Navigation"
import { SubmissionsTable } from "./components/SubmissionsTable"
import "./App.css"

function App() {
  const [activeTab, setActiveTab] = useState<string>("assessment")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="app">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="app-main">
        <div className="app-content">
          {activeTab === "assessment" ? <Screener /> : <SubmissionsTable />}
        </div>
      </main>
    </div>
  )
}

export default App
