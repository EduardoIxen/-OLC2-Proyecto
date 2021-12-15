class SubString extends Instruction{
    constructor(identificador, exp_left, exp_right, row, column){
        super(row, column);
        this.identificador = identificador;
        this.exp_left = exp_left;
        this.exp_right = exp_right;
        this.type = Tipo.STRING;
        this.symbol = null;
    }

    interpretar(tree, table){
        var left = this.exp_left.interpretar(tree, table);
        if(left instanceof Exception) return left;

        var right = this.exp_right.interpretar(tree, table);
        if(right instanceof Exception) return right;

        if(this.exp_left.type != Tipo.ENTERO || this.exp_right.type != Tipo.ENTERO){
            return new Exception("Semantico", `Tipo de parametro para SubString no es INT.`, this.row, this.column);
        }

        var symbol = table.getTabla(this.identificador);
        this.symbol = symbol;
        if(symbol == null){
            return new Exception("Semantico", `La variable (${this.identificador}) no existe`, this.row, this.column);
        }

        if((0<=left && left<symbol.getValue().length) && (0<=right && right<symbol.getValue().length) ){
            if(left<=right){
                var i = left, text = '';
                while(i<=right){
                    text += symbol.getValue()[i].toString();
                    i++;
                }
                return text;
            }   
        }

        return new Exception("Semantico", `Error de posición ${left} en caracterOfPosition`, this.row, this.column);
        
    }

    getNodo(){
        var nodo = new NodoAST("SUBSTRING");
        var nodoDato = new NodoAST(this.type);
        nodoDato.agregarHijo(this.symbol.getValue());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }
}