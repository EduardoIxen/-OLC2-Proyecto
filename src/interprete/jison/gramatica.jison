/*****************************************
 * Ejemplo Intérprete Sencillo con Jison *
 *****************************************/

/* description: Parses and executes mathematical expressions. */
%{
        var listaErrores = [];
        var listaGramatical = [];
%}

/* lexical grammar */
%lex
%x string
%options case-sensitive
%%

\s+                   /* skip whitespace */
"//".*               /*Comentario de una linea*/
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

/**************
 * RESERVADAS *
 **************/  
"println"   return 'RPRINTLN';
"print"     return 'RPRINT';
"if"        return 'RIF';
"else"      return 'RELSE';
"switch"    return 'RSWITCH';
"case"      return 'RCASE';
"default"   return 'RDEFAULT';
"break"     return 'RBREAK';
"while"     return 'RWHILE';
"do"        return 'RDO';
"continue"  return 'RCONTINUE';
"return"    return 'RRETURN'
"begin"     return 'REND';
"struct"    return 'RSTRUCT';
"main"      return 'RMAIN';
"for"       return 'RFOR';
"in"        return 'RIN';

/***********
 * Nativas *
 ***********/ 
"toLowercase"           return 'RTOLOWERCASE';
"toUppercase"           return 'RTOUPPERCASE';
"parse"                 return 'RPARSE';
"length"                return 'RLENGTH';
"caracterOfPosition"    return 'RCARACTEROFPOSITION';
"subString"             return 'RSUBSTRING';
"push"                  return 'RPUSH'
"pop"                   return 'RPOP'

/******************
 * Tipo de Datos  *
 ******************/ 
"null"      return 'RNULL';
"int"       return 'RINT';
"double"    return 'RDOUBLE';
"boolean"   return 'RBOOLEAN';
"true"      return 'RTRUE';
"false"     return 'RFALSE';
"char"      return 'RCHAR';
"String"    return 'RSTRING';
"void"      return "RVOID";

/*************************
 * Expresiones Regulares *
 *************************/ 
[0-9]+("."[0-9]+)+\b            return 'RDECIMAL';
[0-9]+\b                        return 'RENTERO';
\'([^\\\"]|\\.)\'               return 'RCARACTER';
([a-zA-Z])([a-zA-Z0-9_])*       return 'identificador';

/**************
 * OPERADORES *
 **************/
"&&"            return 'tk_and'
":"	        return 'tk_dospuntos';
";"             return 'tk_puntocoma';
"{"		return 'tk_llavea';
"}"		return 'tk_llavec';
"["             return 'tk_cora';
"]"             return "tk_corc"
"("             return 'tk_para';
")"             return 'tk_parc';
"&"             return 'tk_concatenacion';
";"             return 'tk_puntocoma';
"$"             return 'tk_dolar';
","             return 'tk_coma';
"++"            return 'tk_masmas';
"--"            return 'tk_menosmenos';
"#"             return 'tk_numeral';
"?"             return 'tk_interrogacion';
"^"             return 'tk_repeticion';
"."             return 'tk_punto';

/**************
 * Aritmética *
 **************/    
"+"             return 'tk_mas';
"-"		return 'tk_menos';
"*"		return 'tk_por';
"/"		return 'tk_dividido';
"%"             return 'tk_modulo';

/**************
 * Relacional *
 **************/ 
"!="		return 'tk_diferente';
"<="		return 'tk_menorigual';
">="		return 'tk_mayorigual';
"<"		return 'tk_menorque';
">"		return 'tk_mayorque';
"=="		return 'tk_dobleigual';
"="		return 'tk_igual';

/**********
 * Lógica *
 **********/ 

"||"		return 'tk_or';
"!"		return 'tk_not';



