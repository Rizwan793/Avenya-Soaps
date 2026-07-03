// Avenya Luxury & Minimalist Soap Brand Website JavaScript Logic
// 1. Product Catalog Data
const products = [
  {
    id: "soap-sage",
    title: "Sage & Lemongrass Clay Bar",
    category: "soothing",
    price: 380.00,
    image: "assets/soap_sage.jpg",
    badge: "Best Seller",
    description: "Formulated with wild garden sage and steam-distilled lemongrass essential oil, this soap delivers a crisp, clarifying aroma while gently calming irritated skin. The combination of plant oils leaves a protective hydrating layer on the skin.",
    benefits: "Purifies pores, tones skin, aromatherapy boost",
    skin: "All, particularly combination or oily skin",
    ingredients: "Saponified Extra Virgin Olive Oil, Organic Coconut Oil, Raw Shea Butter, Sage Extract, Lemongrass Essential Oil, French Green Clay, Distilled Water."
  },
  {
    id: "soap-lavender",
    title: "Lavender & Oatmeal Moisture Bar",
    category: "hydrating",
    price: 420.00,
    image: "assets/soap_lavender.jpg",
    badge: "New Release",
    description: "Infused with pure organic goat milk, calming lavender buds, and finely ground oats, this soap gently exfoliates while providing intense moisture. Perfect for a relaxing evening bathing ritual.",
    benefits: "Deep hydration, soothing exfoliation, calms anxiety",
    skin: "Dry, sensitive, or eczema-prone skin",
    ingredients: "Saponified Extra Virgin Olive Oil, Sweet Almond Oil, Organic Goat Milk, Colloidal Oatmeal, Lavender Essential Oil, Dried Lavender Florets, Natural Glycerin."
  },
  {
    id: "soap-charcoal",
    title: "Activated Charcoal & Tea Tree Detox Bar",
    category: "detoxifying",
    price: 390.00,
    image: "assets/soap_charcoal.jpg",
    badge: "Deep Clean",
    description: "Activated charcoal acts like a magnet to extract deep-seated impurities from your pores, while Australian tea tree essential oil provides powerful antiseptic benefits to combat blemishes.",
    benefits: "Extracts toxins, fights acne, balances sebum",
    skin: "Oily, acne-prone, or congested skin",
    ingredients: "Saponified Coconut Oil, Castor Oil, Activated Bamboo Charcoal Powder, Tea Tree Essential Oil, Eucalyptus Essential Oil, Bentonite Clay, Distilled Water."
  },
  {
    id: "soap-rose",
    title: "French Pink Clay & Rose Nourish Bar",
    category: "hydrating",
    price: 450.00,
    image: "assets/soap_rose.jpg",
    badge: "Luxury Blend",
    description: "Enriched with nutrient-dense French pink clay to gently cleanse without stripping moisture, and scented with exquisite Bulgarian Damask rose oil for an indulgent, floral sensory experience.",
    benefits: "Gentle polishing, boosts skin elasticity, luxurious fragrance",
    skin: "Mature, dry, sensitive, or normal skin",
    ingredients: "Saponified Extra Virgin Olive Oil, Avocado Oil, French Pink Clay, Bulgarian Rose Damask Absolute, Geranium Essential Oil, Organic Red Rose Petals, Distilled Water."
  }
];
// WhatsApp Phone Number
const WHATSAPP_NUMBER = "919744959412"; // Country code +91, number 9744959412
// Cart State (Initialized from localStorage if exists)
let cart = JSON.parse(localStorage.getItem("avenya_cart")) || [];
// DOM Elements
const productGrid = document.getElementById("product-grid-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartDrawer = document.getElementById("cart-drawer-panel");
const cartOverlay = document.getElementById("cart-drawer-overlay");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartBadgeCount = document.getElementById("cart-badge-count");
const cartSubtotalVal = document.getElementById("cart-subtotal-val");
const checkoutWhatsappBtn = document.getElementById("checkout-whatsapp-btn");
const floatingWhatsappBadge = document.getElementById("floating-whatsapp-badge");
// Modal DOM Elements
const productDetailModal = document.getElementById("product-detail-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalProductImage = document.getElementById("modal-product-image");
const modalProductCategory = document.getElementById("modal-product-category");
const modalProductTitle = document.getElementById("modal-product-title");
const modalProductPrice = document.getElementById("modal-product-price");
const modalProductDesc = document.getElementById("modal-product-desc");
const modalProductBenefits = document.getElementById("modal-product-benefits");
const modalProductSkin = document.getElementById("modal-product-skin");
const modalProductIngredients = document.getElementById("modal-product-ingredients");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart");
let activeModalProductId = null;
// 2. Initialize Website
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("all");
  updateCartUI();
  setupEventListeners();
});
// Setup All DOM Event Listeners
function setupEventListeners() {
  // Sticky Header Effect
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  // Shop Filter Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(button => button.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const filter = e.currentTarget.getAttribute("data-filter");
      renderProducts(filter);
    });
  });
  // Cart Drawer Toggle
  cartToggleBtn.addEventListener("click", openCartDrawer);
  cartCloseBtn.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);
  // Checkout Button
  checkoutWhatsappBtn.addEventListener("click", checkoutCartViaWhatsApp);
  // Floating WhatsApp Badge
  floatingWhatsappBadge.addEventListener("click", openGeneralWhatsAppEnquiry);
  // Close Product Details Modal
  modalCloseBtn.addEventListener("click", closeProductModal);
  productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) {
      closeProductModal();
    }
  });
  // Modal Add to Cart Button
  modalAddToCartBtn.addEventListener("click", () => {
    if (activeModalProductId) {
      addToCart(activeModalProductId);
      closeProductModal();
    }
  });
}
// 3. Render Product Gallery
function renderProducts(filterCategory) {
  productGrid.innerHTML = "";
  
  const filteredProducts = filterCategory === "all" 
    ? products 
    : products.filter(p => p.category === filterCategory);
  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card float-slow";
    // Vary the floating animation slightly for a natural non-synchronized feel
    if (product.id === "soap-lavender" || product.id === "soap-rose") {
      card.className = "product-card float-medium";
    }
    card.innerHTML = `
      <div class="product-img-container">
        <img src="${product.image}" alt="${product.title}">
        <span class="product-badge-tag">${product.badge}</span>
        <div class="product-action-overlay">
          <button class="btn-quick-view" data-id="${product.id}">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-title" data-id="${product.id}">${product.title}</h3>
        <p class="product-price">₹${product.price.toFixed(2)}</p>
        <button class="btn-add-cart" data-id="${product.id}">Add to Basket</button>
      </div>
    `;
    // Quick View click trigger on image overlay
    card.querySelector(".btn-quick-view").addEventListener("click", (e) => {
      openProductModal(product.id);
    });
    // Quick View trigger on title click
    card.querySelector(".product-title").addEventListener("click", (e) => {
      openProductModal(product.id);
    });
    // Add to Cart trigger
    card.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      addToCart(product.id);
    });
    productGrid.appendChild(card);
  });
}
// 4. Cart Operations
function addToCart(productId) {
  const existingItemIndex = cart.findIndex(item => item.id === productId);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  saveCart();
  updateCartUI();
  openCartDrawer(); // Slide open cart drawer to verify addition
}
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}
function changeQuantity(productId, amount) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += amount;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
  }
}
function saveCart() {
  localStorage.setItem("avenya_cart", JSON.stringify(cart));
}
// Synchronize UI with local state
function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let totalItemsCount = 0;
  let subtotal = 0;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="cart-empty-message">Your basket is empty.<br>Start adding some apothecary bars.</div>`;
  } else {
    cart.forEach(item => {
      totalItemsCount += item.quantity;
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";
      itemRow.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.title}">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">₹${item.price.toFixed(2)}</span>
          <div class="cart-qty-ctrl">
            <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
        <div class="cart-item-total-price">₹${itemTotal.toFixed(2)}</div>
      `;
      // Wire up row button events
      itemRow.querySelector(".dec-btn").addEventListener("click", () => changeQuantity(item.id, -1));
      itemRow.querySelector(".inc-btn").addEventListener("click", () => changeQuantity(item.id, 1));
      itemRow.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.id));
      cartItemsContainer.appendChild(itemRow);
    });
  }
  cartBadgeCount.innerText = totalItemsCount;
  cartSubtotalVal.innerText = `₹${subtotal.toFixed(2)}`;
}
// Cart Drawer Navigation Controls
function openCartDrawer() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden"; // Prevent backpage scrolling
}
function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}
// 5. Product Detail Modal Controls
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  activeModalProductId = productId;
  modalProductImage.src = product.image;
  modalProductImage.alt = product.title;
  modalProductCategory.innerText = product.category;
  modalProductTitle.innerText = product.title;
  modalProductPrice.innerText = `₹${product.price.toFixed(2)}`;
  modalProductDesc.innerText = product.description;
  modalProductBenefits.innerText = product.benefits;
  modalProductSkin.innerText = product.skin;
  modalProductIngredients.innerText = product.ingredients;
  productDetailModal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeProductModal() {
  productDetailModal.classList.remove("open");
  activeModalProductId = null;
  document.body.style.overflow = "";
}
// 6. WhatsApp Communication API Integrations
function checkoutCartViaWhatsApp() {
  if (cart.length === 0) {
    alert("Your basket is empty. Add soaps from the catalog to place an inquiry.");
    return;
  }
  let subtotal = 0;
  let itemsMessage = "";
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    itemsMessage += `${index + 1}. *${item.title}*  -  ${item.quantity} units x ₹${item.price.toFixed(2)}  =  ₹${itemTotal.toFixed(2)}\n`;
  });
  const message = `Hello Avenya! 🌿\n\nI would like to place an order inquiry for the following handmade soap collection:\n\n${itemsMessage}\n*Total Cart Value*: ₹${subtotal.toFixed(2)}\n\nPlease let me know about availability and shipping details. Thank you!`;
  
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;
  
  window.open(whatsappUrl, "_blank");
}
function openGeneralWhatsAppEnquiry() {
  const message = "Hello Avenya! 🌿\n\nI am browsing your collection of luxury handmade soaps and would love to receive your catalog. Could you also help me recommend soap bars tailored for my skin type?";
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;
  
  window.open(whatsappUrl, "_blank");
}
