// Normaliza texto (elimina tildes y convierte a minúsculas)
function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let libros = [];

// Renderiza las tarjetas en pantalla
function renderizar(librosFiltrados) {
  const cont = document.getElementById('resultados');
  if (!librosFiltrados.length) {
    cont.innerHTML = '<p>No se encontraron libros.</p>';
    return;
  }
  cont.innerHTML = librosFiltrados.map((b, i) => `
    <article class="card" data-id="${i}">
      <img src="${b.portada}" alt="Portada ${b.titulo}" onerror="this.style.display='none'">
      <div class="meta">
        <h3>${b.titulo}</h3>
        <p class="cat">${b.categoria}</p>
        <p class="desc">${b.descripcion}</p>
      </div>
    </article>
  `).join('');

  // ➕ Evento click para abrir modal
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      abrirModal(libros[id]); // 🔥 ahora abre modal en lugar de detalle.html
    });
  });
}

// Busca por título, categoría o descripción
function buscar(q) {
  const qn = normalizarTexto(q);
  if (!qn) return libros;
  return libros.filter(b =>
    normalizarTexto(b.titulo).includes(qn) ||
    normalizarTexto(b.categoria).includes(qn) ||
    normalizarTexto(b.descripcion).includes(qn)
  );
}

// Carga inicial de datos desde bookdes.json 🚀
fetch('bookdes.json')
  .then(r => r.json())
  .then(data => {
    libros = data.libros || data;
    renderizar(libros);
  })
  .catch(err => {
    document.getElementById('resultados').innerHTML = '<p>Error cargando libros.</p>';
    console.error(err);
  });

// Evento de búsqueda en tiempo real
document.getElementById('buscar').addEventListener('input', (e) => {
  renderizar(buscar(e.target.value));
});


<!-- Modal -->
<div id="modal" class="modal">
  <div class="modal-content">
    <span id="cerrarModal">&times;</span>
    <h2 id="modalTitulo"></h2>
    <img id="modalPortada" alt="Portada" style="max-width:200px; margin:10px auto; display:block;">
    <p id="modalCategoria"></p>
    <p id="modalDescripciones"></p>
    <p id="modalAutor"></p>
  </div>
</div>

<style>
  /* Fondo del modal */
  .modal {
    display: none; /* Oculto por defecto */
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5); /* Fondo semitransparente */
  }

  /* Contenido del modal */
  .modal-content {
    background-color: #fff; /* Fondo blanco */
    margin: 10% auto;
    padding: 20px;
    border-radius: 10px;
    width: 60%;
    max-width: 600px;
    box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
  }

  /* Botón de cerrar */
  #cerrarModal {
    float: right;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }

  #cerrarModal:hover {
    color: red;
  }
</style>

<script>
  // Abrir modal (ejemplo de función)
  function abrirModal() {
    document.getElementById("modal").style.display = "block";
  }

  // Cerrar modal al hacer clic en la X
  document.getElementById("cerrarModal").onclick = function() {
    document.getElementById("modal").style.display = "none";
  }

  // Cerrar modal al hacer clic fuera del contenido
  window.onclick = function(event) {
    let modal = document.getElementById("modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
</script>




