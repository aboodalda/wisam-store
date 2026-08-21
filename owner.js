const defaultProducts=[
  {
    id:1,
    name:"هاتف ذكي",
    price:1299,
    description:"أداء قوي وتصميم أنيق",
    icon:"📱"
  },
  {
    id:2,
    name:"ساعة ذكية",
    price:499,
    description:"أناقة وتقنية في معصمك",
    icon:"⌚"
  },
  {
    id:3,
    name:"سماعات لاسلكية",
    price:299,
    description:"صوت نقي وتجربة مريحة",
    icon:"🎧"
  },
  {
    id:4,
    name:"جهاز ألعاب",
    price:1899,
    description:"تجربة ألعاب احترافية",
    icon:"🎮"
  }
];

let currentFilter="all";

let selectedImageData="";


/* =========================
   PRODUCTS
========================= */

function getProducts(){

  try{

    const x=JSON.parse(
      localStorage.getItem("wisamProducts")
    );

    return Array.isArray(x)&&x.length
      ?x
      :defaultProducts;

  }catch(e){

    return defaultProducts;

  }

}


function saveProducts(x){

  localStorage.setItem(
    "wisamProducts",
    JSON.stringify(x)
  );

  render();

}


function esc(s){

  return String(s??"").replace(
    /[&<>"']/g,
    m=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[m])
  );

}


function money(n){

  return Number(n||0).toLocaleString("ar-SA")+" ر.س";

}


/* =========================
   IMAGE UPLOAD
========================= */

const imageFileInput=
  document.getElementById("imageFile");

const imagePreview=
  document.getElementById("imagePreview");

const imageUrlInput=
  document.getElementById("image");


imageFileInput.addEventListener(
  "change",
  function(){

    const file=this.files[0];

    if(!file){

      selectedImageData="";

      imagePreview.innerHTML=
        "<span>ستظهر معاينة الصورة هنا</span>";

      return;

    }


    if(!file.type.startsWith("image/")){

      alert("من فضلك اختر ملف صورة فقط.");

      this.value="";

      return;

    }


    const reader=new FileReader();


    reader.onload=function(e){

      selectedImageData=e.target.result;

      imagePreview.innerHTML=
        `<img src="${selectedImageData}" alt="معاينة الصورة">`;

    };


    reader.readAsDataURL(file);

  }
);


/* إذا وضع رابط صورة */

imageUrlInput.addEventListener(
  "input",
  function(){

    if(
      this.value.trim() &&
      !selectedImageData
    ){

      imagePreview.innerHTML=
        `<img src="${esc(this.value.trim())}" alt="معاينة الصورة"
        onerror="this.parentElement.innerHTML='<span>تعذر تحميل الصورة</span>'">`;

    }

  }
);


/* =========================
   RENDER
========================= */

function render(){

  const products=getProducts();

  document.getElementById(
    "totalProducts"
  ).textContent=products.length;


  document.getElementById(
    "ownerProducts"
  ).innerHTML=products.map(p=>`

    <div class="product-row">

      <div style="display:flex;align-items:center;gap:12px">

        ${
          p.image
          ?
          `<img
            src="${esc(p.image)}"
            style="
              width:55px;
              height:55px;
              object-fit:contain;
              border-radius:10px;
              background:#f5f5f1;
              padding:5px
            "
          >`
          :
          `<span style="font-size:30px">
            ${esc(p.icon||"📦")}
          </span>`
        }

        <div>

          <b>
            ${esc(p.name)}
          </b>

          <br>

          <small>
            ${money(p.price)}
          </small>

        </div>

      </div>

      <button
        onclick="deleteProduct(${p.id})"
      >
        حذف
      </button>

    </div>

  `).join("");


  renderOrders();

}


/* =========================
   ORDERS
========================= */

function getOrders(){

  try{

    const x=JSON.parse(
      localStorage.getItem("wisamOrders")
    );

    return Array.isArray(x)
      ?x
      :[];

  }catch(e){

    return[];

  }

}


function statusText(s){

  return({
    new:"جديد",
    processing:"قيد التجهيز",
    delivered:"تم التسليم",
    cancelled:"ملغى"
  })[s]||"جديد";

}


