class Pop extends Instruction{
    constructor(identificador, row, column){
        super(row, column);
        this.identificador = identificador;
        this.type = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.identificador);
        if (symbol == null) {
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }
        var resutl = null;
        try {
            if (symbol.typeArray == Tipo.ARRAY || symbol.type == Tipo.ARRAY) {
                if (symbol.getValue().list_value.length > 0) {
                    resutl = symbol.getValue().list_value.pop();
                }else{
                    return new Exception("Semantico", "Arreglo vacío.", this.row, this.column);
                }
            }
        } catch (error) {
            return new Exception("Semantico", "Error al realizar la funcion nativa pop()", this.row, this.column);
        }
        this.type = resutl.type;
        var nuevo = resutl.interpretar(tree,table);
        return resutl.value;

    }
}