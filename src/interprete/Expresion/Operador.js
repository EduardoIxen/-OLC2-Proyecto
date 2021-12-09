class Operador extends Instruction{
    constructor(exp_left, exp_right, operator, row, column){
        super(row, column)
        this.exp_left = exp_left;
        this.exp_right = exp_right;
        this.operator = operator;
        this.type = Tipo.STRING;
    }

    interpretar(tree, table){
        var left = this.exp_left.interpretar(tree, table);
        if (left instanceof Exception){
            return left;
        }
        if (this.exp_right != null) {
            var right = this.exp_right.interpretar(tree, table);
            if (right instanceof Exception) {
                return right;
            }
        }

        if (this.operator == Operador_Cadena.CONCATENACION) {
            if (this.exp_left.type == Tipo.CARACTER) {
                left = left.slice(1,-1);
            }else if (this.exp_right.type == Tipo.CARACTER) {
                right = right.slice(1,-1)
            }
            return left.toString() + right.toString();
        } else if (this.operator == Operador_Cadena.REPETICION) {
            if (this.exp_left.type == Tipo.STRING && (this.exp_right.type == Tipo.ENTERO || this.exp_right.type == Tipo.DECIMAL)) {
                if (right >= 0 ) {
                    return left.repeat(right);
                }
                return new Exception("Error semantico","El numero de veces a repetir debe ser > 0.",this.row,this.column);
                
            }
            return Exception("Error Semantico", "La repeticion debe seguir el formato \"string^numero\".", this.row, this.column);
        }
    }
}