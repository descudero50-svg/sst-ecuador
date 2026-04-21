const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const app = express();
const prisma = new PrismaClient();

const SECRET = "123456";

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// ==========================
// 🔐 TOKEN
// ==========================
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}


// ==========================
// 📁 MULTER
// ==========================
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });


// ==========================
// TEST
// ==========================
app.get('/', (req, res) => {
  res.send("API funcionando 🚀");
});


// ==========================
// INIT
// ==========================
app.post('/init', async (req, res) => {
  const { empresaNombre, email, password } = req.body;

  const empresa = await prisma.empresa.create({
    data: { nombre: empresaNombre }
  });

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.usuario.create({
    data: {
      email,
      password: hash,
      rol: "ADMIN",
      empresaId: empresa.id
    }
  });

  res.json({ ok: true, user });
});


// ==========================
// LOGIN
// ==========================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "No existe" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Error" });

  const token = jwt.sign(
    { id: user.id, rol: user.rol, empresaId: user.empresaId },
    SECRET
  );

  res.json({ token, user });
});


// ==========================
// CHECKLIST
// ==========================
app.get('/checklist', verificarToken, async (req, res) => {
  const data = await prisma.checklist.findMany({
    where: { empresaId: req.user.empresaId }
  });
  res.json(data);
});

app.post('/checklist', verificarToken, async (req, res) => {
  const nuevo = await prisma.checklist.create({
    data: {
      pregunta: req.body.pregunta,
      empresaId: req.user.empresaId
    }
  });
  res.json(nuevo);
});

app.put('/checklist/:id', verificarToken, async (req, res) => {
  const actualizado = await prisma.checklist.update({
    where: { id: Number(req.params.id) },
    data: { cumple: req.body.cumple }
  });
  res.json(actualizado);
});


// ==========================
// TRABAJADORES
// ==========================
app.get('/trabajadores', verificarToken, async (req, res) => {
  const data = await prisma.trabajador.findMany({
    where: { empresaId: req.user.empresaId }
  });
  res.json(data);
});

app.post('/trabajadores', verificarToken, async (req, res) => {
  const { nombre, cargo, area, riesgo } = req.body;

  const nuevo = await prisma.trabajador.create({
    data: {
      nombre,
      cargo,
      area,
      riesgo,
      empresaId: req.user.empresaId
    }
  });

  res.json(nuevo);
});


// ==========================
// PDF NIVEL MINISTERIO
// ==========================
app.get('/reporte-pdf', verificarToken, async (req, res) => {
  try {

    const checklist = await prisma.checklist.findMany({
      where: { empresaId: req.user.empresaId }
    });

    const empresa = await prisma.empresa.findUnique({
      where: { id: req.user.empresaId }
    });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte_sst.pdf');

    doc.pipe(res);

    // LOGO
    try {
      doc.image('logo.png', 40, 30, { width: 80 });
    } catch {}

    // TITULO
    doc.fontSize(16).text('SG-SST ECUADOR', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Empresa: ${empresa?.nombre}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    let total = checklist.length;
    let cumplen = checklist.filter(c => c.cumple).length;
    let porcentaje = total === 0 ? 0 : Math.round((cumplen / total) * 100);

    doc.text(`Cumplimiento: ${porcentaje}%`);
    doc.moveDown();

    checklist.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.pregunta}`);
      doc.text(`Estado: ${item.cumple ? "CUMPLE" : "NO CUMPLE"}`);
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.text('________________________');
    doc.text('Responsable SST');

    // QR
    const qr = await QRCode.toDataURL(`Empresa: ${empresa?.nombre}`);
    doc.image(qr, 400, doc.y, { width: 100 });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error PDF" });
  }
});


app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});