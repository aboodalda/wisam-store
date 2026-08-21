const DEFAULT_PRODUCTS=[
  {id:1,name:"هاتف ذكي",brand:"عام",category:"phones",subcategory:"iphone",price:1299,description:"أداء قوي وتصميم أنيق",battery:"5000 mAh",storage:"128GB",screen:"6.6 بوصة",icon:"📱"},
  {id:2,name:"ساعة ذكية",brand:"Apple",category:"watches",subcategory:"apple-watch",price:499,description:"أناقة وتقنية في معصمك",battery:"",storage:"",screen:"",icon:"⌚"},
  {id:3,name:"سماعات لاسلكية",brand:"عام",category:"phones",subcategory:"other",price:299,description:"صوت نقي وتجربة مريحة",battery:"",storage:"",screen:"",icon:"🎧"},
  {id:4,name:"جهاز ألعاب",brand:"PlayStation",category:"playstation",subcategory:"ps5",price:1899,description:"تجربة ألعاب احترافية",battery:"",storage:"1TB",screen:"",icon:"🎮"}
];

const CATEGORY_NAMES={phones:"الجوالات",watches:"الساعات",playstation:"PlayStation"};

function getProducts(){
  try{
    const saved=JSON.parse(localStorage.getItem("wisamProducts"));
    if(Array.isArray(saved)&&saved.length) return saved;
  }catch(e){}
  localStorage.setItem("wisamProducts",JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}
function saveProducts(products){
  localStorage.setItem("wisamProducts",JSON.stringify(products));
  render();
}
function esc(s){
  return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function money(n){return Number(n||0).toLocaleString("ar-SA")+" ر.س"}
function showToast(text){
  const t=document.getElementById("toast");
  t.textContent=text;t.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>t.classList.remove("show"),1800);
}
function subcategoryName(p){
  const names={
    iphone:"iPhone",samsung:"Samsung",huawei:"Huawei",redmi:"Redmi",xiaomi:"Xiaomi",
    "apple-watch":"Apple Watch","samsung-watch":"Samsung Watch","huawei-watch":"Huawei Watch",
    ps5:"PlayStation 5",ps4:"PlayStation 4",ps3:"PlayStation 3"
  };
  return names[p.subcategory]||p.brand||CATEGORY_NAMES[p.category]||"منتج";
}
function render(){
  const products=getProducts();
  document.getElementById("totalProducts").textContent=products.length;
  document.getElementById("phoneCount").textContent=products.filter(p=>p.category==="phones").length;
  document.getElementById("watchCount").textContent=products.filter(p=>p.category==="watches").length;
  document.getElementById("playstationCount").textContent=products.filter(p=>p.category==="playstation").length;

  const q=(document.getElementById("searchProducts").value||"").trim().toLowerCase();
  const filter=document.getElementById("filterCategory").value;
  const list=products.filter(p=>{
    const matchesCategory=filter==="all"||p.category===filter;
    const text=`${p.name||""} ${p.brand||""} ${p.description||""}`.toLowerCase();
    return matchesCategory&&text.includes(q);
  });

  document.getElementById("ownerProducts").innerHTML=list.length?list.map(p=>`
    <article class="product-card">
      <div class="product-card-image">
        ${p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:`<span class="icon">${esc(p.icon||"📦")}</span>`}
      </div>
      <div class="product-card-info">
        <span class="tag">${esc(CATEGORY_NAMES[p.category]||"منتج")} · ${esc(subcategoryName(p))}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description||"بدون وصف")}</p>
        <span class="product-price">${money(p.price)}</span>
        <div class="product-actions">
          <button onclick="editProduct(${p.id})">تعديل</button>
          <button class="delete" onclick="deleteProduct(${p.id})">حذف</button>
        </div>
      </div>
    </article>`).join(""):`<div class="empty">لا توجد منتجات مطابقة للبحث.</div>`;
}
function resetForm(){
  document.getElementById("productForm").reset();
  document.getElementById("editId").value="";
  document.getElementById("formTitle").textContent="إضافة منتج جديد";
  currentImage="";
  setImagePreview("");
  updateSubcategories();
}
let currentImage="";
function setImagePreview(src){
  const preview=document.getElementById("imagePreview");
  const area=document.getElementById("uploadArea");
  const remove=document.getElementById("removeImage");
  preview.src=src||"";
  area.classList.toggle("has-image",!!src);
  remove.classList.toggle("show",!!src);
}
function editProduct(id){
  const p=getProducts().find(x=>x.id==id);if(!p)return;
  document.getElementById("editId").value=p.id;
  document.getElementById("name").value=p.name||"";
  document.getElementById("brand").value=p.brand||"";
  document.getElementById("category").value=p.category||"phones";
  updateSubcategories();
  document.getElementById("subcategory").value=p.subcategory||"";
  document.getElementById("price").value=p.price||0;
  document.getElementById("battery").value=p.battery||"";
  document.getElementById("storage").value=p.storage||"";
  document.getElementById("screen").value=p.screen||"";
  document.getElementById("description").value=p.description||"";
  currentImage=p.image||"";
  setImagePreview(currentImage);
  document.getElementById("formTitle").textContent="تعديل المنتج";
  document.getElementById("add").scrollIntoView({behavior:"smooth"});
}
function deleteProduct(id){
  const p=getProducts().find(x=>x.id==id);
  if(!p||!confirm(`حذف "${p.name}" من المتجر؟`))return;
  saveProducts(getProducts().filter(x=>x.id!=id));
  showToast("تم حذف المنتج");
}
function updateSubcategories(){
  const category=document.getElementById("category").value;
  const select=document.getElementById("subcategory");
  const groups={
    phones:[["iphone","iPhone"],["samsung","Samsung"],["huawei","Huawei"],["redmi","Redmi"],["xiaomi","Xiaomi"]],
    watches:[["apple-watch","Apple Watch"],["samsung-watch","Samsung Watch"],["huawei-watch","Huawei Watch"]],
    playstation:[["ps5","PlayStation 5"],["ps4","PlayStation 4"],["ps3","PlayStation 3"]]
  };
  select.innerHTML=(groups[category]||[]).map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("");
}
document.getElementById("category").addEventListener("change",updateSubcategories);
document.getElementById("searchProducts").addEventListener("input",render);
document.getElementById("filterCategory").addEventListener("change",render);
document.getElementById("goAdd").addEventListener("click",()=>{
  resetForm();
  document.getElementById("add").scrollIntoView({behavior:"smooth"});
});
document.getElementById("cancelEdit").addEventListener("click",()=>{
  resetForm();
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
});
document.getElementById("imageFile").addEventListener("change",e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size>4*1024*1024){alert("الصورة أكبر من 4MB. اختر صورة أصغر.");e.target.value="";return;}
  const reader=new FileReader();
  reader.onload=()=>{currentImage=reader.result;setImagePreview(currentImage)};
  reader.readAsDataURL(file);
});
document.getElementById("removeImage").addEventListener("click",()=>{
  currentImage="";document.getElementById("imageFile").value="";setImagePreview("");
});
document.getElementById("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=document.getElementById("editId").value;
  const product={
    id:id?Number(id):Date.now(),
    name:document.getElementById("name").value.trim(),
    brand:document.getElementById("brand").value.trim(),
    category:document.getElementById("category").value,
    subcategory:document.getElementById("subcategory").value,
    price:Number(document.getElementById("price").value),
    battery:document.getElementById("battery").value.trim(),
    storage:document.getElementById("storage").value.trim(),
    screen:document.getElementById("screen").value.trim(),
    description:document.getElementById("description").value.trim(),
    image:currentImage,
    icon:document.getElementById("category").value==="phones"?"📱":document.getElementById("category").value==="watches"?"⌚":"🎮"
  };
  if(!product.name||product.price<0)return;
  const products=getProducts();
  if(id){
    const index=products.findIndex(p=>p.id==id);
    if(index>-1)products[index]=product;
    showToast("تم تحديث المنتج");
  }else{
    products.push(product);
    showToast("تمت إضافة المنتج");
  }
  saveProducts(products);
  resetForm();
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
});
updateSubcategories();
render();
