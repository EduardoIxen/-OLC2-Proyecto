

function execute(){
    
    entrada = editor.getValue();
    instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);


    ast.getInstruccion().map(i =>{
        value = i.interpretar(ast, TsGlobal);
    })
    out.setValue(ast.getConsola());
}