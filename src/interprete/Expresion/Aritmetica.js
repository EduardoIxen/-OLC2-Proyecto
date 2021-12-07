class Aritmetica extends Instruction{

    constructor(exp_left, exp_right, operator, row, column){
        super(row, column);
        this.exp_left = exp_left;
        this.exp_right = exp_right;
        this.operator = operator;
        this.type = null;
    }

    interpretar(tree, table){
        var left = this.exp_left.interpretar(tree, table);
        if(left instanceof Exception){
            return left;
        }
        if(this.exp_right != null){
            var right = this.exp_right.interpretar(tree, table);
            if(right instanceof Exception){
                return right;
            }
        }
    
        if (this.operator == Operador_Aritmetico.MAS){
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right)
            }
            
        }
        
    }


    casteo(tipo, valor){

        if (tipo == Tipo.ENTERO){
            return parseInt(valor);
        }else if (tipo == Tipo.DECIMAL){
            return parseFloat(valor)
        }else if (tipo == Tipo.BOOLEANO){
            return Boolean(valor)
        }
        return valor.toString();
    }

   
    operator(self){
        if (self.operador == Operador_Aritmetico.SUMA){
            return "+"
        }else if(self.operador == Operador_Aritmetico.RESTA){
            return "-"
        }else if (self.operador == Operador_Aritmetico.POR){
            return "*"
        }else if (self.operador == Operador_Aritmetico.DIV){
            return "/"
        }
    }
}