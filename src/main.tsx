import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import HtmlApp from './HtmlApp.tsx'
import { Dialog } from "./hlx-dialog";

Dialog.register();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <section>
      <h2>React implementation</h2>
      <App />
    </section>
    <section>
      <h2>HTML implementation</h2>
      <HtmlApp />
    </section>
  </StrictMode>,
)
