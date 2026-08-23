/* =========================================================
   WISAM STORE
   DASHBOARD.JS
   Products + Subcategories + Orders
========================================================= */


/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const defaultProducts = [

  {
    id: 1,
    name: "هاتف ذكي",
    price: 1299,
    description: "أداء قوي وتصميم أنيق",
    icon: "📱",
    category: "phones",
    subcategory: "iphone",
    brand: "عام",
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
    subcategory: "apple-watch",
    brand: "Apple",
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
    subcategory: "other",
    brand: "عام",
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
    subcategory: "ps5",
    brand: "PlayStation",
    battery: "",
    screen: "",
    storage: "1TB",
    colors: ""
  }

];


/* =========================================================
   SUBCATEGORY OPTIONS
========================================================= */

const subcategoryOptions = {

  phones: [

    ["iphone", "iPhone"],

    ["samsung", "Samsung"],

    ["xiaomi", "Xiaomi"],

    ["redmi", "Redmi"],

    ["huawei", "Huawei"],

    ["other", "أخرى"]

  ],


  watches: [

    ["apple-watch", "Apple Watch"],

    ["samsung-watch", "Samsung Watch"],

    ["huawei-watch", "Huawei Watch"],

    ["other", "أخرى"]

  ],


  headphones: [

    ["airpods", "AirPods"],

    ["sony", "Sony"],

    ["jbl", "JBL"],

    ["other", "أخرى"]

  ],


  playstation: [

    ["ps5", "PlayStation 5"],

    ["ps4", "PlayStation 4"],

    ["ps3", "PlayStation 3"],

    ["other", "أخرى"]

  ],


  other: [

    ["other", "أخرى"]

  ]

};


/* =========================================================
   SUBCATEGORY NAMES
========================================================= */

const subcategoryNames = {

  iphone: "iPhone",

  samsung: "Samsung",

  xiaomi: "Xiaomi",

  redmi: "Redmi",

  huawei: "Huawei",

  "apple-watch": "Apple Watch",

  "samsung-watch": "Samsung Watch",

  "huawei-watch": "Huawei Watch",

  airpods: "AirPods",

  sony: "Sony",

  jbl: "JBL",

  ps5: "PlayStation 5",

  ps4: "PlayStation 4",

  ps3: "PlayStation 3",

  other: "أخرى"

};


/* =========================================================
   CURRENT STATE
========================================================= */

let currentFilter = "all";

let selectedImageData = "";

let editingProductId = null;


/* =========================================================
   PRODUCTS
========================================================= */

let productsCache = null;

function getProducts() {

  if (
    Array.isArray(productsCache) &&
    productsCache.length
  ) {
    return productsCache;
  }

  try {

    const x = JSON.parse(
      localStorage.getItem(
        "wisamProducts"
      )
    );


    if (
      Array.isArray(x) &&
      x.length
    ) {

      return x;

    }


    return defaultProducts;

  } catch (e) {

    return defaultProducts;

  }

}


/* =========================================================
   SAVE PRODUCTS
========================================================= */

function saveProducts(products) {

  productsCache = products;

  localStorage.setItem(
    "wisamProducts",
    JSON.stringify(products)
  );

  if (
    typeof firebase !== "undefined" &&
    firebase.apps &&
    firebase.apps.length
  ) {
    firebase.database()
      .ref("products")
      .set(products)
      .catch((e) => {
        console.warn("تعذر حفظ المنتجات على Firebase:", e);
      });
  }


  render();

}


/* =========================================================
   FIREBASE SYNC (Realtime Database)
========================================================= */

