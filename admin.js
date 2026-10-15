"use strict";

const $ = (selector) => document.querySelector(selector);

const PRODUCTS_KEY = "yahyaMartAdminProducts";
const ORDERS_KEY = "yahyaMartDemoOrders";

let products = loadProducts();
let editingId = null;
let currentImage = "";
let saving = false;

function loadProducts() {
    try {
        const saved = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function saveProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function loadOrders() {
    try {
        const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function money(amount) {
    return new Intl.NumberFormat("en-TZ", {
        style: "currency",
        currency: "TZS",
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showMessage(message, type = "") {
    const box = $("#formMessage");
    box.textContent = message;
    box.className = "form-message";

    if (type) {
        box.classList.add(type);
    }
}

function showImagePreview(imageData) {
    const preview = $("#imagePreview");
    const placeholder = $("#previewPlaceholder");

    if (imageData) {
        preview.src = imageData;
        preview.hidden = false;
        placeholder.hidden = true;
    } else {
        preview.removeAttribute("src");
        preview.hidden = true;
        placeholder.hidden = false;
    }
}

/*
  Converts the selected picture into a smaller JPEG image.
  This helps reduce browser storage usage.
*/
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error("Could not read the selected picture."));
        };

        reader.onload = () => {
            const image = new Image();

            image.onerror = () => {
                reject(new Error("This image could not be opened."));
            };

            image.onload = () => {
                const maxDimension = 1000;
                const scale = Math.min(
                    1,
                    maxDimension / Math.max(image.width, image.height)
                );

                const width = Math.max(1, Math.round(image.width * scale));
                const height = Math.max(1, Math.round(image.height * scale));

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Your browser could not process this image."));
                    return;
                }

                // White background prevents transparent images turning black.
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject(new Error("Image compression failed."));
                            return;
                        }

                        const compressedReader = new FileReader();

                        compressedReader.onerror = () => {
                            reject(new Error("Could not prepare the image."));
                        };

                        compressedReader.onload = () => {
                            resolve(compressedReader.result);
                        };

                        compressedReader.readAsDataURL(blob);
                    },
                    "image/jpeg",
                    0.78
                );
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    });
}

/* Preview the picture as soon as the user selects it. */
$("#productImage").addEventListener("change", async event => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    if (!allowedTypes.includes(file.type)) {
        showMessage("Please choose a JPG, PNG, WEBP or GIF image.", "error");
        event.target.value = "";
        return;
    }

    if (file.size > 8 * 1024 * 1024) {
        showMessage("This image is over 8 MB. Choose a smaller image.", "error");
        event.target.value = "";
        return;
    }

    showMessage("Preparing your picture...");

    try {
        currentImage = await compressImage(file);
        showImagePreview(currentImage);
        showMessage("Picture selected successfully!", "success");
    } catch (error) {
        event.target.value = "";
        currentImage = "";
        showImagePreview("");
        showMessage(error.message || "Could not load the picture.", "error");
    }
});

