class CreateUserDTO {
    constructor({ first_name, last_name, email, password, age, role, isVerified, verificationToken }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.role = role || 'user';
        this.isVerified = isVerified || false;
        this.verificationToken = verificationToken;
    }
}

export default CreateUserDTO;
