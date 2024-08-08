document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const taxElement = document.getElementById('tax');
    const grandTotalElement = document.getElementById('grand-total');
    
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function fetchProducts() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                console.log('Products fetched:', products); // Log products data
                renderProducts();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function renderProducts() {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            
            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const productId = parseInt(event.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            const itemInCart = cart.find(item => item.id === productId);

            if (itemInCart) {
                itemInCart.quantity += 1;
            } else {
                cart.push({ id: product.id, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemElement = document.createElement('li');
                itemElement.classList.add('cart-item');
                
                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <p>${product.name}</p>
                    <p>$${product.price.toFixed(2)}</p>
                    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                `;
                
                cartItemsContainer.appendChild(itemElement);
                total += product.price * item.quantity;
            }
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });

        const tax = total * 0.13; // Updated tax rate to 13%
        const grandTotal = total + tax;

        totalPriceElement.textContent = total.toFixed(2);
        taxElement.textContent = tax.toFixed(2);
        grandTotalElement.textContent = grandTotal.toFixed(2);
    }

    function removeFromCart(event) {
        const productId = parseInt(event.target.getAttribute('data-id'));

        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    fetchProducts();
});
