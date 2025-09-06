// TrueStock - Inventario JavaScript

// Configuración API
const API_BASE_URL = 'http://localhost:8080';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;

// Estado global
let productos = [];
let productosFiltrados = [];
let editandoProducto = null;
let ordenActual = { campo: null, direccion: 'asc' };

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async function() {
    console.log('TrueStock Inventario cargado');
    await cargarDatos();
});

// Cargar todos los datos
async function cargarDatos() {
    try {
        await Promise.all([
            cargarProductos(),
            cargarMetricas()
        ]);
        document.getElementById('loading-overlay').style.display = 'none';
    } catch (error) {
        console.error('Error cargando datos:', error);
        mostrarNotificacion('Error conectando con el servidor. Mostrando datos de ejemplo.', 'warning');
        mostrarDatosEjemplo();
        document.getElementById('loading-overlay').style.display = 'none';
    }
}

// Cargar productos desde API
async function cargarProductos() {
    try {
        const response = await axios.get('/api/v1/productos');
        productos = response.data || [];
        productosFiltrados = [...productos];
        renderizarProductos();
    } catch (error) {
        throw error;
    }
}

// Cargar métricas
async function cargarMetricas() {
    try {
        const response = await axios.get('/api/v1/inventario/metricas');
        actualizarMetricas(response.data);
    } catch (error) {
        throw error;
    }
}

