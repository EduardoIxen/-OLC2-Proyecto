class C3D{
    constructor(value, type, isTemp){
        this.value = value;  // temp
        this.type = type;
        this.isTemp = isTemp; // temp==true || label == false
        this.EV = ''; // ETIQUETA VERDADERA
        this.EF = ''; // ETIQUETA FALSA
        this.posGlobal = null; // POSICIÓN DEL STACK
    }

}