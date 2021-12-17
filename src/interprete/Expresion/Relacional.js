class Relacional extends Instruction{

    constructor(exp_left, exp_right, operator, row, column){
        super(row, column);
        this.exp_left = exp_left;
        this.exp_right = exp_right;
        this.operator = operator;
        this.type = Tipo.BOOLEANO;
    }

    interpretar(tree, table){
        var left = this.exp_left.interpretar(tree, table);
        if(left instanceof Exception){
            return left;
        } 
        if(left.value != undefined){
            left = left.value;
        }

        var right = this.exp_right.interpretar(tree, table);
        if(right instanceof Exception){
            return right;
        }
        if(right.value != undefined){
            right = right.value;
        }

        if(this.operator == Operador_Relacional.MENORQUE){ // <
            /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                // console.log(`${left} - ${right}`)
                // console.log(this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right))
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) < this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para <.", this.row, this.column);

        }else if(this.operator == Operador_Relacional.MAYORQUE){ // >
            /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) > this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para >.", this.row, this.column);

        }else if(this.operator == Operador_Relacional.MENORIGUAL){ // <=
            /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else  if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) <= this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para <=.", this.row, this.column);

        }else if(this.operator == Operador_Relacional.MAYORIGUAL){ // >=
            /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else  if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) >= this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para >=.", this.row, this.column);

        }else if(this.operator == Operador_Relacional.IGUALACION){ // ==
            /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            /*****************************************  STRING *****************************************/
            else if(this.exp_left.type == Tipo.STRING && this.exp_right.type == Tipo.STRING){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.STRING && this.exp_right.type == Tipo.NULO){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            /*****************************************  BOOLEAN *****************************************/
            else if(this.exp_left.type == Tipo.BOOLEANO && this.exp_right.type == Tipo.BOOLEANO){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            /*****************************************  NULL *****************************************/
            else if(this.exp_left.type == Tipo.NULO && this.exp_right.type == Tipo.STRING){
                return this.casteo(this.exp_left.type, left) == this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para ==.", this.row, this.column);

        }else if(this.operator == Operador_Relacional.DIFERENCIA){ // !=
        /*****************************************  INT *****************************************/
            if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.ENTERO && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            /*****************************************  DECIMAL *****************************************/
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.DECIMAL && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            /*****************************************  CHAR *****************************************/
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.ENTERO){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.DECIMAL){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.CARACTER && this.exp_right.type == Tipo.CARACTER){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            /*****************************************  STRING *****************************************/
            else if(this.exp_left.type == Tipo.STRING && this.exp_right.type == Tipo.STRING){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            else if(this.exp_left.type == Tipo.STRING && this.exp_right.type == Tipo.NULO){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            /*****************************************  BOOLEAN *****************************************/
            else if(this.exp_left.type == Tipo.BOOLEANO && this.exp_right.type == Tipo.BOOLEANO){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            /*****************************************  NULL *****************************************/
            else if(this.exp_left.type == Tipo.NULO && this.exp_right.type == Tipo.STRING){
                return this.casteo(this.exp_left.type, left) != this.casteo(this.exp_right.type, right);
            }
            
            return new Exception("Semantico", "Tipo Erroneo de operacion para ==.", this.row, this.column);

        }
        
        return new Exception("Semantico", "Tipo de Operacion no Especificado.", this.row, this.column);

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

    getNodo(){
        var nodo = new NodoAST("RELACIONAL");
        nodo.agregarHijoNodo(this.exp_left.getNodo());
        nodo.agregarHijo(this.operator.toString());
        nodo.agregarHijoNodo(this.exp_right.getNodo());
        return nodo;
    }

    obtOp(operacion){
        if (operacion == Operador_Relacional.MAYORQUE) {
            return ">";
        }else if (operacion == Operador_Relacional.MENORQUE) {
            return "<";
        }else if (operacion == Operador_Relacional.MAYORIGUAL) {
            return ">=";
        }else if (operacion == Operador_Relacional.MENORIGUAL) {
            return "<=";
        }else if (operacion == Operador_Relacional.DIFERENCIA) {
            return "!=";
        }else if (operacion == Operador_Relacional.IGUALACION) {
            return "==";
        }
        return operacion.toString();
    }

}