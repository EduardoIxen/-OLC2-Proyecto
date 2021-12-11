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
}