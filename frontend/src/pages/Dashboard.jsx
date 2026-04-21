import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {

  const [checklist, setChecklist] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const chk = await apiFetch("/checklist");
    const trab = await apiFetch("/trabajadores");

    setChecklist(Array.isArray(chk) ? chk : []);
    setTrabajadores(Array.isArray(trab) ? trab : []);
  };

  const total = checklist.length;
  const cumplen = checklist.filter(i => i.cumple).length;
  const porcentaje = total === 0 ? 0 : Math.round((cumplen / total) * 100);

  const dataGrafico = [
    { name: "Cumple", value: cumplen },
    { name: "No cumple", value: total - cumplen }
  ];

  return (
    <div>
      <h2>📊 Panel de control</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>

        <div style={card}>
          <h3>{porcentaje}%</h3>
          <p>Cumplimiento</p>
        </div>

        <div style={card}>
          <h3>{total}</h3>
          <p>Lista de verificación</p>
        </div>

        <div style={card}>
          <h3>{cumplen}</h3>
          <p>Cumplen</p>
        </div>

        <div style={card}>
          <h3>{trabajadores.length}</h3>
          <p>Trabajadores</p>
        </div>

      </div>

      <PieChart width={300} height={300}>
        <Pie data={dataGrafico} dataKey="value" outerRadius={100}>
          <Cell fill="#22c55e" />
          <Cell fill="#ef4444" />
        </Pie>
      </PieChart>

    </div>
  );
}

const card = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  width: 150,
  textAlign: "center"
};