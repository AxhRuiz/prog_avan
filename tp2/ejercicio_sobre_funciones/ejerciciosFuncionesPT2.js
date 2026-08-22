
console.log("------Ejercicio 1------");
async function obtenerUsuarios() {
    try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
        const usuarios = await respuesta.json();
        return usuarios; 
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

const usuarios = await obtenerUsuarios();
console.log(usuarios);
console.log(`usuarios: ${usuarios.length}`)


console.log("\n------Ejercicio 2------");
async function imprimirNombresDeUsuarios() {
    const usuarios = await obtenerUsuarios();
    const nombres = usuarios.map(usuario => usuario.name);
    
    console.log("nombres de usuarios:");
    nombres.forEach((nombre, index) => {
        console.log(`${index + 1}. ${nombre}`);
    });
    
    console.log(`\nTotal de usuarios: ${nombres.length}`);
}

await imprimirNombresDeUsuarios();



console.log("\n------Ejercicio 3------");
const usuarioPredefinido = {
    usuario: "Admin",
    contraseña: "1234"
}

function autenticarUsuario(credenciales) {
    if (credenciales.usuario === usuarioPredefinido.usuario && credenciales.contraseña === usuarioPredefinido.contraseña) {
        console.log("Autenticación exitosa.");
        return true;
    } else {
        console.log("Credenciales incorrectas.");
        return false;
    }
}

const credencialesCorrectas = { usuario: "Admin", contraseña: "1234" };
const credencialesIncorrectas = { usuario: "Admin", contraseña: "wrong" };

console.log("Probando con credenciales correctas:");
console.log("Admin:1234 ->", autenticarUsuario(credencialesCorrectas));
console.log("Probando con credenciales incorrectas:");
console.log("Admin:wrong ->", autenticarUsuario(credencialesIncorrectas));  


console.log("\n------Ejercicio 4------");

function mapearUsuarios(usuarios) {
    return usuarios.map(usuario => ({
        nombre: usuario.name,
        email: usuario.email
    }));
}

async function ejecutar() { 
    const usuarios = await obtenerUsuarios();
    const usuariosMapeados = mapearUsuarios(usuarios);
    console.log("ESTE ES EL EJERCICIO 4")
    console.log("Usuarios mapeados (solo nombre y email):");
    usuariosMapeados.forEach((usuario, index) => {
        console.log(`${index + 1}. ${usuario.nombre} → ${usuario.email}`);
    });
    
    console.log(`\nTotal: ${usuariosMapeados.length} usuarios`);
}
ejecutar();


console.log("\n------Ejercicio 5------")
function validarFormulario(datos) {
    if (datos.nombre && datos.email && datos.password) {
        return true;
    }
    return false;
}

const formulario1 = {
    nombre: "Juan Pérez",
    email: "juan@email.com",
    password: "123456"
};
console.log("Formulario 1:", validarFormulario(formulario1));

const formulario2 = {
    nombre: "Juan Pérez",
    email: "juan@email.com"
};
console.log("Formulario 2:", validarFormulario(formulario2)); 

const formulario3 = {
    nombre: "",
    email: "juan@email.com",
    password: "123456"
};
console.log("Formulario 3:", validarFormulario(formulario3)); 

const formulario4 = {
    nombre: "",
    email: "",
    password: ""
};
console.log("Formulario 4:", validarFormulario(formulario4));



console.log("\n------ejercicio 6------")
function obtenerPagina(datos, numeroPagina) {
    const elementosPorPagina = 5;
    const inicio = (numeroPagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    
    return datos.slice(inicio, fin);
}

function mostrarPagina(usuarios, pagina, totalPaginas) {
    console.log("\n")
    console.log(`PÁGINA ${pagina} DE ${totalPaginas}`);
    usuarios.forEach((usuario, index) => {
        const num = String((pagina - 1) * 5 + index + 1).padStart(2);
        const nombre = usuario.name.padEnd(25);
        const email = usuario.email.padEnd(26);
        console.log(` ${num} ${nombre} ${email}`);
    });
    
}

async function main() {
    console.log("\n")
    console.log("OBTENIENDO USUARIOS");
    const usuarios = await obtenerUsuarios();
    
    console.log(`Total de usuarios: ${usuarios.length}`);
    console.log(`Elementos por página: 5`);
    
    const elementosPorPagina = 5;
    const totalPaginas = Math.ceil(usuarios.length / elementosPorPagina);
    console.log(`Total de páginas: ${totalPaginas}\n`);
    
    for (let i = 1; i <= totalPaginas; i++) {
        const paginaUsuarios = obtenerPagina(usuarios, i);
        mostrarPagina(paginaUsuarios, i, totalPaginas);
    }
}
main();


console.log("------Ejercicio 7------")

async function enviarDatos(data) {
    try {
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const respuestaJSON = await respuesta.json();
        
        console.log("DATOS ENVIADOS:");
        console.log(data);
        console.log("\nRESPUESTA DE LA API:");
        console.log(respuestaJSON);
        console.log(`\nCódigo de estado: ${respuesta.status}`);
        
        return respuestaJSON;
    } catch (error) {
        console.log('Error al enviar datos:', error);
        return null;
    }
}

async function probarEnvio() {
    console.log("\n");
    console.log("Envio de datos")
    
    const nuevoPost = {
        title: 'Mi primer post desde JavaScript',
        body: 'Este es el contenido de mi post. Aprendiendo a usar fetch con POST.',
        userId: 1
    };
    
    await enviarDatos(nuevoPost);
}
probarEnvio();


console.log("\n------Ejercicio 8------")
function buscarUsuarioPorEmail(usuarios, email) {
    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email);

    if (!usuarioEncontrado) {
        console.log(`No se encontró ningún usuario con el email: ${email}`);
        return null;
    }
    
    return usuarioEncontrado;
}

async function buscar() {
    console.log("\n")
    console.log("BUSCAR USUARIO POR EMAIL");
    
    console.log("Obteniendo usuarios de la API");
    const usuarios = await obtenerUsuarios();
    console.log(`Usuarios obtenidos: ${usuarios.length}\n`);
    
    const emailBuscado = "Sincere@april.biz";
    console.log(`Buscando usuario con email: "${emailBuscado}"`);
    
    const usuario = buscarUsuarioPorEmail(usuarios, emailBuscado);
    
    if (usuario) {
        console.log("\n");
        console.log("Usuario encontrado:");
        console.log(`   ID: ${usuario.id}`);
        console.log(`   Nombre: ${usuario.name}`);
        console.log(`   Username: ${usuario.username}`);
        console.log(`   Email: ${usuario.email}`);
        console.log(`   Ciudad: ${usuario.address.city}`);
        console.log(`   Teléfono: ${usuario.phone}`);
        console.log(`   Empresa: ${usuario.company.name}`);
    }
}

buscar();


console.log("\n------Ejercicio 9------")
function generarToken(usuario) {

    const header = {
        alg: "HS256",
        typ: "JWT"
    };
 
    const payload = {
        id: usuario.id,
        nombre: usuario.name,
        email: usuario.email,
        username: usuario.username,
        ciudad: usuario.address.city,
        empresa: usuario.company.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 
    };
    

    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    
    const signature = btoa("mi-clave-secreta-para-jwt");
    return `${headerBase64}.${payloadBase64}.${signature}`;
}

function decodificarToken(token) {
    try {
        const partes = token.split('.');
        if (partes.length !== 3) {
            throw new Error("Token inválido");
        }
        
        const header = JSON.parse(atob(partes[0]));
        const payload = JSON.parse(atob(partes[1]));
        const signature = partes[2];
        
        return { header, payload, signature };
    } catch (error) {
        console.error("Error al decodificar token:", error.message);
        return null;
    }
}


async function generar() {
    console.log("=== GENERAR TOKEN CON DATOS DE LA API ===\n");
    
    console.log("Obteniendo usuarios de la API...");
    const usuarios = await obtenerUsuarios();
    console.log(` Usuarios obtenidos: ${usuarios.length}\n`);
    

    const usuario = usuarios[0];
    console.log("Usuario seleccionado:");
    console.log(`   ID: ${usuario.id}`);
    console.log(`   Nombre: ${usuario.name}`);
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Username: ${usuario.username}`);
    console.log(`   Ciudad: ${usuario.address.city}`);
    
    console.log("\n")
    console.log("Generando token...");
    const token = generarToken(usuario);
    
    console.log("\n")
    console.log("TOKEN JWT GENERADO:");
    console.log(token);
    
    console.log("\n")
    console.log("DECODIFICANDO TOKEN:");
    const tokenDecodificado = decodificarToken(token);
    
    if (tokenDecodificado) {
        console.log("   Header:", tokenDecodificado.header);
        console.log("   Payload:", tokenDecodificado.payload);
        console.log("   Signature:", tokenDecodificado.signature);
    }
}

generar();