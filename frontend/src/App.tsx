import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { ModelAnalytics } from "./pages/ModelAnalytics";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics/models" element={<ModelAnalytics />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
