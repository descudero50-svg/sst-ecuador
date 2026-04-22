import { useState } from "react";
import { login } from "./api";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      console.log(res);
      setMsg(JSON.stringify(res));
    } catch (error) {
      console.error(error);
      setMsg("Error al conectar");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login SG-SST</h2>

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

      <button onClick={handleLogin}>Ingresar</button>

      <pre>{msg}</pre>
    </div>
  );
}

export default App;