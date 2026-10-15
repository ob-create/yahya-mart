"use strict";

const YAHYA_STOCK_KEY = "yahyaMartStockQuantities";
const YAHYA_ADMIN_PRODUCTS_KEY = "yahyaMartAdminProducts";

function yahyaReadJSON(key, fallback) {
    try {
        const value = JSON.parse(
            localStorage.getItem(key) || JSON.stringify(fallback)
        );

        return value ?? fallback;
    } catch (error) {
        console.error("Could not read:", key, error);
        return fallback;
    }
}

function yahyaGetStock(productId, defaultQuantity = 0) {
    const stock = yahyaReadJSON(YAHYA_STOCK_KEY, {});
    const key = String(productId);

    if (Object.prototype.hasOwnProperty.call(stock, key)) {
        return Math.max(0, Number(stock[key]) || 0);
    }

    return Math.max(0, Number(defaultQuantity) || 0);
}

function yahyaSaveStock(productId, quantity) {
    const stock = yahyaReadJSON(YAHYA_STOCK_KEY, {});
    const value = Number(quantity);

    if (!Number.isSafeInteger(value) || value < 0) {
        throw new Error("Stock quantity must be a whole number of 0 or more.");
    }

    stock[String(productId)] = value;

    localStorage.setItem(
        YAHYA_STOCK_KEY,
        JSON.stringify(stock)
    );
}

function yahyaCheckCartStock(cartItems, getProduct, getId, getQuantity) {
    for (const item of cartItems) {
        const id = getId(item);
        const product = getProduct(id);

        if (!product) {
            return {
                ok: false,
                message: "A product in your cart could not be found."
            };
        }

        const quantity = Number(getQuantity(item));
        const stock = yahyaGetStock(id, product.stock ?? 0);

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            return {
                ok: false,
                message: "Please enter a valid product quantity."
            };
        }

        if (stock === 0) {
            return {
                ok: false,
                message: `${product.name} is out of stock.`
            };
        }

        if (quantity > stock) {
            return {
                ok: false,
                message:
                    `Only ${stock} unit(s) of ${product.name} remain.`
            };
        }
    }

    return { ok: true, message: "Stock check passed." };
}

function yahyaReduceStock(items, getId, getQuantity) {
    const stock = yahyaReadJSON(YAHYA_STOCK_KEY, {});

    for (const item of items) {
        const key = String(getId(item));
        const quantity = Number(getQuantity(item));
        const available = Number(stock[key]) || 0;

        if (
            !Number.isSafeInteger(quantity) ||
            quantity < 1 ||
            quantity > available
        ) {
            throw new Error(`Insufficient stock for product ${key}.`);
        }
    }

    for (const item of items) {
        const key = String(getId(item));
        stock[key] -= Number(getQuantity(item));
    }

    localStorage.setItem(
        YAHYA_STOCK_KEY,
        JSON.stringify(stock)
    );
}