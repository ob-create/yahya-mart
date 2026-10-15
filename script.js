"use strict";

/* ==========================================
   YAHYA MART — E-COMMERCE DEMO
   HTML + CSS + JAVASCRIPT
   All products and prices are sample data.
========================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const money = (amount) =>
    new Intl.NumberFormat("en-TZ", {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0
    }).format(amount);

const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

function loadStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        showToast("Browser storage is unavailable.");
        return false;
    }
}

/* Images load from the internet. A fallback is provided below. */
function productImage(id, photoId) {
    // Admin-uploaded pictures are stored as image data.
    if (
        typeof photoId === "string" &&
        photoId.startsWith("data:image/")
    ) {
        return photoId;
    }

    // Original store pictures continue using Unsplash.
    return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
}

/* ==========================================
   1. PRODUCT CATALOG
========================================== */

let products = [
    {
        id: 1, name: "Premium Wireless Headphones", category: "Electronics",
        price: 85000, oldPrice: 110000, rating: 4.8, reviews: 124,
        image: "photo-1505740420928-5e560c06d30e",
        badge: "POPULAR", description: "Comfortable wireless headphones for music, entertainment and everyday listening."
    },
    {
        id: 2, name: "Smart Watch Series", category: "Electronics",
        price: 95000, oldPrice: 125000, rating: 4.6, reviews: 87,
        image: "photo-1523275335684-37898b6baf30",
        badge: "SALE", description: "A stylish smartwatch-inspired accessory for everyday wear."
    },
    {
        id: 3, name: "Modern Digital Camera", category: "Electronics",
        price: 420000, oldPrice: 480000, rating: 4.7, reviews: 54,
        image: "photo-1516035069371-29a1b244cc32",
        badge: "FEATURED", description: "A compact camera-style product for photography enthusiasts."
    },
    {
        id: 4, name: "Premium Laptop", category: "Electronics",
        price: 1250000, oldPrice: 1390000, rating: 4.8, reviews: 63,
        image: "photo-1496181133206-80ce9b88a853",
        badge: "TOP PICK", description: "A laptop for study, office work, browsing and creative projects."
    },
    {
        id: 5, name: "Wireless Bluetooth Speaker", category: "Electronics",
        price: 65000, oldPrice: 80000, rating: 4.5, reviews: 98,
        image: "photo-1608043152269-423dbba4e7e1",
        badge: "SALE", description: "Portable speaker-style accessory for enjoying music."
    },
    {
        id: 6, name: "Wireless Earbuds", category: "Electronics",
        price: 45000, oldPrice: 60000, rating: 4.4, reviews: 142,
        image: "photo-1606220945770-b5b6c2c55bf1",
        badge: "POPULAR", description: "Compact wireless earbuds for music and everyday listening."
    },
    {
        id: 7, name: "Tablet for Study", category: "Electronics",
        price: 380000, oldPrice: 430000, rating: 4.6, reviews: 41,
        image: "photo-1544244015-0df4b3ffc6b0",
        badge: "", description: "A tablet-style device for reading, learning and entertainment."
    },
    {
        id: 8, name: "Fast Charging Power Bank", category: "Electronics",
        price: 38000, oldPrice: 45000, rating: 4.3, reviews: 73,
        image: "photo-1609091839311-d5365f9ff1c5",
        badge: "", description: "A portable power-bank-style accessory for travel and daily use."
    },
    {
        id: 9, name: "Gaming Controller", category: "Gaming",
        price: 85000, oldPrice: 105000, rating: 4.8, reviews: 167,
        image: "photo-1592840496694-26d035b52b48",
        badge: "GAMER PICK", description: "A controller-style accessory for compatible gaming setups. Check compatibility before buying."
    },
    {
        id: 10, name: "Gaming Headset", category: "Gaming",
        price: 75000, oldPrice: 95000, rating: 4.6, reviews: 91,
        image: "photo-1599669454699-248893623440",
        badge: "SALE", description: "Over-ear gaming headset-style accessory for immersive play."
    },
    {
        id: 11, name: "Mechanical Gaming Keyboard", category: "Gaming",
        price: 110000, oldPrice: 140000, rating: 4.7, reviews: 76,
        image: "photo-1595225476474-87563907a212",
        badge: "POPULAR", description: "A gaming keyboard-style product for a desktop setup."
    },
    {
        id: 12, name: "Gaming Mouse", category: "Gaming",
        price: 42000, oldPrice: 55000, rating: 4.5, reviews: 113,
        image: "photo-1527814050087-3793815479db",
        badge: "", description: "A mouse-style accessory for computer use and gaming."
    },
    {
        id: 13, name: "Gaming Chair", category: "Gaming",
        price: 450000, oldPrice: 510000, rating: 4.7, reviews: 28,
        image: "photo-1598300053653-7f8b5a0b8c0b",
        badge: "FEATURED", description: "A gaming-chair-style product for a home gaming station."
    },
    {
        id: 14, name: "Gaming Desk Setup Light", category: "Gaming",
        price: 55000, oldPrice: 70000, rating: 4.3, reviews: 38,
        image: "photo-1507473885765-e6ed057f782c",
        badge: "", description: "Decorative lighting for a gaming or study desk."
    },
    {
        id: 15, name: "Classic White Sneakers", category: "Fashion",
        price: 65000, oldPrice: 85000, rating: 4.6, reviews: 132,
        image: "photo-1542291026-7eec264c27ff",
        badge: "TRENDING", description: "Casual sneaker-style footwear. Select the correct size when purchasing from a real seller."
    },
    {
        id: 16, name: "Everyday Backpack", category: "Fashion",
        price: 48000, oldPrice: 60000, rating: 4.5, reviews: 84,
        image: "photo-1553062407-98eeb64c6a62",
        badge: "", description: "A backpack-style accessory for school, travel and daily activities."
    },
    {
        id: 17, name: "Classic Wristwatch", category: "Fashion",
        price: 55000, oldPrice: 75000, rating: 4.4, reviews: 69,
        image: "photo-1524592094714-0f0654e20314",
        badge: "SALE", description: "A classic watch-style accessory for everyday outfits."
    },
    {
        id: 18, name: "Stylish Sunglasses", category: "Fashion",
        price: 25000, oldPrice: 35000, rating: 4.2, reviews: 58,
        image: "photo-1511499767150-a48a237f0083",
        badge: "", description: "Sunglasses-style fashion accessory. Check UV protection on a real product listing."
    },
    {
        id: 19, name: "Casual T-Shirt", category: "Fashion",
        price: 22000, oldPrice: 30000, rating: 4.3, reviews: 101,
        image: "photo-1521572163474-6864f9cf17ab",
        badge: "POPULAR", description: "A casual T-shirt-style item for everyday outfits."
    },
    {
        id: 20, name: "Modern Handbag", category: "Fashion",
        price: 72000, oldPrice: 90000, rating: 4.5, reviews: 46,
        image: "photo-1584917865442-de89df76afd3",
        badge: "", description: "A handbag-style fashion accessory."
    },
    {
        id: 21, name: "Electric Kettle", category: "Home",
        price: 42000, oldPrice: 52000, rating: 4.6, reviews: 89,
        image: "photo-1570831739435-6601aa3fa4fb",
        badge: "SALE", description: "An electric kettle-style kitchen appliance. Always follow the manufacturer's safety instructions."
    },
    {
        id: 22, name: "Kitchen Blender", category: "Home",
        price: 78000, oldPrice: 95000, rating: 4.5, reviews: 64,
        image: "photo-1570222094114-d054a817e56b",
        badge: "POPULAR", description: "A blender-style kitchen appliance for everyday food preparation."
    },
    {
        id: 23, name: "Modern Desk Lamp", category: "Home",
        price: 35000, oldPrice: 45000, rating: 4.4, reviews: 51,
        image: "photo-1507473885765-e6ed057f782c",
        badge: "", description: "A desk lamp-style product for reading and studying."
    },
    {
        id: 24, name: "Decorative Plant Pot", category: "Home",
        price: 18000, oldPrice: 25000, rating: 4.2, reviews: 37,
        image: "photo-1485955900006-10f4d324d411",
        badge: "", description: "A decorative plant and home accessory."
    },
    {
        id: 25, name: "Digital Air Fryer", category: "Home",
        price: 165000, oldPrice: 195000, rating: 4.7, reviews: 73,
        image: "photo-1585515320310-259814833e62",
        badge: "FEATURED", description: "An air-fryer-style appliance. Confirm capacity and electrical specifications with the seller."
    },
    {
        id: 26, name: "Comfort Cushion", category: "Home",
        price: 28000, oldPrice: 35000, rating: 4.3, reviews: 44,
        image: "photo-1584100936595-c0654b55a2e2",
        badge: "", description: "A decorative cushion-style home accessory."
    },
    {
        id: 27, name: "Football Training Ball", category: "Sports",
        price: 35000, oldPrice: 45000, rating: 4.6, reviews: 93,
        image: "photo-1614632537190-23e4146777db",
        badge: "SPORTS PICK", description: "A football-style product for training and recreation."
    },
    {
        id: 28, name: "Running Sports Shoes", category: "Sports",
        price: 95000, oldPrice: 120000, rating: 4.7, reviews: 81,
        image: "photo-1460353581641-37baddab0fa2",
        badge: "SALE", description: "Sports shoe-style footwear for everyday movement."
    },
    {
        id: 29, name: "Gym Training Bag", category: "Sports",
        price: 42000, oldPrice: 55000, rating: 4.4, reviews: 45,
        image: "photo-1553062407-98eeb64c6a62",
        badge: "", description: "A bag-style accessory for carrying training equipment."
    },
    {
        id: 30, name: "Skipping Rope", category: "Sports",
        price: 12000, oldPrice: 18000, rating: 4.3, reviews: 62,
        image: "photo-1518611012118-696072aa579a",
        badge: "", description: "A simple fitness accessory for suitable exercise routines."
    },
    {
        id: 31, name: "Perfume Bottle", category: "Beauty",
        price: 48000, oldPrice: 65000, rating: 4.5, reviews: 104,
        image: "photo-1541643600914-78b084683601",
        badge: "POPULAR", description: "A perfume-style product. Fragrance, size and authenticity would need verification with a real seller."
    },
    {
        id: 32, name: "Skincare Essentials", category: "Beauty",
        price: 35000, oldPrice: 45000, rating: 4.4, reviews: 57,
        image: "photo-1556229010-6c3f2c9ca5f8",
        badge: "", description: "A skincare-style product set. Check ingredients and suitability on real products."
    },
    {
        id: 33, name: "Hair Care Brush", category: "Beauty",
        price: 15000, oldPrice: 22000, rating: 4.2, reviews: 39,
        image: "photo-1522335789203-aabd1fc54bc9",
        badge: "", description: "A hair-care accessory-style product."
    },
    {
        id: 34, name: "Personal Grooming Kit", category: "Beauty",
        price: 55000, oldPrice: 70000, rating: 4.5, reviews: 48,
        image: "photo-1621607512214-68297480165e",
        badge: "SALE", description: "A grooming-kit-style product for everyday personal care."
    },
    {
        id: 35, name: "Notebook Set", category: "School",
        price: 12000, oldPrice: 16000, rating: 4.4, reviews: 71,
        image: "photo-1531346878377-a5be20888e57",
        badge: "", description: "A notebook-style stationery set for school or office use."
    },
    {
        id: 36, name: "Scientific Calculator", category: "School",
        price: 28000, oldPrice: 35000, rating: 4.7, reviews: 86,
        image: "photo-1574607383476-f517f260d30b",
        badge: "STUDY PICK", description: "A calculator-style product. Confirm model and functions before purchasing."
    },
    {
        id: 37, name: "Ballpoint Pen Pack", category: "School",
        price: 8000, oldPrice: 12000, rating: 4.2, reviews: 93,
        image: "photo-1455390582262-044cdead277a",
        badge: "", description: "A pen-style stationery product for writing and school work."
    },
    {
        id: 38, name: "USB Flash Drive", category: "School",
        price: 18000, oldPrice: 25000, rating: 4.5, reviews: 116,
        image: "photo-1618410320928-25228d811631",
        badge: "", description: "A USB storage-style accessory. Actual capacity and performance must be confirmed with a seller."
    },
    {
        id: 39, name: "Car Phone Holder", category: "Auto",
        price: 18000, oldPrice: 25000, rating: 4.3, reviews: 67,
        image: "photo-1503376780353-7e6692767b70",
        badge: "", description: "A car accessory-style product for holding a phone. Ensure it does not obstruct your view."
    },
    {
        id: 40, name: "Portable Car Charger", category: "Auto",
        price: 15000, oldPrice: 22000, rating: 4.4, reviews: 78,
        image: "photo-1591290619762-c588f6b9f8b5",
        badge: "SALE", description: "A car charging accessory-style product. Verify device compatibility and safety specifications."
    },
    {
        id: 41, name: "Car Cleaning Kit", category: "Auto",
        price: 32000, oldPrice: 42000, rating: 4.2, reviews: 32,
        image: "photo-1486262715619-67b85e0b08d3",
        badge: "", description: "A car-care kit-style product for vehicle cleaning."
    },
    {
        id: 42, name: "Car Interior Organizer", category: "Auto",
        price: 22000, oldPrice: 30000, rating: 4.1, reviews: 29,
        image: "photo-1503376780353-7e6692767b70",
        badge: "", description: "An organizer-style accessory for a vehicle interior."
    }
];
// Keep the original 42 store products.
const originalStoreProducts = [...products];

