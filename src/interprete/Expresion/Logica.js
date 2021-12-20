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
            return new Exception("Error semantico", "Error al realizar la operacion "+left.toString()+" "+this.exp_left.type + "&&" + right.toString()+" "+this.exp_right.type, this.row, this.column);

        } else if (this.operator == Operador_Logico.OR) {
            if (this.exp_left.type == Tipo.BOOLEANO && this.exp_right.type == Tipo.BOOLEANO) {
                return this.casteo(this.exp_left.type, left) || this.casteo(this.exp_right.type, right);
            }
            return new Exception("Error semantico", "Error al realizar la operacion "+left.toString()+" "+this.exp_left.type + "||" + right.toString()+" "+this.exp_right.type, this.row, this.column);

        } else if (this.operator == Operador_Logico.NOT) {
            if (this.exp_left.type == Tipo.BOOLEANO) {
                return ! this.casteo(this.exp_left.type, left)
            }
            return new Exception("Error semantico", "Error en la operacion ! "+left.toString()+" "+this.exp_left.type, this.row, this.column);
            
        }
    }

    casteo(tipo, valor){
        if (valor instanceof Primitivo) {
            valor = valor.value
        }
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
        var nodo = new NodoAST("LOGICA");
        if (this.exp_right != null) {
            nodo.agregarHijoNodo(this.exp_left.getNodo());
            nodo.agregarHijo(this.obtenerOp(this.operator));
            nodo.agregarHijoNodo(this.exp_right.getNodo());
        }else{
            nodo.agregarHijo(this.obtenerOp(this.operator));
            nodo.agregarHijoNodo(this.exp_left.getNodo());
        }
        return nodo;
    }

    obtenerOp(operador){
        if (operador == Operador_Logico.NOT) {
            return "!";
        }else if (operador == Operador_Logico.OR) {
            return "||";
        }else if (operador == Operador_Logico.AND) {
            return "&&";
        }
        return operador.toString();
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        var result = new C3D(null, this.type, false);
        var left = this.exp_left.compilar(tree, table);
        var right = 0;


        if(this.operator == Operador_Logico.AND){
            
            if(!left.isTemp){
                tree.updateConsola(gen.addGoto(left.EV));
            }   
            tree.updateConsola(gen.addLabel(left.EV));
            if(this.exp_right==null){
                return new Exception("Semántico", "Expresión derecha no existe.", this.row, this.column);
            }
            right = this.exp_right.compilar(tree, table);
            if(!right.isTemp){
                tree.updateConsola(gen.addGoto(right.EV));
            }
            tree.updateConsola(gen.addLabel(left.EF));
            tree.updateConsola(gen.addGoto(right.EF));

            result.EV = right.EV;
            result.EF = right.EF;
            return result;

        }else if (this.operator == Operador_Logico.OR) {
            
            tree.updateConsola(gen.addLabel(left.EF));
            
            if(this.exp_right==null){
                return new Exception("Semántico", "Expresión derecha no existe.", this.row, this.column);
            }
            right = this.exp_right.compilar(tree, table);
            if(!left.isTemp){
                tree.updateConsola(gen.addGoto(left.EV));
            }
            tree.updateConsola(gen.addLabel(left.EV));
            tree.updateConsola(gen.addGoto(right.EV));
            if(!right.isTemp){
                tree.updateConsola(gen.addGoto(right.EV));
            }
            
            result.EV = right.EV;
            result.EF = right.EF;
        }else if (this.operator == Operador_Logico.NOT) {
            if(this.exp_right != null){
                return new Exception("Semántico", "Expresión derecha no existe.", this.row, this.column);
            }
            console.log(left)
            result.EV = left.EF;
            result.EF = left.EV;
            return result;
        }

        return result;
    }


}