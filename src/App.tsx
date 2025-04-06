import { Screener } from "./components/Screener"
import "./App.css"

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Blueprint Screener</h1>
      </header>
      <main className="app-main">
        <Screener />
      </main>
    </div>
  )
}

export default App
