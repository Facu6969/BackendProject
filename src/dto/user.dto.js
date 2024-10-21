class CreateUserDTO {
    constructor({ first_name, last_name, email, password, age, role }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.role = role || 'user';
    }
}

export default CreateUserDTO;
