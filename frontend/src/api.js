const API_URL = "http://localhost:3000";

// 🔐 Fetch automático con token
export async function apiFetch(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(API_URL + endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
        ...(options.headers || {})
      }
    });

    // 🔴 Si no autorizado → cerrar sesión
    if (res.status === 401 || res.status === 403) {
      console.warn("Sesión expirada o no autorizada");
      localStorage.clear();
      window.location.reload();
      return [];
    }

    // 🛡️ Evita error "no valid JSON"
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Respuesta no es JSON:", text);
      return [];
    }

  } catch (error) {
    console.error("Error en apiFetch:", error);
    return [];
  }
}