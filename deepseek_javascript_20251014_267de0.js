// Sistema de carrinho
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Elementos do DOM
const cartCountElement = document.getElementById('cart-count');
const cartItemsElement = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const cartButton = document.getElementById('cart-button');
const closeCartButton = document.getElementById('close-cart');
const checkoutButton = document.getElementById('checkout-button');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const produtos = document.querySelectorAll('.produto');

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    // Verificar se o item já está no carrinho
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Atualizar contador e total
    cartCount += 1;
    cartTotal += price;
    
    updateCartDisplay();
    
    // Feedback visual
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Adicionado!';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

// Função para remover item do carrinho
function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        cartCount -= 1;
        cartTotal -= item.price;
        
        updateCartDisplay();
    }
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    // Atualizar contador
    cartCountElement.textContent = cartCount;
    
    // Atualizar lista de itens
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p style="text-align: center; padding: 20px; color: #777;">Seu carrinho está vazio</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button onclick="removeFromCart('${item.name}')">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button onclick="addToCart('${item.name}', ${item.price})">+</button>
                </div>
            `;
            cartItemsElement.appendChild(itemElement);
        });
    }
    
    // Atualizar total
    cartTotalElement.textContent = `Total: R$ ${cartTotal.toFixed(2)}`;
}

// Função para filtrar produtos
function filterProducts(category, searchTerm) {
    let hasVisibleProducts = false;
    
    produtos.forEach(produto => {
        const productCategory = produto.getAttribute('data-category');
        const productName = produto.querySelector('h2').textContent.toLowerCase();
        const productDescription = produto.querySelector('p').textContent.toLowerCase();
        
        const matchesCategory = category === 'all' || productCategory === category;
        const matchesSearch = searchTerm === '' || 
            productName.includes(searchTerm) || 
            productDescription.includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            produto.style.display = 'flex';
            produto.classList.add('fade-in');
            hasVisibleProducts = true;
        } else {
            produto.style.display = 'none';
        }
    });
    
    // Exibir mensagem se não houver produtos
    const noProductsMessage = document.querySelector('.no-products');
    if (!hasVisibleProducts) {
        if (!noProductsMessage) {
            const message = document.createElement('div');
            message.className = 'no-products';
            message.textContent = 'Nenhum produto encontrado. Tente alterar os filtros ou termos de busca.';
            document.querySelector('.produtos').appendChild(message);
        }
    } else if (noProductsMessage) {
        noProductsMessage.remove();
    }
}

// Event Listeners
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio! Adicione alguns itens antes de finalizar o pedido.');
        return;
    }
    
    // Simular processamento do pedido
    const orderDetails = cart.map(item => 
        `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Pedido finalizado com sucesso!\n\nResumo do pedido:\n${orderDetails}\n\nTotal: R$ ${cartTotal.toFixed(2)}\n\nObrigado pela preferência! Em breve entraremos em contato para confirmar seu pedido.`);
    
    // Limpar carrinho
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    updateCartDisplay();
    
    // Fechar modal
    cartModal.style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Filtros de categoria
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        const category = button.getAttribute('data-filter');
        const searchTerm = searchInput.value.toLowerCase();
        filterProducts(category, searchTerm);
    });
});

// Busca em tempo real
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    filterProducts(activeFilter, searchTerm);
});

// Splash screen
window.onload = function() {
    setTimeout(function() {
        document.getElementById('splash').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        document.body.style.overflow = '';
    }, 2500);
};