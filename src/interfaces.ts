// ─────────────────────────────────────────────
// 1. BASIC INTERFACE + EXTENDS
// An interface defines the "shape" of an object — what fields it must have.
// extends pulls all fields from another interface (like inheritance for types).
// Any object claiming to be Contact MUST satisfy both Contact AND Address fields.
// ─────────────────────────────────────────────
interface Address {
    street: string;
    city: string;
    country: string;
}

enum ContactStatus {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING",
}

interface Contact extends Address {
    readonly _id: number;
    name: string;
    birthDate?: Date;        // ? makes this field optional — safe to omit
    status?: ContactStatus;
}

const contact1: Contact = {
    _id: 1,
    name: "Vivek",
    street: "123 Main St",
    city: "Anytown",
    country: "USA",
};

console.log(contact1.name); // "Vivek"


// ─────────────────────────────────────────────
// 2. READONLY PROPERTIES
// readonly means the field can be set once at creation, never changed after.
// TS catches any mutation attempt at compile time — bug never reaches runtime.
// ─────────────────────────────────────────────
type User = {
    readonly _id: string;   // locked after initialization
    username: string;
    email: string;
    isActive: boolean;
};

const user1: User = { _id: "abc123", username: "vivek", email: "v@x.com", isActive: true };
// user1._id = "xyz";  // ERROR — cannot assign to a readonly property
console.log(user1.username);


// ─────────────────────────────────────────────
// 3. INDEX SIGNATURE
// When you don't know the exact keys upfront but know their types.
// Common for dictionaries, HTTP headers, or dynamic API responses.
// ─────────────────────────────────────────────
interface StringMap {
    [key: string]: string;  // any string key → string value
}

const headers: StringMap = {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
};

console.log(headers["Content-Type"]); // "application/json"


// ─────────────────────────────────────────────
// 4. INTERFACE WITH METHODS
// Interfaces can describe methods an object must implement.
// Different objects can satisfy the same interface in their own way.
// ─────────────────────────────────────────────
interface Animal {
    name: string;
    speak(): string;
    move(distance: number): void;
}

const dog: Animal = {
    name: "Bruno",
    speak: () => "Woof!",
    move: (d) => console.log(`Bruno moved ${d}m`),
};

console.log(dog.speak()); // "Woof!"


// ─────────────────────────────────────────────
// 5. DECLARATION MERGING
// Declaring the same interface name twice causes TS to merge them into one.
// Useful for extending third-party library types without editing their source.
// NOTE: type aliases CANNOT be merged — this is unique to interfaces.
// ─────────────────────────────────────────────
interface Plugin {
    name: string;
}

interface Plugin {          // same name — TS merges both declarations
    version: string;
}

// Now Plugin requires BOTH name AND version
const myPlugin: Plugin = { name: "auth", version: "1.0.0" };
console.log(myPlugin);


// ─────────────────────────────────────────────
// 6. TYPE ALIAS — union of primitives
// type is more flexible than interface — it can represent unions, intersections, tuples.
// ─────────────────────────────────────────────
type ID = string | number;   // ID can be a string OR a number

let userId: ID = 101;
userId = "user_abc";         // also valid — both are in the union
console.log(userId);


// ─────────────────────────────────────────────
// 7. TYPE ALIAS — object shape
// type can describe objects just like interface.
// KEY DIFFERENCE: type cannot be re-declared/merged, interface can.
// ─────────────────────────────────────────────
type Product = {
    readonly sku: string;
    title: string;
    price: number;
    inStock: boolean;
};

const phone: Product = { sku: "PH-001", title: "iPhone", price: 999, inStock: true };
console.log(phone.title); // "iPhone"


// ─────────────────────────────────────────────
// 8. UNION TYPE  ( | )
// A value can be one of several specific types.
// TS forces you to handle each case before using the value safely.
// ─────────────────────────────────────────────
type Status = "loading" | "success" | "error"; // only these 3 strings are valid

function showStatus(s: Status): string {
    if (s === "loading") return "Please wait...";
    if (s === "success") return "Done!";
    return "Something went wrong.";
}

console.log(showStatus("success")); // "Done!"
// showStatus("idle");              // ERROR — "idle" is not in the union


// ─────────────────────────────────────────────
// 9. INTERSECTION TYPE  ( & )
// Combines multiple types into one — result must satisfy ALL of them.
// Think: "A AND B" vs union's "A OR B".
// ─────────────────────────────────────────────
type WithTimestamps = {
    createdAt: Date;
    updatedAt: Date;
};

// PersistedUser must have all User fields AND both timestamp fields
type PersistedUser = User & WithTimestamps;

const dbUser: PersistedUser = {
    _id: "u1",
    username: "vivek",
    email: "v@x.com",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

console.log(dbUser.username, dbUser.createdAt);


// ─────────────────────────────────────────────
// 10. DISCRIMINATED UNION
// Each variant has a shared "kind" field with a unique literal value.
// TS uses that "kind" field to narrow down which exact shape you're working with.
// Safest pattern for "could be one of several different shapes".
// ─────────────────────────────────────────────
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2; // TS knows it's Circle here
        case "rectangle":
            return shape.width * shape.height;  // TS knows it's Rectangle here
    }
}

