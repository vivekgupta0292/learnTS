// ─────────────────────────────────────────────
// TUPLES in TypeScript
//
// A tuple is an array with a FIXED number of elements where each position
// has a specific, known type. Unlike a regular array where every element
// is the same type, a tuple says: "position 0 is always string,
// position 1 is always number" — and that order is enforced by TS.
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// 1. BASIC TUPLE
// Declare the type of each slot by position.
// TS will error if you swap types or add extra elements.
// ─────────────────────────────────────────────
const point: [number, number] = [10, 20];   // x, y coordinates
console.log(point); // [10, 20]

const person: [string, number] = ["Vivek", 25]; // name, age
// const wrong: [string, number] = [25, "Vivek"]; // ERROR — types are in wrong positions

console.log(person[0]); // "Vivek"
console.log(person[1]); // 25


// ─────────────────────────────────────────────
// 2. NAMED TUPLE ELEMENTS
// You can label each position for readability — the labels are just for docs,
// they don't change runtime behavior, but they show up in editor tooltips.
// ─────────────────────────────────────────────
type RGB = [red: number, green: number, blue: number];

const red: RGB    = [255, 0, 0];
const teal: RGB   = [0, 128, 128];

console.log(red);  // [255, 0, 0]
console.log(teal); // [0, 128, 128]


// ─────────────────────────────────────────────
// 3. OPTIONAL TUPLE ELEMENTS  ( ? )
// A position can be marked optional — it may or may not be present.
// Optional elements must come LAST (same rule as optional function params).
// ─────────────────────────────────────────────
type Coordinate = [lat: number, lng: number, altitude?: number];

const cityLocation: Coordinate  = [28.6, 77.2];          // no altitude — fine
const flightLocation: Coordinate = [28.6, 77.2, 10000];  // with altitude

console.log(cityLocation);   // [28.6, 77.2]
console.log(flightLocation); // [28.6, 77.2, 10000]


// ─────────────────────────────────────────────
// 4. READONLY TUPLE
// Prevents any mutation after creation — no push, pop, or index reassignment.
// Great for config values or data that must stay constant.
// ─────────────────────────────────────────────
const config: readonly [string, number, boolean] = ["localhost", 3000, true];

// config[0] = "prod";  // ERROR — cannot assign to readonly tuple
// config.push(42);     // ERROR — push does not exist on readonly tuple

console.log(config[0], config[1]); // "localhost" 3000


// ─────────────────────────────────────────────
// 5. DESTRUCTURING A TUPLE
// The most common way to use tuples — unpack each position into named variables.
// This is exactly how React's useState works under the hood.
// ─────────────────────────────────────────────
const [name, age] = ["Vivek", 25];
console.log(name, age); // "Vivek" 25

// Skipping a position with a blank comma:
const [x, , z] = [10, 20, 30]; // skip the middle value
console.log(x, z); // 10 30


// ─────────────────────────────────────────────
// 6. RETURNING A TUPLE FROM A FUNCTION
// Functions can return multiple values cleanly using a tuple.
// The caller destructures the result into named variables.
// This is more type-safe than returning a plain array because
// TS knows position 0 is always string and position 1 is always number.
// ─────────────────────────────────────────────
function getMinMax(nums: number[]): [min: number, max: number] {
    return [Math.min(...nums), Math.max(...nums)];
}

const [min, max] = getMinMax([3, 1, 8, 2, 7]);
console.log(min, max); // 1 8


// ─────────────────────────────────────────────
// 7. REAL WORLD — useState pattern (like React)
// React's useState returns a tuple: [currentValue, setterFunction].
// The caller names them whatever they want via destructuring.
// ─────────────────────────────────────────────
function useState<T>(initial: T): [T, (newVal: T) => void] {
    let value = initial;
    const setValue = (newVal: T) => {
        value = newVal;
        console.log(`state updated to: ${newVal}`);
    };
    return [value, setValue]; // returns a typed tuple
}

const [count, setCount] = useState(0);
console.log(count);   // 0
setCount(5);          // "state updated to: 5"

const [username, setUsername] = useState("vivek");
console.log(username); // "vivek"
setUsername("admin");  // "state updated to: admin"


// ─────────────────────────────────────────────
// 8. REAL WORLD — API response with status code
// When a function can succeed or fail, return a tuple of [error, data]
// instead of throwing. The caller always handles both cases explicitly.
// ─────────────────────────────────────────────
type ApiResult<T> = [error: string | null, data: T | null];

function fetchUser(id: number): ApiResult<{ name: string }> {
    if (id <= 0) return ["Invalid ID", null];
    return [null, { name: "Vivek" }];
}

const [err, data] = fetchUser(1);
if (err) {
    console.log("Error:", err);
} else {
    console.log("User:", data?.name); // "User: Vivek"
}

const [err2] = fetchUser(-1);
console.log("Error:", err2); // "Error: Invalid ID"


// ─────────────────────────────────────────────
// 9. VARIADIC TUPLE  ( ...T )
// A tuple can have a "rest" spread that captures a variable number of elements.
// Lets you build flexible, composable tuple types.
// ─────────────────────────────────────────────
type WithId<T extends unknown[]> = [id: number, ...rest: T];

type UserRow = WithId<[name: string, email: string]>;
// resolves to: [id: number, name: string, email: string]

const row: UserRow = [1, "Vivek", "vivek@example.com"];
console.log(row); // [1, "Vivek", "vivek@example.com"]


// ─────────────────────────────────────────────
// 10. TUPLE vs ARRAY — when to use which
//
//  Use TUPLE when:
//    - The number of elements is fixed and each position has a different type
//    - Returning multiple values from a function (instead of an object)
//    - Destructuring into named variables at the call site
//    - Modeling rows with a known schema (CSV rows, DB records)
//
//  Use ARRAY when:
//    - All elements are the same type
//    - The length is dynamic (you push/pop)
//    - You need array methods like .map(), .filter(), .reduce()
//
//  TUPLE                          ARRAY
//  [string, number, boolean]      string[]
//  fixed length, mixed types      any length, one type
//  position has meaning           order doesn't matter
// ─────────────────────────────────────────────

export {};
