import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// 👉 DOM elemek
const btnUsers = document.getElementById("btn-users");
const btnAddContent = document.getElementById("btn-add-content");
const btnEditContent = document.getElementById("btn-edit-content");
const adminSection = document.getElementById("admin-section");
const date = Timestamp.now(); 


// 👉 Eseménykezelők
btnUsers.addEventListener("click", showUserList);

btnAddContent.addEventListener("click", () => {
  adminSection.innerHTML = `
    <h2>Blogcikk hozzáadása</h2>
    <form id="blog-form">
      <label>Cím: <input type="text" id="blog-title" required></label><br>
      <label>Tartalom: <textarea id="blog-content" required></textarea></label><br>
      <label>Szerző: <input type="text" id="blog-author" required></label><br>
  <select id="blog-category" >
  <option value="Coach">Coach</option>
  <option value="Grafológia">Grafológia</option>
  <option value="Életmód">Életmód</option>
  </select>
   
      <label>Kép URL: <input type="url" id="blog-image" required></label><br>
      <button type="submit">Mentés</button>
    </form>
  `;

  document.getElementById("blog-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const title = document.getElementById("blog-title").value;
    const content = document.getElementById("blog-content").value;
    const author = document.getElementById("blog-author").value;
 const  category = document.getElementById("blog-category").value;
    const imageUrl = document.getElementById("blog-image").value;
    const date = Timestamp.now();
    const excerpt = content.length > 200 ? content.substring(0, 200) + "..." : content;
  
    try {
      await addDoc(collection(db, "blog"), {
        title,
        content,
        author, 
        category,
        imageUrl,
        excerpt,
        date
      });
      alert("Blogcikk elmentve!");
    } catch (err) {
      console.error("Hiba a mentéskor:", err);
      alert("Nem sikerült elmenteni a cikket.");
    }
  });
  
});


btnEditContent.addEventListener("click", () => {
  adminSection.innerHTML = "<p>Itt lesz a tartalom szerkesztése szekció.</p>";
});

// 👉 Felhasználók lekérdezése és megjelenítése
async function showUserList() {
  try {
    const querySnapshot = await getDocs(collection(db, "rani"));

    if (querySnapshot.empty) {
      adminSection.innerHTML = "<p>Nincs regisztrált felhasználó.</p>";
      return;
    }

    const users = querySnapshot.docs.map(doc => {
      const user = doc.data();
      return {
        id: doc.id,
        name: user.name || "Nincs megadva",
        email: user.email,
        role: user.role || "nincs megadva",
      };
    });

    // Név szerinti rendezés
    users.sort((a, b) => a.name.localeCompare(b.name));

    // HTML sablon a szűrőhöz és a listához
    adminSection.innerHTML = `
      <h2 class=">Felhasználók</h2>
      <label for="role-filter">Szűrés szerepkör szerint:</label>
      <select id="role-filter">
        <option value="all">Mind</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </select>
      <ul id="user-list"></ul>
    `;

    // Lista megjelenítése
    renderUserList(users);

    // Szűrés szerepkör szerint
    document.getElementById("role-filter").addEventListener("change", (e) => {
      const selectedRole = e.target.value;
      const filteredUsers = selectedRole === "all"
        ? users
        : users.filter(user => user.role === selectedRole);
      renderUserList(filteredUsers);
    });

  } catch (error) {
    console.error("Hiba a felhasználók lekérdezésekor:", error);
    adminSection.innerHTML = "<p>Hiba történt a felhasználók betöltésekor.</p>";
  }
}

// 👉 Lista kirenderelése
function renderUserList(users) {
  const userListElement = document.getElementById("user-list");
  if (!userListElement) return;

  // Táblázat HTML sablon, fejléccel
  let html = `
  
    <table>
      <thead>
        <tr>
          <th>Név</th>
          <th>Email</th>
          <th>Szerepkör</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Sorok generálása
  users.forEach(user => {
    const roleClass = 
      user.role === "admin" ? "role-admin" :
      user.role === "user" ? "role-user" : "role-guest";

    html += `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="${roleClass}">${user.role}</span></td>
        <td style="text-align:right;"><button data-id="${user.id}" class="delete-user-btn">Törlés</button></td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  userListElement.innerHTML = html;

  // Eseménykezelő hozzárendelése a törlés gombokhoz
  document.querySelectorAll(".delete-user-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteUser(id);
    });
  });
}


// 👉 Felhasználó törlése
async function deleteUser(id) {
  try {
    const confirmed = confirm("Biztosan törölni szeretnéd ezt a felhasználót?");
    if (!confirmed) return;

    await deleteDoc(doc(db, "registration", id));
    alert("Felhasználó törölve.");
    showUserList(); // frissítés
  } catch (error) {
    console.error("Hiba a törléskor:", error);
    alert("Nem sikerült törölni a felhasználót.");
  }
}
