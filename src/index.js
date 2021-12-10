

function execute(){
    
    entrada = editor.getValue();
    instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones.instr);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);

    console.log(instrucciones.errores); //lista de errores léxicos y sintácticos obtenida

    for(var e of instrucciones.errores){
        ast.getException().push(e);
        ast.updateConsola(e.toString());
    }
    ast.getInstruccion().map(i =>{
        var value = i.interpretar(ast, TsGlobal);
        if(value instanceof Exception){
            ast.getException().push(value);
            ast.updateConsola(value.toString());
        }
    })
    out.setValue(ast.getConsola());
}