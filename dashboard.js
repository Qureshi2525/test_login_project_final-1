
const products = [
  { 
    id: 'p1', 
    name: 'Smartphone X10', 
    price: 85000, 
    image: 'assets/smartphone.jpg', 
    discountPercent: 10 
  },
  { 
    id: 'p2', 
    name: 'Laptop Pro 15', 
    price: 185000, 
    image: 'assets/laptop.jpg', 
    discountPercent: 15 
  },
  { 
    id: 'p3', 
    name: 'Smartwatch Active', 
    price: 28000, 
    image: 'assets/watch.jpeg', 
    discountPercent: 20 
  },
  { 
    id: 'p4', 
    name: 'Wireless Earbuds', 
    price: 12000, 
    image: 'assets/earbuds.jpg', 
    discountPercent: 5 
  }
];

// const products = [
//   { id: 'p1', name: 'Smartphone X10', price: 85000, image: 'assets/smartphone.jpg', discountPercent: 10 },
//   { id: 'p2', name: 'Laptop Pro 15', price: 185000, image: 'assets/laptop.jpg', discountPercent: 15 },
//   { id: 'p3', name: 'Smartwatch Active', price: 28000, image: 'assets/watch.jpeg', discountPercent: 20 },
//   { id: 'p4', name: 'Wireless Earbuds', price: 12000, image: 'assets/earbuds.jpg', discountPercent: 5 }
// ];

const $ = (s) => document.querySelector(s);
const formatPKR = v => 'PKR ' + v.toLocaleString('en-PK');
let cart = JSON.parse(localStorage.getItem('rt_cart') || '{}');

function saveCart(){ localStorage.setItem('rt_cart', JSON.stringify(cart)); updateCartBadge(); }

function updateCartBadge(){
  const count = Object.values(cart).reduce((s,q)=>s+q,0);
  $('#cartCount').textContent = count;
  if(count>0) $('#cartCount').classList.remove('d-none'); else $('#cartCount').classList.add('d-none');
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const discounted = Math.round(p.price * (1 - p.discountPercent/100));
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card card-product h-100 shadow-sm">
        <img src="${p.image}" class="card-img-top" alt="${p.name}">
        <div class="card-body text-center">
          <h6 class="product-title fw-bold">${p.name}</h6>
          <div class="mb-1 price">${formatPKR(discounted)}</div>
          <div class="discount mb-2"><del>${formatPKR(p.price)}</del> - ${p.discountPercent}% Off</div>
          <button class="btn btn-primary w-100 add-btn" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
  document.querySelectorAll('.add-btn').forEach(btn=>{
    const id = btn.dataset.id;
    if(cart[id]) btn.classList.add('added'), btn.textContent='Added';
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      cart[id] = (cart[id]||0)+1;
      saveCart();
      btn.classList.add('added');
      btn.textContent = 'Added';
    });
  });
}

function renderCartModal(){
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  let total = 0;
  if(Object.keys(cart).length===0){
    cartItems.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
  } else {
    const list = document.createElement('div');
    list.className = 'list-group';
    Object.entries(cart).forEach(([id, qty])=>{
      const p = products.find(x=>x.id===id);
      const discounted = Math.round(p.price * (1 - p.discountPercent/100));
      const lineTotal = discounted * qty;
      total += lineTotal;
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex align-items-center justify-content-between';
      item.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${p.image}" style="width:60px;height:45px;object-fit:cover;" class="me-3 rounded">
          <div>
            <div class="fw-bold">${p.name}</div>
            <div class="small text-muted">${formatPKR(discounted)} x ${qty}</div>
          </div>
        </div>
        <div class="text-end">
          <div class="fw-bold">${formatPKR(lineTotal)}</div>
          <button class="btn btn-sm btn-link text-danger remove-btn" data-id="${id}">Remove</button>
        </div>
      `;
      list.appendChild(item);
    });
    cartItems.appendChild(list);
  }
  document.getElementById('cartTotal').textContent = formatPKR(total);
  document.querySelectorAll('.remove-btn').forEach(b=> b.addEventListener('click', ()=>{
    const id = b.dataset.id;
    delete cart[id];
    saveCart();
    renderProducts();
    renderCartModal();
  }));
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts();
  updateCartBadge();
  const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

  document.getElementById('cartBtn').addEventListener('click', ()=>{
    renderCartModal();
    cartModal.show();
  });

  document.getElementById('clearCart').addEventListener('click', ()=>{
    cart = {};
    saveCart();
    renderProducts();
    renderCartModal();
  });

  document.getElementById('checkoutBtn').addEventListener('click', ()=>{
    alert('Checkout is a demo. Cart will be cleared.');
    cart = {};
    saveCart();
    renderProducts();
    renderCartModal();
    cartModal.hide();
  });

  const signout = document.getElementById('logoutBtn');
  if(signout) signout.addEventListener('click', ()=>{
    if(window.confirm('Sign out?')) window.location.href = 'index.html';
  });
});
