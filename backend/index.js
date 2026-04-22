import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

/* =========================
   🔹 RUTA TEST
========================= */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/* =========================
   🔐 LOGIN
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Token simple (luego lo mejoramos con JWT)
    return res.json({
      token: "token-demo",
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
});

/* =========================
   📋 OBTENER CHECKLIST
========================= */
app.get("/checklist", async (req, res) => {
  try {
    const data = await prisma.checklist.findMany({
      include: {
        evidencias: true,
      },
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo checklist" });
  }
});

/* =========================
   ➕ CREAR CHECKLIST
========================= */
app.post("/checklist", async (req, res) => {
  try {
    const { pregunta } = req.body;

    const nuevo = await prisma.checklist.create({
      data: {
        pregunta,
        cumple: false,
        empresaId: 1,
      },
    });

    res.json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando checklist" });
  }
});

/* =========================
   👷 TRABAJADORES
========================= */
app.get("/trabajadores", async (req, res) => {
  try {
    const data = await prisma.trabajador.findMany();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo trabajadores" });
  }
});

app.post("/trabajadores", async (req, res) => {
  try {
    const { nombre, cargo, area, riesgo } = req.body;

    const nuevo = await prisma.trabajador.create({
      data: {
        nombre,
        cargo,
        area,
        riesgo,
        empresaId: 1,
      },
    });

    res.json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando trabajador" });
  }
});

/* =========================
   📎 EVIDENCIAS
========================= */
app.post("/evidencias", async (req, res) => {
  try {
    const { archivo, observacion, checklistId } = req.body;

    const nueva = await prisma.evidencia.create({
      data: {
        archivo,
        observacion,
        checklistId,
        empresaId: 1,
      },
    });

    res.json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando evidencia" });
  }
});

/* =========================
   🚀 SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});