const defaultProducts = [
  {
    id: 1,
    name: "هاتف ذكي",
    price: 1299,
    description: "أداء قوي وتصميم أنيق",
    icon: "📱",
    category: "phones",
    brand: "",
    battery: "",
    screen: "",
    storage: "",
    colors: ""
  },
  {
    id: 2,
    name: "ساعة ذكية",
    price: 499,
    description: "أناقة وتقنية في معصمك",
    icon: "⌚",
    category: "watches",
    brand: "",
    battery: "",
    screen: "",
    storage: "",
    colors: ""
  },
  {
    id: 3,
    name: "سماعات لاسلكية",
    price: 299,
    description: "صوت نقي وتجربة مريحة",
    icon: "🎧",
    category: "headphones",
    brand: "",
    battery: "",
    screen: "",
    storage: "",
    colors: ""
  },
  {
    id: 4,
    name: "جهاز ألعاب",
    price: 1899,
    description: "تجربة ألعاب احترافية",
    icon: "🎮",
    category: "playstation",
    brand: "",
    battery: "",
    screen: "",
    storage: "",
    colors: ""
  }
];

let currentFilter = "all";
let selectedImageData = "";
let editingProductId = null;


/* =========================
   PRODUCTS
========================= */

function getProducts() {

  try {

    const x = JSON.parse(
      localStorage.getItem("wisamProducts")
    );

    return Array.isArray(x) && x.length
      ? x
      : defaultProducts;

  } catch (e) {

    return defaultProducts;

  }

}


function saveProducts(products) {

  localStorage.setItem(
    "wisamProducts",
    JSON.stringify(products)
  );

  render();

}


function esc(s) {

  return String(s ?? "").replace(
    /[&<>"']/g,
    m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m])
  );

}


function money(n) {

  return Number(n || 0).toLocaleString("ar-SA") + " ر.س";

}


/* =========================
   IMAGE ELEMENTS
========================= */

const imageFileInput =
  document.getElementById("imageFile");

const imagePreview =
  document.getElementById("imagePreview");

const imageUrlInput =
  document.getElementById("image");


/* =========================
   IMAGE UPLOAD
========================= */

