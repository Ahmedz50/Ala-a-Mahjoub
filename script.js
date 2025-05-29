
// Global Variables
let products = [];
let cart = [];
let currentFilter = 'الكل';
let currentSearchTerm = '';

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartDropdown = document.getElementById('cart-dropdown');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartItems = document.getElementById('cart-items');
const cartActions = document.getElementById('cart-actions');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    loadProducts();
    loadCart();
    setupEventListeners();
    setupCarousel();
});

// Load Products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        console.log('Products loaded:', products.length);

        // Load featured products on home page
        if (document.getElementById('featured-products-grid')) {
            displayFeaturedProducts();
        }

        // Load gallery
        if (document.getElementById('carousel-track')) {
            setupGallery();
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display Featured Products (3 random products)
function displayFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid');
    if (!grid || products.length === 0) return;

    // Get 3 random products
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const featuredProducts = shuffled.slice(0, 9);

    grid.innerHTML = '';
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Create Product Card Element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image" onclick="viewProduct(${product.id})">
            ${product.image ? `<img src="${product.image}" alt="${product.title}">` : '<div class="emoji">👗</div>'}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} ج.م</div>
            <div class="product-footer">
                <button onclick="orderProductViaWhatsApp('${product.title}')" class="btn-primary">
                    الطلب عبر واتساب
                </button>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    إضافة للسلة
                </button>
            </div>
        </div>
    `;
    return card;
}

// View Product Details
function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Setup Gallery Carousel
function setupGallery() {
    const track = document.getElementById('carousel-track');
    if (!track || products.length === 0) return;

    track.innerHTML = '';
    products.forEach(product => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = product.image ? 
            `<img src="${product.image}" alt="${product.title}">` :
            `<div style="background: linear-gradient(135deg, #80E0F8, #A090C0); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 60px;">👗</div>`;

        galleryItem.addEventListener('click', () => viewProduct(product.id));
        track.appendChild(galleryItem);
    });
}

// Setup Carousel Navigation
function setupCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const itemWidth = 320; // 300px + 20px gap

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        track.style.transform = `translateX(${currentIndex * itemWidth}px)`;
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, track.children.length - 3);
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart Toggle
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCart();
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartDropdown && !cartDropdown.contains(e.target) && cartBtn && !cartBtn.contains(e.target)) {
            cartDropdown.classList.remove('show');
        }
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
        });
    }

    // WhatsApp Order Button
    const whatsappOrderBtn = document.getElementById('whatsapp-order');
    if (whatsappOrderBtn) {
        whatsappOrderBtn.addEventListener('click', handleWhatsAppOrder);
    }

    // Clear Cart Button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Close mobile menu if open
            if (mobileMenu) {
                mobileMenu.classList.remove('show');
            }
        });
    });
}

// Cart Functions
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();

    // Show success message
    alert(`تم إضافة ${product.title} إلى السلة!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart count
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (cartTotal) {
        cartTotal.textContent = totalItems;
    }

    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty">السلة فارغة</div>';
            if (cartActions) cartActions.style.display = 'none';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-image">
                            ${item.product.image ? 
                                `<img src="${item.product.image}" alt="${item.product.title}">` : 
                                '<span>👗</span>'
                            }
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.product.title}</h4>
                            <p>الكمية: ${item.quantity}</p>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.product.id})" class="cart-item-remove">
                        حذف
                    </button>
                </div>
            `).join('');
            if (cartActions) cartActions.style.display = 'flex';
        }
    }
}

function toggleCart() {
    if (cartDropdown) {
        cartDropdown.classList.toggle('show');
    }
}

// WhatsApp Functions
function openWhatsApp(message) {
    const whatsappUrl = `https://wa.me/201222292977?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function orderProductViaWhatsApp(productTitle) {
    const message = `مرحباً، أريد طلب ${productTitle}`;
    openWhatsApp(message);
}

function handleWhatsAppOrder() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    const message = `مرحباً، أريد طلب المنتجات التالية:\n${cart.map(item => 
        `- ${item.product.title} (${item.quantity}x)`
    ).join('\n')}`;

    openWhatsApp(message);
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    const whatsappMessage = `مرحباً، اسمي ${name}\nالإيميل: ${email}\n${phone ? `الهاتف: ${phone}\n` : ''}الرسالة: ${message}`;

    openWhatsApp(whatsappMessage);

    // Reset form
    e.target.reset();
}

// Go Back Function
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

console.log('Script loaded successfully');