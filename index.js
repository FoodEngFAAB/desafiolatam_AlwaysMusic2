const { Pool } = require("pg")
const config = {
    user: "postgres",
    host: "localhost",
    password: "JBJFourier1768@",
    database: "ALWAYSMUSIC",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
}

//Matriz que contiene los argumentos pasados al proceso cuando se ejecute en la línea de comando.
const stdtInfo = process.argv.slice(2)
const Nombre = stdtInfo[1]
const Curso = stdtInfo[2]
const Nivel = stdtInfo[3]
const RUT = stdtInfo[4]
const pool = new Pool(config)

//Ocupar la clase Pool definiendo sus diferentes propiedades, capturar los posibles errores en el proceso de conexión con la base de datos y realizar las siguientes consultas, usando textos parametrizados y Prepared Statement (1-5)

//1. Agregar un nuevo estudiante.
/*
Comandos de prueba
node index.js addStudent 'Bater Ista' 'Percusión' '1' '12.345.678-9'
node index.js addStudent 'Char Ango Style' 'Cuerdas' '1' '98.765.432-1'
node index.js addStudent 'Per Cusión' 'Percusión' '2' '22.123.321-0'
node index.js addStudent 'Bee Old In' 'Cuerdas' '3' '44.159.753-K'
node index.js addStudent 'Tri Angulo' 'Percusión' '1' '25.456.852-1'
*/

async function addStudent() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error(error.code)
        const SQLQuery = {
            rowMode: 'array',
            text:
                "insert into students (Nombre, Curso, Nivel, RUT) values ($1, $2, $3, $4) RETURNING *",
            values: [`${stdtInfo[1]}`, `${stdtInfo[2]}`, `${stdtInfo[3]}`, `${stdtInfo[4]}`],
        }
        try {
            const res = await client.query(SQLQuery)
            console.log(`Último registro agregado: ${stdtInfo[1]}, RUT: ${stdtInfo[4]} en curso de ${stdtInfo[2]}, nivel ${stdtInfo[3]}`)
        } catch (error) {
            console.log('Error (addStudent): ', error.code)
        }
        release()
        pool.end()
    })
}

//2. Consultar los estudiantes registrados.
/*
Comando de prueba
node index.js queryAll
*/
async function queryAll() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error(error.code)
        const SQLQuery = {
            rowMode: "array",
            text: 'SELECT * from students',
        }
        try {
            const res = await client.query(SQLQuery)
            console.log(`Registro total:`, res.rows)
        } catch (error) {
            console.log('Error (queryAll): ', error.code)
        }
        release()
        pool.end()
    })
}

//3.Consultar estudiante por rut.
/*
node index.js queryStudent '12.345.678-9'
node index.js queryStudent '98.765.432-1'
node index.js queryStudent '22.123.321-0'
node index.js queryStudent '44.159.753-K'
node index.js queryStudent '25.456.852-1'
*/
async function queryStudent() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error(error.code)
        const SQLQuery = {
            rowMode: "array",
            text: 'SELECT * from students WHERE RUT=$1',
            values: [`${stdtInfo[1]}`]
        }
        try {
            const res = await client.query(SQLQuery)
            console.log(`RUT consultado: ${stdtInfo[1]}\nDatos: `, res.rows[0])
        } catch (error) {
            console.log('Error (queyStudent): ', error.code)
        }
        release()
        pool.end()
    })
}

//4. Actualizar la información de un estudiante.
//Actualiza datos del estudiante
/*
Comandos de prueba
Actualiza nivel del estudiante
node index.js updateStudent 'Bater Ista' 'Percusión' '2' '12.345.678-9'
node index.js updateStudent 'Char Ango Style' 'Cuerdas' '2' '98.765.432-1'

Actualiza nombre del estudiante
node index.js updateStudent 'Per Cusión Ista' 'Percusión' '2' '22.123.321-0'
node index.js updateStudent 'Bee All In' 'Cuerdas' '3' '44.159.753-K'

Actualiza Nombre y Curso
node index.js updateStudent 'Vent Harrón' 'Vientos' '1' '25.456.852-1'

*/

async function updateStudent() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error(error.code)
        const SQLQuery = {
            rowMode: "array",
            text:
                "UPDATE students SET Nombre = $1, Curso = $2, Nivel = $3 WHERE RUT = $4 RETURNING *;",
            values: [Nombre, Curso, Nivel, RUT]
        }
        try {
            const res = await client.query(SQLQuery)
            console.log(`Usuario actualizado: ${stdtInfo[1]}\nDatos: `, res.row[0])
        } catch (error) {
            console.log('Error (updateStudent): ', error.code)
        }
        release()
        pool.end()
    })
}

//5. Eliminar el registro de un estudiante.
/*
Comandos de prueba
    Crear usuario para luego borrarlo:
    node index.js addStudent 'Fend Er' 'Cuerdas' '3' '66.666.666-6'

    ELiminar usuario creado
    node index.js deleteStudent '66.666.666-6'
*/
async function deleteStudent() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error(error.code)
        const SQLQuery = {
            rowMode: "array",
            text: 'DELETE from students WHERE RUT=$1',
            values: [`${stdtInfo[1]}`]
        }
        try {
            const res = await client.query(SQLQuery)
            console.log('RUT eliminado:', `${stdtInfo[1]}`)    
        } catch (error) {
            console.log('Error (deleteStudent): ', error.code)
        }
        release()
        pool.end()
    })
}

if (stdtInfo[0] == 'addStudent') {
    addStudent()
}

if (stdtInfo[0] == 'queryAll') {
    queryAll()
}

if (stdtInfo[0] == 'queryStudent') {
    queryStudent()
}

if (stdtInfo[0] == 'updateStudent') {
    updateStudent()
}

if (stdtInfo[0] == 'deleteStudent') {
    deleteStudent()
}
