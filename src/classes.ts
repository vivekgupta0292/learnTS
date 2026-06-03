// CLASSES in TypeScript
//
// A class is a blueprint for creating objects.
// It bundles DATA (properties) and BEHAVIOR (methods) together.
// TypeScript adds access modifiers, readonly, abstract, generics,
// and full interface support on top of JavaScript classes.


// 1. BASIC CLASS WITH ACCESS MODIFIERS
//
// public    - accessible from anywhere (default if you write nothing)
// private   - only accessible INSIDE this class, nowhere else
// protected - accessible inside this class AND subclasses, not outside
// readonly  - can be set in the constructor, never changed after that
//
// Note: these modifiers are compile-time only. At runtime (JS) all
// properties exist on the object - TS just prevents incorrect access.
class User {
    readonly _id: number;
    public username: string;
    private email: string;
    protected isActive: boolean;

    constructor(_id: number, username: string, email: string, isActive: boolean) {
        this._id      = _id;
        this.username = username;
        this.email    = email;
        this.isActive = isActive;
    }

    getUserEmail(): string { return this.email; }

    setUserEmail(newEmail: string): void {
        if (!newEmail.includes("@")) throw new Error("Invalid email");
        this.email = newEmail;
    }

    toString(): string { return `User(${this._id}, ${this.username})`; }
}

const vivek = new User(1, "vivek", "v@x.com", true);
console.log(vivek._id);            // 1
console.log(vivek.getUserEmail()); // "v@x.com"
vivek.setUserEmail("new@x.com");
// vivek.email = "x";  // ERROR - private
// vivek._id = 2;      // ERROR - readonly


// 2. SHORTHAND CONSTRUCTOR (Parameter Properties)
//
// Add an access modifier directly in the constructor params.
// TS creates the property AND assigns the value in one step -
// no need to declare fields above and assign in the body separately.
class Product {
    constructor(
        public readonly sku: string,    // creates this.sku, readonly
        public title: string,           // creates this.title
        private price: number,          // creates this.price, private
        public inStock: boolean = true  // default value - optional to pass
    ) {}

    getPrice(): number { return this.price; }

    applyDiscount(percent: number): void {
        this.price = this.price * (1 - percent / 100);
    }
}

const iphone = new Product("PH-001", "iPhone 15", 999);
console.log(iphone.title);      // "iPhone 15"
console.log(iphone.getPrice()); // 999
iphone.applyDiscount(10);
console.log(iphone.getPrice()); // 899.1


// 3. GETTERS AND SETTERS
//
// get - access a computed value like a plain property, no parentheses needed
// set - intercept assignment and run validation before storing
//
// Caller writes:  circle.radius = 5  (looks like a property assignment)
// Internally the setter function runs - clean API, hidden validation logic.
class Circle {
    private _radius: number;

    constructor(radius: number) { this._radius = radius; }

    get radius(): number { return this._radius; }

    set radius(value: number) {
        if (value < 0) throw new Error("Radius cannot be negative");
        this._radius = value;
    }

    get area(): number { return Math.PI * this._radius ** 2; }

    get circumference(): number { return 2 * Math.PI * this._radius; }
}

const circle = new Circle(5);
console.log(circle.radius);          // 5
console.log(circle.area.toFixed(2)); // "78.54"
circle.radius = 10;
console.log(circle.area.toFixed(2)); // "314.16"
// circle.radius = -1;               // throws Error: Radius cannot be negative


// 4. STATIC MEMBERS
//
// static properties and methods belong to the CLASS itself, not instances.
// You call them on the class name - not on an object created with new.
// Common uses: counters, factory methods, utility helpers, shared state.
class Counter {
    private static count = 0; // ONE copy shared across all instances

    readonly id: number;

    constructor() {
        Counter.count++;
        this.id = Counter.count;
    }

    static getCount(): number { return Counter.count; }
    static reset(): void { Counter.count = 0; }
}

const ct1 = new Counter(); // count = 1
const ct2 = new Counter(); // count = 2
const ct3 = new Counter(); // count = 3
console.log(Counter.getCount());      // 3
console.log(ct1.id, ct2.id, ct3.id); // 1 2 3
Counter.reset();
console.log(Counter.getCount());      // 0


// 5. INHERITANCE  ( extends )
//
// A subclass inherits all public and protected members from the parent.
// super() MUST be called before using "this" in the child constructor.
// Child can override parent methods to change behavior (polymorphism).
class Animal {
    constructor(public name: string, protected sound: string) {}

    speak(): string { return `${this.name} says ${this.sound}`; }
    move(): string  { return `${this.name} is moving`; }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name, "Woof"); // calls Animal constructor first
    }

    speak(): string {
        // super.speak() invokes the parent version, then we extend it
        return `${super.speak()}! (${this.breed})`;
    }

    fetch(item: string): string { return `${this.name} fetches the ${item}`; }
}

class Cat extends Animal {
    constructor(name: string) { super(name, "Meow"); }
    speak(): string { return `${this.name} quietly says ${this.sound}...`; }
}

const dog = new Dog("Bruno", "Labrador");
const cat = new Cat("Whiskers");

