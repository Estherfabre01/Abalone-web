import Header from "../pages/Header";
import Friends from "../pages/Friends";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* Header en haut */}
      <Header />

      {/* Contenu principal */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* Zone centrale : Home */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>

        {/* Friends à droite */}
        <div
          style={{
            width: "260px",
            borderLeft: "1px solid #ccc",
            padding: "20px"
          }}
        >
          <Friends />
        </div>

      </div>
    </div>
  );
}
