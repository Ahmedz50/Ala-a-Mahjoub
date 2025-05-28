// Products page specific functionality
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'الكل';
let searchTerm = '';

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    loadProductsPage();
    setupProductsEventListeners();
});

// Load products for products page
async function loadProductsPage() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        displayProductsGrid();
        console.log('Products page loaded with', allProducts.length, 'products');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in grid
function displayProductsGrid() {
    const productsGrid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');

    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    if (noProducts) noProducts.style.display = 'none';

    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = createProductCardForGrid(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card for grid
function createProductCardForGrid(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image" onclick="viewProductDetails(${product.id})">
            ${product.image ? `<img src="${product.image}" alt="${product.title}">` : '<div style="font-size: 60px;">👗</div>'}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} ج.م</div>
            <div class="product-footer">
                <button onclick="orderProductViaWhatsApp('${product.title}')" class="btn-primary">
                    طلب عبر واتساب
                </button>
                <button onclick="addToCartFromGrid(${product.id})" class="add-to-cart-btn">
                    أضف للسلة
                </button>
            </div>
        </div>
    `;
    return card;
}

// View product details
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Add to cart from grid
function addToCartFromGrid(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Get existing cart from localStorage
    let cart = [];
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    const existingItem = cart.find(item => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Update cart UI if the function exists
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
  
    alert(`تم إضافة ${product.title} إلى السلة!`);
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    applyFilters();

    // Update active category button
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Filter products by search term
function filterBySearch(term) {
    searchTerm = term.toLowerCase();
    applyFilters();
}

// Apply all filters
function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        const matchesCategory = currentCategory === 'الكل' || product.category === currentCategory;
        const matchesSearch = searchTerm === '' || 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    displayProductsGrid();
}

// Setup event listeners for products page
function setupProductsEventListeners() {
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterBySearch(this.value);
        });
    }
}

console.log('Products page script loaded');