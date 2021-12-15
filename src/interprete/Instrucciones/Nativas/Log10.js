class Log10 extends Instruction{
    
    constructor(id, parameters, instructions, row, column){
        super(row, column);
        this.id = id;
        this.type = null;
        this.parameters = parameters;
        this.instructions = instructions;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("04-Native-Log10");
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.ENTERO && symbol.getType() != Tipo.DECIMAL){
            return new Exception("Semantico", `Tipo de dato de Log10 no es un valor.`, symbol.getRow(), symbol.getColumn());
        }
        this.type = symbol.getType();
        return Math.log10(symbol.getValue());
    }

    getNodo(){
        var nodo = new NodoAST("LOG10");
        var nodoDato = new NodoAST(this.symbol.getType());
        nodoDato.agregarHijo(symbol.getValue());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}