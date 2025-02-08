document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const userList = document.getElementById("userList");
  const searchInput = document.getElementById("search");
  const clearAllBtn = document.getElementById("clearAll");
  const clearFieldsBtn = document.getElementById("clearFields");

  function formatDateTime() {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, "0");
    const mes = String(now.getMonth() + 1).padStart(2, "0");
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, "0");
    const minutos = String(now.getMinutes()).padStart(2, "0");
    const segundos = String(now.getSeconds()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
  }

  function loadUsers() {
    userList.innerHTML = "";
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    users.forEach((user) => addUserToList(user));
  }

  function addUserToList(user) {
    const li = document.createElement("li");
    li.textContent = `${user.date} - ${user.name} - ${user.email}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => deleteUser(user);

    li.appendChild(deleteBtn);
    userList.appendChild(li);
  }

  function deleteUser(user) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.filter((u) => u.email !== user.email);
      localStorage.setItem("users", JSON.stringify(users));
      loadUsers();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
      alert("Preencha todos os campos!");
      return;
    }

    const user = {
      name,
      email,
      date: formatDateTime(),
      timestamp: new Date().toISOString(),
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    loadUsers();
    form.reset();
  });

  clearFieldsBtn.addEventListener("click", () => form.reset());

  clearAllBtn.addEventListener("click", () => {
    const users = localStorage.getItem("users");

    if (!users) return;

    if (confirm("Tem certeza que deseja excluir todos os usuários?")) {
      localStorage.removeItem("users");
      loadUsers();
    }
  });

  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    userList.innerHTML = "";
    users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchText) ||
          user.email.toLowerCase().includes(searchText)
      )
      .forEach((user) => addUserToList(user));
  });

  loadUsers();
});
