export interface User {
    _id: string;
    name: string;
    email: string;
    gender: "male" | "female";
    age: number;
    skills: string[];
    about: string;
    photoUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

// start with global auth store 