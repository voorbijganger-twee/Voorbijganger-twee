// Winkelmand ophalen uit de browser
function getCart() {
    return JSON.parse(localStorage.getItem('voorbijganger_cart')) || [];
}

// Winkelmand opslaan
function saveCart(cart) {
    localStorage.setItem('voorbijganger_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Aantal items bijwerken op de knop
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.textContent = totalItems;
}

// Winkelmand openen of sluiten
function toggleCartModal() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
    }
}

// Product toevoegen aan winkelmand
function addToCart(title, price) {
    let cart = getCart();
    const existing = cart.find(item => item.title === title);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ title: title, price: price, quantity: 1 });
    }
    saveCart(cart);
    
    // Open direct het winkelmandje aan de zijkant
    const drawer = document.getElementById('cart-drawer');
    if (drawer && !drawer.classList.contains('open')) {
        drawer.classList.add('open');
    }
}

// Aantal van een product aanpassen (+ / -)
function updateQuantity(title, change) {
    let cart = getCart();
    const item = cart.find(i => i.title === title);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.title !== title);
        }
    }
    saveCart(cart);
}

// Winkelmand inhoud opbouwen
function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    let total = 0;

    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Je winkelmandje is nog leeg.</p>';
        } else {
            cartContainer.innerHTML = cart.map(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
                        <div>
                            <strong>${item.title}</strong><br>
                            <small>€${item.price.toFixed(2)} p.s.</small>
                        </div>
                        <div>
                            <button onclick="updateQuantity('${item.title}', -1)">-</button>
                            <span style="margin: 0 5px;">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.title}', 1)">+</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        if (totalElement) totalElement.textContent = total.toFixed(2);
    }

    // Checkout pagina opbouwen (voor checkout.html)
    const checkoutContainer = document.getElementById('checkout-cart-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const hiddenOrderInput = document.getElementById('form-order-details');
    const hiddenTotalInput = document.getElementById('form-order-total');

    if (checkoutContainer) {
        if (cart.length === 0) {
            checkoutContainer.innerHTML = '<p>Je winkelmandje is leeg.</p>';
        } else {
            let checkoutSum = 0;
            let summaryText = '';
            checkoutContainer.innerHTML = cart.map(item => {
                const subtotal = item.price * item.quantity;
                checkoutSum += subtotal;
                summaryText += `${item.quantity}x ${item.title} (€${subtotal.toFixed(2)})\n`;
                return `<p>${item.quantity}x <strong>${item.title}</strong> - €${subtotal.toFixed(2)}</p>`;
            }).join('');

            if (hiddenOrderInput) hiddenOrderInput.value = summaryText;
            if (hiddenTotalInput) hiddenTotalInput.value = `€${checkoutSum.toFixed(2)}`;
            if (checkoutTotal) checkoutTotal.textContent = checkoutSum.toFixed(2);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});