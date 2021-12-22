/**************************************************************************************************
 * AMBITO :: Es un entorno, es la parte del codigo donde pueden acceder las variables.            *  
 * AMBITO :: Determina en qué partes del programa una entidad puede ser usada.                    *
 *                                                                                                *
 * En la tabla de simbolos nos facilita usar un diccionario para poder ir encontrando las datos.  *
 * ATRIBUTO keys() --> {id:"varaibleId", tipo:"tipoId"} obtiene la posicion id, tipo, etc..       *
***************************************************************************************************/

class TablaSimbolo{

    constructor(anterior=null){
        this.tabla = {};
        this.anterior = anterior;
        this.funciones = {};
        this.struct = {};

        //compile
        this.size = 0;
        this.returnSize = 0;
        if(anterior != null){
            this.size = this.anterior.size;
            // this
        }
    }


    setTabla(simbolo){
        if (simbolo.id in this.tabla){
            return new Exception("Semantico",`Variable ${simbolo.id} ya existe.`, simbolo.getRow(), simbolo.getColumn());
        }else{
            this.tabla[simbolo.id] = simbolo;
            return null;
        }
    }

    getTabla(id){
        var tablaActual = this;
        while(tablaActual.tabla != null){
            if(id in tablaActual.tabla){
                return tablaActual.tabla[id];  //retornar el simbolo encontrado
            }else{
                tablaActual = tablaActual.anterior;
                if (tablaActual == null) {
                    return null;
                }
            }
        }
        return null;
    }

    updateTabla(simbolo){
        var tablaActual = this;
        while (tablaActual != null){
            if(simbolo.id in tablaActual.tabla){
                if(tablaActual.tabla[simbolo.id].getType() == simbolo.getType() || simbolo.getValue() == "null"){
                    tablaActual.tabla[simbolo.id].setValue(simbolo.getValue());
                    if (simbolo.getValue() != "null") {
                        tablaActual.tabla[simbolo.id].setType(simbolo.getType());
                    }
                    return null; //variable actualizada
                }
                else if(tablaActual.tabla[simbolo.id].getType() == Tipo.DECIMAL && simbolo.getType() == Tipo.ENTERO){
                    var temp = tablaActual.tabla[simbolo.id].getType();
                    tablaActual.tabla[simbolo.id].setValue(simbolo.getValue());
                    tablaActual.tabla[simbolo.id].setType(temp);
                    return null
                }
                return new Exception("Semantico","Tipo de asignación incorrecta.", simbolo.getRow(), simbolo.getColumn());

            }else{
                tablaActual = tablaActual.anterior;
            }
        }
        return new Exception("Semantico",`Variable ${simbolo.getId()} no encontrada.`, simbolo.getRow(), simbolo.getColumn());
    }
    
    isGlobal(){
        var tablaActual = this;
        var global = true;
        tablaActual = tablaActual.anterior;
        if(tablaActual != null){
            return !(global);
        }
        return global;
    }

}