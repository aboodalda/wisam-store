const defaultProducts=[
  {id:1,name:"هاتف ذكي",brand:"عام",category:"phones",subcategory:"iphone",price:1299,description:"أداء قوي وتصميم أنيق",battery:"5000 mAh",storage:"128GB",screen:"6.6 بوصة",icon:"📱"},
  {id:2,name:"ساعة ذكية",brand:"Apple",category:"watches",subcategory:"apple-watch",price:499,description:"أناقة وتقنية في معصمك",icon:"⌚"},
  {id:3,name:"سماعات لاسلكية",brand:"عام",category:"phones",subcategory:"other",price:299,description:"صوت نقي وتجربة مريحة",icon:"🎧"},
  {id:4,name:"جهاز ألعاب",brand:"PlayStation",category:"playstation",subcategory:"ps5",price:1899,description:"تجربة ألعاب احترافية",storage:"1TB",icon:"🎮"}
];

const categoryNames={phones:"الجوالات",watches:"الساعات",playstation:"PlayStation"};
const subcategoryNames={
  iphone:"iPhone",samsung:"Samsung",huawei:"Huawei",redmi:"Redmi",xiaomi:"Xiaomi",
  "apple-watch":"Apple Watch","samsung-watch":"Samsung Watch","huawei-watch":"Huawei Watch",
  ps5:"PlayStation 5",ps4:"PlayStation 4",ps3:"PlayStation 3"
};

function getProducts(){
  try{
    const saved=JSON.parse(localStorage.getItem("wisamProducts"));
    return Array.isArray(saved)&&saved.length?saved:defaultProducts;
  }catch(e){return defaultProducts}
}
let cart=JSON.parse(localStorage.getItem("wisamCart")||"[]");

