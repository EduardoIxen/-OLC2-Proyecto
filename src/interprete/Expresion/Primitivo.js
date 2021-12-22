class Primitivo extends Instruction{

    constructor(type, value, row, column){
        super(row,column);
        this.type = type;
        this.value = value;
    }

    interpretar(tree, table){
        return this.value;
    }

    getNodo(){
        var nodo = new NodoAST("PRIMITIVO");
        var nodoDato = new NodoAST(this.verTipo(this.type));
        nodoDato.agregarHijo(this.value.toString());
        nodo.agregarHijoNodo(nodoDato);
        return nodo;
    }

    verTipo(tipoDato){
        if (tipoDato == Tipo.ENTERO) {
            return "INT";
        }else if (tipoDato == Tipo.DECIMAL) {
            return "DOUBLE";
        }else if (tipoDato == Tipo.STRING) {
            return "STRING";
        }else if (tipoDato == Tipo.BOOLEANO) {
            return "BOOLEAN";
        }else if (tipoDato == Tipo.CARACTER) {
            return "CHAR";
        }else if (tipoDato == Tipo.IDENTIFICADOR) {
            return "IDENTIFICADOR";
        }else if (tipoDato == Tipo.NULO) {
            return "NULO";
        }else if (tipoDato == Tipo.ARRAY) {
            return "ARRAY";
        }else if (tipoDato == Tipo.STRUCT) {
            return "STRUCT";
        }else if (tipoDato == Tipo.VOID) {
            return "VOID";
        }
        return tipoDato.toString();
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        if(this.type == Tipo.ENTERO || this.type == Tipo.DECIMAL){
            return new C3D(this.value.toString(), this.type, false);

        }else if(this.type == Tipo.BOOLEANO){
            var result = new C3D(this.value, this.type, false);
            var EV = gen.newLabel();
            var EF = gen.newLabel();
            if(this.value){
                result.EV = EV;
                result.EF = EF;
            }else{
                result.EV = EV;
                result.EF = EF;
            }
        
        }else if(this.type == Tipo.STRING || this.type == Tipo.CARACTER){
            var result  = new C3D(null, this.type, false);
            
            var temp = gen.newTemp();
            var conca = '\n';
            conca += gen.setArithmetic(temp, 'H', '', '');
            var i = 0;
            while(i<this.value.length){
                conca += gen.setHeap(this.value[i].charCodeAt(0));
                conca += gen.newHeap();

                i++;
            }

            conca += gen.setHeap('-1');
            conca += gen.newHeap();
            
            result.value = temp;
            result.isTemp = true;
            result.posGlobal = tree.getPos();

            tree.updateConsola(conca);  

            return result;
            
             
        }else{
            //here code...
        }


        return result;
    }
}
