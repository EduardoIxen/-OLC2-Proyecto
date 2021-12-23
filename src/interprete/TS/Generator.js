class Generator{

    constructor(){
        /**** TEMPORALES ****/
        this.temp = [];     // t0, t1, t2, t3, ... ,tn
        this.countTemp = 0; 
        /**** ETIQUETAS ****/
        this.label = [];   // L0, L1, L2, L3, ... ,tn
        this.countLabel = 0;
        /**** NATIVES ****/
        this.native = '';
        /**** STACK ****/
        this.stack = [];
        this.countStack = 0;
        /**** HEAP ****/
        this.heap = [];
        this.countHeap = 0;
        /**** EXCEPTION ****/
        this.exception = [];
        
    }
/************************************************* TEMPORALES *************************************************/                        
    newTemp(){
        this.temp.push(`t${this.countTemp}`) // t0 t1 t2
        var temp  = `t${this.countTemp}`;   // t0  t1 t2
        this.countTemp ++;                  // 1   2  3
        return temp;
    }

    getTemp(){
        return `t${this.countTemp}`;    // t3
    }

    onlyTemp(temp, salida){
        return `\t${temp} = ${salida};\n`;
    }

/************************************************* ETIQUETAS *************************************************/
    newLabel(){
        this.label.push(`L${this.countLabel}`) // L0
        var label = `L${this.countLabel}`;  // L0
        this.countLabel ++;                 // 1
        return label;
    }

    getLabel(){
        return `L${this.countLabel}`;
    }

/************************************************* HEAP *************************************************/
    newHeap(){  // H = H + 1;
        this.countHeap ++;
        return `\tH = H + 1;\n`.toString();
    }

    setHeap(ascii){ // heap[int(H)] = ASCII;
        return `\theap[(int)H] = ${ascii};\n`;
    }

/************************************************* STACK *************************************************/
    newStack(){
        this.countStack ++;
        return `\tP = P + 1;\n`.toString();
    }
    resetStack(reset){
        this.countStack = this.countStack - parseInt(reset);
        return `\tP = P - ${reset};\n`.toString();
    }

    setStack(temp, H){
        return `\tstack[(int)${temp}] = ${H};\n`;
    }

    getStack(temp, pos){
        return `\t${temp} = stack[(int)${pos}];\n`
    }

/************************************************* HEADER *************************************************/
    getHeader(){
        var consola = '/*******HEADER********/\n';
        consola += '#include <stdio.h>\n';
        consola += '#include <math.h>\n';
        consola += '\n'
        consola += 'double heap[18031999];\n'
        consola += 'double stack[18031999];\n'
        consola += 'double P;\n';
        consola += 'double H;\n';
        consola += 'double ';
        var i = 0;
        while(i<=this.countTemp){
            if(i==this.countTemp){
                consola += `t${i};\n`;
            }else{
                consola += `t${i},`;
            }
            i++;
        }

        consola += '\n';
        return consola;
    }
/************************************************* NATIVAS *************************************************/
    getNative(){
        return this.native.toString();
    }
    setNative(conca){
        this.native = this.native.toString() + conca.toString();
    }

/************************************************* PRINTF *************************************************/ 
    getPrintfString(){

        var temp = this.newTemp(); // t0
        var EV = this.newLabel();
        var EF = this.newLabel();
        var conca = '\n/************ NATIVE PRINTF STRING ************/\n';
        conca += 'void printfString(){\n'
        conca += this.setArithmetic(temp,'P','+','1');
        var auxTemp = temp; // t1
        temp = this.newTemp();
        conca += `\t${temp} = stack[(int)${auxTemp}];\n`; // t1 = stack[int(t0)]
        conca += this.addLabel(EF);
        var auxTemp = temp; // t1
        temp = this.newTemp();        // t2
        conca += `\t${temp} = heap[(int)${auxTemp}];\n`;
        conca += `\tif(${temp} == -1) goto ${EV};\n`;
        conca += this.setPrintf('c', 'int',temp, false);
        conca += this.setArithmetic(auxTemp, auxTemp, '+', '1');
        conca += this.addGoto(EF);
        conca += this.addLabel(EV);
        conca += `\treturn;\n}\n`

        return conca;
    }

    getNativeCompareString(){
        var conca = '\n/************ NATIVE COMPARE STRING ************/\n';
        conca += 'void nativeCompareString(){\n'
        var temp = this.newTemp();
        var EV1 = this.newLabel(); // L2
        var EF1 = this.newLabel(); // L3
        var EV2 = this.newLabel(); // L4
        var EF2 = this.newLabel(); // L5

        conca += this.setArithmetic(temp, 'P', '+', '1'); // t8 = P+1;
        var auxTemp = temp; // t8
        temp = this.newTemp(); // t9
        var auxTemp1 = temp;
        conca += `\t${temp} = stack[(int)${auxTemp}];\n`    // t9 = stack[(int)t8];
        conca += this.setArithmetic(auxTemp, auxTemp, '+', '1');   // t8 = t8+1;
        conca += `\t${this.getTemp()} = stack[(int)${auxTemp}];\n`;    // t10 = stack[(int)t8];
        auxTemp = temp; // t9
        temp = this.newTemp(); // t10
        var auxTemp2 = temp;
        conca += this.addLabel(EF1);    // L3:
        conca += `\t${this.getTemp()} = heap[(int)${auxTemp}];\n`;    // t11 = heap[(int)t9];
        auxTemp = temp; // t10
        temp = this.newTemp(); // t11
        conca += `\t${this.getTemp()} = heap[(int)${auxTemp}];\n`    // t12 = heap[(int)t10];
        auxTemp = temp; // t11
        temp = this.newTemp(); // 12
        conca += `\tif(${auxTemp} != ${temp}) goto ${EF2};\n`    // if(t11 != t12) goto L5;
        conca += `\tif(${auxTemp} == -1) goto ${EV2};\n`    // if(t11 == -1) goto L4;
        conca += this.setArithmetic(auxTemp1, auxTemp1, '+', '1'); // t9 = t9+1;
        conca += this.setArithmetic(auxTemp2, auxTemp2, '+', '1');   // t10 = t10+1;
        conca += this.addGoto(EF1);    // goto L3;
        conca += this.addLabel(EV2);    //    L4:
        conca += `\tstack[(int)P] = 1;\n`   // stack[(int)P] = 1;
        conca += this.addGoto(EV1); // goto L2;
        conca += this.addLabel(EF2);    // L5:
        conca += `\tstack[(int)P] = 0;\n`    // stack[(int)P] = 0;
        conca += this.addLabel(EV1);    // L2:
        conca += '\treturn;\n}\n'    // return;
        
        return conca;
    }

    setPrintf(op, type, expression, cond){    // si la cond es true, es un slto de linea.
        var conca = `\tprintf(\"%${op}\", (${type})${expression});\n`;
        if(cond){
            conca += this.newLine(cond);
        }
        return conca;
    }
/************************************************* SALTO DE LINEA *************************************************/ 

    newLine(cond){
        var conca = '';
        if(cond){
            conca +=  `\tprintf(\"%c\", (char)10);\n` // salto de linea
        }else{
            conca += '/********** SIN SALTO DE LINEA ***********/'
        }
        return conca;
    }

/************************************************* EXPRESSION *************************************************/ 
    setArithmetic(temp, left, op, right){
        var conca = '';
        if(op == '%'){
            conca = `\t${temp} = fmod(${left},${right});\n`;
        
        }else{
            conca = `\t${temp} = ${left} ${op} ${right};\n`;
        }

        return conca;
    }

    getBoolean(EV, EF, label, newLabel, temp){
        var conca = '';
        conca += `\n\tgoto ${label};\n`;
        conca += `\t${EV}:\n`;
        conca += `\t\t${temp} = 1;\n`
        conca += `\t\tgoto ${newLabel};\n`
        conca += `\t${EF}:\n`;
        conca += `\t\t${temp} = 0;\n`
        conca += `\t${newLabel}:\n`;
        return conca.toString();
    }

    setBoolean(EV, EF, label, newLabel, cond){
        var conca = '';
        if(label != null){
            conca += `\n\tgoto ${label};`;
        }
        conca += `\n\t${EV}:\n`;
        conca += `\t\tprintf("%c", (char)116);\n`;
        conca += `\t\tprintf("%c", (char)114);\n`;
        conca += `\t\tprintf("%c", (char)117);\n`;
        conca += `\t\tprintf("%c", (char)101);\n`;
        conca += `\t\tgoto ${newLabel};\n`;
        conca += `\t${EF}:\n`
        conca += `\t\tprintf("%c", (char)102);\n`;
        conca += `\t\tprintf("%c", (char)97);\n`;
        conca += `\t\tprintf("%c", (char)108);\n`;
        conca += `\t\tprintf("%c", (char)115);\n`;
        conca += `\t\tprintf("%c", (char)101);\n`;
        conca += `\t${newLabel}:\n`;
        if(cond == true){
            conca += `\tprintf(\"%c\", (char)10);\n` // salto de linea
        }
        return conca;

    }
    
    addGoto(label){
        var conca = `\tgoto ${label};\n`
        return conca;
    }
    addLabel(label){
        var conca = `\t${label}:\n`;
        return conca;
    }
    /******
     * IF *
    *******/
    getIf(left, op, right, EV, EF){
        var conca = '';
        conca += `\n\tif(${left} ${op} ${right}) goto ${EV}; \n`
        conca += `\tgoto ${EF};\n`
        return conca;
    }

    onlyIf(left, op, right, EV){
        var conca = '';
        conca += `\n\tif(${left} ${op} ${right}) goto ${EV};\n`
        return conca;
    }

    /*************
     * Exception *
    **************/
    setException(exception){
        this.exception.push(exception);
    }
    getException(){ return this.exception; }
}