const products=[
{id:1,cat:"phones",brand:"Apple",name:"iPhone 16 Pro Max",price:4999,img:"https://images.unsplash.com/photo-1592286927505-2fd0b4f6b2c0?auto=format&fit=crop&w=700&q=85",spec:["6.9\"","4685mAh","256GB"]},
{id:2,cat:"phones",brand:"Samsung",name:"Galaxy S25 Ultra",price:4299,img:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=85",spec:["6.9\"","5000mAh","256GB"]},
{id:3,cat:"phones",brand:"Xiaomi",name:"Xiaomi 15 Ultra",price:3299,img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85",spec:["6.73\"","5410mAh","512GB"]},
{id:4,cat:"phones",brand:"Huawei",name:"Huawei Pura 70 Pro",price:2799,img:"https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=700&q=85",spec:["6.8\"","5050mAh","256GB"]},
{id:5,cat:"phones",brand:"Redmi",name:"Redmi Note 14 Pro+",price:1599,img:"https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=85",spec:["6.67\"","5110mAh","256GB"]},
{id:6,cat:"watches",brand:"Apple",name:"Apple Watch Series 10",price:1699,img:"https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=700&q=85",spec:["46mm","18h","GPS"]},
{id:7,cat:"watches",brand:"Samsung",name:"Galaxy Watch Ultra",price:1899,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",spec:["47mm","590mAh","GPS"]},
{id:8,cat:"watches",brand:"Huawei",name:"Huawei Watch GT 5",price:999,img:"https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=85",spec:["46mm","14 يوم","GPS"]},
{id:9,cat:"playstation",brand:"Sony",name:"PlayStation 5 Slim",price:2299,img:"https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=85",spec:["1TB","4K","SSD"]},
{id:10,cat:"playstation",brand:"Sony",name:"PlayStation 5 Pro",price:3299,img:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=700&q=85",spec:["2TB","8K","SSD"]},
{id:11,cat:"playstation",brand:"Sony",name:"PlayStation 4 Pro",price:1299,img:"https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=700&q=85",spec:["1TB","4K","HDR"]},
{id:12,cat:"playstation",brand:"Sony",name:"PlayStation 3",price:699,img:"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=700&q=85",spec:["500GB","1080p","Wi‑Fi"]}
];
let cart=JSON.parse(localStorage.getItem("wisamCart")||"[]");
const grid=document.getElementById("productsGrid"),count=document.getElementById("cartCount"),total=document.getElementById("cartTotal"),items=document.getElementById("cartItems");
function money(n){return n.toLocaleString("ar-SA")+" ر.س"}
function render(filter="all"){
 const list=filter==="all"?products:products.filter(p=>p.cat===filter);
 document.getElementById("resultCount").textContent=list.length+" منتجات";
 grid.innerHTML=list.map(p=>`<article class="product"><span class="tag">${p.brand}</span><div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div><div class="product-info"><small>${p.brand}</small><h3>${p.name}</h3><div class="specs">${p.spec.map(s=>`<span>• ${s}</span>`).join("")}</div><div class="price"><b>${money(p.price)}</b><button class="add" onclick="addToCart(${p.id})">+ أضف</button></div></div></article>`).join("");
}
function save(){localStorage.setItem("wisamCart",JSON.stringify(cart));renderCart()}
function addToCart(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();openCart()}
function change(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function renderCart(){
 count.textContent=cart.reduce((a,i)=>a+i.qty,0);
 const sum=cart.reduce((a,i)=>a+i.qty*products.find(p=>p.id===i.id).price,0);total.textContent=money(sum);
 if(!cart.length){items.innerHTML='<div class="empty">السلة فارغة حاليًا 🛒</div>';return}
 items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><img src="${p.img}"><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button onclick="change(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="change(${p.id},1)">+</button></div></div></div>`}).join("");
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.querySelectorAll(".category").forEach(b=>b.onclick=()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.filter)});
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkout").onclick=()=>{if(!cart.length)return alert("أضف منتجًا إلى السلة أولًا");document.getElementById("orderModal").classList.add("show");closeCart()};
document.getElementById("closeModal").onclick=()=>document.getElementById("orderModal").classList.remove("show");
document.getElementById("orderForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);let lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} × ${i.qty} = ${money(p.price*i.qty)}`}).join("%0A");const sum=cart.reduce((a,i)=>a+i.qty*products.find(p=>p.id===i.id).price,0);const msg=`مرحباً وسام ستور 👋%0Aأريد تأكيد الطلب:%0A%0A${lines}%0A%0Aالإجمالي: ${money(sum)}%0Aالاسم: ${f.get("name")}%0Aرقم الجوال: ${f.get("phone")}%0Aطريقة الدفع: ${f.get("payment")}`;window.open("https://wa.me/?text="+msg,"_blank")};
render();renderCart();