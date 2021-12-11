class LlamadaFuncion extends Instruction{
    constructor(id, parameters, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
    }

    interpretar(tree, table){
        var result = tree.getFuncion(this.id); //obtener la funcion que deseamos
        if (result == null) {
            return new Exception("Semantico", "No se encontro la funcion"+this.id, this.row, this.column);
        }

        var newTable = new TablaSimbolo(tree.getTablaTsGlobal());

        if (result.parameters.length == this.parameters.length) { //cantidad de parametros iguales
            var count = 0;
            for(var expresion of this.parameters){
                var resultExp = expresion.interpretar(tree, table);
                if (resultExp instanceof Exception) {
                    return resultExp;
                }

                if (result.parameters[count].tipo == expresion.type) {  //verificar que los tipos sean iguales
                    //CREACION DE SIMBOLOS E INGRESARLO A LA TABLA DE SIMBOLOS 
                    var simbolo = new Simbolo(result.parameters[count].identificador, result.parameters[count].tipo, this.row, this.column, resultExp, "ambito");
                    var resultTabla = newTable.setTabla(simbolo);
                    if (resultTabla instanceof Exception) {
                        return resultTabla;
                    }

                //falta elif de arreglos
                
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