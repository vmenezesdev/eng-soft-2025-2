import { validateTitle } from "./taskRules.js";
import type { Task } from "./Task.ts";

export {
    validateTitle
}

export default {
    validateTitle
}

export type {
    Task,
}

// minimal.ts

// ---------- Maybe ----------
export type Maybe<T> =
  | { tag: "some"; value: T }
  | { tag: "none" };

export const Some = <T>(value: T): Maybe<T> => ({ tag: "some", value });
export const None: Maybe<never> = { tag: "none" };

export const mapMaybe = <T, U>(m: Maybe<T>, f: (x: T) => U): Maybe<U> =>
  m.tag === "some" ? Some(f(m.value)) : None;

export const andThenMaybe = <T, U>(m: Maybe<T>, f: (x: T) => Maybe<U>): Maybe<U> =>
  m.tag === "some" ? f(m.value) : None;

export const unwrapOrMaybe = <T>(m: Maybe<T>, fallback: T): T =>
  m.tag === "some" ? m.value : fallback;

export const matchMaybe = <T, R>(
  m: Maybe<T>,
  cases: { some: (v: T) => R; none: () => R }
): R => (m.tag === "some" ? cases.some(m.value) : cases.none());

// ---------- Result ----------
export type Result<T, E> =
  | { tag: "ok"; value: T }
  | { tag: "err"; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ tag: "ok", value });
export const Err = <E>(error: E): Result<never, E> => ({ tag: "err", error });

export const mapResult = <T, E, U>(r: Result<T, E>, f: (x: T) => U): Result<U, E> =>
  r.tag === "ok" ? Ok(f(r.value)) : r;

export const andThenResult = <T, E, U>(
  r: Result<T, E>,
  f: (x: T) => Result<U, E>
): Result<U, E> => (r.tag === "ok" ? f(r.value) : r);

export const mapErrResult = <T, E, F>(
  r: Result<T, E>,
  f: (e: E) => F
): Result<T, F> => (r.tag === "err" ? Err(f(r.error)) : r);

export const unwrapOrResult = <T, E>(r: Result<T, E>, fallback: T): T =>
  r.tag === "ok" ? r.value : fallback;

export const matchResult = <T, E, R>(
  r: Result<T, E>,
  cases: { ok: (v: T) => R; err: (e: E) => R }
): R => (r.tag === "ok" ? cases.ok(r.value) : cases.err(r.error));

// ---------- Bridges (bem úteis e ainda minimalistas) ----------
export const fromNullable = <T>(v: T | null | undefined): Maybe<T> =>
  v == null ? None : Some(v);

export const toResult = <T, E>(m: Maybe<T>, onNone: () => E): Result<T, E> =>
  m.tag === "some" ? Ok(m.value) : Err(onNone());

export const okToMaybe = <T, E>(r: Result<T, E>): Maybe<T> =>
  r.tag === "ok" ? Some(r.value) : None;

export const tryCatch = <T, E>(
  fn: () => T,
  onThrow: (e: unknown) => E
): Result<T, E> => {
  try {
    return Ok(fn());
  } catch (e) {
    return Err(onThrow(e));
  }
};
