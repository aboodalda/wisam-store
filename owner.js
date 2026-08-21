const defaultProducts=[
{id:1,name:"هاتف ذكي",price:1299,description:"أداء قوي وتصميم أنيق",icon:"📱"},
{id:2,name:"ساعة ذكية",price:499,description:"أناقة وتقنية في معصمك",icon:"⌚"},
{id:3,name:"سماعات لاسلكية",price:299,description:"صوت نقي وتجربة مريحة",icon:"🎧"},
{id:4,name:"جهاز ألعاب",price:1899,description:"تجربة ألعاب احترافية",icon:"🎮"}
];
function getProducts(){try{const x=JSON.parse(localStorage.getItem("wisamProducts"));return Array.isArray(x)&&x.length?x:defaultProducts}catch(e){return defaultProducts}}
function saveProducts(x){localStorage.setItem("wisamProducts",JSON.stringify(x));render()}
function render(){
 const products=getProducts();
 document.getElementById("totalProducts").textContent=products.length;
 document.getElementById("ownerProducts").innerHTML=products.map(p=>`
 <div class="product-row"><div><b>${esc(p.name)}</b><br><small>${Number(p.price).toLocaleString()} ر.س</small></div>
 <button onclick="deleteProduct(${p.id})">حذف</button></div>`).join("");
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function deleteProduct(id){if(!confirm("هل تريد حذف هذا المنتج؟"))return;saveProducts(getProducts().filter(p=>p.id!=id))}
document.getElementById("productForm").addEventListener("submit",e=>{
 e.preventDefault();
 const products=getProducts();
 products.push({
  id:Date.now(),
  name:document.getElementById("name").value.trim(),
  price:Number(document.getElementById("price").value),
  description:document.getElementById("description").value.trim(),
  icon:document.getElementById("icon").value.trim()||"📦",
  image:document.getElementById("image").value.trim()
 });
 saveProducts(products);e.target.reset();alert("تم حفظ المنتج بنجاح");window.location.hash="products";
});
render();
