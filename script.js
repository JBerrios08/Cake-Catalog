// Filtro por categoría
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const categoria = btn.dataset.category;
    document.querySelectorAll('.pastel').forEach(card => {
      card.style.display = (categoria === 'todos' || card.dataset.category === categoria) ? 'block' : 'none';
    });
  });
});

// Descargar PDF
document.getElementById('btnDescargar').addEventListener('click', () => {
  const visibles = Array.from(document.querySelectorAll('.pastel'))
    .filter(el => el.style.display !== 'none');

  if (visibles.length === 0) {
    alert("No hay pasteles visibles para descargar.");
    return;
  }

  const contenedor = document.createElement('div');
  contenedor.classList.add('pdf-grid'); // clase personalizada

  visibles.forEach(card => contenedor.appendChild(card.cloneNode(true)));

  html2pdf().set({
    margin: 0.5,
    filename: 'catalogo-filtrado.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(contenedor).save();
});
