let token = '';

// ✅ Hardcoded backend URL (Render)
const backendURL = 'https://note-app-oko4.onrender.com';

// ✅ Helper to show error messages
function showError(message) {
  alert(message || "Something went wrong");
}

async function register() {
  try {
    const res = await fetch(`${backendURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      showError("Registration failed: " + errorText);
      return;
    }

    const data = await res.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "notes.html";
    } else {
      showError(data.message || "Registration failed");
    }
  } catch (err) {
    showError("Network error during registration");
  }
}

async function login() {
  try {
    const res = await fetch(`${backendURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      showError("Login failed: " + errorText);
      return;
    }

    const data = await res.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      window.location.href = "notes.html";
    } else {
      showError(data.message || "Login failed");
    }
  } catch (err) {
    showError("Network error during login");
  }
}

async function addNote() {
  try {
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
  } catch (err) {
    showError("Failed to add note");
  }
}

async function loadNotes() {
  try {
    token = localStorage.getItem("token");
    const res = await fetch(`${backendURL}/api/notes`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) {
      const errorText = await res.text();
      showError("Failed to load notes: " + errorText);
      return;
    }

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
  } catch (err) {
    showError("Error fetching notes");
  }
}

async function deleteNote(id) {
  try {
    await fetch(`${backendURL}/api/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    loadNotes();
  } catch (err) {
    showError("Failed to delete note");
  }
}
