/*****************************************
 * Ejemplo Intérprete Sencillo con Jison *
 *****************************************/

/* description: Parses and executes mathematical expressions. */
%{
        var listaErrores = [];
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
<string>\s                      {cadena+=" ";}
<string>"\\t"                   {cadena+="\t";}
<string>"\\\\"                  {cadena+="\\";}
<string>"\\\'"                  {cadena+="\'";}
<string>["]                     {yytext=cadena; this.popState(); return 'RCADENA';}


<<EOF>>               return 'EOF';
.                     { 
        listaErrores.push(new Exception("Error Lexico", "No se reconoce "+yytext, yylloc.first_line,  yylloc.first_column));
        }

/lex

/* operator associations and precedence */

%left 'tk_interrogacion'
%left 'tk_or'
%left 'tk_and'
%right 'UNOT'
%left 'tk_concatenacion'
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
                                                        listaErrores = [];
                                                        return {instr:$$, errores:retornoErrores}
                                                }
;


instrucciones
	: instrucciones instruccion             { $1.push($2); $$ = $1; } // Recursivo por la izquierda.
	| instruccion				{ $$ = [$1]; }
;

instruccion
        : imprimir_instr fin_instr               { $$ = $1; }
        | declaracion_instr fin_instr            { $$ = $1; }
        | asignacion_instr fin_instr             { $$ = $1; }
        | if_instr                               { $$ = $1; }
        | switch_instr                           { $$ = $1; }
        | while_instr                            { $$ = $1; }
        | break_instr                            { $$ = $1; }
        | continue_instr                         { $$ = $1; }
        | return_instr                           { $$ = $1; }
        | do_while_instr                         { $$ = $1; }
        | funcion_instr                          { $$ = $1; }
        | llamada_instr fin_instr                { $$ = $1; }
        | main_instr                             { $$ = $1; }
        | for_instr                              { $$ = $1; }
        | incre_decre_instr fin_instr            { $$ = $1; }
        | declaracion_array_instr fin_instr      { $$ = $1; }
        | struct_instr fin_instr                 { $$ = $1; }
        | asignacion_struct fin_instr            { $$ = $1; }
        | error tk_puntocoma                     {
                                                listaErrores.push(new Exception("Error Sintactico", "No se esperaba "+yytext, @1.first_line, @1.first_column)); }
;

instruccion2
        : imprimir_instr fin_instr               { $$ = $1; }
        | declaracion_instr fin_instr            { $$ = $1; }
        | asignacion_instr fin_instr             { $$ = $1; }
        // | if_instr                               { $$ = $1; }
        | switch_instr                           { $$ = $1; }
        | while_instr                            { $$ = $1; }
        | break_instr                            { $$ = $1; }
        | continue_instr                         { $$ = $1; }
        | return_instr                           { $$ = $1; }
        | do_while_instr                         { $$ = $1; }
        | funcion_instr                          { $$ = $1; }
        | llamada_instr fin_instr                { $$ = $1; }
        | main_instr                             { $$ = $1; }
        | for_instr                              { $$ = $1; }
        | incre_decre_instr fin_instr            { $$ = $1; }
        | declaracion_array_instr fin_instr      { $$ = $1; }
        | struct_instr fin_instr                 { $$ = $1; }
        | asignacion_struct fin_instr            { $$ = $1; }
        | error tk_puntocoma                     {
                                                listaErrores.push(new Exception("Error Sintactico", "No se esperaba "+yytext, @1.first_line, @1.first_column)); }
;

fin_instr
        : tk_puntocoma                          {}
        |                                       {}
;

/************************************* [MAIN] ************************************/
main_instr
        : RVOID RMAIN tk_para tk_parc tk_llavea instrucciones tk_llavec         { $$ = new Main($6, @1.first_line, @1.first_column); }
;

/************************************* [PRINT] y [PRINTLN] ************************************/                                      */
imprimir_instr
        : RPRINTLN tk_para expresion tk_parc	{ $$ = new Println($3, @1.first_line, @1.first_column); }
        | RPRINT tk_para expresion tk_parc	{ $$ = new Print($3,   @1.first_line, @1.first_column);   }
;

/***************************************** [DECLARACION] ***************************************/     
declaracion_instr
         : TIPO identificador tk_igual expresion { $$ = new Declaracion($1, $2, $4,   @1.first_line, @1.first_column); }
         | TIPO LISTA_ID                         { $$ = new Declaracion($1, $2, null, @1.first_line, @1.first_column); }
;

/************************************** [DECLARACION][ARREGLO] ***********************************/     
declaracion_array_instr:
        TIPO tk_cora tk_corc identificador tk_igual valores_array       {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);}
