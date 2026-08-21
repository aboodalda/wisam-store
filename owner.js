const defaultProducts = [
  {
    id:1,
    name:"هاتف ذكي",
    brand:"عام",
    category:"phones",
    subcategory:"iphone",
    price:1299,
    description:"أداء قوي وتصميم أنيق",
    battery:"5000 mAh",
    storage:"128GB",
    screen:"6.6 بوصة",
    icon:"📱"
  },
  {
    id:2,
    name:"ساعة ذكية",
    brand:"Apple",
    category:"watches",
    subcategory:"apple-watch",
    price:499,
    description:"أناقة وتقنية في معصمك",
    icon:"⌚"
  },
  {
    id:3,
    name:"سماعات لاسلكية",
    brand:"عام",
    category:"headphones",
    subcategory:"other",
    price:299,
    description:"صوت نقي وتجربة مريحة",
    icon:"🎧"
  },
  {
    id:4,
    name:"جهاز ألعاب",
    brand:"PlayStation",
    category:"playstation",
    subcategory:"ps5",
    price:1899,
    description:"تجربة ألعاب احترافية",
    storage:"1TB",
    icon:"🎮"
  }
];


let currentFilter = "all";


const categoryNames = {
  phones:"الجوالات",
  watches:"الساعات",
  playstation:"PlayStation",
  headphones:"السماعات",
  other:"أخرى"
};


const subcategoryNames = {
  iphone:"iPhone",
  samsung:"Samsung",
  huawei:"Huawei",
  redmi:"Redmi",
  xiaomi:"Xiaomi",

  "apple-watch":"Apple Watch",
  "samsung-watch":"Samsung Watch",
  "huawei-watch":"Huawei Watch",

  ps5:"PlayStation 5",
  ps4:"PlayStation 4",
  ps3:"PlayStation 3",

  other:"أخرى"
};


/* =========================
   STORAGE
========================= */

function getProducts(){

  try{

    const x = JSON.parse(
      localStorage.getItem("wisamProducts")
    );

    if(Array.isArray(x) && x.length){
      return x;
    }

    return defaultProducts;

  }catch(e){

    return defaultProducts;

  }

}


function saveProducts(products){

  localStorage.setItem(
    "wisamProducts",
    JSON.stringify(products)
  );

  render();

}


function getOrders(){

  try{

    const x = JSON.parse(
      localStorage.getItem("wisamOrders")
    );

    return Array.isArray(x) ? x : [];

  }catch(e){

    return [];

  }

}


function saveOrders(orders){

  localStorage.setItem(
    "wisamOrders",
    JSON.stringify(orders)
  );

}


/* =========================
   HELPERS
========================= */

