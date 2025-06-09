const selectedCategories = new Set(); // Categorías seleccionadas para filtrar
selectedCategories.add("adulto"); // Mostrar solo la categoría "adulto" al iniciar

let pastelesData = []; // Datos de pasteles cargados desde JSON

fetch("pasteles.json")
  .then((response) => response.json())
  .then((data) => {
    pastelesData = data;
    renderizarPasteles();
    actualizarBotones();
  })
  .catch((error) => console.error("Error al cargar el JSON:", error));

// Función para poner solo la primera letra en mayúscula y el resto en minúscula
function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Función para poner todo el texto en mayúsculas
function uppercaseText(text) {
  if (!text) return "";
  return text.toUpperCase();
}

// Cargar pasteles desde el archivo JSON
fetch("pasteles.json")
  .then((response) => response.json())
  .then((data) => {
    pastelesData = data; // Guardar datos en variable global
    renderizarPasteles(); // Mostrar catálogo inicialmente
  })
  .catch((error) => console.error("Error al cargar el JSON:", error));

// Función para renderizar los pasteles en el catálogo
function renderizarPasteles() {
  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = ""; // Limpiar catálogo antes de re-renderizar

  pastelesData.forEach((pastel) => {
    // Mostrar pastel solo si su categoría está seleccionada o si no hay filtros
    const visible =
      selectedCategories.size === 0 || selectedCategories.has(pastel.categoria);

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 pastel position-relative";
    col.dataset.category = pastel.categoria;
    col.style.display = visible ? "block" : "none";

    // Crear tarjeta del pastel con título, imagen, categoría y badge opcional
    col.innerHTML = `
      <div class="card my-4 position-relative" style="cursor:pointer;">
        <span class="badge bg-success position-absolute top-0 start-0 m-2 px-2 py-1 text-capitalize">
          ${pastel.categoria}
        </span>
        ${
          pastel.gd
            ? `<span class="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1 text-uppercase">GD${pastel.gd}</span>`
            : ""
        }
        <img src="${
          pastel.imagen
        }" class="card-img-top img-fluid img-fixed" alt="${pastel.titulo}">
        <div class="card-body">
          <h5 class="card-title text-color-naranja">
            <i class="${pastel.icono}"></i> ${pastel.titulo}
          </h5>
        </div>
      </div>
    `;

    // Al hacer clic en la tarjeta, mostrar modal con datos
    col.querySelector(".card").addEventListener("click", () => {
      mostrarModal({
        titulo: pastel.titulo,
        categoria: pastel.categoria,
        gd: pastel.gd,
        descripcion: pastel.descripcion || "Sin descripción disponible.",
      });
    });

    contenedor.appendChild(col);
  });
}

// Mostrar modal con información detallada del pastel, aplicando formato a texto
function mostrarModal({ titulo, categoria, gd, descripcion }) {
  const modalTitulo = document.getElementById("pastelModalLabel");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalBadge = document.getElementById("modalBadge");
  const modalDescripcion = document.getElementById("modalDescripcion");

  modalTitulo.textContent = titulo;
  modalCategoria.textContent = capitalizeFirstLetter(categoria); // Inicial mayúscula
  modalBadge.textContent = gd ? `${gd}` : "-"; // Mostrar GD: número o guion
  modalDescripcion.textContent = descripcion;

  const modal = new bootstrap.Modal(document.getElementById("pastelModal"));
  modal.show();
}

// Manejo de filtros: añadir o quitar categoría al conjunto de categorías seleccionadas
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    actualizarCatalogo();
    actualizarBotones();
  });
});

// Botón para limpiar todos los filtros
document.getElementById("clearFilters").addEventListener("click", () => {
  selectedCategories.clear();
  actualizarCatalogo();
  actualizarBotones();
});

// Actualiza el catálogo re-renderizando los pasteles
function actualizarCatalogo() {
  renderizarPasteles();
}

// Actualiza la apariencia de los botones para mostrar cuáles están activos
function actualizarBotones() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const cat = btn.dataset.category;
    btn.classList.toggle("active", selectedCategories.has(cat));
  });
}

// Generar y descargar el catálogo visible en PDF
document.getElementById("btnDescargar").addEventListener("click", () => {
  // Seleccionar solo los pasteles que están visibles (display != none)
  const visibles = Array.from(document.querySelectorAll(".pastel")).filter(
    (el) => el.style.display !== "none"
  );

  if (visibles.length === 0) {
    alert("No hay pasteles visibles para descargar.");
    return;
  }

  // Crear un contenedor temporal para el PDF
  const contenedor = document.createElement("div");
  contenedor.className = "container mt-4";

  // Título del catálogo en el PDF (más grande y centrado)
  const titulo = document.createElement("h1");
  titulo.textContent = "Catálogo de Pasteles";
  titulo.style.textAlign = "center";
  titulo.style.fontSize = "3rem";
  titulo.style.color = "#ed7324";
  titulo.style.marginBottom = "30px";
  contenedor.appendChild(titulo);

  // Logo en el PDF (más grande)
  const logo = document.createElement("img");
  logo.src = "img/logo-lorena.png";
  logo.style.display = "block";
  logo.style.margin = "0 auto 40px auto";
  logo.style.maxWidth = "300px";
  logo.style.height = "auto";
  contenedor.appendChild(logo);

  // Agregar salto de página antes de los pasteles
  const saltoPagina = document.createElement("div");
  saltoPagina.style.pageBreakAfter = "always";
  contenedor.appendChild(saltoPagina);

  // Contenedor fila para las tarjetas clonadas
  const fila = document.createElement("div");

  fila.className = "row";

  // Clonar cada pastel visible y agregarlo al contenedor para el PDF
  visibles.forEach((card) => {
    const clon = card.cloneNode(true);
    fila.appendChild(clon);
  });

  contenedor.appendChild(fila);

  // Configurar y generar PDF con html2pdf
  html2pdf()
    .set({
      margin: 0.5,
      filename: "catalogo-pasteles.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: [40, 15], orientation: "landscape" },
    })
    .from(contenedor)
    .save();
});
