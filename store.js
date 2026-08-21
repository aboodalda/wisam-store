const defaultProducts = [
  {id:1,name:"هاتف ذكي",price:1299,description:"أداء قوي وتصميم أنيق",icon:"📱"},
  {id:2,name:"ساعة ذكية",price:499,description:"أناقة وتقنية في معصمك",icon:"⌚"},
  {id:3,name:"سماعات لاسلكية",price:299,description:"صوت نقي وتجربة مريحة",icon:"🎧"},
  {id:4,name:"جهاز ألعاب",price:1899,description:"تجربة ألعاب احترافية",icon:"🎮"}
];

function getProducts(){
  try{
    const saved=JSON.parse(localStorage.getItem("wisamProducts"));
    return Array.isArray(saved)&&saved.length ? saved : defaultProducts;
  }catch(e){return defaultProducts}
}
let cart=JSON.parse(localStorage.getItem("wisamCart")||"[]");

function renderProducts(){
  const grid=document.getElementById("productGrid");
  grid.innerHTML=getProducts().map(p=>`
    <article class="product-card">
      <div class="product-image">${p.image ? `<img src="${p.image}" alt="${p.name}" style="max-width:85%;max-height:85%;object-fit:contain">` : p.icon||"📦"}</div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description||"منتج مميز من وسام ستور")}</p>
        <span class="price">${Number(p.price||0).toLocaleString("ar-SA")} ر.س</span>
        <button class="add-btn" onclick="addToCart(${p.id})">أضف إلى السلة</button>
      </div>
    </article>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function addToCart(id){
  const p=getProducts().find(x=>x.id==id); if(!p)return;
  const item=cart.find(x=>x.id==id);
  if(item)item.qty++;else cart.push({id:p.id,name:p.name,price:Number(p.price)||0,qty:1});
  saveCart();openCart();
}
function saveCart(){localStorage.setItem("wisamCart",JSON.stringify(cart));renderCart()}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const box=document.getElementById("cartItems");
  box.innerHTML=cart.length?cart.map(x=>`
    <div class="cart-row"><div><b>${escapeHtml(x.name)}</b><br>${x.price.toLocaleString()} ر.س</div>
    <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button>${x.qty}<button onclick="changeQty(${x.id},1)">+</button></div></div>`).join(""):"<p style='text-align:center;color:#999'>السلة فارغة</p>";
  document.getElementById("cartTotal").textContent=cart.reduce((s,x)=>s+x.price*x.qty,0).toLocaleString();
}
function changeQty(id,n){const x=cart.find(i=>i.id==id);if(!x)return;x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!=id);saveCart()}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.getElementById("cartButton").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkoutButton").onclick=()=>alert(cart.length?"سيتم ربط الدفع والطلبات في الخطوة التالية.":"السلة فارغة.");
renderProducts();renderCart();
