class NodoAST{
    constructor(valor){
        this.hijos = [];
        this.valor = valor;
    }

    setHijos(hijos){
        this.hijos = hijos;
    }
    agregarHijo(valorHijo){
        this.hijos.push(new NodoAST(valorHijo.toString()));
    }

    agregarHijos(hijos){
        for(var hijo of hijos){
            this.hijos.push(hijo);
        }
    }

    agregarHijoNodo(hijo){
        this.hijos.push(hijo);
    }

    agregarPrimerHijo(valor_hijo){
        this.hijos.unshift(valor_hijo);
    }

    agregarPrimerHijoNodo(hijo){
        this.hijos.unshift(hijo);
    }

    getValor(){
        return this.valor.toString();
    }

    setValor(valor){
        this.valor = valor;
    }

    getHijos(){
        return this.hijos;
    }

    

}