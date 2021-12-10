

function execute(){
    
    entrada = editor.getValue();
    instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones.instr);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);

    console.log(instrucciones.errores); //lista de errores léxicos y sintácticos obtenida
    ast.getInstruccion().map(i =>{
        value = i.interpretar(ast, TsGlobal);
    })
    out.setValue(ast.getConsola());
}