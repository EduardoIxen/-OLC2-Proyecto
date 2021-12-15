class Main extends Instruction{
    constructor(instructions, row, column){
        super(row, column);
        this.instructions = instructions;
        this.table = null;
        this.identificador = "Main";
    }

    interpretar(tree, table){
        this.table = table;
        var newTable = new TablaSimbolo(table);
        for(var instr of this.instructions){ //RECORRER TODAS LAS INSTRUCCIONES QUE TIENE DENTRO
            try {
                var value = instr.interpretar(tree, newTable);
            
                if (value instanceof Exception) {
                    tree.getException().push(value);
                    tree.updateConsola(value.toString());
                }
                if (value instanceof Break) {
                    var err = new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", instr.row, instr.column);
                    tree.getException().push(err);
                    tree.updateConsola(err.toString());
                }
                if (value instanceof Continue) {
                    var err = new Exception("Semantico", "Sentencia Continue fuera de ciclo.", instr.row, instr.column);
                    tree.getException().push(err);
                    tree.updateConsola(err.toString());
                }
            } catch (error) {
                console.log(`Sintáctico - (${this.row}, ${this.column})`)
            }
           
        }
    }

    getNodo(){
        var nodo = new NodoAST("MAIN");
        var instrucciones = new NodoAST("INSTRUCCIONES");
        for (var instr of this.instructions) {
            try {
                instrucciones.agregarHijoNodo(instr.getNodo());   
            } catch (error) {
                console.log(`Sintáctico - (${this.row}, ${this.column})`)
            }
        }
        nodo.agregarHijoNodo(instrucciones);
        return nodo;
    }
}