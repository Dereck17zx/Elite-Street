// --- CONFIGURACIÓN DE LA TIENDA ---
// Reemplaza este número con el teléfono de tu negocio (incluyendo código de país sin el signo +)
// Ejemplo: 51920487104 (51 = Perú, 920487104 = Número)
const WHATSAPP_PHONE = "51920487104"; 

// --- BASE DE DATOS DE PRODUCTOS ---
const PRODUCTS = [
    {
        id: 1,
        title: "Zapatillas Deportivas Red Storm",
        category: "zapatillas",
        price: 45999,
        originalPrice: 59999,
        rating: 4.8,
        reviewsCount: 124,
        image: "images/sneaker_sport_red.png",
        description: "Diseñadas para el máximo rendimiento y confort urbano. Cuentan con una suela amortiguadora de alta tecnología, capellada transpirable de mesh premium y detalles reflectantes para destacar en la noche.",
        badge: "Oferta"
    },
    {
        id: 2,
        title: "Zapatillas Urbanas Retro Emerald",
        category: "zapatillas",
        price: 42500,
        originalPrice: null,
        rating: 4.6,
        reviewsCount: 88,
        image: "images/sneaker_retro_white.png",
        description: "Un clásico que nunca pasa de moda. Confeccionadas en cuero sintético de alta resistencia con detalles en verde esmeralda. Ideales para combinar con tus outfits diarios con un toque vintage.",
        badge: "Popular"
    },
    {
        id: 3,
        title: "Hoodie Oversize Blackout",
        category: "ropa",
        price: 28999,
        originalPrice: 35000,
        rating: 4.9,
        reviewsCount: 156,
        image: "images/hoodie_oversized_black.png",
        description: "Buzo oversize confeccionado en frisa de algodón pesado premium. Máximo abrigo, caída perfecta y un diseño minimalista ideal para el estilo urbano cotidiano.",
        badge: "Más Vendido"
    },
    {
        id: 4,
        title: "Campera Cortaviento Tech Neon",
        category: "ropa",
        price: 38000,
        originalPrice: null,
        rating: 4.7,
        reviewsCount: 64,
        image: "images/jacket_windbreaker.png",
        description: "Campera impermeable y cortaviento ultraliviana. Cuenta con detalles refractivos y cierres termosellados para protegerte del clima adverso manteniendo el mejor estilo urbano.",
        badge: "Nuevo"
    },
    {
        id: 5,
        title: "Zapatillas Streetwear Urban Fire",
        category: "zapatillas",
        price: 49999,
        originalPrice: null,
        rating: 4.5,
        reviewsCount: 42,
        image: "images/sneaker_sport_red.png", // Reutiliza la imagen premium con variante de nombre
        description: "Edición especial con detalles de diseño audaces y llamativos. Estas zapatillas ofrecen un ajuste ergonómico perfecto y una durabilidad extrema para uso diario intensivo.",
        badge: ""
    },
    {
        id: 6,
        title: "Hoodie Essential Charcoal",
        category: "ropa",
        price: 26500,
        originalPrice: 31000,
        rating: 4.7,
        reviewsCount: 93,
        image: "images/hoodie_oversized_black.png", // Reutiliza la imagen premium con variante de nombre
        description: "La prenda básica que no puede faltar en tu armario. Un buzo con capucha súper suave, cómodo y abrigado, ideal para cualquier temporada del año.",
        badge: "Descuento"
    }
];

// --- ESTADO DE LA APLICACIÓN ---
let activeCategory = "all";
let searchQuery = "";
let sortBy = "default";

// --- ELEMENTOS DEL DOM ---
const productsGrid = document.getElementById("products-grid");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector("i");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const filterButtons = document.querySelectorAll(".filter-btn");

// Modal Elements
const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalRatingStar = document.getElementById("modal-rating-star");
const modalRatingText = document.getElementById("modal-rating-text");
const modalPrice = document.getElementById("modal-price");
const modalPriceOriginal = document.getElementById("modal-price-original");
const modalDescription = document.getElementById("modal-description");
const modalWhatsappBtn = document.getElementById("modal-whatsapp-btn");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    setupTheme();
    renderProducts();
    setupEventListeners();
    iniciarDeslizadorHero(); // Iniciar el deslizador de la imagen principal (hero)
});

// --- SISTEMA DE TEMAS (CLARO / OSCURO) ---
function setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === "dark") {
        themeIcon.className = "fa-solid fa-sun";
    } else {
        themeIcon.className = "fa-solid fa-moon";
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener("click", toggleTheme);

    // Filters
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            e.currentTarget.classList.add("active");
            activeCategory = e.currentTarget.dataset.filter;
            renderProducts();
        });
    });

    // Search
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Sort
    sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderProducts();
    });

    // Modal Close
    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.querySelector(".modal-overlay").addEventListener("click", closeModal);

    // Header scroll effect
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".main-header");
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const icon = mobileMenuBtn.querySelector("i");
            if (navMenu.classList.contains("open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                const icon = mobileMenuBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });
    }
}

