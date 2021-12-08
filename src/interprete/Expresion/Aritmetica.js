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
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: No se pueden sumar los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);
            
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
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: No se pueden restar los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);

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
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: No se pueden multiplicar los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);

        }else if(this.operator == Operador_Aritmetico.DIV){
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
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: No se pueden dividir los datos"+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);

        }else if(this.operator == Operador_Aritmetico.MODULO){
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
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: No se pueden obtener el modulo de "+left.toString()+" "+this.exp_left.type + " y " + right.toString()+" "+this.exp_right.type + "Fila: "+this.row + "Columna: "+this.column);

        } else if(this.operator == Operador_Aritmetico.UMENOS){
            if(this.exp_left.type == Tipo.ENTERO){
                self.type = Tipo.ENTERO
                return - this.casteo(this.exp_left.type, left)
            }else if(this.exp_left.type == Tipo.DECIMAL){
                self.type = Tipo.DECIMAL
                return - this.casteo(this.exp_left.type, left)
            }
            //Aca crear un nuevo objeto error con la descripcion, fila y columna
            console.log("Error semantico: Tipo de dato erroneo para -" + "Fila: "+this.row + "Columna: "+this.column);
        }
        //Aca crear un nuevo objeto error con la descripcion, fila y columna
        console.log("Error semantico: Tipo de operacion erronea. " + "Fila: "+this.row + "Columna: "+this.column);

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