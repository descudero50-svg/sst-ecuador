const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

/* =========================
   🔹 TEST
========================= */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/* =========================
   🔐 LOGIN (CREA USUARIO SI NO EXISTE)
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 CREA USUARIO AUTOMÁTICO (IMPORTANTE)
    await prisma.Usuario.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        email: "admin@test.com",
        password: "123456",
        rol: "admin",
        empresaId: 1,
      },
    });

    const user = await prisma.Usuario.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({
      token: "token-demo",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
});

/* =========================
   📋 CHECKLIST
========================= */
app.get("/checklist", async (req, res) => {
  try {
    const data = await prisma.Checklist.findMany({
      include: { evidencias: true },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error checklist" });
  }
});

/* =========================
   🚀 SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});