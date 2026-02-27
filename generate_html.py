import csv

products = []

# Read CSV
with open("products.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        products.append(row)

categories = sorted(set(p["category"] for p in products))

# Start HTML
html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HerStyle</title>

    <!-- APP ICON (FAVICON) -->
    <link rel="icon" href="images/app-icon.png" type="image/png">

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

<!-- HEADER -->
<header class="header">

    <!-- LEFT : APP ICON + LOGO -->
    <div class="logo-area">
        <img src="images/app-icon.png" alt="App Icon" class="app-icon">
        <h1 class="logo-text">HerStyle</h1>
    </div>

    <!-- CENTER : SEARCH -->
    <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search products..." onkeyup="searchProducts()">
        <img src="images/search-icon.png" alt="Search" class="icon">
    </div>

    <!-- RIGHT : WISHLIST -->
    <div class="wishlist-icon">
        <img src="images/wishlist-icon.png" alt="Wishlist">
    </div>

</header>

<h2 class="subtitle">Women Fashion</h2>

<div class="categories">
"""

# Category buttons
for cat in categories:
    html += f'<button onclick="filterCategory(\'{cat}\')">{cat}</button>\n'

html += '<button onclick="filterCategory(\'All\')">All</button>'
html += '</div>\n<div class="products">\n'

# Products
for p in products:
    html += f"""
    <div class="card" data-category="{p['category']}">
        <img src="images/{p['image']}" alt="{p['name']}">
        <h3>{p['name']}</h3>
        <p>Category: {p['category']}</p>
        <p>Price: {p['price']} INR</p>
        <button class="wishlist-btn" onclick="toggleWishlist(this)">
            <img src="images/wishlist-icon.png" alt="Wishlist">
        </button>
    </div>
    """

html += """
</div>
</body>
</html>
"""

# Write HTML file
with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ index.html generated successfully")
