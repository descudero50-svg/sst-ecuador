import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Trabajadores from "./pages/Trabajadores";

export default function App() {

  const [user, setUser] = useState(null);
  const [view, setView] = useState("panel");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      alert("Error login");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const descargarPDF = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/reporte-pdf", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      alert("Error generando PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  // LOGIN
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>SG-SST ECUADOR PRO</h2>

        <input id="email" placeholder="Correo" /><br /><br />
        <input id="password" type="password" placeholder="Contraseña" /><br /><br />

        <button onClick={() =>
          login(
            document.getElementById("email").value,
            document.getElementById("password").value
          )
        }>
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>

      {/* MENU */}
      <div style={{
        width: 220,
        background: "#0f172a",
        color: "white",
        padding: 20,
        minHeight: "100vh"
      }}>
        <h3>SG-SST</h3>

        <p>ADMINISTRACIÓN</p>

        <button onClick={() => setView("panel")} style={btn}>Panel</button>

        <button onClick={() => setView("trabajadores")} style={btn}>
          👷 Trabajadores
        </button>

        <button onClick={() => setView("checklist")} style={btn}>
          📋 Lista de verificación
        </button>

        <button onClick={descargarPDF} style={btn}>
          📄 Informe en PDF
        </button>

        <button onClick={logout} style={btn}>
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, padding: 20 }}>

        {view === "panel" && <Dashboard />}
        {view === "trabajadores" && <Trabajadores />}
        {view === "checklist" && <Checklist user={user} />}

      </div>
    </div>
  );
}

const btn = {
  display: "block",
  margin: "10px 0",
  width: "100%",
  padding: 8,
  background: "#1e293b",
  color: "white",
  border: "none",
  cursor: "pointer"
};