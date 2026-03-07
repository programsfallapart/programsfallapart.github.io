---
title: Why Types Matter
abbrlink: e7f8a901
date: 2024-09-03T16:45:00.000Z
description: Static typing as a tool for thinking
tags:
  - rust
  - typescript
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit[^1]. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed diam eget risus varius blandit sit amet non magna.

Cras mattis consectetur purus sit amet fermentum[^2]. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur.

[^1]: This is a sidenote about static typing and its origins in the ML family of languages.
[^2]: See Hoare's 2009 paper "Null References: The Billion Dollar Mistake" for more on this topic.

## The Compiler Is Your Friend

Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Nulla vitae elit libero, a pharetra augue. Cras mattis consectetur purus sit amet fermentum.

Sed posuere consectetur est at lobortis. Vestibulum id ligula porta felis euismod semper. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return { ok: false, error: "Division by zero" };
  return { ok: true, value: a / b };
}
```

Aenean lacinia bibendum nulla sed consectetur. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Etiam porta sem malesuada magna mollis euismod.

Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam quis risus eget urna mollis ornare vel eu leo.

## Algebraic Data Types

Morbi leo risus, porta ac consectetur ac, vestibulum at eros[^3]. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

[^3]: Algebraic data types were first introduced in Hope (1980) and later refined in Standard ML and Haskell. The key insight is that types form an algebra: sum types (tagged unions) correspond to addition, product types (tuples, records) correspond to multiplication, and function types correspond to exponentiation. This algebraic structure gives us powerful reasoning tools — for instance, the number of inhabitants of a type can be computed using these operations, which helps verify exhaustiveness of pattern matching and detect dead code at compile time.

```rust
enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r) => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h) => w * h,
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}
```

Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras justo odio, dapibus ut facilisis in, egestas eget quam. Nulla vitae elit libero, a pharetra augue.

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum. Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur.

### Sum Types vs Product Types

Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec id elit non mi porta gravida at eget metus.

## Generics and Polymorphism

Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

Donec sed odio dui. Cras justo odio, dapibus ut facilisis in, egestas eget quam. Nullam quis risus eget urna mollis ornare vel eu leo. Nulla vitae elit libero, a pharetra augue.

```typescript
function pipe<A, B, C>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C
): C {
  return fn2(fn1(value));
}

const result = pipe(
  "hello",
  (s) => s.length,
  (n) => n > 3
);
// result: true
```

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.

Maecenas faucibus mollis interdum. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

## Type Narrowing

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

```typescript
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    return value.toUpperCase();
  }
  // TypeScript knows value is number here
  return value.toFixed(2);
}
```

Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget risus varius blandit sit amet non magna.

Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam id dolor id nibh ultricies vehicula ut id elit.

### Discriminated Unions

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Cras justo odio, dapibus ut facilisis in, egestas eget quam. Nulla vitae elit libero, a pharetra augue.

Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.

Maecenas faucibus mollis interdum. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.

## Phantom Types

Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.

```rust
use std::marker::PhantomData;

struct Locked;
struct Unlocked;

struct Door<State> {
    _state: PhantomData<State>,
}

impl Door<Locked> {
    fn unlock(self) -> Door<Unlocked> {
        Door { _state: PhantomData }
    }
}

impl Door<Unlocked> {
    fn lock(self) -> Door<Locked> {
        Door { _state: PhantomData }
    }

    fn open(&self) {
        println!("Door is open!");
    }
}
```

Maecenas sed diam eget risus varius blandit sit amet non magna. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

## Conclusion

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Cras justo odio, dapibus ut facilisis in, egestas eget quam. Nullam quis risus eget urna mollis ornare vel eu leo.

Nulla vitae elit libero, a pharetra augue. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.

Maecenas faucibus mollis interdum. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis.