const ADMIN_PRODUCTS_KEY = "yahyaMartAdminProducts";

function loadAdminProductsForStore() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(ADMIN_PRODUCTS_KEY) || "[]"
        );

        if (!Array.isArray(saved)) return [];

        return saved.map(product => ({
            ...product,
            oldPrice: null,
            rating: Number(product.rating) || 0,
            reviews: Number(product.reviews) || 0,
            badge: product.badge || "NEW",
            description: product.description ||
                `${product.name} available at YAHYA MART.`,
            image: product.image || ""
        }));
    } catch (error) {
        console.error("Could not load admin products:", error);
        return [];
    }
}

function syncAdminProducts() {
    products = [
        ...originalStoreProducts,
        ...loadAdminProductsForStore()
    ];
}

syncAdminProducts();
/* Category data */
const categories = [
    { name: "Electronics", icon: "📱", description: "Phones & tech" },
    { name: "Gaming", icon: "🎮", description: "Gaming gear" },
    { name: "Fashion", icon: "👟", description: "Style & outfits" },
    { name: "Home", icon: "🏠", description: "Home essentials" },
    { name: "Sports", icon: "⚽", description: "Sports & fitness" },
    { name: "Beauty", icon: "✨", description: "Beauty & care" },
    { name: "School", icon: "📚", description: "School & office" },
    { name: "Auto", icon: "🚗", description: "Car accessories" }
];

