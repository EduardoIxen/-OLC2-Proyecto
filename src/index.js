

function execute(){
    out.setValue("")
    entrada = editor.getValue();
    var instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones.instr);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);
    createNativas(ast);
    console.log(instrucciones.error)
    for(var e of instrucciones.errores){
        ast.getException().push(e);
        ast.updateConsola(e);
    }
    
    for(var instruccion of ast.getInstruccion()){  //PRIMERA PASASDA (ASIGNACIONES Y DECLARACIONES)
        if (instruccion instanceof Funcion) {
            ast.addFuncion(instruccion);
        }
        if ((instruccion instanceof Declaracion) || (instruccion instanceof Asignacion) || (instruccion instanceof DeclaracionArray) || (instruccion instanceof DeclaracionStruct) || (instruccion instanceof AsignacionStruct)) { //falta asignacion de arreglos
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
    contador = 0;
    for(var instruccion of ast.getInstruccion()){  // Segunda pasada para el main
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
        || (instruccion instanceof Funcion) || (instruccion instanceof DeclaracionArray) 
        || (instruccion instanceof DeclaracionStruct) || (instruccion instanceof AsignacionStruct))) {  //falta  asignacion de arreglos
            var err = new Exception("Semantico", "Sentencia fuera de main.", instruccion.row, instruccion.column);
            ast.getException().push(err);
            ast.updateConsola(err.toString());
        }
    }
    taS = "";

    for(var instruccion of ast.getInstruccion()){
        if (instruccion instanceof Declaracion) {
            taS += instruccion.getTabla(ast, TsGlobal, "Global").toString();
        }
        if (instruccion instanceof Funcion || instruccion instanceof Main) {
            taS += instruccion.getTabla(ast, instruccion.tabla, "Global");
        }
        if (instruccion instanceof DeclaracionArray || instruccion instanceof DeclaracionStruct) {
            taS += instruccion.getTabla(ast, TsGlobal, "Global");
        }
    }

    var init = new NodoAST("RAIZ");
    var instruc = new NodoAST("INSTRUCCIONES");
    for(var instruAST of ast.getInstruccion()) {
        instruc.agregarHijoNodo(instruAST.getNodo());
    }
    init.agregarHijoNodo(instruc)
    var grafo = ast.getDot(init); //devuelve el codigo de graphviz
    document.getElementById("tabla-reporte").innerHTML = tablaError(ast.getException());
    document.getElementById("tabla-simbolo").innerHTML = tablaSimbolo(ast.getTablaSimbolos()); //probar
    outCosole.setValue(ast.getConsola());
    graph.setValue(grafo);

}
function tablaError(error){
    var tablaError = '';
    tablaError += "<thead><tr><th scope=\"col\">Tipo</th>";
    tablaError += "<th>Descripcion</th>";
    tablaError += "<th>Fila</th>";
    tablaError += "<th>Columna</th></tr></thead>";
    tablaError += "<tbody>";
    for(var i of error){
        tablaError += `<tr><td>${Object.values(i)[0]}</td>`;
        tablaError += `<td>${Object.values(i)[1]}</td>`;
        tablaError += `<td>${Object.values(i)[2]}</td>`;
        tablaError += `<td>${Object.values(i)[3]}</td></tr>`;
    }
    tablaError += "</tbody>";
    return tablaError;
}

function tablaSimbolo(simbolo){
    var tablaSimbolo = '';
    tablaSimbolo += "<thead><tr><th scope=\"col\">ID</th>";
    tablaSimbolo += "<th>Tipo</th>";
    tablaSimbolo += "<th>Tipo2</th>";
    tablaSimbolo += "<th>Entorno</th>";
    tablaSimbolo += "<th>Valor</th>";
    tablaSimbolo += "<th>Fila</th>";
    tablaSimbolo += "<th>Columna</th></tr></thead>";
    tablaSimbolo += "<tbody>";

    for (var simb of simbolo) {
        tablaSimbolo += '<tr>'
        tablaSimbolo += `<td>${simb['Identificador']}</td>`
        tablaSimbolo += `<td>${simb['Tipo']}</td>`
        tablaSimbolo += `<td>${simb['Tipo2']}</td>`
        tablaSimbolo += `<td>${simb['Entorno']}</td>`
        tablaSimbolo += `<td>${simb['Valor']}</td>`
        tablaSimbolo += `<td>${simb['Fila']}</td>`
        tablaSimbolo += `<td>${simb['Columna']}</td>`
        tablaSimbolo += '</tr>'
    }
    tablaSimbolo += '</tbody>'
    

    return tablaSimbolo;
}

function createNativas(ast){

    var name = "cos";
    var parameters = [{tipo:Tipo.ENTERO, identificador:'01-Native-Cos'}];
    var instructions = [];
    var func = new Cos(name, parameters, instructions, -1, -1);
    ast.addFuncion(func);

    name = "sin";
    parameters = [{tipo:Tipo.ENTERO, identificador:'02-Native-Sin'}];
    instructions = [];
    func = new Sin(name, parameters, instructions, -1, -1);
    ast.addFuncion(func);
    
    name = "tan";
    parameters = [{tipo:Tipo.ENTERO, identificador:'03-Native-Tan'}];
    instructions = [];
    func = new Tan(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "log10";
    parameters = [{tipo:Tipo.ENTERO, identificador:'04-Native-Log10'}];
    instructions = [];
    func = new Log10(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "sqrt";
    parameters = [{tipo:Tipo.ENTERO, identificador:'05-Native-Sqrt'}];
    instructions = [];
    func = new Sqrt(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "pow";
    parameters = [{tipo:Tipo.ENTERO, identificador:'06-Native-Pow'}, {tipo:Tipo.ENTERO, identificador:'07-Native-Pow'}];
    instructions = [];
    func = new Pow(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "string";
    parameters = [{tipo:Tipo.STRING, identificador:'08-Native-String'}];
    instructions = [];
    func = new ConvertString(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "toInt";
    parameters = [{tipo:Tipo.STRING, identificador:'09-Native-ToInt'}];
    instructions = [];
    func = new ToInt(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "toDouble";
    parameters = [{tipo:Tipo.STRING, identificador:'10-Native-ToDouble'}];
    instructions = [];
    func = new ToDouble(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

    name = "typeof";
    parameters = [{tipo:Tipo.STRING, identificador:'11-Native-TypeOf'}];
    instructions = [];
    func = new TypeOf(name, parameters, instructions,-1, -1);
    ast.addFuncion(func);

}


function handleFileCharge(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
  
function handleFileSelect(event){
    var reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}
  
function handleFileLoad(event){
    editor.setValue("")
    var result = event.target.result;
    editor.setValue(result)
}

function executeCompiler(){
    out.setValue("");
    entrada = editor.getValue();
    var instrucciones = gramatica.parse(entrada.toString());
    var ast = new Arbol(instrucciones.instr);
    var TsGlobal = new TablaSimbolo(null);
    ast.setTablaTsGlobal(TsGlobal);
    var TsGenerator = new Generator();
    ast.setGenerator(TsGenerator)
    // createNativas(ast);

    for(var instruction of ast.getInstruccion()){
        var result = instruction.compilar(ast, TsGlobal);
    }
    
    var consola = '';
    consola += ast.getGenerator().getHeader().toString();
    consola += '\nvoid main(){\n'
    consola += ast.getConsola();
    consola += '}\n'
    ast.setConsola(consola); 
    out.setValue(ast.getConsola())


}