const fs = require('fs');
const ini = require('ini');

function createHTMLFiles(config) {
    // Create index.html
    const indexHTML = createIndexHTML(config);
    fs.writeFileSync('index.html', indexHTML);
    console.log('index.html saved');

    // Create category and product HTML files
    Object.keys(config).forEach(category => {
        if (category !== 'about' && category !== 'contact') {
            const categoryHTML = createCategoryHTML(category, config[category]);
            const categoryFileName = `${category.replace(/\s/g, '')}.html`;
            fs.writeFileSync(categoryFileName, categoryHTML);
            console.log(`${categoryFileName} saved`);

            // Create individual product HTML files
            Object.keys(config[category]).forEach(productKey => {
                if (productKey.startsWith('product') && /product(\d+)_name/.test(productKey)) {
                    const productId = productKey.match(/product(\d+)_name/)[1];
                    const product = {
                        name: config[category][`product${productId}_name`],
                        description: config[category][`product${productId}_description`],
                        price: config[category][`product${productId}_price`],
                        image: config[category][`product${productId}_image`],
                        size: config[category][`product${productId}_size`]
                    };
                    const productHTML = createProductHTML(category, productId, product);
                    const productFileName = `${category.replace(/\s/g, '')}${productId}.html`;
                    fs.writeFileSync(productFileName, productHTML);
                    console.log(`${productFileName} saved`);
                }
            });
        }
    });

    // Create about.html
    const aboutHTML = createAboutHTML(config.about);
    fs.writeFileSync('about.html', aboutHTML);
    console.log('about.html saved');

    // Create contact.html
    const contactHTML = createContactHTML(config.contact);
    fs.writeFileSync('contact.html', contactHTML);
    console.log('contact.html saved');
}

