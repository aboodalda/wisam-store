/* =========================================================
   WISAM STORE
   STORE.JS
   Products + Categories + Cart + Checkout
========================================================= */


/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const defaultProducts = [

  {
    id: 1,
    name: "هاتف ذكي",
    brand: "عام",
    category: "phones",
    subcategory: "iphone",
    price: 1299,
    description: "أداء قوي وتصميم أنيق",
    battery: "5000 mAh",
    storage: "128GB",
    screen: "6.6 بوصة",
    icon: "📱"
  },

  {
    id: 2,
    name: "ساعة ذكية",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 499,
    description: "أناقة وتقنية في معصمك",
    icon: "⌚"
  },

  {
    id: 3,
    name: "سماعات لاسلكية",
    brand: "عام",
    category: "phones",
    subcategory: "other",
    price: 299,
    description: "صوت نقي وتجربة مريحة",
    icon: "🎧"
  },

  {
    id: 4,
    name: "جهاز ألعاب",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 1899,
    description: "تجربة ألعاب احترافية",
    storage: "1TB",
    icon: "🎮"
  }

];


/* =========================================================
   CATEGORY NAMES
========================================================= */

const categoryNames = {

  all: "الكل",

  phones: "الجوالات",

  watches: "الساعات الذكية",

  playstation: "PlayStation"

};


/* =========================================================
   SUBCATEGORY NAMES
========================================================= */

const subcategoryNames = {

  iphone: "iPhone",

  samsung: "Samsung",

  huawei: "Huawei",

  redmi: "Redmi",

  xiaomi: "Xiaomi",

  other: "أخرى",

  "apple-watch": "Apple Watch",

  "samsung-watch": "Samsung Watch",

  "huawei-watch": "Huawei Watch",

  ps5: "PlayStation 5",

  ps4: "PlayStation 4",

  ps3: "PlayStation 3"

};


/* =========================================================
   CURRENT FILTER
========================================================= */

let currentCategory = "all";

let currentSubcategory = "all";


/* =========================================================
   GET PRODUCTS
========================================================= */

function getProducts() {

  try {

    const saved = JSON.parse(
      localStorage.getItem("wisamProducts")
    );

    if (
      Array.isArray(saved) &&
      saved.length
    ) {

      return saved;

    }

    return defaultProducts;

  } catch (e) {

    return defaultProducts;

  }

}


/* =========================================================
   CART
========================================================= */

let cart = [];

try {

  cart = JSON.parse(
    localStorage.getItem("wisamCart") || "[]"
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }

} catch (e) {

  cart = [];

}


/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(value) {

  return String(value ?? "").replace(
    /[&<>"']/g,

    function (match) {

      return {

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

      }[match];

    }
  );

}


function money(number) {

  return (
    Number(number || 0)
      .toLocaleString("ar-SA") +
    " ر.س"
  );

}


function subName(product) {

  return (
    subcategoryNames[product.subcategory] ||
    product.brand ||
    categoryNames[product.category] ||
    "منتج"
  );

}


/* =========================================================
   CATEGORY SYSTEM
========================================================= */

function createCategoryNavigation() {

  const grid = document.getElementById(
    "productGrid"
  );

  if (!grid) return;


  /* لا نكرر القائمة إذا كانت موجودة */

  if (
    document.getElementById(
      "storeCategoryNavigation"
    )
  ) {

    return;

  }


  const wrapper = document.createElement("div");

  wrapper.id =
    "storeCategoryNavigation";

  wrapper.className =
    "store-category-navigation";


  wrapper.innerHTML = `

    <div class="category-main-buttons">

      <button
        class="category-main-btn active"
        data-category="all"
      >
        ✨ الكل
      </button>

      <button
        class="category-main-btn"
        data-category="phones"
      >
        📱 الجوالات
      </button>

      <button
        class="category-main-btn"
        data-category="watches"
      >
        ⌚ الساعات الذكية
      </button>

      <button
        class="category-main-btn"
        data-category="playstation"
      >
        🎮 PlayStation
      </button>

    </div>

    <div
      id="subcategoryNavigation"
      class="subcategory-navigation"
    ></div>

  `;


  grid.parentNode.insertBefore(
    wrapper,
    grid
  );


  wrapper
    .querySelectorAll(
      ".category-main-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          currentCategory =
            this.dataset.category;

          currentSubcategory = "all";


          wrapper
            .querySelectorAll(
              ".category-main-btn"
            )
            .forEach(btn =>
              btn.classList.remove(
                "active"
              )
            );


          this.classList.add(
            "active"
          );


          renderSubcategories();

          renderProducts();

        }
      );

    });


  renderSubcategories();

}


