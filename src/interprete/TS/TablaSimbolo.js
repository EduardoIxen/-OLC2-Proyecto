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
        if (simbolo.id in this.tabla){
            return Exception("Semantico",`Variable ${simbolo.id} ya existe.`, simbolo.getRow(), simbolo.getColumn());
        }else{
            this.tabla[simbolo.id] = simbolo;
            return null;
        }
    }

    getTabla(id){
        tablaActual = this;
        while(tablaActual.tabla != None){
            if(id in tablaActual.tabla){
                return tablaActual.tabla[id];
            }else{
                tablaActual = tablaActual.anterior;
                if (tablaActual == null){
                    return None;
                }
            }
        }
    }

    updateTabla(simbolo){
        tablaActual = this;
        while (tablaActual != null){
            if(simbolo.id in tablaActual.tabla){
                if(tablaActual.tabla[simbolo.id].getType() == simbolo.getType()){
                    console.log(`se actualiza ${simbolo.id}`)
                    return null;
                }
                return Exception("Semantico","Tipo de asignación incorrecta.", simbolo.getRow(), simbolo.getColumn());

            }else{
                tablaActual = tablaActual.anterior;
                if(tablaActual == null){
                    return null;
                }
            }
        }
    }
}