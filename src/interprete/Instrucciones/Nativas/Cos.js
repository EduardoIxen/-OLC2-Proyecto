class Cos extends Instruction{
    
    constructor(id, parameters, instr, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
        this.instr = instr;
        this.type = null;
    }

    interpretar(tree, table){
        var symbol = table.getTabla("01-Native-Cos");
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }

        if(symbol.getType() != Tipo.ENTERO && symbol.getType() != Tipo.DECIMAL){
            return new Exception("Semantico", `Tipo de dato de Cos no es un valor.`, symbol.getRow(), symbol.getColumn());
        }
        this.type = symbol.getType();
        return Math.cos(symbol.getValue());
    }
}