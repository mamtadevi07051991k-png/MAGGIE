// ===== REAL GLOBAL CART SYSTEM =====

function getCart() {
  return JSON.parse(localStorage.getItem('maggieCart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('maggieCart', JSON.stringify(cart));
  updateCartBadge();
}

// Add product
function addToCart(name, price, image) {
  let cart = getCart();

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name,
      price,
      image,
      qty: 1
    });
  }

  saveCart(cart);
}

// Update badge on all pages
function updateCartBadge() {
  const cart = getCart();

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = totalQty;

    if (totalQty > 0) {
      el.style.display = 'flex';
    } else {
      el.style.display = 'none';
    }
  });
}

// Quantity change
function changeQty(index, change) {
  let cart = getCart();

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);

  if (typeof renderCart === 'function') {
    renderCart();
  }
}

// Remove item
function removeItem(index) {
  let cart = getCart();

  cart.splice(index, 1);

  saveCart(cart);

  if (typeof renderCart === 'function') {
    renderCart();
  }
}

// Run on every page
document.addEventListener('DOMContentLoaded', updateCartBadge);
;
function buyNow(name, price, image){

  let cart = JSON.parse(localStorage.getItem('maggieCart')) || [];

  // Buy Now me direct fresh item add karenge
  cart = [{
    name:name,
    price:price,
    image:image,
    qty:1
  }];

  localStorage.setItem('maggieCart', JSON.stringify(cart));

  // Direct checkout page open
  window.location.href = 'checkout.html';
}
/* ===== REAL SEARCH SYSTEM ===== */

const searchProducts = [
  {
    name:'Masala Handi Maggi',
    price:119,
    category:'handi',
    image:'assets/products/masala-handi-maggi.webp'
  },
  {
    name:'Paneer Handi Maggi',
    price:159,
    category:'handi',
    image:'assets/products/paneer-handi-maggi.webp'
  },
  {
    name:'Corn Cheese Handi Maggi',
    price:190,
    category:'handi',
    image:'assets/products/corn-cheese-handi-maggi.webp'
  },
  {
    name:'Cheese Pasta',
    price:100,
    category:'pasta',
    image:'assets/products/masala-handi-maggi.webp'
  },
  {
    name:'White Sauce Pasta',
    price:100,
    category:'pasta',
    image:'assets/products/white-sauce-pasta.webp'
  },
  {
    name:'Veg Momo',
    price:79,
    category:'momos',
    image:'assets/products/veg-momo.webp'
  },
  {
    name:'Paneer Momo',
    price:89,
    category:'momos',
    image:'assets/products/veg-momo.webp'
  },
  {
    name:'Classic Pizza',
    price:99,
    category:'pizza',
    image:'assets/products/classic-pizza.webp'
  },
  {
    name:'Paneer Pizza',
    price:129,
    category:'pizza',
    image:'assets/products/classic-pizza.webp'
  },
  {
    name:'Triple Cheese Maggi Pizza',
    price:329,
    category:'pizza',
    image:'assets/products/classic-pizza.webp'
  }
];

if(document.getElementById('searchInput')){

  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const empty = document.getElementById('emptyState');
  const chips = document.querySelectorAll('.chip');

  let currentCategory = 'all';

  function render(list){

    results.innerHTML = '';

    if(list.length === 0){
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');

    list.forEach(p => {
      results.innerHTML += `
        <a class="search-card" href="product.html">
          <img src="${p.image}">
          <div class="body">
            <h3>${p.name}</h3>
            <p>Premium Maggie Lover special</p>
            <div class="row">
              <div class="price">₹${p.price}</div>
              <div class="tag">${p.category}</div>
            </div>
          </div>
        </a>
      `;
    });
  }

  function filter(){

    const q = input.value.toLowerCase().trim();

    let list = searchProducts.filter(p =>
      p.name.toLowerCase().includes(q)
    );

    if(currentCategory !== 'all'){
      list = list.filter(p => p.category === currentCategory);
    }

    render(list);
  }

  input.addEventListener('input', filter);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {

      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      currentCategory = chip.dataset.cat;

      filter();
    });
  });

  render(products);
}
let modalType = '';

