import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import "./index.css";
import ContextProviders from "./context/index.js";
import { ThemeProvider } from "./components/ui/theme-provider.js";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar.js";
import { AppSidebar } from "./components/ui/AppSidebar.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ContextProviders>
          <SidebarProvider>
            {/* <AppSidebar /> */}
            <App />
          </SidebarProvider>
        </ContextProviders>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
