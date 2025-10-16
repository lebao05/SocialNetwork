import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import { ChatProvider } from "./Contexts/ChatContext.jsx";
import ErrorBoundary from "./Helpers/ErrorBoundary.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ChatProvider>
          <App />
        </ChatProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
