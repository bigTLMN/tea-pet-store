document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.getElementById('cart-button');
    const cartView = document.getElementById('cart-view');
    const closeCartButton = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartButton = document.createElement('button');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    clearCartButton.textContent = '全部清除';
    clearCartButton.classList.add('clear-cart-button');
    clearCartButton.onclick = () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartView();
        cartCount.textContent = cart.length;
    };

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
        cartItemsContainer.appendChild(clearCartButton); // 添加“全部清除”按钮
        cartItemsContainer.appendChild(checkoutButton); // 确保“结账”按钮不重叠
    }

    cartButton.onclick = () => {
        cartView.classList.toggle('hidden');
    };

    closeCartButton.onclick = () => {
        cartView.classList.add('hidden');
    };

    window.addToCart = function(productId) {
        let productCard;
        const url = window.location.href;

        if (url.includes("index.html") || url.includes("Bracelet.html") || url.includes("TeaPet.html")) {
            productCard = document.querySelector(`.product-card button[onclick="addToCart(${productId})"]`).parentElement;
        } else {
            productCard = document.querySelector('.product-detail');
        }

        if (!productCard) {
            alert('找不到產品卡片');
            return;
        }

        const productNameElement = productCard.querySelector('h2');
        const productPriceElement = productCard.querySelector('.product-price');

        if (!productNameElement || !productPriceElement) {
            alert('找不到產品信息');
            return;
        }

        const productName = productNameElement.textContent;
        const productPrice = productPriceElement.textContent.replace('價格：$', '');

        cart.push({ name: productName, price: parseFloat(productPrice) });
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCount.textContent = cart.length;
        updateCartView();
        showCartSuccessMessage(productName);
    };

    function showCartSuccessMessage(productName) {
        const successMessage = document.createElement('div');
        successMessage.className = 'cart-success-message';
        successMessage.textContent = `${productName} 已成功加入購物車!`;

        // 设置样式
        successMessage.style.position = 'fixed';
        successMessage.style.bottom = '20px';
        successMessage.style.right = '20px';
        successMessage.style.backgroundColor = 'green';
        successMessage.style.color = 'white';
        successMessage.style.padding = '10px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.zIndex = '1000';

        // 将成功信息添加到页面上
        document.body.appendChild(successMessage);

        // 3秒后移除成功信息
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }

    updateCartView();
    cartCount.textContent = cart.length;
});