// Renderizar productos en tabla
function renderizarProductos() {
    const tbody = document.getElementById('productos-tbody');
    const countElement = document.getElementById('productos-mostrados');

    countElement.textContent = productosFiltrados.length;

    if (productosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No se encontraron productos
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productosFiltrados.map(producto => {
        const estado = obtenerEstadoProducto(producto);
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="product-info">
                        <div class="product-image">
                            <div>
                                <i class="fas fa-box"></i>
                            </div>
                        </div>
                        <div class="product-details">
                            <div class="product-name">${producto.nombre}</div>
                            <div class="product-supplier">${producto.proveedor || 'Sin proveedor'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${producto.categoria}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${producto.sku || producto.id}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${producto.stockActual}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatearPrecio(producto.precio)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${estado.clase}">
                        ${estado.texto}
                    </span>
                </td>
                <td class="table-actions">
                    <button onclick="editarProducto('${producto.id}')" class="action-button">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="eliminarProducto('${producto.id}')" class="action-button danger">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Obtener estado del producto
function obtenerEstadoProducto(producto) {
    if (producto.stockActual === 0) {
        return { texto: 'Agotado', clase: 'status-danger' };
    } else if (producto.stockActual <= producto.stockMinimo) {
        return { texto: 'Stock Bajo', clase: 'status-warning' };
    } else {
        return { texto: 'En Stock', clase: 'status-success' };
    }
}

// Actualizar métricas
function actualizarMetricas(metricas) {
    document.getElementById('total-productos').textContent = metricas.totalProductos || productos.length;
    document.getElementById('productos-stock').textContent = metricas.productosEnStock || productos.filter(p => p.stockActual > p.stockMinimo).length;
    document.getElementById('stock-bajo').textContent = metricas.productosStockBajo || productos.filter(p => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length;
    document.getElementById('agotados').textContent = metricas.productosAgotados || productos.filter(p => p.stockActual === 0).length;
}

// Buscar productos
function buscarProductos() {
    const query = document.getElementById('search-input').value.toLowerCase();
    productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.categoria.toLowerCase().includes(query) ||
        (producto.sku && producto.sku.toLowerCase().includes(query))
    );
    renderizarProductos();
}

// Aplicar filtros
function aplicarFiltros() {
    const categoriaFiltro = document.getElementById('categoria-filter').value;
    const estadoFiltro = document.getElementById('estado-filter').value;
    const query = document.getElementById('search-input').value.toLowerCase();

    productosFiltrados = productos.filter(producto => {
        let pasa = true;

        if (query) {
            pasa = pasa && (producto.nombre.toLowerCase().includes(query) ||
                          producto.categoria.toLowerCase().includes(query) ||
                          (producto.sku && producto.sku.toLowerCase().includes(query)));
        }

        if (categoriaFiltro) {
            pasa = pasa && producto.categoria === categoriaFiltro;
        }

        if (estadoFiltro) {
            switch(estadoFiltro) {
                case 'stock':
                    pasa = pasa && producto.stockActual > producto.stockMinimo;
                    break;
                case 'bajo':
                    pasa = pasa && producto.stockActual > 0 && producto.stockActual <= producto.stockMinimo;
                    break;
                case 'agotado':
                    pasa = pasa && producto.stockActual === 0;
                    break;
            }
        }

        return pasa;
    });

    renderizarProductos();
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('categoria-filter').value = '';
    document.getElementById('estado-filter').value = '';
    productosFiltrados = [...productos];
    renderizarProductos();
}

// Ordenar productos
function ordenarPor(campo) {
    if (ordenActual.campo === campo) {
        ordenActual.direccion = ordenActual.direccion === 'asc' ? 'desc' : 'asc';
    } else {
        ordenActual.campo = campo;
        ordenActual.direccion = 'asc';
    }

    productosFiltrados.sort((a, b) => {
        let valorA = a[campo === 'stock' ? 'stockActual' : campo];
        let valorB = b[campo === 'stock' ? 'stockActual' : campo];

        if (typeof valorA === 'string') {
            valorA = valorA.toLowerCase();
            valorB = valorB.toLowerCase();
        }

        if (ordenActual.direccion === 'asc') {
            return valorA > valorB ? 1 : -1;
        } else {
            return valorA < valorB ? 1 : -1;
        }
    });

    renderizarProductos();
}

// Modal funciones
function abrirModalNuevoProducto() {
    editandoProducto = null;
    document.getElementById('modal-titulo').textContent = 'Nuevo Producto';
    document.getElementById('btn-submit-text').textContent = 'Crear Producto';
    limpiarFormulario();
    document.getElementById('modal-producto').classList.remove('hidden');
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    editandoProducto = producto;
    document.getElementById('modal-titulo').textContent = 'Editar Producto';
    document.getElementById('btn-submit-text').textContent = 'Actualizar Producto';

    // Llenar formulario
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-sku').value = producto.sku || '';
    document.getElementById('producto-categoria').value = producto.categoria;
    document.getElementById('producto-proveedor').value = producto.proveedor || '';
    document.getElementById('producto-stock').value = producto.stockActual;
    document.getElementById('producto-stock-minimo').value = producto.stockMinimo;
    document.getElementById('producto-precio').value = producto.precio;

    document.getElementById('modal-producto').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-producto').classList.add('hidden');
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById('form-producto').reset();
    document.getElementById('producto-id').value = '';
}

// Manejar submit del formulario
document.getElementById('form-producto').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('producto-nombre').value,
        sku: document.getElementById('producto-sku').value,
        categoria: document.getElementById('producto-categoria').value,
        proveedor: document.getElementById('producto-proveedor').value,
        stockActual: parseInt(document.getElementById('producto-stock').value),
        stockMinimo: parseInt(document.getElementById('producto-stock-minimo').value),
        precio: parseFloat(document.getElementById('producto-precio').value)
    };

    try {
        if (editandoProducto) {
            // Actualizar producto existente
            await axios.put(`/api/v1/productos/${editandoProducto.id}`, formData);
            mostrarNotificacion('Producto actualizado exitosamente', 'success');
        } else {
            // Crear nuevo producto
            await axios.post('/api/v1/productos', formData);
            mostrarNotificacion('Producto creado exitosamente', 'success');
        }

        cerrarModal();
        await cargarProductos();
        await cargarMetricas();

    } catch (error) {
        console.error('Error guardando producto:', error);
        mostrarNotificacion('Error al guardar el producto', 'error');
    }
});

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    try {
        await axios.delete(`/api/v1/productos/${id}`);
        mostrarNotificacion('Producto eliminado exitosamente', 'success');
        await cargarProductos();
        await cargarMetricas();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        mostrarNotificacion('Error al eliminar el producto', 'error');
    }
}

// Exportar inventario
function exportarInventario() {
    const csv = convertirACSV(productosFiltrados);
    descargarCSV(csv, 'inventario_truestock.csv');
    mostrarNotificacion('Inventario exportado exitosamente', 'success');
}

function convertirACSV(productos) {
    const headers = ['Nombre', 'SKU', 'Categoría', 'Proveedor', 'Stock Actual', 'Stock Mínimo', 'Precio', 'Estado'];
    const rows = productos.map(p => [
        p.nombre,
        p.sku || '',
        p.categoria,
        p.proveedor || '',
        p.stockActual,
        p.stockMinimo,
        p.precio,
        obtenerEstadoProducto(p).texto
    ]);

    return [headers, ...rows].map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
}

function descargarCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notification-icon');
    const text = document.getElementById('notification-text');

    // Configurar estilos según tipo
    const config = {
        success: { clase: 'notification success', icono: 'fas fa-check-circle' },
        error: { clase: 'notification error', icono: 'fas fa-exclamation-circle' },
        warning: { clase: 'notification warning', icono: 'fas fa-exclamation-triangle' },
        info: { clase: 'notification info', icono: 'fas fa-info-circle' }
    };

    const { clase, icono } = config[tipo] || config.info;

    notification.className = clase;
    icon.className = icono;
    text.textContent = mensaje;

    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(precio);
}