;

valores_array:
        tk_cora lista_valores_array tk_corc                     {$$ = $2;}
        | tk_cora tk_corc                                       {$$ = [];}
;

lista_valores_array:
        lista_valores_array tk_coma valores                     {$1.push($3); $$ = $1; }
        | valores                                               {$$ = [$1];}
;

valores:  valores_array                                         {$$ = $1;}
        | expresion                                             {$$ = $1;}
;

/***************************************** [ASIGNACION] ***************************************/   
asignacion_instr
         : identificador tk_igual expresion      { $$ = new Asignacion($1, $3, @1.first_line, @1.first_column); }
;

/***************************************** [INCREMENTO] ***************************************/   
incre_decre_instr
        : identificador tk_masmas                { $$= new Incremento($1, true, @1.first_line, @1.first_column); }
        | identificador tk_menosmenos            { $$= new Decremento($1, true, @1.first_line, @1.first_column); }
;

l_incre_decre_instr
        : tk_menosmenos identificador            { $$= new Decremento($2, false, @1.first_line, @1.first_column); }
        | tk_masmas identificador                { $$= new Incremento($2, false, @1.first_line, @1.first_column); }
;

/********************************************* [CONDICIONAL][IF] *********************************************/    
if_instr  
        : RIF tk_para expresion tk_parc BLOCK_IF                        {$$ = new If($3, $5, null, null, @1.first_line, @1.first_column); }
        | RIF tk_para expresion tk_parc BLOCK_IF RELSE BLOCK_IF         {$$ = new If($3, $5, $7, null,   @1.first_line, @1.first_column); }
        | RIF tk_para expresion tk_parc BLOCK_IF RELSE if_instr         {$$ = new If($3, $5, null, $7,   @1.first_line, @1.first_column); }
;

BLOCK_IF
        : tk_llavea instrucciones tk_llavec     { $$ = $2; }
        | instruccion2                          { $$ = $1; }
;

/********************************************* [CONDICIONAL][SWITCH] *********************************************/    
switch_instr
        : RSWITCH tk_para expresion tk_parc tk_llavea list_case default_intr tk_llavec            {$$ = new Switch($3, $6, $7,   @1.first_line, @1.first_column); }
        | RSWITCH tk_para expresion tk_parc tk_llavea list_case tk_llavec                         {$$ = new Switch($3, $6, null, @1.first_line, @1.first_column); }
        | RSWITCH tk_para expresion tk_parc tk_llavea default_intr tk_llavec                      {$$ = new Switch($3, null, $6, @1.first_line, @1.first_column); }
;

//                                      [LISTA DE CASE]
list_case
        : list_case case_instr             { $1.push($2); $$ = $1; } 
	| case_instr			    { $$ = [$1]; }
;

//                                          [CASE]
case_instr
        : RCASE expresion tk_dospuntos instrucciones            {$$ = new Case($2, $4, @1.first_line, @1.first_column); }
;

//                                          [DEFAULT]
default_intr
        : RDEFAULT tk_dospuntos instrucciones                   {$$ = new Default($3, @1.first_line, @1.first_column); }
;

LISTA_ID: LISTA_ID tk_coma identificador        { $1.push($3); $$ = $1;}
        | identificador                         { $$=[$1]; }
