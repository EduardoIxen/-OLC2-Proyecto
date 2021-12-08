class Logica extends Instruction{
    constructor(exp_left, exp_right, operator, row, column){
        super(row, column)
        this.exp_left = exp_left;
        this.exp_right = exp_right;
        this.operator = operator;
        this.type = Tipo.BOOLEANO;
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

        if (this.operator == Operador_Logico.AND) {
            if (this.exp_left.type == Tipo.BOOLEANO && this.exp_right.type == Tipo.BOOLEANO) {
                return this.casteo(this.exp_left.type, left) && this.casteo(this.exp_right.type, right);
            }
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: Error al realizar la operacion"+left.toString()+" "+this.exp_left.type + "&&" + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);
        } else if (this.operator == Operador_Logico.OR) {
            if (this.exp_left.type == Tipo.BOOLEANO && this.exp_right.type == Tipo.BOOLEANO) {
                return this.casteo(this.exp_left.type, left) || this.casteo(this.exp_right.type, right);
            }
            //Aca crear un nuevo objeto error con la descripcion, fila y columna;
            console.log("Error semantico: Error al realizar la operacion"+left.toString()+" "+this.exp_left.type + "||" + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);
        } else if (this.operator == Operador_Logico.NOT) {
            if (this.exp_left.type == Tipo.BOOLEANO) {
                return ! this.casteo(this.exp_left.type, left)
            }
            console.log("Error semantico: Error en la operacion ! "+left.toString()+" "+this.exp_left.type+". Linea: "+this.row + " Columna: "+this.column);
        }
    }

    casteo(tipo, valor){
        if (tipo == Tipo.ENTERO){
            return parseInt(valor);
        }else if (tipo == Tipo.DECIMAL){
            return parseFloat(valor)
        }else if (tipo == Tipo.BOOLEANO){
            return Boolean(valor)
        }else if(tipo == Tipo.CARACTER){
            var caracter = valor.slice(1,-1)
            return caracter.charCodeAt(0);
        }
        return valor.toString();
    }
}