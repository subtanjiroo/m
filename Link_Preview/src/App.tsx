import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import ReasoningPage from "./pages/ReasoningPage"
import UnderMaintainPage from "./pages/UnderMaintainPage"
import SettingsPage from "./pages/SettingsPage"
import SharedChatPage from "./pages/SharedChatPage"
import ConvNotfound from "./pages/ConvNotFound"

import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/shared/:shareId" element={<SharedChatPage />} />
            <Route path="/shared/notfound" element={<ConvNotfound />} />
            
            <Route path="/" element={<LandingPage />} />
            <Route path="/reasoning" element={<ReasoningPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            <Route path="/maintaining" element={<UnderMaintainPage />} />
        </Routes>
    )
}

export default App
