class While extends Instruction{

    constructor(condicion, instrucciones, fila, columna){
        super(fila, columna);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
        this.table = null;
    }

    interpretar(tree, table){
        this.table = table;
        while (true) {
            let condicion = this.condicion.interpretar(tree, table);
            if (condicion instanceof Exception) {
                return condicion;   
            }

            if (this.condicion.type == Tipo.BOOLEANO) {
                if (Boolean(condicion) == true) {  //valida que la condicion sea verdadera
                    var nuevaTabla = new TablaSimbolo(table); //nuevo ambito para cada ciclo
                    
                    for (let instruccion of this.instrucciones) {
                        let result = instruccion.interpretar(tree, nuevaTabla); //ejecutar cada instruccion dentro del while
                        if (result instanceof Exception) {
                            tree.getException().push(result);
                            tree.updateConsola(result.toString())
                        }
                        //faltan instancias del break
                        //return
                        //continue
                    }
                }else{
                    break;
                }
            }else{
                return new Excepcion("Semantico", "Tipo de dato no booleano en while.", self.fila, self.columna)
            }
        }
    }
}