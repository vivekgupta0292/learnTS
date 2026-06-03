// ─────────────────────────────────────────────
// 1. BASIC TYPED FUNCTION
// TypeScript forces you to declare what goes IN and what comes OUT.
// If you pass wrong types, it errors at compile time — not at runtime.
// ─────────────────────────────────────────────
function sum(a: number, b: number): number {
    return a + b;
}

sum(2, 3); // returns 5
// sum(2, "3"); // ERROR — "3" is a string, TS catches this before the code even runs


// ─────────────────────────────────────────────
// 2. OPTIONAL PARAMETER  ( ? )
// Adding ? after a param means it might not be passed.
// Inside the function, TS knows it can be string OR undefined — you must handle both.
// ─────────────────────────────────────────────
function greet(name: string, greeting?: string): string {
    // greeting could be undefined here, so we fall back to "Hello"
    return `${greeting ?? "Hello"}, ${name}!`;
}

greet("Vivek");           // "Hello, Vivek!"
greet("Vivek", "Hey");   // "Hey, Vivek!"


// ─────────────────────────────────────────────
// 3. DEFAULT PARAMETER
// If caller doesn't pass the value, TypeScript uses the default.
// Unlike optional params, you don't need to handle undefined yourself.
// ─────────────────────────────────────────────
function createUser(name: string, role: string = "viewer"): string {
    return `${name} is a ${role}`;
}

createUser("Vivek");           // "Vivek is a viewer"
createUser("Vivek", "admin");  // "Vivek is an admin"


// ─────────────────────────────────────────────
// 4. REST PARAMETERS  ( ...args )
// When you don't know how many arguments will be passed.
// TS types it as an array — here number[] — so you get array methods on it.
// ─────────────────────────────────────────────
function sumAll(...numbers: number[]): number {
    // reduce walks through every number and adds it to a running total
    return numbers.reduce((total, n) => total + n, 0);
}

sumAll(1, 2, 3);       // 6
sumAll(10, 20, 30, 40); // 100


// ─────────────────────────────────────────────
// 5. FUNCTION OVERLOADS
// Sometimes a function can accept different shapes of input and return different shapes.
// Overloads let you declare each valid combination explicitly.
// TS will use these signatures for type checking, and the last "implementation" handles all.
// ─────────────────────────────────────────────
function format(value: string): string;            // overload 1: string in → string out
function format(value: number): string;            // overload 2: number in → string out
function format(value: string | number): string {  // actual implementation
    if (typeof value === "number") {
        return value.toFixed(2);  // 3 → "3.00"
    }
    return value.trim();          // "  hello  " → "hello"
}

format("  hello  "); // "hello"
format(3);           // "3.00"
// format(true);     // ERROR — boolean is not in any overload signature


// ─────────────────────────────────────────────
// 6. GENERIC FUNCTION
// A generic lets you write ONE function that works for MANY types,
// while still being type-safe. T is a placeholder — TS fills it in at call time.
// Without generics you'd have to write this function separately for string, number, etc.
// ─────────────────────────────────────────────
function firstItem<T>(arr: T[]): T | undefined {
    return arr[0];
}

const first = firstItem([10, 20, 30]);  // TS knows this is number | undefined
const word  = firstItem(["a", "b"]);    // TS knows this is string | undefined

console.log(first, word); // 10, "a"


// ─────────────────────────────────────────────
// 7. VOID — function that does something but returns nothing useful
// void tells TS "don't expect a return value from this".
// At runtime it returns undefined, but void signals intentional absence of a result.
// ─────────────────────────────────────────────
function logError(message: string): void {
    console.error(`[ERROR]: ${message}`);
    // no return needed — caller shouldn't use the result
}

logError("Something went wrong"); // prints: [ERROR]: Something went wrong


// ─────────────────────────────────────────────
// 8. NEVER — function that NEVER returns (always throws or infinite loops)
// TS uses never to model "this code path is impossible / unreachable".
// Useful to make exhaustive checks — if you forget a case, TS will error here.
// ─────────────────────────────────────────────
function throwError(message: string): never {
    throw new Error(message);
    // nothing after this line is reachable — TS enforces this
}

// typically used inside other functions to crash on invalid state:
function getUser(id: number): string {
    if (id <= 0) throwError("Invalid user id"); // TS knows execution stops here
    return `User #${id}`;
}

console.log(getUser(5)); // "User #5"

// Exhaustive check with never:
type Direction = "left" | "right" | "up";

function move(dir: Direction): string {
    if (dir === "left")  return "going left";
    if (dir === "right") return "going right";
    if (dir === "up")    return "going up";

    // If you add "down" to Direction but forget to handle it above,
    // TS will error on this line because dir would be "down", not never.
    const _exhaustiveCheck: never = dir;
    return _exhaustiveCheck;
}


// ─────────────────────────────────────────────
// 9. TYPE GUARD FUNCTION
// A function that narrows an unknown type into a specific type.
// The return type "value is string" is special — it tells TS
// "if this returns true, treat the variable as a string from here on".
// ─────────────────────────────────────────────
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function printLength(value: unknown): void {
    if (isString(value)) {
        console.log(value.length); // TS knows value is string here — .length is safe
    } else {
        console.log("not a string");
    }
}


// ─────────────────────────────────────────────
// 10. FUNCTION AS A TYPE  (first-class functions)
// Functions can be passed around like values.
// You can type exactly what shape a function parameter must have.
// ─────────────────────────────────────────────
type MathOperation = (a: number, b: number) => number;

function calculate(a: number, b: number, operation: MathOperation): number {
    return operation(a, b);
}

const multiply = (a: number, b: number): number => a * b;

calculate(3, 4, multiply);          // 12
calculate(10, 2, (a, b) => a - b);  // 8


export {};