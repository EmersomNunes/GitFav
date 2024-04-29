import { GithubAPI } from "./GithubAPI.js";

export class FavoriteUsers {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = this.root.querySelector("table tbody");
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExist = this.entries.find(entry => entry.login === username)

      if(userExist) {
        throw new Error ('Usuário já cadastrado')
      }

      const user = await GithubAPI.search(username);

      if(user.login === undefined) {
        throw new Error("Usuário não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update();
      this.save();

    } catch(e) {
      alert(e.message)
    }
  }

  deleteUser(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoriteViewport extends FavoriteUsers {
  constructor(root) {
    super(root);

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value);
    }
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esta linha?");

        if (isOk) {
          this.deleteUser(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <tr>
    <td class="user">
        <img src="https://github.com/EmersomNunes.png" alt="Imagem de Emersom">
        <a href="https://github.com/EmersomNunes" target="_blank">
            <p>Emersom</p>
            <span>emersom_nuness</span>
        </a>
    </td>
    <td class="repositories">
        30
    </td>
    <td class="followers">
        100
    </td>
    <td>
        <button class="remove">Remover</button>
    </td>
  </tr>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
