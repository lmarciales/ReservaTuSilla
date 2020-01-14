export interface UserModel {
  id?: string;
  email: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  role: string;
}
