const factorial = (n) =>{
    if(n==0 || n ==1){
        return 1
    }
    return n* factorial(n-1)
}
console.log(`El factorial de 5 es: ${factorial(5)}`);
console.log(`El factorial de 9 es: ${factorial(6)}`);
console.log(`El factorial de 16 es: ${factorial(8)}`); 