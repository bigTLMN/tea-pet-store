const fs = require('fs');
const path = require('path');

function parseINI(data) {
    const regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    const result = {};
    const lines = data.split(/[\r\n]+/);
    let section = null;
    lines.forEach(line => {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            const match = line.match(regex.param);
            if (section) {
                result[section][match[1]] = match[2].replace(/\\n/g, '<br>');
            } else {
                result[match[1]] = match[2].replace(/\\n/g, '<br>');
            }
        } else if (regex.section.test(line)) {
            const match = line.match(regex.section);
            result[match[1]] = {};
            section = match[1];
        } else if (line.length === 0 && section) {
            section = null;
        }
    });
    return result;
}

function createProductHTML(productId, product) {
    if (!product.name || !product.description || !product.price || !product.image) {
        console.warn(`Missing product information for product${productId}, skipping generation.`);
        return null;
    }

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - 茶寵網店</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>茶寵網店</h1>
        <nav>
            <ul>
                <li><a href="index.html#home">首頁</a></li>
                <li><a href="index.html#products">產品</a></li>
                <li><a href="about.html">關於我們</a></li>
                <li><a href="contact.html">聯絡我們</a></li>
            </ul>
        </nav>
        <div class="controls">
            <select id="sort-select">
                <option value="price-asc">價格：低到高</option>
                <option value="price-desc">價格：高到低</option>
            </select>
        </div>
        <div class="cart">
            <button id="cart-button">購物車 (<span id="cart-count">0</span>)</button>
        </div>
    </header>
    <main class="product-detail">
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <p>${product.description}</p>
        <p class="product-size">尺寸：${product.size || ''}</p>
        <p class="product-price">價格：$${product.price}</p>
        <p class="product-discount">優惠：購買兩件享九折優惠</p>
        <button onclick="addToCart(${productId})">加入購物車</button>
    </main>
    <footer>
        <p>&copy; 2024 茶寵網店</p>
    </footer>
    <div id="cart-view" class="cart-view hidden">
        <button id="close-cart" class="close-cart-button">✖</button>
        <h2>購物車</h2>
        <ul id="cart-items"></ul>
        <button id="checkout-button">結帳</button>
    </div>
    <script src="scripts.js"></script>
</body>
</html>`;
}

function createAboutHTML(about) {
    const content = about.content.replace(/\\n/g, '<br>');
    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${about.title} - 茶寵網店</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>茶寵網店</h1>
        <nav>
            <ul>
                <li><a href="index.html#home">首頁</a></li>
                <li><a href="index.html#products">產品</a></li>
                <li><a href="about.html">關於我們</a></li>
                <li><a href="contact.html">聯絡我們</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="section-background">
            <h2>${about.title}</h2>
            <p>${content}</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 茶寵網店</p>
    </footer>
</body>
</html>`;
}

function createContactHTML(contact) {
    const content = contact.content.replace(/\\n/g, '<br>');
    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contact.title} - 茶寵網店</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>茶寵網店</h1>
        <nav>
            <ul>
                <li><a href="index.html#home">首頁</a></li>
                <li><a href="index.html#products">產品</a></li>
                <li><a href="about.html">關於我們</a></li>
                <li><a href="contact.html">聯絡我們</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="section-background">
            <h2>${contact.title}</h2>
            <p>${content}</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 茶寵網店</p>
    </footer>
</body>
</html>`;
}

function createIndexHTML(products) {
    let productsHTML = '';
    Object.keys(products).forEach(key => {
        if (key.startsWith('product')) {
            const product = products[key];
            productsHTML += `
            <div class="product-card">
                <a href="product${key.replace('product', '')}.html">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                </a>
                <button onclick="addToCart(${key.replace('product', '')})">加入購物車</button>
            </div>`;
        }
    });

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>茶寵網店</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>茶寵網店</h1>
        <nav>
            <ul>
                <li><a href="#home">首頁</a></li>
                <li><a href="#products">產品</a></li>
                <li><a href="about.html">關於我們</a></li>
                <li><a href="contact.html">聯絡我們</a></li>
            </ul>
        </nav>
        <div class="controls">
            <select id="sort-select">
                <option value="price-asc">價格：低到高</option>
                <option value="price-desc">價格：高到低</option>
            </select>
        </div>
        <div class="cart">
            <button id="cart-button">購物車 (<span id="cart-count">0</span>)</button>
        </div>
    </header>
    <main id="home">
        <section id="intro" class="intro-section">
            <h2>歡迎來到茶寵網店</h2>
            <p>我們提供各種精美的茶寵，讓您的茶道體驗更加完美。每一件茶寵都經過精心製作，品質保證。</p>
            <p>Welcome to the Tea Pet Online Store! We offer a variety of exquisite tea pets to make your tea ceremony experience more complete. Each tea pet is meticulously crafted and guaranteed for quality.</p>
        </section>
        <section id="products" class="product-list">
            ${productsHTML}
        </section>
    </main>
    <footer>
        <p>&copy; 2024 茶寵網店</p>
    </footer>
    <div id="cart-view" class="cart-view hidden">
        <button id="close-cart" class="close-cart-button">✖</button>
        <h2>購物車</h2>
        <ul id="cart-items"></ul>
        <button id="checkout-button">結帳</button>
    </div>
    <script src="scripts.js"></script>
</body>
</html>`;
}

function removeOldHTMLFiles(callback) {
    fs.readdir('.', (err, files) => {
        if (err) throw err;

        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        let count = htmlFiles.length;

        if (count === 0) {
            callback();
        }

        htmlFiles.forEach(file => {
            fs.unlink(file, err => {
                if (err) throw err;
                console.log(`${file} deleted`);
                count--;
                if (count === 0) {
                    callback();
                }
            });
        });
    });
}

fs.readFile('products.ini', 'utf-8', (err, data) => {
    if (err) throw err;

    const products = parseINI(data);

    removeOldHTMLFiles(() => {
        Object.keys(products).forEach(key => {
            if (key.startsWith('product')) {
                const productId = key.replace('product', '');
                const productHTML = createProductHTML(productId, products[key]);
                if (productHTML) {
                    fs.writeFile(`product${productId}.html`, productHTML, err => {
                        if (err) throw err;
                        console.log(`product${productId}.html saved`);
                    });
                }
            } else if (key === 'about') {
                const aboutHTML = createAboutHTML(products[key]);
                fs.writeFile(`about.html`, aboutHTML, err => {
                    if (err) throw err;
                    console.log(`about.html saved`);
                });
            } else if (key === 'contact') {
                const contactHTML = createContactHTML(products[key]);
                fs.writeFile(`contact.html`, contactHTML, err => {
                    if (err) throw err;
                    console.log(`contact.html saved`);
                });
            }
        });

        const indexHTML = createIndexHTML(products);
        fs.writeFile('index.html', indexHTML, err => {
            if (err) throw err;
            console.log('index.html saved');
        });
    });
});