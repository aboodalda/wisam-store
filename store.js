/* =========================================================
   WISAM STORE
   STORE.JS
   Search + Discounts + Product Details + Cart + WhatsApp
========================================================= */

const WHATSAPP_NUMBER = "970592936150";

const defaultProducts = [
  {
    id: 1,
    name: "هاتف ذكي",
    brand: "عام",
    category: "phones",
    subcategory: "iphone",
    price: 1299,
    oldPrice: 1499,
    description: "هاتف ذكي بأداء قوي وتصميم أنيق.",
    battery: "5000 mAh",
    storage: "128GB",
    screen: "6.6 بوصة",
    colors: "أسود، أبيض، أزرق",
    icon: "📱"
  },
  {
    id: 2,
    name: "ساعة ذكية",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 499,
    oldPrice: 599,
    description: "أناقة وتقنية متطورة في معصمك.",
    battery: "18 ساعة",
    storage: "",
    screen: "1.9 بوصة",
    colors: "أسود، فضي",
    icon: "⌚"
  },
  {
    id: 3,
    name: "سماعات لاسلكية",
    brand: "عام",
    category: "headphones",
    subcategory: "other",
    price: 299,
    oldPrice: 349,
    description: "صوت نقي وتجربة استماع مريحة.",
    battery: "24 ساعة",
    storage: "",
    screen: "",
    colors: "أبيض، أسود",
    icon: "🎧"
  },
  {
    id: 4,
    name: "جهاز ألعاب",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 1899,
    oldPrice: 2099,
    description: "تجربة ألعاب احترافية وأداء قوي.",
    battery: "",
    storage: "1TB",
    screen: "",
    colors: "أبيض",
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
  headphones: "السماعات",
  playstation: "PlayStation",
  other: "منتجات أخرى"
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
   STATE
========================================================= */

let currentCategory = "all";
let currentSubcategory = "all";
let searchQuery = "";

let cart = [];


/* =========================================================
   CART LOAD
========================================================= */

try {
  cart = JSON.parse(
    localStorage.getItem("wisamCart") || "[]"
  );

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch (error) {
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
    Number(number || 0).toLocaleString("ar-SA") +
    " ر.س"
  );
}


function getDiscount(product) {
  const price = Number(product.price || 0);

  const oldPrice = Number(
    product.oldPrice ||
    product.originalPrice ||
    product.comparePrice ||
    0
  );

  if (oldPrice > price && price > 0) {
    return Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }

  return Number(product.discount || 0);
}


function getOldPrice(product) {
  const oldPrice = Number(
    product.oldPrice ||
    product.originalPrice ||
    product.comparePrice ||
    0
  );

  return oldPrice > Number(product.price || 0)
    ? oldPrice
    : 0;
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
   PRODUCTS
========================================================= */

function getProducts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("wisamProducts")
    );

    if (Array.isArray(saved) && saved.length) {
      return saved;
    }

    return defaultProducts;
  } catch (error) {
    return defaultProducts;
  }
}


/* =========================================================
   SEARCH + CATEGORY UI
========================================================= */

function createStoreTools() {

  const grid =
    document.getElementById("productGrid");

  if (!grid) return;

  if (
    document.getElementById(
      "wisamStoreTools"
    )
  ) {
    return;
  }


  const tools =
    document.createElement("div");

  tools.id = "wisamStoreTools";


  tools.innerHTML = `

    <div class="wisam-search-box">

      <span class="wisam-search-icon">
        🔎
      </span>

      <input
        id="wisamSearch"
        type="search"
        placeholder="ابحث عن منتج، شركة، أو قسم..."
        autocomplete="off"
      >

      <button
        id="clearWisamSearch"
        type="button"
        aria-label="مسح البحث"
      >
        ×
      </button>

    </div>


    <div class="wisam-search-result">
      <span id="wisamSearchResult">
        جميع المنتجات
      </span>
    </div>

  `;


  grid.parentNode.insertBefore(
    tools,
    grid
  );


  const searchInput =
    document.getElementById(
      "wisamSearch"
    );


  const clearButton =
    document.getElementById(
      "clearWisamSearch"
    );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {

        searchQuery =
          this.value.trim().toLowerCase();

        renderProducts();

      }
    );

  }


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      function () {

        searchQuery = "";

        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }

        renderProducts();

      }
    );

  }
}