/* ==========================================
   2. STATE AND STORAGE
========================================== */

let cart = loadStorage("yahyaMartCart", []);
let wishlist = loadStorage("yahyaMartWishlist", []);
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";
let visibleLimit = 12;
let toastTimer;

const categoryGrid = $("#categoryGrid");
const productGrid = $("#productGrid");
const resultCount = $("#resultCount");
const productHeading = $("#productHeading");
const emptyState = $("#emptyState");
const loadMoreButton = $("#loadMoreButton");

/* Remove invalid saved entries if storage was edited manually. */
cart = Array.isArray(cart)
    ? cart.filter(item =>
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) && item.quantity > 0
      )
    : [];

wishlist = Array.isArray(wishlist)
    ? wishlist.filter(id => products.some(product => product.id === id))
    : [];

function saveCart() {
    saveStorage("yahyaMartCart", cart);
}

function saveWishlist() {
    saveStorage("yahyaMartWishlist", wishlist);
}

function findProduct(id) {
    return products.find(product => product.id === Number(id));
}

function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
    return cart.reduce((total, item) => {
        const product = findProduct(item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

/* ==========================================
   3. CATEGORY DISPLAY
========================================== */

function renderCategories() {
    categoryGrid.innerHTML = categories.map(category => {
        const count = products.filter(p => p.category === category.name).length;
        const selected = activeCategory === category.name ? "selected" : "";

        return `
            <button class="category-card ${selected}"
                type="button"
                data-category="${category.name}">
                <span class="category-icon">${category.icon}</span>
                <strong>${category.name}</strong>
                <small>${count} products</small>
            </button>
        `;
    }).join("");
}

function setCategory(category) {
    activeCategory = category;
    visibleLimit = 12;

    $$(".filter-tab").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === category
        );
    });

    renderCategories();
    renderProducts();

    if (category !== "All") {
        productHeading.textContent = category + " products";
    } else {
        productHeading.textContent = "Explore our products";
    }
}

