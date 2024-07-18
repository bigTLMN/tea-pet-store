const products = [
    {
        name: '茶寵 1',
        description: '用高品質黏土精心製作的美麗茶寵。',
        price: 29.99,
        imageUrl: 'https://example.com/tea_pet1.jpg'
    },
    {
        name: '茶寵 2',
        description: '獨特設計的茶寵，為您的茶會增添魅力。',
        price: 34.99,
        imageUrl: 'https://example.com/tea_pet2.jpg'
    },
    {
        name: '茶寵 3',
        description: '手繪的茶寵，具有精緻的細節。',
        price: 25.99,
        imageUrl: 'https://example.com/tea_pet3.jpg'
    },
    {
        name: '茶寵 4',
        description: '經典茶寵，為您的茶道帶來優雅。',
        price: 39.99,
        imageUrl: 'https://example.com/tea_pet4.jpg'
    }
];

let cart = [];

function loadProducts(sortOrder = 'price-asc') {
    fetch('/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';

            const sortedProducts = [...products];
            if (sortOrder === 'price-asc') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortOrder === 'price-desc') {
                sortedProducts.sort((a, b) => b.price - a.price);
            }

            sortedProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                const img = document.createElement('img');
                img.src = product.imageUrl;
                img.alt = product.name;
                
                const h2 = document.createElement('h2');
                h2.textContent = product.name;
                
                const pDesc = document.createElement('p');
                pDesc.textContent = product.description;
                
                const pPrice = document.createElement('p');
                pPrice.textContent = `$${product.price.toFixed(2)}`;

                const button = document.createElement('button');
                button.textContent = '加入購物車';
                button.addEventListener('click', () => addToCart(product));
                
                productCard.appendChild(img);
                productCard.appendChild(h2);
                productCard.appendChild(pDesc);
                productCard.appendChild(pPrice);
                productCard.appendChild(button);
                
                productList.appendChild(productCard);
            });
        });
}

function addToCart(product) {
    cart.push(product);
    updateCartCount();
    updateCartView();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartView();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function updateCartView() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((product, index) => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - $${product.price.toFixed(2)}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = '移除';
        removeButton.addEventListener('click', () => removeFromCart(index));
        
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });

    const cartView = document.getElementById('cart-view');
    cartView.classList.toggle('hidden', cart.length === 0);
}

document.getElementById('cart-button').addEventListener('click', () => {
    const cartView = document.getElementById('cart-view');
    cartView.classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    document.getElementById('sort-select').addEventListener('change', (event) => {
        loadProducts(event.target.value);
    });
});
