//variaveis globais
let numeroInput = document.getElementById('numero');
let baseOutput = document.getElementById('base');
let baseInput = document.getElementById('baseOri');
let calcularBtn = document.getElementById('calcular');
let resetBtn = document.getElementById('reset');
let resultadoSpan = document.getElementById('resultado');
let calculoContainer = document.querySelector('.calculos_container');
let tituloResultado = document.getElementById('titulo_resultado');
//Idenfificação das bases
function identificarBase(b) {
    let baseNome;
    switch (b) {
        case 2:
            baseNome = 'Binária';
            break;  
        case 8:
            baseNome = 'Octal';
            break;
        case 10:
            baseNome = 'Decimal';
            break;
        case 16:
            baseNome = 'Hexadecimal';
            break;
    }
    return baseNome;
}
//coversão de negativos em complemento a dois

function convertirNegativo(num, base, bits = 8) {
    if (base < 2 || base > 36) {
        throw new Error("La base debe estar entre 2 y 36");
    }

    // Si la base NO es binario → conversión normal
    if (base !== 2) {
        return num >= 0
            ? num.toString(base)
            : "-" + Math.abs(num).toString(base);
    }

    // Si es binario y NO es negativo → binario normal con padding
    if (num >= 0) {
        return num.toString(2).padStart(bits, "0");
    }

    // -------- COMPLEMENTO A DOS PARA NEGATIVOS --------
    const min = -(2 ** (bits - 1));
    const max = 2 ** (bits - 1) - 1;
    if (num < min || num > max) {
        throw new Error(`El número ${num} no cabe en ${bits} bits`);
    }

    // Valor absoluto en binario con padding
    let bin = Math.abs(num).toString(2).padStart(bits, "0");

    // Invertir bits
    let inverted = bin
    .split("")
    .map(b => (b === "0" ? "1" : "0"))
    .join("");

    // Sumar 1
    let twos = (parseInt(inverted, 2) + 1).toString(2);

    // Asegurar longitud exacta
    return twos.padStart(bits, "0").slice(-bits);
    }

//convertendo para base decimal
function baseDez(num, bInput) {
    let num2 = 0;
    let i = 0;
    let n;
    if (bInput < 10){
        num = parseInt(num);
        while (num > 0) {
            n = num%10
            num2 = num2 + n * (bInput ** i);
            num = Math.floor(num / 10);
            i++;
        }
        console.log(num2);
        return num2;
    }   else if (bInput == 16){
            num = num.toString();
            let len = num.length;
            for (let j = 0; j < len; j++) {
                let n;
                let char = num[len - 1 - j];
                switch (char.toUpperCase()) {
                    case 'A': n = 10; break;
                    case 'B': n = 11; break;
                    case 'C': n = 12; break;
                    case 'D': n = 13; break;
                    case 'E': n = 14; break;
                    case 'F': n = 15; break;
                    default: n = parseInt(char); break;
                }
                num2 = num2 + n * (bInput ** j);
            }
            return num2;
    }
};
//convertendo de base decimal para outra base
function converBase (num, bOutput, bInput) {
    let resultado = '';
//convertendo para decimal se a base de input não for decimal    
    if (bInput != 10){
        if(num[0] === '-') {
            num = parseInt(num, bInput);
        }else{
            num = baseDez(num, bInput);
        }
    }
    else if (num[0] === '-') {
        num = parseInt(num, baseInput);
    }
    else {
        num = parseInt(num);
    }
    //se o numero for 0 na base decimal o resultado é 0 em qualquer base
    if (num === 0) {
        resultado = '0';
        return resultado;
    }
    //convertendo numero negativo
    else if (num < 0) {
        resultado = convertirNegativo(num, bOutput);
    } 
    //convertendo numero positivo
    else {
        while (num > 0) {
            let resto = num % bOutput;
            num = Math.floor(num / bOutput);
            
            let char;
            if (resto >= 10) {
                char = String.fromCharCode('A'.charCodeAt(0) + resto - 10);
            } else {
                char = resto.toString();
            }
            resultado = char + resultado; 
        }
    }
        
    let baseNome = identificarBase(bOutput);
    console.log(`Resultado: ${resultado} na base ${baseNome}`);
    tituloResultado.textContent = `Resultado na base ${baseNome}:`;
    resultadoSpan.textContent = `${resultado}`;
};
//resetar campos
function resetFields() {
    numeroInput.value = '';
    baseOutput.value = '2'; 
    baseInput.value = '10';
    resultadoSpan.textContent = '';
    calculoContainer.style.display = 'none';
}


//Interações com o DOM
resetBtn.addEventListener('click', resetFields);
calcularBtn.addEventListener('click', function() {
    let numero = numeroInput.value;
    let bOutput = parseInt(baseOutput.value);
    let bInput = parseInt(baseInput.value);
    converBase(numero, bOutput, bInput);
    calculoContainer.style.display = 'flex';
});

