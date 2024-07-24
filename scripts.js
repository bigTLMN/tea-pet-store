document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartView = document.getElementById('cart-view');
    const closeCartButton = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartView() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - $${item.price}`;
            const removeButton = document.createElement('button');
            removeButton.textContent = '移除';
            removeButton.onclick = () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartView();
                cartCount.textContent = cart.length;
            };
            listItem.appendChild(removeButton);
            cartItemsContainer.appendChild(listItem);
        });
    }

    cartButton.onclick = () => {
        cartView.classList.toggle('hidden');
    };

    closeCartButton.onclick = () => {
        cartView.classList.add('hidden');
    };

    window.addToCart = function(productId) {
        const productCard = document.querySelector(`a[href="product${productId}.html"]`);
        if (!productCard) return;

        const productName = productCard.querySelector('h2').textContent;
        const productPrice = productCard.querySelector('p:nth-child(4)').textContent.replace('$', '');

        cart.push({ name: productName, price: parseFloat(productPrice) });
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.length;
        updateCartView();
        alert('商品已加入購物車');
    };

    updateCartView();
    cartCount.textContent = cart.length;
});