function openModal(type){

  modalType = type;

  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const input = document.getElementById('modalInput');

  if(type === 'profile'){
    title.innerText = 'Edit Profile';
    input.placeholder = 'Enter your name';
    input.value = document.getElementById('profileName').innerText;
  }

  if(type === 'address'){
    title.innerText = 'Add Address';
    input.placeholder = 'Enter full delivery address';
    input.value = '';
  }

  modal.classList.add('show');

  setTimeout(()=> input.focus(),100);
}

function closeModal(){
  document.getElementById('modal').classList.remove('show');
}

function saveModal(){

  const value = document.getElementById('modalInput').value.trim();

  if(!value) return;

  if(modalType === 'profile'){
    document.getElementById('profileName').innerText = value;
    localStorage.setItem('profileName', value);
  }

  if(modalType === 'phone'){

  let phone = value.replace(/\D/g,'');

  if(phone.length !== 10){
    alert('Please enter a valid 10-digit mobile number');
    return;
  }

  const formatted = '+91 ' + phone;

  document.getElementById('profilePhone').innerText = formatted;

  localStorage.setItem('profilePhone', formatted);
  }

  if(modalType === 'address'){
    localStorage.setItem('savedAddress', value);
    alert('Address saved successfully ✅');
  }

  closeModal();
}

window.addEventListener('load', ()=>{

  const name = localStorage.getItem('profileName');
  if(name){
    document.getElementById('profileName').innerText = name;
  }

  const phone = localStorage.getItem('profilePhone');

if(phone){
  document.getElementById('profilePhone').innerText = phone;
}
});
/* ===== PERFORMANCE FIX ===== */

// Prevent multiple event bindings
if (!window.__maggieInitialized) {
  window.__maggieInitialized = true;

  // Use event delegation for all clicks
  document.addEventListener('click', function(e){

    // Prevent double tap on navigation
    const nav = e.target.closest('.nav-item');
    if(nav){
      if(nav.classList.contains('active')){
        e.preventDefault();
        return;
      }
    }

  }, {passive:true});
}

// Stop heavy intervals when page is hidden
document.addEventListener('visibilitychange', () => {
  if(document.hidden){
    // Pause animations if needed
    document.body.classList.add('app-paused');
  }else{
    document.body.classList.remove('app-paused');
  }
});

// Keep app responsive
window.addEventListener('pageshow', () => {
  document.body.style.pointerEvents = 'auto';
});

// Emergency unfreeze
setInterval(() => {
  document.body.style.pointerEvents = 'auto';
}, 30000);
/* =========================================
   ULTRA SMOOTH 60FPS ENGINE
   ========================================= */

// Keep app responsive after idle
let lastInteraction = Date.now();

function wakeApp(){
  lastInteraction = Date.now();
  document.body.style.pointerEvents = 'auto';
}

['click','touchstart','touchend','scroll'].forEach(evt => {
  document.addEventListener(evt, wakeApp, { passive:true });
});

// Auto recover from freeze
setInterval(() => {
  if(Date.now() - lastInteraction > 2000){
    document.body.style.pointerEvents = 'auto';
  }
}, 2000);

// Fast navigation: do not disable pointer events during page navigation.
// Smooth render helper
function smoothRender(target, html){
  requestAnimationFrame(() => {
    target.innerHTML = html;
  });
}

// Prevent memory leak from repeated renders
window.addEventListener('beforeunload', () => {
  document.body.style.pointerEvents = 'auto';
});

// Restore when returning to app
document.addEventListener('visibilitychange', () => {
  if(!document.hidden){
    requestAnimationFrame(() => {
      document.body.style.pointerEvents = 'auto';
    });
  }
});

// 60FPS scroll optimization
let ticking = false;

