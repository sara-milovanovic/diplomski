export class User_c{
    constructor(
        public id:string,
        public je_najbolji: boolean,
        public ime: string,
        public prezime: string,
        public korisnicko_ime: string,
        public lozinka: string,
        public tip:string,
        public slika: string,
        public mejl: string)
    {}
}