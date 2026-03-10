

// Fetch and display user's orders
async function loadOrders() {

  try {

    const res = await fetch(`${API_BASE_URL}/payment/my-orders`, {
      credentials: "include"
    });

    const data = await res.json();

    if (!data.success) {
      alert("Failed to load orders");
      return;
    }

    renderOrders(data.orders);

  } catch (error) {

    console.error(error);

  }

}

loadOrders();

// Render orders on the page
function renderOrders(orders) {

  const container = document.getElementById("ordersContainer");

  container.innerHTML = "";

  if (!orders.length) {

    container.innerHTML = "<p>No orders found</p>";

    return;
  }

  orders.forEach(order => {

    const orderDiv = document.createElement("div");

    orderDiv.classList.add("orderCard");

    orderDiv.innerHTML = `

      <h3>Order ID: ${order._id}</h3>

      <p><strong>Total:</strong> ₹${order.total}</p>

      <p><strong>Payment:</strong> ${order.paymentStatus}</p>

      <p><strong>Status:</strong> ${order.status}</p>

      <h4>Items:</h4>

      <div class="orderItems">

      ${order.items.map(item => `

        <div class="orderItem">

          <img src="${item.image}" width="80">

          <p>${item.title}</p>

          <p>₹${item.price}</p>

          <p>Qty: ${item.quantity}</p>

        </div>

      `).join("")}

      </div>

    `;

    container.appendChild(orderDiv);

  });

}