;

/***************************************** [LOOP][WHILE] ***************************************/   
while_instr
        : RWHILE tk_para expresion tk_parc tk_llavea instrucciones tk_llavec        { $$ = new While($3, $6, @1.first_line, @1.first_column); }
;

/***************************************** [LOOP][DO WHILE] ***************************************/   
do_while_instr
        : RDO tk_llavea instrucciones tk_llavec RWHILE tk_para expresion tk_parc tk_puntocoma    { $$ = new Do_While($7, $3, @1.first_line, @1.first_column); }
;

/***************************************** [LOOP][FOR] ***************************************/   
for_instr 
        : RFOR tk_para declaracion_for tk_puntocoma expresion tk_puntocoma asignacion_for tk_parc tk_llavea instrucciones tk_llavec               {$$ = new For($3, $5, $7, $10, Tipo.ENTERO, @1.first_line, @1.first_column); }
        | RFOR identificador RIN expresion tk_llavea instrucciones tk_llavec            {$$ = new For($2, null, $4, $6, Tipo.STRING, @1.first_line, @1.first_column); }
;

asignacion_for 
        : asignacion_instr              {$$ = $1; }
        | incre_decre_instr             {$$ = $1; }
;

declaracion_for
        : declaracion_instr             {$$ = $1; }
        | asignacion_instr              {$$ = $1; }
        | identificador                 {$$ = new Identificador($1, @1.first_line, @1.first_column); }
;

/***************************************** [BREAK] ***************************************/  
break_instr
        : RBREAK tk_puntocoma                   {$$ = new Break(@1.first_line, @1.first_column); }
;

/***************************************** [CONTINUE] ***************************************/  
continue_instr
        : RCONTINUE tk_puntocoma                {$$ = new Continue(@1.first_line, @1.first_column); }
;

/***************************************** [RETURN] ***************************************/  
return_instr
        : RRETURN expresion tk_puntocoma      {$$ = new Return($2, @1.first_line, @1.first_column); }
        | RRETURN tk_puntocoma                {$$ = new Return(null, @1.first_line, @1.first_column); }

;

/***************************************** [TERNARIO] ***************************************/   
ternario_instr
        : tk_para expresion tk_parc tk_interrogacion expresion tk_dospuntos expresion   {$$ = new Ternario($2, $5, $7, @1.first_line, @1.first_column); }
;

/***************************************** [STRUCT][DECLARACION] ***************************************/   
struct_instr
        : RSTRUCT identificador tk_llavea lista_struct tk_llavec      {$$ = new DeclaracionStruct($2, $4, @1.first_line, @1.first_column); }
;
  
lista_struct
        : lista_struct tk_coma LIST_STRUCT                        { $1.push($3); $$ = $1; }
        | LIST_STRUCT                                             { $$=[$1]; }
;

LIST_STRUCT
        : TIPO identificador                                     { $$ = {type: $1, name: $2, bool:false}; }
        | identificador identificador                            { $$ = {type: $1, name: $2, bool:true} ; }
;

/***************************************** [STRUCT][ASIGNACION] ***************************************/   
asignacion_struct
        : identificador identificador tk_igual identificador tk_para parametros_struct tk_parc  {$$ = new AsignacionStruct($1, $2, $4, $6, @1.first_line, @1.first_column); }
;

parametros_struct
                : parametros_struct tk_coma parametro_struct    { $1.push($3); $$ = $1;}
                | parametro_struct                              { $$=[$1]; }
;

parametro_struct
                : expresion                                     { $$ = $1; }
;

/***************************************** [STRUCT][MOSTRAR] ***************************************/ 
acceso_struct
        : identificador LIST_ACCES_STRUCTS              {$$ = new AccesoStruct($1, $2, @1.first_line, @1.first_column); }
;

/***************************************** [STRUCT][MODIFICAR] ***************************************/ 
modificar_acceso_struct
        : identificador  tk_igual expresion             {}