window.addEventListener('scroll', () => {
  if(!ticking){
    requestAnimationFrame(() => {
      ticking = false;
    });
    ticking = true;
  }
}, { passive:true });
function openPhoneModal(){

  modalType = 'phone';

  document.getElementById('modalTitle').innerText = 'Change Mobile Number';

  const input = document.getElementById('modalInput');

  input.type = 'tel';
  input.placeholder = 'Enter 10-digit mobile number';

  const current = localStorage.getItem('profilePhone') || '8578878877';

  input.value = current.replace('+91 ','');

  document.getElementById('modal').classList.add('show');

  setTimeout(() => input.focus(),100);
}
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splashScreen");
  const login = document.getElementById("loginScreen");
  const home = document.getElementById("homePage");

  const user = localStorage.getItem("maggieLoverUser");

  // Splash sirf Home/Index page par — 2.5 sec intentionally preserved.
  if (splash) {
    setTimeout(() => {
      splash.classList.add("hide");
      setTimeout(() => {
        splash.style.display = "none";
        if (user) {
          if (login) login.classList.add("hidden");
          if (home) home.classList.remove("hidden");
        } else {
          if (login) login.classList.remove("hidden");
          if (home) home.classList.add("hidden");
        }
      }, 450);
    }, 2500);
  }
});
document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("loginScreen");
    const home = document.getElementById("homePage");
    const nameInput = document.getElementById("userName");
    const phoneInput = document.getElementById("userPhone");
    const emailInput = document.getElementById("userEmail");
    const createBtn = document.getElementById("createAccountBtn");
    const profileInitial = document.getElementById("profileInitial");

    // ================= SHOW LOGIN =================

    function showLogin() {

        login.classList.remove("hidden");
        home.classList.add("hidden");

    }


    // ================= SHOW HOME =================

    function showHome() {

        login.classList.add("hidden");
        home.classList.remove("hidden");

        loadUserData();

    }


    // ================= CREATE ACCOUNT =================

    createBtn.addEventListener("click", function () {

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();


        // Name validation

        if (name.length < 2) {

            alert("Please enter your name.");

            nameInput.focus();

            return;

        }


        // Phone validation

        if (!/^[0-9]{10}$/.test(phone)) {

            alert("Please enter a valid 10-digit phone number.");

            phoneInput.focus();

            return;

        }


        // Save user

        const user = {

            name: name,
            phone: phone,
            email: email

        };


        localStorage.setItem(
            "maggieLoverUser",
            JSON.stringify(user)
        );


        // Open Home

        showHome();

    });


    // ================= LOAD USER =================

    function loadUserData() {

        const savedUser =
            localStorage.getItem("maggieLoverUser");

        if (!savedUser) return;


        try {

            const user = JSON.parse(savedUser);

            if (
                user.name &&
                profileInitial
            ) {

                profileInitial.textContent =
                    user.name.charAt(0).toUpperCase();

            }

        } catch (error) {

            console.error(
                "User data error:",
                error
            );

            localStorage.removeItem(
                "maggieLoverUser"
            );

            showLogin();

        }

    }

});
/* =========================================
   ADD PRODUCT TO CART
   ========================================= */

document.addEventListener("click", function (event) {

    const button = event.target.closest(".add-to-cart-btn");

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const productId = Number(button.dataset.productId);

    if (!productId) {
        console.error("Product ID नहीं मिला");
        return;
    }

    // Product list से exact product खोजो
    const product = window.products?.find(
        p => Number(p.id) === productId
    );

    if (!product) {
        console.error("Product नहीं मिला:", productId);
        return;
    }

    // Existing cart निकालो
    let cart = JSON.parse(
        localStorage.getItem("maggieLoverCart") || "[]"
    );

    // Check करो product पहले से cart में है या नहीं
    const existingProduct = cart.find(
        item => Number(item.id) === productId
    );

    if (existingProduct) {

        // पहले से है तो quantity +1
        existingProduct.quantity =
            (existingProduct.quantity || 1) + 1;

    } else {

        // नया product
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
    }

    // Cart save करो
    localStorage.setItem(
        "maggieLoverCart",
        JSON.stringify(cart)
    );

    console.log("Cart में add हुआ:", product.name);

    // Button छोटा animation
    button.classList.add("added");

    setTimeout(() => {
        button.classList.remove("added");
    }, 250);

});