function esc(value){

  return String(value ?? "")
    .replace(/[&<>"']/g, m => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[m]));

}


function money(value){

  return Number(value || 0)
    .toLocaleString("ar-SA") + " ر.س";

}


function formatDate(date){

  try{

    return new Date(date).toLocaleString(
      "ar-SA",
      {
        dateStyle:"medium",
        timeStyle:"short"
      }
    );

  }catch(e){

    return "";

  }

}


function statusText(status){

  return {
    new:"جديد",
    processing:"قيد التجهيز",
    delivered:"تم التسليم",
    cancelled:"ملغى"
  }[status] || "جديد";

}


function getCategoryName(category){

  return categoryNames[category] || "منتج";

}


function getSubcategoryName(subcategory){

  return subcategoryNames[subcategory] || "أخرى";

}


/* =========================
   MAIN RENDER
========================= */

function render(){

  const products = getProducts();

  document.getElementById(
    "totalProducts"
  ).textContent = products.length;


  renderProducts();

  renderOrders();

}


/* =========================
   PRODUCTS
========================= */

function renderProducts(){

  const products = getProducts();

  const box = document.getElementById(
    "ownerProducts"
  );


  if(!products.length){

    box.innerHTML = `
      <div class="empty-orders">
        <strong>لا توجد منتجات</strong>
        <span>أضف أول منتج إلى متجرك.</span>
      </div>
    `;

    return;

  }


  box.innerHTML = products.map(p => {

    const image = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">`
      : esc(p.icon || "📦");


    return `

      <div class="product-row">

        <div class="product-left">

          <div class="product-thumb">
            ${image}
          </div>

          <div>

            <div class="product-name">
              ${esc(p.name)}
            </div>

            <div class="product-meta">

              ${esc(getCategoryName(p.category))}

              ${p.subcategory
                ? " · " + esc(getSubcategoryName(p.subcategory))
                : ""}

              ${p.brand
                ? " · " + esc(p.brand)
                : ""}

              · ${money(p.price)}

            </div>

          </div>

        </div>


        <div class="product-actions">

          <button
            class="edit-btn"
            onclick="editProduct(${p.id})"
          >
            ✏️ تعديل
          </button>

          <button
            class="delete-btn"
            onclick="deleteProduct(${p.id})"
          >
            🗑️ حذف
          </button>

        </div>

      </div>

    `;

  }).join("");

}


/* =========================
   ADD / EDIT PRODUCT
========================= */

document
  .getElementById("productForm")
  .addEventListener("submit", function(e){

    e.preventDefault();


    const products = getProducts();

    const editId =
      document.getElementById("editId").value;


    const product = {

      id: editId
        ? Number(editId)
        : Date.now(),

      name:
        document.getElementById("name")
        .value.trim(),

      price:
        Number(
          document.getElementById("price").value
        ),

      category:
        document.getElementById("category").value,

      brand:
        document.getElementById("brand").value,

      subcategory:
        document.getElementById("subcategory").value,

      description:
        document.getElementById("description")
        .value.trim(),

      battery:
        document.getElementById("battery")
        .value.trim(),

      storage:
        document.getElementById("storage")
        .value.trim(),

      screen:
        document.getElementById("screen")
        .value.trim(),

      icon:
        document.getElementById("icon")
        .value.trim() || "📦",

      image:
        document.getElementById("image")
        .value.trim()

    };


    if(editId){

      const index = products.findIndex(
        p => p.id == editId
      );

      if(index !== -1){

        products[index] = product;

      }

    }else{

      products.push(product);

    }


    saveProducts(products);

    this.reset();

    document.getElementById(
      "editId"
    ).value = "";


    document.getElementById(
      "formTitle"
    ).textContent = "إضافة منتج جديد";


    document.getElementById(
      "saveButton"
    ).textContent = "حفظ المنتج";


    document.getElementById(
      "cancelEdit"
    ).classList.remove("show");


    clearImagePreview();


    alert(
      editId
        ? "تم تعديل المنتج بنجاح ✅"
        : "تم إضافة المنتج بنجاح ✅"
    );


    document
      .getElementById("products")
      .scrollIntoView({
        behavior:"smooth"
      });

});


/* =========================
   EDIT PRODUCT
========================= */

function editProduct(id){

  const product = getProducts()
    .find(p => p.id == id);


  if(!product) return;


  document.getElementById("editId").value =
    product.id;


  document.getElementById("name").value =
    product.name || "";


  document.getElementById("price").value =
    product.price || "";


  document.getElementById("category").value =
    product.category || "";


  document.getElementById("brand").value =
    product.brand || "";


  document.getElementById("subcategory").value =
    product.subcategory || "";


  document.getElementById("description").value =
    product.description || "";


  document.getElementById("battery").value =
    product.battery || "";


  document.getElementById("storage").value =
    product.storage || "";


  document.getElementById("screen").value =
    product.screen || "";


  document.getElementById("icon").value =
    product.icon || "";


  document.getElementById("image").value =
    product.image || "";


  document.getElementById(
    "formTitle"
  ).textContent = "تعديل المنتج";


  document.getElementById(
    "saveButton"
  ).textContent = "حفظ التعديلات";


  document.getElementById(
    "cancelEdit"
  ).classList.add("show");


  updateImagePreview();


  document
    .getElementById("add")
    .scrollIntoView({
      behavior:"smooth"
    });

}


/* =========================
   CANCEL EDIT
========================= */

function cancelEdit(){

  document
    .getElementById("productForm")
    .reset();


  document.getElementById(
    "editId"
  ).value = "";


  document.getElementById(
    "formTitle"
  ).textContent = "إضافة منتج جديد";


  document.getElementById(
    "saveButton"
  ).textContent = "حفظ المنتج";


  document.getElementById(
    "cancelEdit"
  ).classList.remove("show");


  clearImagePreview();

}


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id){

  const product = getProducts()
    .find(p => p.id == id);


  if(!product) return;


  const confirmed = confirm(
    `هل تريد حذف "${product.name}"؟`
  );


  if(!confirmed) return;


  const products = getProducts()
    .filter(p => p.id != id);


  saveProducts(products);

}


/* =========================
   IMAGE PREVIEW
========================= */

function updateImagePreview(){

  const url =
    document.getElementById("image")
    .value.trim();


  const preview =
    document.getElementById("imagePreview");


  if(!url){

    clearImagePreview();

    return;

  }


  preview.innerHTML = `
    <img
      src="${esc(url)}"
      alt="معاينة المنتج"
      onerror="this.parentElement.innerHTML='<span>تعذر تحميل الصورة</span>'"
    >
  `;

}


function clearImagePreview(){

  document.getElementById(
    "imagePreview"
  ).innerHTML =
    "<span>معاينة الصورة ستظهر هنا</span>";

}


document
  .getElementById("image")
  .addEventListener(
    "input",
    updateImagePreview
  );


/* =========================
   ORDERS
========================= */

function renderOrders(){

  const orders = getOrders();


  const newCount = orders.filter(
    o => o.status === "new"
  ).length;


  document.getElementById(
    "totalOrders"
  ).textContent = orders.length;


  document.getElementById(
    "navOrderCount"
  ).textContent = newCount;


  const sales = orders
    .filter(o => o.status !== "cancelled")
    .reduce(
      (sum,o) =>
        sum + Number(o.total || 0),
      0
    );


  document.getElementById(
    "totalSales"
  ).textContent = money(sales);


  const filtered =
    currentFilter === "all"
      ? orders
      : orders.filter(
          o => o.status === currentFilter
        );


  const box =
    document.getElementById("ordersList");


  if(!filtered.length){

    box.innerHTML = `
      <div class="empty-orders">

        <strong>
          لا توجد طلبات هنا
        </strong>

        <span>
          عندما يرسل الزبائن طلباتهم
          ستظهر في هذا القسم.
        </span>

      </div>
    `;

    return;

  }


  box.innerHTML = filtered.map(o => {

    const pieces =
      (o.items || [])
      .reduce(
        (sum,x) =>
          sum + Number(x.qty || 0),
        0
      );


    return `

      <div class="order-card">

        <div>

          <div class="order-number">
            ${esc(o.id)}
          </div>

          <div class="order-customer">
            👤 ${esc(o.customer?.name || "بدون اسم")}
          </div>

          <div class="order-customer">
            📱 ${esc(o.customer?.phone || "")}
          </div>

          <div class="order-date">
            ${formatDate(o.createdAt)}
          </div>

        </div>


        <div>

          <span class="status status-${esc(o.status || "new")}">
            ${statusText(o.status)}
          </span>

          <div class="order-customer">
            ${pieces} قطعة ·
            ${o.payment === "online"
              ? "💳 إلكتروني"
              : "💵 عند الاستلام"}
          </div>

        </div>


        <div>

          <div class="order-total">
            ${money(o.total)}
          </div>

          <div class="order-actions">

            <button
              onclick="openOrder('${esc(o.id)}')"
            >
              التفاصيل
            </button>

            <button
              onclick="quickStatus('${esc(o.id)}')"
            >
              تغيير الحالة
            </button>

          </div>

        </div>

      </div>

    `;

  }).join("");

}


function filterOrders(filter,button){

  currentFilter = filter;


  document
    .querySelectorAll(".filter")
    .forEach(
      x => x.classList.remove("active")
    );


  if(button){

    button.classList.add("active");

  }


  renderOrders();

}


/* =========================
   UPDATE ORDER
========================= */

function updateOrder(id,status){

  const orders = getOrders();

  const order =
    orders.find(
      x => x.id === id
    );


  if(!order) return;


  order.status = status;


  saveOrders(orders);

  renderOrders();

  openOrder(id);

}


function quickStatus(id){

  const order =
    getOrders()
    .find(x => x.id === id);


  if(!order) return;


  const next = {

    new:"processing",

    processing:"delivered",

    delivered:"delivered",

    cancelled:"new"

  }[order.status || "new"];


  updateOrder(id,next);

}


/* =========================
   ORDER DETAILS
========================= */

function openOrder(id){

  const order =
    getOrders()
    .find(x => x.id === id);


  if(!order) return;


  const phone =
    String(
      order.customer?.phone || ""
    )
    .replace(/[^\d]/g,"");


  let whatsappPhone = phone;


  /*
    إذا كان الرقم يبدأ بـ 0
    نفترض رقم جوال محلي.
    لا نضع كود دولة ثابت.
  */

  if(
    whatsappPhone &&
    whatsappPhone.startsWith("0")
  ){

    whatsappPhone =
      whatsappPhone.substring(1);

  }


  const message =
    encodeURIComponent(
      `مرحباً ${order.customer?.name || ""}، معك وسام ستور بخصوص طلبك رقم ${order.id}. إجمالي الطلب ${money(order.total)}.`
    );


  const itemsHtml =
    (order.items || [])
    .map(item => `

      <div class="item-line">

        <span>
          ${esc(item.name)}
          × ${Number(item.qty || 0)}
        </span>

        <strong>
          ${money(
            Number(item.price || 0) *
            Number(item.qty || 0)
          )}
        </strong>

      </div>

    `)
    .join("");


  document.getElementById(
    "orderDetails"
  ).innerHTML = `

    <div class="detail-head">

      <span class="eyebrow">
        ORDER ${esc(order.id)}
      </span>

      <h2>
        تفاصيل الطلب
      </h2>

      <span class="status status-${esc(order.status || "new")}">
        ${statusText(order.status)}
      </span>

    </div>


    <div class="detail-grid">

      <div class="detail-box">
        <small>اسم العميل</small>
        <strong>
          ${esc(order.customer?.name || "—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>رقم الجوال</small>
        <strong>
          ${esc(order.customer?.phone || "—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>المدينة</small>
        <strong>
          ${esc(order.customer?.city || "—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>العنوان</small>
        <strong>
          ${esc(order.customer?.address || "—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>طريقة الدفع</small>
        <strong>
          ${
            order.payment === "online"
              ? "💳 الدفع الإلكتروني"
              : "💵 الدفع عند الاستلام"
          }
        </strong>
      </div>


      <div class="detail-box">
        <small>تاريخ الطلب</small>
        <strong>
          ${formatDate(order.createdAt)}
        </strong>
      </div>

    </div>


    <div class="items-list">

      <h3>
        المنتجات
      </h3>

      ${itemsHtml}

    </div>


    <div class="order-total-large">
      الإجمالي:
      ${money(order.total)}
    </div>


    <label style="display:block;margin-top:20px">

      حالة الطلب

      <select
        class="status-select"
        onchange="updateOrder('${esc(order.id)}',this.value)"
      >

        <option
          value="new"
          ${order.status === "new" ? "selected" : ""}
        >
          جديد
        </option>

        <option
          value="processing"
          ${order.status === "processing" ? "selected" : ""}
        >
          قيد التجهيز
        </option>

        <option
          value="delivered"
          ${order.status === "delivered" ? "selected" : ""}
        >
          تم التسليم
        </option>

        <option
          value="cancelled"
          ${order.status === "cancelled" ? "selected" : ""}
        >
          ملغى
        </option>

      </select>

    </label>


    ${
      whatsappPhone
      ?
      `
        <a
          class="wa-btn"
          target="_blank"
          rel="noopener"
          href="https://wa.me/${whatsappPhone}?text=${message}"
        >
          💬 التواصل عبر WhatsApp
        </a>
      `
      :
      ""
    }

  `;


  document
    .getElementById("orderModal")
    .classList.add("show");

}


function closeOrder(){

  document
    .getElementById("orderModal")
    .classList.remove("show");

}


document
  .getElementById("orderModal")
  .addEventListener(
    "click",
    e => {

      if(
        e.target.id === "orderModal"
      ){

        closeOrder();

      }

    }
  );


document.addEventListener(
  "keydown",
  e => {

    if(e.key === "Escape"){

      closeOrder();

    }

  }
);


/* =========================
   START
========================= */

render();
