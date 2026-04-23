import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const login = async () => {
    try {
      const res = await fetch("https://sst-ecuador.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (data.error) {
        setMensaje(data.error);
      } else {
        setMensaje("✅ Login correcto");
        console.log(data);
      }

    } catch (error) {
      setMensaje("❌ Error de conexión");
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Iniciar sesión SG-SST</h2>

      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Ingresar</button>

      <p>{mensaje}</p>
    </div>
  );
}

export default App;