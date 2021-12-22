class Identificador extends Instruction {
    constructor(identificador, row, column) {
        super(row, column);
        this.identificador = identificador;
        this.type = null;
    }

    interpretar(tree, table) {
        var simbolo = table.getTabla(this.identificador);  //recuperar el simbolo del id
        if (simbolo == null){
            return new Exception("Semantico", `Variable ${this.identificador} no encontrada`, this.row, this.column);
        }
        this.type = simbolo.getType();
        
        return simbolo.getValue(); //retornar el valor del simbolo

    }

    getNodo(){
        var nodo = new NodoAST("IDENTIFICADOR");
        nodo.agregarHijo(this.identificador.toString());
        return nodo;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `Variable ${this.identificador} no encontrada.`, this.row, this.column);
        }
        var temp = gen.newTemp();
        this.type = symbol.getType();
        tree.updateConsola(`\t/********** Identificador **********/\n`);
        tree.updateConsola(gen.getStack(temp, symbol.posGlobal))
        tree.updateConsola(`\t/******* Fin de Declaración ********/\n\n`);
        var result = new C3D(temp, this.type, true);
        result.posGlobal = symbol.posGlobal;

        return result;



    }
}