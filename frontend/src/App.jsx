import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import Managers from "./components/managers/Managers";
// import AddManager from "./components/managers/AddManager";
// import EditManager from "./components/managers/EditManager";
// import ViewManager from "./components/managers/ViewManager";
// import Agents from "./components/Agents";
// import Properties from "./components/Properties";
// import ClientDetails from "./components/clientDetails";
// import EditClientDetails from "./components/EditClientDetails";
import AuthProvider from "./context/AuthContext";
import Login from "./components/Login";
import PrivateRoute from "./components/utils/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
