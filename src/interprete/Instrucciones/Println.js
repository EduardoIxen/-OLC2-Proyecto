class Println extends Instruction{
    
    constructor(expression, row, column){
        super(row, column);
        this.expression = expression;
    }

    interpretar(tree, table){
        var value = this.expression.interpretar(tree, table);
        if(value instanceof Exception) return value;
        if(value == null){
            var symbol = table.getTabla(this.expression.parameters[0].identificador);
            var result = Object.values(symbol.value);
            var texto = '(';
            texto += this.recorrerStruct(result).toString();
            value = texto;
        }else{
            if (value.typeArray == Tipo.ARRAY && !(value instanceof DeclaracionArray) && !(value instanceof Array)) {
                //value = this.recorrerArray(value.list_value);
                
                try {
                    value = value.value;
                } catch (error) {
                    value = new Exception("semático", "Index malo", this.row, this.column);
                }
            }else if (value.typeArray == Tipo.ARRAY && (value instanceof Array)) {
                value = this.recorrerArray(value);
            }else if (value.typeArray == Tipo.ARRAY && value.typeArray == Tipo.ARRAY) {
                value = this.recorrerArray(value.list_value);
            }else if (value instanceof Primitivo) {
                value = value.value;
            }
        }
       
        tree.updateConsola(value+'\n');
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
           
        }else{
            tree.updateConsola(gen.setPrintf(op, type, result.value, true)+'\n');
        }
    
    }
}