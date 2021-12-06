/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%x string
%%

\s+                   /* skip whitespace */
"//".*               /*Comentario de una linea*/
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//Reservadas
"null"      return 'null';
"int"       return 'int';
"double"    return 'double';
"boolean"   return 'boolean';
"true"      return 'true';
"false"     return 'false';
"char"      return 'char';
"String"    return 'String';
"pow"       return 'pow';
"sqrt"      return 'sqrt';
"sin"       return 'sin';
"cos"       return 'cos';
"tan"       return 'tan';
"log10"     return 'log10';
"print"     return 'print';
"println"   return 'println';
"if"        return 'if';
"else"      return 'else';
"elseif"    return 'elseif';
"switch"    return 'switch';
"case"      return 'case';
"default"   return 'default';
"break"     return 'break';
"while"     return 'while';
"do"        return 'do';
"continue"  return 'continue';
"begin"     return 'end';
"struct"    return 'struct';


//expresiones regulares
[0-9]+("."[0-9]+)?\b  return 'decimal';
[0-9]+\b              return 'entero';
(\'([^\\\"]|\\.)\')   return 'caracter';
([a-zA-Z])([a-zA-Z0-9_])*   return 'identificador';

//signos
"*"                   return 'por';
"/"                   return 'division';
"-"                   return 'menos';
"+"                   return 'mas';
"%"                   return 'modulo';
"=="                  return 'igualigual';
"="                   return 'igual';
"!="                  return 'diferente';
">"                   return 'mayor';
"<"                   return 'menor';
"<="                  return 'menorigual';
">="                  return 'mayorigual';
"&&"                  return 'and';
"&"                   return 'concatenacion';
"||"                  return 'or';
"!"                   return 'not';
"^"                   return 'repeticion';
"?"                   return 'interrogacion';
"("                   return 'parA';
")"                   return 'parC';
":"                   return 'dosPts';
";"                   return 'puntoYcoma';
"$"                   return 'dolar';
","                   return 'coma';
"["                   return 'corchA';
"]"                   return 'corchC';
"{"                   return 'llaveA';
"}"                   return 'llaveC';
"++"                  return 'masmas';
"--"                  return 'menosmenos';
"#"                   return 'numeral';

["]                          {cadena="";this.begin("string");}
<string>[^"\\]+                 {cadena+=yytext;}
<string>"\\\""                  {cadena+="\"";}
<string>"\\n"                  {cadena+="\n";}
<string>\s                  {cadena+=" ";}
<string>"\\t"                  {cadena+="\t";}
<string>"\\\\"                  {cadena+="\\";}
<string>"\\\'"                  {cadena+="\'";}
<string>["]                  {yytext=cadena; this.popState(); return 'cadenatexto';}


<<EOF>>               return 'EOF';
.                     return 'INVALID';

/lex

/* operator associations and precedence */

%left 'interrogacion'
%left 'or'
%left 'and'
%right 'UNOT'
%left 'concatenacion'
%left 'repeticion'
%left 'igualigual' 'diferente' 'menor' 'menorigual' 'mayor' 'mayorigual'
%left 'mas' 'menos'
%left 'por' 'division' 'modulo'
%left 'pow'
%left UMINUS

%start INICIO

%% /* language grammar */

INICIO: INSTRUCCIONES EOF
        | EOF
;

INSTRUCCIONES: INSTRUCCIONES INSTRUCCION
            | INSTRUCCION
;

INSTRUCCION: IMPRIMIR_INSTR FIN_INST
                | DECLARACION_INSTR FIN_INST
                | ASIGNACION_INSTR FIN_INST
;

FIN_INST: puntoYcoma
        |
;

IMPRIMIR_INSTR: print parA EXPRESION parC
                | println parA EXPRESION parC
;

DECLARACION_INSTR: TIPO identificador igual EXPRESION
                | TIPO LISTA_ID
;

LISTA_ID: LISTA_ID coma identificador
        | identificador
;

ASIGNACION_INSTR: identificador igual EXPRESION
;

TIPO: int
        | double
        | boolean
        | char
        | String
;


EXPRESION: EXPRESION mas EXPRESION
        | EXPRESION menos EXPRESION
        | EXPRESION por EXPRESION
        | EXPRESION division EXPRESION
        | EXPRESION modulo EXPRESION
        | EXPRESION igualigual EXPRESION
        | EXPRESION diferente EXPRESION
        | EXPRESION menor EXPRESION
        | EXPRESION mayor EXPRESION
        | EXPRESION menorigual EXPRESION
        | EXPRESION mayorigual EXPRESION
        | EXPRESION and EXPRESION
        | EXPRESION or EXPRESION
        | EXPRESION concatenacion EXPRESION
        | EXPRESION repeticion EXPRESION
        | parA EXPRESION parC
        | not EXPRESION %prec UNOT
        | menos EXPRESION %prec UMINUS
        | entero
        | decimal
        | caracter
        | cadenatexto
        | identificador
        | true
        | false
        | null
        | TERNARIO
;

TERNARIO: EXPRESION interrogacion EXPRESION dosPts EXPRESION
;