/* =========================================================
   SUBCATEGORY NAVIGATION
========================================================= */

function renderSubcategories() {

  const box =
    document.getElementById(
      "subcategoryNavigation"
    );

  if (!box) return;


  if (
    currentCategory === "all"
  ) {

    box.innerHTML = "";

    return;

  }


  const products =
    getProducts();


  let available = [];


  products.forEach(product => {

    if (
      product.category ===
      currentCategory
    ) {

      if (
        product.subcategory &&
        !available.includes(
          product.subcategory
        )
      ) {

        available.push(
          product.subcategory
        );

      }

    }

  });


  /*
    إذا لم توجد منتجات بعد،
    نظهر الأقسام الأساسية
  */

  if (
    !available.length
  ) {

    if (
      currentCategory ===
      "phones"
    ) {

      available = [
        "iphone",
        "samsung",
        "huawei",
        "redmi",
        "xiaomi"
      ];

    }


    if (
      currentCategory ===
      "watches"
    ) {

      available = [
        "apple-watch",
        "samsung-watch",
        "huawei-watch"
      ];

    }


    if (
      currentCategory ===
      "playstation"
    ) {

      available = [
        "ps5",
        "ps4",
        "ps3"
      ];

    }

  }


  box.innerHTML = `

    <button
      class="subcategory-btn active"
      data-subcategory="all"
    >
      الكل
    </button>

    ${available.map(item => `

      <button
        class="subcategory-btn"
        data-subcategory="${escapeHtml(item)}"
      >
        ${escapeHtml(
          subcategoryNames[item] ||
          item
        )}
      </button>

    `).join("")}

  `;


  box
    .querySelectorAll(
      ".subcategory-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          currentSubcategory =
            this.dataset.subcategory;


          box
            .querySelectorAll(
              ".subcategory-btn"
            )
            .forEach(btn =>
              btn.classList.remove(
                "active"
              )
            );


          this.classList.add(
            "active"
          );


          renderProducts();

        }
      );

    });

}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function getFilteredProducts() {

  let products =
    getProducts();


  if (
    currentCategory !==
    "all"
  ) {

    products =
      products.filter(
        product =>
          product.category ===
          currentCategory
      );

  }


  if (
    currentSubcategory !==
    "all"
  ) {

    products =
      products.filter(
        product =>
          product.subcategory ===
          currentSubcategory
      );

  }


  return products;

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  if (!grid) return;


  const products =
    getFilteredProducts();


  if (!products.length) {

    grid.innerHTML = `

      <div
        class="empty-products"
      >

        <div>
          📦
        </div>

        <h3>
          لا توجد منتجات هنا حاليًا
        </h3>

        <p>
          سيتم إضافة منتجات هذا القسم قريبًا.
        </p>

      </div>

    `;

    return;

  }


  grid.innerHTML =
    products
      .map(
        (product, index) => `

      <article
        class="product-card"
        style="animation-delay:${Math.min(
          index * 60,
          400
        )}ms"
        onclick="openProduct(${product.id})"
      >

        <div class="product-image">

          ${
            product.image

              ? `

                <img
                  src="${escapeHtml(
                    product.image
                  )}"
                  alt="${escapeHtml(
                    product.name
                  )}"
                >

              `

              : escapeHtml(
                  product.icon ||
                  "📦"
                )
          }

        </div>


        <div class="product-info">

          <div class="product-meta">

            ${escapeHtml(
              categoryNames[
                product.category
              ] ||
              "منتج"
            )}

            ·

            ${escapeHtml(
              subName(product)
            )}

          </div>


          <h3>
            ${escapeHtml(
              product.name
            )}
          </h3>


          <p>
            ${escapeHtml(
              product.description ||
              "منتج مميز من وسام ستور"
            )}
          </p>


          <div class="product-specs">

            ${
              product.battery

                ? `

                  <span class="spec-pill">
                    🔋 ${escapeHtml(
                      product.battery
                    )}
                  </span>

                `

                : ""
            }


            ${
              product.storage

                ? `

                  <span class="spec-pill">
                    💾 ${escapeHtml(
                      product.storage
                    )}
                  </span>

                `

                : ""
            }


            ${
              product.screen

                ? `

                  <span class="spec-pill">
                    📱 ${escapeHtml(
                      product.screen
                    )}
                  </span>

                `

                : ""
            }

          </div>


          <span class="price">
            ${money(product.price)}
          </span>


          <button
            class="add-btn"
            onclick="
              event.stopPropagation();
              addToCart(${product.id})
            "
          >
            أضف إلى السلة
          </button>


          <button
            class="details-btn"
            onclick="
              event.stopPropagation();
              openProduct(${product.id})
            "
          >
            عرض التفاصيل
          </button>

        </div>

      </article>

    `
      )
      .join("");

}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

