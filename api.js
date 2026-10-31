/* Maggie Lover - Supabase production API bridge
 * Uses the Supabase publishable key only. Never put a service-role/secret key here.
 */
window.SUPABASE_URL = 'https://mokoabblzmskesawmdeo.supabase.co';
window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_QYbtjH1Np2N8eRLuuoIykA_-qpxr2yy';
window.MAGGIE_API_BASE = window.SUPABASE_URL + '/rest/v1';

function supabaseHeaders(extra={}) {
  return {
    'apikey': window.SUPABASE_PUBLISHABLE_KEY,
    'Authorization': 'Bearer ' + window.SUPABASE_PUBLISHABLE_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...extra
  };
}

window.MaggieAPI = {
  async request(path, options={}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(window.MAGGIE_API_BASE.replace(/\/$/, '') + path, {
        ...options,
        headers: supabaseHeaders(options.headers || {}),
        signal: ctrl.signal
      });
      const text = await r.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch {}
      if (!r.ok) {
        const message = (data && (data.message || data.error || data.hint || data.details)) || `Supabase API ${r.status}`;
        throw new Error(message);
      }
      return data;
    } finally { clearTimeout(timer); }
  },
  get(p){ return this.request(p); },
  post(p,b){ return this.request(p,{method:'POST',headers:{'Prefer':'return=representation'},body:JSON.stringify(b)}); },
  patch(p,b){ return this.request(p,{method:'PATCH',headers:{'Prefer':'return=representation'},body:JSON.stringify(b)}); }
};

window.MaggieDB = {
  async createOrder(order) {
    const row = {
      id: order.id,
      tracking_token: order.trackingToken || order.tracking_token || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36)+Math.random().toString(36).slice(2))),
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      delivery: Number(order.delivery || 0),
      discount: Number(order.discount || 0),
      total: Number(order.total || 0),
      customer: order.customer || {},
      address: order.address || {},
      payment_method: order.paymentMethod || 'COD',
      delivery_name: order.deliveryName || '',
      delivery_phone: order.deliveryPhone || '',
      tracking_code: order.trackingCode || '',
      status: String(order.status || 'pending').toLowerCase(),
      created_at: order.createdAt || new Date().toISOString()
    };
    // return=minimal avoids requiring public SELECT permission on private customer orders.
    await MaggieAPI.request('/orders', {method:'POST', headers:{'Prefer':'return=minimal'}, body:JSON.stringify(row)});
    return row;
  },
  async getOrders() {
    const rows = await MaggieAPI.get('/orders?select=*&order=created_at.desc');
    return (rows || []).map(MaggieDB.normalizeOrder);
  },
  async getOrder(id) {
    let saved=null; try { saved=JSON.parse(localStorage.getItem('lastOrder')||'null'); } catch {}
    const token=saved && String(saved.id)===String(id) ? (saved.tracking_token||saved.trackingToken||'') : '';
    if(!token) return null;
    const row=await MaggieAPI.request('/rpc/get_order_tracking',{method:'POST',headers:{'Prefer':'return=representation'},body:JSON.stringify({p_order_id:String(id),p_tracking_token:token})});
    return MaggieDB.normalizeOrder(row);
  },
  normalizeOrder(row) {
    if (!row) return row;
    return {
      ...row,
      paymentMethod: row.paymentMethod || row.payment_method || row.payment || 'COD',
      createdAt: row.createdAt || row.created_at,
      trackingToken: row.tracking_token || row.trackingToken || '',
      status: row.status ? String(row.status).toLowerCase() : 'pending',
      deliveryName: row.delivery_name || row.deliveryName || '',
      deliveryPhone: row.delivery_phone || row.deliveryPhone || '',
      trackingCode: row.tracking_code || row.trackingCode || '',
      customer: row.customer || {},
      address: row.address || {},
      items: Array.isArray(row.items) ? row.items : []
    };
  }
};

/* ===== REAL GLOBAL CART SYSTEM ===== */
function getCart(){ return JSON.parse(localStorage.getItem('maggieCart')) || []; }
function saveCart(cart){ localStorage.setItem('maggieCart', JSON.stringify(cart)); updateCartBadge(); }
function addToCart(name,price,image){
  let cart=getCart(); const existing=cart.find(item=>item.name===name);
  if(existing) existing.qty+=1; else cart.push({name,price,image,qty:1});
  saveCart(cart);
}
function updateCartBadge(){
  const totalQty=getCart().reduce((sum,item)=>sum+Number(item.qty||1),0);
  document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=totalQty;el.style.display=totalQty>0?'flex':'none';});
}
function changeQty(index,change){
  let cart=getCart(); if(!cart[index]) return; cart[index].qty+=change;
  if(cart[index].qty<=0) cart.splice(index,1); saveCart(cart);
  if(typeof renderCart==='function') renderCart();
}
function removeItem(index){let cart=getCart();cart.splice(index,1);saveCart(cart);if(typeof renderCart==='function')renderCart();}
document.addEventListener('DOMContentLoaded',updateCartBadge);
function buyNow(name,price,image){localStorage.setItem('maggieCart',JSON.stringify([{name,price,image,qty:1}]));window.location.href='checkout.html';}