/* =========================================================
   CATEGORY NAVIGATION
========================================================= */

function createCategoryNavigation() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  if (!grid) return;


  if (
    document.getElementById(
      "storeCategoryNavigation"
    )
  ) {
    return;
  }


  const wrapper =
    document.createElement("div");


  wrapper.id =
    "storeCategoryNavigation";


  wrapper.className =
    "store-category-navigation";


  wrapper.innerHTML = `

    <div class="category-main-buttons">

      <button
        class="category-main-btn active"
        data-category="all"
        type="button"
      >
        ✨ الكل
      </button>

      <button
        class="category-main-btn"
        data-category="phones"
        type="button"
      >
        📱 الجوالات
      </button>

      <button
        class="category-main-btn"
        data-category="watches"
        type="button"
      >
        ⌚ الساعات الذكية
      </button>

      <button
        class="category-main-btn"
        data-category="headphones"
        type="button"
      >
        🎧 السماعات
      </button>

      <button
        class="category-main-btn"
        data-category="playstation"
        type="button"
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

          currentSubcategory =
            "all";


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
   SUBCATEGORIES
========================================================= */

function renderSubcategories() {

  const box =
    document.getElementById(
      "subcategoryNavigation"
    );

  if (!box) return;


  if (currentCategory === "all") {

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


  if (!available.length) {

    if (currentCategory === "phones") {

      available = [
        "iphone",
        "samsung",
        "huawei",
        "redmi",
        "xiaomi"
      ];

    }


    if (currentCategory === "watches") {

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
      type="button"
    >
      الكل
    </button>

    ${available.map(item => `

      <button
        class="subcategory-btn"
        data-subcategory="${escapeHtml(item)}"
        type="button"
      >
        ${escapeHtml(
          subcategoryNames[item] || item
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
    currentCategory !== "all"
  ) {

    products =
      products.filter(
        product =>
          product.category ===
          currentCategory
      );

  }


  if (
    currentSubcategory !== "all"
  ) {

    products =
      products.filter(
        product =>
          product.subcategory ===
          currentSubcategory
      );

  }


  if (searchQuery) {

    products =
      products.filter(
        product => {

          const text = [

            product.name,

            product.brand,

            product.category,

            product.subcategory,

            categoryNames[
              product.category
            ],

            subcategoryNames[
              product.subcategory
            ],

            product.description

          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


          return text.includes(
            searchQuery
          );

        }
      );

  }


  return products;
}


/* =========================================================
   PRODUCT SPECS
========================================================= */

function getProductSpecs(product) {

  const specs = [];


  if (product.brand) {

    specs.push({
      icon: "🏷️",
      label: "العلامة التجارية",
      value: product.brand
    });

  }


  if (product.battery) {

    specs.push({
      icon: "🔋",
      label:
        product.category === "headphones"
          ? "عمر البطارية"
          : "البطارية",
      value: product.battery
    });

  }


  if (product.screen) {

    specs.push({
      icon: "📱",
      label: "حجم الشاشة",
      value: product.screen
    });

  }


  if (product.storage) {

    specs.push({
      icon: "💾",
      label: "التخزين",
      value: product.storage
    });

  }


  if (product.colors) {

    specs.push({
      icon: "🎨",
      label: "الألوان",
      value: product.colors
    });

  }


  return specs;
}


/* =========================================================
   PRODUCT SPECS ON CARD
========================================================= */

function renderProductSpecs(product) {

  const specs =
    getProductSpecs(product);


  return specs
    .slice(0, 3)
    .map(
      spec => `

        <span class="spec-pill">

          ${spec.icon}

          ${escapeHtml(
            spec.value
          )}

        </span>

      `
    )
    .join("");
}


/* =========================================================
   PRICE HTML
========================================================= */

function renderPrice(product) {

  const price =
    Number(product.price || 0);

  const oldPrice =
    getOldPrice(product);

  const discount =
    getDiscount(product);


  if (
    oldPrice &&
    oldPrice > price
  ) {

    return `

      <div class="price-box">

        <span class="old-price">
          ${money(oldPrice)}
        </span>

        <span class="price">
          ${money(price)}
        </span>

      </div>

      ${
        discount
          ? `
            <span class="discount-badge">
              خصم ${discount}%
            </span>
          `
          : ""
      }

    `;

  }


  return `

    <div class="price-box">

      <span class="price">
        ${money(price)}
      </span>

    </div>

  `;
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


  const result =
    document.getElementById(
      "wisamSearchResult"
    );


  if (result) {

    if (searchQuery) {

      result.textContent =
        `نتائج البحث عن "${searchQuery}" · ${products.length} منتج`;

    } else {

      result.textContent =
        `${products.length} منتج متوفر`;

    }

  }


  if (!products.length) {

    grid.innerHTML = `

      <div class="empty-products">

        <div>
          🔎
        </div>

        <h3>
          لم نجد المنتج الذي تبحث عنه
        </h3>

        <p>
          جرّب كلمة بحث أخرى أو اختر قسمًا مختلفًا.
        </p>

        <button
          class="primary-btn"
          type="button"
          onclick="
            searchQuery='';
            const s=document.getElementById('wisamSearch');
            if(s)s.value='';
            renderProducts();
          "
        >
          عرض جميع المنتجات
        </button>

      </div>

    `;

    return;
  }


  grid.innerHTML =
    products.map(
      (product, index) => {

        const discount =
          getDiscount(product);

        const oldPrice =
          getOldPrice(product);


        return `

          <article
            class="product-card"
            style="
              animation-delay:${Math.min(
                index * 60,
                400
              )}ms
            "
            onclick="openProduct(${product.id})"
          >

            <div class="product-image">

              ${
                discount
                  ? `
                    <span class="card-discount">
                      -${discount}%
                    </span>
                  `
                  : ""
              }

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
                      loading="lazy"
                    >
                  `
                  : `
                    <span class="product-placeholder">
                      ${escapeHtml(
                        product.icon ||
                        "📦"
                      )}
                    </span>
                  `
              }

            </div>


            <div class="product-info">

              <div class="product-meta">

                ${escapeHtml(
                  categoryNames[
                    product.category
                  ] || "منتج"
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

                ${renderProductSpecs(
                  product
                )}

              </div>


              ${renderPrice(product)}


              <button
                class="add-btn"
                type="button"
                onclick="
                  event.stopPropagation();
                  addToCart(${product.id});
                "
              >
                أضف إلى السلة
              </button>


              <button
                class="details-btn"
                type="button"
                onclick="
                  event.stopPropagation();
                  openProduct(${product.id});
                "
              >
                عرض التفاصيل
              </button>

            </div>

          </article>

        `;

      }
    ).join("");
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


  const specs =
    getProductSpecs(product);


  const discount =
    getDiscount(product);


  const oldPrice =
    getOldPrice(product);


  details.innerHTML = `

    <div class="detail-layout">

      <div class="detail-image">

        ${
          discount
            ? `
              <span class="detail-discount">
                خصم ${discount}%
              </span>
            `
            : ""
        }


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


        <div class="detail-price-box">

          ${
            oldPrice
              ? `
                <span class="detail-old-price">
                  ${money(oldPrice)}
                </span>
              `
              : ""
          }

          <strong class="detail-price">
            ${money(product.price)}
          </strong>

          ${
            discount
              ? `
                <span class="detail-discount-text">
                  خصم ${discount}%
                </span>
              `
              : ""
          }

        </div>


        <p class="detail-description">
          ${escapeHtml(
            product.description ||
            "منتج مميز من وسام ستور."
          )}
        </p>


        ${
          specs.length
            ? `

              <div class="spec-grid">

                ${specs
                  .map(
                    spec => `

                      <div class="spec-item">

                        <small>
                          ${escapeHtml(
                            spec.label
                          )}
                        </small>

                        <strong>

                          ${spec.icon}

                          ${escapeHtml(
                            spec.value
                          )}

                        </strong>

                      </div>

                    `
                  )
                  .join("")}

              </div>

            `
            : ""
        }


        <div class="detail-actions">

          <button
            class="primary-btn"
            type="button"
            onclick="
              addToCart(${product.id});
              closeProduct();
            "
          >
            أضف إلى السلة 🛒
          </button>


          <button
            class="whatsapp-product-btn"
            type="button"
            onclick="
              orderProductWhatsApp(${product.id});
            "
          >
            💬 اطلب عبر واتساب
          </button>

        </div>


        <div class="secure-note">
          🔒 طلبك يتم تجهيزه بعناية من وسام ستور
        </div>

      </div>

    </div>

  `;


  const modal =
    document.getElementById(
      "productModal"
    );


  if (!modal) return;


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


  const existing =
    cart.find(
      item => item.id == id
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price:
        Number(product.price) || 0,

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


  if (!count || !box || !total) {
    return;
  }


  count.textContent =
    cart.reduce(
      (sum, item) =>
        sum + Number(item.qty || 0),
      0
    );


  if (!cart.length) {

    box.innerHTML = `

      <div
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
      cart.map(
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
                type="button"
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
                type="button"
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
      ).join("");

  }


  const cartTotal =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
        Number(item.qty || 0),
      0
    );


  total.textContent =
    cartTotal.toLocaleString(
      "ar-SA"
    );
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQty(id, amount) {

  const item =
    cart.find(
      product =>
        product.id == id
    );


  if (!item) return;


  item.qty =
    Number(item.qty || 0) +
    amount;


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


  if (!drawer || !overlay) return;


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


  if (!drawer || !overlay) return;


  drawer.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );
}


/* =========================================================
   WHATSAPP - PRODUCT
========================================================= */

function orderProductWhatsApp(id) {

  const product =
    getProducts().find(
      item => item.id == id
    );


  if (!product) return;


  const discount =
    getDiscount(product);


  const message = [

    "🛍️ طلب جديد من وسام ستور",

    "",

    "📦 المنتج:",
    product.name,

    product.brand
      ? `🏷️ الشركة: ${product.brand}`
      : "",

    `💰 السعر: ${money(product.price)}`,

    discount
      ? `🔥 الخصم: ${discount}%`
      : "",

    "",

    "أرغب بطلب هذا المنتج.",

  ]
    .filter(Boolean)
    .join("\n");


  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(
      message
    );


  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   WHATSAPP - CART
========================================================= */

function orderCartWhatsApp() {

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
        Number(item.price || 0) *
        Number(item.qty || 0),
      0
    );


  const productsText =
    cart
      .map(
        item =>
          `• ${item.name} × ${item.qty} — ${money(
            item.price * item.qty
          )}`
      )
      .join("\n");


  const message = [

    "🛍️ طلب جديد من وسام ستور",

    "",

    "📦 المنتجات:",

    productsText,

    "",

    `💰 الإجمالي: ${money(total)}`,

    "",

    "أرغب بتأكيد هذا الطلب.",

    "يرجى التواصل معي لإتمام الطلب."

  ].join("\n");


  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(
      message
    );


  window.open(
    url,
    "_blank"
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
        Number(item.price || 0) *
        Number(item.qty || 0),
      0
    );


  const checkoutTotal =
    document.getElementById(
      "checkoutTotal"
    );


  if (checkoutTotal) {

    checkoutTotal.textContent =
      total.toLocaleString(
        "ar-SA"
      ) + " ر.س";

  }


  const checkoutModal =
    document.getElementById(
      "checkoutModal"
    );


  if (checkoutModal) {

    checkoutModal.classList.add(
      "show"
    );

  }


  document.body.style.overflow =
    "hidden";


  closeCart();
}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

function closeCheckout() {

  const modal =
    document.getElementById(
      "checkoutModal"
    );


  if (modal) {

    modal.classList.remove(
      "show"
    );

  }


  document.body.style.overflow =
    "";
}


/* =========================================================
   SUCCESS
========================================================= */

function closeSuccess() {

  const modal =
    document.getElementById(
      "orderSuccessModal"
    );


  if (modal) {

    modal.classList.remove(
      "show"
    );

  }


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
        )?.value || "cod";


      const customerName =
        document.getElementById(
          "customerName"
        )?.value.trim() || "";


      const customerPhone =
        document.getElementById(
          "customerPhone"
        )?.value.trim() || "";


      const customerCity =
        document.getElementById(
          "customerCity"
        )?.value.trim() || "";


      const customerAddress =
        document.getElementById(
          "customerAddress"
        )?.value.trim() || "";


      const total =
        cart.reduce(
          (sum, item) =>
            sum +
            Number(item.price || 0) *
            Number(item.qty || 0),
          0
        );


      const order = {

        id:
          "WS-" +
          Date.now()
            .toString()
            .slice(-8),

        customer: {

          name:
            customerName,

          phone:
            customerPhone,

          city:
            customerCity,

          address:
            customerAddress

        },

        payment,

        items:
          cart.map(
            item => ({
              ...item
            })
          ),

        total,

        status:
          "new",

        createdAt:
          new Date().toISOString()

      };


      let orders = [];


      try {

        orders =
          JSON.parse(
            localStorage.getItem(
              "wisamOrders"
            ) || "[]"
          );


        if (!Array.isArray(orders)) {
          orders = [];
        }

      } catch (error) {

        orders = [];

      }


      orders.unshift(
        order
      );


      localStorage.setItem(
        "wisamOrders",
        JSON.stringify(
          orders
        )
      );


      /* ==========================================
         SEND ORDER TO WHATSAPP
      ========================================== */

      const productsText =
        cart
          .map(
            item =>
              `• ${item.name} × ${item.qty} — ${money(
                item.price * item.qty
              )}`
          )
          .join("\n");


      const whatsappMessage = [

        "🛍️ *طلب جديد من وسام ستور*",

        "",

        `🆔 رقم الطلب: ${order.id}`,

        "",

        "👤 *بيانات العميل*",

        `الاسم: ${customerName}`,

        `الجوال: ${customerPhone}`,

        `المدينة: ${customerCity}`,

        `العنوان: ${customerAddress}`,

        "",

        "📦 *المنتجات*",

        productsText,

        "",

        `💰 *الإجمالي: ${money(total)}*`,

        `💳 طريقة الدفع: ${
          payment === "cod"
            ? "الدفع عند الاستلام"
            : "الدفع الإلكتروني"
        }`,

        "",

        "أرغب بتأكيد هذا الطلب."

      ].join("\n");


      const whatsappUrl =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
          whatsappMessage
        );


      window.open(
        whatsappUrl,
        "_blank"
      );


      /* ==========================================
         CLEAR CART
      ========================================== */

      cart = [];

      saveCart();


      form.reset();


      closeCheckout();


      const orderNumber =
        document.getElementById(
          "orderNumber"
        );


      if (orderNumber) {

        orderNumber.textContent =
          order.id;

      }


      const successModal =
        document.getElementById(
          "orderSuccessModal"
        );


      if (successModal) {

        successModal.classList.add(
          "show"
        );

      }


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


  if (cartButton) {
    cartButton.onclick =
      openCart;
  }


  if (closeCartButton) {
    closeCartButton.onclick =
      closeCart;
  }


  if (overlay) {
    overlay.onclick =
      closeCart;
  }


  if (closeProductButton) {
    closeProductButton.onclick =
      closeProduct;
  }


  if (checkoutButton) {
    checkoutButton.onclick =
      openCheckout;
  }


  if (closeCheckoutButton) {
    closeCheckoutButton.onclick =
      closeCheckout;
  }


  if (closeSuccessButton) {
    closeSuccessButton.onclick =
      closeSuccess;
  }


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
   CSS
========================================================= */

function injectStoreStyles() {

  if (
    document.getElementById(
      "wisamStoreStyles"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "wisamStoreStyles";


  style.textContent = `

    /* ===============================
       SEARCH
    =============================== */

    #wisamStoreTools{
      margin-bottom:22px;
    }


    .wisam-search-box{
      display:flex;
      align-items:center;
      gap:10px;
      background:#fff;
      border:1px solid #e2e1da;
      border-radius:16px;
      padding:6px 10px;
      box-shadow:0 8px 25px #00000006;
      transition:.25s;
    }


    .wisam-search-box:focus-within{
      border-color:#c99a3f;
      box-shadow:0 0 0 4px #c99a3f12;
    }


    .wisam-search-icon{
      font-size:20px;
      padding:0 6px;
    }


    #wisamSearch{
      width:100%;
      border:0;
      outline:0;
      background:transparent;
      padding:13px 5px;
      font:inherit;
      font-size:15px;
    }


    #clearWisamSearch{
      border:0;
      background:#f3f2ee;
      width:34px;
      height:34px;
      border-radius:10px;
      cursor:pointer;
      font-size:20px;
      color:#777;
    }


    .wisam-search-result{
      margin-top:9px;
      color:#999;
      font-size:12px;
      font-weight:700;
    }


    /* ===============================
       CATEGORY
    =============================== */

    .store-category-navigation{
      margin-bottom:25px;
    }


    .category-main-buttons{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
      margin-bottom:13px;
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
    }


    .subcategory-navigation{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
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


    /* ===============================
       PRODUCT CARD
    =============================== */

    .product-image{
      position:relative;
    }


    .product-placeholder{
      font-size:65px;
    }


    .card-discount{
      position:absolute;
      top:12px;
      right:12px;
      z-index:2;
      background:#111;
      color:#fff;
      border-radius:10px;
      padding:7px 10px;
      font-size:12px;
      font-weight:900;
    }


    .price-box{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      margin-top:8px;
    }


    .old-price{
      color:#aaa;
      text-decoration:line-through;
      font-size:14px;
    }


    .discount-badge{
      display:inline-block;
      margin-top:7px;
      background:#fff2d8;
      color:#9b6d1f;
      border-radius:8px;
      padding:5px 8px;
      font-size:10px;
      font-weight:900;
    }


    /* ===============================
       PRODUCT DETAILS
    =============================== */

    .detail-image{
      position:relative;
    }


    .detail-discount{
      position:absolute;
      top:20px;
      right:20px;
      background:#111;
      color:#fff;
      border-radius:12px;
      padding:9px 13px;
      font-weight:900;
      z-index:2;
    }


    .detail-price-box{
      display:flex;
      align-items:center;
      gap:12px;
      flex-wrap:wrap;
      margin:20px 0;
    }


    .detail-old-price{
      color:#aaa;
      text-decoration:line-through;
      font-size:18px;
    }


    .detail-price{
      font-size:30px;
      font-weight:900;
      color:#a87925;
    }


    .detail-discount-text{
      background:#fff2d8;
      color:#9b6d1f;
      padding:7px 10px;
      border-radius:9px;
      font-size:12px;
      font-weight:900;
    }


    .detail-actions{
      display:grid;
      gap:10px;
      margin-top:18px;
    }


    .detail-actions .primary-btn{
      width:100%;
      margin-top:0;
      text-align:center;
    }


    .whatsapp-product-btn{
      width:100%;
      border:0;
      background:#25D366;
      color:#fff;
      border-radius:14px;
      padding:15px;
      font:inherit;
      font-weight:900;
      cursor:pointer;
      transition:.25s;
    }


    .whatsapp-product-btn:hover{
      transform:translateY(-2px);
      box-shadow:0 10px 25px #25D36633;
    }


    .secure-note{
      text-align:center;
      color:#999;
      font-size:11px;
      margin-top:18px;
    }


    /* ===============================
       EMPTY
    =============================== */

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


    /* ===============================
       CART WHATSAPP
    =============================== */

    .cart-whatsapp-btn{
      width:100%;
      border:0;
      background:#25D366;
      color:#fff;
      border-radius:14px;
      padding:14px;
      margin-top:10px;
      font:inherit;
      font-weight:900;
      cursor:pointer;
    }


    /* ===============================
       MOBILE
    =============================== */

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


      .wisam-search-box{
        border-radius:13px;
      }


      .detail-price{
        font-size:25px;
      }

    }

  `;


  document.head.appendChild(
    style
  );
}


/* =========================================================
   ADD WHATSAPP BUTTON TO CART
========================================================= */

function createCartWhatsAppButton() {

  const checkoutArea =
    document.querySelector(
      ".cart-checkout-area"
    );


  if (
    !checkoutArea ||
    document.getElementById(
      "cartWhatsAppButton"
    )
  ) {
    return;
  }


  const button =
    document.createElement(
      "button"
    );


  button.id =
    "cartWhatsAppButton";


  button.className =
    "cart-whatsapp-btn";


  button.type =
    "button";


  button.innerHTML =
    "💬 إرسال الطلب عبر واتساب";


  button.addEventListener(
    "click",
    orderCartWhatsApp
  );


  checkoutArea.appendChild(
    button
  );
}


/* =========================================================
   START
========================================================= */

function initStore() {

  injectStoreStyles();

  createStoreTools();

  createCategoryNavigation();

  createCartWhatsAppButton();

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
