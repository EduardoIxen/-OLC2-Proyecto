class Main extends Instruction{
    constructor(instructions, row, column){
        super(row, column);
        this.instructions = instructions;
        this.identificador = "main";
        this.tabla = null;
    }

    interpretar(tree, table){
        this.tabla = table;
        var newTable = new TablaSimbolo(table);
        for(var instr of this.instructions){ //RECORRER TODAS LAS INSTRUCCIONES QUE TIENE DENTRO
            try {
                var value = instr.interpretar(tree, newTable);
            
                if (value instanceof Exception) {
                    tree.getException().push(value);
                    tree.updateConsola(value.toString());
                }
                if (value instanceof Break) {
                    var err = new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", instr.row, instr.column);
                    tree.getException().push(err);
                    tree.updateConsola(err.toString());
                }
                if (value instanceof Continue) {
                    var err = new Exception("Semantico", "Sentencia Continue fuera de ciclo.", instr.row, instr.column);
                    tree.getException().push(err);
                    tree.updateConsola(err.toString());
                }
            } catch (error) {
                console.log(`Sintáctico - (${this.row}, ${this.column})`)
            }
           
        }
    }

    getNodo(){
        var nodo = new NodoAST("MAIN");
        var instrucciones = new NodoAST("INSTRUCCIONES");
        for (var instr of this.instructions) {
            try {
                instrucciones.agregarHijoNodo(instr.getNodo());   
            } catch (error) {
                console.log(`Sintáctico - (${this.row}, ${this.column})`)
            }
        }
        nodo.agregarHijoNodo(instrucciones);
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
            }
            if (instr instanceof DeclaracionArray) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof DeclaracionStruct) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }
            if (instr instanceof DeclaracionArrayRC) {
                salida += instr.getTabla(tree, table, "Local").toString();
            }if (instr instanceof LlamadaFuncion){
                salida += instr.getTabla(tree,table, padre);
            }
        }

        var dict = {}
        dict['Identificador'] = this.identificador.toString();
        dict['Tipo'] = "Funcion principal";
        dict['Tipo2'] = "-------";
        dict['Entorno'] = padre.toString();
        dict['Valor'] = "-------";
        dict['Fila'] =this.row.toString();
        dict['Columna'] =this.column.toString();
        //tree.getTablaTsGlobal().push(dict);
        tree.addTSG(dict);
        return salida;
    }

    compilar(tree, table){
        var gen = tree.getGenerator();
        var conca = '\nvoid main(){\n\tP = 0; H = 0;\n';
        var newTable = new TablaSimbolo(table);

        var symbol = new Simbolo('main', 'VOID', this.row, this.column, ' ', "Global");
        symbol.typeId = 'Function';
        symbol.posGlobal = '--';
        symbol.pos = null;
        tree.pushTsSymbol(symbol);
        for(var instructions of this.instructions){
            var instruction = instructions.compilar(tree, newTable);
            if(instruction instanceof Exception){
                gen.setException(instruction);
            }
            if (tree.breakReturn) {
                gen.setException(new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", this.row, this.column));
                tree.breakReturn = false;
                tree.breakLabel = '';
            }

        }

        tree.updateTsSymbol(symbol, newTable.size)
        conca += tree.getConsola();
        conca += '\n\treturn;\n}\n'

        

        
        tree.setConsola(conca);


    }
}