async function fetchProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  if (productList) {
    productList.innerHTML = "";

    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product");

      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;

      productList.appendChild(productElement);
    });
  }
}

async function addToCart(productId) {
  try {
    const response = await fetch(`/api/cart/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart: " + response.statusText);
    }

    const result = await response.json();
    console.log("Product added to cart:", result);
    alert("Product added to cart");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Failed to add product to cart. Please try again later.");
  }
}

async function fetchCartItems() {
  try {
    const response = await fetch("/api/cart", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Forbidden");
      } else {
        throw new Error("Failed to fetch cart items");
      }
    }
    const cartItems = await response.json();
    renderCartItems(cartItems);
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    alert("Failed to fetch cart items: " + error.message);
  }
}

function renderCartItems(cartItems) {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ""; // Clear previous items

  cartItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
          <h3>${item.name}</h3>
          <p>Price: $${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
      `;
    cartItemsContainer.appendChild(itemElement);
  });
}

// Call fetchCartItems when the cart.html page loads
if (window.location.pathname.includes("cart.html")) {
  window.onload = fetchCartItems;
}

function viewCart() {
  console.log("View Cart function called");
  showModal();
}

function showModal() {
  // Select the modal element
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.style.display = "block"; // Display the modal
  }
}

function closeModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.style.display = "none"; // Hide the modal
  }
}

async function checkout() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to proceed with the checkout.");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (response.ok) {
      alert("Checkout successful");
    } else {
      const error = await response.json();
      alert("Checkout failed: " + error.message);
    }
  } catch (error) {
    alert("Checkout failed: " + error.message);
  }
}

async function getOrders() {
  try {
    const response = await fetch("/api/orders", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
}

function renderOrders(orders) {
  const orderList = document.getElementById("order-list");
  if (orderList) {
    orderList.innerHTML = "";

    orders.forEach((order) => {
      const orderElement = document.createElement("div");
      orderElement.classList.add("order");

      orderElement.innerHTML = `
        <h3>Order #${order.id}</h3>
        <p>Total: $${order.total}</p>
        <p>Status: ${order.status}</p>
      `;

      orderList.appendChild(orderElement);
    });
  }
}

function logout() {
  localStorage.removeItem("token");
  alert("Logged out successfully");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", fetchProducts);

// Signup form submission handler
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Signup successful");
        window.location.href = "login.html";
      } else {
        const error = await response.json();
        alert("Signup failed: " + error.message);
      }
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          alert("Login successful");
          window.location.href = "index.html"; // Redirect to dashboard or home page
        } else {
          const error = await response.json();
          alert("Login failed: " + error.message);
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again later.");
      }
    });
  }
});

// Adding event listeners for additional functionalities
document.getElementById("logout-btn")?.addEventListener("click", logout);
document.getElementById("checkout-btn")?.addEventListener("click", checkout);
document.getElementById("get-orders-btn")?.addEventListener("click", getOrders);