function removeOldHTMLFiles(callback) {
    fs.readdir('.', (err, files) => {
        if (err) throw err;

        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        let count = htmlFiles.length;

        if (count === 0) {
            callback();
            return;
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

// Generate index.html
// function createIndexHTML(config) {
//     let categoriesHTML = '';
//     let productsHTML = '';

//     // 遍歷所有類別
//     Object.keys(config).forEach(category => {
//         if (category !== 'about' && category !== 'contact') {
//             categoriesHTML += `<li><a href="${category.replace(/\s/g, '')}.html">${category}</a></li>`;

//             // 遍歷類別中的每個產品
//             Object.keys(config[category]).forEach(productKey => {
//                 if (productKey.startsWith('product') && /product(\d+)_name/.test(productKey)) {
//                     const productId = productKey.match(/product(\d+)_name/)[1];
//                     const product = {
//                         name: config[category][`product${productId}_name`],
//                         description: config[category][`product${productId}_description`],
//                         price: config[category][`product${productId}_price`],
//                         image: config[category][`product${productId}_image`]
//                     };
//                     productsHTML += `
//                     <div class="product-card">
//                         <a href="${category.replace(/\s/g, '')}${productId}.html">
//                             <img src="${product.image}" alt="${product.name}" class="product-image">
//                             <h2>${product.name}</h2>
//                             <p>${product.description}</p>
//                             <p class="product-price">價格：$${product.price}</p>
//                         </a>
//                         <button onclick="addToCart(${productId})">加入購物車</button>
//                     </div>`;
//                 }
//             });
//         }
//     });

//     return `<!DOCTYPE html>
// <html lang="zh-Hant">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>茶寵網店</title>
//     <link rel="stylesheet" href="styles.css">
//     <script src="scripts.js"></script>
// </head>
// <body>
//     <header>
//         <h1>茶寵網店</h1>
//         <nav>
//             <ul>
//                 <li><a href="#home">首頁</a></li>
//                 <li><a href="#products">產品</a></li>
//                 <li><a href="about.html">關於我們</a></li>
//                 <li><a href="contact.html">聯絡我們</a></li>
//             </ul>
//         </nav>
//         <div class="controls">
//             <select id="sort-select">
//                 <option value="price-asc">價格：低到高</option>
//                 <option value="price-desc">價格：高到低</option>
//             </select>
//         </div>
//         <div class="cart">
//             <button id="cart-button">購物車 (<span id="cart-count">0</span>)</button>
//         </div>
//     </header>
//     <main id="home">
//         <section id="intro" class="intro-section">
//             <div class="intro-content">
//                 <aside class="sidebar">
//                     <ul>
//                         ${categoriesHTML}
//                     </ul>
//                 </aside>
//                 <div class="intro-text">
//                     <h2>歡迎來到茶寵網店</h2>
//                     <p>我們提供各種精美的茶寵，讓您的茶道體驗更加完美。每一件茶寵都經過精心製作，品質保證。</p>
//                     <p>Welcome to the Tea Pet Online Store! We offer a variety of exquisite tea pets to make your tea ceremony experience more complete. Each tea pet is meticulously crafted and guaranteed for quality.</p>
//                 </div>
//             </div>
//         </section>
//         <section id="products" class="product-list">
//             ${productsHTML}
//         </section>
//     </main>
//     <footer>
//         <p>&copy; 2024 茶寵網店</p>
//     </footer>
//     <div id="cart-view" class="cart-view hidden">
//         <button id="close-cart" class="close-cart-button">✖</button>
//         <h2>購物車</h2>
//         <ul id="cart-items"></ul>
//         <button id="checkout-button">結帳</button>
//     </div>
//     <script src="scripts.js"></script>
// </body>
// </html>`;
// }
function createIndexHTML(config) {
    let categoriesHTML = '';
    let productsHTML = '';

    // 遍历所有类别
    Object.keys(config).forEach(category => {
        if (category !== 'about' && category !== 'contact') {
            categoriesHTML += `<li><a href="${category.replace(/\s/g, '')}.html">${category}</a></li>`;

            // 遍历类别中的每个产品
            Object.keys(config[category]).forEach(productKey => {
                if (productKey.startsWith('product') && /product(\d+)_name/.test(productKey)) {
                    const productId = productKey.match(/product(\d+)_name/)[1];
                    const product = {
                        name: config[category][`product${productId}_name`],
                        description: config[category][`product${productId}_description`],
                        price: config[category][`product${productId}_price`],
                        image: config[category][`product${productId}_image`]
                    };
                    productsHTML += `
                    <div class="product-card">
                        <a href="${category.replace(/\s/g, '')}${productId}.html">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <h2>${product.name}</h2>
                            <p>${product.description}</p>
                            <p class="product-price">價格：$${product.price}</p>
                        </a>
                        <button onclick="addToCart(${productId})">加入購物車</button>
                    </div>`;
                }
            });
        }
    });

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>茶寵網店</title>
    <link rel="stylesheet" href="styles.css">
    <script src="scripts.js"></script>
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
            <div class="intro-content">
                <aside class="sidebar">
                    <ul>
                        ${categoriesHTML}
                    </ul>
                </aside>
                <div class="intro-text">
                    <h2>歡迎來到茶寵網店</h2>
                    <p>我們提供各種精美的茶寵，讓您的茶道體驗更加完美。每一件茶寵都經過精心製作，品質保證。</p>
                    <p>Welcome to the Tea Pet Online Store! We offer a variety of exquisite tea pets to make your tea ceremony experience more complete. Each tea pet is meticulously crafted and guaranteed for quality.</p>
                </div>
            </div>
        </section>
        <section id="products" class="product-highlight">
            <h2 class="highlight-title">本店熱銷 Top 4</h2>
            <div class="product-list">
                ${productsHTML}
            </div>
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
        <button class="clear-cart-button">全部清除</button>
    </div>
    <script src="scripts.js"></script>
</body>
</html>`;
}

// Generate category HTML
function createCategoryHTML(category, products) {
    let productsHTML = '';

    Object.keys(products).forEach(productKey => {
        if (productKey.startsWith('product') && /product(\d+)_name/.test(productKey)) {
            const productId = productKey.match(/product(\d+)_name/)[1];
            const product = {
                name: products[`product${productId}_name`],
                description: products[`product${productId}_description`],
                price: products[`product${productId}_price`],
                image: products[`product${productId}_image`]
            };
            productsHTML += `
                <div class="product-card">
                    <a href="${category.replace(/\s/g, '')}${productId}.html">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="product-price">價格：$${product.price}</p>
                    </a>
                    <button onclick="addToCart(${productId})">加入購物車</button>
                </div>`;
        }
    });

    return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} - 茶寵網店</title>
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
    <main id="products">
        <section class="product-list">
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


// Generate individual product HTML
function createProductHTML(category, productId, product) {
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
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        <div class="product-info">
            <p>${product.description}</p>
            <p class="product-size">尺寸：${product.size}</p>
            <p class="product-price">價格：$${product.price}</p>
            <p class="product-discount">優惠：購買兩件享九折優惠</p>
            <button class="add-to-cart-btn" onclick="addToCart(${productId})">加入購物車</button>
        </div>
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

// Generate about.html
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
    <main id="home" class="home-about">
        <section class="section-background content-box">
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

// Generate contact.html
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
    <main id="home" class="home-contact">
        <section class="section-background content-box">
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

// Read and parse the ini file
const config = ini.parse(fs.readFileSync('./products.ini', 'utf-8'));

// Remove old HTML files and then generate the new ones
removeOldHTMLFiles(() => {
    createHTMLFiles(config);
});
