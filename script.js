const selectedCategories = new Set();

// Filtros de categoría
document.querySelectorAll(".filter-btn").forEach(btn => {
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

// Botón "Limpiar filtros"
document.getElementById("clearFilters").addEventListener("click", () => {
  selectedCategories.clear();
  actualizarCatalogo();
  actualizarBotones();
});

// Mostrar/ocultar pasteles según filtros activos
function actualizarCatalogo() {
  const pasteles = document.querySelectorAll(".pastel");

  if (selectedCategories.size === 0) {
    pasteles.forEach(p => p.style.display = "block");
  } else {
    pasteles.forEach(p => {
      const cat = p.dataset.category;
      p.style.display = selectedCategories.has(cat) ? "block" : "none";
    });
  }
}

// Cambiar estilo activo en botones
function actualizarBotones() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    const cat = btn.dataset.category;
    btn.classList.toggle("active", selectedCategories.has(cat));
  });
}

// Descargar PDF con título y logo
document.getElementById("btnDescargar").addEventListener("click", () => {
  const visibles = Array.from(document.querySelectorAll(".pastel"))
    .filter(el => el.style.display !== "none");

  if (visibles.length === 0) {
    alert("No hay pasteles visibles para descargar.");
    return;
  }

  // Crear contenedor para PDF
  const contenedor = document.createElement("div");
  contenedor.className = "container mt-4";

  // Título del PDF
  const titulo = document.createElement("h2");
  titulo.textContent = "Catálogo de Pasteles";
  titulo.style.textAlign = "center";
  titulo.style.color = "#ed7324";
  contenedor.appendChild(titulo);

  // Logo en PDF
  const logo = document.createElement("img");
  logo.src = "img/logo-lorena.png";
  logo.style.display = "block";
  logo.style.margin = "0 auto 20px auto";
  logo.style.maxWidth = "200px";
  contenedor.appendChild(logo);

  // Agregar pasteles visibles
  const fila = document.createElement("div");
  fila.className = "row";

  visibles.forEach(card => {
    fila.appendChild(card.cloneNode(true));
  });

  contenedor.appendChild(fila);

  // Generar PDF
  html2pdf().set({
    margin: 0.5,
    filename: "catalogo-pasteles.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  }).from(contenedor).save();
});
