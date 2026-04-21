import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Trabajadores() {

  const [data, setData] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [area, setArea] = useState("");
  const [riesgo, setRiesgo] = useState("");

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    apiFetch("/trabajadores").then(res => {
      if (Array.isArray(res)) setData(res);
      else setData([]);
    });
  };

  const crear = async () => {
    if (!nombre) return alert("Nombre requerido");

    await apiFetch("/trabajadores", {
      method: "POST",
      body: JSON.stringify({
        nombre,
        cargo,
        area,
        riesgo
      })
    });

    setNombre("");
    setCargo("");
    setArea("");
    setRiesgo("");

    cargar();
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar trabajador?")) return;

    await apiFetch(`/trabajadores/${id}`, {
      method: "DELETE"
    });

    cargar();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👷 Trabajadores</h2>

      {/* FORMULARIO */}
      <div style={card}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={input}
        />

        <input
          placeholder="Cargo"
          value={cargo}
          onChange={e => setCargo(e.target.value)}
          style={input}
        />

        <input
          placeholder="Área"
          value={area}
          onChange={e => setArea(e.target.value)}
          style={input}
        />

        <input
          placeholder="Riesgo"
          value={riesgo}
          onChange={e => setRiesgo(e.target.value)}
          style={input}
        />

        <button onClick={crear} style={btnPrimary}>
          Agregar
        </button>
      </div>

      {/* LISTA */}
      <div>
        {data.map(t => (
          <div key={t.id} style={card}>
            <strong>{t.nombre}</strong> — {t.cargo} — {t.area} — {t.riesgo}

            <br />

            <button onClick={() => eliminar(t.id)} style={btnDanger}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// 🎨 ESTILOS
const card = {
  background: "white",
  padding: 15,
  borderRadius: 10,
  marginBottom: 15,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const input = {
  padding: 8,
  marginRight: 10,
  marginBottom: 10,
  borderRadius: 5,
  border: "1px solid #ccc"
};

const btnPrimary = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 5,
  cursor: "pointer"
};

const btnDanger = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: 5,
  cursor: "pointer",
  marginTop: 10
};