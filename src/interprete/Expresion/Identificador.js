class Identificador extends Instruction {
    constructor(identificador, row, column) {
        super(row, column);
        this.identificador = identificador;
        self.type = null;
    }

    interpretar(tree, table) {
        console.log(this.identificador)
        var simbolo = table.getTabla(this.identificador.toLowerCase());  //recuperar el simbolo del id

        if (simbolo == null)
            return new Exception("Semantico", `Variable ${this.identificador} no encontrada`, this.row, this.column);
        
        this.type = simbolo.getType();
        return simbolo.getValue() //retornar el valor del simbolo

    }
}