function formatDate(d){

  try{

    return new Date(d).toLocaleString(
      "ar-SA",
      {
        dateStyle:"medium",
        timeStyle:"short"
      }
    );

  }catch(e){

    return"";

  }

}


function renderOrders(){

  const orders=getOrders();

  const newCount=
    orders.filter(
      o=>o.status==="new"
    ).length;


  document.getElementById(
    "totalOrders"
  ).textContent=orders.length;


  document.getElementById(
    "navOrderCount"
  ).textContent=newCount;


  document.getElementById(
    "totalSales"
  ).textContent=money(
    orders
      .filter(o=>o.status!=="cancelled")
      .reduce(
        (s,o)=>s+Number(o.total||0),
        0
      )
  );


  const filtered=
    currentFilter==="all"
      ?orders
      :orders.filter(
        o=>o.status===currentFilter
      );


  const box=
    document.getElementById(
      "ordersList"
    );


  if(!filtered.length){

    box.innerHTML=`
      <div class="empty-orders">

        <strong>
          لا توجد طلبات هنا
        </strong>

        <span>
          عندما يرسل الزبائن طلباتهم ستظهر في هذا القسم.
        </span>

      </div>
    `;

    return;

  }


  box.innerHTML=filtered.map(o=>`

    <div class="order-card">

      <div>

        <div class="order-number">
          ${esc(o.id)}
        </div>

        <div class="order-customer">
          👤 ${esc(o.customer?.name||"بدون اسم")}
          ·
          📱 ${esc(o.customer?.phone||"")}
        </div>

        <div class="order-date">
          ${formatDate(o.createdAt)}
        </div>

      </div>


      <div>

        <span class="status status-${esc(o.status||"new")}">
          ${statusText(o.status)}
        </span>

        <div class="order-customer">

          ${
            (o.items||[]).reduce(
              (s,x)=>s+Number(x.qty||0),
              0
            )
          }

          قطعة

          ·

          ${
            o.payment==="online"
            ?"💳 إلكتروني"
            :"💵 عند الاستلام"
          }

        </div>

      </div>


      <div>

        <div class="order-total">
          ${money(o.total)}
        </div>

        <div class="order-actions">

          <button
            onclick="openOrder('${o.id}')"
          >
            التفاصيل
          </button>

          <button
            onclick="quickStatus('${o.id}')"
          >
            تغيير الحالة
          </button>

        </div>

      </div>

    </div>

  `).join("");

}


function filterOrders(filter,btn){

  currentFilter=filter;

  document
    .querySelectorAll(".filter")
    .forEach(
      x=>x.classList.remove("active")
    );

  if(btn){
    btn.classList.add("active");
  }

  renderOrders();

}


function updateOrder(id,status){

  const orders=getOrders();

  const o=orders.find(
    x=>x.id===id
  );

  if(!o)return;

  o.status=status;

  localStorage.setItem(
    "wisamOrders",
    JSON.stringify(orders)
  );

  renderOrders();

  openOrder(id);

}


function quickStatus(id){

  const o=getOrders().find(
    x=>x.id===id
  );

  if(!o)return;

  const next={
    new:"processing",
    processing:"delivered",
    delivered:"delivered",
    cancelled:"new"
  }[o.status||"new"];

  updateOrder(id,next);

}


/* =========================
   ORDER DETAILS
========================= */

