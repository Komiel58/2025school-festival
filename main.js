let orders = [];現在の合計金額

// function addItem(name, price) {
//     orders.push({ name, price });
//     updateOrderList();
//     updateLiveTotal(); // ← ここでリアルタイム合計金額も更新
// }


function addItem(name, price) {
    orders.push({ name, price, count: 1 }); // ← count を追加
    updateOrderList();
    updateLiveTotal();
}


function updateOrderList() {
    const list = document.getElementById("orderList");
    if (!list) return;
    list.innerHTML = "";
    orders.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ¥${item.price}`;
        list.appendChild(li);
    });
}

function sendOrder() {
    const allOrders = JSON.parse(localStorage.getItem("ordersHistory")) || [];
    const orderNumber = `ORDER-${(allOrders.length + 1).toString().padStart(3, '0')}`;
    const newOrder = {
        orderNumber,
        timestamp: new Date().toLocaleString(),
        items: [...orders],
        paid: false
    };
    allOrders.push(newOrder);
    localStorage.setItem("ordersHistory", JSON.stringify(allOrders));
    alert(`注文番号 ${orderNumber} を送信しました！`);
    orders = [];
    updateOrderList();
}

function displayReceivedOrders() {
    const list = document.getElementById("receivedOrders");
    if (!list) return;
    const allOrders = JSON.parse(localStorage.getItem("ordersHistory")) || [];
    list.innerHTML = "";
    allOrders.forEach((order, index) => {
        const section = document.createElement("section");
        const header = document.createElement("h3");
        header.textContent = `注文番号: ${order.orderNumber}（${order.timestamp}） ${order.paid ? "(会計済)" : "(未会計)"}`;
        section.appendChild(header);

        const ul = document.createElement("ul");
        order.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ¥${item.price}`;
            ul.appendChild(li);
        });
        section.appendChild(ul);

        list.appendChild(section);
    });
}

// function updateLiveTotal() {
//   let total = 0;
//   orders.forEach(item => {
//     total += item.price * item.count;
//   });
//   const display = document.getElementById("liveTotal");
//   if (display) {
//     display.textContent = `現在の合計金額：¥${total.toLocaleString()}`;
//   }
// }


function updateLiveTotal() {
    let total = 0;
    orders.forEach(item => {
        const count = item.count ?? 1; // nullish coalescing: undefinedなら1
        total += item.price * count;
    });
    const display = document.getElementById("liveTotal");
    if (display) {
        display.textContent = `現在の合計金額：¥${total.toLocaleString()}`;
    }
}


function calculateTotal() {
    const allOrders = JSON.parse(localStorage.getItem("ordersHistory")) || [];
    const total = allOrders.reduce((sum, order) => {
        return sum + order.items.reduce((subSum, item) => subSum + item.price, 0);
    }, 0);
    const totalElement = document.getElementById("totalPrice");
    if (totalElement) {
        totalElement.textContent = `合計金額: ¥${total}`;
    }
}
