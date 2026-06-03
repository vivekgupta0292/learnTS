// ============================================================
// TYPESCRIPT GENERICS — Complete Reference with Examples
// ============================================================


// ============================================================
// 1. THE PROBLEM — why we need generics
// ============================================================

// Bad: using `any` loses all type safety
function identityAny(value: any): any {
  return value;
}
const badResult = identityAny(42); // TypeScript thinks this is `any`, not `number`
// badResult.toUpperCase() — no error here, but crashes at runtime!


// ============================================================
// 2. BASIC GENERIC FUNCTION
// <T> is a type parameter — a placeholder decided at call time
// Whatever type goes IN, the same type comes OUT
// ============================================================

function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);      // T = number, returns number
const str = identity<string>("hello"); // T = string, returns string
const bool = identity<boolean>(true);  // T = boolean, returns boolean


// ============================================================
// 3. TYPE INFERENCE — TypeScript figures out T automatically
// You don't always need to write <number> explicitly
// ============================================================

const inferredNum = identity(42);       // TypeScript sees number → T = number
const inferredStr = identity("world");  // TypeScript sees string → T = string
// No need to type <number> or <string> — TypeScript infers it from the argument


// ============================================================
// 4. GENERIC FUNCTIONS WITH ARRAYS
// T[] means "array of whatever T is"
// ============================================================

function first<T>(arr: T[]): T {
  return arr[0];
}

function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

function reverse<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

const firstNum = first([10, 20, 30]);          // returns number (10)
const firstStr = first(["a", "b", "c"]);       // returns string ("a")
const lastBool = last([true, false, true]);     // returns boolean (true)
const reversed = reverse([1, 2, 3]);           // returns number[] ([3, 2, 1])


// ============================================================
// 5. MULTIPLE TYPE PARAMETERS
// You can have more than one placeholder — K, V, A, B, etc.
// ============================================================

function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

function swap<A, B>(a: A, b: B): [B, A] {
  return [b, a];
}

const p1 = pair("name", "Alice");   // [string, string]
const p2 = pair("age", 30);         // [string, number]
const p3 = pair(1, true);           // [number, boolean]

const swapped = swap("hello", 42);  // [number, string] — types are swapped too!


// ============================================================
// 6. GENERIC INTERFACES
// The shape stays the same — only the value type changes
// ============================================================

interface Box<T> {
  value: T;
  label: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const numberBox: Box<number> = { value: 42, label: "age" };
const stringBox: Box<string> = { value: "Alice", label: "name" };
const boolBox: Box<boolean> = { value: true, label: "isActive" };

const userResponse: ApiResponse<{ name: string; age: number }> = {
  data: { name: "Alice", age: 30 },
  status: 200,
  message: "OK",
};

const errorResponse: ApiResponse<null> = {
  data: null,
  status: 404,
  message: "Not found",
};


// ============================================================
// 7. GENERIC TYPE ALIASES
// Like interfaces but using the `type` keyword
// ============================================================

type Nullable<T> = T | null;          // T or null
type Optional<T> = T | undefined;    // T or undefined
type Maybe<T> = T | null | undefined; // T, null, or undefined

type Pair<A, B> = { first: A; second: B };
type Triple<A, B, C> = { first: A; second: B; third: C };

let username: Nullable<string> = "Alice";
username = null; // valid — Nullable allows null

let age: Optional<number> = 25;
age = undefined; // valid — Optional allows undefined

const coords: Pair<number, number> = { first: 10, second: 20 };
const rgb: Triple<number, number, number> = { first: 255, second: 128, third: 0 };


// ============================================================
// 8. GENERIC CLASSES
// One class definition, works for any type, fully type-safe
// ============================================================

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.push(3);
numStack.pop();   // returns number (3)
numStack.peek();  // returns number (2)

const strStack = new Stack<string>();
strStack.push("hello");
strStack.push("world");
strStack.pop();  // returns string ("world")


class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get size(): number {
    return this.items.length;
  }
}

const jobQueue = new Queue<string>();
jobQueue.enqueue("job1");
jobQueue.enqueue("job2");
jobQueue.dequeue(); // returns "job1" (first in, first out)


// ============================================================
// 9. GENERIC CONSTRAINTS — T must have certain properties
// Use `extends` to say "T must at least look like this"
// ============================================================

// T must have a `length` property that is a number
function printLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

printLength("hello");       // OK — string has .length (5)
printLength([1, 2, 3]);     // OK — array has .length (3)
printLength({ length: 10 }); // OK — has .length explicitly
// printLength(42);          // ERROR — number has no .length


// T must extend a specific interface
interface HasName {
  name: string;
}

function greet<T extends HasName>(entity: T): string {
  return `Hello, ${entity.name}!`;
}

greet({ name: "Alice" });                      // OK
greet({ name: "Bob", age: 30 });              // OK — extra properties are fine
greet({ name: "Cat", species: "feline" });    // OK
// greet({ age: 30 });                         // ERROR — missing `name`


// ============================================================
// 10. keyof — get all key names of an object type as a union
// keyof { name: string; age: number } → "name" | "age"
// ============================================================

