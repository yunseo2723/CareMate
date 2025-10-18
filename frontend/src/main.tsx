import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { SearchProvider } from './contexts/SearchProvider.tsx'
import { AuthProvider } from "./contexts/AuthContext";
import {StrictMode} from "react";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
        <SearchProvider>
            <App />
        </SearchProvider>
        </AuthProvider>
    </StrictMode>
)