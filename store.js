```javascript
/* =========================================================
   WISAM STORE
   STORE.JS
   20 PRODUCTS + CATEGORIES + CART + CHECKOUT
========================================================= */


/* =========================================================
   PRODUCTS DATABASE
========================================================= */

const defaultProducts = [

  /* =========================
     PHONES
  ========================= */

  {
    id: 1,
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 5299,
    description: "هاتف رائد بتصميم فاخر وأداء استثنائي.",
    battery: "4685 mAh",
    storage: "256GB",
    screen: "6.9 بوصة",
    colors: "تيتانيوم أسود، طبيعي",
    icon: "📱"
  },

  {
    id: 2,
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 4699,
    description: "أداء احترافي وكاميرا متقدمة في تصميم أنيق.",
    battery: "3582 mAh",
    storage: "128GB",
    screen: "6.3 بوصة",
    colors: "تيتانيوم أسود، أبيض",
    icon: "📱"
  },

  {
    id: 3,
    name: "iPhone 16",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 3499,
    description: "تجربة iPhone متطورة للاستخدام اليومي.",
    battery: "3561 mAh",
    storage: "128GB",
    screen: "6.1 بوصة",
    colors: "أسود، أبيض، أزرق",
    icon: "📱"
  },

  {
    id: 4,
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 4999,
    description: "هاتف Ultra بقوة أداء وكاميرا احترافية.",
    battery: "5000 mAh",
    storage: "256GB",
    screen: "6.9 بوصة",
    colors: "أسود، فضي، أزرق",
    icon: "📱"
  },

  {
    id: 5,
    name: "Galaxy S25+",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 3999,
    description: "شاشة مذهلة وأداء سريع وتجربة يومية مميزة.",
    battery: "4900 mAh",
    storage: "256GB",
    screen: "6.7 بوصة",
    colors: "كحلي، فضي، أزرق",
    icon: "📱"
  },

  {
    id: 6,
    name: "Galaxy S25",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 3299,
    description: "هاتف رائد بحجم عملي وأداء قوي.",
    battery: "4000 mAh",
    storage: "128GB",
    screen: "6.2 بوصة",
    colors: "كحلي، أزرق، فضي",
    icon: "📱"
  },

  {
    id: 7,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    category: "phones",
    subcategory: "xiaomi",
    price: 4299,
    description: "أداء قوي وتجربة تصوير متقدمة.",
    battery: "5410 mAh",
    storage: "512GB",
    screen: "6.73 بوصة",
    colors: "أسود، أبيض",
    icon: "📱"
  },

  {
    id: 8,
    name: "Xiaomi 15",
    brand: "Xiaomi",
    category: "phones",
    subcategory: "xiaomi",
    price: 2999,
    description: "هاتف أنيق وسريع للاستخدام اليومي.",
    battery: "5240 mAh",
    storage: "256GB",
    screen: "6.36 بوصة",
    colors: "أسود، أبيض، أخضر",
    icon: "📱"
  },

  {
    id: 9,
    name: "Redmi Note 14 Pro+",
    brand: "Redmi",
    category: "phones",
    subcategory: "redmi",
    price: 1699,
    description: "مواصفات قوية وسعر مناسب.",
    battery: "5110 mAh",
    storage: "256GB",
    screen: "6.67 بوصة",
    colors: "أسود، بنفسجي، أبيض",
    icon: "📱"
  },

  {
    id: 10,
    name: "Huawei Pura 70 Pro",
    brand: "Huawei",
    category: "phones",
    subcategory: "huawei",
    price: 3799,
    description: "تصميم فاخر وتجربة تصوير مميزة.",
    battery: "5050 mAh",
    storage: "512GB",
    screen: "6.8 بوصة",
    colors: "أسود، أبيض",
    icon: "📱"
  },


  /* =========================
     SMART WATCHES
  ========================= */

  {
    id: 11,
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 1899,
    description: "ساعة ذكية أنيقة لمتابعة صحتك ونشاطك.",
    battery: "18 ساعة",
    storage: "64GB",
    screen: "46mm",
    colors: "أسود، فضي",
    icon: "⌚"
  },

  {
    id: 12,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 3299,
    description: "ساعة احترافية مصممة للمغامرات والرياضة.",
    battery: "36 ساعة",
    storage: "64GB",
    screen: "49mm",
    colors: "تيتانيوم",
    icon: "⌚"
  },

  {
    id: 13,
    name: "Galaxy Watch 7",
    brand: "Samsung",
    category: "watches",
    subcategory: "samsung-watch",
    price: 1199,
    description: "ساعة ذكية متطورة لمتابعة الصحة واللياقة.",
    battery: "40 ساعة",
    storage: "32GB",
    screen: "44mm",
    colors: "فضي، أخضر",
    icon: "⌚"
  },

  {
    id: 14,
    name: "Huawei Watch GT 5",
    brand: "Huawei",
    category: "watches",
    subcategory: "huawei-watch",
    price: 999,
    description: "أناقة كلاسيكية مع مزايا ذكية متقدمة.",
    battery: "14 يوم",
    storage: "4GB",
    screen: "46mm",
    colors: "أسود، فضي",
    icon: "⌚"
  },


  /* =========================
     HEADPHONES
  ========================= */

  {
    id: 15,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "headphones",
    subcategory: "apple",
    price: 899,
    description: "صوت غامر وإلغاء ضوضاء متقدم.",
    battery: "حتى 30 ساعة",
    storage: "",
    screen: "",
    colors: "أبيض",
    icon: "🎧"
  },

  {
    id: 16,
    name: "Galaxy Buds3 Pro",
    brand: "Samsung",
    category: "headphones",
    subcategory: "samsung",
    price: 699,
    description: "صوت عالي الجودة وتصميم مريح.",
    battery: "حتى 30 ساعة",
    storage: "",
    screen: "",
    colors: "أبيض، فضي",
    icon: "🎧"
  },

  {
    id: 17,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    subcategory: "sony",
    price: 1299,
    description: "إلغاء ضوضاء احترافي وصوت استثنائي.",
    battery: "حتى 30 ساعة",
    storage: "",
    screen: "",
    colors: "أسود، فضي",
    icon: "🎧"
  },


  /* =========================
     PLAYSTATION
  ========================= */

  {
    id: 18,
    name: "PlayStation 5 Slim",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 1999,
    description: "تجربة ألعاب الجيل الجديد بحجم أنحف.",
    battery: "",
    storage: "1TB",
    screen: "",
    colors: "أبيض",
    icon: "🎮"
  },

  {
    id: 19,
    name: "PlayStation 5 Pro",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 3299,
    description: "أقوى تجربة ألعاب PlayStation برسوميات محسنة.",
    battery: "",
    storage: "2TB",
    screen: "",
    colors: "أبيض",
    icon: "🎮"
  },

  {
    id: 20,
    name: "DualSense Wireless Controller",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "accessories",
    price: 299,
    description: "يد تحكم لاسلكية بتجربة لعب غامرة.",
    battery: "حتى 12 ساعة",
    storage: "",
    screen: "",
    colors: "أبيض، أسود",
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

  apple: "Apple",

  sony: "Sony",

  other: "أخرى",

  "apple-watch": "Apple Watch",

  "samsung-watch": "Samsung Watch",

  "huawei-watch": "Huawei Watch",

  ps5: "PlayStation 5",

  ps4: "PlayStation 4",

  ps3: "PlayStation 3",

  accessories: "الإكسسوارات"

};


/* =========================================================
   CURRENT FILTER
========================================================= */

let currentCategory = "all";
let currentSubcategory = "all";


/* =========================================================
   GET PRODUCTS
   IMPORTANT:
   نستخدم نسخة جديدة من المنتجات تلقائيًا.
========================================================= */

function getProducts() {

  const VERSION = "wisam-store-20-products-v1";

  try {

    const savedVersion =
      localStorage.getItem("wisamProductsVersion");

    const saved =
      JSON.parse(
        localStorage.getItem("wisamProducts") || "[]"
      );

    /*
      إذا كانت النسخة القديمة موجودة،
      نستبدلها تلقائيًا بالقائمة الجديدة.
    */

    if (
      savedVersion !== VERSION ||
      !Array.isArray(saved) ||
      saved.length < 20
    ) {

      localStorage.setItem(
        "wisamProducts",
        JSON.stringify(defaultProducts)
      );

      localStorage.setItem(
        "wisamProductsVersion",
        VERSION
      );

      return defaultProducts;

    }

    return saved;

  } catch (error) {

    localStorage.setItem(
      "wisamProducts",
      JSON.stringify(defaultProducts)
    );

    localStorage.setItem(
      "wisamProductsVersion",
      VERSION
    );

    return defaultProducts;

  }

}


/* =========================================================
   CART
========================================================= */

let cart = [];

try {

  cart =
    JSON.parse(
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
      icon:
        product.category === "watches"
          ? "⌚"
          : "📱",
      label:
        product.category === "watches"
          ? "الحجم"
          : "حجم الشاشة",
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
        data-category="headphones"
      >
        🎧 السماعات
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

          currentSubcategory =
            "all";


          wrapper
            .querySelectorAll(
              ".category-main-btn"
            )
            .forEach(btn =>
              btn.classList.remove("active")
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


  const products =
    getProducts();


  let available = [];


  products.forEach(product => {

    if (
      product.category === currentCategory &&
      product.subcategory &&
      !available.includes(
        product.subcategory
      )
    ) {

      available.push(
        product.subcategory
      );

    }

  });


  box.innerHTML = `

    <button
      class="subcategory-btn active"
      data-subcategory="all"
    >
      الكل
    </button>

    ${available
      .map(
        item => `

        <button
          class="subcategory-btn"
          data-subcategory="${escapeHtml(item)}"
        >
          ${escapeHtml(
            subcategoryNames[item] || item
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
              btn.classList.remove("active")
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

  let products =
    getProducts();


  if (currentCategory !== "all") {

    products =
      products.filter(
        product =>
          product.category ===
          currentCategory
      );

  }


  if (currentSubcategory !== "all") {

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
   PRODUCT SPECS PILLS
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

      <div class="empty-products">

        <div>📦</div>

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
        style="
          animation-delay:${Math.min(
            index * 50,
            400
          )}ms
        "
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

              : `
                <span>
                  ${escapeHtml(
                    product.icon || "📦"
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


          <span class="price">

            ${money(
              product.price
            )}

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


  const specs =
    getProductSpecs(product);


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
                  product.icon || "📦"
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

          ${money(
            product.price
          )}

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


        <button
          class="primary-btn"
          style="
            width:100%;
            margin-top:5px
          "
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


  if (
    !count ||
    !box ||
    !total
  ) {

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

        <h3 style="color:#333;">
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
          Number(item.price || 0) *
          Number(item.qty || 0),
        0
      )
      .toLocaleString("ar-SA");

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


  if (!drawer || !overlay)
    return;


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


  if (!drawer || !overlay)
    return;


  drawer.classList.remove("open");

  overlay.classList.remove("show");

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

  const checkoutModal =
    document.getElementById(
      "checkoutModal"
    );


  if (checkoutModal) {

    checkoutModal.classList.remove(
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

  const successModal =
    document.getElementById(
      "orderSuccessModal"
    );


  if (successModal) {

    successModal.classList.remove(
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
   CATEGORY CSS
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
    document.createElement("style");


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

  /*
    أول شيء نحصل على المنتجات الجديدة.
    هذا يجبر المتجر على تحديث القائمة.
  */

  getProducts();

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
```
