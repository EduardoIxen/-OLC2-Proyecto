class Sin extends Instruction{
    
    constructor(id, parameters, instructions, row, column){
        super(row, column);
        this.id = id;
        this.type = null;
        this.parameters = parameters;
        this.instructions = instructions;
        this.value = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("02-Native-Sin");
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.ENTERO && symbol.getType() != Tipo.DECIMAL){
            return new Exception("Semantico", `Tipo de dato de Sin no es un valor.`, symbol.getRow(), symbol.getColumn());
        }
        this.type = symbol.getType();
        this.value = symbol.getValue();
        return Math.sin(symbol.getValue());
    }

    getNodo(){
        var nodo = new NodoAST("SIN");
        nodo.agregarHijo(this.value.toString());
        return nodo;
    }
}