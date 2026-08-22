const estudiante= {
    nombre: "Axel",
    edad: 28,
    direccion: {
        calle: "Falsa",
        ciudad: "Springfield",
        pais: "Argentina"
    }
}

const jsonString= JSON.stringify(estudiante)

const newEstudiante= JSON.parse(jsonString)

console.log(`------Se imprime por consola la copia del estudiante------`)

console.log(newEstudiante)

delete newEstudiante.edad

console.log(`------Se elimina de la copia la propiedad edad------`)

console.log(newEstudiante)

console.log(`------Se imprime por consola el estudiante original para verificar que no haya sufrido cambios------`)

console.log(estudiante)