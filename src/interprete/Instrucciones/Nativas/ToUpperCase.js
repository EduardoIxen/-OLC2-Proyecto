class ToUpperCase extends Instruction{

    constructor(identificador, row, column){
        super(row, column);
        this.identificador = identificador;
        this.type = null;

    }

    interpretar(tree, table){
        var symbol = table.getTabla(this.identificador);
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.STRING){
            return new Exception("Semantico", "Tipo de dato de toUpperCase no es Tipo String", this.row, this.column);
        }

        this.type = symbol.getType();
        symbol.setValue(symbol.getValue().toUpperCase())
        var result = table.updateTabla(symbol)
        
        return symbol.getValue();
    }
}