import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AuthRouter from "./components/AuthRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRouter />} />
        <Route path="/login" element={<AuthRouter type="login" />} />
        <Route path="/signup" element={<AuthRouter type="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

