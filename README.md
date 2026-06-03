# learnTS

A progressive, self-contained TypeScript learning repo. Each file in `src/` covers one topic from the ground up — with inline explanations, runnable examples, and real-world patterns alongside every concept.

## Who this is for

Anyone who already knows JavaScript and wants to learn TypeScript properly — not just "add types and hope for the best", but understand *why* each feature exists and *when* to reach for it.

## Project structure

```
src/
  basicTypes.ts         → primitive types, type inference, any, object
  tuples.ts             → fixed-length typed arrays, destructuring, real-world patterns
  functions.ts          → typed params, optional/default/rest, overloads, generics, void/never
  interfacesAndtypes.ts → interfaces, type aliases, unions, intersections, utility types
  classes.ts            → access modifiers, getters/setters, static, inheritance, abstract, generics
  generics.ts           → generics deep-dive: functions, classes, constraints, keyof, conditional types
```

---

## Modules

### 1. Basic Types — `src/basicTypes.ts`

The entry point. Covers the primitives TypeScript adds on top of JavaScript:

- Explicit type annotations (`let x: number`)
- Type inference (TS figures out the type from the value)
- `string`, `number`, `boolean`, `object`, `any`
- Why `any` defeats the purpose of TypeScript

---

### 2. Tuples — `src/tuples.ts`

Tuples are arrays where each position has a specific, fixed type. Unlike `string[]` (any length, one type), a tuple locks both length and the type at every index.

Topics covered:

| Concept | Example |
|---|---|
| Basic tuple | `const point: [number, number] = [10, 20]` |
| Named elements | `type RGB = [red: number, green: number, blue: number]` |
| Optional element | `type Coord = [lat: number, lng: number, altitude?: number]` |
| Readonly tuple | `const config: readonly [string, number, boolean]` |
| Destructuring | `const [name, age] = ["Vivek", 25]` |
| Returning from a function | `function getMinMax(nums: number[]): [min: number, max: number]` |
| `useState` pattern | tuple return mirrors how React's `useState` works |
| API result pattern | `type ApiResult<T> = [error: string \| null, data: T \| null]` |
| Variadic tuple | `type WithId<T extends unknown[]> = [id: number, ...rest: T]` |

---

### 3. Functions — `src/functions.ts`

How TypeScript makes functions type-safe. Covers every function variation you'll encounter in real code:

| Concept | What it does |
|---|---|
| Typed parameters + return | `function sum(a: number, b: number): number` |
| Optional parameter `?` | param might be `undefined` — TS forces you to handle both |
| Default parameter | param has a fallback value, no `undefined` handling needed |
| Rest parameters | `...numbers: number[]` — variable argument count |
| Function overloads | declare multiple valid call signatures for one function |
| Generic function | `<T>` placeholder — one function, any type, still safe |
| `void` | function runs for side effects, no return value expected |
| `never` | function never returns (always throws or infinite loops) |
| Type guard | `value is string` — narrows an `unknown` type at runtime |
| Function as a type | pass functions as arguments with a precise type signature |

---

### 4. Interfaces & Types — `src/interfacesAndtypes.ts`

The backbone of TypeScript's type system. Teaches you to model data and understand the difference between `interface` and `type`.

| Concept | Key point |
|---|---|
| `interface` + `extends` | describe object shape; inherit fields from another interface |
| `readonly` property | set once at creation, immutable after |
| Index signature | `[key: string]: string` — dynamic keys with typed values |
| Interface with methods | objects that must implement specific behavior |
| Declaration merging | same interface name declared twice → TS merges them (unique to `interface`) |
| `type` alias — union | `type ID = string \| number` |
| `type` alias — object | same as interface but cannot be merged |
| Union type `\|` | value is one of several types; TS narrows inside if/switch |
| Intersection type `&` | value must satisfy *all* types simultaneously |
| Discriminated union | shared `kind` field lets TS narrow the exact variant |
| Utility types | `Partial`, `Required`, `Readonly`, `Pick`, `Omit` |
| `Record<K, V>` | typed dictionary with a known set of keys |
| Mapped type | transform every property in a type at the type level |
| Conditional type | `T extends U ? X : Y` — if/else for types |
| Class implementing interface | `implements` enforces the contract at compile time |

---

### 5. Classes — `src/classes.ts`

TypeScript's object-oriented layer. Shows how classes build on JavaScript with strict compile-time checks.

| Concept | Key point |
|---|---|
| Access modifiers | `public`, `private`, `protected`, `readonly` |
| Shorthand constructor | declare + assign fields directly in constructor params |
| Getters & setters | computed properties with hidden validation logic |
| Static members | belong to the class itself, not instances |
| Inheritance (`extends`) | subclass inherits and can override parent methods |
| `implements` interface | class must fulfill every field and method in the interface |
| Abstract class | template class — defines shared logic + forces subclasses to fill in the gaps |
| Generic class | `Stack<T>` — one class, any element type, fully type-safe |
| Singleton pattern | private constructor + `getInstance()` — only one instance ever exists |
| Class as a type | a class declaration doubles as a type annotation |

---

### 6. Generics — `src/generics.ts`

The deep-dive. Generics are how you write reusable code without sacrificing type safety. This module builds from the simplest case to the patterns used in production libraries.

| Concept | Example |
|---|---|
| Why generics (vs `any`) | `any` loses type info; generics preserve it |
| Basic generic function | `function identity<T>(value: T): T` |
| Type inference | TS infers `T` from the argument — you rarely need to write `<number>` |
| Generic array functions | `first<T>`, `last<T>`, `reverse<T>` |
| Multiple type parameters | `pair<K, V>`, `swap<A, B>` |
| Generic interface | `Box<T>`, `ApiResponse<T>` |
| Generic type alias | `Nullable<T>`, `Maybe<T>`, `Pair<A, B>` |
| Generic class | `Stack<T>`, `Queue<T>` |
| Constraints (`extends`) | `T extends { length: number }` — T must have certain shape |
| `keyof` + `T[K]` | safe property access by dynamic key |
| Default type parameter | `<T = string>` — T falls back to string if not provided |
| Conditional type | `Flatten<T>`, `NonNullable<T>` |
| Built-in utility types | `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters` |
| Generic fetch wrapper | `fetchData<T>(url)` — typed HTTP response |
| Generic event emitter | `emit<K extends keyof EventMap>` — payload type locked to event |

---

## Getting started

```bash
npm install
npx ts-node src/basicTypes.ts   # run any file directly
```

Or open any file in VS Code — TypeScript errors show inline without compiling.

---

## Learning path

Follow the modules in order — each one builds on the previous:

```
basicTypes → tuples → functions → interfacesAndtypes → classes → generics
```

Each file is self-contained and runnable. The comments in each file explain the *why*, not just the *what*.
