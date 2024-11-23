import "./App.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Collectibles from "./components/collectible/Collectibles";
import AddCollectible from "./components/collectible/AddCollectible";
import EditCollectible from "./components/collectible/EditCollectible";
import AuthProvider from "./context/AuthContext";
import Login from "./components/Login";
import PrivateRoute from "./components/utils/PrivateRoute";
import Obstacles from "./components/obstacle/Obstacles";
import AddObstacle from "./components/obstacle/AddObstacle";
import EditObstacle from "./components/obstacle/EditObstacle";
import EditInitialSetting from "./components/level/EditInitialSetting";
import AddInitialSetting from "./components/level/AddInitialSetting";
import InitialSetting from "./components/level/InitialSetting";
import Impact from "./components/impact/Impact";
import AddImpact from "./components/impact/AddImpact";
import EditImpact from "./components/impact/EditImpact";
import Players from "./components/player/Players";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collectibles" element={<Collectibles />} />
              <Route path="/collectibles/addcollectible" element={<AddCollectible />} />
              <Route path="/collectibles/editcollectible/:id" element={<EditCollectible />} />
              <Route path="/obstacles" element={<Obstacles />} />
              <Route path="/obstacles/addobstacle" element={<AddObstacle />} />
              <Route path="/obstacles/editobstacle/:id" element={<EditObstacle />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/impact/addimpact" element={<AddImpact />} />
              <Route path="/impact/editimpact/:id" element={<EditImpact />} />
              <Route path="/initialsetting" element={<InitialSetting />} />
              <Route path="/initialsetting/addinitialsetting" element={<AddInitialSetting />} />
              <Route path="/initialsetting/editinitialsetting/:id" element={<EditInitialSetting />} />
              <Route path="/players" element={<Players />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
