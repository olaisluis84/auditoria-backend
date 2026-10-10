JavaScript
const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// -------------------------------------------------------------
// VULNERABILIDAD / SECURITY HOTSPOT 1: Credenciales en duro (Hardcoded Credentials)
// -------------------------------------------------------------
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'SuperSecretPassword123!', // <-- Sonar detectará contraseña expuesta
    database: 'tienda_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log("Conectado a la base de datos");
});

// -------------------------------------------------------------
// VULNERABILIDAD 2: Inyección SQL (SQL Injection)
// -------------------------------------------------------------
app.get('/api/usuarios', (req, res) => {
    let username = req.query.username;
    
    // Concatenación directa de entradas de usuario en la query
    let query = "SELECT * FROM usuarios WHERE username = '" + username + "'"; 
    
    db.query(query, (err, result) => {
        if (err) res.status(500).send(err);
        res.json(result);
    });
});

// -------------------------------------------------------------
// BUG 1: Referencia a variable no definida / Error en tiempo de ejecución
// -------------------------------------------------------------
app.get('/api/pedidos/:id', (req, res) => {
    let idPedido = req.params.id;
    
    // Variable 'descuentoAplicado' no ha sido declarada ni inicializada
    let total = calcularTotal(idPedido) - descuentoAplicado; 
    
    res.json({ id: idPedido, total: total });
});

// -------------------------------------------------------------
// CODE SMELL 1: Complejidad Ciclomática Alta y Bloques Duplicados
// CODE SMELL 2: Uso de 'var', código muerto y parámetros sin usar
// -------------------------------------------------------------
function procesarEstatus(estado, usuario, extraParam) { // 'extraParam' no se usa
    var resultado = ""; // Uso de 'var' en lugar de 'let' / 'const'
    
    if (estado == 1) {
        resultado = "Pendiente";
    } else if (estado == 2) {
        resultado = "En Proceso";
    } else if (estado == 3) {
        resultado = "Completado";
    } else if (estado == 4) {
        resultado = "Cancelado";
    } else if (estado == 5) {
        resultado = "Devuelto";
    } else {
        resultado = "Desconocido";
    }

    // Código duplicado e inútil (Code Smell)
    if (resultado === "Pendiente") {
        console.log("El pedido está pendiente");
    }
    if (resultado === "Pendiente") {
        console.log("El pedido está pendiente"); // Bloque idéntico duplicado
    }

    return resultado;
}

// BUG 2: Función que no retorna valor en todas sus ramas de control
function calcularTotal(id) {
    if (id > 0) {
        return 100.0;
    }
    // Falta un 'return' por defecto si id <= 0, retornará undefined
}

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});