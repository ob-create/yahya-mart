"use strict";

const STOCK_PRODUCTS_KEY = "yahyaMartAdminProducts";
const STOCK_QUANTITIES_KEY = "yahyaMartStockQuantities";
const LOW_STOCK_LIMIT = 5;

const stockBody = document.querySelector("#stockTableBody");
const stockTotal = document.querySelector("#stockTotal");
const stockLow = document.querySelector("#stockLow");
const stockOut = document.querySelector("#stockOut");
const stockMessage = document.querySelector("#stockMessage");

function readStockProducts() {
    try {
        const products = JSON.parse(
            localStorage.getItem(STOCK_PRODUCTS_KEY) || "[]"
        );

        return Array.isArray(products) ? products : [];
    } catch {
        return [];
    }
}

function readStockQuantities() {
    try {
        const quantities = JSON.parse(
            localStorage.getItem(STOCK_QUANTITIES_KEY) || "{}"
        );

        return quantities &&
            typeof quantities === "object" &&
            !Array.isArray(quantities)
                ? quantities
                : {};
    } catch {
        return {};
    }
}

function productStockKey(product) {
    return String(product.id ?? product.name);
}

function getQuantity(product, quantities) {
    const saved = quantities[productStockKey(product)];

    if (saved !== undefined) {
        return Math.max(0, Number(saved) || 0);
    }

    const initial = Number(product.stock);

    return Number.isFinite(initial) && initial >= 0
        ? Math.floor(initial)
        : 0;
}

function getStockStatus(quantity) {
    if (quantity === 0) {
        return {
            label: "OUT OF STOCK",
            className: "stock-empty"
        };
    }

    if (quantity <= LOW_STOCK_LIMIT) {
        return {
            label: "LOW STOCK",
            className: "stock-low"
        };
    }

    return {
        label: "IN STOCK",
        className: "stock-good"
    };
}

function renderStock() {
    const products = readStockProducts();
    const quantities = readStockQuantities();

    let lowCount = 0;
    let outCount = 0;

    stockBody.innerHTML = "";

    if (products.length === 0) {
        stockBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No admin-added products found.
                </td>
            </tr>
        `;
    }

    products.forEach(product => {
        const quantity = getQuantity(product, quantities);
        const status = getStockStatus(quantity);

        if (quantity === 0) outCount++;
        else if (quantity <= LOW_STOCK_LIMIT) lowCount++;

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name || "Unnamed product";

        const priceCell = document.createElement("td");
        priceCell.textContent =
            (Number(product.price) || 0).toLocaleString("en-TZ");

        const quantityCell = document.createElement("td");
        const input = document.createElement("input");

        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.value = quantity;
        input.setAttribute(
            "aria-label",
            `Quantity for ${product.name || "product"}`
        );

        quantityCell.appendChild(input);

        const statusCell = document.createElement("td");
        const statusLabel = document.createElement("span");

        statusLabel.textContent = status.label;
        statusLabel.className =
            `stock-status ${status.className}`;

        statusCell.appendChild(statusLabel);

        const actionCell = document.createElement("td");
        const saveButton = document.createElement("button");

        saveButton.type = "button";
        saveButton.className = "stock-save";
        saveButton.textContent = "Save";

        saveButton.addEventListener("click", () => {
            const rawValue = input.value.trim();
            const newQuantity = Number(rawValue);

            if (
                rawValue === "" ||
                !Number.isSafeInteger(newQuantity) ||
                newQuantity < 0
            ) {
                stockMessage.textContent =
                    "Enter a valid whole quantity of 0 or more.";
                input.focus();
                return;
            }

            const currentQuantities = readStockQuantities();

            currentQuantities[productStockKey(product)] =
                newQuantity;

            localStorage.setItem(
                STOCK_QUANTITIES_KEY,
                JSON.stringify(currentQuantities)
            );

            stockMessage.textContent =
                `${product.name}: stock updated successfully.`;

            renderStock();
        });

        actionCell.appendChild(saveButton);

        row.append(
            nameCell,
            priceCell,
            quantityCell,
            statusCell,
            actionCell
        );

        stockBody.appendChild(row);
    });

    stockTotal.textContent = products.length;
    stockLow.textContent = lowCount;
    stockOut.textContent = outCount;
}

renderStock();