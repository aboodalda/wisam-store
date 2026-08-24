/* =========================================================
   WISAM STORE
   STORE.JS
   Modern Store Engine
   Search + Categories + Products + Details + Cart + WhatsApp
========================================================= */

const WHATSAPP_NUMBER = "970592936150";

/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const defaultProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 4299,
    oldPrice: 4799,
    description:
      "هاتف iPhone 15 Pro Max بتصميم فاخر وأداء استثنائي وتجربة تصوير احترافية.",
    battery: "4441 mAh",
    storage: "256GB",
    screen: "6.7 بوصة",
    colors: "Titanium Black، Blue، Natural",
    icon: "📱",
    image: ""
  },

  {
    id: 2,
    name: "iPhone 15",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 2999,
    oldPrice: 3399,
    description:
      "iPhone 15 بتصميم أنيق وأداء سريع وكاميرا متطورة.",
    battery: "3877 mAh",
    storage: "128GB",
    screen: "6.1 بوصة",
    colors: "أسود، أزرق، وردي",
    icon: "📱",
    image: ""
  },

  {
    id: 3,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 3899,
    oldPrice: 4299,
    description:
      "هاتف رائد من Samsung بأداء قوي وشاشة مذهلة وكاميرا احترافية.",
    battery: "5000 mAh",
    storage: "256GB",
    screen: "6.8 بوصة",
    colors: "أسود، رمادي، بنفسجي",
    icon: "📱",
    image: ""
  },

  {
    id: 4,
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 1399,
    oldPrice: 1599,
    description:
      "ساعة Apple Watch أنيقة تجمع بين الصحة واللياقة والتقنية.",
    battery: "18 ساعة",
    storage: "64GB",
    screen: "1.9 بوصة",
    colors: "أسود، فضي",
    icon: "⌚",
    image: ""
  },

  {
    id: 5,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "headphones",
    subcategory: "other",
    price: 899,
    oldPrice: 999,
    description:
      "سماعات AirPods Pro 2 مع عزل ضوضاء وتجربة صوتية مميزة.",
    battery: "حتى 30 ساعة",
    storage: "",
    screen: "",
    colors: "أبيض",
    icon: "🎧",
    image: ""
  },

  {
    id: 6,
    name: "PlayStation 5",
    brand: "Sony",
    category: "playstation",
    subcategory: "ps5",
    price: 1999,
    oldPrice: 2199,
    description:
      "استمتع بتجربة ألعاب الجيل الجديد مع PlayStation 5.",
    battery: "",
    storage: "1TB",
    screen: "",
    colors: "أبيض",
    icon: "🎮",
    image: ""
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
   LOAD CART
========================================================= */

try {
  const savedCart = JSON.parse(
    localStorage.getItem("wisamCart") || "[]"
  );

  cart = Array.isArray(savedCart) ? savedCart : [];
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
      const chars = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return chars[match];
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

let productsCache = null;

function getProducts() {
  if (Array.isArray(productsCache) && productsCache.length) {
    return productsCache;
  }

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
   FIREBASE SYNC (Realtime Database)
   يخلي كل الأجهزة تشوف نفس المنتجات المضافة من لوحة التحكم
========================================================= */

function showFirebaseDebugBanner(message, isError) {
  let el = document.getElementById("fbDebugBanner");

  if (!el) {
    el = document.createElement("div");
    el.id = "fbDebugBanner";
    el.style.cssText =
      "position:fixed;bottom:12px;left:12px;right:12px;z-index:99999;" +
      "padding:12px 16px;border-radius:12px;font-size:13px;font-family:Arial,sans-serif;" +
      "text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.3);direction:rtl;line-height:1.5;";
    document.body.appendChild(el);
  }

  el.style.background = isError ? "#d63333" : "#1f9d5c";
  el.style.color = "#fff";
  el.textContent = message;
}

function initFirebaseSync(onUpdate) {
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
    showFirebaseDebugBanner("❌ مكتبة Firebase ما انحملت (تأكد من ترتيب السكربتات بالـ HTML)", true);
    return;
  }

  try {
    firebase.database().ref("products").on(
      "value",
      (snapshot) => {
        const val = snapshot.val();
        const list = Array.isArray(val)
          ? val.filter(Boolean)
          : (val ? Object.values(val) : []);

        if (list.length) {
          productsCache = list;
          localStorage.setItem("wisamProducts", JSON.stringify(list));
          showFirebaseDebugBanner("✅ متصل بـ Firebase - " + list.length + " منتج");

          if (typeof onUpdate === "function") {
            onUpdate();
          }
        } else {
          showFirebaseDebugBanner("⚠️ Firebase متصل لكن قاعدة البيانات فاضية (مافي منتجات محفوظة)", true);
        }
      },
      (error) => {
        showFirebaseDebugBanner("❌ خطأ Firebase: " + error.message, true);
      }
    );
  } catch (error) {
    showFirebaseDebugBanner("❌ خطأ Firebase: " + error.message, true);
  }
}


/* =========================================================
   SEARCH
========================================================= */

function createStoreTools() {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  if (document.getElementById("wisamStoreTools")) {
    return;
  }

  const tools = document.createElement("div");

  tools.id = "wisamStoreTools";

  tools.innerHTML = `
    <div class="wisam-search-box">

      <span class="wisam-search-icon">
        🔎
      </span>

      <input
        id="wisamSearch"
        type="search"
        placeholder="ابحث عن iPhone، Samsung، سماعات..."
        autocomplete="off"
      />

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

  grid.parentNode.insertBefore(tools, grid);

  const searchInput =
    document.getElementById("wisamSearch");

  const clearButton =
    document.getElementById("clearWisamSearch");

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
    document.getElementById("productGrid");

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
        ⌚ الساعات
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

          this.classList.add("active");

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

  const products = getProducts();

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

    ${available
      .map(
        item => `
          <button
            class="subcategory-btn"
            data-subcategory="${escapeHtml(
              item
            )}"
            type="button"
          >
            ${escapeHtml(
              subcategoryNames[item] ||
              item
            )}
          </button>
        `
      )
      .join("")}
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

          this.classList.add("active");

          renderProducts();
        }
      );
    });
}


/* =========================================================
   FILTER PRODUCTS
========================================================= */

function getFilteredProducts() {
  let products = getProducts();

  if (currentCategory !== "all") {
    products = products.filter(
      product =>
        product.category ===
        currentCategory
    );
  }

  if (currentSubcategory !== "all") {
    products = products.filter(
      product =>
        product.subcategory ===
        currentSubcategory
    );
  }

  if (searchQuery) {
    products = products.filter(
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
        product.category ===
        "headphones"
          ? "عمر البطارية"
          : "البطارية",
      value: product.battery
    });
  }

  if (product.screen) {
    specs.push({
      icon: "📱",
      label: "الشاشة",
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
   CARD SPECS
========================================================= */

function renderProductSpecs(product) {
  return getProductSpecs(product)
    .slice(0, 3)
    .map(
      spec => `
        <span class="spec-pill">
          ${spec.icon}
          ${escapeHtml(spec.value)}
        </span>
      `
    )
    .join("");
}


/* =========================================================
   PRICE
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

        <span class="price">
          ${money(price)}
        </span>

        <span class="old-price">
          ${money(oldPrice)}
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

        <div class="empty-icon">
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
            currentCategory='all';
            currentSubcategory='all';
            const s=document.getElementById('wisamSearch');
            if(s)s.value='';
            renderSubcategories();
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
    products
      .map(
        (product, index) => {
          const discount =
            getDiscount(product);

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
                      />
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

                  <span>•</span>

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

                <div class="product-card-actions">

                  <button
                    class="add-btn"
                    type="button"
                    onclick="
                      event.stopPropagation();
                      addToCart(${product.id});
                    "
                  >
                    أضف للسلة
                  </button>

                  <button
                    class="details-btn"
                    type="button"
                    onclick="
                      event.stopPropagation();
                      openProduct(${product.id});
                    "
                  >
                    التفاصيل
                  </button>

                </div>

              </div>

            </article>
          `;
        }
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
              />
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

  modal.classList.add("show");

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

  modal.classList.remove("show");

  document.body.style.overflow = "";
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

  const countValue =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.qty || 0),
      0
    );

  count.textContent =
    countValue;

  if (!cart.length) {
    box.innerHTML = `
      <div class="empty-cart">

        <div class="empty-cart-icon">
          🛒
        </div>

        <h3>
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

              <div class="cart-product-info">

                <b>
                  ${escapeHtml(
                    item.name
                  )}
                </b>

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

                <strong>
                  ${item.qty}
                </strong>

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
        )
        .join("");
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

  renderCart();

  drawer.classList.add("open");

  overlay.classList.add("show");
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

  drawer.classList.remove("open");

  overlay.classList.remove("show");
}


/* =========================================================
   WHATSAPP PRODUCT
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
    "أرغب بطلب هذا المنتج."
  ]
    .filter(Boolean)
    .join("\n");

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   WHATSAPP CART
========================================================= */

function orderCartWhatsApp() {
  if (!cart.length) {
    alert("السلة فارغة.");
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
    encodeURIComponent(message);

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
    alert("السلة فارغة.");
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
   CLOSE SUCCESS
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
          name: customerName,
          phone: customerPhone,
          city: customerCity,
          address: customerAddress
        },

        payment,

        items:
          cart.map(
            item => ({
              ...item
            })
          ),

        total,

        status: "new",

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

      orders.unshift(order);

      localStorage.setItem(
        "wisamOrders",
        JSON.stringify(orders)
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
   MODERN STORE CSS
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

    /* =========================================
       SEARCH
    ========================================= */

    #wisamStoreTools {
      margin-bottom: 24px;
    }

    .wisam-search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ffffff;
      border: 1px solid #e6e3dc;
      border-radius: 18px;
      padding: 7px 10px;
      box-shadow: 0 12px 35px rgba(0,0,0,.04);
      transition: .25s ease;
    }

    .wisam-search-box:focus-within {
      border-color: #c99a3f;
      box-shadow:
        0 0 0 4px rgba(201,154,63,.10),
        0 15px 35px rgba(0,0,0,.05);
    }

    .wisam-search-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: #f7f4ed;
      font-size: 18px;
    }

    #wisamSearch {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      padding: 13px 5px;
      font-family: inherit;
      font-size: 15px;
      color: #171717;
    }

    #clearWisamSearch {
      border: 0;
      background: #f4f3ef;
      width: 36px;
      height: 36px;
      border-radius: 11px;
      cursor: pointer;
      font-size: 21px;
      color: #777;
      transition: .2s;
    }

    #clearWisamSearch:hover {
      background: #111;
      color: #fff;
    }

    .wisam-search-result {
      margin-top: 9px;
      color: #999;
      font-size: 12px;
      font-weight: 700;
    }


    /* =========================================
       CATEGORIES
    ========================================= */

    .store-category-navigation {
      margin-bottom: 28px;
    }

    .category-main-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 13px;
    }

    .category-main-btn {
      border: 1px solid #e4e1d9;
      background: #fff;
      color: #222;
      padding: 13px 20px;
      border-radius: 14px;
      cursor: pointer;
      font-family: inherit;
      font-weight: 800;
      transition: .25s ease;
    }

    .category-main-btn:hover {
      border-color: #c99a3f;
      transform: translateY(-2px);
    }

    .category-main-btn.active {
      background: #111;
      color: #fff;
      border-color: #111;
      box-shadow: 0 10px 25px rgba(0,0,0,.12);
    }

    .subcategory-navigation {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .subcategory-btn {
      border: 1px solid #e5e3dc;
      background: #f8f7f4;
      color: #666;
      padding: 9px 15px;
      border-radius: 10px;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      transition: .2s;
    }

    .subcategory-btn:hover {
      border-color: #c99a3f;
      color: #222;
    }

    .subcategory-btn.active {
      background: #c99a3f;
      color: #111;
      border-color: #c99a3f;
      font-weight: 900;
    }


    /* =========================================
       PRODUCT CARD
    ========================================= */

    .product-card {
      position: relative;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e8e5dd;
      border-radius: 24px;
      box-shadow: 0 15px 40px rgba(0,0,0,.045);
      transition:
        transform .3s ease,
        box-shadow .3s ease,
        border-color .3s ease;
      animation: wisamCardIn .45s ease both;
    }

    .product-card:hover {
      transform: translateY(-7px);
      border-color: rgba(201,154,63,.45);
      box-shadow:
        0 25px 55px rgba(0,0,0,.10);
    }

    @keyframes wisamCardIn {
      from {
        opacity: 0;
        transform: translateY(18px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .product-image {
      position: relative;
      min-height: 250px;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 18px;
      background:
        radial-gradient(
          circle at 50% 20%,
          #fff 0,
          #f8f6f0 45%,
          #eeece5 100%
        );
    }

    .product-image img {
      max-width: 78%;
      max-height: 78%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 14px;
      transition: transform .35s ease;
    }

    .product-card:hover
    .product-image img {
      transform: scale(1.06);
    }

    .product-placeholder {
      font-size: 75px;
      filter: drop-shadow(
        0 15px 15px rgba(0,0,0,.10)
      );
    }

    .card-discount {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 2;
      background: #111;
      color: #fff;
      border-radius: 11px;
      padding: 7px 10px;
      font-size: 11px;
      font-weight: 900;
    }

    .product-info {
      padding: 20px;
    }

    .product-meta {
      display: flex;
      gap: 7px;
      align-items: center;
      color: #a17b31;
      font-size: 11px;
      font-weight: 900;
      margin-bottom: 8px;
    }

    .product-info h3 {
      margin: 0;
      font-size: 20px;
      line-height: 1.4;
      color: #171717;
    }

    .product-info p {
      margin: 8px 0 13px;
      color: #888;
      line-height: 1.7;
      font-size: 13px;
    }

    .product-specs {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      min-height: 28px;
    }

    .spec-pill {
      background: #f6f5f1;
      border: 1px solid #eceae4;
      color: #666;
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 10px;
      font-weight: 700;
    }

    .price-box {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 15px;
    }

    .price {
      color: #a87925;
      font-size: 22px;
      font-weight: 950;
    }

    .old-price {
      color: #aaa;
      text-decoration: line-through;
      font-size: 13px;
    }

    .discount-badge {
      display: inline-block;
      margin-top: 7px;
      background: #fff3da;
      color: #9b6d1f;
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 10px;
      font-weight: 900;
    }

    .product-card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 16px;
    }

    .add-btn,
    .details-btn {
      border: 0;
      border-radius: 12px;
      padding: 12px 10px;
      font-family: inherit;
      font-weight: 900;
      cursor: pointer;
      transition: .25s;
    }

    .add-btn {
      background: #111;
      color: #fff;
    }

    .add-btn:hover {
      background: #c99a3f;
      color: #111;
      transform: translateY(-2px);
    }

    .details-btn {
      background: #f5f3ed;
      color: #333;
    }

    .details-btn:hover {
      background: #eae7de;
      transform: translateY(-2px);
    }


    /* =========================================
       PRODUCT DETAILS
    ========================================= */

    .detail-layout {
      display: grid;
      grid-template-columns: minmax(300px, .9fr) minmax(320px, 1.1fr);
      gap: 35px;
      align-items: center;
    }

    .detail-image {
      position: relative;
      min-height: 430px;
      display: grid;
      place-items: center;
      border-radius: 24px;
      overflow: hidden;
      padding: 30px;
      background:
        radial-gradient(
          circle at 50% 30%,
          #fff,
          #f7f5ef 60%,
          #ebe8df
        );
    }

    .detail-image img {
      max-width: 80%;
      max-height: 80%;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 18px;
    }

    .detail-icon {
      font-size: 130px;
      filter: drop-shadow(
        0 20px 20px rgba(0,0,0,.12)
      );
    }

    .detail-discount {
      position: absolute;
      top: 18px;
      right: 18px;
      background: #111;
      color: #fff;
      border-radius: 12px;
      padding: 9px 13px;
      font-weight: 900;
      z-index: 2;
    }

    .eyebrow {
      color: #b18434;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .3px;
    }

    .detail-content h2 {
      margin: 8px 0;
      font-size: 34px;
      line-height: 1.3;
    }

    .detail-brand {
      color: #888;
      font-size: 14px;
      font-weight: 800;
    }

    .detail-price-box {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin: 20px 0;
    }

    .detail-old-price {
      color: #aaa;
      text-decoration: line-through;
      font-size: 17px;
    }

    .detail-price {
      font-size: 31px;
      font-weight: 950;
      color: #a87925;
    }

    .detail-discount-text {
      background: #fff2d8;
      color: #9b6d1f;
      padding: 7px 10px;
      border-radius: 9px;
      font-size: 12px;
      font-weight: 900;
    }

    .detail-description {
      color: #777;
      line-height: 2;
      font-size: 14px;
    }

    .spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-top: 20px;
    }

    .spec-item {
      padding: 13px;
      background: #f8f7f3;
      border: 1px solid #ece9e1;
      border-radius: 13px;
    }

    .spec-item small {
      display: block;
      color: #999;
      font-size: 10px;
      margin-bottom: 5px;
    }

    .spec-item strong {
      display: block;
      color: #333;
      font-size: 12px;
    }

    .detail-actions {
      display: grid;
      gap: 10px;
      margin-top: 22px;
    }

    .detail-actions .primary-btn {
      width: 100%;
      margin: 0;
      text-align: center;
    }

    .primary-btn {
      border: 0;
      background: #111;
      color: #fff;
      border-radius: 14px;
      padding: 14px 18px;
      font-family: inherit;
      font-weight: 900;
      cursor: pointer;
      transition: .25s;
    }

    .primary-btn:hover {
      background: #c99a3f;
      color: #111;
      transform: translateY(-2px);
    }

    .whatsapp-product-btn,
    .cart-whatsapp-btn {
      width: 100%;
      border: 0;
      background: #25D366;
      color: #fff;
      border-radius: 14px;
      padding: 14px;
      font-family: inherit;
      font-weight: 900;
      cursor: pointer;
      transition: .25s;
    }

    .whatsapp-product-btn:hover,
    .cart-whatsapp-btn:hover {
      transform: translateY(-2px);
      box-shadow:
        0 12px 25px rgba(37,211,102,.22);
    }

    .secure-note {
      text-align: center;
      color: #aaa;
      font-size: 11px;
      margin-top: 16px;
    }


    /* =========================================
       EMPTY
    ========================================= */

    .empty-products {
      grid-column: 1 / -1;
      text-align: center;
      background: #fff;
      border: 1px solid #e5e5df;
      border-radius: 22px;
      padding: 70px 20px;
    }

    .empty-icon {
      font-size: 55px;
      margin-bottom: 15px;
    }

    .empty-products h3 {
      margin: 0 0 8px;
      font-size: 22px;
    }

    .empty-products p {
      color: #999;
      margin: 0 0 20px;
    }


    /* =========================================
       CART
    ========================================= */

    .cart-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      padding: 14px 0;
      border-bottom: 1px solid #eee;
    }

    .cart-product-info {
      display: grid;
      gap: 5px;
    }

    .cart-product-info b {
      color: #222;
      font-size: 13px;
    }

    .cart-product-info span {
      color: #a87925;
      font-size: 12px;
      font-weight: 800;
    }

    .qty {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f5f4f0;
      border-radius: 11px;
      padding: 4px;
    }

    .qty button {
      border: 0;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 18px;
      font-weight: 900;
    }

    .qty button:hover {
      background: #111;
      color: #fff;
    }

    .empty-cart {
      text-align: center;
      padding: 45px 20px;
      color: #999;
    }

    .empty-cart-icon {
      font-size: 55px;
      margin-bottom: 12px;
    }


    /* =========================================
       MOBILE
    ========================================= */

    @media (max-width: 700px) {

      .category-main-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .category-main-btn {
        padding: 12px 8px;
        font-size: 12px;
      }

      .subcategory-navigation {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 5px;
      }

      .subcategory-btn {
        white-space: nowrap;
      }

      .product-image {
        min-height: 140px;
        padding: 10px;
      }

      .product-image img {
        max-width: 80%;
        max-height: 80%;
        border-radius: 10px;
      }

      .product-placeholder {
        font-size: 46px;
      }

      .card-discount {
        top: 8px;
        right: 8px;
        padding: 5px 7px;
        font-size: 9px;
        border-radius: 8px;
      }

      .product-info {
        padding: 12px;
      }

      .product-meta {
        font-size: 9px;
        margin-bottom: 5px;
      }

      .product-info h3 {
        font-size: 13.5px;
        line-height: 1.3;
      }

      .product-info p {
        display: none;
      }

      .product-specs {
        min-height: 0;
        gap: 4px;
      }

      .spec-pill {
        padding: 3px 6px;
        font-size: 9px;
      }

      .price-box {
        margin-top: 8px;
        gap: 6px;
      }

      .price {
        font-size: 15px;
      }

      .old-price {
        font-size: 11px;
      }

      .discount-badge {
        margin-top: 4px;
        padding: 4px 6px;
        font-size: 9px;
      }

      .product-card-actions {
        grid-template-columns: 1fr;
        gap: 6px;
        margin-top: 10px;
      }

      .add-btn,
      .details-btn {
        padding: 9px 8px;
        font-size: 12px;
        border-radius: 10px;
      }

      .detail-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .detail-image {
        min-height: 300px;
        padding: 18px;
      }

      .detail-image img {
        max-height: 78%;
      }

      .detail-icon {
        font-size: 90px;
      }

      .detail-content h2 {
        font-size: 27px;
      }

      .detail-price {
        font-size: 25px;
      }

      .spec-grid {
        grid-template-columns: 1fr 1fr;
      }

    }

    @media (max-width: 380px) {

      .product-info h3 {
        font-size: 12.5px;
      }

      .price {
        font-size: 14px;
      }

    }

  `;

  document.head.appendChild(
    style
  );
}


/* =========================================================
   CART WHATSAPP BUTTON
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
   START STORE
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

  initFirebaseSync(() => {
    renderProducts();
    renderCart();
  });
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
