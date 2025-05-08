// Datos de productos para carpintería
const products = [
  {
    id: 1,
    title: "Mesa de Roble",
    price: 599.99,
    image: "https://www.ikea.com/co/es/images/products/moerbylanga-mesa-chapa-de-roble-tinturado-cafe__0737108_pe740890_s5.jpg?f=s",
    category: "muebles",
    description: "Mesa de comedor de roble macizo, 180x90cm, acabado natural"
  },
  {
    id: 2,
    title: "Silla Artesanal",
    price: 129.99,
    image: "https://http2.mlstatic.com/D_NQ_NP_796778-MCO72818210039_112023-O.webp",
    category: "muebles",
    description: "Silla de diseño con respaldo tallado a mano, estructura en haya"
  },
  {
    id: 3,
    title: "Estantería Flotante",
    price: 249.99,
    image: "https://http2.mlstatic.com/D_NQ_NP_710140-MCO83953552110_042025-O.webp",
    category: "muebles",
    description: "Estantería de pino con acabado natural, 120cm, capacidad 15kg"
  },
  {
    id: 4,
    title: "Caja de Madera",
    price: 39.99,
    image: "https://media.falabella.com/sodimacCO/878779_01/w=1500,h=1500,fit=pad",
    category: "decoracion",
    description: "Caja artesanal con herrajes de latón, ideal para joyería"
  },
  {
    id: 5,
    title: "Banco de Jardín",
    price: 179.99,
    image: "https://www.estrucmader.com/wp-content/uploads/2015/11/MJ13_banco_jardin_respaldo.jpg",
    category: "exteriores",
    description: "Banco resistente a la intemperie, 120cm, madera de teca"
  },
  {
    id: 6,
    title: "Marco de Espejo",
    price: 89.99,
    image: "https://mueblesalbura.com.co/wp-content/uploads/2022/12/Muebles_Albura_Marco_Espejo_Madera_lateral.jpg",
    category: "decoracion",
    description: "Marco tallado a mano con detalles ornamentales, 40x60cm"
  },
  {
    id: 7,
    title: "Mesa de Centro",
    price: 349.99,
    image: "https://brunaticasa.com/wp-content/uploads/2022/06/mesa-centro-jianto_02.jpg",
    category: "muebles",
    description: "Mesa de centro en nogal, diseño moderno con cajón oculto"
  },
  {
    id: 8,
    title: "Perchero de Pared",
    price: 59.99,
    image: "https://virtualmuebles.com/cdn/shop/products/gaGMD6IFcp.jpg?v=1688777126",
    category: "decoracion",
    description: "Perchero rústico con 5 ganchos, ideal para entrada"
  }
];

// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Configurar año actual en el footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Cargar productos
  renderProducts();
  setupFilters();
  
  // Configurar carrito
  updateCartCount();
  setupCart();
  
  // Configurar formulario de contacto
  setupContactForm();
  
  // Configurar menú móvil
  setupMobileMenu();
  
  // Animaciones
  animateElements();
  
  // Configurar navegación suave
  setupSmoothScrolling();
});

// Renderizar productos
function renderProducts(filter = currentFilter) {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);
  
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p class="no-products">No hay productos en esta categoría</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card hidden';
    productCard.dataset.category = product.category;
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
      </div>
    `;
    
    productGrid.appendChild(productCard);
  });

  // Agregar event listeners a los botones
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
  });
}

// Configurar filtros
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Quitar clase active de todos los botones
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Añadir clase active al botón clickeado
      this.classList.add('active');
      
      // Filtrar productos
      currentFilter = this.dataset.filter;
      renderProducts(currentFilter);
      
      // Animación de filtrado
      gsap.from('.product-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    });
  });
}

// Configurar carrito
function setupCart() {
  const cartBtn = document.querySelector('.cart-btn');
  const closeCartBtn = document.querySelector('.close-cart');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // Abrir carrito
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.cart-modal').classList.add('active');
    overlay.classList.add('active');
    renderCartItems();
  });
  
  // Cerrar carrito
  closeCartBtn.addEventListener('click', () => {
    document.querySelector('.cart-modal').classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Cerrar al hacer clic en overlay
  overlay.addEventListener('click', () => {
    document.querySelector('.cart-modal').classList.remove('active');
    overlay.classList.remove('active');
  });
}

// Añadir al carrito
function addToCart(e) {
  const productId = parseInt(e.target.getAttribute('data-id'));
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  
  updateCartCount();
  saveCartToLocalStorage();
  
  // Animación GSAP
  gsap.to(e.target, {
    backgroundColor: "#27ae60",
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
  
  // Notificación
  showNotification(`${product.title} añadido al carrito`);
}

// Renderizar items del carrito
function renderCartItems() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  
  cartItemsEl.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    cartTotalEl.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    
    cartItemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <div class="cart-item-controls">
          <button class="decrease-quantity" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase-quantity" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.id}">×</button>
    `;
    
    cartItemsEl.appendChild(cartItemEl);
    total += item.price * item.quantity;
  });
  
  // Configurar controles de cantidad
  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const item = cart.find(item => item.id === id);
      item.quantity += 1;
      renderCartItems();
      updateCartCount();
      saveCartToLocalStorage();
    });
  });
  
  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      const item = cart.find(item => item.id === id);
      
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(item => item.id !== id);
      }
      
      renderCartItems();
      updateCartCount();
      saveCartToLocalStorage();
    });
  });
  
  // Configurar botones de eliminar
  document.querySelectorAll('.cart-item-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      cart = cart.filter(item => item.id !== id);
      renderCartItems();
      updateCartCount();
      saveCartToLocalStorage();
      showNotification('Producto eliminado del carrito');
    });
  });
  
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// Actualizar contador del carrito
function updateCartCount() {
  const cartCountEl = document.querySelector('.cart-count');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountEl.textContent = count;
  
  // Animación
  gsap.to(cartCountEl, {
    scale: 1.5,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  });
}

// Guardar carrito en localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Configurar formulario de contacto
function setupContactForm() {
  const form = document.getElementById('contactForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simular envío
    form.reset();
    showNotification('Mensaje enviado con éxito. Nos pondremos en contacto pronto.');
    
    // Animación
    gsap.fromTo('.notification', 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }
    );
  });
}

// Configurar menú móvil
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
  });
  
  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });
  });
}

// Configurar navegación suave
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Mostrar notificación
function showNotification(message) {
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  
  gsap.fromTo(notification, 
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, onComplete: hideNotification }
  );
}

function hideNotification() {
  const notification = document.querySelector('.notification');
  if (notification) {
    setTimeout(() => {
      gsap.to(notification, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        onComplete: () => notification.remove()
      });
    }, 3000);
  }
}

// Animaciones con GSAP
function animateElements() {
  // Registrar el plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Animación del hero
  gsap.from('.hero h2', {
    opacity: 0,
    y: -50,
    duration: 1.2,
    delay: 0.3,
    ease: "power3.out"
  });
  
  gsap.from('.hero p', {
    opacity: 0,
    y: -30,
    duration: 1,
    delay: 0.6,
    ease: "power2.out"
  });
  
  gsap.from('.cta-btn', {
    opacity: 100,
    y: 20,
    duration: 1,
    delay: 0.9,
    ease: "elastic.out(1, 0.5)"
  });
  
  // Animaciones con ScrollTrigger
  gsap.utils.toArray('.section-padding').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
  
  // Animación de los productos
  gsap.utils.toArray('.product-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: i * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      ease: "back.out(1.7)"
    });
  });
  
  // Animación de los filtros
  gsap.from('.filter-btn', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.5
  });
}