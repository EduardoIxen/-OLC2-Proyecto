class ConvertString extends Instruction{
    
    constructor(id, parameters, instructions, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
        this.instructions = instructions;
        this.type = Tipo.STRING;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("08-Native-String");
        
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }

        if(symbol.getType() == Tipo.NULO){
            return new Exception("Semantico", `Tipo de dato de String no se puede convertir a Nulo.`, symbol.getRow(), symbol.getColumn());
        }

        return symbol.getValue().toString();
    }

    getNodo(){
        var nodo = new NodoAST("TO-STRING");
        var nodoDato = new NodoAST(this.symbol.getType());
        nodoDato.agregarHijo(this.symbol.getValue());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}