export class Company {


    constructor(public _id: number, public name: string,
        public url: string,
        public phone: string,
        public fax: string,
        public addressLineOne: string,
        public addressLineTwo: string,
        public status: boolean,
        public city: string,
        public state: string,
        public description: string,
        public companyType: string,
        public companyAnnouncements: string,
        public tracratAnnouncements: string,
        public primaryContactName: string,
        public postalCode: number,
        public logo: string | any) {

    }

}