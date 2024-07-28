export class User {
    firstName: string;
    lastName: string;
    email: string;
    sex: string;
    objectId: string;

    constructor(firstName: string, lastName: string, email: string, sex: string, objectId: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.sex = sex;
        this.objectId = objectId;
    }

    getFirstName(){
        return this.firstName;
    }

    getLastName(){
        return this.lastName;
    }

    getEmail(){
        return this.email;
    }

    getSex(){
        return this.sex;
    }
    
}