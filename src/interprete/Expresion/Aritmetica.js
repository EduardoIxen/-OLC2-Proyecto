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
        if(left.value != undefined){
            left = left.value;
        }

        if(this.exp_right != null){
            var right = this.exp_right.interpretar(tree, table);
            if(right instanceof Exception){
                return right;
            }
            if(right.value != undefined){
                right = right.value;
            }
        }
    
        if (this.operator == Operador_Aritmetico.MAS){
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right)
            } else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL) || (this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right);
            } else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) + this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error Semantico","No se pueden sumar los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type, this.row, this.column);
            
        }else if (this.operator == Operador_Aritmetico.RESTA){
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right)
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL) || (this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) - this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error Semantico","No se pueden restar los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type, this.row, this.column);

        }else if(this.operator == Operador_Aritmetico.POR){
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right)
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL) || (this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) * this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error Semantico","No se pueden multiplicar los datos "+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type, this.row, this.column);

        }else if(this.operator == Operador_Aritmetico.DIV){
            if (this.casteo(this.exp_right.type, right) == 0) {
                return new Exception("Matematico", "Error matemetico: Division por cero.", this.row, this.column);
            }
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right)
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL) || (this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) / this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error Semantico","No se pueden dividir los datos "+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type, this.row, this.column);

        }else if(this.operator == Operador_Aritmetico.MODULO){
            if (this.casteo(this.exp_right.type, right) == 0) {
                return new Exception("Matematico", "Error matemetico: Modulo por cero.", this.row, this.column);
            }
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right)
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL) || (this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO)){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right);
            }else if((this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER) || (this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL)){
                this.type = Tipo.DECIMAL;
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right);
            }else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                this.type = Tipo.ENTERO;
                return this.casteo(this.exp_left.type, left) % this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error Semantico","No se pueden obtener el modulo de "+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type, this.row, this.column);

        } else if(this.operator == Operador_Aritmetico.UMENOS){
            if(this.exp_left.type == Tipo.ENTERO){
                this.type = Tipo.ENTERO
                return - this.casteo(this.exp_left.type, left)
            }else if(this.exp_left.type == Tipo.DECIMAL){
                this.type = Tipo.DECIMAL
                return - this.casteo(this.exp_left.type, left)
            }
            return new Exception("Error Semantico","Tipo de dato erroneo poara - ", this.row, this.column);
        }
        return new Exception("Error Semantico","Tipo de operacion erronea.", this.row, this.column);

    }


    casteo(tipo, valor){
        if (tipo == Tipo.ENTERO){
            return parseInt(valor);
        }else if (tipo == Tipo.DECIMAL){
            return parseFloat(valor)
        }else if (tipo == Tipo.BOOLEANO){
            return Boolean(valor)
        }else if(tipo == Tipo.CARACTER){
            var caracter = valor
            return caracter.charCodeAt(0);
        }
        return valor.toString();
    }

   
    operator(){
        if (this.operador == Operador_Aritmetico.SUMA){
            return "+"
        }else if(this.operador == Operador_Aritmetico.RESTA){
            return "-"
        }else if (this.operador == Operador_Aritmetico.POR){
            return "*"
        }else if (this.operador == Operador_Aritmetico.DIV){
            return "/"
        }
    }
}