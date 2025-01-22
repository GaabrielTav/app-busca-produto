// Inicializando array de itens
let items = [];

// Seletores
const form = document.getElementById('item-form');
const itemNameInput = document.getElementById('item-name');
const tableBody = document.getElementById('item-table-body');
const searchBar = document.getElementById('search-bar');
const clearAllButton = document.getElementById('clear-all');

// Função para salvar dados no localStorage
function saveToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

// Função para carregar dados do localStorage
function loadFromLocalStorage() {
  const storedItems = localStorage.getItem('items');
  if (storedItems) {
    items = JSON.parse(storedItems); // Converte de string para array
  }
}

// Função para renderizar a tabela
function renderTable(filteredItems = items) {
  tableBody.innerHTML = '';
  filteredItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item}</td>
      <td>
        <button class="btn btn-warning btn-sm rounded shadow-sm" onclick="editItem(${index})">Editar</button>
        <button class="btn btn-danger btn-sm rounded shadow-sm" onclick="deleteItem(${index})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Função para adicionar item
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newItem = itemNameInput.value.trim();
  if (newItem) {
    items.push(newItem);
    itemNameInput.value = '';
    saveToLocalStorage(); // Salva no localStorage
    renderTable();
  }
});

// Função para deletar item
function deleteItem(index) {
  items.splice(index, 1);
  saveToLocalStorage(); // Atualiza o localStorage
  renderTable();
}

// Função para limpar tudo
clearAllButton.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todos os itens?')) {
    items = [];
    saveToLocalStorage(); // Atualiza o localStorage
    renderTable();
  }
});

// Função de pesquisa
searchBar.addEventListener('input', () => {
  const searchValue = searchBar.value.toLowerCase();
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchValue)
  );
  renderTable(filteredItems);
});

// Carregar dados do localStorage ao iniciar
loadFromLocalStorage();
renderTable();
