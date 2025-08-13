// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider } from './components/NotiConfirm/index'
// import { StrictMode } from 'react'
import './index.css'
import App from './App'

window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (pre) {
    pre.style.opacity = "0";
    setTimeout(() => pre.remove(), 300);
  }
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
  // </StrictMode>
)
