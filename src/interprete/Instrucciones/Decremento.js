class Decremento extends Instruction{

    constructor(identificador, jump, row, column){
        super(row, column);
        this.identificador = identificador;
        this.jump = jump;
    }

    interpretar(tree, table){

        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return null;
            // return new Exception("Semantico", `No existe ese ${this.identificador}`, this.row, this.column);
        }

        if(symbol.type == Tipo.ENTERO){
            symbol.value = parseInt(symbol.value) - 1;

        }else if(symbol.type == Tipo.DECIMAL){
            symbol.value = parseFloat(symbol.value) - 1;
        }else{
            return new Exception("Semantico", "Error de tipo de dato.", this.row, this.column);
        }

        var result = table.updateTabla(symbol);
        if(result instanceof Exception) return result;
        if(this.jump == true){
            return parseInt(symbol.value) + 1;
        }else{
            return parseInt(symbol.value);
        }
    }

}