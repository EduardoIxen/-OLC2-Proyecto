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
        consola += 'double heap[23111998];\n'
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
        console.log(consola)
        return consola;
    }


}