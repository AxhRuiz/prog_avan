const persona1= {
    nombre: `Axel`,
    edad: 28,
    Ciudad: `Concepcion del Uruguay`
}
const persona2= {
    apellido: "Pérez",
    profesion: "Ingeniero",
    telefono: "666111222"
}

console.log(persona1)
console.log(persona2)

const personaCombinada= Object.assign({}, persona1, persona2)

console.log(personaCombinada)