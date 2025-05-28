// Product details page functionality
let currentProduct = null;

// Initialize product details page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
});

// Load product details
async function loadProductDetails() {
    try {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        if (!productId) {
            showProductNotFound();
            return;
        }

        // Load products and find the specific product
        const response = await fetch('products.json');
        const products = await response.json();
        currentProduct = products.find(p => p.id === productId);

        if (!currentProduct) {
            showProductNotFound();
            return;
        }

        displayProductDetails();
        console.log('Product details loaded for:', currentProduct.title);

    } catch (error) {
        console.error('Error loading product details:', error);
        showProductNotFound();
    }
}

// Display product details
function displayProductDetails() {
    const productContent = document.getElementById('product-content');
    if (!productContent || !currentProduct) return;

    productContent.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                ${currentProduct.image ? 
                    `<img src="${currentProduct.image}" alt="${currentProduct.title}">` : 
                    '<div class="emoji">👗</div>'
                }
            </div>
            <div class="thumbnail-images">
                ${Array(4).fill().map((_, i) => `
                    <div class="thumbnail">
                        ${currentProduct.image ? 
                            `<img src="${currentProduct.image}" alt="${currentProduct.title}">` : 
                            '<div class="emoji">👗</div>'
                        }
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="product-info">
            <div class="product-header">
                <span class="product-category">${currentProduct.category}</span>
                <h1>${currentProduct.title}</h1>
                <div class="price">${currentProduct.price} ج.م</div>
            </div>
            
            <div class="product-description-section">
                <h3>وصف المنتج</h3>
                <p>${currentProduct.longDescription || currentProduct.description}</p>
            </div>
            
            <div class="product-features">
                <h3>تفاصيل المنتج</h3>
                <ul class="features-list">
                    <li>تصميم سوداني أصيل</li>
                    <li>خامات عالية الجودة</li>
                    <li>تطريز يدوي دقيق</li>
                    <li>مناسب لجميع المناسبات</li>
                </ul>
            </div>
            
            <div class="product-actions">
                <button onclick="orderCurrentProductViaWhatsApp()" class="action-btn primary">
                    <span>📱</span>
                    طلب عبر واتساب
                </button>
                <button onclick="addCurrentProductToCart()" class="action-btn secondary">
                    <span>🛍️</span>
                    أضف للسلة
                </button>
            </div>
        </div>
    `;

    // Update page title
    document.title = `${currentProduct.title} - علاء محجوب`;
}

// Show product not found
function showProductNotFound() {
    const productContent = document.getElementById('product-content');
    if (!productContent) return;

    productContent.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">😔</div>
            <h1 style="font-size: 2rem; color: #283850; margin-bottom: 20px;">المنتج غير موجود</h1>
            <p style="color: #6b7280; margin-bottom: 30px;">عذراً، لم نتمكن من العثور على المنتج المطلوب</p>
            <a href="products.html" class="btn-primary">العودة للمنتجات</a>
        </div>
    `;
}

// Order current product via WhatsApp
function orderCurrentProductViaWhatsApp() {
    if (!currentProduct) return;

    const message = `مرحباً، أريد طلب ${currentProduct.title}`;
    const whatsappUrl = `https://wa.me/201222292977?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add current product to cart
function addCurrentProductToCart() {
    if (!currentProduct) return;

    // Get existing cart from localStorage
    let cart = [];
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    const existingItem = cart.find(item => item.product.id === currentProduct.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: currentProduct,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart UI if the function exists
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }

    alert(`تم إضافة ${currentProduct.title} إلى السلة!`);
}

console.log('Product details script loaded');