["]                             {cadena="";this.begin("string");}
<string>[^"\\]+                 {cadena+=yytext;}
<string>"\\\""                  {cadena+="\"";}
<string>"\\n"                   {cadena+="\n";}
<string>\s+                     {cadena+=" ";}
<string>"\\t"                   {cadena+="\t";}
<string>"\\\\"                  {cadena+="\\";}
<string>"\\\'"                  {cadena+="\'";}
<string>["]                     {yytext=cadena; this.popState(); return 'RCADENA';}


<<EOF>>               return 'EOF';
.                     { 
        listaErrores.push(new Exception("Léxico", "No se reconoce "+yytext, yylloc.first_line,  yylloc.first_column));
        }

/lex

/* operator associations and precedence */

%left 'tk_concatenacion'
%left 'tk_interrogacion'
%left 'tk_or'
%left 'tk_and'
%right 'UNOT'
%left 'tk_repeticion'
%left 'tk_dobleigual' 'tk_diferente' 'tk_menorque' 'tk_menorigual' 'tk_mayorque' 'tk_mayorigual'
%left 'tk_mas' 'tk_menos'
%left 'tk_por' 'tk_dividido' 'tk_modulo'
// %left 'RPOW' 'RSQRT'
%left UMINUS
%left 'tk_para' 'tk_parc'

%start init

%% /* language grammar */

init 
        : instrucciones EOF                     {       $$ = $1;
                                                        //var retornoErrores = Object.assign([], listaErrores);
                                                        var retornoErrores = listaErrores;
                                                        var retornoGramatical = listaGramatical;
                                                        listaErrores = [];
                                                        listaGramatical = [];
                                                        return {instr:$$, errores:retornoErrores, gramatical:retornoGramatical}
                                                }
;


instrucciones
	: instrucciones instruccion             { $1.push($2); $$ = $1; listaGramatical.push({prod:"<instrucciones> ::= <instrucciones> <instruccion>", regla: "instrucciones.lista = instrucciones.lista.add(instruccion.val);"});} // Recursivo por la izquierda.
	| instruccion				{ $$ = [$1]; listaGramatical.push({prod:"<instrucciones> ::= <instruccion>", regla:"instrucciones.lista = [instruccion];"});}
;

instruccion
        : imprimir_instr fin_instr               { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <imprimir_instr> tk_puntocoma", regla:"instrucciones.instr = imprimir_instr.instr;"});}
        | declaracion_instr fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <declaracion_instr> tk_puntocoma", regla:"instrucciones.instr = declaracion_instr.instr;"});}
        | asignacion_instr fin_instr             { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <asignacion_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_instr.instr;"});}
        | if_instr                               { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <if_instr>", regla:"instrucciones.instr = if_instr.instr;"});}
        | switch_instr                           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <switch_instr>", regla:"instrucciones.instr = switch_instr.instr;"});}
        | while_instr                            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <while_instr>", regla:"instrucciones.instr = while_instr.instr;"});}
        | break_instr                            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <break_instr>", regla:"instrucciones.instr = break_instr.instr;"});}
        | continue_instr                         { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <continue_instr>", regla:"instrucciones.instr = continue_instr.instr;"});}
        | return_instr                           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <return> instr", regla:"instrucciones.instr = return_instr.instr;"});}
        | do_while_instr                         { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <do_while_instr>", regla:"instrucciones.instr = doWhile_instr.instr;"});}
        | funcion_instr                          { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <funcion_instr>", regla:"instrucciones.instr = funcion_instr.instr;"});}
        | llamada_instr fin_instr                { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <llamada_instr> tk_puntocoma", regla:"instrucciones.instr = llamada_instr.instr;"});}
        | main_instr                             { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <main_instr>", regla:"instrucciones.instr = main_instr.instr;"});}
        | for_instr                              { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <for_instr>", regla:"instrucciones.instr = for_instr.instr;"});}
        | incre_decre_instr fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <incre_decre_instr> tk_puntocoma", regla:"instrucciones.instr = incre_decre_instr.instr;"});}
        | declaracion_array_instr fin_instr      { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <declaracion_array_instr> tk_puntocoma", regla:"instrucciones.instr = declaracion_array_instr.instr;"});}
        | struct_instr fin_instr                 { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <struct_instr> tk_puntocoma", regla:"instrucciones.instr = struct_instr.instr;"});}
        | asignacion_struct fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <asignacion_struct_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_struct_instr.instr;"});}
        | assign_array_instr fin_instr           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <assign_array_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_array_instr.instr;"});}
        | modificar_acceso_struct fin_instr      { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <modificar_acceso_struct> tk_puntocoma", regla:"instrucciones.instr = modificar_acceso_struct_instr.instr;"});}
        | error tk_puntocoma                     {
                                                listaErrores.push(new Exception("Sintáctico", "No se esperaba "+yytext, @1.first_line, @1.first_column)); }
;

instruccion2
        : imprimir_instr fin_instr               { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <imprimir_instr> tk_puntocoma", regla:"instrucciones.instr = imprimir_instr.instr;"});}
        | declaracion_instr fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <declaracion_instr> tk_puntocoma", regla:"instrucciones.instr = declaracion_instr.instr;"});}
        | asignacion_instr fin_instr             { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <asignacion_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_instr.instr;"});}
        // | if_instr                               { $$ = $1; }
        | switch_instr                           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <switch_instr>", regla:"instrucciones.instr = switch_instr.instr;"});}
        | while_instr                            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <while_instr>", regla:"instrucciones.instr = while_instr.instr;"});}
        | break_instr                            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <break_instr>", regla:"instrucciones.instr = break_instr.instr;"});}
        | continue_instr                         { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <continue_instr>", regla:"instrucciones.instr = continue_instr.instr;"});}
        | return_instr                           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <return_instr>", regla:"instrucciones.instr = return_instr.instr;"});}
        | do_while_instr                         { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <do_while_instr>", regla:"instrucciones.instr = doWhile_instr.instr;"});}
        | funcion_instr                          { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <funcion_instr>", regla:"instrucciones.instr = funcion_instr.instr;"});}
        | llamada_instr fin_instr                { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <llamada_instr> tk_puntocoma", regla:"instrucciones.instr = llamada_instr.instr;"});}
        | main_instr                             { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <main_instr>", regla:"instrucciones.instr = main_instr.instr;"});}
        | for_instr                              { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <for_instr>", regla:"instrucciones.instr = for_instr.instr;"});}
        | incre_decre_instr fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <incre_decre_instr> tk_puntocoma", regla:"instrucciones.instr = incre_decre_instr.instr;"});}
        | declaracion_array_instr fin_instr      { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <declaracio_array_instr> tk_puntocoma", regla:"instrucciones.instr = declaracion_array_instr.instr;"});}
        | struct_instr fin_instr                 { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <struct_instr> tk_puntocoma", regla:"instrucciones.instr = struct_instr.instr;"});}
        | asignacion_struct fin_instr            { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <asignacion_struct_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_struct_instr.instr;"});}
        | assign_array_instr fin_instr           { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <assign_array_instr> tk_puntocoma", regla:"instrucciones.instr = asignacion_array_instr.instr;"});}
        | modificar_acceso_struct fin_instr      { $$ = $1; listaGramatical.push({prod:"<instruccion> ::= <modificar_acceso_struct_instr> tk_puntocoma", regla:"instrucciones.instr = modificar_acceso_struct_instr.instr;"});}
        | error tk_puntocoma                     {
                                                listaErrores.push(new Exception("Sintáctico", "No se esperaba "+yytext, @1.first_line, @1.first_column)); }
;

fin_instr
        : tk_puntocoma                          {}
        |                                       {}
;

/************************************* [MAIN] ************************************/
main_instr
        : RVOID RMAIN tk_para tk_parc tk_llavea instrucciones tk_llavec         { $$ = new Main($6, @1.first_line, @1.first_column);
         listaGramatical.push({prod:"<main_instr> ::= RVOID RMAIN tk_para tk_parc tk_llavea <instrucciones> tk_llavec", regla:"main_instr.instr = new Main(instrucciones.list);"});}
;

/************************************* [PRINT] y [PRINTLN] ************************************/                                     
imprimir_instr
        : RPRINTLN tk_para parametros_llamada tk_parc	{ $$ = new Println($3, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<imprimir_instr> ::= RPRINTLN tk_para <parametros_llamada> tk_parc", regla:"imprimir_instr.instr = new Println(parametros_llamada.list);"});}
        | RPRINT tk_para parametros_llamada tk_parc	{ $$ = new Print($3,   @1.first_line, @1.first_column);   
        listaGramatical.push({prod:"<imprimir_instr> ::= RPRINT tk_para <parametros_llamada> tk_parc", regla:"imprimir_instr.instr = new Println(parametros_llamada.list);"});}
;

/***************************************** [DECLARACION] ***************************************/     
declaracion_instr
         : TIPO identificador tk_igual expresion { $$ = new Declaracion($1, $2, $4,   @1.first_line, @1.first_column); 
         listaGramatical.push({prod:"<declaracion_instr> ::= <TIPO> identificador tk_igual <expresion>", regla:"declaracion_instr.instr = new Declaracion(TIPO, identificador.val, expresion.val);"});}
         | TIPO LISTA_ID                         { $$ = new Declaracion($1, $2, null, @1.first_line, @1.first_column); 
         listaGramatical.push({prod:"<declaracion_instr> ::= <TIPO> <LISTA_ID>", regla:"declaracion_instr.instr = new Declaracion(TIPO, lista_id);"});}
;

/************************************** [DECLARACION][ARREGLO] ***********************************/     
declaracion_array_instr:
          TIPO tk_cora tk_corc identificador tk_igual valores_array                     {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);
          listaGramatical.push({prod:"<declaracion_array_instr> ::= <TIPO> tk_cora tk_corc identificador tk_igual <valores_array>", regla:"declaracion_array_instr.instr = new DeclaracionArray(TIPO, identificador.val, valores_array.list);"});}
        | TIPO tk_cora tk_corc identificador tk_igual identificador list_position       {$$ = new DeclaracionArray($1, $4, new AccesoArreglo($6,$7, @1.first_line, @1.first_column), @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<declaracion_array_instr> ::= <TIPO> tk_cora tk_corc identificador tk_igual identificador <list_position>", regla:"declaracion_array_instr.instr = new DeclaracionArray(TIPO, identificador.val, valores_array.list);"});}
        | TIPO tk_cora tk_corc identificador tk_igual identificador                     {$$ = new DeclaracionArrayRC($1, $4, $6,false, @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<declaracion_array_instr> ::= <TIPO> tk_cora tk_corc identificador tk_igual identificador", regla:"declaracion_array_instr.instr = new DeclaracionArrayRC(TIPO, identificador.val, identificador.val, false);"});}
        | TIPO tk_cora tk_corc identificador tk_igual tk_numeral identificador          {$$ = new DeclaracionArrayRC($1, $4, $7,true, @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<declaracion_array_instr> ::= <TIPO> tk_cora tk_corc identificador tk_igual tk_numeral identificador", regla:"declaracion_array_instr.instr = new DeclaracionArrayRC(TIPO, identificador.val, identificador.val, true);"});}
;

valores_array:
        tk_cora lista_valores_array tk_corc                     {$$ = $2; listaGramatical.push({prod:"<valores_array> ::= tk_cora <lista_valores_array> tk_corc", regla:"valores_array.val = lista_valores_array.val;"});}
        | tk_cora tk_corc                                       {$$ = []; listaGramatical.push({prod:"<valores_array> ::= tk_cora tk_corc", regla:"valores_array.val = [];"});}
;

lista_valores_array:
        lista_valores_array tk_coma valores                     {$1.push($3); $$ = $1; listaGramatical.push({prod:"<lista_valores_array> ::= <lista_valores_array> tk_coma valores", regla:"lista_valores_array.lista = lista_valores_array.lista.push(valores.val);"});}
        | valores                                               {$$ = [$1]; listaGramatical.push({prod:"<lista_valores_array> ::= valores", regla:"lista_valores_array.lista = [valores];"});}
;

valores:  valores_array                                         {$$ = $1; listaGramatical.push({prod:"<valores> ::= <valores_array>", regla:"valores.val = valores_array.lista;"});}
        | expresion                                             {$$ = $1; listaGramatical.push({prod:"<valors> ::= <expresion>", regla:"valores.val = expresion.val"});}
;

/***************************************** [ACCESO ARREGLO] ***************************************/   
assign_array_instr
        : identificador list_position tk_igual expresion        {$$ = new AccesoArreglo($1, $2, @1.first_line, @1.first_column, $4);
        listaGramatical.push({prod:"<assign_array_instr> ::= identificador <list_position> tk_igual <expresion>", regla:"assign_array_instr.instr = new AccesoArreglo(identificador.val, list_position.list, expresion.val);"});}
        | identificador list_position tk_igual valores_array    {$$ = new AccesoArreglo($1, $2, @1.first_line, @1.first_column, $4);
        listaGramatical.push({prod:"<assign_array_instr> ::= identificador <list_position> tk_igual <valores_array>", regla:"assign_array_instr.instr = new AccesoArreglo(identificador.val, list_position.list, valores_array.list);"});}
        | identificador tk_igual valores_array                  {$$ = new AccesoArreglo($1, null, @1.first_line, @1.first_column, $3);
        listaGramatical.push({prod:"<assign_array_instr> ::= identificador tk_igual <valores_array>", regla:"assign_array_instr.instr = new AccesoArreglo(identificador.val, valores_array.list);"});}
;

list_position
        : list_position expression_acces                        {$1.push($2); $$ = $1;
         listaGramatical.push({prod:"<list_position> ::= <list_position> <expresssion_acces>", regla:"list_position.list = list_position.list.push(expression_acces.list);"});}
        | expression_acces                                      {$$ = [$1]; 
        listaGramatical.push({prod:"<list_position> ::= <expression_acces>", regla:"list_position.list = [expression_acces.val]"});}
;

expression_acces
        : tk_cora expresion tk_corc                             {$$ = $2; 
        listaGramatical.push({prod:"<expression_acces> ::= tk_cora <expresion> tk_corc", regla:"expression_acces.val = expresion.val"});}
;


/***************************************** [ASIGNACION] ***************************************/   
asignacion_instr
         : identificador tk_igual expresion      { $$ = new Asignacion($1, $3, @1.first_line, @1.first_column); 
         listaGramatical.push({prod:"<asignacion_instr> ::= identificador tk_igual <expresion>", regla:" asignacion_instr.instr = new Asignacion(identificador.val, expresion.val);"});}
;

/***************************************** [INCREMENTO] ***************************************/   
incre_decre_instr
        : identificador tk_masmas                { $$= new Incremento($1, true, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<incre_decre_instr> ::= identificador tk_masmas", regla:"incre_decre_instr.instr = new Incremento(identificador.val);"});}
        | identificador tk_menosmenos            { $$= new Decremento($1, true, @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<incre_decre_instr> ::= identificador tk_menosmenos", regla:"incre_decre_instr.instr = new Decremento(identificador.val);"});}
;

l_incre_decre_instr
        : tk_menosmenos identificador            { $$= new Decremento($2, false, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<l_incre_decre_instr> ::= tk_menosmenos identificador", regla:"l_incre_decre_instr.instr = new Decremento(identificador.val);"});}
        | tk_masmas identificador                { $$= new Incremento($2, false, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<l_incre_decre_instr> ::= tk_masmas identificador", regla:"l_incre_decre_instr.instr = new Incremento(identificador.val);"});}
;

/********************************************* [CONDICIONAL][IF] *********************************************/    
if_instr  
        : RIF tk_para expresion tk_parc BLOCK_IF                        {$$ = new If($3, $5, null, null, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<if_instr> ::= <RIF> tk_para <expresion> tk_parc <BLOCK_IF>", regla:"if_instr.instr = new If(expresion.val, BLOCK_IF.list);"});}
        | RIF tk_para expresion tk_parc BLOCK_IF RELSE BLOCK_IF         {$$ = new If($3, $5, $7, null,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<if_instr> ::= <RIF> tk_para <expresion> tk_parc <BLOCK_IF> <RELSE> <BLOCK_IF>", regla:"if_instr.instr = new If(expresion.val, BLOCK_IF.list, BLOCK_IF.list);"});}
        | RIF tk_para expresion tk_parc BLOCK_IF RELSE if_instr         {$$ = new If($3, $5, null, $7,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<if_instr> ::= <RIF> tk_para <expresion> tk_parc <BLOCK_IF> <RELSE> <if_instr>", regla:"if_instr.instr = new If(expresion.val, BLOCK_IF.list, if_instr.instr);"});}
;

BLOCK_IF
        : tk_llavea instrucciones tk_llavec     { $$ = $2; listaGramatical.push({prod:"<BLOCK_IF> ::= tk_llavea <instrucciones> tk_llavec", regla:"BLOCK_IF.list = instrucciones.list;"});}
        | instruccion2                          { $$ = $1; listaGramatical.push({prod:"<BLOCK_IF> ::= <instruccion2>", regla:"BLOCK_IF.list = instruccion2.list"});}
;

/********************************************* [CONDICIONAL][SWITCH] *********************************************/    
switch_instr
        : RSWITCH tk_para expresion tk_parc tk_llavea list_case default_intr tk_llavec            {$$ = new Switch($3, $6, $7,   @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<switch_instr> ::= RSWITCH tk_para <expresion> tk_parc tk_llavea <list_case> <default_intr> tk_llavec", regla:"switch.instr = new Switch(expresion.val, list_case.list, default_instr.list);"});}
        | RSWITCH tk_para expresion tk_parc tk_llavea list_case tk_llavec                         {$$ = new Switch($3, $6, null, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<switch_instr> ::= RSWITCH tk_para <expresion> tk_parc tk_llavea <list_case> tk_llavec", regla:"switch_instr.instr = new Switch(expresion.val, list_case.list);"});}
        | RSWITCH tk_para expresion tk_parc tk_llavea default_intr tk_llavec                      {$$ = new Switch($3, null, $6, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<switch_instr> ::= RSWITCH tk_para <expresion> tk_parc tk_llavea <default_intr> tk_llavec", regla:"switch_instr.instr = new Switch(expresion.val, default_instr.list);"});}
;

//                                      [LISTA DE CASE]
list_case
        : list_case case_instr             { $1.push($2); $$ = $1; listaGramatical.push({prod:"<list_case> ::= <list_case> <case_instr>", regla:"list_case.list = list_case.list.push(case_instr);"});} 
	| case_instr			    { $$ = [$1]; listaGramatical.push({prod:"<list_case> ::= <case_instr>", regla:"list_case.list = [case_instr]"});}
;

//                                          [CASE]
case_instr
        : RCASE expresion tk_dospuntos instrucciones            {$$ = new Case($2, $4, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<case_instr> ::= RCASE <expresion> tk_dospuntos <instrucciones>", regla:"case_instr.instr = new Case(expresion.val, instrucciones.list);"});}
;

//                                          [DEFAULT]
default_intr
        : RDEFAULT tk_dospuntos instrucciones                   {$$ = new Default($3, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<default_intr> ::= RDEFAULT tk_dospuntos <instrucciones>", regla:"default_instr.instr = new Default(instrucciones.list);"});}
;

LISTA_ID: LISTA_ID tk_coma identificador        { $1.push($3); $$ = $1;
        listaGramatical.push({prod:"<LISTA_ID> ::= <LISTA_ID> tk_coma identificador", regla:"LISTA_ID.list = LISTA_ID.list.push(identificador);"});}
        | identificador                         { $$=[$1]; 
        listaGramatical.push({prod:"<LISTA_ID> ::= identificador", regla:"LISTA_ID.list = [identificador];"});}
;

/***************************************** [LOOP][WHILE] ***************************************/   
while_instr
        : RWHILE tk_para expresion tk_parc tk_llavea instrucciones tk_llavec        { $$ = new While($3, $6, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<while_instr> ::= RWHILE tk_para <expresion> tk_parc tk_llavea <instrucciones> tk_llavec", regla:"while_instr.instr = new While(expresion.val, instrucciones.list);"});}
;

/***************************************** [LOOP][DO WHILE] ***************************************/   
do_while_instr
        : RDO tk_llavea instrucciones tk_llavec RWHILE tk_para expresion tk_parc tk_puntocoma    { $$ = new Do_While($7, $3, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<do_while_instr> ::= RDO tk_llavea <instrucciones> tk_llavec RWHILE tk_para <expresion> tk_parc tk_puntocoma", regla:"do_while_instr.instr = new Do_While(expresion.val, instrucciones.list);"});}
;

/***************************************** [LOOP][FOR] ***************************************/   
for_instr 
        : RFOR tk_para declaracion_for tk_puntocoma expresion tk_puntocoma asignacion_for tk_parc tk_llavea instrucciones tk_llavec               {$$ = new For($3, $5, $7, $10, Tipo.ENTERO, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<for_instr> ::= RFOR tk_para <declaracion_for> tk_puntocoma <expresion> tk_puntocoma <asignacion_for> tk_parc tk_llavea <instrucciones> tk_llavec", regla:"for_instr.instr = new For(declaracion_for.val, expresion.val, asignacion, instrucciones.list);"});}
        | RFOR identificador RIN expresion tk_llavea instrucciones tk_llavec            {$$ = new For($2, null, $4, $6, Tipo.STRING, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<for_instr> ::= RFOR identificador RIN <expresion> tk_llavea <instrucciones> tk_llavec", regla:"for_instr.instr = new For(identificador.val, expresion.val, instrucciones.list);"});}
        | RFOR identificador RIN valores_array tk_llavea instrucciones tk_llavec        {$$ = new For($2, null, $4, $6, Tipo.ARRAY, @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<for_instr> ::= RFOR identificador RIN <valores_array> tk_llavea <instrucciones> tk_llavec", regla:"for_instr.instr = new For(identificador.val, expresion.val, instrucciones.list);"});}
;

asignacion_for 
        : asignacion_instr              {$$ = $1; listaGramatical.push({prod:"<asignacion_for> ::= <asignacion_instr>", regla:"asignacion_for.val = asignacion_instr.instr;"});}
        | incre_decre_instr             {$$ = $1; listaGramatical.push({prod:"<asignacion_for> ::= <incre_decre_instr>", regla:"asignacion_for.val = incre_decre_instr.instr;"});}
;

declaracion_for
        : declaracion_instr             {$$ = $1; listaGramatical.push({prod:"<declaracion_for> ::= <declaracion_instr>", regla:"declaracion_for.val = declaracion_instr.instr"});}
        | asignacion_instr              {$$ = $1; listaGramatical.push({prod:"<declaracion_for> ::= <asignacion_instr>", regla:"declaracion_for.val = asignacion_instr.instr;"});}
        | identificador                 {$$ = new Identificador($1, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<declaracion_for> ::= identificador", regla:"declaracion_for.val = new Identificador(identificador.val);"});}
;

/***************************************** [BREAK] ***************************************/  
break_instr
        : RBREAK tk_puntocoma                   {$$ = new Break(@1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<break_instr> ::= RBREAK tk_puntocoma", regla:"break_intr.intr = new Break();"});}
;

/***************************************** [CONTINUE] ***************************************/  
continue_instr
        : RCONTINUE tk_puntocoma                {$$ = new Continue(@1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<continue_instr> ::= RCONTINUE tk_puntocoma", regla:"continue_instr.instr = new Continue();"});}
;

/***************************************** [RETURN] ***************************************/  
return_instr
        : RRETURN expresion tk_puntocoma      {$$ = new Return($2, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<return_instr> ::= RRETURN <expresion> tk_puntocoma", regla:"return_instr.instr = new Return(expresion.val);"});}
        | RRETURN tk_puntocoma                {$$ = new Return(null, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<return_instr> ::= RRETURN tk_puntocoma", regla:"return_instr.instr = new Return();"});}

;

/***************************************** [TERNARIO] ***************************************/   
ternario_instr
        : expresion tk_interrogacion expresion tk_dospuntos expresion   {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<ternario_instr> ::= <expresion> tk_interrogacion <expresion> tk_dospuntos <expresion>", regla:"ternario_instr.intr = new Ternario(expresion.val, expresion.val, expresion.val);"});}
;

/***************************************** [STRUCT][DECLARACION] ***************************************/   
struct_instr
        : RSTRUCT identificador tk_llavea lista_struct tk_llavec      {$$ = new DeclaracionStruct($2, $4, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<struct_instr> ::= RSTRUCT identificador tk_llavea <lista_struct> tk_llavec", regla:"struct_instr.intr = new DeclaracionStruct(identificador.val, lista_struct);"});}
;
  
lista_struct
        : lista_struct tk_coma LIST_STRUCT                        { $1.push($3); $$ = $1; 
        listaGramatical.push({prod:"<lista_struct> ::= <lista_struct> tk_coma <LIST_STRUCT>", regla:"lista_struct.list = lista_struct.list.push(LIST_STRUCT);"});}
        | LIST_STRUCT                                             { $$=[$1]; listaGramatical.push({prod:"list_struct ::= LIST_STRUCT", regla:"list_struct.list = [LIST_STRUCT]"});}
;

LIST_STRUCT
        : TIPO identificador                                     { $$ = {type: $1, name: $2, bool:false}; 
        listaGramatical.push({prod:"<LIST_STRUCT> ::= TIPO identificador", regla:"list_struct.val = {type: TIPO, name: identificador.val}"});}
        | identificador identificador                            { $$ = {type: $1, name: $2, bool:true} ;
        listaGramatical.push({prod:"<LIST_STRUCT> ::= identificador identificador", regla:"list_struct.val = {type: identificador.val, name: identificador.val}"});}
;

/***************************************** [STRUCT][ASIGNACION] ***************************************/   
asignacion_struct
        : identificador identificador tk_igual identificador tk_para parametros_struct tk_parc  {$$ = new AsignacionStruct($1, $2, $4, $6, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<asignacion_struct> ::= identificador identificador tk_igual identificador tk_para parametros_struct tk_parc", regla:"asignacion_struct.val = new AsignacionStruct(identificador.val, identificador.val, identificador.val, parametros_struct.list);"});}
        | identificador identificador tk_igual RNULL                                            {$$ = new AsignacionStruct($1, $2, null, null, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<asignacion_struct> ::= identificador identificador tk_igual RNULL", regla:"asignacion_struct.val = new AsignacionStruct(identificador.val, identificador.val);"});}
        // | identificador identificador tk_igual acceso_struct                                    {$$ = new AsignacionStruct($1, $2, null, $4, @1.first_line, @1.first_column); }
;

parametros_struct
                : parametros_struct tk_coma parametro_struct    { $1.push($3); $$ = $1; 
                listaGramatical.push({prod:"<parametros_struct> ::= <parametros_struct> tk_coma <parametro_struct>", regla:"parametros_struct.list = parametros_struct.list.push(parametro_struct);"});}
                | parametro_struct                              { $$=[$1]; 
                listaGramatical.push({prod:"<parametros_struct> ::= <parametro_struct>", regla:"parametros_struct.list = [parametro_struct];"});}
;

parametro_struct
                : expresion                                     { $$ = $1; listaGramatical.push({prod:"<parametros_struct> ::= <expresion>", regla:"parametro_struct.val = expresion.val;"});}
;

/***************************************** [STRUCT][MOSTRAR] ***************************************/ 
acceso_struct
        : identificador LIST_ACCES_STRUCTS              {$$ = new AccesoStruct($1, $2, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<acceso_struct> ::= identificador <LIST_ACCES_STRUCTS>", regla:"acceso_struct.val = new AccesoStruct(identificador, LIST_ACCES);"});}
;

/***************************************** [STRUCT][MODIFICAR] ***************************************/ 
modificar_acceso_struct
        : acceso_struct tk_igual expresion             {$$ = new ModificarStruct($1, $3, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<modificar_acceso_struct> ::= <acceso_struct> tk_igual <expresion>", regla:"modificar_acceso_struct.val = new ModificarStruct(acceso_struct, expresion.val);"});}
;

/***************************************** [STRUCT][LIST][ATRIBUTOS] ***************************************/ 
LIST_ACCES_STRUCTS
                : LIST_ACCES_STRUCTS LIST_ACCES_STRUCT  { $1.push($2); $$ = $1; 
                listaGramatical.push({prod:"<LIST_ACCES_STRUCTS> ::= <LIST_ACCES_STRUCTS> <LIST_ACCES_STRUCT>", regla:"LIST_ACCES_STRUCT.list = LIST_ACCES_STRUCT.list.push(LIST_ACCES_STRUCT);"});}
                | LIST_ACCES_STRUCT                     { $$=[$1]; 
                listaGramatical.push({prod:"<LIST_ACCES_STRUCTS> ::= <LIST_ACCES_STRUCT>", regla:"LIST_ACCES_STRUCT.list = [LIS_ACCES_STRUCT];"});}
;

LIST_ACCES_STRUCT
                : tk_punto identificador                { $$ = {id:$2}; 
                listaGramatical.push({prod:"<LIST_ACCES_STRUCT> ::= tk_punto identificador", regla:"LIST_ACCES_STRUCT.val = identificador.val;"});}
;


/***************************************** [TIPO] ***************************************/   
TIPO
        : RINT                                  {$$ = Tipo.ENTERO;  listaGramatical.push({prod:"<TIPO> ::= RINT", regla:"TIPO.val = int;"});}
        | RDOUBLE                               {$$ = Tipo.DECIMAL; listaGramatical.push({prod:"<TIPO> ::= RDOUBLE", regla:"TIPO.val = double;"});}
        | RBOOLEAN                              {$$ = Tipo.BOOLEANO;listaGramatical.push({prod:"<TIPO> ::= RBOOLEAN", regla:"TIPO.val = boolean;"});}
        | RCHAR                                 {$$ = Tipo.CARACTER;listaGramatical.push({prod:"<TIPO> ::= RCHAR", regla:"TIPO.val = char;"});}
        | RSTRING                               {$$ = Tipo.STRING;  listaGramatical.push({prod:"<TIPO> ::= RSTRING", regla:"TIPO.val = string;"});}
        | RVOID                                 {$$ = Tipo.VOID;    listaGramatical.push({prod:"<TIPO> ::= RVOIF", regla:"TIPO.val = void;"});}

;

/***************************************** [FUNCIONES] ***************************************/   
funcion_instr
        : TIPO identificador tk_para tk_parc tk_llavea instrucciones tk_llavec                  { $$ = new Funcion($1, $2, [], $6, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<funcion_instr> ::= <TIPO> identificador tk_para tk_parc tk_llavea <instrucciones> tk_llavec", regla:"funcion_instr.instr = new Funcion(TIPO.val, identificador.val, instrucciones.list);"});}
        | TIPO identificador tk_para parametros tk_parc tk_llavea instrucciones tk_llavec       { $$ = new Funcion($1, $2, $4, $7, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<funcion_instr> ::= <TIPO> identificador tk_para <parametros> tk_parc tk_llavea <instrucciones> tk_llavec", regla:"funcion_instr.instr = new Funcion(TIPO.val, identificador.val, parametros.list, instrucciones.list);"});}
        | identificador tk_para tk_parc tk_llavea instrucciones tk_llavec                       { $$ = new Funcion($1, $2, [], $6, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<funcion_instr> ::= identificador tk_para tk_parc tk_llavea <instrucciones> tk_llavec", regla:"funcion_instr.instr = new Funcio(identificador.val, instrucciones.list);"});}
        | identificador identificador tk_para parametros tk_parc tk_llavea instrucciones tk_llavec       { $$ = new Funcion($1, $2, $4, $7, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<funcion_instr> ::= identificador identificador tk_para <parametros> tk_parc tk_llavea <instrucciones> tk_llavec", regla:"funcion_instr.instr = new Funcio(identificador.val, identificador.val, parametros.list, instrucciones.list);"});}
;

/***************************************** [PARAMETROS FUNCION] ***************************************/   
parametros
        : parametros tk_coma parametro          { $1.push($3); $$ = $1; listaGramatical.push({prod:"<parametros> ::= <parametros> tk_coma <parametro>", regla:"parametros.lista = parametros.lista.push(parametro);"});}
        | parametro                             { $$=[$1]; listaGramatical.push({prod:"<parametros> ::= <parametro>", regla:"parametros.lista = [parametro];"});}
;

parametro
        : TIPO identificador                    { $$ = {tipo: $1, identificador: $2} ; 
        listaGramatical.push({prod:"<parametro> ::= <TIPO> identificador", regla:"parametro.tipo = TIPO; parametro.identificador = identificador; "});}
        | TIPO tk_cora tk_corc identificador    { $$ = {tipo: Tipo.ARRAY, identificador: $4, type_init: $1}; 
        listaGramatical.push({prod:"<parametro> ::= <TIPO> tk_cora tk_corc identificador", regla:"parametro.tipo = TIPO.ARRAY; parametro.identificador = identificador; parametro.tipe_init = TIPO;"});}
        | identificador identificador           { $$ = {tipo: $1, identificador: $2}; 
        listaGramatical.push({prod:"<parametro> ::= identificador identificador", regla:"parametro.tipo = identificador.val; parametro.identificador = identificador.val; "});}
;

/**************************************** [LLAMADA FUNCION] *************************************/   
llamada_instr
        : identificador tk_para tk_parc                                 { $$ = new LlamadaFuncion($1, [], @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<llamada_instr> ::= identificador tk_para tk_parc", regla:"llamada_instr.intr = new LamadaFuncion(identificador.val);"});}
        | identificador tk_para parametros_llamada tk_parc              { $$ = new LlamadaFuncion($1, $3, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<llamada_instr> ::= identificador tk_para <parametros_llamada> tk_parc", regla:"llamada_instr.intr = new LamadaFuncion(identificador.val, parametros_llamada.list);"});}
        | nativas_instr                                                 { $$ = $1; 
        listaGramatical.push({prod:"<llamada_instr> ::= <nativas_instr>", regla:"llamada_instr.instr = nativas_intrs.instr;"});}
;


nativas_instr
        : identificador tk_punto RTOLOWERCASE tk_para tk_parc                           { $$ = new ToLowerCase($1, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RTOLOWERCASE tk_para tk_parc", regla:"nativas_instr.instr = new ToLowerCase(identificador.val);"});}
        | identificador tk_punto RTOUPPERCASE tk_para tk_parc                           { $$ = new ToUpperCase($1, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RTOUPPERCASE tk_para tk_parc", regla:"nativas_instr.instr = new ToUpperCase(identificador.val);"});}
        | TIPO tk_punto RPARSE tk_para expresion tk_parc                                { $$ = new Parse($1, $5, @1.first_line, @1.first_column);   
        listaGramatical.push({prod:"<nativas_instr> ::= TIPO tk_punto RPARSE tk_para expresion tk_parc", regla:"nativas_instr.instr = new Parse(identificador.val);"});}
        | identificador tk_punto RLENGTH tk_para tk_parc                                { $$ = new Length($1, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RLENGTH tk_para tk_parc", regla:"nativas_instr.instr = new Length(identificador.val);"});}
        | identificador tk_punto RCARACTEROFPOSITION tk_para expresion tk_parc          { $$ = new CaracterOfPosition($1, $5, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RCARACTEROFPOSITION tk_para expresion tk_parc", regla:"nativas_instr.instr = new CaracterOfPosition(identificador.val, expresion.val);"});}
        | identificador tk_punto RSUBSTRING tk_para expresion tk_coma expresion tk_parc { $$ = new SubString($1, $5, $7, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RSUBSTRING tk_para expresion tk_coma expresion tk_parc", regla:"nativas_instr.instr = new SubString(identificador.val, expresion.val, expresion.val);"});}
        | identificador tk_punto RPUSH tk_para expresion tk_parc                        { $$ = new Push($1, $5, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RPUSH tk_para expresion tk_parc", regla:"nativas_instr.instr = new Push(identificador.val, expresion.val);"});}
        | identificador tk_punto RPOP tk_para tk_parc                                   { $$ = new Pop($1, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<nativas_instr> ::= identificador tk_punto RPOP tk_para tk_parc", regla:"nativas_instr.instr = new Pop(identificador.val);"});}
;


/***************************************** [PARAMETROS LLAMADA] ***************************************/   
parametros_llamada
                : parametros_llamada tk_coma parametro_llamada                  { $1.push($3); $$ = $1; 
                listaGramatical.push({prod:"<parametros_llamada> ::= <parametros_llamada> tk_coma <parametro_llamada>", regla:"parametros_llamada.list = parametros_llamada.list.push(parametro_llamada.val);"});}
                | parametro_llamada                                             { $$=[$1]; 
                listaGramatical.push({prod:"<parametros_llamada> ::= <parametro_llamada>", regla:"parametros_llamada.list = [parametros_llamada];"});}
;

parametro_llamada
                : expresion                                                     { $$ = $1; listaGramatical.push({prod:"parametro_llamada ::= expresion", regla:"parametro_llamada.val = expresion.val;"});}
;

/***************************************** [EXPRESIONES] ***************************************/   
expresion
                /* Aritmética */
        : expresion tk_mas expresion            {$$ = new Aritmetica($1, $3, Operador_Aritmetico.MAS,      @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_mas <expresion>", regla:"expresion.val = new Aritmetica(expresion.val, expresion.val);"});}
        | expresion tk_menos expresion          {$$ = new Aritmetica($1, $3, Operador_Aritmetico.RESTA,    @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_menos <expresion>", regla:"expresion.val = new Aritmetica(expresion.val, expresion.val);"});}
        | expresion tk_por expresion            {$$ = new Aritmetica($1, $3, Operador_Aritmetico.POR,      @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_por <expresion>", regla:"expresion.val = new Aritmetica(expresion.val, expresion.val);"});}
        | expresion tk_dividido expresion       {$$ = new Aritmetica($1, $3, Operador_Aritmetico.DIV,      @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_dividido <expresion>", regla:"expresion.val = new Aritmetica(expresion.val, expresion.val);"});}
        | expresion tk_modulo expresion         {$$ = new Aritmetica($1, $3, Operador_Aritmetico.MODULO,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_modulo <expresion>", regla:"expresion.val = new Aritmetica(expresion.val, expresion.val);"});}
        | tk_menos expresion %prec UMINUS       {$$ = new Aritmetica($2, null, Operador_Aritmetico.UMENOS, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= tk_menos <expresion>", regla:"expresion.val = new Aritmetica(expresion.val);"});}

                /* Relacional */
        | expresion tk_menorque expresion       {$$ = new Relacional($1, $3, Operador_Relacional.MENORQUE,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_menorque <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}
        | expresion tk_mayorque expresion       {$$ = new Relacional($1, $3, Operador_Relacional.MAYORQUE,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_mayorque <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}
        | expresion tk_menorigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.MENORIGUAL, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_menorigual <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}
        | expresion tk_mayorigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.MAYORIGUAL, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_mayorigual <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}
        | expresion tk_dobleigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.IGUALACION, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_dobleigual <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}
        | expresion tk_diferente expresion      {$$ = new Relacional($1, $3, Operador_Relacional.DIFERENCIA, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_diferente <expresion>", regla:"expresion.val = new Relacional(expresion.val, expresion.val);"});}

                /* Lógica */
        | expresion tk_and expresion            {$$ = new Logica($1, $3, Operador_Logico.AND,   @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_and <expresion>", regla:"expresion.val = new Logica(expresion.val, expresion.val);"});}
        | expresion tk_or expresion             {$$ = new Logica($1, $3, Operador_Logico.OR,    @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_or <expresion>", regla:"expresion.val = new Logica(expresion.val, expresion.val);"});}
        | tk_not expresion %prec UNOT           {$$ = new Logica($2, null, Operador_Logico.NOT, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= tk_not <expresion>", regla:"expresion.val = new Logica(expresion.val);"});}

                /* Operadores */
        | expresion tk_concatenacion expresion  {$$ = new Operador($1, $3, Operador_Cadena.CONCATENACION, @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_concatenacion <expresion>", regla:"expresion.val = new Operador(expresion.val, expresion.val);"});}
        | expresion tk_repeticion expresion     {$$ = new Operador($1, $3, Operador_Cadena.REPETICION,    @1.first_line, @1.first_column); 
        listaGramatical.push({prod:"<expresion> ::= <expresion> tk_repeticion <expresion>", regla:"expresion.val = new Operador(expresion.val, expresion.val);"});}
        | ternario_instr                        {$$ = $1; listaGramatical.push({prod:"<expresion> ::= <ternario_instr>", regla:"expresion.val = ternario_instr.val;"});}
                /* Agrupación */        
        | tk_para expresion tk_parc             {$$ = $2; listaGramatical.push({prod:"<expresion> ::= tk_para <expresion> tk_parc", regla:"expresion.val = expresion.val;"});}
                /* Primitivos */
        | RENTERO                               {$$ = new Primitivo(Tipo.ENTERO,   $1,    @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RENTERO", regla:"expresion.val = new Primitivo(Tipo.Entero, expresion.val);"});}
        | RDECIMAL                              {$$ = new Primitivo(Tipo.DECIMAL,  $1,    @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RDECIMAL", regla:"expresion.val = new Primitivo(Tipo.DECIMAL, expresion.val);"});}
        | RCARACTER                             {$$ = new Primitivo(Tipo.CARACTER, $1.slice(1,-1),    @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RCARACTER", regla:"expresion.val = new Primitivo(Tipo.CARACTER, expresion.val);"});}
        | RCADENA                               {$$ = new Primitivo(Tipo.STRING,   $1,    @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RCADENA", regla:"expresion.val = new Primitivo(Tipo.STRING, expresion.val);"});}
        | identificador                         {$$ = new Identificador(           $1,    @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= identificador", regla:"expresion.val = new Identificador(expresion.val);"});}
        | RTRUE                                 {$$ = new Primitivo(Tipo.BOOLEANO, true,  @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RTRUE", regla:"expresion.val = new Primitivo(Tipo.BOOLEANO, expresion.val);"});}
        | RFALSE                                {$$ = new Primitivo(Tipo.BOOLEANO, false, @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RFALSE", regla:"expresion.val = new Primitivo(Tipo.BOOLEANO, expresion.val);"});}
        | RNULL                                 {$$ = new Primitivo(Tipo.NULO,     "null",  @1.first_line, @1.first_column);    
        listaGramatical.push({prod:"<expresion> ::= RNULL", regla:"expresion.val = new Primitivo(Tipo.NULO, expresion.val);"});}
        | llamada_instr                         {$$ = $1; listaGramatical.push({prod:"<expresion> ::= <llamada_instr>", regla:"expresion.val = llamada_instr.instr;"});}     
        | incre_decre_instr                     {$$ = $1; listaGramatical.push({prod:"<expresion> ::= <incre_decre_instr>", regla:"expresion.val = incre_decre_instr.instr;"});} 
        | l_incre_decre_instr                   {$$ = $1; listaGramatical.push({prod:"<expresion> ::= <l_incre_decre_instr>", regla:"expresion.val = l_incre_decre_instr.instr;"});}
        | acceso_struct                         {$$ = $1; listaGramatical.push({prod:"<expresion> ::= <acceso_struct>", regla:"expresion.val = acceso_struct.instr;"});}
        | identificador list_position           {$$ = new AccesoArreglo($1, $2, @1.first_line, @1.first_column);
        listaGramatical.push({prod:"<expresion> ::= identificador <list_position>", regla:"expresion.val = new AccesoArreglo(identificador, list_position);"});}
;

