/*****************************************
 * Ejemplo Intérprete Sencillo con Jison *
 *****************************************/

/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%x string
%options case-insensitive
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
"pow"       return 'RPOW';
"sqrt"      return 'RSQRT';
"sin"       return 'RSIN';
"cos"       return 'RCOS';
"tan"       return 'RTAN';
"log10"     return 'RLOG10';
// "elseif"    return 'RELSEIF';
"break"     return 'RBREAL';
"while"     return 'RWHILE';
"do"        return 'RDO';
"continue"  return 'RCONTINUE';
"begin"     return 'REND';
"struct"    return 'RSTRUCT';

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

/*************************
 * Expresiones Regulares *
 *************************/ 
[0-9]+("."[0-9]+)?\b            return 'RDECIMAL';
[0-9]+\b                        return 'RENTERO';
(\'([^\\\"]|\\.)\')             return 'RCARACTER';
([a-zA-Z])([a-zA-Z0-9_])*       return 'identificador';


/**************
 * OPERADORES *
 **************/
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
"<"		return 'tk_menorque';
">"		return 'tk_mayorque';
"="		return 'tk_igual';
"<="		return 'tk_menorigual';
">="		return 'tk_mayorigual';
"=="		return 'tk_dobleigual';
"!="		return 'tk_diferente';

/**********
 * Lógica *
 **********/ 
"&&"            return 'tk_and'
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
<string>["]                     {yytext=cadena; this.popState(); return 'cadenatexto';}


<<EOF>>               return 'EOF';
.                     { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

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
%left 'RPOW'
%left UMINUS

%start init

%% /* language grammar */

init 
        : instrucciones EOF                     {return $1; }
;


instrucciones
	: instrucciones instruccion             { $1.push($2); $$ = $1; } // Recursivo por la izquierda.
	| instruccion				{ $$ = [$1]; }
;

instruccion
        : imprimir_instr fin_instr               {}
        // | declaracion_instr fin_instr            {}
        // | asignacion_instr fin_instr             {}
        // | ternario_instr                         {}
;

fin_instr
        : tk_puntocoma                          {}
        |                                       {}
;

/************************************* [PRINT] y [PRINTLN] ************************************/                                      */
imprimir_instr
        : RPRINTLN tk_para expresion tk_parc	{ $$ = new Println($3, @1.first_line, @1.first_column); }
        | RPRINT tk_para expresion tk_parc	{ $$ = $3; }
;

/***************************************** [DECLARACION] ***************************************/     
// declaracion_instr
//         : TIPO identificador tk_igual expresion {}
//         | TIPO LISTA_ID                         {}
// ;

/***************************************** [ASIGNACION] ***************************************/   
// asignacion_instr
//         : identificador tk_igual EXPRESION      {}
// ;

/***************************************** [TERNARIO] ***************************************/   
// ternario_instr
//         : expresion tk_interrogacion expresion tk_dospuntos expresion   {}
// ;


LISTA_ID: LISTA_ID tk_coma identificador        {}
        | identificador                         {}
;

/***************************************** [TIPO] ***************************************/   
TIPO
        : RINT                                  {}
        | RDOUBLE                               {}
        | RBOOLEAN                              {}
        | RCHAR                                 {}
        | RSTRING                               {}
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
        | expresion tk_menorque expresion       {}
        | expresion tk_mayorque expresion       {}
        | expresion tk_menorigual expresion     {}
        | expresion tk_mayorigual expresion     {}
        | expresion tk_dobleigual expresion     {}
        | expresion tk_diferente expresion      {}

                /* Lógica */
        | expresion tk_and expresion            {}
        | expresion tk_or expresion             {}
        | tk_not expresion %prec UNOT           {}

                /* Operadores */
        | expresion tk_concatenacion expresion  {}
        | expresion tk_repeticion expresion     {}
                /* Agrupación */        
        | tk_para expresion tk_parc             {}
                /* Primitivos */
        | RENTERO                               {$$ = new Primitivo(Tipo.ENTERO,  $1, @1.first_line, @1.first_column); }
        | RDECIMAL                              {$$ = new Primitivo(Tipo.DECIMAL, $1, @1.first_line, @1.first_column); }
        | RCARACTER                             {$$ = new Primitivo(Tipo.STRING,  $1, @1.first_line, @1.first_column); }
        // | cadenatexto                           {}
        | identificador                         {$$ = new Primitivo(Tipo.STRING,  $1, @1.first_line, @1.first_column); }
        | RTRUE                                 {}
        | RFALSE                                {}
        | RNULL                                 {}
;