if (imageFileInput) {

  imageFileInput.addEventListener(
    "change",
    function () {

      const file = this.files[0];

      if (!file) {

        selectedImageData = "";

        imagePreview.innerHTML =
          "<span>ستظهر معاينة الصورة هنا</span>";

        return;

      }


      if (!file.type.startsWith("image/")) {

        alert("من فضلك اختر ملف صورة فقط.");

        this.value = "";

        return;

      }


      const reader = new FileReader();


      reader.onload = function (e) {

        selectedImageData = e.target.result;

        imagePreview.innerHTML = `
          <img
            src="${selectedImageData}"
            alt="معاينة الصورة"
          >
        `;

      };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================
   IMAGE URL PREVIEW
========================= */

if (imageUrlInput) {

  imageUrlInput.addEventListener(
    "input",
    function () {

      if (
        this.value.trim() &&
        !selectedImageData
      ) {

        imagePreview.innerHTML = `
          <img
            src="${esc(this.value.trim())}"
            alt="معاينة الصورة"
            onerror="this.parentElement.innerHTML='<span>تعذر تحميل الصورة</span>'"
          >
        `;

      }

      if (!this.value.trim() && !selectedImageData) {

        imagePreview.innerHTML =
          "<span>ستظهر معاينة الصورة هنا</span>";

      }

    }
  );

}


/* =========================
   RENDER PRODUCTS
========================= */

function render() {

  const products = getProducts();


  const totalProducts =
    document.getElementById("totalProducts");

  if (totalProducts) {
    totalProducts.textContent =
      products.length;
  }


  const ownerProducts =
    document.getElementById("ownerProducts");


  if (ownerProducts) {

    ownerProducts.innerHTML =
      products.map(p => `

        <div class="product-row">

          <div
            style="
              display:flex;
              align-items:center;
              gap:12px
            "
          >

            ${
              p.image
                ? `
                  <img
                    src="${esc(p.image)}"
                    alt="${esc(p.name)}"
                    style="
                      width:60px;
                      height:60px;
                      object-fit:contain;
                      border-radius:12px;
                      background:#f5f5f1;
                      padding:5px
                    "
                  >
                `
                : `
                  <span style="font-size:30px">
                    ${esc(p.icon || "📦")}
                  </span>
                `
            }


            <div>

              <b>
                ${esc(p.name)}
              </b>

              <br>

              <small>
                ${money(p.price)}
              </small>

              ${
                p.brand
                  ? `
                    <br>
                    <small>
                      🏷️ ${esc(p.brand)}
                    </small>
                  `
                  : ""
              }

            </div>

          </div>


          <div
            style="
              display:flex;
              gap:7px;
              align-items:center
            "
          >

            <button
              onclick="editProduct(${p.id})"
              style="
                border:1px solid #c99a3f;
                background:#fff8e8;
                color:#8b681f;
                border-radius:9px;
                padding:8px 12px;
                cursor:pointer
              "
            >
              ✏️ تعديل
            </button>


            <button
              onclick="deleteProduct(${p.id})"
            >
              حذف
            </button>

          </div>

        </div>

      `).join("");

  }


  renderOrders();

}


/* =========================
   ORDERS
========================= */

function getOrders() {

  try {

    const x = JSON.parse(
      localStorage.getItem("wisamOrders")
    );

    return Array.isArray(x)
      ? x
      : [];

  } catch (e) {

    return [];

  }

}


function statusText(s) {

  return {
    new: "جديد",
    processing: "قيد التجهيز",
    delivered: "تم التسليم",
    cancelled: "ملغى"
  }[s] || "جديد";

}


function formatDate(d) {

  try {

    return new Date(d).toLocaleString(
      "ar-SA",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  } catch (e) {

    return "";

  }

}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders() {

  const orders = getOrders();


  const newCount =
    orders.filter(
      o => o.status === "new"
    ).length;


  const totalOrders =
    document.getElementById("totalOrders");

  if (totalOrders) {
    totalOrders.textContent =
      orders.length;
  }


  const navOrderCount =
    document.getElementById("navOrderCount");

  if (navOrderCount) {
    navOrderCount.textContent =
      newCount;
  }


  const totalSales =
    document.getElementById("totalSales");

  if (totalSales) {

    totalSales.textContent =
      money(
        orders
          .filter(
            o => o.status !== "cancelled"
          )
          .reduce(
            (sum, o) =>
              sum + Number(o.total || 0),
            0
          )
      );

  }


  const filtered =
    currentFilter === "all"
      ? orders
      : orders.filter(
          o => o.status === currentFilter
        );


  const box =
    document.getElementById("ordersList");


  if (!box) return;


  if (!filtered.length) {

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


  box.innerHTML =
    filtered.map(o => `

      <div class="order-card">

        <div>

          <div class="order-number">
            ${esc(o.id)}
          </div>

          <div class="order-customer">
            👤 ${esc(
              o.customer?.name ||
              "بدون اسم"
            )}

            ·

            📱 ${esc(
              o.customer?.phone ||
              ""
            )}
          </div>

          <div class="order-date">
            ${formatDate(o.createdAt)}
          </div>

        </div>


        <div>

          <span
            class="
              status
              status-${esc(
                o.status || "new"
              )}
            "
          >
            ${statusText(o.status)}
          </span>


          <div class="order-customer">

            ${
              (o.items || []).reduce(
                (sum, item) =>
                  sum +
                  Number(item.qty || 0),
                0
              )
            }

            قطعة

            ·

            ${
              o.payment === "online"
                ? "💳 إلكتروني"
                : "💵 عند الاستلام"
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


/* =========================
   FILTER ORDERS
========================= */

function filterOrders(filter, btn) {

  currentFilter = filter;


  document
    .querySelectorAll(".filter")
    .forEach(
      x => x.classList.remove("active")
    );


  if (btn) {
    btn.classList.add("active");
  }


  renderOrders();

}


/* =========================
   UPDATE ORDER
========================= */

function updateOrder(id, status) {

  const orders = getOrders();


  const order =
    orders.find(
      x => x.id === id
    );


  if (!order) return;


  order.status = status;


  localStorage.setItem(
    "wisamOrders",
    JSON.stringify(orders)
  );


  renderOrders();

  openOrder(id);

}


/* =========================
   QUICK STATUS
========================= */

function quickStatus(id) {

  const order =
    getOrders().find(
      x => x.id === id
    );


  if (!order) return;


  const next = {

    new: "processing",

    processing: "delivered",

    delivered: "delivered",

    cancelled: "new"

  }[
    order.status || "new"
  ];


  updateOrder(
    id,
    next
  );

}


/* =========================
   ORDER DETAILS
========================= */

function openOrder(id) {

  const order =
    getOrders().find(
      x => x.id === id
    );


  if (!order) return;


  const phone =
    String(
      order.customer?.phone || ""
    ).replace(
      /[^\d+]/g,
      ""
    );


  const message =
    encodeURIComponent(
      `مرحباً ${order.customer?.name || ""}، معك وسام ستور بخصوص طلبك رقم ${order.id}. إجمالي الطلب ${money(order.total)}.`
    );


  const orderDetails =
    document.getElementById(
      "orderDetails"
    );


  orderDetails.innerHTML = `

    <div class="detail-head">

      <span class="eyebrow">
        ORDER ${esc(order.id)}
      </span>


      <h2>
        تفاصيل الطلب
      </h2>


      <span
        class="
          status
          status-${esc(
            order.status || "new"
          )}
        "
      >
        ${statusText(order.status)}
      </span>

    </div>


    <div class="detail-grid">

      <div class="detail-box">

        <small>
          اسم العميل
        </small>

        <strong>
          ${esc(
            order.customer?.name ||
            "—"
          )}
        </strong>

      </div>


      <div class="detail-box">

        <small>
          رقم الجوال
        </small>

        <strong>
          ${esc(
            order.customer?.phone ||
            "—"
          )}
        </strong>

      </div>


      <div class="detail-box">

        <small>
          المدينة
        </small>

        <strong>
          ${esc(
            order.customer?.city ||
            "—"
          )}
        </strong>

      </div>


      <div class="detail-box">

        <small>
          العنوان
        </small>

        <strong>
          ${esc(
            order.customer?.address ||
            "—"
          )}
        </strong>

      </div>


      <div class="detail-box">

        <small>
          طريقة الدفع
        </small>

        <strong>

          ${
            order.payment === "online"
              ? "💳 الدفع الإلكتروني"
              : "💵 الدفع عند الاستلام"
          }

        </strong>

      </div>


      <div class="detail-box">

        <small>
          تاريخ الطلب
        </small>

        <strong>
          ${formatDate(
            order.createdAt
          )}
        </strong>

      </div>

    </div>


    <div class="items-list">

      <h3>
        المنتجات
      </h3>


      ${
        (order.items || [])
          .map(item => `

            <div class="item-line">

              <span>

                ${esc(item.name)}

                ×

                ${item.qty}

              </span>


              <strong>

                ${money(
                  item.price *
                  item.qty
                )}

              </strong>

            </div>

          `)
          .join("")
      }

    </div>


    <div class="order-total-large">

      الإجمالي:

      ${money(order.total)}

    </div>


    <label
      style="
        display:block;
        margin-top:20px
      "
    >

      حالة الطلب


      <select
        class="status-select"
        onchange="
          updateOrder(
            '${order.id}',
            this.value
          )
        "
      >

        <option
          value="new"
          ${
            order.status === "new"
              ? "selected"
              : ""
          }
        >
          جديد
        </option>


        <option
          value="processing"
          ${
            order.status === "processing"
              ? "selected"
              : ""
          }
        >
          قيد التجهيز
        </option>


        <option
          value="delivered"
          ${
            order.status === "delivered"
              ? "selected"
              : ""
          }
        >
          تم التسليم
        </option>


        <option
          value="cancelled"
          ${
            order.status === "cancelled"
              ? "selected"
              : ""
          }
        >
          ملغى
        </option>

      </select>

    </label>


    ${
      phone
        ? `
          <a
            class="wa-btn"
            target="_blank"
            rel="noopener"
            href="
              https://wa.me/${phone.replace(
                /^0/,
                "966"
              )}?text=${message}
            "
          >
            💬 التواصل عبر WhatsApp
          </a>
        `
        : ""
    }

  `;


  document
    .getElementById("orderModal")
    .classList.add("show");

}


/* =========================
   CLOSE ORDER
========================= */

function closeOrder() {

  document
    .getElementById("orderModal")
    .classList.remove("show");

}


const orderModal =
  document.getElementById(
    "orderModal"
  );


if (orderModal) {

  orderModal.addEventListener(
    "click",
    e => {

      if (
        e.target.id ===
        "orderModal"
      ) {

        closeOrder();

      }

    }
  );

}


document.addEventListener(
  "keydown",
  e => {

    if (e.key === "Escape") {

      closeOrder();

    }

  }
);


/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(id) {

  if (
    !confirm(
      "هل تريد حذف هذا المنتج؟"
    )
  ) {
    return;
  }


  saveProducts(
    getProducts().filter(
      p => p.id != id
    )
  );

}


/* =========================
   EDIT PRODUCT
========================= */

function editProduct(id) {

  const product =
    getProducts().find(
      p => p.id === id
    );


  if (!product) return;


  editingProductId = id;


  document.getElementById(
    "productFormTitle"
  ).textContent =
    "تعديل المنتج";


  document.getElementById(
    "saveProductButton"
  ).textContent =
    "💾 حفظ التعديلات";


  document.getElementById(
    "cancelEditButton"
  ).style.display =
    "inline-block";


  document.getElementById(
    "category"
  ).value =
    product.category ||
    "other";


  document.getElementById(
    "brand"
  ).value =
    product.brand ||
    "";


  document.getElementById(
    "name"
  ).value =
    product.name ||
    "";


  document.getElementById(
    "price"
  ).value =
    product.price ||
    "";


  document.getElementById(
    "battery"
  ).value =
    product.battery ||
    "";


  document.getElementById(
    "screen"
  ).value =
    product.screen ||
    "";


  document.getElementById(
    "storage"
  ).value =
    product.storage ||
    "";


  document.getElementById(
    "colors"
  ).value =
    product.colors ||
    "";


  document.getElementById(
    "description"
  ).value =
    product.description ||
    "";


  document.getElementById(
    "icon"
  ).value =
    product.icon ||
    "";


  const existingImage =
    product.image ||
    "";


  document.getElementById(
    "image"
  ).value =
    existingImage.startsWith(
      "data:image"
    )
      ? ""
      : existingImage;


  selectedImageData =
    existingImage.startsWith(
      "data:image"
    )
      ? existingImage
      : "";


  if (existingImage) {

    imagePreview.innerHTML = `
      <img
        src="${esc(existingImage)}"
        alt="صورة المنتج"
      >
    `;

  } else {

    imagePreview.innerHTML =
      "<span>ستظهر معاينة الصورة هنا</span>";

  }


  showSection("add");

}


/* =========================
   CANCEL EDIT
========================= */

function cancelEdit() {

  resetProductForm();

  showSection("products");

}


/* =========================
   RESET PRODUCT FORM
========================= */

function resetProductForm() {

  const form =
    document.getElementById(
      "productForm"
    );


  if (form) {
    form.reset();
  }


  editingProductId = null;

  selectedImageData = "";


  document.getElementById(
    "productFormTitle"
  ).textContent =
    "إضافة منتج جديد";


  document.getElementById(
    "saveProductButton"
  ).textContent =
    "حفظ المنتج";


  document.getElementById(
    "cancelEditButton"
  ).style.display =
    "none";


  if (imagePreview) {

    imagePreview.innerHTML =
      "<span>ستظهر معاينة الصورة هنا</span>";

  }

}


/* =========================
   ADD / EDIT PRODUCT FORM
========================= */

const productForm =
  document.getElementById(
    "productForm"
  );


if (productForm) {

  productForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      const name =
        document.getElementById(
          "name"
        ).value.trim();


      const price =
        Number(
          document.getElementById(
            "price"
          ).value
        );


      const description =
        document.getElementById(
          "description"
        ).value.trim();


      const icon =
        document.getElementById(
          "icon"
        ).value.trim() ||
        "📦";


      const category =
        document.getElementById(
          "category"
        ).value;


      const brand =
        document.getElementById(
          "brand"
        ).value.trim();


      const battery =
        document.getElementById(
          "battery"
        ).value.trim();


      const screen =
        document.getElementById(
          "screen"
        ).value.trim();


      const storage =
        document.getElementById(
          "storage"
        ).value.trim();


      const colors =
        document.getElementById(
          "colors"
        ).value.trim();


      const imageUrl =
        document.getElementById(
          "image"
        ).value.trim();


      const finalImage =
        selectedImageData ||
        imageUrl;


      const products =
        getProducts();


      /* =========================
         EDIT EXISTING PRODUCT
      ========================= */

      if (editingProductId) {

        const index =
          products.findIndex(
            p =>
              p.id ===
              editingProductId
          );


        if (index !== -1) {

          products[index] = {

            ...products[index],

            name,

            price,

            description,

            icon,

            category,

            brand,

            battery,

            screen,

            storage,

            colors,

            image:
              finalImage ||
              products[index].image ||
              ""

          };

        }


        saveProducts(products);


        alert(
          "تم تعديل المنتج بنجاح ✅"
        );

      }


      /* =========================
         ADD NEW PRODUCT
      ========================= */

      else {

        products.push({

          id: Date.now(),

          name,

          price,

          description,

          icon,

          category,

          brand,

          battery,

          screen,

          storage,

          colors,

          image: finalImage

        });


        saveProducts(products);


        alert(
          "تم حفظ المنتج بنجاح ✅"
        );

      }


      resetProductForm();


      showSection(
        "products"
      );

    }
  );

}


/* =========================
   DASHBOARD NAVIGATION
========================= */

function showSection(sectionId) {

  document
    .querySelectorAll(
      ".dashboard-section"
    )
    .forEach(
      section => {

        section.classList.remove(
          "active-section"
        );

      }
    );


  const section =
    document.getElementById(
      sectionId
    );


  if (section) {

    section.classList.add(
      "active-section"
    );

  }


  document
    .querySelectorAll(
      ".nav-tab"
    )
    .forEach(tab => {

      tab.classList.remove(
        "active"
      );


      if (
        tab.dataset.section ===
        sectionId
      ) {

        tab.classList.add(
          "active"
        );

      }

    });


  if (
    sectionId ===
    "orders"
  ) {

    renderOrders();

  }


  if (
    sectionId ===
    "dashboard"
  ) {

    render();

  }


  if (
    sectionId ===
    "products"
  ) {

    render();

  }


  if (
    sectionId ===
    "add"
  ) {

    /* لا نعمل reset هنا
       حتى لا نخسر بيانات التعديل */

  }


  window.location.hash =
    sectionId;

}


/* =========================
   NAVIGATION LINKS
========================= */

document
  .querySelectorAll(
    ".nav-tab"
  )
  .forEach(tab => {

    tab.addEventListener(
      "click",
      function (e) {

        e.preventDefault();

        showSection(
          this.dataset.section
        );

      }
    );

  });


/* =========================
   HASH NAVIGATION
========================= */

function loadSectionFromHash() {

  const hash =
    window.location.hash
      .replace("#", "");


  const allowed = [
    "dashboard",
    "orders",
    "products",
    "add"
  ];


  if (
    allowed.includes(hash)
  ) {

    showSection(hash);

  } else {

    showSection("dashboard");

  }

}


window.addEventListener(
  "hashchange",
  loadSectionFromHash
);


/* =========================
   START
========================= */

render();

loadSectionFromHash();
