const API_URL = "https://sst-ecuador.onrender.com";

// LOGIN
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

// OBTENER CHECKLIST
export async function getChecklist(token) {
  const res = await fetch(`${API_URL}/checklist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

// CREAR CHECKLIST
export async function crearChecklist(data, token) {
  const res = await fetch(`${API_URL}/checklist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}