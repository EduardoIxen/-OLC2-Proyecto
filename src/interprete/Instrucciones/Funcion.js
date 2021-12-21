class Funcion extends Instruction{
    constructor(type, id, parameters, instr, row, column){
        super(row, column);
        this.id = id;
        this.parameters = parameters;
        this.instructions = instr;
        this.type = type;
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
        var countReturn = 0;
        var newTable = new TablaSimbolo(table);
        for(var instr of this.instructions){
            var value = instr.interpretar(tree, newTable);
            if (value instanceof Exception) {
                tree.getException().push(value);
                tree.updateConsola(value.toString());
            }
            if (value instanceof Break) {
                var err = new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", instr.row, instr.column)
                tree.getException().push(err);  //guardar el error para seguir con las demas instrucciones
                tree.updateConsola(err.toString());
            }
            if (value instanceof Return) {
                if (this.type == value.type) {
                    return value.result;
                }else if (this.type == Tipo.VOID) {
                    return null;
                }
                else{
                    countReturn += 1;
                    var err = new Exception("Semantico", "Tipo de retorno invalido.", instr.row, instr.column)
                    tree.getException().push(err);  //guardar el error para seguir con las demas instrucciones
                    tree.updateConsola(err.toString());
                }
            }
            if (value instanceof Continue) {
                var err = new Exception("Semantico", "Sentencia CONTINUE fuera de ciclo.", instr.row, instr.column)
                tree.getException().push(err);  //guardar el error para seguir con las demas instrucciones
                tree.updateConsola(err.toString());
            }
        }
        if (countReturn == 0 && this.type != Tipo.VOID) {
            return new Exception("Semantico", "Necesita retornar un valor", instr.row, instr.column)
        }
        return null;
    }

    getNodo(){
        var nodo = new NodoAST("FUNCION");
        nodo.agregarHijo(this.id.toString());
        var parametros = new NodoAST("PARAMETROS");
        for (var param of this.parameters) {
            var parametro = new NodoAST("PARAMETROS");
            parametro.agregarHijo(param['tipo'])
            parametro.agregarHijo(param['identificador'])
            parametros.agregarHijoNodo(parametro);
        }
        nodo.agregarHijoNodo(parametros);
        return nodo;
    }

    getTabla(tree, table, padre){
        var salida = "";
        for(var instr of this.instructions){
            if (instr instanceof Declaracion) {
                salida += instr.getTabla(tree, this.tabla, "Local").toString();
            }
            if (instr instanceof If) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof For) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof While) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof Do_While) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof Switch) {
                salida += instr.getTabla(tree, table, "Local").toString();
            } //duda verificar
            if (instr instanceof DeclaracionArray) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof DeclaracionStruct) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof DeclaracionArrayRC) {
                salida += instr.getTabla(tree, table, "Local").toString();
            } if (instr instanceof LlamadaFuncion){
                salida += instr.getTabla(tree,table, padre);
            }
        }

        var dict = {}
        dict['Identificador'] =this.id.toString();
        dict['Tipo'] = "Funcion";
        dict['Tipo2'] = this.type.toString().replace("TIPO.", "");
        dict['Entorno'] = padre.toString();
        dict['Valor'] = "-------";
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        //tree.getTablaTsGlobal().push(dict);
        tree.addTSG(dict);
        return salida;
    }
}