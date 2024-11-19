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
import EditLevel from "./components/level/EditLevel";
import AddLevel from "./components/level/AddLevel";
import Levels from "./components/level/Levels";

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
              <Route path="/collectibles/edit/:id" element={<EditCollectible />} />
              <Route path="/obstacles" element={<Obstacles />} />
              <Route path="/obstacles/addobstacle" element={<AddObstacle />} />
              <Route path="/obstacles/editobstacle/:id" element={<EditObstacle />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/levels/addlevel" element={<AddLevel />} />
              <Route path="/levels/editlevel/:id" element={<EditLevel />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