;

/***************************************** [STRUCT][LIST][ATRIBUTOS] ***************************************/ 
LIST_ACCES_STRUCTS
                : LIST_ACCES_STRUCTS LIST_ACCES_STRUCT  { $1.push($2); $$ = $1;}
                | LIST_ACCES_STRUCT                     { $$=[$1]; }
;

LIST_ACCES_STRUCT
                : tk_punto identificador                { $$ = {id:$2}; }
;


/***************************************** [TIPO] ***************************************/   
TIPO
        : RINT                                  {$$ = Tipo.ENTERO;  }
        | RDOUBLE                               {$$ = Tipo.DECIMAL; }
        | RBOOLEAN                              {$$ = Tipo.BOOLEANO;}
        | RCHAR                                 {$$ = Tipo.CARACTER;}
        | RSTRING                               {$$ = Tipo.STRING;  }
        | RVOID                                 {$$ = Tipo.VOID;    }

;

/***************************************** [FUNCIONES] ***************************************/   
funcion_instr
        : TIPO identificador tk_para tk_parc tk_llavea instrucciones tk_llavec                  { $$ = new Funcion($1, $2, [], $6, @1.first_line, @1.first_column); }
        | TIPO identificador tk_para parametros tk_parc tk_llavea instrucciones tk_llavec       { $$ = new Funcion($1, $2, $4, $7, @1.first_line, @1.first_column); }
;

/***************************************** [PARAMETROS FUNCION] ***************************************/   
parametros
        : parametros tk_coma parametro          { $1.push($3); $$ = $1;}
        | parametro                             { $$=[$1]; }
;

parametro
        : TIPO identificador                    { $$ = {tipo: $1, identificador: $2} ;}
;

/**************************************** [LLAMADA FUNCION] *************************************/   
llamada_instr
        : identificador tk_para tk_parc                                 { $$ = new LlamadaFuncion($1, [], @1.first_line, @1.first_column); }
        | identificador tk_para parametros_llamada tk_parc              { $$ = new LlamadaFuncion($1, $3, @1.first_line, @1.first_column); }
        | nativas_instr                                                 { $$ = $1; }
;


nativas_instr
        : identificador tk_punto RTOLOWERCASE tk_para tk_parc                           { $$ = new ToLowerCase($1, @1.first_line, @1.first_column); }
        | identificador tk_punto RTOUPPERCASE tk_para tk_parc                           { $$ = new ToUpperCase($1, @1.first_line, @1.first_column); }
        | TIPO tk_punto RPARSE tk_para expresion tk_parc                                { $$ = new Parse($1, $5, @1.first_line, @1.first_column);   }
        | identificador tk_punto RLENGTH tk_para tk_parc                                { $$ = new Length($1, @1.first_line, @1.first_column); }
        | identificador tk_punto RCARACTEROFPOSITION tk_para expresion tk_parc          { $$ = new CaracterOfPosition($1, $5, @1.first_line, @1.first_column); }
        | identificador tk_punto RSUBSTRING tk_para expresion tk_coma expresion tk_parc { $$ = new SubString($1, $5, $7, @1.first_line, @1.first_column); }
;


/***************************************** [PARAMETROS LLAMADA] ***************************************/   
parametros_llamada
                : parametros_llamada tk_coma parametro_llamada                  { $1.push($3); $$ = $1;}
                | parametro_llamada                                             { $$=[$1]; }
;

parametro_llamada
                : expresion                                                     { $$ = $1; }
;

