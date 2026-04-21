import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Checklist({ user }) {

  const [data, setData] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [file, setFile] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [evidencias, setEvidencias] = useState({});

  useEffect(() => {
    cargar();
  }, []);

  const cargar = () => {
    apiFetch("/checklist").then(res => {
      if (Array.isArray(res)) setData(res);
      else setData([]);
    });
  };

  const cargarEvidencias = async (id) => {
    const res = await apiFetch(`/evidencias/${id}`);
    setEvidencias(prev => ({
      ...prev,
      [id]: res || []
    }));
  };

  const crear = async () => {
    await apiFetch("/checklist", {
      method: "POST",
      body: JSON.stringify({ pregunta })
    });
    setPregunta("");
    cargar();
  };

  const toggle = async (id, estado) => {
    await apiFetch(`/checklist/${id}`, {
      method: "PUT",
      body: JSON.stringify({ cumple: !estado })
    });
    cargar();
  };

  const subir = async (id) => {
    if (!file) return alert("Selecciona archivo");

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("checklistId", id);
    formData.append("observacion", observacion);

    await fetch("http://localhost:3000/evidencias", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: formData
    });

    setFile(null);
    setObservacion("");
    cargarEvidencias(id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Checklist con Evidencias</h2>

      {user?.rol === "ADMIN" && (
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="Nueva pregunta"
            value={pregunta}
            onChange={e => setPregunta(e.target.value)}
            style={input}
          />
          <button onClick={crear} style={btnPrimary}>Agregar</button>
        </div>
      )}

      {data.map(item => (
        <div key={item.id} style={card}>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={item.cumple}
              onChange={() => toggle(item.id, item.cumple)}
            />
            <strong>{item.pregunta}</strong>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>📎 Evidencias:</strong>

            <ul>
              {(evidencias[item.id] || []).map(ev => (
                <li key={ev.id}>
                  <a
                    href={`http://localhost:3000/uploads/${ev.archivo}`}
                    target="_blank"
                  >
                    Ver archivo
                  </a>
                  — {ev.observacion}
                </li>
              ))}
            </ul>

            <button onClick={() => cargarEvidencias(item.id)} style={btnSecondary}>
              Actualizar evidencias
            </button>
          </div>

          <div style={{ marginTop: 10 }}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <input
              placeholder="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              style={input}
            />

            <button onClick={() => subir(item.id)} style={btnPrimary}>
              Subir evidencia
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

// 🎨 estilos
const card = {
  background: "white",
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const input = {
  padding: 8,
  marginRight: 10,
  borderRadius: 5,
  border: "1px solid #ccc"
};

const btnPrimary = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 5,
  cursor: "pointer"
};

const btnSecondary = {
  background: "#e5e7eb",
  border: "none",
  padding: "6px 10px",
  borderRadius: 5,
  cursor: "pointer"
};