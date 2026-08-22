/* =========================================================
   WISAM STORE
   STORE.JS
   VERSION 2.0
   20 PRODUCTS + CATEGORIES + CART + CHECKOUT
========================================================= */

const WISAM_PRODUCTS_VERSION = "2.0";


/* =========================================================
   PRODUCTS
========================================================= */

const defaultProducts = [

  /* =========================
     PHONES
  ========================= */

  {
    id: 101,
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 5299,
    description: "أداء احترافي وشريحة A18 Pro مع شاشة Super Retina XDR.",
    battery: "حتى 33 ساعة فيديو",
    storage: "256GB",
    screen: "6.9 بوصة",
    colors: "تيتانيوم أسود، طبيعي، أبيض، رملي",
    icon: "📱"
  },

  {
    id: 102,
    name: "iPhone 16 Pro",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 4699,
    description: "هاتف احترافي بتصميم تيتانيوم وكاميرات متطورة.",
    battery: "حتى 27 ساعة فيديو",
    storage: "128GB",
    screen: "6.3 بوصة",
    colors: "تيتانيوم أسود، طبيعي، أبيض",
    icon: "📱"
  },

  {
    id: 103,
    name: "iPhone 16",
    brand: "Apple",
    category: "phones",
    subcategory: "iphone",
    price: 3299,
    description: "تصميم عصري وأداء سريع وتجربة تصوير مميزة.",
    battery: "حتى 22 ساعة فيديو",
    storage: "128GB",
    screen: "6.1 بوصة",
    colors: "أسود، أبيض، وردي، أزرق",
    icon: "📱"
  },

  {
    id: 104,
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 4899,
    description: "قوة Ultra مع كاميرا احترافية وتجربة Galaxy متطورة.",
    battery: "5000 mAh",
    storage: "256GB",
    screen: "6.9 بوصة",
    colors: "أسود، رمادي، فضي، أزرق",
    icon: "📱"
  },

  {
    id: 105,
    name: "Galaxy S25",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 2999,
    description: "هاتف رائد بحجم عملي وأداء قوي للاستخدام اليومي.",
    battery: "4000 mAh",
    storage: "128GB",
    screen: "6.2 بوصة",
    colors: "كحلي، فضي، أزرق، أخضر",
    icon: "📱"
  },

  {
    id: 106,
    name: "Galaxy A56 5G",
    brand: "Samsung",
    category: "phones",
    subcategory: "samsung",
    price: 1599,
    description: "خيار ممتاز يجمع بين الشاشة الرائعة والأداء المتوازن.",
    battery: "5000 mAh",
    storage: "256GB",
    screen: "6.7 بوصة",
    colors: "رمادي، وردي، أخضر",
    icon: "📱"
  },

  {
    id: 107,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    category: "phones",
    subcategory: "xiaomi",
    price: 4299,
    description: "تصوير احترافي وأداء قوي لعشاق التقنية.",
    battery: "5410 mAh",
    storage: "512GB",
    screen: "6.73 بوصة",
    colors: "أسود، أبيض",
    icon: "📱"
  },

  {
    id: 108,
    name: "Redmi Note 14 Pro",
    brand: "Redmi",
    category: "phones",
    subcategory: "redmi",
    price: 1199,
    description: "شاشة AMOLED وكاميرا عالية الدقة وتجربة يومية ممتازة.",
    battery: "5500 mAh",
    storage: "256GB",
    screen: "6.67 بوصة",
    colors: "أسود، أزرق، بنفسجي",
    icon: "📱"
  },


  /* =========================
     SMART WATCHES
  ========================= */

  {
    id: 201,
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 1699,
    description: "ساعة أنيقة وخفيفة مع شاشة واسعة ومزايا صحية متقدمة.",
    battery: "حتى 18 ساعة",
    storage: "64GB",
    screen: "46mm",
    colors: "أسود، فضي، ذهبي",
    icon: "⌚"
  },

  {
    id: 202,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "watches",
    subcategory: "apple-watch",
    price: 3199,
    description: "ساعة مصممة للمغامرات والرياضة والاستخدام الاحترافي.",
    battery: "حتى 36 ساعة",
    storage: "64GB",
    screen: "49mm",
    colors: "تيتانيوم طبيعي، أسود",
    icon: "⌚"
  },

  {
    id: 203,
    name: "Galaxy Watch 7",
    brand: "Samsung",
    category: "watches",
    subcategory: "samsung-watch",
    price: 999,
    description: "ساعة ذكية متطورة لمتابعة النشاط والصحة والإشعارات.",
    battery: "حتى 40 ساعة",
    storage: "32GB",
    screen: "44mm",
    colors: "فضي، أخضر",
    icon: "⌚"
  },

  {
    id: 204,
    name: "Huawei Watch GT 5",
    brand: "Huawei",
    category: "watches",
    subcategory: "huawei-watch",
    price: 899,
    description: "تصميم فاخر وبطارية طويلة ومزايا رياضية متعددة.",
    battery: "حتى 14 يومًا",
    storage: "4GB",
    screen: "46mm",
    colors: "أسود، فضي",
    icon: "⌚"
  },


  /* =========================
     HEADPHONES
  ========================= */

  {
    id: 301,
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "headphones",
    subcategory: "airpods",
    price: 899,
    description: "صوت غامر مع إلغاء ضوضاء نشط وتجربة لاسلكية مميزة.",
    battery: "حتى 6 ساعات",
    storage: "",
    screen: "",
    colors: "أبيض",
    icon: "🎧"
  },

  {
    id: 302,
    name: "AirPods 4",
    brand: "Apple",
    category: "headphones",
    subcategory: "airpods",
    price: 649,
    description: "تصميم مريح وصوت واضح واتصال سريع بأجهزة Apple.",
    battery: "حتى 5 ساعات",
    storage: "",
    screen: "",
    colors: "أبيض",
    icon: "🎧"
  },

  {
    id: 303,
    name: "Galaxy Buds3 Pro",
    brand: "Samsung",
    category: "headphones",
    subcategory: "samsung-buds",
    price: 699,
    description: "صوت عالي الجودة وتصميم عصري مع مزايا ذكية.",
    battery: "حتى 6 ساعات",
    storage: "",
    screen: "",
    colors: "فضي، أبيض",
    icon: "🎧"
  },

  {
    id: 304,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "headphones",
    subcategory: "sony",
    price: 1399,
    description: "سماعة احترافية مع إلغاء ضوضاء رائد وصوت غني.",
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
    id: 401,
    name: "PlayStation 5 Slim",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 2099,
    description: "جهاز ألعاب الجيل الجديد بحجم أصغر وتجربة ألعاب مذهلة.",
    battery: "",
    storage: "1TB SSD",
    screen: "",
    colors: "أبيض",
    icon: "🎮"
  },

  {
    id: 402,
    name: "PlayStation 5 Pro",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "ps5",
    price: 3199,
    description: "أقوى تجربة PlayStation لعشاق الأداء والجودة العالية.",
    battery: "",
    storage: "2TB SSD",
    screen: "",
    colors: "أبيض",
    icon: "🎮"
  },

  {
    id: 403,
    name: "DualSense Controller",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "accessories",
    price: 299,
    description: "يد تحكم لاسلكية مع اهتزاز متقدم ومشغلات تكيفية.",
    battery: "مدمج",
    storage: "",
    screen: "",
    colors: "أبيض، أسود",
    icon: "🎮"
  },

  {
    id: 404,
    name: "PlayStation Portal",
    brand: "PlayStation",
    category: "playstation",
    subcategory: "accessories",
    price: 899,
    description: "تجربة لعب عن بُعد مع جهاز PlayStation 5.",
    battery: "حتى 7 ساعات",
    storage: "",
    screen: "8 بوصة",
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

  "apple-watch": "Apple Watch",

  "samsung-watch": "Samsung Watch",

  "huawei-watch": "Huawei Watch",

  airpods: "AirPods",

  "samsung-buds": "Samsung Buds",

  sony: "Sony",

  ps5: "PlayStation 5",

  ps4: "PlayStation 4",

  ps3: "PlayStation 3",

  accessories: "إكسسوارات PlayStation",

  other: "أخرى"

};


/* =========================================================
   CURRENT FILTER
========================================================= */

let currentCategory = "all";
let currentSubcategory = "all";


/* =========================================================
   PRODUCT STORAGE
   مهم:
   يتم تحديث المنتجات تلقائيًا عند تغيير الإصدار.
========================================================= */

function getProducts() {

  try {

    const savedVersion =
      localStorage.getItem(
        "wisamProductsVersion"
      );

    const saved =
      JSON.parse(
        localStorage.getItem(
          "wisamProducts"
        ) || "null"
      );


    if (
      savedVersion ===
      WISAM_PRODUCTS_VERSION &&
      Array.isArray(saved) &&
      saved.length
    ) {

      return saved;

    }


    localStorage.setItem(
      "wisamProducts",
      JSON.stringify(
        defaultProducts
      )
    );


    localStorage.setItem(
      "wisamProductsVersion",
      WISAM_PRODUCTS_VERSION
    );


    return defaultProducts;

  } catch (error) {

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
      localStorage.getItem(
        "wisamCart"
      ) || "[]"
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

  return String(
    value ?? ""
  ).replace(
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
    subcategoryNames[
      product.subcategory
    ] ||
    product.brand ||
    categoryNames[
      product.category
    ] ||
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
          ? "حجم الساعة"
          : "الشاشة",

      value: product.screen

    });

  }


  if (product.storage) {

    specs.push({

      icon: "💾",

      label:
        product.category === "playstation"
          ? "التخزين"
          : "مساحة التخزين",

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
    document.createElement(
      "div"
    );


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
            .forEach(btn => {

              btn.classList.remove(
                "active"
              );

            });


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


  if (
    currentCategory ===
    "all"
  ) {

    box.innerHTML = "";

    return;

  }


  const products =
    getProducts();


  const available = [];


  products.forEach(
    product => {

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

    }
  );


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
            .forEach(btn => {

              btn.classList.remove(
                "active"
              );

            });


          this.classList.add(
            "active"
          );


          renderProducts();

        }
      );

    });

}