function renderProducts() {
    const table = $("#productTable");

    $("#totalProducts").textContent = products.length;

    if (products.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No admin-created products yet. Add your first product above.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    ${
                        product.image
                            ? `<img src="${escapeHTML(product.image)}"
                                    alt="${escapeHTML(product.name)}">`
                            : ""
                    }
                    <span>${escapeHTML(product.name)}</span>
                </div>
            </td>
            <td>${escapeHTML(product.category)}</td>
            <td>${money(product.price)}</td>
            <td>
                <div class="action-group">
                    <button
                        class="edit-button"
                        data-edit="${escapeHTML(product.id)}"
                        type="button"
                    >Edit</button>

                    <button
                        class="delete-button"
                        data-delete="${escapeHTML(product.id)}"
                        type="button"
                    >Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function renderOrders() {
    const orders = loadOrders();

    $("#totalOrders").textContent = orders.length;

    const pending = orders.filter(order =>
        String(order.status || "Pending").toLowerCase() === "pending"
    ).length;

    $("#pendingOrders").textContent = pending;

    const table = $("#orderTable");

    if (orders.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No demo orders found in this browser yet.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = orders.map((order, index) => {
        const customer =
            order.customerName ||
            order.name ||
            order.customer?.name ||
            "Demo customer";

        const total =
            order.total ??
            order.subtotal ??
            order.totalAmount ??
            0;

        const status = order.status || "Pending";

        return `
            <tr>
                <td>${escapeHTML(order.id || `Order ${index + 1}`)}</td>
                <td>${escapeHTML(customer)}</td>
                <td>${money(total)}</td>
                <td>${escapeHTML(status)}</td>
            </tr>
        `;
    }).join("");
}

function resetForm() {
    $("#productForm").reset();
    $("#productId").value = "";
    $("#formHeading").textContent = "Add New Product";
    $("#saveProduct").textContent = "Add Product";
    $("#cancelEdit").hidden = true;

    editingId = null;
    currentImage = "";

    showImagePreview("");
    showMessage("");
}

$("#productForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (saving) {
        return;
    }

    const name = $("#productName").value.trim();
    const category = $("#productCategory").value;
    const price = Number($("#productPrice").value);

    if (!name || !category || !Number.isFinite(price) || price <= 0) {
        showMessage("Enter a product name, category and valid price.", "error");
        return;
    }

    const duplicate = products.some(product =>
        product.name.toLowerCase() === name.toLowerCase() &&
        String(product.id) !== String(editingId)
    );

    if (duplicate) {
        showMessage("A product with this name already exists.", "error");
        return;
    }

    saving = true;

    const saveButton = $("#saveProduct");
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const existingProduct = products.find(
            product => String(product.id) === String(editingId)
        );

        const product = {
            id: editingId !== null ? editingId : `admin-${Date.now()}`,
            name,
            category,
            price,
            image: currentImage || existingProduct?.image || ""
        };

        let updatedProducts;

        if (editingId !== null) {
            updatedProducts = products.map(item =>
                String(item.id) === String(editingId) ? product : item
            );
        } else {
            updatedProducts = [...products, product];
        }

        // Save first. Keep the existing list if browser storage fails.
        const previousProducts = products;
        products = updatedProducts;

        try {
            saveProducts();
        } catch (error) {
            products = previousProducts;
            throw new Error(
                "Browser storage is full or unavailable. Try a smaller image."
            );
        }

        renderProducts();
        resetForm();
        showMessage(
            editingId === null
                ? "Product added successfully!"
                : "Product updated successfully!",
            "success"
        );
    } catch (error) {
        showMessage(
            error.message || "Could not save this product.",
            "error"
        );
    } finally {
        saving = false;
        saveButton.disabled = false;

        if (editingId === null) {
            saveButton.textContent = "Add Product";
        } else {
            saveButton.textContent = "Save Changes";
        }
    }
});

$("#productTable").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");

    if (editButton) {
        const product = products.find(
            item => String(item.id) === editButton.dataset.edit
        );

        if (!product) {
            return;
        }

        editingId = product.id;
        currentImage = product.image || "";

        $("#productId").value = product.id;
        $("#productName").value = product.name;
        $("#productCategory").value = product.category;
        $("#productPrice").value = product.price;
        $("#productImage").value = "";

        $("#formHeading").textContent = "Edit Product";
        $("#saveProduct").textContent = "Save Changes";
        $("#cancelEdit").hidden = false;

        showImagePreview(currentImage);
        showMessage("Choose a new picture only if you want to replace the old one.");

        $("#productEditor").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    if (deleteButton) {
        const id = deleteButton.dataset.delete;
        const product = products.find(item => String(item.id) === id);

        if (!product) {
            return;
        }

        if (!confirm(`Delete "${product.name}" from the admin list?`)) {
            return;
        }

        const previousProducts = products;
        products = products.filter(item => String(item.id) !== id);

        try {
            saveProducts();
            renderProducts();

            if (String(editingId) === id) {
                resetForm();
            }

            showMessage("Product deleted successfully.", "success");
        } catch {
            products = previousProducts;
            renderProducts();
            showMessage("Could not save this change.", "error");
        }
    }
});

$("#cancelEdit").addEventListener("click", resetForm);

renderProducts();
renderOrders();const logoutButton = document.querySelector("#logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("yahyaMartDemoAdminLoggedIn");
        window.location.replace("admin-login.html");
    });
}