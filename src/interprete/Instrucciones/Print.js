class Print extends Instruction{
    
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
                concatenacion += value;
            }else{
                if (value.typeArray == Tipo.ARRAY && !(value instanceof DeclaracionArray) && !(value instanceof Array)) {
                    //value = this.recorrerArray(value.list_value);
                    
                    try {
                        value = value.value;
                        concatenacion += value;
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
                    concatenacion += value;
                }else{
                    concatenacion += value;
                }
            }
        }
       
        tree.updateConsola(concatenacion);
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
        console.log(texto)
        return texto;
    }

    getNodo(){
        var nodo = new NodoAST("PRINT");
        for (var expresion of this.expression) {
            nodo.agregarHijoNodo(expresion.getNodo());
        }
        return nodo;
    }

    compilar(tree, table){
        var expression = this.expression.compilar(tree, table);
        var gen = tree.getGenerator();
    
    }
}