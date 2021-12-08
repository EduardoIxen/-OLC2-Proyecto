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
    }


    setTabla(simbolo){
        if (simbolo.id.toLowerCase() in this.tabla){
            return Exception("Semantico",`Variable ${simbolo.id} ya existe.`, simbolo.getRow(), simbolo.getColumn());
        }else{
            this.tabla[simbolo.id.toLowerCase()] = simbolo;
            return null;
        }
    }

    getTabla(id){
        var tablaActual = this;
        while(tablaActual.tabla != null){
            if(id.toLowerCase() in tablaActual.tabla){
                return tablaActual.tabla[id.toLowerCase()];  //retornar el simbolo encontrado
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
            if(simbolo.id.toLowerCase() in tablaActual.tabla){
                if(tablaActual.tabla[simbolo.id.toLowerCase()].getType() == simbolo.getType()){
                    console.log(`se actualiza ${simbolo.id}`)
                    tablaActual.tabla[simbolo.id.toLowerCase()].setValue(simbolo.getValue())
                    tablaActual.tabla[simbolo.id.toLowerCase()].setType(simbolo.getType())
                    return null; //variable actualizada
                }
                return Exception("Semantico","Tipo de asignación incorrecta.", simbolo.getRow(), simbolo.getColumn());

            }else{
                tablaActual = tablaActual.anterior;
                if (tablaActual == null) {
                    return null;
                }
            }
        }
        return Exception("Semantico",`Variable ${simbolo.getId()} no encontrada.`, simbolo.getRow(), simbolo.getColumn());
    }
}