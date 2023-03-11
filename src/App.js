import Dashboard from "./components/parts/screens/Dashboard";
import Login from "./components/parts/screens/Login";
import Register from "./components/parts/screens/Register";
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
