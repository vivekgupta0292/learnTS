let x: number = 5;
let y: string[];
let z: any;
z = 12;

let a = 10; // type inference - TS infers the type of a as number based on the assigned value

let greeting: string = "Hello, World!";

greeting.toUpperCase(); // method available on string type

console.log(greeting);

let obj: object = {
    name: "Vivek",
    age: 30,
    isStudent: false
};

export {}; // to make this file a module and avoid global scope pollution