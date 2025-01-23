// Inicializando array de itens
let items = [];

// Seletores
const form = document.getElementById('item-form');
const tableBody = document.getElementById('item-table-body');
const filterButton = document.getElementById('apply-filters');

let editIndex = null; // Indica o índice do item sendo editado (null = modo adição)

// Funções para manipular o localStorage
function saveToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
}

function loadFromLocalStorage() {
  const storedItems = localStorage.getItem('items');
  if (storedItems) {
    items = JSON.parse(storedItems);
  }
}

// Função para resetar o formulário
function resetForm() {
  form.reset();
  const submitButton = document.querySelector('#item-form button[type="submit"]');
  submitButton.textContent = 'Adicionar';
  submitButton.classList.remove('btn-success');
  submitButton.classList.add('btn-primary');
  editIndex = null;
}

// Função para renderizar a tabela
function renderTable(filteredItems = items) {
  tableBody.innerHTML = ''; // Limpa a tabela antes de renderizar
  filteredItems.forEach((item, index) => {
    // Garantir que valores inválidos não quebrem a tabela
    const valorCompra = parseFloat(item.valorCompra) || 0;
    const lucro = parseFloat(item.lucro) || 0;
    const precoVenda = valorCompra + (valorCompra * lucro / 100);

    // Cria uma nova linha da tabela
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${valorCompra.toFixed(2)}</td>
      <td>${lucro.toFixed(2)}%</td>
      <td>R$ ${precoVenda.toFixed(2)}</td>
      <td>
        <!-- Botão de edição -->
        <button class="btn btn-warning btn-sm me-2" onclick="editItem(${index})" aria-label="Editar ${item.nome}">
          <i class="fas fa-edit"></i>
        </button>
        <!-- Botão de exclusão -->
        <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})" aria-label="Excluir ${item.nome}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row); // Adiciona a linha na tabela
  });
}

// Função para editar item
function editItem(index) {
  const item = items[index];

  // Preencher o formulário com os dados do item
  document.getElementById('item-name').value = item.nome;
  document.getElementById('item-quantity').value = item.quantidade;
  document.getElementById('item-value').value = item.valorCompra;
  document.getElementById('item-profit').value = item.lucro;

  // Alterar o botão para "Salvar Alterações"
  const submitButton = document.querySelector('#item-form button[type="submit"]');
  submitButton.textContent = 'Salvar Alterações';
  submitButton.classList.remove('btn-primary');
  submitButton.classList.add('btn-success');

  // Definir o índice do item sendo editado
  editIndex = index;
}

// Função para adicionar ou editar itens
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('item-name').value.trim();
  const quantidade = parseInt(document.getElementById('item-quantity').value);
  const valorCompra = parseFloat(document.getElementById('item-value').value);
  const lucro = parseFloat(document.getElementById('item-profit').value);

  // Validação mais rigorosa
  if (!nome || isNaN(quantidade) || quantidade <= 0 || isNaN(valorCompra) || valorCompra <= 0 || isNaN(lucro) || lucro < 0) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  if (editIndex !== null) {
    // Atualiza o item existente
    items[editIndex] = { nome, quantidade, valorCompra, lucro };
  } else {
    // Adiciona um novo item
    items.push({ nome, quantidade, valorCompra, lucro });
  }

  saveToLocalStorage();
  renderTable();
  resetForm(); // Restaura o formulário
});



// Função para deletar item
function deleteItem(index) {
  if (confirm('Tem certeza de que deseja excluir este item?')) {
    items.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  }
}

const clearButton = document.getElementById('clear-all');

// Evento para limpar todos os dados
clearButton.addEventListener('click', () => {
  if (confirm('Tem certeza de que deseja limpar todos os itens?')) {
    // Esvaziar o array de itens
    items = [];

    // Limpar o localStorage
    saveToLocalStorage();

    // Re-renderizar a tabela
    renderTable();
  }
});

// Função para filtrar itens
filterButton.addEventListener('click', () => {
  const minQuantidade = parseInt(document.getElementById('filter-quantity').value) || 0;
  const minValorCompra = parseFloat(document.getElementById('filter-value').value) || 0;
  const minLucro = parseFloat(document.getElementById('filter-profit').value) || 0;

  const filteredItems = items.filter(item =>
    item.quantidade >= minQuantidade &&
    item.valorCompra >= minValorCompra &&
    item.lucro >= minLucro
  );

  renderTable(filteredItems);
});

// Carregar os dados do localStorage ao iniciar
loadFromLocalStorage();
renderTable();
