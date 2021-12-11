

function execute(){
    
    entrada = editor.getValue();
    var instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones.instr);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);

    // console.log(instrucciones.errores); //lista de errores léxicos y sintácticos obtenida

    for(var e of instrucciones.errores){
        ast.getException().push(e);
        ast.updateConsola(e);
    }
    
    for(var instruccion of ast.getInstruccion()){  //PRIMERA PASASDA (ASIGNACIONES Y DECLARACIONES)
        if (instruccion instanceof Funcion) {
            ast.addFuncion(instruccion);
        }
        if ((instruccion instanceof Declaracion) || (instruccion instanceof Asignacion) || (instruccion instanceof Declaracion)) { //falta declaracion y asignacion de arreglos
            var value = instruccion.interpretar(ast, TsGlobal);
            if(value instanceof Exception){
                ast.getException().push(value);
                ast.updateConsola(value.toString());
            }
            if (instruccion instanceof Break) {
                var err = new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
            }
            if (instruccion instanceof Continue) {
                var err = new Exception("Semantico", "Sentencia Continue fuera de ciclo.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
            }
        }
    }
    for(var instruccion of ast.getInstruccion()){  // Segunda pasada para el main
        contador = 0;
        if (instruccion instanceof Main) {
            contador += 1;
            if (contador == 2) {
                var err = new Exception("Semantico", "Existen dos funciones main.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
                break;
            }
            var value = instruccion.interpretar(ast, TsGlobal);
            if (value instanceof Exception) {
                ast.getException().push(value);
                ast.updateConsola(value.toString());
            }
            if (value instanceof Break) {
                var err = new Exception("Semantico", "Sentencia BREAK fuera de ciclo.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
            }
            if (value instanceof Continue) {
                var err = new Exception("Semantico", "Sentencia Continue fuera de ciclo.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
            }
            if (value instanceof Return) {
                var err = new Exception("Semantico", "Sentencia Return fuera de ciclo.", instruccion.row, instruccion.column);
                ast.getException().push(err);
                ast.updateConsola(err.toString());
            }
        }
    }
    for(var instruccion of ast.getInstruccion()){
        if (!((instruccion instanceof Main) || (instruccion instanceof Declaracion) || (instruccion instanceof Asignacion)
        || (instruccion instanceof Funcion))) {  //falta delaracion y asignacion de arreglos
            console.log("fueraM",instruccion);
            var err = new Exception("Semantico", "Sentencia fuera de main.", instruccion.row, instruccion.column);
            ast.getException().push(err);
            ast.updateConsola(err.toString());
        }
    }
    out.setValue(ast.getConsola());
}