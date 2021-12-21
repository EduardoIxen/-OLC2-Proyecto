class ToLowerCase extends Instruction{

    constructor(identificador, row, column){
        super(row, column);
        this.identificador = identificador;
        this.type = null;
        this.symbol = null;

    }

    interpretar(tree, table){
        console.log("id",this.identificador);
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.STRING){
            return new Exception("Semantico", "Tipo de dato de toLowerCase no es Tipo String", this.row, this.column);
        }

        this.type = symbol.getType();
        symbol.setValue(symbol.getValue().toLowerCase())
        var result = table.updateTabla(symbol)
        this.symbol = symbol;
        return symbol.getValue();
    }

    getNodo(){
        var nodo = new NodoAST("TO-LOWERCASE");
        var nodoDato = new NodoAST(this.type);
        nodoDato.agregarHijo(this.symbol.getValue().toString());
        nodo.agregarHijoNodo(nodoDato)
        return nodo;
    }
}