// K extends keyof T means K must be an actual key of T
// T[K] is the type of the value at key K
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, isActive: true };

const personName = getProperty(person, "name");      // returns string
const personAge = getProperty(person, "age");         // returns number
const personFlag = getProperty(person, "isActive");   // returns boolean
// getProperty(person, "xyz");                         // ERROR — "xyz" is not a key


// Setting a property safely using keyof
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const updated = setProperty(person, "age", 31);       // OK — age is number
// setProperty(person, "age", "thirty-one");            // ERROR — "thirty-one" is not a number


// ============================================================
// 11. DEFAULT TYPE PARAMETERS
// Like default values for function parameters, but for types
// ============================================================

interface PaginatedResponse<T = string> {
  items: T[];
  page: number;
  total: number;
}

// T defaults to string if not specified
const strPage: PaginatedResponse = {
  items: ["a", "b", "c"],
  page: 1,
  total: 3,
};

// Override the default
const numPage: PaginatedResponse<number> = {
  items: [1, 2, 3],
  page: 1,
  total: 3,
};


// ============================================================
// 12. GENERIC CONSTRAINTS WITH MULTIPLE PARAMETERS
// One parameter can be constrained by another
// ============================================================

// K must be a key that actually exists on T
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map((item) => item[key]);
}

const people = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Carol", age: 35 },
];

const names = pluck(people, "name"); // string[]  → ["Alice", "Bob", "Carol"]
const ages = pluck(people, "age");   // number[]  → [30, 25, 35]
// pluck(people, "xyz");              // ERROR — "xyz" is not a key of the objects


// ============================================================
// 13. CONDITIONAL TYPES — type changes based on a condition
// Syntax: T extends U ? TypeIfTrue : TypeIfFalse
// ============================================================

// If T is a string, return string[]. Otherwise return T[]
type Flatten<T> = T extends string ? string[] : T[];

type A = Flatten<string>;  // string[]
type B = Flatten<number>;  // number[]
type C = Flatten<boolean>; // boolean[]


// Built-in utility: NonNullable removes null and undefined from T
type D = NonNullable<string | null | undefined>; // string


// ============================================================
// 14. GENERIC UTILITY TYPES (built into TypeScript)
// These are all implemented using generics internally
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> — makes all properties optional
type PartialUser = Partial<User>;
const partialUser: PartialUser = { name: "Alice" }; // age, email, id all optional

// Required<T> — makes all properties required (opposite of Partial)
type RequiredUser = Required<PartialUser>;

// Readonly<T> — makes all properties read-only (can't be reassigned)
type ReadonlyUser = Readonly<User>;
const frozenUser: ReadonlyUser = { id: 1, name: "Alice", email: "a@b.com", age: 30 };
// frozenUser.name = "Bob"; // ERROR — cannot assign to read-only property

// Pick<T, K> — keep only the keys you specify
type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: 1, name: "Alice" }; // only id and name

// Omit<T, K> — remove the keys you specify
type UserWithoutEmail = Omit<User, "email">;
const noEmail: UserWithoutEmail = { id: 1, name: "Alice", age: 30 }; // no email

// Record<K, V> — creates an object type with keys K and values V
type RoleMap = Record<string, boolean>;
const permissions: RoleMap = { admin: true, editor: false, viewer: true };

// ReturnType<T> — extracts the return type of a function
function getUser() {
  return { id: 1, name: "Alice" };
}
type GetUserReturn = ReturnType<typeof getUser>; // { id: number; name: string }

// Parameters<T> — extracts the parameter types of a function as a tuple
function createUser(_name: string, _age: number, _isActive: boolean) {}
type CreateUserParams = Parameters<typeof createUser>; // [string, number, boolean]


// ============================================================
// 15. REAL-WORLD EXAMPLE — Generic fetch wrapper
// Promise<T> is itself a generic — T is the resolved value type
// ============================================================

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// Usage — TypeScript knows exactly what shape to expect
type Post = { id: number; title: string; body: string };
type PostComment = { id: number; postId: number; text: string };

// fetchData<Post>("/api/posts/1")        → resolves to Post
// fetchData<PostComment[]>("/api/comments") → resolves to PostComment[]


// ============================================================
// 16. REAL-WORLD EXAMPLE — Generic event emitter
// ============================================================

type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string; code: number };
  resize: { width: number; height: number };
};

// K must be a key of EventMap — guarantees the payload type matches the event
function emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  console.log(`Event: ${event}`, payload);
}

emit("click", { x: 100, y: 200 });          // OK — payload matches click shape
emit("keypress", { key: "Enter", code: 13 }); // OK — payload matches keypress shape
// emit("click", { key: "Enter" });            // ERROR — wrong payload for "click"


// ============================================================
// SUMMARY — Mental model cheat sheet
//
// <T>                  → blank label, filled in at call time
// <T, K>               → two blank labels
// T extends X          → T must have at least X's shape
// keyof T              → union of all key names of T ("a" | "b" | "c")
// T[K]                 → the type of value at key K in T
// <T = string>         → T defaults to string if not provided
// T extends U ? A : B  → conditional type (if/else for types)
// ============================================================