// --- RENDERIZADO DE PRODUCTOS ---
function renderProducts() {
    // 1. Filtrado
    let filtered = PRODUCTS.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesSearch = product.title.toLowerCase().includes(searchQuery) || 
                              product.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    // 2. Ordenamiento
    if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    // 3. Renderizado en el DOM
    productsGrid.innerHTML = "";

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o filtros.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        const badgeHTML = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
        const originalPriceHTML = product.originalPrice ? `<span class="product-price-original">$${product.originalPrice.toLocaleString('es-AR')}</span>` : "";

        card.innerHTML = `
            <div class="product-img-container" onclick="openModal(${product.id})">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <button class="product-wishlist-btn" aria-label="Añadir a favoritos" onclick="toggleWishlist(this)">
                <i class="fa-regular fa-heart"></i>
            </button>
            <div class="product-card-content">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title" onclick="openModal(${product.id})">${product.title}</h3>
                <div class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    <span>${product.rating} (${product.reviewsCount})</span>
                </div>
                <div class="product-footer">
                    <div class="price-container">
                        ${originalPriceHTML}
                        <span class="product-price">$${product.price.toLocaleString('es-AR')}</span>
                    </div>
                    <button class="whatsapp-buy-btn" onclick="sendSingleProductWhatsAppById(${product.id})" aria-label="Comprar por WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// --- LOGICA DE FAVORITOS (MICRO-INTERACCION) ---
function toggleWishlist(btn) {
    const icon = btn.querySelector("i");
    if (icon.classList.contains("fa-regular")) {
        icon.className = "fa-solid fa-heart";
        icon.style.color = "var(--accent)";
    } else {
        icon.className = "fa-regular fa-heart";
        icon.style.color = "";
    }
}

// --- DETALLE DE PRODUCTO (MODAL) ---
function openModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    modalImg.src = product.image;
    modalImg.alt = product.title;
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.title;
    modalRatingText.textContent = `${product.rating} (${product.reviewsCount} opiniones)`;
    modalPrice.textContent = `$${product.price.toLocaleString('es-AR')}`;
    
    if (product.originalPrice) {
        modalPriceOriginal.style.display = "inline";
        modalPriceOriginal.textContent = `$${product.originalPrice.toLocaleString('es-AR')}`;
    } else {
        modalPriceOriginal.style.display = "none";
    }

    modalDescription.textContent = product.description;

    // Configurar botón del modal
    modalWhatsappBtn.onclick = () => {
        sendSingleProductWhatsApp(product);
    };

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
}

function sendSingleProductWhatsApp(product) {
    let message = `*¡Hola Elite Street!* 👋\n`;
    message += `Quiero comprar el siguiente producto de su catálogo:\n\n`;
    message += `🔸 *${product.title}*\n`;
    message += `Precio: *$${product.price.toLocaleString('es-AR')}*\n`;
    message += `Categoría: _${product.category}_\n\n`;
    message += `¿Tienen stock disponible para coordinar el pago y envío? ¡Muchas gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
}

function sendSingleProductWhatsAppById(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
        sendSingleProductWhatsApp(product);
    }
}

// --- FUNCIÓN ADICIONAL: CONTACTAR DIRECTAMENTE ---
// Esta función se puede llamar desde cualquier botón general de contacto
function contactDirectly() {
    const message = "¡Hola Elite Street! 👋 Quería hacer una consulta general sobre sus productos.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}
// --- DESLIZADOR AUTOMÁTICO DE LA IMAGEN HERO ---
function iniciarDeslizadorHero() {
    const imagenHero = document.querySelector(".hero-image");
    if (!imagenHero) return;

    // Obtener imágenes únicas del catálogo de productos
    const imagenesUnicas = [...new Set(PRODUCTS.map(p => p.image))];
    let indiceActual = 0;

    setInterval(() => {
        // Efecto de desvanecimiento y rotación de salida
        imagenHero.style.opacity = "0";
        imagenHero.style.transform = "rotate(-15deg) scale(0.9)";
        
        setTimeout(() => {
            indiceActual = (indiceActual + 1) % imagenesUnicas.length;
            imagenHero.src = imagenesUnicas[indiceActual];
            
            // Efecto de entrada suave
            imagenHero.style.opacity = "1";
            imagenHero.style.transform = "rotate(-8deg) scale(1)";
        }, 400); // Cambiar la imagen mientras está invisible (coincide con la transición)
    }, 3000);
}

window.contactDirectly = contactDirectly;
window.sendSingleProductWhatsAppById = sendSingleProductWhatsAppById;
window.openModal = openModal;
window.toggleWishlist = toggleWishlist;