console.log(getArea({ kind: "circle", radius: 5 }));               // ~78.5
console.log(getArea({ kind: "rectangle", width: 4, height: 6 })); // 24


// ─────────────────────────────────────────────
// 11. UTILITY TYPES — Partial, Required, Readonly, Pick, Omit
// Built-in generics that transform existing types — no manual rewriting needed.
// ─────────────────────────────────────────────

// Partial<T> — every field becomes optional (great for PATCH/update payloads)
type UserUpdate = Partial<User>;
const patch: UserUpdate = { username: "newVivek" }; // only send what changed

// Required<T> — every field becomes mandatory (opposite of Partial)
type StrictContact = Required<Contact>; // birthDate & status are no longer optional

// Readonly<T> — every field becomes readonly at once
type FrozenProduct = Readonly<Product>;

// Pick<T, K> — keep ONLY the listed fields, discard the rest
type UserPreview = Pick<User, "username" | "email">;
const preview: UserPreview = { username: "vivek", email: "v@x.com" };

// Omit<T, K> — keep everything EXCEPT the listed fields
type PublicUser = Omit<User, "_id" | "isActive">;
const publicProfile: PublicUser = { username: "vivek", email: "v@x.com" };

console.log(patch, preview, publicProfile);

// prevent "unused type" warnings
const _strict: StrictContact = {
    _id: 1, name: "v", street: "s", city: "c", country: "us",
    birthDate: new Date(), status: ContactStatus.Active,
};
const _frozen: FrozenProduct = { sku: "x", title: "y", price: 1, inStock: true };
console.log(_strict, _frozen);


// ─────────────────────────────────────────────
// 12. RECORD<K, V>
// Creates an object type where all keys are K and all values are V.
// Cleaner than writing { [key: string]: V } for a known set of keys.
// ─────────────────────────────────────────────
type Role = "admin" | "editor" | "viewer";
type Permissions = Record<Role, string[]>;

const rolePermissions: Permissions = {
    admin: ["read", "write", "delete"],
    editor: ["read", "write"],
    viewer: ["read"],
};

console.log(rolePermissions.admin); // ["read", "write", "delete"]


// ─────────────────────────────────────────────
// 13. MAPPED TYPE
// Dynamically transforms every property in a type.
// [K in keyof T] is a for-loop over keys — it runs at the type level, not runtime.
// ─────────────────────────────────────────────
type Nullable<T> = {
    [K in keyof T]: T[K] | null; // every field can now also be null
};

type NullableUser = Nullable<User>;

const partialData: NullableUser = {
    _id: null,
    username: "vivek",
    email: null,
    isActive: null,
};

console.log(partialData);


// ─────────────────────────────────────────────
// 14. CONDITIONAL TYPE
// Resolves to a different type based on a condition — like if/else for types.
// T extends U ? X : Y  means: "if T fits into U, use X, otherwise use Y"
// ─────────────────────────────────────────────
type IsString<T> = T extends string ? "yes" : "no";

type CheckA = IsString<string>; // resolves to "yes"
type CheckB = IsString<number>; // resolves to "no"

// Practical use — unwrap the inner type of a Promise:
type Unwrap<T> = T extends Promise<infer R> ? R : T;

type ResolvedNumber = Unwrap<Promise<number>>; // number
type PassThrough = Unwrap<string>;             // string (not a Promise, returned as-is)

const _ca: CheckA = "yes";
const _cb: CheckB = "no";
const _rn: ResolvedNumber = 42;
const _pt: PassThrough = "hello";
console.log(_ca, _cb, _rn, _pt);


// ─────────────────────────────────────────────
// 15. CLASS IMPLEMENTING AN INTERFACE
// "implements" forces a class to fulfill every field and method in the interface.
// If anything is missing, TS errors at compile time — not at runtime.
// Classic OOP pattern: program to an interface, not a concrete class.
// ─────────────────────────────────────────────
interface ILogger {
    log(msg: string): void;
    error(msg: string): void;
}

class ConsoleLogger implements ILogger {
    log(msg: string): void {
        console.log(`[LOG]: ${msg}`);
    }
    error(msg: string): void {
        console.error(`[ERROR]: ${msg}`);
    }
}

const logger = new ConsoleLogger();
logger.log("App started");     // "[LOG]: App started"
logger.error("Oops, crashed"); // "[ERROR]: Oops, crashed"


// ─────────────────────────────────────────────
// INTERFACE vs TYPE — quick reference
//
//  Use INTERFACE when:
//    - Describing the shape of objects or classes
//    - You need declaration merging (extending third-party types)
//    - A class will implement it
//
//  Use TYPE when:
//    - Unions ( A | B ), intersections ( A & B )
//    - Tuples, primitives, or template literal types
//    - Mapped or conditional types
// ─────────────────────────────────────────────

export {};