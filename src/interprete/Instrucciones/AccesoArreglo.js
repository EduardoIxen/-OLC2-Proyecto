class AccesoArreglo extends Instruction{
    constructor(id, expresion, row, column){
        super(row, column);
        this.id = id;
        this.expresion = expresion;
        this.type = null;
        this.type_init = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.id);
        if (symbol == null) {
            return new Exception("Semantico", "Variable "+this.id+" no encontrada.", this.row, this.column);
        }

        this.type = symbol.type;
        console.log("simvhol",symbol);
        if (symbol.getType() != Tipo.ARRAY) {
            return new Exception("Semantico", "Variable " + this.id + " no es un arreglo.", this.row, this.column);
        }

        console.log("toodo",symbol.getValue().list_value)  //retorna lista de valores
        var num = this.expresion.interpretar(tree, table);
        console.log("bueno", symbol.getValue().list_value[num])
        return symbol.getValue().list_value[num]

    }
}