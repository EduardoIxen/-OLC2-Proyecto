class LlamadaFuncion extends Instruction{
    constructor(id, parameters, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
    }

    interpretar(tree, table){
        var result = tree.getFuncion(this.id); //obtener la funcion que deseamos
        if (result == null) {
            return new Exception("Semantico", "No se encontro la funcion "+this.id, this.row, this.column);
        }

        var newTable = new TablaSimbolo(tree.getTablaTsGlobal());
        if (result.parameters.length == this.parameters.length) { //cantidad de parametros iguales
            var count = 0;
            for(var expresion of this.parameters){
                var resultExp = expresion.interpretar(tree, table);
                if (resultExp instanceof Exception) {
                    return resultExp;
                }

                if(result.parameters[count].tipo == Tipo.ARRAY){
                    if (expresion instanceof Identificador) {
                        if (result.parameters[count].type_init == resultExp.type) {
                        //CREACION DE SIMBOLOS E INGRESARLO A LA TABLA DE SIMBOLOS 
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, this.row, this.column, resultExp, "ambito");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) {
                            return resultTabla;
                        }
                        }
                    }
                    else if (result.parameters[count].type_init == expresion.type) {  //verificar que los tipos sean iguales
                        //CREACION DE SIMBOLOS E INGRESARLO A LA TABLA DE SIMBOLOS 
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, this.row, this.column, resultExp, "ambito");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) {
                            return resultTabla;
                        }

                    }
                }else if(result.parameters[count].tipo != Tipo.ARRAY){
                    var temp =result.parameters[count].tipo;
                    if (result.parameters[count].tipo == expresion.type) {  //verificar que los tipos sean iguales
                        //CREACION DE SIMBOLOS E INGRESARLO A LA TABLA DE SIMBOLOS 
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, this.row, this.column, resultExp, "ambito");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) {
                            return resultTabla;
                        }

                    }else if(expresion.type == Tipo.STRUCT ){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        symbol.nameStruct = temp;
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].tipo == Tipo.DECIMAL && expresion.type == Tipo.ENTERO){
    
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) {
                            return resultTabla;
                        }
                    }
                    else if(result.parameters[count].identificador == '01-Native-Cos'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '02-Native-Sin'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '03-Native-tan'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '04-Native-Log10'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '05-Native-Sqrt'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '06-Native-Pow' || result.parameters[count].identificador == '07-Native-Pow'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '08-Native-String'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '09-Native-ToInt'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '10-Native-ToDouble'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else if(result.parameters[count].identificador == '11-Native-TypeOf'){
                        result.parameters[count]['tipo'] = expresion.type;
                        var symbol = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, expresion.row, expresion.column, resultExp, "local");
                        var resultTabla = newTable.setTabla(symbol);
                        if (resultTabla instanceof Exception) return resultTabla;
                    
                    }else{
                        return new Exception("Semantico", "Tipo de dato diferente en parametros de la llamada2.", this.row, this.column);
                    }
                }else{
                    return new Exception("Semantico", "Tipo de dato diferente en parametros de la llamada.", this.row, this.column);
                    
                }
                
                count = count + 1;
            }
        }else{
            return new Exception("Semantico", "Cantidad de parametros incorrectos.", this.row, this.column);
        }
        var value = result.interpretar(tree, newTable); //interpretar el nodo funcion
        if (value instanceof Exception) {
            return value;
        }
        this.type = result.type;
        return value;
    }

    getNodo(){
        var nodo = new NodoAST("LLAMADA FUNCION");
        nodo.agregarHijo(this.id.toString());
        var parametros = new NodoAST("PARAMETROS");
        for (var param of this.parameters) {
            parametros.agregarHijoNodo(param.getNodo());
        }
        nodo.agregarHijoNodo(parametros);
        return nodo;

    }
}