/* =========================================================
   FILTER
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
   PRODUCT SPECS HTML
========================================================= */

function renderProductSpecs(product) {

  const specs =
    getProductSpecs(product);


  return specs
    .slice(0, 4)
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
            index * 60,
            400
          )}ms
        "
        onclick="openProduct(${product.id})"
      >

        <div class="product-image">

          <span
            style="
              font-size:82px;
              filter:drop-shadow(0 15px 20px #0002);
            "
          >
            ${escapeHtml(
              product.icon ||
              "📦"
            )}
          </span>

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
            type="button"
            onclick="
              event.stopPropagation();
              addToCart(${product.id})
            "
          >
            أضف إلى السلة
          </button>


          <button
            class="details-btn"
            type="button"
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
      item =>
        item.id == id
    );


  if (!product) return;


  const details =
    document.getElementById(
      "productDetails"
    );


  if (!details) return;


  const specs =
    getProductSpecs(
      product
    );


  details.innerHTML = `

    <div class="detail-layout">

      <div class="detail-image">

        <span
          class="detail-icon"
          style="
            filter:drop-shadow(0 20px 25px #0002);
          "
        >
          ${escapeHtml(
            product.icon ||
            "📦"
          )}
        </span>

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
          type="button"
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
      item =>
        item.id == id
    );


  if (!product) return;


  const existing =
    cart.find(
      item =>
        item.id == id
    );


  if (existing) {

    existing.qty++;

  } else {

    cart.push({

      id: product.id,

      name: product.name,

      price:
        Number(
          product.price
        ) || 0,

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
    JSON.stringify(
      cart
    )
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
        sum +
        Number(
          item.qty || 0
        ),
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
                ${money(
                  item.price
                )}
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
        )
        .join("");

  }


  total.textContent =
    cart
      .reduce(
        (sum, item) =>
          sum +
          Number(
            item.price
          ) *
          Number(
            item.qty
          ),
        0
      )
      .toLocaleString(
        "ar-SA"
      );

}


/* =========================================================
   QUANTITY
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


  if (
    item.qty <= 0
  ) {

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


  if (
    !drawer ||
    !overlay
  ) {

    return;

  }


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


  if (
    !drawer ||
    !overlay
  ) {

    return;

  }


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


  const checkoutTotal =
    document.getElementById(
      "checkoutTotal"
    );


  if (checkoutTotal) {

    checkoutTotal.textContent =
      total.toLocaleString(
        "ar-SA"
      ) +
      " ر.س";

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
        )?.value ||
        "cod";


      const name =
        document
          .getElementById(
            "customerName"
          )
          ?.value
          .trim() ||
        "";


      const phone =
        document
          .getElementById(
            "customerPhone"
          )
          ?.value
          .trim() ||
        "";


      const city =
        document
          .getElementById(
            "customerCity"
          )
          ?.value
          .trim() ||
        "";


      const address =
        document
          .getElementById(
            "customerAddress"
          )
          ?.value
          .trim() ||
        "";


      const order = {

        id:
          "WS-" +
          Date.now()
            .toString()
            .slice(-8),


        customer: {

          name,

          phone,

          city,

          address

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
          new Date()
            .toISOString()

      };


      let orders = [];


      try {

        orders =
          JSON.parse(
            localStorage.getItem(
              "wisamOrders"
            ) ||
            "[]"
          );


        if (
          !Array.isArray(
            orders
          )
        ) {

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


    .product-card{
      position:relative;
    }


    .product-card::after{
      content:"";
      position:absolute;
      inset:0;
      border-radius:22px;
      pointer-events:none;
      border:1px solid transparent;
      transition:.25s;
    }


    .product-card:hover::after{
      border-color:#c99a3f33;
    }


    .product-image{
      background:
        radial-gradient(
          circle at center,
          #ffffff 0,
          #f1f0eb 70%
        );
    }


    .detail-icon{
      font-size:120px;
    }


    .cart-checkout-area{
      border-top:1px solid #eee;
      padding-top:18px;
    }


    .checkout-cart-btn{
      width:100%;
      display:flex;
      justify-content:center;
      align-items:center;
      gap:10px;
      margin-top:0;
    }


    .cart-total-line{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top:15px;
      padding-top:15px;
      border-top:1px solid #f0f0f0;
      font-size:17px;
    }


    .cart-total-line strong{
      color:#a87925;
      font-size:20px;
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
     أول شيء:
     تحميل النسخة الجديدة
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
