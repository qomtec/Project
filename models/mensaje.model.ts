import { Md5 } from "ts-md5";
export class Mensaje {
    public $key: string;
    constructor( 
        public para: string,
        public mensaje: string,
        public fecha: string,
        public hora: string,
        public timestamp: Object,
        public de: string,
        public estado: number
    ){}
    static GenerateKey(email: string): string{
        let referencia: string;
        referencia = Md5.hashStr(email).toString();
        referencia = referencia.substring(0, 19);
        return referencia;
    }
}