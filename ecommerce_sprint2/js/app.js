// Sprint 2 - Lógica general del sitio

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  configurarMenu();
  cargarContenido();
  configurarFormulario();
});

// Simulación de petición asíncrona.
function obtenerProductos() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(productos), 700);
  });
}

async function cargarContenido() {
  const grid = document.getElementById("productGrid");
  const featured = document.getElementById("featuredProducts");
  const detail = document.getElementById("productDetail");

  try {
    const data = await obtenerProductos();

    if (grid) {
      renderizarProductos(data, grid);
      configurarBuscador(data);
    }

    if (featured) {
      renderizarProductos(data.filter((producto) => producto.destacado), featured);
    }

    if (detail) {
      renderizarDetalle(data, detail);
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
    const containers = [grid, featured, detail].filter(Boolean);
    containers.forEach((container) => {
      container.innerHTML = "<p class='empty'>No se pudieron cargar los productos.</p>";
    });
  }
}

function renderizarProductos(lista, container) {
  if (!lista.length) {
    container.innerHTML = "<p class='empty'>No encontramos productos con esa búsqueda.</p>";
    actualizarResultados(0);
    return;
  }

  container.innerHTML = lista.map((producto) => `
    <article class="product-card">
      <a href="producto.html?id=${producto.id}" class="product-visual" aria-label="Ver ${producto.nombre}">
        <span>${producto.color}</span>
        <strong>${producto.id.toString().padStart(2, "0")}</strong>
      </a>
      <div class="product-info">
        <div>
          <p class="product-category">${producto.categoria}</p>
          <h3>${producto.nombre}</h3>
        </div>
        <p class="price">$${producto.precio.toLocaleString("es-AR")}</p>
      </div>
      <button class="btn btn-small add-cart" data-id="${producto.id}">Añadir al carrito</button>
    </article>
  `).join("");

  container.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", () => agregarAlCarrito(Number(button.dataset.id)));
  });

  actualizarResultados(lista.length);
}

function renderizarDetalle(data, container) {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || 1;
  const producto = data.find((item) => item.id === id) || data[0];

  container.innerHTML = `
    <a class="back-link" href="productos.html">← Volver al catálogo</a>
    <div class="detail-grid">
      <div class="detail-visual">
        <span>${producto.color}</span>
        <strong>${producto.id.toString().padStart(2, "0")}</strong>
      </div>
      <div class="detail-content">
        <p class="eyebrow">${producto.categoria}</p>
        <h1>${producto.nombre}</h1>
        <p class="detail-price">$${producto.precio.toLocaleString("es-AR")}</p>
        <p>${producto.descripcion}</p>
        <ul class="features">
          <li>✓ Diseño exclusivo NOVA</li>
          <li>✓ Calidad seleccionada</li>
          <li>✓ Envíos a todo el país</li>
        </ul>
        <button class="btn btn-primary add-cart" data-id="${producto.id}">Añadir al carrito</button>
      </div>
    </div>
  `;

  container.querySelector(".add-cart").addEventListener("click", () => agregarAlCarrito(producto.id));
}

function configurarBuscador(data) {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", (event) => {
    const termino = event.target.value.toLowerCase().trim();
    const filtrados = data.filter((producto) =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
    renderizarProductos(filtrados, document.getElementById("productGrid"));
  });
}

function agregarAlCarrito(id) {
  const carrito = JSON.parse(localStorage.getItem("novaCarrito")) || [];
  carrito.push(id);
  localStorage.setItem("novaCarrito", JSON.stringify(carrito));
  actualizarCarrito();

  const producto = productos.find((item) => item.id === id);
  mostrarToast(`${producto.nombre} fue añadido al carrito.`);
}

function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("novaCarrito")) || [];
  document.querySelectorAll("#cartCount").forEach((element) => {
    element.textContent = carrito.length;
  });
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function actualizarResultados(cantidad) {
  const counter = document.getElementById("resultsCount");
  if (counter) counter.textContent = `${cantidad} producto${cantidad === 1 ? "" : "s"}`;
}

function configurarFormulario() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    let valido = true;

    document.querySelectorAll(".error").forEach((element) => element.textContent = "");
    document.getElementById("successMessage").textContent = "";

    if (name.value.trim().length < 2) {
      document.getElementById("nameError").textContent = "Ingresá un nombre válido.";
      valido = false;
    }

    if (!email.validity.valid) {
      document.getElementById("emailError").textContent = "Ingresá un email válido.";
      valido = false;
    }

    if (message.value.trim().length < 10) {
      document.getElementById("messageError").textContent = "El mensaje debe tener al menos 10 caracteres.";
      valido = false;
    }

    if (valido) {
      document.getElementById("successMessage").textContent =
        "¡Mensaje enviado correctamente! Gracias por contactarnos.";
      form.reset();
    }
  });
}

function configurarMenu() {
  const button = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!button || !links) return;

  button.addEventListener("click", () => {
    links.classList.toggle("open");
  });
}