/* ==========================================
   4. SEARCH, FILTER AND SORT
========================================== */

function getFilteredProducts() {
    let result = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchableText = [
            product.name,
            product.category,
            product.description
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(
            searchTerm.trim().toLowerCase()
        );

        return matchesCategory && matchesSearch;
    });

    switch (sortMode) {
        case "low":
            result.sort((a, b) => a.price - b.price);
            break;
        case "high":
            result.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            result.sort((a, b) => b.rating - a.rating);
            break;
        case "name":
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            result.sort((a, b) => a.id - b.id);
    }

    return result;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const visible = filtered.slice(0, visibleLimit);

    resultCount.textContent =
        `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

    productGrid.innerHTML = visible.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                ${product.badge
                    ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
                    : ""}
                <button class="wishlist-toggle ${wishlist.includes(product.id) ? "active" : ""}"
                    type="button"
                    data-wishlist="${product.id}"
                    aria-label="Toggle wishlist for ${escapeHTML(product.name)}"
                    aria-pressed="${wishlist.includes(product.id)}">
                    ${wishlist.includes(product.id) ? "♥" : "♡"}
                </button>
                <img
                    class="product-image"
                    src="${productImage(product.id, product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    data-product="${product.id}">
            </div>
            <div class="product-info">
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h3 class="product-name" data-product="${product.id}">
                    ${escapeHTML(product.name)}
                </h3>
                <div class="product-rating">★ ${product.rating}
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-price-row">
                    <strong class="product-price">${money(product.price)}</strong>
                    <span class="old-price">${money(product.oldPrice)}</span>
                </div>
                <button class="add-cart-button" type="button" data-add="${product.id}">
                    + Add to cart
                </button>
            </div>
        </article>
    `).join("");

    emptyState.classList.toggle("hidden", filtered.length > 0);
    productGrid.classList.toggle("hidden", filtered.length === 0);
    loadMoreButton.classList.toggle("hidden", visibleLimit >= filtered.length);
}

