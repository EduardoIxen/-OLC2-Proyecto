class LlamadaFuncion extends Instruction{
    constructor(id, parameters, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
    }

    interpretar(tree, table){
        var result = tree.getFunciones(this.id); //obtener la funcion que deseamos
        if (result == null) {
            return new Exception("Semantico", "No se encontro la funcion"+this.id, this.row, this.column);
        }
        console.log("si se obtuvo");
        var newTable = new TablaSimbolo(tree.getTablaTsGlobal());
        console.log("resL", result.length);
        console.log("parm", this.parameters.length);
        if (result.length == this.parameters.length) {
            var conunt = 0;
            for(var expresion of this.parameters){
                console.log("espre", expresion);
                var resultExp = expresion.interpretar(tree, table);
                if (resultExp instanceof Exception) {
                    return resultExp;
                }

                if (result.parameters[conunt].tipo == expresion.type) {  //verificar que los tipos sean iguales
                    //CREACION DE SIMBOLOS E INGRESARLO A LA TABLA DE SIMBOLOS 
                    var simbolo = Simbolo(result.parameters[conunt].identificador, result.parameters[conunt].tipo, this.row, this.column, resultExp, "ambito");
                    var resultTabla = newTable.setTabla(simbolo);
                    if (resultTabla instanceof Exception) {
                        return resultTabla;
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
}