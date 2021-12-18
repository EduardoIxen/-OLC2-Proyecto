class Generator{

    constructor(){
        /**** TEMPORALES ****/
        this.temp = [];     // t0, t1, t2, t3, ... ,tn
        this.countTemp = 0; 
        /**** ETIQUETAS ****/
        this.label = [];   // L0, L1, L2, L3, ... ,tn
        this.countLabel = 0;
    }

    newTemp(){
        this.temp.push(`t${this.countTemp}`) // t0 t1 t2
        var temp  = `t${this.countTemp}`;   // t0  t1 t2
        this.countTemp ++;                  // 1   2  3
        return temp;
    }

    getTemp(){
        return `t${this.countTemp}`;    // t3
    }

    newLabel(){
        this.label.push(`L${this.countLabel}`) // L0
        var label = `L${this.countLabel}`;  // L0
        this.countLabel ++;                 // 1
        return label;
    }

    getLabel(){
        return `L${this.countLabel}`;
    }

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

    setPrintf(op, type, expression, cond){    // si la cond es true, es un slto de linea.
        var conca = `\tprintf(\"%${op}\", (${type})${expression});\n`;
        if(cond == true){                                       
            conca +=  `\tprintf(\"%c\", (char)10);\n` // salto de linea
        }
        return conca;
    }

    setArithmetic(temp, left, op, right){
        var conca = '';
        if(op == '%'){
            conca = `\t${temp} = fmod(${left},${right});`;
        
        }else{
            conca = `\t${temp} = ${left} ${op} ${right};`;
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

    // getAnd()

}