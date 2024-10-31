const menu = document.getElementById("menu");
const menuDrinks = document.getElementById("menu-drinks");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const cartCounter = document.getElementById("cart-count");

let cart = [];

cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
})

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
})

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
})

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
})

function addToCart(name, price) {
    //alert ('Item adicionado ao carrinho: ' + name + ', valor R$ ' + price);

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();

}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        subtotal = item.price * item.quantity;
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">Subtotal: R$ ${subtotal.toFixed(2)}</p>
                </div>

            <button class="remove-btn" data-name="${item.name}">Remover</button>

            </div>
        `;

       total+= item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeFromCart(name);
    }
})

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity--;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-600");
    }
})

checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Restaurante fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-600");
        return;
    }

    const cartItems = cart.map((item) => {
        return(`${item.name} - Quantidade: ${item.quantity} Preço: R$ ${item.price}`);
    }).join("\n");

    const message =  encodeURIComponent(cartItems);
    const phone = "999999999"

    window.open (`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank");
    cart =[];
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hours = data.getHours();
    return hours >= 16 && hours < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (!isOpen) {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-600");
} else{
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-600");
}