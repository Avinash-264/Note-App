let token = '';

// ✅ Hardcoded backend URL (no localhost logic)
const backendURL = 'https://note-app-oko4.onrender.com';

async function register() {
  const res = await fetch(`${backendURL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    loadNotes();
  } else {
    alert(data.message || "Registration failed");
  }
}

async function login() {
  const res = await fetch(`${backendURL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    loadNotes();
  } else {
    alert(data.message || "Login failed");
  }
}

async function addNote() {
  await fetch(`${backendURL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      title: 'Note',
      content: document.getElementById('note').value
    })
  });

  document.getElementById('note').value = '';
  loadNotes();
}

async function loadNotes() {
  const res = await fetch(`${backendURL}/api/notes`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });

  const notes = await res.json();
  const list = document.getElementById('notes');
  list.innerHTML = '';

  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.content;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteNote(note._id);

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function deleteNote(id) {
  await fetch(`${backendURL}/api/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });

  loadNotes();
}
