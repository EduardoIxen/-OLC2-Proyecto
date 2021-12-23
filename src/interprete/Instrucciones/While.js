class While extends Instruction{

    constructor(condicion, instrucciones, row, column){
        super(row, column);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
        while (true) {
            var condicion = this.condicion.interpretar(tree, table);
            if (condicion instanceof Exception) {
                return condicion;   
            }

            if (this.condicion.type == Tipo.BOOLEANO) {
                if (Boolean(condicion) == true) {  //valida que la condicion sea verdadera
                    var nuevaTabla = new TablaSimbolo(table); //nuevo ambito para cada ciclo
                    
                    for (var instruccion of this.instrucciones) {
                        var result = instruccion.interpretar(tree, nuevaTabla); //ejecutar cada instruccion dentro del while
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
                }else{
                    break;
                }
            }else{
                return new Excepcion("Semantico", "Tipo de dato no booleano en while.", this.row, this.column)
            }
        }
    }

    getNodo(){
        var nodo = new NodoAST("WHILE");
        var instrucciones = new NodoAST("INSTRUCIONES");
        for (var instr of this.instrucciones) {
            instrucciones.agregarHijoNodo(instr.getNodo());
        }
        nodo.agregarHijoNodo(instrucciones);
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
            }
            if (instr instanceof DeclaracionArrayRC) {
                salida += instr.getTabla(tree, table, padre);
            }if (instr instanceof LlamadaFuncion){
                salida += instr.getTabla(tree,table, padre);
            }
        }
        return salida;
    }

    compilar(tree, table){

        var gen = tree.getGenerator();
        var newTable = new TablaSimbolo(table);

        var newL = gen.newLabel();

        tree.updateConsola(gen.addLabel(newL));

        var condicion = this.condicion.compilar(tree, table);
        if(condicion instanceof Exception) return condicion;

        if(condicion.type == Tipo.BOOLEANO){

            tree.updateConsola(gen.addLabel(condicion.EV));
            for(var instruction of this.instrucciones){
                var result = instruction.compilar(tree, newTable);

                if(result instanceof Exception){
                    gen.setException(result);
                }
                // if(result instanceof Break) return result;
                // if(result instanceof Return) return result;
                // if(result instanceof Continue) return result;
            }
            tree.updateConsola(gen.addGoto(newL));
            tree.updateConsola(gen.addLabel(condicion.EF));

        }else{
            return new Excepcion("Semantico", "Tipo de dato no booleano en while.", this.row, this.column)
        }
       
        
        if(tree.breakReturn){
            tree.updateConsola(gen.addLabel(tree.breakLabel));
            tree.breakReturn = false;
            tree.breakLabel = '';
        }


    }
}