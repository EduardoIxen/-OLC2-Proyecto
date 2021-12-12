class Pow extends Instruction{
    
    constructor(id, parameters, instructions, row, column){
        super(row, column);
        this.id = id;
        this.type = null;
        this.parameters = parameters;
        this.instructions = instructions;
    }

    interpretar(tree, table){
        var base = table.getTabla("06-Native-Pow");
        var exponent = table.getTabla("07-Native-Pow");

        if(base == null || exponent == null){
            return new Exception("Semantico", `La variable (${this.id}) no existe`, this.row, this.column);
        }

        if((base.getType() != Tipo.ENTERO && base.getType() != Tipo.DECIMAL) || (exponent.getType() != Tipo.ENTERO && exponent.getType() != Tipo.DECIMAL)){
            return new Exception("Semantico", `Tipo de dato de Pow no es un valor.`, base.getRow(), base.getColumn());
        }
        if(base.getType() == Tipo.ENTERO && exponent.getType() == Tipo.ENTERO){
            this.type = Tipo.ENTERO;
        }else if(base.getType() == Tipo.ENTERO && exponent.getType() == Tipo.DECIMAL){
            this.type = Tipo.DECIMAL;
        }else if(base.getType() == Tipo.DECIMAL && exponent.getType() == Tipo.ENTERO){
            this.type = Tipo.DECIMAL;
        }else if(base.getType() == Tipo.DECIMAL && exponent.getType() == Tipo.DECIMAL){
            this.type = Tipo.DECIMAL;
        }
        
        return Math.pow(base.getValue(), exponent.getValue());
    }
}