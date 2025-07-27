let token = '';

async function register() {
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  token = data.token;
  loadNotes();
}

async function login() {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  token = data.token;
  loadNotes();
}

async function addNote() {
  await fetch('http://localhost:5000/api/notes', {
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
  const res = await fetch('http://localhost:5000/api/notes', {
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
  await fetch(`http://localhost:5000/api/notes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  loadNotes();
}