$("#searchForm").addEventListener("submit", event => {
    event.preventDefault();
    searchTerm = $("#searchInput").value;
    visibleLimit = 12;
    renderProducts();
    $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#searchInput").addEventListener("input", event => {
    searchTerm = event.target.value;
    visibleLimit = 12;
    renderProducts();
});

$("#sortSelect").addEventListener("change", event => {
    sortMode = event.target.value;
    visibleLimit = 12;
    renderProducts();
});

$("#filterTabs").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (button) setCategory(button.dataset.category);
});

categoryGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    setCategory(button.dataset.category);
    $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#allCategoriesButton").addEventListener("click", () => {
    searchTerm = "";
    $("#searchInput").value = "";
    setCategory("All");
    $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#dealsButton").addEventListener("click", () => {
    activeCategory = "All";
    searchTerm = "";
    $("#searchInput").value = "";
    sortMode = "low";
    $("#sortSelect").value = "low";
    visibleLimit = 12;
    setCategory("All");
    renderProducts();
    $("#products").scrollIntoView({ behavior: "smooth" });
});

loadMoreButton.addEventListener("click", () => {
    visibleLimit += 12;
    renderProducts();
});

$("#resetFiltersButton").addEventListener("click", () => {
    searchTerm = "";
    $("#searchInput").value = "";
    sortMode = "featured";
    $("#sortSelect").value = "featured";
    visibleLimit = 12;
    setCategory("All");
});

