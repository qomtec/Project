import { Md5 } from "ts-md5";
export class Mensaje {
    public $key: string;
    constructor( 
        public nombre_paciente: string,
        public medico: string,
        public paciente: string,
        public fecha: string,
        public mensaje: string,
        public hora: string,
        public timestamp: Object,
        public estado: number
    ){}
    static GenerateKey(email: string): string{
        let referencia: string;
        referencia = Md5.hashStr(email).toString();
        referencia = referencia.substring(0, 19);
        return referencia;
    }
}