function openProduct(id) {

  const product =
    getProducts().find(
      item => item.id == id
    );


  if (!product) return;


  const details =
    document.getElementById(
      "productDetails"
    );


  if (!details) return;


  details.innerHTML = `

    <div class="detail-layout">


      <div class="detail-image">

        ${
          product.image

            ? `

              <img
                src="${escapeHtml(
                  product.image
                )}"
                alt="${escapeHtml(
                  product.name
                )}"
              >

            `

            : `

              <span class="detail-icon">
                ${escapeHtml(
                  product.icon ||
                  "📦"
                )}
              </span>

            `
        }

      </div>


      <div class="detail-content">


        <span class="eyebrow">

          ${escapeHtml(
            categoryNames[
              product.category
            ] ||
            "WISAM STORE"
          )}

        </span>


        <h2>
          ${escapeHtml(
            product.name
          )}
        </h2>


        <div class="detail-brand">

          ${escapeHtml(
            product.brand ||
            subName(product)
          )}

        </div>


        <div class="detail-price">

          ${money(product.price)}

        </div>


        <p class="detail-description">

          ${escapeHtml(
            product.description ||
            "منتج مميز من وسام ستور."
          )}

        </p>


        <div class="spec-grid">


          <div class="spec-item">

            <small>
              الفئة
            </small>

            <strong>
              ${escapeHtml(
                subName(product)
              )}
            </strong>

          </div>


          ${
            product.battery

              ? `

                <div class="spec-item">

                  <small>
                    البطارية
                  </small>

                  <strong>
                    ${escapeHtml(
                      product.battery
                    )}
                  </strong>

                </div>

              `

              : ""
          }


          ${
            product.storage

              ? `

                <div class="spec-item">

                  <small>
                    التخزين
                  </small>

                  <strong>
                    ${escapeHtml(
                      product.storage
                    )}
                  </strong>

                </div>

              `

              : ""
          }


          ${
            product.screen

              ? `

                <div class="spec-item">

                  <small>
                    الشاشة
                  </small>

                  <strong>
                    ${escapeHtml(
                      product.screen
                    )}
                  </strong>

                </div>

              `

              : ""
          }


        </div>


        <button
          class="primary-btn"
          style="width:100%;margin-top:5px"
          onclick="
            addToCart(${product.id});
            closeProduct();
          "
        >

          أضف إلى السلة 🛒

        </button>


      </div>

    </div>

  `;


  const modal =
    document.getElementById(
      "productModal"
    );


  modal.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";

}


/* =========================================================
   CLOSE PRODUCT
========================================================= */

