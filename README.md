# Proyecto 1 Compiladores 2
## Tabla de contenido
1. [Manual de usuario](#manualUsuario)
2. [Manual técnico](#manualTecnico)

## Manual de usuario <a name="manualUsuario"></a>

## Indice
1. [Requisitos para ejecutar el proyecto](#requisitoEjecutar)
2. [¿Cómo ejecutar el programa?](#requisitoEjecutar)
3. [Partes del editor](#partesEditor)
4. [Sintaxis del lenguaje aceptado](#sintaxisLenguaje)
    4.1 [Comentarios](#comentarios)
    4.2. [Tipos de datos](#tiposDatos)
    4.3. [Operaciones aritméticas](#operacionesAri)
    4.4. [Operaciones Relacionales](#operacionesRela)
    4.5. [Operaciones lógicas](#operacionesLogi)
    4.6. [Operaciones con cadenas](#operacionesCade)
    4.7. [Funciones nativas](#funcNat)
    4.8. [Impresión de datos](#funcPrint)
    4.9. [Declaración y asignación](#declaSigna)
    4.10. [Sentencias de control](#sentenciaControl)
    4.11. [Sentencias cíclicas](#sentenciaCiclica)
5. [Código de 3 direcciones](#c3d)


### Requisitos para ejecutar el proyecto <a name="requisitoEjecutar"></a>
-   Tener instalado algun navegador web (Google Chrome, Microsoft Edge, Firefox).
-   Una computadora con al menos 4 GB de memoria RAM.

### ¿Cómo ejecutar el programa? <a name="comoEjecutar"></a>
Para poder usar el interprete disponemos de dos opciones:
-   Clonar el repositorio del proyecto con la terminal, utilizando el siguiente comando y abrir el archivo index.html
```git
git clone https://github.com/bram814/-OLC2-Proyecto
```

-   Tambien podemos utilizar el interprete accediento al siguiente enlace https://bram814.github.io/-OLC2-Proyecto donde encontraremos una demo del proyecto.

### Partes del editor <a name="partesEditor"></a>
Encontraremos distintos apartados en el editor, cada parte destinada a un uso especifico. 

![Partes del editor](imagenes/principal.png)

#### **Elegir archivo** 
Con esta opcion podremos cargar archivos de texto para poder interpretarlos o compilarlos posteriormente, el contenido del archivo se mostrara en el editor con apartado INTERPRETE.

#### **Interpretar** <a name="interpretar"></a>
Con esta opcion interpretaremos el codigo escrito o cargado que aparezca dentro del editor de texto con apartado INTERPRETE. Mostrando el resultado en la salida de consola en el apartado 'Salida'.

![Interpretar](imagenes/salida.png)

#### **Compilar**
Esta opción se utiliza para generar el código de tres direcciones del código escrito dentro del apartado 'interprete', mostrando el resultado en el apartado 'Compilador'.

![Compilador](imagenes/compilador.png)

#### **Grafo AST**
Esta opcion genera el grafo del arbol de análisis sintáctico (AST) que se produce a partir del contenido en el editor de texto. Mostrando de forma detallada la estructura sintáctica del codigo fuente ingresado.

![AST](imagenes/ast.png)

#### **DOT AST** 
Genera el codigo en formato DOT del arbol de sintaxis abstracta, para poder ser visualizada en alguna pagina online o con alguna otra herramienta.

![AST](imagenes/dot.png)

#### **Tabla de errores**
Muestra los errores léxicos, sintácticos y semánticos producidos al [_interpretar_](#interpretar) el código ingresado; en una tabla de HTML. Mostrando el tipo del error, una breve descripcion, la linea y columna donde se origina.

![Tabla de errores](imagenes/tablaError.png)

#### **Tabla de símbolos**
Muestra la tabla de simbolos generada a partir del codigo ingresado en el editor, mostrando el identificador, tipo, valor, ámbito, linea y columna de los simbolos encontrados en la ejecucion del programa.

![Tabla de simbolos](imagenes/tablaSimbolos.png)

#### **Reporte gramatical**
Muestra la gramatica utilizada para interpretar el código instroducido en el editor, detallando las producciones, simbolos y reglas semánticas necesarias para realizarlo.

![Reporte gramatical](imagenes/reporteGramatical.png)

##Sintaxis del lenguaje aceptado <a name="sintaxisLenguaje"></a>

El lenguaje reconocido por el analizador está basado en java, por lo que la sintaxis y palabras reservadas son bastante similares. 
#### Comentarios <a name="comentarios"></a>
Los comentarios son porciones de codigo que no se interpretan, unicamente sirven para documentar el código. 
Se aceptan dos tipos de comentarios:
-   **Comentarios simples:** Unicamente abarrcan una lines y se realizan con el operador //
    ```java
    //Comentario de una sola línea
    ```
-   **Comentarios multilinea:** Abarcan multiples lineas, se enciarran entre /* comentario */
    ```java
    /*Comentario
    de múltiples
    líneas*/
    ```
#### **Tipos de dato permitidos** <a name="tiposDatos"></a>
-   **int:** Son numeros de tipo entero positivos y negativos (312, -431).
-   **double:** Son numeros decimales positivos y negativos (3.14159, -54.67).
-   **boolean:** Unicamente puede tomar el valor de **true** o **false**.
-   **char:** Son caracteres definidos entre comillas ('f','\n','a').
-   **String:** Son cadenas de texto encerradas entre comillas "Cadena de texto".
-   **Nulo:** Indica que no existe un valor.

#### Operaciones aritméticas posibles <a name="operacionesAri"></a>
-   **Suma:** Es posible sumar dos expresiones numéricas utilizando el simbolo **+**.

-   **Resta:** Es posible restar dos expresiones numéricas utilizando el operador **-**.

-   **Multiplicación:** Es posible multiplicar dos expresiones numéricas utilizando el operador *.

-   **Division:** Es posible dividir dos expresiones numericas utilizando el operador **/**.

-   **Módulo:** Es posible encontrar el residuo de una division con el opeador **%**.

-   **sqrt(número):** Calcula la raíz cuadrada de un numero.

-   **sin(número):** Calcula el seno del numero solicitado.

-   **con(número):** Calcula el coseno del numero solicitado.

-   **tan(número):** Calcula la tangente del numero solicitado.

#### Operaciones relacionales (Comparación) <a name="operacionesRela"></a>

| OPERADOR | DESCRIPCION | EJEMPLO|
|----------|-------------|--------|
|Igualigual (==)|Devuelve true si la comparacion es verdadera y false si la comparacion es falsa.| 3 == 3 //true|
|Diferente (!=)|Devuelve true si los operadores no son iguales.| 3 != "cadena" //true|
|Mayor que (>)|Devuelve true si el operando izquierdo es mayor que el operando derecho.| 3 > 2 //true|
|Menor que (<) |Devuelve true si el operando izquierdo es menor que el operando derecho.| 5< 19 //true|
|Mayor igual (>=)|Devuelve true si el operando izquierdo es mayor o igual que el operando derecho.| 4 >= 3 //true|
|Menor igual (<=)|Devuelve true si el operando izquierdo es menor o igual que el operando derecho.| 5 <= 5 //true|

#### Operaciones Lógicas <a name="operacionesLogi"></a>

| OPERADOR | DESCRIPCION | EJEMPLO|
|----------|-------------|--------|
|AND (&&)|devuelve true si ambos operandos son true, de lo contrario, devuelve false.| true && true //true|
|OR (||)|Devuelve true si alguno de los operandos es true, si ambos son falsos, devuelve false.| true || false //true|
|NOT (!)|Devuelve false si el operador es true y devuelve true si el operador es false| !true // false|

#### Operaciones con cadenas <a name="operacionesCad"></a>

-   **Concatenacion:** Es posible concatenar dos cadenas de texto utilizando el operador &.
```java
"Cadena1" & "Cadena2" = "Cadena1Cadena2"
```

-   **Repetición:** Para hacer que una cadena se repita "n" veces se debe usar el operador ^, utilizando el siguiente formato:
    ```java
    "cadena" ^ numero de repeticiones
    "Cadena" ^ 3 = "CadenaCadenaCadena"
    ```

#### Funciones nativas <a name="funcNat"></a>
-   **Acceso a una posición:** Para acceder a una posición de una cadena, es posible utilizar la funcion nativa string.caracterOfPosition(posición).
    ```java
    String cadena = "Mi cadena de prueba";
    cadena.caracterOfPosition(3);  // c
    ```
-   **Acceso a una porcion:** Para acceder a la porcion de una cadena, es posible utilizar la funcion nativa string.subString(inicio, final).
    ```java
    String cadena = "Mi cadena de prueba";
    cadena.subString(0,5);  // Mi cad
    ```
-   **Cadena en  mayúsculas:** Para convertir una cadena de texto en mayúsculas, es posible utilizar la funcion nativa string.toUppercase().
    ```java
    String cadena = "Mi cadena de prueba";
    cadena.toUpperCase);  // MI CADENA DE PRUEBA
    ```
-   **Cadena en  minúsculas:** Para convertir una cadena de texto en minúsculas, es posible utilizar la funcion nativa string.toLowercase().
    ```java
    String cadena = "Mi Cadena De Prueba";
    cadena.toUpperCase);  // mi cadena de prueba
    ```
#### Impresión de datos <a name="funcPrint"></a>
Para imprimir los datos en consola es posible utilizar dos funciones:
-   **Println(expresion);** Esta función se utiliza para imprimir datos en la consola con un salto de linea al final de la expresíon.
-   **Print(expresion);** Esta función se utiliza para imprimir datos en la consola sin un salto de linea al final de la expresíon.

#### Declaración y asignación de variables <a name="declaSigna"></a>
Para declarar variables se debe de seguir la siguiente sintaxis:

```java
TIPO identificador = expresión;
ó
Tipo id1, id2, id3...idn;
```
Por ejemplo:
```java
int variableNumerica = 12;
String variableCadena = "Soy una cadena de texto";
char letraC = 'c';
double id1, id2, id3... idn;
```

Para asignarle valor a una variable, la expresion a asignarle debe ser del mismo tipo que la variable, de lo contrario se mostrará error.
```java
int numero1, numero2, numero3;
numero1 = 12+28;
numero2 = 100;
numero3 = "200";  //Esto mostrara un error al interpretarse
```

#### Declaración de arreglos
Los arreglos son conjuntos de datos del mismo tipo que se almacenan dentro de una misma estructura, donde se puede acceder a cada posicion por medio de su numero de indice.
La declaración de los arreglos sigue la siguiente sintaxis:
```java
TIPO identificador = [lista_de_expresiones];
```
Si los datos de la lista de expresiones no coincide con la del tipo de la variable se mostrará un error.
```java
int arreglo1 = [1,2,3,4,5];
char lista_caracteres = ['a','s','','d','\n']
String mascotas = ["perro", "garo", "loro", 2]; // Error: Tipos incompatibles
```
#### Acceso a los arreglos
Para acceder a alguna posición del arreglo se debe de realizar indicando el identificador del arreglo seguido el numero de indice al que deseamos acceder encerrado entre corchetes.
```java
int[] lista = [1,2,3,4,5];
lista[1]; //Accediendo a la posición 1 que almacena el numero 2
```
#### Arreglos por referencia y copia de arreglos
Al asignarle el identificador de un arreglo a otro arreglo, estos se estarian igualando por referencia lo que provocaria que los cambios realizados en cualquiera de los arreglos modificaria al otro.
Para evitar esto es posible crear una copia de un arreglo con el operador **#**.
```java
int[] arreglo1 = [1,2,3,4,5,6];
int[] arreglo2 = arreglo1; //Arreglos por referencia
int[] copia = #arreglo1;   //Se crea una copia del arreglo.
```

#### Declaración de structs
Es un tipo de dato compuesto de otros tipos de datos o incluso arreglos que se definen mediante la siguiente sintaxis:
```java
struct identificador {
    LISTA_ATRIBUTOS
}
```
Ejemplo:
```java
struct persona{
    int edad,
    String nombre,
    double altura
}
```
Se pueden declarar variables de tipo struct, siguiente la siguiente sintaxis:
```java
NOMBRE_STRUCT identificador = NOMBRE_STRUCT(lista_valores);
```
Ejemplo:
```java
persona p1 = persona(12, "Eduardo", 1.6);
```
Tambien podemos acceder y asignar valores a atributos especificos de cada struct con el operador **.**.
```java
println(p1.nombre) //Imprime Eduardo
p1.edad = 22;      //La edad cambia de 12 a 22
```

#### Declaración de funciones
Una funcion es un bloque de código que ejecuta una tarea determinada y puede o no returnar un valor.
Para declarar una función deberemos seguir la siguiente sintaxis:   
```java
TIPO nombre_funcion(lista_parametros){
    lista_instrucciones
}
```
Ejemplo:
```java
void mostrarSaludo(String nombre){
    println("Hola ", nombre);
}

int suma(int numA, numB){
    return numA + numB;
}

double retornarPi(){
    return 3.141592654;
}
```

Si el tipo de la funcion es **void**, significa que no devolvera algun valor de lo contrario; devolvera algún dato del tipo de la función.

Los parametros como arreglos y structs se pasan por referencia, lo que indica que los cambios que sufran dentro de las funciones tambien afectaran a los arreglos originales.

#### Llamada a funciones
Para ejecutar una función se debe de llamar en desde cualquier parte del código de la siguiente forma:
```java
suma(12,10);
retornarPi();
```
Si la función devuelve algun valor, se podrá asignar a una variable al momento de ser llamada, por ejemplo:
```java
int resultado = suma(10,12);  // resultado = 22
double pi = retornarPi();     // pi = 3.141592654
```
#### Otras funciones nativas
|Funcion|Descripción|Ejemplo|
|-------|-----------|-------|
|tipo.Parse(string)|Toma una cadena y se convierte al tipo de dato indicado si es posible.|int.parse("100"); //retorna 100 (int)|
|toInt(decimal)|Convierte un numero decimal a entero sin redondearlo| toInt(4.788); //retorna 4|
|toDouble(entero)| Convierte un entero a un decimal.|toDouble(32); // retorna 32.0|
|String(expresion)|Convierte a String cualquier tipo de dato recibido, exceptuando null| String(23.52); //retorna "23.53"|
|typeof(expresion)|Devuelve el tipo de dato del argumento recibido.|typeof(23) //retorna int|

#### Sentencia if <a name="sentenciaControl"></a>
La sentencia **if** se utiliza para verificar alguna condicion antes ejecutar el bloque de  código en su interior, luego de la sentencia if pueden o no seguir una o varias sentencias **else if** y al final puede o no existir la sentencia **else**.
Obteniendo como sintaxis lo siguiente:
```java
if(CONDICION){
    LISTA_INSTRUCCIONES
}

if(CONDICION){
    LISTA_INSTRUCCIONES
}else if(INSTRUCCION){
    LISTA_INSTRUCCIONES
}...(lista de sentencias else if)
else{ //Posible else
    LISTA_INSTRUCCIONES
}
```
Por ejemplo:
```java
if(3 < 5){
    println("El número es menor a 5");
}else{
    println("El número es mayor o igual a 5");
}

if(var1 == var2){
    println("Los datos son iguales.");
}else if(var1 > var2){
    println("var1 es mayor a var2");
}else if(var1 < var2){
    println("var1 es menor a var2");
}else{
    println("No se cumple con ninguna condición.");
}
```

#### Sentencia switch
La sentencia switch se utiliza para tomar una decicio a partir de una sentencia dada.
```java
switch(expresión) {
    case x:
        LISTA_INTRUCCIONES
        break;
    case y:
        LISTA_INTRUCCIONES
        break;
    case
    ... //Lista de case 
    default: //Posible default
        LISTA_INTRUCCIONES
}
```

Por ejemplo:
```java
switch (day){
    case 1:
        dayString = "Lunes";
        break;
    case 2:
        dayString = "Martes";
        break;
    case 3:
        dayString = "Miércoles";
        break;
    case 4:  
        dayString = "Jueves";
        break;
    case 5:  
        dayString = "Viernes";
        break;
    case 6:  
        dayString = "Sábado";
        break;
    case 7: 
        dayString = "Domingo";
        break;
    default: 
        dayString = "Dia inválido";
        break;
}
```

#### Sentencias cíclicas <a name="sentenciaCiclica"></a>
Permiten repetir un determinado número de veces un grupo de instrucciones, o para recorrer un conjunto de objetos o estructuras compuestas por más de un elemento.

#### For
Disponemos de dos tipos de for, uno para ejecutar un ciclo determinado numero de veces y otro especializado en recorrer arreglos o cadenas de texto.
Se definen en la siguiente sintaxis:
```java
for(declaración || asignación; condición; instrucción){
    LISTA_INSTRUCCIONES
}

for variable in arreglo || cadena {
    LISTA_INSTRUCCIONES
}
```

Ejemplos:
```java
for(int i = 0; i < 10; i++){
    print(i);
}
//Resultado -> 0123456789
for item in [1,2,3,4,5]{
    print(item);
}
//Resultado -> 12345
```

#### While
Ejecuta el bloque de instrucciones que contiene siempre y cuando al evaluar la condicion se obtenga como resultado **true**.
Se define por la siguiente sintaxis.
```java
while(condición || expresión){
    LISTA_INSTRUCCIONES
}
```
Por ejemplo:
```java
int i = 0;
while(i < 6){
    print(i);
    i++;
}
//Resultado-> 012345
```

#### Do While
Ejecuta siempre el bloque de instrucciones cuando se accede por primera vez y luego se sigue ejecutando en un ciclo siempre y cuando la condición sea verdadera.
```java
do{
    LISTA_INSTRUCCIONES
}while(condición || expresión);
```
Ejemplo:
```java
int i = 10;
do{
    println("Dentro de do while");
}while(i < 5);
// Resultado -> Dentro de do while
```

### Generación de código de 3 direcciones <a name="c3d"></a>
El compilador transforma la entrada en otro lenguaje de la misma estructura que C y solamente se aceptan tipos de dato float y enteros.
Para generar el código de tres direcciones se dispone de los siguiente:

#### Comentarios
Los comentarios son porciones de codigo que no se interpretan, unicamente sirven para documentar el código. 
Se aceptan dos tipos de comentarios:
-   **Comentarios simples:** Unicamente abarrcan una lines y se realizan con el operador //
    ```java
    //Comentario de una sola línea
    ```
-   **Comentarios multilinea:** Abarcan multiples lineas, se enciarran entre /* comentario */
    ```java
    /*Comentario
    de múltiples
    líneas*/
    ```

#### Operadores aritméticos
Se aceptar los siguientes operadorse aritmeticos, cada uno solo contará con dos parametros.
|Operación|Símbolo|
|---------|-------|
|Suma|+|
|Resta|-|
|Multiplicación|*|
|Módulo|%|

#### Operadores condicionales
Se aceptar los siguientes operadorse condicionales, cada uno solo contará con dos parametros.
|Operación|Símbolo|
|---------|-------|
|Menor que|<|
|Mayor que|>|
|Menor igual|<=|
|Mayor igual|>=|
|Diferente|!=|
|Igual igual|==|