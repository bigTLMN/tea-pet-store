document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartView = document.getElementById('cart-view');
    const closeCartButton = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    const productList = document.getElementById('products');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    function parseINIString(data) {
        const regex = {
            section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
            param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
            comment: /^\s*;.*$/
        };
        const value = {};
        const lines = data.split(/[\r\n]+/);
        let section = null;
        lines.forEach(line => {
            if (regex.comment.test(line)) {
                return;
            } else if (regex.param.test(line)) {
                const match = line.match(regex.param);
                if (section) {
                    value[section][match[1]] = match[2];
                } else {
                    value[match[1]] = match[2];
                }
            } else if (regex.section.test(line)) {
                const match = line.match(regex.section);
                value[match[1]] = {};
                section = match[1];
            } else if (line.length === 0 && section) {
                section = null;
            }
        });
        return value;
    }

    function loadProducts(callback) {
        fetch('products.ini')
            .then(response => response.text())
            .then(data => {
                const products = parseINIString(data);
                callback(products);
            })
            .catch(err => console.error('Failed to load products.ini', err));
    }

    function updateCartView() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = '移除';
            removeButton.onclick = () => removeFromCart(item.id);
            li.appendChild(removeButton);
            cartItems.appendChild(li);
        });
        cartCount.textContent = cart.length;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            alert('產品未找到');
            return;
        }
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        updateCartView();
        alert(`產品 ${product.name} 已加入購物車`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartView();
    }

    cartButton.onclick = () => {
        cartView.classList.toggle('hidden');
    }

    closeCartButton.onclick = () => {
        cartView.classList.add('hidden');
    }

    checkoutButton.onclick = () => {
        alert('結帳功能尚未實現');
    }

    function displayProducts(products) {
        if (productList) {
            productList.innerHTML = '';
            products.forEach(product => {
                if (!product.id || !product.name || !product.description || !product.price || !product.image) {
                    return; // Skip any product that doesn't have the necessary information
                }

                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <a href="product${product.id}.html">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p>$${product.price}</p>
                    </a>
                    <button onclick="addToCart(${product.id})">加入購物車</button>
                `;
                productList.appendChild(productCard);
            });
        }
    }

    loadProducts(loadedProducts => {
        products = Object.keys(loadedProducts).filter(key => key.startsWith('product')).map(key => {
            const product = loadedProducts[key];
            return {
                id: parseInt(key.replace('product', '')),
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                image: product.image,
                detailsPage: `product${key.replace('product', '')}.html`
            };
        });

        displayProducts(products);
        updateCartView();

        if (document.querySelector('.product-detail')) {
            const productId = parseInt(window.location.pathname.match(/product(\d+)/)[1]);
            const product = products.find(p => p.id === productId);
            if (product) {
                document.querySelector('.product-detail h2').textContent = product.name;
                document.querySelector('.product-detail img').src = product.image;
                document.querySelector('.product-detail img').alt = product.name;
                document.querySelector('.product-detail .product-size').textContent = `尺寸：${product.size || ''}`;
                document.querySelector('.product-detail .product-price').textContent = `價格：$${product.price}`;
                document.querySelector('.product-detail .product-discount').textContent = '優惠：購買兩件享九折優惠';
                document.querySelector('.product-detail button').onclick = () => addToCart(product.id);
            }
        }
    });
});