function closeProduct() {

  const modal =
    document.getElementById(
      "productModal"
    );


  if (!modal) return;


  modal.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

  const product =
    getProducts().find(
      item => item.id == id
    );


  if (!product) return;


  const item =
    cart.find(
      item => item.id == id
    );


  if (item) {

    item.qty++;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price:
        Number(product.price) ||
        0,

      qty: 1

    });

  }


  saveCart();

  openCart();

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

  localStorage.setItem(
    "wisamCart",
    JSON.stringify(cart)
  );


  renderCart();

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const count =
    document.getElementById(
      "cartCount"
    );


  const box =
    document.getElementById(
      "cartItems"
    );


  const total =
    document.getElementById(
      "cartTotal"
    );


  if (!count || !box || !total)
    return;


  count.textContent =
    cart.reduce(
      (sum, item) =>
        sum + item.qty,
      0
    );


  if (!cart.length) {

    box.innerHTML = `

      <div
        class="empty-cart"
        style="
          text-align:center;
          padding:50px 20px;
          color:#999;
        "
      >

        <div
          style="
            font-size:55px;
            margin-bottom:15px;
          "
        >
          🛒
        </div>

        <h3
          style="
            color:#333;
            margin-bottom:8px;
          "
        >
          السلة فارغة
        </h3>

        <p>
          أضف منتجًا للبدء بالطلب.
        </p>

      </div>

    `;

  } else {

    box.innerHTML =
      cart
        .map(
          item => `

        <div class="cart-row">

          <div>

            <b>
              ${escapeHtml(
                item.name
              )}
            </b>

            <br>

            <span>
              ${money(item.price)}
            </span>

          </div>


          <div class="qty">

            <button
              onclick="
                changeQty(
                  ${item.id},
                  -1
                )
              "
            >
              −
            </button>


            ${item.qty}


            <button
              onclick="
                changeQty(
                  ${item.id},
                  1
                )
              "
            >
              +
            </button>

          </div>

        </div>

      `
        )
        .join("");

  }


  total.textContent =
    cart
      .reduce(
        (sum, item) =>
          sum +
          item.price *
          item.qty,
        0
      )
      .toLocaleString(
        "ar-SA"
      );

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQty(
  id,
  amount
) {

  const item =
    cart.find(
      product =>
        product.id == id
    );


  if (!item) return;


  item.qty += amount;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        product =>
          product.id != id
      );

  }


  saveCart();

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

  const drawer =
    document.getElementById(
      "cartDrawer"
    );

  const overlay =
    document.getElementById(
      "overlay"
    );


  drawer.classList.add(
    "open"
  );

  overlay.classList.add(
    "show"
  );

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCart() {

  const drawer =
    document.getElementById(
      "cartDrawer"
    );

  const overlay =
    document.getElementById(
      "overlay"
    );


  drawer.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );

}


/* =========================================================
   CHECKOUT
========================================================= */

function openCheckout() {

  if (!cart.length) {

    alert(
      "السلة فارغة."
    );

    return;

  }


  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.qty,
      0
    );


  document.getElementById(
    "checkoutTotal"
  ).textContent =
    total.toLocaleString(
      "ar-SA"
    ) + " ر.س";


  document.getElementById(
    "checkoutModal"
  ).classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";


  closeCart();

}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

function closeCheckout() {

  document.getElementById(
    "checkoutModal"
  ).classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   CLOSE SUCCESS
========================================================= */

function closeSuccess() {

  document.getElementById(
    "orderSuccessModal"
  ).classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   CHECKOUT FORM
========================================================= */

function setupCheckout() {

  const form =
    document.getElementById(
      "checkoutForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      if (!cart.length) {

        closeCheckout();

        return;

      }


      const payment =
        document.querySelector(
          'input[name="payment"]:checked'
        )?.value ||
        "cod";


      const order = {

        id:
          "WS-" +
          Date.now()
            .toString()
            .slice(-8),


        customer: {

          name:
            document
              .getElementById(
                "customerName"
              )
              .value
              .trim(),

          phone:
            document
              .getElementById(
                "customerPhone"
              )
              .value
              .trim(),

          city:
            document
              .getElementById(
                "customerCity"
              )
              .value
              .trim(),

          address:
            document
              .getElementById(
                "customerAddress"
              )
              .value
              .trim()

        },


        payment,


        items:
          cart.map(
            item => ({
              ...item
            })
          ),


        total:
          cart.reduce(
            (sum, item) =>
              sum +
              item.price *
              item.qty,
            0
          ),


        status:
          "new",


        createdAt:
          new Date().toISOString()

      };


      const orders =
        JSON.parse(
          localStorage.getItem(
            "wisamOrders"
          ) || "[]"
        );


      orders.unshift(
        order
      );


      localStorage.setItem(
        "wisamOrders",
        JSON.stringify(
          orders
        )
      );


      cart = [];


      saveCart();


      form.reset();


      closeCheckout();


      document.getElementById(
        "orderNumber"
      ).textContent =
        order.id;


      document.getElementById(
        "orderSuccessModal"
      ).classList.add(
        "show"
      );


      document.body.style.overflow =
        "hidden";

    }
  );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  const cartButton =
    document.getElementById(
      "cartButton"
    );

  const closeCartButton =
    document.getElementById(
      "closeCart"
    );

  const overlay =
    document.getElementById(
      "overlay"
    );

  const closeProductButton =
    document.getElementById(
      "closeProductModal"
    );

  const checkoutButton =
    document.getElementById(
      "checkoutButton"
    );

  const closeCheckoutButton =
    document.getElementById(
      "closeCheckout"
    );

  const closeSuccessButton =
    document.getElementById(
      "closeSuccess"
    );


  if (cartButton)
    cartButton.onclick =
      openCart;


  if (closeCartButton)
    closeCartButton.onclick =
      closeCart;


  if (overlay)
    overlay.onclick =
      closeCart;


  if (closeProductButton)
    closeProductButton.onclick =
      closeProduct;


  if (checkoutButton)
    checkoutButton.onclick =
      openCheckout;


  if (closeCheckoutButton)
    closeCheckoutButton.onclick =
      closeCheckout;


  if (closeSuccessButton)
    closeSuccessButton.onclick =
      closeSuccess;


  const productModal =
    document.getElementById(
      "productModal"
    );


  if (productModal) {

    productModal.addEventListener(
      "click",
      function (event) {

        if (
          event.target.id ===
          "productModal"
        ) {

          closeProduct();

        }

      }
    );

  }


  const checkoutModal =
    document.getElementById(
      "checkoutModal"
    );


  if (checkoutModal) {

    checkoutModal.addEventListener(
      "click",
      function (event) {

        if (
          event.target.id ===
          "checkoutModal"
        ) {

          closeCheckout();

        }

      }
    );

  }


  const successModal =
    document.getElementById(
      "orderSuccessModal"
    );


  if (successModal) {

    successModal.addEventListener(
      "click",
      function (event) {

        if (
          event.target.id ===
          "orderSuccessModal"
        ) {

          closeSuccess();

        }

      }
    );

  }


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key ===
        "Escape"
      ) {

        closeProduct();

        closeCart();

        closeCheckout();

        closeSuccess();

      }

    }
  );

}


