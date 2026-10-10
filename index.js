const express = require('express');
const mysql = require('mysql');
const app = express();

// CORRECCIÓN DE SEGURIDAD EXPRESS: Oculta la cabecera X-Powered-By
app.disable('x-powered-by');

app.use(express.json());

// CORRECCIÓN 1 (Security Hotspot): Uso de variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_db'
});

db.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos");
});

// CORRECCIÓN 2 (Vulnerabilidad): Consultas preparadas contra SQL Injection
app.get('/api/usuarios', (req, res) => {
    const username = req.query.username;
    const query = "SELECT * FROM usuarios WHERE username = ?"; 
    
    db.query(query, [username], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// CORRECCIÓN 3 (Reliability / Consistency): Uso de Number.parseInt
app.get('/api/pedidos/:id', (req, res) => {
    const idPedido = Number.parseInt(req.params.id, 10);
    const descuentoAplicado = 0; 
    
    const total = calcularTotal(idPedido) - descuentoAplicado; 
    
    res.json({ id: idPedido, total: total });
});

// CORRECCIÓN 4 (Code Smell): Mapeo sin 'var' ni bloques duplicados
function procesarEstatus(estado) { 
    const estados = {
        1: "Pendiente",
        2: "En Proceso",
        3: "Completado",
        4: "Cancelado",
        5: "Devuelto"
    };

    const resultado = estados[estado] || "Desconocido";

    if (resultado === "Pendiente") {
        console.log("El pedido está pendiente");
    }

    return resultado;
}

// CORRECCIÓN 5 (Bug): Retorno por defecto explícito
function calcularTotal(id) {
    if (id > 0) {
        return 100.0;
    }
    return 0.0;
}

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});