/* ==========================================
   5. WISHLIST
========================================== */

function toggleWishlist(id) {
    id = Number(id);

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        showToast("Removed from your wishlist.");
    } else {
        wishlist.push(id);
        showToast("Added to your wishlist ♥");
    }

    saveWishlist();
    renderProducts();
    updateHeaderCounts();
}

function showWishlist() {
    activeCategory = "All";
    searchTerm = "";
    $("#searchInput").value = "";
    sortMode = "featured";
    $("#sortSelect").value = "featured";

    const saved = products.filter(product => wishlist.includes(product.id));

    productHeading.textContent = "Your wishlist";
    $$(".filter-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.category === "All");
    });
    renderCategories();

    // Temporarily display only saved products.
    const originalGetFilteredProducts = getFilteredProducts;

    productGrid.innerHTML = saved.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <button class="wishlist-toggle active" type="button"
                    data-wishlist="${product.id}" aria-label="Remove from wishlist">♥</button>
                <img class="product-image" src="${productImage(product.id, product.image)}"
                    alt="${escapeHTML(product.name)}" loading="lazy" data-product="${product.id}">
            </div>
            <div class="product-info">
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h3 class="product-name" data-product="${product.id}">${escapeHTML(product.name)}</h3>
                <div class="product-rating">★ ${product.rating} <span>(${product.reviews})</span></div>
                <div class="product-price-row"><strong class="product-price">${money(product.price)}</strong></div>
                <button class="add-cart-button" type="button" data-add="${product.id}">+ Add to cart</button>
            </div>
        </article>
    `).join("");

    resultCount.textContent = `${saved.length} saved product${saved.length === 1 ? "" : "s"}`;
    productGrid.classList.toggle("hidden", saved.length === 0);
    emptyState.classList.toggle("hidden", saved.length > 0);
    loadMoreButton.classList.add("hidden");

    if (saved.length === 0) {
        emptyState.querySelector("h3").textContent = "Your wishlist is empty";
        emptyState.querySelector("p").textContent = "Tap the heart on a product to save it here.";
    } else {
        emptyState.querySelector("h3").textContent = "No products found";
        emptyState.querySelector("p").textContent = "Try another search or category.";
    }

    // Restore the normal product view on the next category/search/sort action.
    showToast("Showing your saved products.");
    $("#products").scrollIntoView({ behavior: "smooth" });
}

$("#wishlistButton").addEventListener("click", showWishlist);

/* ==========================================
   6. ADD TO CART
========================================== */

function addToCart(id, quantity = 1) {
    const product = findProduct(id);
    if (!product) return;

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: product.id, quantity });
    }

    saveCart();
    updateHeaderCounts();
    renderCart();
    showToast(`${product.name} added to your cart!`);
}

productGrid.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const wishlistButton = event.target.closest("[data-wishlist]");
    const productTarget = event.target.closest("[data-product]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
        return;
    }

    if (wishlistButton) {
        toggleWishlist(Number(wishlistButton.dataset.wishlist));
        return;
    }

    if (productTarget) {
        openProductModal(Number(productTarget.dataset.product));
    }
});

function updateHeaderCounts() {
    $("#cartCount").textContent = getCartQuantity();
    $("#wishlistCount").textContent = wishlist.length;
    $("#drawerCartCount").textContent = `(${getCartQuantity()})`;
}

/* ==========================================
   7. CART DRAWER AND QUANTITY CONTROLS
========================================== */

const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    renderCart();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
    cartDrawer.setAttribute("aria-hidden", "true");

    if (!$(".modal-overlay.show")) {
        document.body.classList.remove("no-scroll");
    }
}

$("#cartButton").addEventListener("click", openCart);
cartOverlay.addEventListener("click", closeCart);
$("#continueShoppingButton").addEventListener("click", closeCart);

function renderCart() {
    const cartItems = $("#cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add a few products and they'll appear here.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => {
            const product = findProduct(item.id);
            if (!product) return "";

            return `
                <div class="cart-item">
                    <img src="${productImage(product.id, product.image)}"
                        alt="${escapeHTML(product.name)}" loading="lazy">
                    <div>
                        <h3>${escapeHTML(product.name)}</h3>
                        <div class="cart-item-price">${money(product.price * item.quantity)}</div>
                        <div class="quantity-control">
                            <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remove item">×</button>
                </div>
            `;
        }).join("");
    }

    $("#cartSubtotal").textContent = money(getCartSubtotal());
    $("#checkoutSubtotal").textContent = money(getCartSubtotal());
    updateHeaderCounts();
}

$("#cartItems").addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        const id = Number(quantityButton.dataset.quantity);
        const change = Number(quantityButton.dataset.change);
        const item = cart.find(cartItem => cartItem.id === id);

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== id);
        }

        saveCart();
        renderCart();
        return;
    }

    if (removeButton) {
        const id = Number(removeButton.dataset.remove);
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
        showToast("Product removed from cart.");
    }
});

/* ==========================================
   8. PRODUCT DETAILS MODAL
========================================== */

const productModal = $("#productModal");

function openProductModal(id) {
    const product = findProduct(id);
    if (!product) return;

    $("#productModalContent").innerHTML = `
        <div class="modal-product-layout">
            <img
                class="modal-product-image"
                src="${productImage(product.id, product.image)}"
                alt="${escapeHTML(product.name)}"
            >

            <div class="modal-product-copy">
                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h2 id="modalTitle">
                    ${escapeHTML(product.name)}
                </h2>

                <div class="product-rating">
                    ★ ${product.rating}
                    <span>(${product.reviews} sample reviews)</span>
                </div>

                <strong class="product-price">
                    ${money(product.price)}
                </strong>

                <p>${escapeHTML(product.description)}</p>

                <p>
                    <strong>Sample price:</strong>
                    This is a demonstration listing, not a live offer.
                </p>

                <h4>Choose quantity</h4>

                <div class="quantity-control">
                    <button
                        type="button"
                        data-modal-quantity="-1"
                        aria-label="Decrease quantity"
                    >−</button>

                    <span id="modalQuantity">1</span>

                    <button
                        type="button"
                        data-modal-quantity="1"
                        aria-label="Increase quantity"
                    >+</button>
                </div>

                <button
                    class="primary-button full-button"
                    type="button"
                    data-modal-add="${product.id}"
                >
                    + Add to cart
                </button>

                <button
                    class="outline-button full-button"
                    type="button"
                    data-modal-wishlist="${product.id}"
                >
                    ${wishlist.includes(product.id)
                        ? "♥ Saved to wishlist"
                        : "♡ Add to wishlist"}
                </button>
            </div>
        </div>
    `;

    showModal(productModal);
}

productModal.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-modal-quantity]");
    const addButton = event.target.closest("[data-modal-add]");
    const wishButton = event.target.closest("[data-modal-wishlist]");

    // Increase or decrease product quantity
    if (quantityButton) {
        const quantityDisplay = $("#modalQuantity");

        if (!quantityDisplay) return;

        const currentQuantity = Number(quantityDisplay.textContent);
        const change = Number(quantityButton.dataset.modalQuantity);

        quantityDisplay.textContent = Math.max(
            1,
            currentQuantity + change
        );

        return;
    }

    // Add selected quantity to cart
    if (addButton) {
        const productId = Number(addButton.dataset.modalAdd);
        const quantity = Number($("#modalQuantity")?.textContent || 1);

        addToCart(productId, quantity);
        closeModal(productModal);
        return;
    }

    // Add or remove product from wishlist
    if (wishButton) {
        const productId = Number(wishButton.dataset.modalWishlist);

        toggleWishlist(productId);
        openProductModal(productId);
    }
});

/* ==========================================
   9. CHECKOUT AND DEMO ORDERS
========================================== */

const checkoutModal = $("#checkoutModal");
const successModal = $("#successModal");

$("#checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty. Add a product first.");
        return;
    }

    closeCart();
    $("#checkoutSubtotal").textContent = money(getCartSubtotal());
    showModal(checkoutModal);
});

$("#checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        closeModal(checkoutModal);
        showToast("Your cart is empty.");
        return;
    }

    const formData = new FormData(event.currentTarget);

    const order = {
        orderNumber: "YM-" + Date.now().toString().slice(-8),
        createdAt: new Date().toISOString(),
        customer: {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            region: formData.get("region"),
            delivery: formData.get("delivery"),
            address: formData.get("address")
        },
        items: cart.map(item => {
            const product = findProduct(item.id);
            return {
                id: item.id,
                name: product.name,
                unitPrice: product.price,
                quantity: item.quantity,
                lineTotal: product.price * item.quantity
            };
        }),
        subtotal: getCartSubtotal(),
        status: "Demo order only"
    };

    const orders = loadStorage("yahyaMartDemoOrders", []);
    orders.push(order);

    if (!saveStorage("yahyaMartDemoOrders", orders)) {
        showToast("Could not save this demo order in your browser.");
        return;
    }

    closeModal(checkoutModal);
    $("#successMessage").textContent =
        `Thank you, ${order.customer.name}! Your sample order subtotal is ${money(order.subtotal)}. No real payment was taken.`;
    $("#orderNumber").textContent = "Order reference: " + order.orderNumber;

    cart = [];
    saveCart();
    renderCart();
    showModal(successModal);
    event.currentTarget.reset();
});

$("#finishOrderButton").addEventListener("click", () => {
    closeModal(successModal);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Welcome back to Yahya Mart!");
});

/* ==========================================
   10. MODAL AND DRAWER HELPERS
========================================== */

function showModal(modal) {
    modal.classList.add("show");
    document.body.classList.add("no-scroll");
}

function closeModal(modal) {
    modal.classList.remove("show");

    if (!$(".modal-overlay.show") && !cartDrawer.classList.contains("open")) {
        document.body.classList.remove("no-scroll");
    }
}

$$("[data-close='cart']").forEach(button => {
    button.addEventListener("click", closeCart);
});

$$("[data-close='product']").forEach(button => {
    button.addEventListener("click", () => closeModal(productModal));
});

$$("[data-close='checkout']").forEach(button => {
    button.addEventListener("click", () => closeModal(checkoutModal));
});

[productModal, checkoutModal, successModal].forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        [productModal, checkoutModal, successModal].forEach(closeModal);
    }
});

/* ==========================================
   11. NEWSLETTER DEMO
========================================== */

$("#newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#newsletterEmail").value.trim();

    if (!email) return;

    $("#newsletterStatus").textContent =
        "Thanks! This demo does not send or store newsletter subscriptions.";
    event.currentTarget.reset();
});

/* ==========================================
   12. TOAST MESSAGES
========================================== */

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* ==========================================
   13. IMAGE FALLBACK
   Show a readable placeholder if an image fails.
========================================== */

document.addEventListener("error", event => {
    const image = event.target;

    if (image.tagName !== "IMG" || image.dataset.fallbackApplied) {
        return;
    }

    image.dataset.fallbackApplied = "true";
    image.removeAttribute("src");
    image.style.objectFit = "contain";
    image.style.mixBlendMode = "normal";
    image.style.background = "#ecebff";
    image.alt = "Product image unavailable";
}, true);

/* ==========================================
   14. INITIALIZE STORE
========================================== */

renderCategories();
renderProducts();
renderCart();
updateHeaderCounts();

console.log("Yahya Mart demo loaded successfully.");
console.log(`${products.length} sample products are available.`);