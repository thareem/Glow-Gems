document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.getElementById('close-cart-btn');

    updateCartUI();

    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('active');
            cartOverlay.classList.remove('active');
        }
    }

    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // 1. Add to Cart Click -> Opens Side Cart Drawer ONLY
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.card');
            const title = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Product';
            const priceText = card.querySelector('p') ? card.querySelector('p').innerText : '0';
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            const imgSrc = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';

            const existingProduct = cart.find(item => item.title === title);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ title, price, imgSrc, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            openCart(); // Sirf Side Cart panel khule ga
        }
    });

    function updateCartUI() {
        const cartCountElement = document.getElementById('cart-count');
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalPrice = document.getElementById('cart-total-price');

        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) cartCountElement.innerText = totalCount;

        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Your cart is empty.</p>';
            if (cartTotalPrice) cartTotalPrice.innerText = 'PKR 0';
            return;
        }

        let total = 0;
        cartContainer.innerHTML = '';

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.imgSrc}" alt="${item.title}">
                    <div class="cart-item-info">
                        <h4>${item.title}</h4>
                        <p>PKR ${item.price.toLocaleString()} x ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">&times;</button>
                </div>
            `;
        });

        if (cartTotalPrice) cartTotalPrice.innerText = `PKR ${total.toLocaleString()}`;
    }

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    };
// 2. Category Filter Logic
const filterBtns = document.querySelectorAll('.filter-btn'); // Aapke filter buttons
const cards = document.querySelectorAll('.card'); // Product cards

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active class update
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedCategory = btn.innerText.trim().toLowerCase(); // e.g. 'earrings'

    cards.forEach(card => {
      const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : '';
      
      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
    // 3. Checkout Modal Click -> Opens Form ONLY when 'Proceed to Checkout' is clicked
    const checkoutModal = document.getElementById('checkout-modal');
    const openCheckoutBtn = document.getElementById('open-checkout-btn');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');

    if (openCheckoutBtn) {
        openCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Aap ka cart khaali hai!');
                return;
            }
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const deliveryFee = 200;
            const grandTotal = subtotal + deliveryFee;

            document.getElementById('summary-subtotal').innerText = `PKR ${subtotal.toLocaleString()}`;
            document.getElementById('summary-grandtotal').innerText = `PKR ${grandTotal.toLocaleString()}`;

            closeCart(); // Cart Drawer close hoga
            checkoutModal.classList.add('active'); // Checkout Modal open hoga
        });
    }

    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
            
            alert(`🎉 Order Placed Successfully!\nPayment Mode: ${selectedPayment.toUpperCase()}\nThank you for shopping with Glow & Gem.`);
            
            cart = [];
            localStorage.removeItem('cart');
            updateCartUI();
            checkoutModal.classList.remove('active');
        });
    }
});
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Remove active class from all buttons and add to clicked button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Get selected category
    const selectedCategory = btn.dataset.category ? btn.dataset.category.toLowerCase().trim() : 'all';

    // 3. Show/Hide cards based on category
    cards.forEach(card => {
      const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase().trim() : '';

      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        card.style.display = 'block'; 
      } else {
        card.style.display = 'none';
      }
    });
  });
});
// Image Pop-up Click Code
document.addEventListener('click', function(e) {
    const modal = document.getElementById('image-modal');
    const fullImg = document.getElementById('full-img');

    // Jab product card par ya uski image par click ho
    if (e.target.tagName === 'IMG' && e.target.closest('.card')) {
        if (modal && fullImg) {
            fullImg.src = e.target.src;
            modal.style.display = 'flex';
        }
    }

    // Jab X (close) ya dark background par click ho
    if (e.target.classList.contains('close-modal') || e.target === modal) {
        if (modal) modal.style.display = 'none';
    }
});