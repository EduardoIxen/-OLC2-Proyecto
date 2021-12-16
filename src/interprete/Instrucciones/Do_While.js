class Do_While extends Instruction{

    constructor(condicion, instrucciones, row, column){
        super(row, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
        this.table = null;
    }

    interpretar(tree, table){
        this.table = table;
        while (true) {
            var condicion = this.condicion.interpretar(tree, table);
            if (condicion instanceof Exception) {
                return condicion;   
            }

            if (this.condicion.type == Tipo.BOOLEANO) {
                var nuevaTabla = new TablaSimbolo(table);
                for(var instruccion of this.instrucciones){
                    var result = instruccion.interpretar(tree, nuevaTabla);
                    if (result instanceof Exception) {
                        tree.getException().push(result);
                        tree.updateConsola(result.toString())
                    }
                    if (result instanceof Break) {
                        return null;
                    }
                    if (result instanceof Return) {
                        return result;
                    }
                    if (result instanceof Continue) {
                        break; //dejar de ejecutar las instrucciones del ciclo actual del while y pasar al siguiente ciclo
                    }
                }
                condicion = this.condicion.interpretar(tree,table);
                if (Boolean(condicion) == false) {
                    break;
                }
            }else{
                return new Excepcion("Semantico", "Tipo de dato no booleano en while.", this.row, this.column)
            }
        }
    }

    getNodo(){
        var nodo = new NodoAST("DO WHILE");
        var instrucciones = new NodoAST("INSTRUCCIONES");
        for(var ins of this.instrucciones){
            instrucciones.agregarHijoNodo(ins.getNodo());
        }
        var condicion = new NodoAST("CONDICION");
        condicion.agregarHijoNodo(this.condicion.getNodo());
        nodo.agregarHijoNodo(instrucciones);
        nodo.agregarHijoNodo(condicion);
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        for (var instr of this.instrucciones) {
            if (instr instanceof Declaracion) {
                salida += instr.getTabla(tree, this.tabla, padre).toString();
            }
            if (instr instanceof DeclaracionArray) {
                salida += instr.getTabla(tree, table, padre);
            }
            if (instr instanceof DeclaracionStruct) {
                salida += instr.getTabla(tree, table, padre);
            }//falta declaracion por referencia y copia
        }
        return salida;
    }
}