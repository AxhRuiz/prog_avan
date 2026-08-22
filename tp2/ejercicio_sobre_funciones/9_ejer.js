const crearMultiplicador= (n) => {
    return function(m){
        return n*m
    }
}

const multiplicarPorDos = crearMultiplicador(2);
console.log(multiplicarPorDos(6));

const multiplicarPorTres = crearMultiplicador(3);
console.log(multiplicarPorTres(15));

const multiplicarPorCuatro = crearMultiplicador(4);
console.log(multiplicarPorCuatro(2));