// Datos de ejemplo si la API no está disponible
function mostrarDatosEjemplo() {
    productos = [
        {
            id: '1',
            nombre: 'Smartphone X20',
            sku: 'TEC-X20-BLK',
            categoria: 'Electrónicos',
            proveedor: 'Marca Tech',
            stockActual: 54,
            stockMinimo: 10,
            precio: 599999
        },
        {
            id: '2',
            nombre: 'Laptop Pro 15"',
            sku: 'COM-LP15-SLV',
            categoria: 'Computadoras',
            proveedor: 'Marca CompuPlus',
            stockActual: 12,
            stockMinimo: 15,
            precio: 1299999
        },
        {
            id: '3',
            nombre: 'Auriculares Bluetooth',
            sku: 'AUD-BT50-BLK',
            categoria: 'Audio',
            proveedor: 'Marca SoundMax',
            stockActual: 0,
            stockMinimo: 5,
            precio: 79999
        },
        {
            id: '4',
            nombre: 'Aceite Motor 5W30',
            sku: 'LUB-5W30-4L',
            categoria: 'Lubricantes',
            proveedor: 'AutoParts',
            stockActual: 3,
            stockMinimo: 10,
            precio: 25990
        },
        {
            id: '5',
            nombre: 'Filtro Aire K&N',
            sku: 'FIL-AIR-KN',
            categoria: 'Filtros',
            proveedor: 'K&N Filters',
            stockActual: 25,
            stockMinimo: 5,
            precio: 45990
        }
    ];

    const metricasEjemplo = {
        totalProductos: productos.length,
        productosEnStock: productos.filter(p => p.stockActual > p.stockMinimo).length,
        productosStockBajo: productos.filter(p => p.stockActual > 0 && p.stockActual <= p.stockMinimo).length,
        productosAgotados: productos.filter(p => p.stockActual === 0).length
    };

    productosFiltrados = [...productos];
    renderizarProductos();
    actualizarMetricas(metricasEjemplo);
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

// Cerrar modal clickeando fuera
document.getElementById('modal-producto').addEventListener('click', function(e) {
    if (e.target === this) {
        cerrarModal();
    }
});