function escapeHtml(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function money(n){return Number(n||0).toLocaleString("ar-SA")+" ر.س"}
function subName(p){return subcategoryNames[p.subcategory]||p.brand||categoryNames[p.category]||"منتج"}

function renderProducts(){
  const grid=document.getElementById("productGrid");
  const products=getProducts();
  grid.innerHTML=products.map((p,index)=>`
    <article class="product-card" style="animation-delay:${Math.min(index*60,400)}ms" onclick="openProduct(${p.id})">
      <div class="product-image">
        ${p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}">`:escapeHtml(p.icon||"📦")}
      </div>
      <div class="product-info">
        <div class="product-meta">${escapeHtml(categoryNames[p.category]||"منتج")} · ${escapeHtml(subName(p))}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description||"منتج مميز من وسام ستور")}</p>
        <div class="product-specs">
          ${p.battery?`<span class="spec-pill">🔋 ${escapeHtml(p.battery)}</span>`:""}
          ${p.storage?`<span class="spec-pill">💾 ${escapeHtml(p.storage)}</span>`:""}
          ${p.screen?`<span class="spec-pill">📱 ${escapeHtml(p.screen)}</span>`:""}
        </div>
        <span class="price">${money(p.price)}</span>
        <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">أضف إلى السلة</button>
        <button class="details-btn" onclick="event.stopPropagation();openProduct(${p.id})">عرض التفاصيل</button>
      </div>
    </article>`).join("");
}

function openProduct(id){
  const p=getProducts().find(x=>x.id==id);if(!p)return;
  document.getElementById("productDetails").innerHTML=`
    <div class="detail-layout">
      <div class="detail-image">
        ${p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}">`:`<span class="detail-icon">${escapeHtml(p.icon||"📦")}</span>`}
      </div>
      <div class="detail-content">
        <span class="eyebrow">${escapeHtml(categoryNames[p.category]||"WISAM STORE")}</span>
        <h2>${escapeHtml(p.name)}</h2>
        <div class="detail-brand">${escapeHtml(p.brand||subName(p))}</div>
        <div class="detail-price">${money(p.price)}</div>
        <p class="detail-description">${escapeHtml(p.description||"منتج مميز من وسام ستور.")}</p>
        <div class="spec-grid">
          <div class="spec-item"><small>الفئة</small><strong>${escapeHtml(subName(p))}</strong></div>
          ${p.battery?`<div class="spec-item"><small>البطارية</small><strong>${escapeHtml(p.battery)}</strong></div>`:""}
          ${p.storage?`<div class="spec-item"><small>التخزين</small><strong>${escapeHtml(p.storage)}</strong></div>`:""}
          ${p.screen?`<div class="spec-item"><small>الشاشة</small><strong>${escapeHtml(p.screen)}</strong></div>`:""}
        </div>
        <button class="primary-btn" style="width:100%;margin-top:5px" onclick="addToCart(${p.id});closeProduct()">أضف إلى السلة 🛒</button>
      </div>
    </div>`;
  document.getElementById("productModal").classList.add("show");
  document.body.style.overflow="hidden";
}
function closeProduct(){
  document.getElementById("productModal").classList.remove("show");
  document.body.style.overflow="";
}

function addToCart(id){
  const p=getProducts().find(x=>x.id==id);if(!p)return;
  const item=cart.find(x=>x.id==id);
  if(item)item.qty++;else cart.push({id:p.id,name:p.name,price:Number(p.price)||0,qty:1});
  saveCart();openCart();
}
function saveCart(){localStorage.setItem("wisamCart",JSON.stringify(cart));renderCart()}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById("cartItems");
  box.innerHTML=cart.length?cart.map(x=>`
    <div class="cart-row">
      <div><b>${escapeHtml(x.name)}</b><br>${money(x.price)}</div>
      <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button>${x.qty}<button onclick="changeQty(${x.id},1)">+</button></div>
    </div>`).join(""):"<p style='text-align:center;color:#999'>السلة فارغة</p>";
  document.getElementById("cartTotal").textContent=cart.reduce((s,x)=>s+x.price*x.qty,0).toLocaleString("ar-SA");
}
function changeQty(id,n){
  const x=cart.find(i=>i.id==id);if(!x)return;
  x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!=id);
  saveCart();
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}

document.getElementById("cartButton").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("closeProductModal").onclick=closeProduct;
document.getElementById("productModal").addEventListener("click",e=>{if(e.target.id==="productModal")closeProduct()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProduct();closeCart()}});

function openCheckout(){
  if(!cart.length){alert("السلة فارغة.");return}
  document.getElementById("checkoutTotal").textContent=cart.reduce((s,x)=>s+x.price*x.qty,0).toLocaleString("ar-SA")+" ر.س";
  document.getElementById("checkoutModal").classList.add("show");
  document.body.style.overflow="hidden";
  closeCart();
}
function closeCheckout(){
  document.getElementById("checkoutModal").classList.remove("show");
  document.body.style.overflow="";
}
function closeSuccess(){
  document.getElementById("orderSuccessModal").classList.remove("show");
  document.body.style.overflow="";
}
document.getElementById("checkoutButton").onclick=openCheckout;
document.getElementById("closeCheckout").onclick=closeCheckout;
document.getElementById("closeSuccess").onclick=closeSuccess;
document.getElementById("checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")closeCheckout()});
document.getElementById("orderSuccessModal").addEventListener("click",e=>{if(e.target.id==="orderSuccessModal")closeSuccess()});

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!cart.length){closeCheckout();return}
  const payment=document.querySelector('input[name="payment"]:checked')?.value||"cod";
  const order={
    id:"WS-"+Date.now().toString().slice(-8),
    customer:{
      name:document.getElementById("customerName").value.trim(),
      phone:document.getElementById("customerPhone").value.trim(),
      city:document.getElementById("customerCity").value.trim(),
      address:document.getElementById("customerAddress").value.trim()
    },
    payment,
    items:cart.map(x=>({...x})),
    total:cart.reduce((s,x)=>s+x.price*x.qty,0),
    status:"new",
    createdAt:new Date().toISOString()
  };
  const orders=JSON.parse(localStorage.getItem("wisamOrders")||"[]");
  orders.unshift(order);
  localStorage.setItem("wisamOrders",JSON.stringify(orders));
  cart=[];
  saveCart();
  e.target.reset();
  closeCheckout();
  document.getElementById("orderNumber").textContent=order.id;
  document.getElementById("orderSuccessModal").classList.add("show");
  document.body.style.overflow="hidden";
});

renderProducts();
renderCart();
