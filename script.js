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
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let current = 0;

// Show slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if(i === index) slide.classList.add('active');
    });
}

// Next slide
function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

// Previous slide
function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

// Auto slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Event listeners
next.addEventListener('click', () => {
    nextSlide();
    resetInterval();
});
prev.addEventListener('click', () => {
    prevSlide();
    resetInterval();
});

// --- Slide after every 10 products ---
const singleSlideTemplate = `
  <div class="middle-slide">
    <img src="images/slide1.png" 
         alt="Slide Image" 
         style="width:100%; display:block; margin:20px 0;">
  </div>
`;

const productsContainers = document.querySelectorAll('.products');

productsContainers.forEach(container => {
  let productCards = Array.from(container.children);
  let offset = 0;

  for (let i = 10; i < productCards.length; i += 10) {
    const slideDiv = document.createElement('div');
    slideDiv.innerHTML = singleSlideTemplate;
    container.insertBefore(slideDiv, productCards[i + offset]);
    offset++;
  }
});
// Reset auto-slide interval after manual navigation
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
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

function addToCart(name, price, image){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === name);

    if(existingItem){
        existingItem.qty += 1;
    } else {
        cart.push({
            name:name,
            price:price,
            image:image,
            qty:1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Item added to cart!");
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

function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchProducts();
    }
}

function searchProducts() {

    const input = document.getElementById("searchInput").value.toLowerCase().trim();
    const suggestionBox = document.getElementById("suggestionBox");
    const noResults = document.getElementById("noResults");

    suggestionBox.innerHTML = "";
    noResults.style.display = "none";

    if(input === ""){
        suggestionBox.style.display = "none";
        return;
    }

    const categories = [
        {name: "Bangles", link: "bangles.html"},
        {name: "Dresses", link: "dresses.html"},
        {name: "Accessories", link: "accessories.html"}
    ];

    const filtered = categories.filter(item =>
        item.name.toLowerCase().includes(input)
    );

    if(filtered.length === 0){
        suggestionBox.style.display = "none";
        noResults.style.display = "block";
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item.name;

        div.onclick = function(){
            window.location.href = item.link;
        };

        suggestionBox.appendChild(div);
    });

    suggestionBox.style.display = "block";
}
function goToCheckout(name, price, image) {
    window.location.href =
        "checkout.html?name=" + encodeURIComponent(name) +
        "&price=" + encodeURIComponent(price) +
        "&image=" + encodeURIComponent(image);
}






