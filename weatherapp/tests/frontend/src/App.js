import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import WeatherDashboard from "@/components/WeatherDashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
