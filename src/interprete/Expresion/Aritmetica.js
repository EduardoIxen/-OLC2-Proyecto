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
        console.log("aca");
        console.log(this.operator);
        if (this.operator == Operador_Aritmetico.SUMA){

            console.log(this.casteo(this.exp_left.type, left));
            console.log(this.casteo(this.exp_right.type, right));
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right == Tipo.ENTERO){
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
        return str(valor)
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