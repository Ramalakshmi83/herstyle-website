function openWishlist() {
    window.location.href = "wishlist.html";
}
function filterCategory(category) {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.style.display =
            category === "All" || card.dataset.category === category
                ? "block"
                : "none";
    });
}

function checkStock() {
    alert("❌ This product is currently OUT OF STOCK");
}

// SHOW ORDER POPUP
function placeOrder() {
    document.getElementById("orderPopup").style.display = "flex";
}

// CLOSE POPUP
function closePopup() {
    document.getElementById("orderPopup").style.display = "none";
}

function addToCart(name, price, image, button){

    const qtySpan = button.parentElement.querySelector('.qty-number');
    const qty = parseInt(qtySpan.innerText);

    if(qty <= 0){
        alert("Please select quantity");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.qty += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            qty: qty
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // reset quantity
    qtySpan.innerText = "0";

}

// AUTO FILL CHECKOUT DETAILS
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const nameInput = document.getElementById("productName");
    const priceInput = document.getElementById("productPrice");
    const imageTag = document.getElementById("productImage");

    if (nameInput) {
        nameInput.value = params.get("name") || "";
        priceInput.value = "₹" + (params.get("price") || "");
        imageTag.src = params.get("image") || "";
    }
});

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Update icons on page load
window.onload = function() {
    document.querySelectorAll(".wishlist-icon").forEach(icon => {
        const id = parseInt(icon.getAttribute("onclick").match(/, (\d+),/)[1]);
        if(wishlist.find(item => item.id === id)) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }
    });
};
function toggleWishlist(icon, id, name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if item already exists
    const index = wishlist.findIndex(item => item.id === id);

    if(index !== -1) {
        // Item exists → remove it
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        // Remove the image box from the DOM
        const imageBox = icon.closest(".product-card"); // make sure your product div has class "product"
        if(imageBox) imageBox.remove();

        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
    } else {
        // Item does not exist → add it
        wishlist.push({id, name, price, image});
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
    }
}
function displayWishlist() {
    const wishlistContainer = document.getElementById("wishlistContainer");
    wishlistContainer.innerHTML = ""; // clear current display

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist.forEach(product => {
        // Skip product if image is missing, empty, or not a valid URL
        if (!product.image || typeof product.image !== "string" || product.image.trim() === "") {
            return; // skip this product
        }

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = product.image;

        // Hide broken images automatically
        img.onerror = function() {
            card.style.display = "none"; // hide card if image fails to load
        }

        card.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = product.name;
        card.appendChild(title);

        const price = document.createElement("p");
        price.textContent = "₹" + product.price;
        card.appendChild(price);

        wishlistContainer.appendChild(card);
    });
}
function removeItem(id) {
  const item = document.querySelector(`.wishlist-item[data-id="${id}"]`);
  if(item) {
    item.remove();
  } else {
    console.log("Item not found:", id);
  }
}

const categories = [
    {name: "Bangles", link: "bangles.html"},
    {name: "Dresses", link: "dresses.html"},
    {name: "Accessories", link: "accessories.html"}
];

function showSuggestions() {

    const input = document.getElementById("searchInput").value.toLowerCase().trim();
    const suggestionBox = document.getElementById("suggestionBox");

    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";

    if(input === ""){
        return;
    }

    const filtered = categories.filter(item =>
        item.name.toLowerCase().includes(input)
    );

    filtered.forEach(item => {

        const div = document.createElement("div");
        div.textContent = item.name;

        div.onclick = function(){
            window.location.href = item.link;
        };

        suggestionBox.appendChild(div);

    });

    if(filtered.length > 0){
        suggestionBox.style.display = "block";
    }
}

function searchProducts(){

    const input = document.getElementById("searchInput").value.toLowerCase().trim();

    const filtered = categories.filter(item =>
        item.name.toLowerCase().includes(input)
    );

    if(filtered.length === 0){
        window.location.href = "no_results.html";
    }else{
        window.location.href = filtered[0].link;
    }
}

document.getElementById("searchInput").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        searchProducts();
    }
});

function goToCheckout(name, price, image) {
    window.location.href =
        "checkout.html?name=" + encodeURIComponent(name) +
        "&price=" + encodeURIComponent(price) +
        "&image=" + encodeURIComponent(image);
}

function changeQty(element, change) {
    const qtySpan = element.parentElement.querySelector('.qty-number');
    let currentQty = parseInt(qtySpan.innerText);
    currentQty += change;
    if (currentQty < 0) currentQty = 0;
    qtySpan.innerText = currentQty;
}

function goBack(){
    window.history.back();
}
if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("sw.js")
.then(() => console.log("Service Worker Registered"));
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
e.preventDefault();
deferredPrompt = e;

if(confirm("Install HerStyle App?")){
deferredPrompt.prompt();
}
});


