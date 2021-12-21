class Println extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var concatenacion = "";
        for (var expression of this.expression) {
            var value = expression.interpretar(tree, table);
            if(value instanceof Exception) return value;
            if(value == null){
                var symbol = table.getTabla(expression.parameters[0].identificador);
                var result = Object.values(symbol.value);
                var texto = '(';
                texto += this.recorrerStruct(result).toString();
                value = texto;
                concatenacion = concatenacion + value;
            }else{
                if (value.typeArray == Tipo.ARRAY && !(value instanceof DeclaracionArray) && !(value instanceof Array)) {
                    try {
                        value = value.value;
                        concatenacion = concatenacio + value;
                    } catch (error) {
                        value = new Exception("semático", "Index malo", this.row, this.column);
                        concatenacion += value;
                    }
                }else if (value.typeArray == Tipo.ARRAY && (value instanceof Array)) {
                    value = this.recorrerArray(value);
                    concatenacion += value;
                }else if (value.typeArray == Tipo.ARRAY && value.typeArray == Tipo.ARRAY) {
                    value = this.recorrerArray(value.list_value);
                    concatenacion += value;
                }else if (value instanceof Primitivo) {
                    value = value.value;
                    concatenacion = concatenacion + value;
                }else{
                    concatenacion += value;
                }
            }
        }
       
        tree.updateConsola(concatenacion+'\n');
    }

    recorrerArray(listaValores){
        var aux = [];
        for(var temp of listaValores){
            if (temp instanceof Array) {
                aux.push(this.recorrerArray(temp));
            }else{
                aux.push(temp.value);
            }
        }
        return "["+aux.toString()+"]";
    }

    recorrerStruct(listStruct){
        var texto = '';
        var i = 0;
        while(i<listStruct.length){
            if(listStruct[i] instanceof Object){
                // here code..
                texto += `(${this.recorrerStruct(Object.values(listStruct[i]))})`
            }else{
                if((i+1) == listStruct.length){
                    texto += `${listStruct[i].toString()})`
                }else{
                    texto += `${listStruct[i].toString()},`
                }
            
            }
            i++;
        }
        return texto;
    }

    getNodo(){
        var nodo = new NodoAST("PRINTLN");
        nodo.agregarHijoNodo(this.expression.getNodo());
        return nodo;
    }


    compilar(tree, table){
        var gen = tree.getGenerator();
        var result = this.expression.compilar(tree, table);
        var op = '';
        var type = '';

        if(result.type == Tipo.ENTERO){
            op = 'd';
            type = 'int';
        }else if(result.type == Tipo.DECIMAL){
            // here code...
            op = 'f';
            type = 'double';
        }else if(result.type == Tipo.CARACTER){
            // here code...
            op = 'c';
            type = 'char';
        }
            
            
        if(result.type == Tipo.BOOLEANO){
            var newL = gen.getLabel();
            tree.updateConsola(gen.setBoolean(result.EV, result.EF, null, newL, true)+'\n');
           
        }else if(result.type == Tipo.STRING){

            if(!tree.nativas){
                gen.setNative(gen.getPrintfString());
            }
            var temp = gen.newTemp();
            var conca = '';
            conca += gen.setArithmetic(temp, 'P', '+', '0'); // editar a futuro el pos
            conca += gen.setArithmetic(temp, temp, '+', '1');
            conca += gen.setStack(temp, result.value);
            conca += gen.setArithmetic('P', 'P', '+', '0'); // editar a futuro el pos
            conca += '\tprintfString();\n';
            temp = gen.newTemp();
            conca += gen.setArithmetic(temp,'stack[(int)P]','','');
            conca += gen.setArithmetic('P', 'P', '-', '0'); // // editar a futuro el pos
            conca += gen.newLine(true) + '\n';

            tree.updateConsola(conca);
            

        }else{
            tree.updateConsola(gen.setPrintf(op, type, result.value, true)+'\n');
        }
    
    }
}