function initFirebaseSync(onUpdate) {

  if (
    typeof firebase === "undefined" ||
    !firebase.apps ||
    !firebase.apps.length
  ) {
    return;
  }

  try {
    firebase.database().ref("products").once("value").then((snapshot) => {
      const val = snapshot.val();
      const remoteList = Array.isArray(val)
        ? val.filter(Boolean)
        : (val ? Object.values(val) : []);

      if (!remoteList.length) {
        // القاعدة فاضية لسا - ارفع المنتجات المحفوظة محليًا على هذا الجهاز (إن وجدت)
        let localList = [];
        try {
          localList = JSON.parse(localStorage.getItem("wisamProducts")) || [];
        } catch (e) {}

        if (Array.isArray(localList) && localList.length) {
          firebase.database().ref("products").set(localList).catch((e) => {
            console.warn("تعذر رفع المنتجات المحلية إلى Firebase:", e);
          });
        }
      }
    });

    firebase.database().ref("products").on("value", (snapshot) => {
      const val = snapshot.val();
      const list = Array.isArray(val)
        ? val.filter(Boolean)
        : (val ? Object.values(val) : []);

      if (list.length) {
        productsCache = list;
        localStorage.setItem("wisamProducts", JSON.stringify(list));

        if (typeof onUpdate === "function") {
          onUpdate();
        }
      }
    });
  } catch (e) {
    console.warn("تعذر الاتصال بقاعدة بيانات Firebase، سيتم استخدام البيانات المحلية.", e);
  }
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(s) {

  return String(
    s ?? ""
  ).replace(
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


/* =========================================================
   MONEY
========================================================= */

function money(n) {

  return (
    Number(n || 0)
      .toLocaleString("ar-SA") +
    " ر.س"
  );

}


/* =========================================================
   IMAGE ELEMENTS
========================================================= */

const imageFileInput =
  document.getElementById(
    "imageFile"
  );


const imagePreview =
  document.getElementById(
    "imagePreview"
  );


const imageUrlInput =
  document.getElementById(
    "image"
  );


/* =========================================================
   IMAGE UPLOAD
========================================================= */

if (imageFileInput) {

  imageFileInput.addEventListener(
    "change",

    function () {

      const file =
        this.files[0];


      if (!file) {

        selectedImageData = "";


        if (imagePreview) {

          imagePreview.innerHTML =
            "<span>ستظهر معاينة الصورة هنا</span>";

        }


        return;

      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "من فضلك اختر ملف صورة فقط."
        );


        this.value = "";


        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        function (e) {

          selectedImageData =
            e.target.result;


          if (imagePreview) {

            imagePreview.innerHTML = `

              <img
                src="${selectedImageData}"
                alt="معاينة الصورة"
              >

            `;

          }

        };


      reader.readAsDataURL(
        file
      );

    }

  );

}


/* =========================================================
   IMAGE URL PREVIEW
========================================================= */

if (imageUrlInput) {

  imageUrlInput.addEventListener(
    "input",

    function () {

      if (
        this.value.trim() &&
        !selectedImageData
      ) {

        if (imagePreview) {

          imagePreview.innerHTML = `

            <img
              src="${esc(
                this.value.trim()
              )}"
              alt="معاينة الصورة"
              onerror="
                this.parentElement.innerHTML=
                '<span>تعذر تحميل الصورة</span>'
              "
            >

          `;

        }

      }


      if (
        !this.value.trim() &&
        !selectedImageData
      ) {

        if (imagePreview) {

          imagePreview.innerHTML =
            "<span>ستظهر معاينة الصورة هنا</span>";

        }

      }

    }

  );

}


/* =========================================================
   SUBCATEGORY FIELD
========================================================= */

function setupSubcategoryField() {

  const category =
    document.getElementById(
      "category"
    );


  if (!category) return;


  let subcategory =
    document.getElementById(
      "subcategory"
    );


  /*
   * إذا كان الحقل موجودًا في HTML
   * نستخدمه.
   *
   * إذا لم يكن موجودًا،
   * نقوم بإنشائه تلقائيًا.
   */

  if (!subcategory) {

    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.id =
      "subcategoryWrapper";


    wrapper.style.marginTop =
      "14px";


    wrapper.innerHTML = `

      <label
        for="subcategory"
        style="
          display:block;
          margin-bottom:7px;
          font-weight:700;
        "
      >

        القسم الفرعي

      </label>


      <select
        id="subcategory"
        name="subcategory"
        style="
          width:100%;
          padding:12px;
          border:1px solid #ddd;
          border-radius:10px;
          font-family:inherit;
          background:#fff;
          box-sizing:border-box;
        "
      >

      </select>

    `;


    category.parentNode.insertBefore(
      wrapper,
      category.nextSibling
    );


    subcategory =
      document.getElementById(
        "subcategory"
      );

  }


  function updateSubcategories() {

    const selectedCategory =
      category.value ||
      "other";


    const options =
      subcategoryOptions[
        selectedCategory
      ] ||
      subcategoryOptions.other;


    const currentValue =
      subcategory.value;


    subcategory.innerHTML = `

      <option value="">

        اختر القسم الفرعي

      </option>


      ${
        options
          .map(
            option => `

              <option
                value="${esc(
                  option[0]
                )}"
              >

                ${esc(
                  option[1]
                )}

              </option>

            `
          )
          .join("")
      }

    `;


    if (
      options.some(
        option =>
          option[0] ===
          currentValue
      )
    ) {

      subcategory.value =
        currentValue;

    }

  }


  /*
   * منع تكرار event listener
   */

  if (
    !category.dataset.subcategoryReady
  ) {

    category.addEventListener(
      "change",

      updateSubcategories
    );


    category.dataset.subcategoryReady =
      "true";

  }


  updateSubcategories();

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function render() {

  const products =
    getProducts();


  const totalProducts =
    document.getElementById(
      "totalProducts"
    );


  if (totalProducts) {

    totalProducts.textContent =
      products.length;

  }


  const ownerProducts =
    document.getElementById(
      "ownerProducts"
    );


  if (ownerProducts) {

    ownerProducts.innerHTML =

      products
        .map(
          p => `

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
                    src="${esc(
                      p.image
                    )}"
                    alt="${esc(
                      p.name
                    )}"
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

                  <span
                    style="
                      font-size:30px
                    "
                  >

                    ${esc(
                      p.icon ||
                      "📦"
                    )}

                  </span>

                `
            }


            <div>

              <b>

                ${esc(
                  p.name
                )}

              </b>


              <br>


              <small>

                ${money(
                  p.price
                )}

              </small>


              ${
                p.category

                  ? `

                    <br>

                    <small>

                      📂

                      ${esc(
                        getCategoryName(
                          p.category
                        )
                      )}

                    </small>

                  `

                  : ""
              }


              ${
                p.subcategory

                  ? `

                    <br>

                    <small>

                      ▸

                      ${esc(
                        subcategoryNames[
                          p.subcategory
                        ] ||
                        p.subcategory
                      )}

                    </small>

                  `

                  : ""
              }


              ${
                p.brand

                  ? `

                    <br>

                    <small>

                      🏷️

                      ${esc(
                        p.brand
                      )}

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
              align-items:center;
              flex-wrap:wrap
            "
          >


            <button
              onclick="
                editProduct(${p.id})
              "
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
              onclick="
                deleteProduct(${p.id})
              "
            >

              حذف

            </button>


          </div>


        </div>

      `
        )
        .join("");

  }


  renderOrders();

}


/* =========================================================
   CATEGORY NAMES
========================================================= */

function getCategoryName(category) {

  const names = {

    phones: "الجوالات",

    watches: "الساعات الذكية",

    headphones: "السماعات",

    playstation: "PlayStation",

    other: "منتجات أخرى"

  };


  return (
    names[category] ||
    category ||
    "منتج"
  );

}


/* =========================================================
   ORDERS
========================================================= */

function getOrders() {

  try {

    const x = JSON.parse(
      localStorage.getItem(
        "wisamOrders"
      )
    );


    return Array.isArray(x)
      ? x
      : [];

  } catch (e) {

    return [];

  }

}


/* =========================================================
   ORDER STATUS TEXT
========================================================= */

function statusText(s) {

  return {

    new: "جديد",

    processing: "قيد التجهيز",

    delivered: "تم التسليم",

    cancelled: "ملغى"

  }[
    s
  ] || "جديد";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(d) {

  try {

    return new Date(
      d
    ).toLocaleString(
      "ar-SA",
      {
        dateStyle:
          "medium",

        timeStyle:
          "short"
      }
    );

  } catch (e) {

    return "";

  }

}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderOrders() {

  const orders =
    getOrders();


  const newCount =
    orders.filter(
      o =>
        o.status ===
        "new"
    ).length;


  const totalOrders =
    document.getElementById(
      "totalOrders"
    );


  if (totalOrders) {

    totalOrders.textContent =
      orders.length;

  }


  const navOrderCount =
    document.getElementById(
      "navOrderCount"
    );


  if (navOrderCount) {

    navOrderCount.textContent =
      newCount;

  }


  const totalSales =
    document.getElementById(
      "totalSales"
    );


  if (totalSales) {

    totalSales.textContent =

      money(

        orders

          .filter(
            o =>
              o.status !==
              "cancelled"
          )

          .reduce(
            (
              sum,
              o
            ) =>

              sum +
              Number(
                o.total ||
                0
              ),

            0
          )

      );

  }


  const filtered =
    currentFilter ===
    "all"

      ? orders

      : orders.filter(
          o =>
            o.status ===
            currentFilter
        );


  const box =
    document.getElementById(
      "ordersList"
    );


  if (!box) return;


  if (!filtered.length) {

    box.innerHTML = `

      <div
        class="empty-orders"
      >

        <strong>

          لا توجد طلبات هنا

        </strong>


        <span>

          عندما يرسل الزبائن
          طلباتهم ستظهر في هذا القسم.

        </span>

      </div>

    `;


    return;

  }


  box.innerHTML =

    filtered

      .map(
        o => `

      <div
        class="order-card"
      >


        <div>


          <div
            class="order-number"
          >

            ${esc(
              o.id
            )}

          </div>


          <div
            class="order-customer"
          >

            👤

            ${esc(
              o.customer?.name ||
              "بدون اسم"
            )}

            ·

            📱

            ${esc(
              o.customer?.phone ||
              ""
            )}

          </div>


          <div
            class="order-date"
          >

            ${formatDate(
              o.createdAt
            )}

          </div>


        </div>


        <div>


          <span
            class="
              status
              status-${esc(
                o.status ||
                "new"
              )}
            "
          >

            ${statusText(
              o.status
            )}

          </span>


          <div
            class="order-customer"
          >

            ${
              (
                o.items ||
                []
              ).reduce(
                (
                  sum,
                  item
                ) =>

                  sum +
                  Number(
                    item.qty ||
                    0
                  ),

                0
              )
            }

            قطعة

            ·

            ${
              o.payment ===
              "online"

                ? "💳 إلكتروني"

                : "💵 عند الاستلام"
            }

          </div>


        </div>


        <div>


          <div
            class="order-total"
          >

            ${money(
              o.total
            )}

          </div>


          <div
            class="order-actions"
          >


            <button
              onclick="
                openOrder('${esc(
                  o.id
                )}')
              "
            >

              التفاصيل

            </button>


            <button
              onclick="
                quickStatus('${esc(
                  o.id
                )}')
              "
            >

              تغيير الحالة

            </button>


          </div>


        </div>


      </div>

    `
      )
      .join("");

}


/* =========================================================
   FILTER ORDERS
========================================================= */

function filterOrders(
  filter,
  btn
) {

  currentFilter =
    filter;


  document
    .querySelectorAll(
      ".filter"
    )
    .forEach(
      x =>
        x.classList.remove(
          "active"
        )
    );


  if (btn) {

    btn.classList.add(
      "active"
    );

  }


  renderOrders();

}


/* =========================================================
   UPDATE ORDER
========================================================= */

function updateOrder(
  id,
  status
) {

  const orders =
    getOrders();


  const order =
    orders.find(
      x =>
        x.id ===
        id
    );


  if (!order) return;


  order.status =
    status;


  localStorage.setItem(
    "wisamOrders",
    JSON.stringify(
      orders
    )
  );


  renderOrders();


  openOrder(id);

}


/* =========================================================
   QUICK STATUS
========================================================= */

function quickStatus(id) {

  const order =
    getOrders().find(
      x =>
        x.id ===
        id
    );


  if (!order) return;


  const next = {

    new:
      "processing",

    processing:
      "delivered",

    delivered:
      "delivered",

    cancelled:
      "new"

  }[
    order.status ||
    "new"
  ];


  updateOrder(
    id,
    next
  );

}


/* =========================================================
   ORDER DETAILS
========================================================= */

function openOrder(id) {

  const order =
    getOrders().find(
      x =>
        x.id ===
        id
    );


  if (!order) return;


  const phone =
    String(
      order.customer?.phone ||
      ""
    ).replace(
      /[^\d+]/g,
      ""
    );


  const message =
    encodeURIComponent(

      `مرحباً ${
        order.customer?.name ||
        ""
      }، معك وسام ستور بخصوص طلبك رقم ${
        order.id
      }. إجمالي الطلب ${
        money(
          order.total
        )
      }.`

    );


  const orderDetails =
    document.getElementById(
      "orderDetails"
    );


  if (!orderDetails) return;


  orderDetails.innerHTML = `

    <div
      class="detail-head"
    >


      <span
        class="eyebrow"
      >

        ORDER

        ${esc(
          order.id
        )}

      </span>


      <h2>

        تفاصيل الطلب

      </h2>


      <span
        class="
          status
          status-${esc(
            order.status ||
            "new"
          )}
        "
      >

        ${statusText(
          order.status
        )}

      </span>


    </div>


    <div
      class="detail-grid"
    >


      <div
        class="detail-box"
      >

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


      <div
        class="detail-box"
      >

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


      <div
        class="detail-box"
      >

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


      <div
        class="detail-box"
      >

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


      <div
        class="detail-box"
      >

        <small>
          طريقة الدفع
        </small>


        <strong>

          ${
            order.payment ===
            "online"

              ? "💳 الدفع الإلكتروني"

              : "💵 الدفع عند الاستلام"
          }

        </strong>

      </div>


      <div
        class="detail-box"
      >

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


    <div
      class="items-list"
    >

      <h3>
        المنتجات
      </h3>


      ${
        (
          order.items ||
          []
        )
        .map(
          item => `

            <div
              class="item-line"
            >

              <span>

                ${esc(
                  item.name
                )}

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

          `
        )
        .join("")
      }

    </div>


    <div
      class="order-total-large"
    >

      الإجمالي:

      ${money(
        order.total
      )}

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
            '${esc(
              order.id
            )}',
            this.value
          )
        "
      >


        <option
          value="new"
          ${
            order.status ===
            "new"
              ? "selected"
              : ""
          }
        >

          جديد

        </option>


        <option
          value="processing"
          ${
            order.status ===
            "processing"
              ? "selected"
              : ""
          }
        >

          قيد التجهيز

        </option>


        <option
          value="delivered"
          ${
            order.status ===
            "delivered"
              ? "selected"
              : ""
          }
        >

          تم التسليم

        </option>


        <option
          value="cancelled"
          ${
            order.status ===
            "cancelled"
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


  const modal =
    document.getElementById(
      "orderModal"
    );


  if (modal) {

    modal.classList.add(
      "show"
    );

  }

}


/* =========================================================
   CLOSE ORDER
========================================================= */

function closeOrder() {

  const modal =
    document.getElementById(
      "orderModal"
    );


  if (modal) {

    modal.classList.remove(
      "show"
    );

  }

}


/* =========================================================
   ORDER MODAL EVENTS
========================================================= */

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

    if (
      e.key ===
      "Escape"
    ) {

      closeOrder();

    }

  }

);


/* =========================================================
   DELETE PRODUCT
========================================================= */

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
      p =>
        p.id != id
    )

  );

}


/* =========================================================
   EDIT PRODUCT
========================================================= */

function editProduct(id) {

  const product =
    getProducts().find(
      p =>
        p.id === id
    );


  if (!product) return;


  editingProductId =
    id;


  const title =
    document.getElementById(
      "productFormTitle"
    );


  if (title) {

    title.textContent =
      "تعديل المنتج";

  }


  const saveButton =
    document.getElementById(
      "saveProductButton"
    );


  if (saveButton) {

    saveButton.textContent =
      "💾 حفظ التعديلات";

  }


  const cancelButton =
    document.getElementById(
      "cancelEditButton"
    );


  if (cancelButton) {

    cancelButton.style.display =
      "inline-block";

  }


  const category =
    document.getElementById(
      "category"
    );


  if (category) {

    category.value =
      product.category ||
      "other";

  }


  /*
   * تجهيز الأقسام الفرعية
   */

  setupSubcategoryField();


  const subcategory =
    document.getElementById(
      "subcategory"
    );


  if (subcategory) {

    subcategory.value =
      product.subcategory ||
      "";

  }


  const brand =
    document.getElementById(
      "brand"
    );


  if (brand) {

    brand.value =
      product.brand ||
      "";

  }


  const name =
    document.getElementById(
      "name"
    );


  if (name) {

    name.value =
      product.name ||
      "";

  }


  const price =
    document.getElementById(
      "price"
    );


  if (price) {

    price.value =
      product.price ||
      "";

  }


  const battery =
    document.getElementById(
      "battery"
    );


  if (battery) {

    battery.value =
      product.battery ||
      "";

  }


  const screen =
    document.getElementById(
      "screen"
    );


  if (screen) {

    screen.value =
      product.screen ||
      "";

  }


  const storage =
    document.getElementById(
      "storage"
    );


  if (storage) {

    storage.value =
      product.storage ||
      "";

  }


  const colors =
    document.getElementById(
      "colors"
    );


  if (colors) {

    colors.value =
      product.colors ||
      "";

  }


  const description =
    document.getElementById(
      "description"
    );


  if (description) {

    description.value =
      product.description ||
      "";

  }


  const icon =
    document.getElementById(
      "icon"
    );


  if (icon) {

    icon.value =
      product.icon ||
      "";

  }


  const existingImage =
    product.image ||
    "";


  const image =
    document.getElementById(
      "image"
    );


  if (image) {

    image.value =
      existingImage.startsWith(
        "data:image"
      )
        ? ""
        : existingImage;

  }


  selectedImageData =
    existingImage.startsWith(
      "data:image"
    )
      ? existingImage
      : "";


  if (
    imagePreview
  ) {

    if (existingImage) {

      imagePreview.innerHTML = `

        <img
          src="${esc(
            existingImage
          )}"
          alt="صورة المنتج"
        >

      `;

    } else {

      imagePreview.innerHTML =
        "<span>ستظهر معاينة الصورة هنا</span>";

    }

  }


  showSection(
    "add"
  );

}


/* =========================================================
   CANCEL EDIT
========================================================= */

function cancelEdit() {

  resetProductForm();


  showSection(
    "products"
  );

}


/* =========================================================
   RESET PRODUCT FORM
========================================================= */

function resetProductForm() {

  const form =
    document.getElementById(
      "productForm"
    );


  if (form) {

    form.reset();

  }


  editingProductId =
    null;


  selectedImageData =
    "";


  const title =
    document.getElementById(
      "productFormTitle"
    );


  if (title) {

    title.textContent =
      "إضافة منتج جديد";

  }


  const saveButton =
    document.getElementById(
      "saveProductButton"
    );


  if (saveButton) {

    saveButton.textContent =
      "حفظ المنتج";

  }


  const cancelButton =
    document.getElementById(
      "cancelEditButton"
    );


  if (cancelButton) {

    cancelButton.style.display =
      "none";

  }


  if (
    imagePreview
  ) {

    imagePreview.innerHTML =
      "<span>ستظهر معاينة الصورة هنا</span>";

  }


  /*
   * إعادة ضبط القسم الفرعي
   */

  const subcategory =
    document.getElementById(
      "subcategory"
    );


  if (subcategory) {

    subcategory.value =
      "";

  }


  setupSubcategoryField();

}


/* =========================================================
   ADD / EDIT PRODUCT FORM
========================================================= */

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
        document
          .getElementById(
            "name"
          )
          .value
          .trim();


      const price =
        Number(
          document
            .getElementById(
              "price"
            )
            .value
        );


      const description =
        document
          .getElementById(
            "description"
          )
          .value
          .trim();


      const icon =
        document
          .getElementById(
            "icon"
          )
          .value
          .trim() ||
        "📦";


      const category =
        document
          .getElementById(
            "category"
          )
          .value;


      /*
       * القسم الفرعي
       */

      const subcategory =
        document.getElementById(
          "subcategory"
        )?.value ||
        "";


      const brand =
        document
          .getElementById(
            "brand"
          )
          .value
          .trim();


      const battery =
        document
          .getElementById(
            "battery"
          )
          .value
          .trim();


      const screen =
        document
          .getElementById(
            "screen"
          )
          .value
          .trim();


      const storage =
        document
          .getElementById(
            "storage"
          )
          .value
          .trim();


      const colors =
        document
          .getElementById(
            "colors"
          )
          .value
          .trim();


      const imageUrl =
        document
          .getElementById(
            "image"
          )
          .value
          .trim();


      const finalImage =
        selectedImageData ||
        imageUrl;


      const products =
        getProducts();


      /*
       * EDIT EXISTING PRODUCT
       */

      if (
        editingProductId
      ) {

        const index =
          products.findIndex(
            p =>
              p.id ===
              editingProductId
          );


        if (
          index !== -1
        ) {

          products[index] = {

            ...products[index],

            name,

            price,

            description,

            icon,

            category,

            subcategory,

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


        saveProducts(
          products
        );


        alert(
          "تم تعديل المنتج بنجاح ✅"
        );

      }


      /*
       * ADD NEW PRODUCT
       */

      else {

        products.push({

          id:
            Date.now(),

          name,

          price,

          description,

          icon,

          category,

          subcategory,

          brand,

          battery,

          screen,

          storage,

          colors,

          image:
            finalImage

        });


        saveProducts(
          products
        );


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


/* =========================================================
   DASHBOARD NAVIGATION
========================================================= */

function showSection(
  sectionId
) {

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
    .forEach(
      tab => {

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

      }
    );


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

    /*
     * لا نعمل reset هنا
     * حتى لا نخسر بيانات التعديل.
     */

    setupSubcategoryField();

  }


  window.location.hash =
    sectionId;

}


/* =========================================================
   NAVIGATION LINKS
========================================================= */

document
  .querySelectorAll(
    ".nav-tab"
  )
  .forEach(
    tab => {

      tab.addEventListener(

        "click",

        function (e) {

          e.preventDefault();


          showSection(
            this.dataset.section
          );

        }

      );

    }
  );


/* =========================================================
   HASH NAVIGATION
========================================================= */

function loadSectionFromHash() {

  const hash =
    window.location.hash
      .replace(
        "#",
        ""
      );


  const allowed = [

    "dashboard",

    "orders",

    "products",

    "add"

  ];


  if (
    allowed.includes(
      hash
    )
  ) {

    showSection(
      hash
    );

  } else {

    showSection(
      "dashboard"
    );

  }

}


/* =========================================================
   START
========================================================= */

setupSubcategoryField();

render();

initFirebaseSync(render);

loadSectionFromHash();