/***************************************** [EXPRESIONES] ***************************************/   
expresion
                /* Aritmética */
        : expresion tk_mas expresion            {$$ = new Aritmetica($1, $3, Operador_Aritmetico.MAS,      @1.first_line, @1.first_column); }
        | expresion tk_menos expresion          {$$ = new Aritmetica($1, $3, Operador_Aritmetico.RESTA,    @1.first_line, @1.first_column); }
        | expresion tk_por expresion            {$$ = new Aritmetica($1, $3, Operador_Aritmetico.POR,      @1.first_line, @1.first_column); }
        | expresion tk_dividido expresion       {$$ = new Aritmetica($1, $3, Operador_Aritmetico.DIV,      @1.first_line, @1.first_column); }
        | expresion tk_modulo expresion         {$$ = new Aritmetica($1, $3, Operador_Aritmetico.MODULO,   @1.first_line, @1.first_column); }
        | tk_menos expresion %prec UMINUS       {$$ = new Aritmetica($2, null, Operador_Aritmetico.UMENOS, @1.first_line, @1.first_column); }

                /* Relacional */
        | expresion tk_menorque expresion       {$$ = new Relacional($1, $3, Operador_Relacional.MENORQUE,   @1.first_line, @1.first_column); }
        | expresion tk_mayorque expresion       {$$ = new Relacional($1, $3, Operador_Relacional.MAYORQUE,   @1.first_line, @1.first_column); }
        | expresion tk_menorigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.MENORIGUAL, @1.first_line, @1.first_column); }
        | expresion tk_mayorigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.MAYORIGUAL, @1.first_line, @1.first_column); }
        | expresion tk_dobleigual expresion     {$$ = new Relacional($1, $3, Operador_Relacional.IGUALACION, @1.first_line, @1.first_column); }
        | expresion tk_diferente expresion      {$$ = new Relacional($1, $3, Operador_Relacional.DIFERENCIA, @1.first_line, @1.first_column); }

                /* Lógica */
        | expresion tk_and expresion            {$$ = new Logica($1, $3, Operador_Logico.AND,   @1.first_line, @1.first_column); }
        | expresion tk_or expresion             {$$ = new Logica($1, $3, Operador_Logico.OR,    @1.first_line, @1.first_column); }
        | tk_not expresion %prec UNOT           {$$ = new Logica($2, null, Operador_Logico.NOT, @1.first_line, @1.first_column); }

                /* Operadores */
        | expresion tk_concatenacion expresion  {$$ = new Operador($1, $3, Operador_Cadena.CONCATENACION, @1.first_line, @1.first_column); }
        | expresion tk_repeticion expresion     {$$ = new Operador($1, $3, Operador_Cadena.REPETICION,    @1.first_line, @1.first_column); }
        | ternario_instr                        {$$ = $1; }
                /* Agrupación */        
        | tk_para expresion tk_parc             {$$ = $2; }
                /* Primitivos */
        | RENTERO                               {$$ = new Primitivo(Tipo.ENTERO,   $1,    @1.first_line, @1.first_column);    }
        | RDECIMAL                              {$$ = new Primitivo(Tipo.DECIMAL,  $1,    @1.first_line, @1.first_column);    }
        | RCARACTER                             {$$ = new Primitivo(Tipo.CARACTER, $1.slice(1,-1),    @1.first_line, @1.first_column);    }
        | RCADENA                               {$$ = new Primitivo(Tipo.STRING,   $1,    @1.first_line, @1.first_column);    }
        | identificador                         {$$ = new Identificador(           $1,    @1.first_line, @1.first_column);    }
        | RTRUE                                 {$$ = new Primitivo(Tipo.BOOLEANO, true,  @1.first_line, @1.first_column);    }
        | RFALSE                                {$$ = new Primitivo(Tipo.BOOLEANO, false, @1.first_line, @1.first_column);    }
        | RNULL                                 {$$ = new Primitivo(Tipo.NULO,     "null",  @1.first_line, @1.first_column);    }
        | llamada_instr                         {$$ = $1;}     
        | incre_decre_instr                     {$$ = $1; } 
        | l_incre_decre_instr                   {$$ = $1; }
        | identificador tk_cora expresion tk_corc {$$ = new AccesoArreglo($1, $3, @1.first_line, @1.first_column);}
        | acceso_struct                         {$$ = $1; }
;

