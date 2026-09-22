// ======================================================
// INDIA UNBOXED - PRODUCT CATALOGUE
// Loads the 84 products from the JSON catalogue
// ======================================================

let PRODUCTS = [];

// Load product catalogue
fetch("js/india_regional_food_catalog.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load product catalogue");
        }

        return response.json();
    })
    .then(data => {

        // Support either:
        // 1. A direct array
        // 2. An object containing products/items
        if (Array.isArray(data)) {
            PRODUCTS = data;
        } 
        else if (Array.isArray(data.products)) {
            PRODUCTS = data.products;
        } 
        else if (Array.isArray(data.items)) {
            PRODUCTS = data.items;
        }

        // Add website-specific fields
        PRODUCTS = PRODUCTS.map((product, index) => {

            const sku = product.sku || product.SKU || `SKU${index + 1}`;

            return {
                ...product,

                sku: sku,

                name: product.name || product.product_name || "Indian Regional Food",

                state: product.state || product.State || "",

                region: product.region || product.Region || "",

                category: product.category || product.Category || "Other",

                price: Number(product.price || product.Price || 0),

                qty: product.qty || product.quantity || product.Quantity || "",

                ingredients:
                    product.ingredients ||
                    product.Ingredients ||
                    "",

                originStory:
                    product.originStory ||
                    product.origin_story ||
                    product.originStory ||
                    product["origin story"] ||
                    "",

                // Image will use SKU.
                // Example: AP01 → images/products/AP01.jpg
                image:
                    product.image ||
                    `images/products/${sku}.jpg`,

                // Initial rating for prototype
                rating:
                    Number(product.rating || product.Rating || 0),

                reviewCount:
                    Number(
                        product.reviewCount ||
                        product.review_count ||
                        0
                    )
            };
        });

        console.log(
            `India Unboxed: ${PRODUCTS.length} products loaded`
        );

        // Tell app.js that products are ready
        document.dispatchEvent(
            new CustomEvent("productsLoaded")
        );

    })
    .catch(error => {

        console.error(
            "Product catalogue loading error:",
            error
        );

        document.dispatchEvent(
            new CustomEvent("productsLoadError", {
                detail: error
            })
        );

    });
