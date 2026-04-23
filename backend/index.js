const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

/* TEST */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/* LOGIN */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({
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

/* CHECKLIST */
app.get("/checklist", async (req, res) => {
  const data = await prisma.checklist.findMany({
    include: { evidencias: true },
  });
  res.json(data);
});

/* CREAR CHECKLIST */
app.post("/checklist", async (req, res) => {
  const { pregunta } = req.body;

  const nuevo = await prisma.checklist.create({
    data: {
      pregunta,
      cumple: false,
      empresaId: 1,
    },
  });

  res.json(nuevo);
});

/* SERVIDOR */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});