function openOrder(id){

  const o=getOrders().find(
    x=>x.id===id
  );

  if(!o)return;


  const phone=
    String(
      o.customer?.phone||""
    ).replace(
      /[^\d+]/g,
      ""
    );


  const message=
    encodeURIComponent(
      `مرحباً ${o.customer?.name||""}، معك وسام ستور بخصوص طلبك رقم ${o.id}. إجمالي الطلب ${money(o.total)}.`
    );


  document.getElementById(
    "orderDetails"
  ).innerHTML=`

    <div class="detail-head">

      <span class="eyebrow">
        ORDER ${esc(o.id)}
      </span>

      <h2>
        تفاصيل الطلب
      </h2>

      <span class="status status-${esc(o.status||"new")}">
        ${statusText(o.status)}
      </span>

    </div>


    <div class="detail-grid">

      <div class="detail-box">
        <small>اسم العميل</small>
        <strong>
          ${esc(o.customer?.name||"—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>رقم الجوال</small>
        <strong>
          ${esc(o.customer?.phone||"—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>المدينة</small>
        <strong>
          ${esc(o.customer?.city||"—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>العنوان</small>
        <strong>
          ${esc(o.customer?.address||"—")}
        </strong>
      </div>


      <div class="detail-box">
        <small>طريقة الدفع</small>
        <strong>
          ${
            o.payment==="online"
            ?"💳 الدفع الإلكتروني"
            :"💵 الدفع عند الاستلام"
          }
        </strong>
      </div>


      <div class="detail-box">
        <small>تاريخ الطلب</small>
        <strong>
          ${formatDate(o.createdAt)}
        </strong>
      </div>

    </div>


    <div class="items-list">

      <h3>
        المنتجات
      </h3>

      ${
        (o.items||[]).map(x=>`

          <div class="item-line">

            <span>
              ${esc(x.name)}
              ×
              ${x.qty}
            </span>

            <strong>
              ${money(x.price*x.qty)}
            </strong>

          </div>

        `).join("")
      }

    </div>


    <div class="order-total-large">
      الإجمالي:
      ${money(o.total)}
    </div>


    <label
      style="display:block;margin-top:20px"
    >

      حالة الطلب

      <select
        class="status-select"
        onchange="updateOrder('${o.id}',this.value)"
      >

        <option
          value="new"
          ${o.status==="new"?"selected":""}
        >
          جديد
        </option>

        <option
          value="processing"
          ${o.status==="processing"?"selected":""}
        >
          قيد التجهيز
        </option>

        <option
          value="delivered"
          ${o.status==="delivered"?"selected":""}
        >
          تم التسليم
        </option>

        <option
          value="cancelled"
          ${o.status==="cancelled"?"selected":""}
        >
          ملغى
        </option>

      </select>

    </label>


    ${
      phone
      ?
      `
      <a
        class="wa-btn"
        target="_blank"
        rel="noopener"
        href="https://wa.me/${phone.replace(/^0/,"966")}?text=${message}"
      >
        💬 التواصل عبر WhatsApp
      </a>
      `
      :""
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
    e=>{
      if(
        e.target.id==="orderModal"
      ){
        closeOrder();
      }
    }
  );


document.addEventListener(
  "keydown",
  e=>{
    if(e.key==="Escape"){
      closeOrder();
    }
  }
);


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id){

  if(
    !confirm(
      "هل تريد حذف هذا المنتج؟"
    )
  )return;

  saveProducts(
    getProducts().filter(
      p=>p.id!=id
    )
  );

}


/* =========================
   ADD PRODUCT
========================= */

document
  .getElementById("productForm")
  .addEventListener(
    "submit",
    e=>{

      e.preventDefault();


      const name=
        document
          .getElementById("name")
          .value
          .trim();


      const price=
        Number(
          document
            .getElementById("price")
            .value
        );


      const description=
        document
          .getElementById("description")
          .value
          .trim();


      const icon=
        document
          .getElementById("icon")
          .value
          .trim() ||
        "📦";


      const imageUrl=
        document
          .getElementById("image")
          .value
          .trim();


      /*
        إذا اختار المستخدم صورة من الجهاز
        نستخدمها أولاً.
        وإذا لم يختر صورة نستخدم الرابط.
      */

      const finalImage=
        selectedImageData ||
        imageUrl;


      const products=
        getProducts();


      products.push({

        id:Date.now(),

        name,

        price,

        description,

        icon,

        image:finalImage

      });


      saveProducts(products);


      e.target.reset();

      selectedImageData="";


      imagePreview.innerHTML=
        "<span>ستظهر معاينة الصورة هنا</span>";


      alert(
        "تم حفظ المنتج بنجاح ✅"
      );


      window.location.hash=
        "products";

    }
  );


/* =========================
   START
========================= */

render();
