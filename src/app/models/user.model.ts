export class User {
    constructor(
        public name:string,
        public email:string,
        public role:string,
        public parking_id:string,
        public password?:string,
        public module?:string,
        public notification_token?:string,
        public uid?:string
    ){}
}