import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Almacenamiento en memoria
let items = [];
let users = [];
let itemIdCounter = 1;
let userIdCounter = 1;

// Rutas para Items
app.post('/api/items', (req, res) => {
  const newItems = Array.isArray(req.body) ? req.body : [req.body];
  const createdItems = newItems.map(item => {
    const newItem = { id: itemIdCounter++, ...item };
    items.push(newItem);
    return newItem;
  });
  res.status(201).json({ message: 'Item(s) creado(s)', items: createdItems });
});

app.get('/api/items/:id?', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ items });
  }
  const item = items.find(i => i.id === Number(id));
  if (!item) {
    return res.status(404).json({ message: 'Item no encontrado' });
  }
  res.json({ item });
});

app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(i => i.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Item no encontrado' });
  }
  items.splice(index, 1);
  res.json({ message: 'Item eliminado' });
});

app.patch('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(i => i.id === Number(id));
  if (!item) {
    return res.status(404).json({ message: 'Item no encontrado' });
  }
  Object.assign(item, req.body);
  res.json({ message: 'Item actualizado', item });
});

// Rutas para Usuarios
app.post('/api/users', (req, res) => {
  const newUsers = Array.isArray(req.body) ? req.body : [req.body];
  const createdUsers = newUsers.map(user => {
    const userItems = (user.items || []).map(itemId => {
      return items.find(i => i.id === itemId);
    }).filter(Boolean);
    const newUser = { id: userIdCounter++, ...user, items: userItems };
    users.push(newUser);
    return newUser;
  });
  res.status(201).json({ message: 'Usuario(s) creado(s)', users: createdUsers });
});

app.get('/api/users/:id?', (req, res) => {
  const { id } = req.params;
  if (!users.length) {
    return res.status(404).json({ message: 'No hay usuarios' });
  }
  if (!id) {
    return res.json({ users });
  }
  const user = users.find(u => u.id === Number(id));
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json({ user });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  users.splice(index, 1);
  res.json({ message: 'Usuario eliminado' });
});

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === Number(id));
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  if (req.body.items) {
    user.items = req.body.items.map(itemId => items.find(i => i.id === itemId)).filter(Boolean);
    delete req.body.items;
  }
  Object.assign(user, req.body);
  res.json({ message: 'Usuario actualizado', user });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 