console.log(dog.speak());       // "Bruno says Woof! (Labrador)"
console.log(cat.speak());       // "Whiskers quietly says Meow..."
console.log(dog.fetch("ball")); // "Bruno fetches the ball"
console.log(dog.move());        // "Bruno is moving" - inherited unchanged


// 6. IMPLEMENTING AN INTERFACE
//
// "implements" forces a class to provide every field and method declared
// in the interface. TS errors at compile time if anything is missing.
// A class can implement MULTIPLE interfaces at once.
interface Serializable {
    serialize(): string;
    deserialize(data: string): void;
}

interface Validatable {
    validate(): boolean;
}

class UserProfile implements Serializable, Validatable {
    constructor(
        public username: string,
        public email: string,
        public age: number
    ) {}

    serialize(): string {
        return JSON.stringify({ username: this.username, email: this.email, age: this.age });
    }

    deserialize(data: string): void {
        const parsed  = JSON.parse(data);
        this.username = parsed.username;
        this.email    = parsed.email;
        this.age      = parsed.age;
    }

    validate(): boolean {
        return this.email.includes("@") && this.age >= 0 && this.username.length > 0;
    }
}

const profile = new UserProfile("vivek", "v@x.com", 25);
console.log(profile.serialize());  // {"username":"vivek","email":"v@x.com","age":25}
console.log(profile.validate());   // true


// 7. ABSTRACT CLASS
//
// An abstract class is a TEMPLATE - cannot be instantiated directly.
// It can have:
//   - Concrete methods  (shared logic all subclasses inherit unchanged)
//   - Abstract methods  (no body - every subclass MUST implement these)
//
// Use when several classes share some logic but must each define
// certain behavior in their own way.
abstract class Shape {
    constructor(public color: string) {}

    abstract getArea(): number;       // no body - subclass must provide
    abstract getPerimeter(): number;  // no body - subclass must provide

    // concrete - all subclasses inherit this unchanged
    describe(): string {
        return `A ${this.color} shape with area ${this.getArea().toFixed(2)}`;
    }
}

class RectangleShape extends Shape {
    constructor(color: string, private width: number, private height: number) {
        super(color);
    }
    getArea(): number      { return this.width * this.height; }
    getPerimeter(): number { return 2 * (this.width + this.height); }
}

class CircleShape extends Shape {
    constructor(color: string, private radius: number) { super(color); }
    getArea(): number      { return Math.PI * this.radius ** 2; }
    getPerimeter(): number { return 2 * Math.PI * this.radius; }
}

// new Shape("red"); // ERROR - cannot instantiate abstract class

const rectShape = new RectangleShape("blue", 4, 6);
const circShape = new CircleShape("red", 5);

console.log(rectShape.describe());     // "A blue shape with area 24.00"
console.log(circShape.describe());     // "A red shape with area 78.54"
console.log(rectShape.getPerimeter()); // 20


// 8. GENERIC CLASS
//
// A class can accept a type parameter T, filled in when you create an instance.
// T is a placeholder - TS infers or you provide it explicitly.
// Lets one class safely handle any type without duplicating code.
class Stack<T> {
    private items: T[] = [];

    push(item: T): void   { this.items.push(item); }
    pop(): T | undefined  { return this.items.pop(); }
    peek(): T | undefined { return this.items[this.items.length - 1]; }
    get size(): number    { return this.items.length; }
    isEmpty(): boolean    { return this.items.length === 0; }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
console.log(numStack.peek()); // 3
console.log(numStack.pop());  // 3
console.log(numStack.size);   // 2

const strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");
console.log(strStack.pop()); // "world"


// 9. SINGLETON PATTERN
//
// Ensures only ONE instance of a class ever exists in the application.
// Constructor is private - you cannot call new from outside the class.
// getInstance() creates the instance on the first call, reuses it after.
class AppConfig {
    private static instance: AppConfig | null = null;

    private constructor(
        public readonly env: string,
        public readonly apiUrl: string,
        public readonly version: string
    ) {}

    static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            // first call - create the one and only instance
            AppConfig.instance = new AppConfig("production", "https://api.example.com", "1.0.0");
        }
        return AppConfig.instance; // all later calls return the same object
    }
}

const cfg1 = AppConfig.getInstance();
const cfg2 = AppConfig.getInstance();

console.log(cfg1 === cfg2); // true - exact same object in memory
console.log(cfg1.apiUrl);   // "https://api.example.com"
// new AppConfig(...);      // ERROR - constructor is private


// 10. CLASS AS A TYPE
//
// A class declaration creates TWO things simultaneously:
//   1. A runtime VALUE  - the constructor function you call with new
//   2. A compile-time TYPE - the shape of any instance of that class
//
// You can use the class name as a type annotation directly,
// exactly like an interface or type alias.
class Point {
    constructor(public x: number, public y: number) {}

    distanceTo(other: Point): number { // Point used as a type here
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    toString(): string { return `(${this.x}, ${this.y})`; }
}

function midpoint(p1: Point, p2: Point): Point {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

const p1 = new Point(0, 0);
const p2 = new Point(4, 3);

console.log(p1.distanceTo(p2));           // 5
console.log(midpoint(p1, p2).toString()); // "(2, 1.5)"


export {};