/* =========================================================
   ADD CATEGORY CSS
   يتم إضافته تلقائيًا حتى لا تحتاج تعديل index.html
========================================================= */

function injectCategoryStyles() {

  if (
    document.getElementById(
      "wisamCategoryStyles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "wisamCategoryStyles";


  style.textContent = `

    .store-category-navigation{
      margin-bottom:32px;
    }

    .category-main-buttons{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-bottom:14px;
    }

    .category-main-btn{
      border:1px solid #e3e1da;
      background:#fff;
      color:#222;
      padding:13px 20px;
      border-radius:14px;
      cursor:pointer;
      font-family:inherit;
      font-weight:800;
      transition:.25s;
    }

    .category-main-btn:hover{
      border-color:#c99a3f;
      transform:translateY(-2px);
    }

    .category-main-btn.active{
      background:#111;
      color:#fff;
      border-color:#111;
      box-shadow:0 8px 20px #00000014;
    }

    .subcategory-navigation{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      min-height:0;
    }

    .subcategory-btn{
      border:1px solid #e5e3dc;
      background:#f7f6f2;
      color:#666;
      padding:9px 15px;
      border-radius:10px;
      cursor:pointer;
      font-family:inherit;
      font-size:13px;
      transition:.2s;
    }

    .subcategory-btn:hover{
      border-color:#c99a3f;
      color:#222;
    }

    .subcategory-btn.active{
      background:#c99a3f;
      color:#111;
      border-color:#c99a3f;
      font-weight:800;
    }

    .empty-products{
      grid-column:1/-1;
      text-align:center;
      background:#fff;
      border:1px solid #e5e5df;
      border-radius:22px;
      padding:70px 20px;
    }

    .empty-products div{
      font-size:55px;
      margin-bottom:15px;
    }

    .empty-products h3{
      margin:0 0 8px;
      font-size:22px;
    }

    .empty-products p{
      color:#999;
      margin:0;
    }

    @media(max-width:600px){

      .category-main-buttons{
        display:grid;
        grid-template-columns:1fr 1fr;
      }

      .category-main-btn{
        padding:12px 8px;
        font-size:13px;
      }

      .subcategory-navigation{
        overflow-x:auto;
        flex-wrap:nowrap;
        padding-bottom:5px;
      }

      .subcategory-btn{
        white-space:nowrap;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   START STORE
========================================================= */

function initStore() {

  injectCategoryStyles();

  createCategoryNavigation();

  renderProducts();

  renderCart();

  setupEvents();

  setupCheckout();

}


/* =========================================================
   RUN
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initStore
  );

} else {

  initStore();

}
