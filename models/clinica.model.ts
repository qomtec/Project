export class Clinica {
    public $key: string;
    constructor(
        public codigo: string,
        public email: string,
        public nombre: string,
        public telefono: string,
        
    ) {}
    static currentClinica: Clinica;
}