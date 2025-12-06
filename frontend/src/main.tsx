import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from "./contexts/AuthProvider";
import {StrictMode} from "react";
import {SearchProvider} from "./contexts/SearchProvider.tsx";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SearchProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
        </SearchProvider>
    </StrictMode>
)