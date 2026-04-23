const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario || usuario.password !== password) {
      return res.status(401).json({
        error: "Credenciales incorrectas"
      });
    }

    res.json({
      mensaje: "Login correcto",
      usuario
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({
      error: "Error en login",
      detalle: error.message
    });
  }
});

// CREAR ADMIN
app.get("/crear-admin", async (req, res) => {
  try {
    const existe = await prisma.usuario.findUnique({
      where: { email: "admin@test.com" }
    });

    if (existe) {
      return res.json({ mensaje: "Ya existe" });
    }

    const usuario = await prisma.usuario.create({
      data: {
        email: "admin@test.com",
        password: "123456"
      }
    });

    res.json({
      mensaje: "Usuario creado",
      usuario
    });

  } catch (error) {
    console.error(error);
    res.json({
      error: "Error creando usuario",
      detalle: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});