// Utilidad para mostrar resultados
function showResult(id, data) {
  const el = document.getElementById(id);
  el.textContent = '';
  if (typeof data === 'string') {
    el.textContent = data;
  } else {
    el.textContent = JSON.stringify(data, null, 2);
  }
}

// Registrar Item
const itemForm = document.getElementById('itemForm');
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(itemForm);
  const body = {
    name: formData.get('name'),
    description: formData.get('description')
  };
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  showResult('itemFormResult', data);
  itemForm.reset();
});

// Consultar Items
const getItemForm = document.getElementById('getItemForm');
getItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = getItemForm.id.value;
  const url = id ? `/api/items/${id}` : '/api/items';
  const res = await fetch(url);
  const data = await res.json();
  showResult('getItemResult', data);
});

// Borrar Item
const deleteItemForm = document.getElementById('deleteItemForm');
deleteItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = deleteItemForm.id.value;
  const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
  const data = await res.json();
  showResult('deleteItemResult', data);
});

// Actualizar Item
const updateItemForm = document.getElementById('updateItemForm');
updateItemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = updateItemForm.id.value;
  const body = {};
  if (updateItemForm.name.value) body.name = updateItemForm.name.value;
  if (updateItemForm.description.value) body.description = updateItemForm.description.value;
  const res = await fetch(`/api/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  showResult('updateItemResult', data);
});

// Registrar Usuario
const userForm = document.getElementById('userForm');
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(userForm);
  const itemsStr = formData.get('items');
  const itemsArr = itemsStr ? itemsStr.split(',').map(s => Number(s.trim())).filter(Boolean) : [];
  const body = {
    name: formData.get('name'),
    email: formData.get('email'),
    items: itemsArr
  };
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  showResult('userFormResult', data);
  userForm.reset();
});

// Consultar Usuarios
const getUserForm = document.getElementById('getUserForm');
getUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = getUserForm.id.value;
  const url = id ? `/api/users/${id}` : '/api/users';
  const res = await fetch(url);
  const data = await res.json();
  showResult('getUserResult', data);
});

// Borrar Usuario
const deleteUserForm = document.getElementById('deleteUserForm');
deleteUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = deleteUserForm.id.value;
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  const data = await res.json();
  showResult('deleteUserResult', data);
});

// Actualizar Usuario
const updateUserForm = document.getElementById('updateUserForm');
updateUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = updateUserForm.id.value;
  const body = {};
  if (updateUserForm.name.value) body.name = updateUserForm.name.value;
  if (updateUserForm.email.value) body.email = updateUserForm.email.value;
  if (updateUserForm.items.value) {
    body.items = updateUserForm.items.value.split(',').map(s => Number(s.trim())).filter(Boolean);
  }
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  showResult('updateUserResult', data);
}); 