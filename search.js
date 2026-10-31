const input = document.getElementById('searchInput');
const resultsWrap = document.getElementById('searchResults');
const resultsGrid = document.getElementById('resultsGrid');
console.log("Products loaded:", products);
function card(p){
  return `
  <div class="product-card">
    <img src="${p.image}" alt="${p.name}">
    <div class="product-info">
      <h4>${p.name}</h4>
      <p>${p.description || 'Maggie Lover special premium dish'}</p>
      <div class="product-bottom">
        <span class="price">₹${p.price}</span>
        <button class="add-btn">+</button>
      </div>
    </div>
  </div>`;
}

function renderCategory(id, list){
  document.getElementById(id).innerHTML = list.map(card).join('');
}

renderCategory(
  'handiGrid',
  products.filter(p => p.category === 'World Famous Handi Maggi')
);

renderCategory(
  'pastaGrid',
  products.filter(p => p.category === 'Classic Pasta' || p.category === 'Premium Pasta')
);

renderCategory(
  'pizzaGrid',
  products.filter(p => p.category === 'Pizza')
);

renderCategory(
  'momoGrid',
  products.filter(p => p.category === 'Aata Momos')
);

document.getElementById('recommendedList').innerHTML =
  products.slice(0,8).map(card).join('');

input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();

  if(!q){
    resultsWrap.style.display = 'none';
    return;
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  );

  resultsGrid.innerHTML = filtered.map(card).join('');
  resultsWrap.style.display = 'block';
});