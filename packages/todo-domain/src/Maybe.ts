export type Maybe<T> =
  | { tag: "some"; value: T }
  | { tag: "none" };

export const Some = <T>(value: T): Maybe<T> => ({ tag: "some", value });
export const None: Maybe<never> = { tag: "none" };

export const map = <T, U>(m: Maybe<T>, f: (x: T) => U): Maybe<U> =>
  m.tag === "none" ? None : Some(f(m.value));

export const flatMap = <T, U>(m: Maybe<T>, f: (x: T) => Maybe<U>): Maybe<U> =>
  m.tag === "none" ? None : f(m.value);

export const getOrElse = <T>(m: Maybe<T>, fallback: T): T =>
  m.tag === "none" ? fallback : m.value;

export const match = <T, R>(
  m: Maybe<T>,
  cases: { some: (x: T) => R; none: () => R }
): R => (m.tag === "none" ? cases.none() : cases.some(m.value));
