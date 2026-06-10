const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.resolve(__dirname, 'data.json');
const STATIC_ROOT = __dirname;

app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_ROOT));

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('Falta data.json en el directorio del proyecto');
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const DATA = loadData();

app.get('/api/data', (req, res) => {
  res.json(DATA);
});

app.post('/api/login', (req, res) => {
  const { role } = req.body || {};
  if (role !== 'admin' && role !== 'client') {
    return res.status(400).json({ error: 'Rol inválido' });
  }
  res.json({ success: true, role });
});

app.post('/api/catalog', (req, res) => {
  const { sku, name, desc, ean, units } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });
  const id = 'P' + Date.now();
  const nextNumber = DATA.catalog.length + 1;
  const rayo = 'RY-' + String(nextNumber).padStart(4, '0');
  const product = { id, sku: sku || `SKU-${nextNumber}`, name, desc: desc || '', ean: ean || '', rayo, units: Number(units) || 0, pos: '—' };
  DATA.catalog.push(product);
  saveData(DATA);
  res.json(product);
});

app.post('/api/receipts', (req, res) => {
  const { pid, qty } = req.body || {};
  if (!pid || !qty) return res.status(400).json({ error: 'Producto y cantidad requeridos' });
  const id = 'R-' + Math.floor(Math.random() * 900 + 205);
  const receipt = {
    id,
    date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
    declared: [{ pid, qty: Number(qty) }],
    status: 'pending',
    operator: null,
    discrepancy: 0
  };
  DATA.receipts.push(receipt);
  saveData(DATA);
  res.json(receipt);
});

app.put('/api/orders/:id', (req, res) => {
  const order = DATA.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  const body = req.body || {};
  Object.assign(order, body);

  if (typeof body.stockChange === 'number') {
    body.items?.forEach(item => {
      const product = DATA.catalog.find(p => p.id === item.pid);
      if (product) product.units = Math.max(0, product.units + body.stockChange);
    });
  }

  if (body.status === 'dispatched' && !order.guide) {
    order.guide = body.guide || order.guide;
  }

  saveData(DATA);
  res.json(order);
});

app.put('/api/receipts/:id', (req, res) => {
  const receipt = DATA.receipts.find(r => r.id === req.params.id);
  if (!receipt) return res.status(404).json({ error: 'Recepción no encontrada' });
  const { status, scanned, operator, discrepancy } = req.body || {};

  if (typeof scanned === 'number') {
    const item = receipt.declared[0];
    const product = DATA.catalog.find(p => p.id === item.pid);
    if (product) product.units = Math.max(0, product.units + scanned);
  }

  if (status) receipt.status = status;
  if (operator) receipt.operator = operator;
  if (typeof discrepancy === 'number') receipt.discrepancy = discrepancy;
  if (scanned) receipt.date = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });

  saveData(DATA);
  res.json(receipt);
});

app.put('/api/integrations/:name', (req, res) => {
  const integration = DATA.integrations.find(item => item.name === req.params.name);
  if (!integration) return res.status(404).json({ error: 'Integración no encontrada' });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'Estado requerido' });
  integration.status = status;
  saveData(DATA);
  res.json(integration);
});

app.put('/api/operators/:index', (req, res) => {
  const index = Number(req.params.index);
  const operator = DATA.operators[index];
  if (!operator) return res.status(404).json({ error: 'Operario no encontrado' });
  Object.assign(operator, req.body || {});
  saveData(DATA);
  res.json(operator);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(STATIC_ROOT, 'rayo-app.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rayo backend iniciado en http://localhost:${PORT}`);
});
