
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Kidoo
 * 
 */
export type Kidoo = $Result.DefaultSelection<Prisma.$KidooPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model KidooConfigBasic
 * 
 */
export type KidooConfigBasic = $Result.DefaultSelection<Prisma.$KidooConfigBasicPayload>
/**
 * Model KidooConfigDream
 * 
 */
export type KidooConfigDream = $Result.DefaultSelection<Prisma.$KidooConfigDreamPayload>
/**
 * Model KidooConfigDreamBedtimeSchedule
 * 
 */
export type KidooConfigDreamBedtimeSchedule = $Result.DefaultSelection<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
/**
 * Model KidooConfigDreamWakeupSchedule
 * 
 */
export type KidooConfigDreamWakeupSchedule = $Result.DefaultSelection<Prisma.$KidooConfigDreamWakeupSchedulePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TagType: {
  MUSIC: 'MUSIC',
  STORY: 'STORY',
  SOUND: 'SOUND'
};

export type TagType = (typeof TagType)[keyof typeof TagType]

}

export type TagType = $Enums.TagType

export const TagType: typeof $Enums.TagType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kidoo`: Exposes CRUD operations for the **Kidoo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Kidoos
    * const kidoos = await prisma.kidoo.findMany()
    * ```
    */
  get kidoo(): Prisma.KidooDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kidooConfigBasic`: Exposes CRUD operations for the **KidooConfigBasic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KidooConfigBasics
    * const kidooConfigBasics = await prisma.kidooConfigBasic.findMany()
    * ```
    */
  get kidooConfigBasic(): Prisma.KidooConfigBasicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kidooConfigDream`: Exposes CRUD operations for the **KidooConfigDream** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KidooConfigDreams
    * const kidooConfigDreams = await prisma.kidooConfigDream.findMany()
    * ```
    */
  get kidooConfigDream(): Prisma.KidooConfigDreamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kidooConfigDreamBedtimeSchedule`: Exposes CRUD operations for the **KidooConfigDreamBedtimeSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KidooConfigDreamBedtimeSchedules
    * const kidooConfigDreamBedtimeSchedules = await prisma.kidooConfigDreamBedtimeSchedule.findMany()
    * ```
    */
  get kidooConfigDreamBedtimeSchedule(): Prisma.KidooConfigDreamBedtimeScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kidooConfigDreamWakeupSchedule`: Exposes CRUD operations for the **KidooConfigDreamWakeupSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KidooConfigDreamWakeupSchedules
    * const kidooConfigDreamWakeupSchedules = await prisma.kidooConfigDreamWakeupSchedule.findMany()
    * ```
    */
  get kidooConfigDreamWakeupSchedule(): Prisma.KidooConfigDreamWakeupScheduleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Kidoo: 'Kidoo',
    Tag: 'Tag',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    File: 'File',
    KidooConfigBasic: 'KidooConfigBasic',
    KidooConfigDream: 'KidooConfigDream',
    KidooConfigDreamBedtimeSchedule: 'KidooConfigDreamBedtimeSchedule',
    KidooConfigDreamWakeupSchedule: 'KidooConfigDreamWakeupSchedule'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "kidoo" | "tag" | "account" | "session" | "verificationToken" | "file" | "kidooConfigBasic" | "kidooConfigDream" | "kidooConfigDreamBedtimeSchedule" | "kidooConfigDreamWakeupSchedule"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Kidoo: {
        payload: Prisma.$KidooPayload<ExtArgs>
        fields: Prisma.KidooFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KidooFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KidooFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          findFirst: {
            args: Prisma.KidooFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KidooFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          findMany: {
            args: Prisma.KidooFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>[]
          }
          create: {
            args: Prisma.KidooCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          createMany: {
            args: Prisma.KidooCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KidooCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>[]
          }
          delete: {
            args: Prisma.KidooDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          update: {
            args: Prisma.KidooUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          deleteMany: {
            args: Prisma.KidooDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KidooUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KidooUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>[]
          }
          upsert: {
            args: Prisma.KidooUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooPayload>
          }
          aggregate: {
            args: Prisma.KidooAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKidoo>
          }
          groupBy: {
            args: Prisma.KidooGroupByArgs<ExtArgs>
            result: $Utils.Optional<KidooGroupByOutputType>[]
          }
          count: {
            args: Prisma.KidooCountArgs<ExtArgs>
            result: $Utils.Optional<KidooCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      KidooConfigBasic: {
        payload: Prisma.$KidooConfigBasicPayload<ExtArgs>
        fields: Prisma.KidooConfigBasicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KidooConfigBasicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KidooConfigBasicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          findFirst: {
            args: Prisma.KidooConfigBasicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KidooConfigBasicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          findMany: {
            args: Prisma.KidooConfigBasicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>[]
          }
          create: {
            args: Prisma.KidooConfigBasicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          createMany: {
            args: Prisma.KidooConfigBasicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KidooConfigBasicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>[]
          }
          delete: {
            args: Prisma.KidooConfigBasicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          update: {
            args: Prisma.KidooConfigBasicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          deleteMany: {
            args: Prisma.KidooConfigBasicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KidooConfigBasicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KidooConfigBasicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>[]
          }
          upsert: {
            args: Prisma.KidooConfigBasicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigBasicPayload>
          }
          aggregate: {
            args: Prisma.KidooConfigBasicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKidooConfigBasic>
          }
          groupBy: {
            args: Prisma.KidooConfigBasicGroupByArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigBasicGroupByOutputType>[]
          }
          count: {
            args: Prisma.KidooConfigBasicCountArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigBasicCountAggregateOutputType> | number
          }
        }
      }
      KidooConfigDream: {
        payload: Prisma.$KidooConfigDreamPayload<ExtArgs>
        fields: Prisma.KidooConfigDreamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KidooConfigDreamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KidooConfigDreamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          findFirst: {
            args: Prisma.KidooConfigDreamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KidooConfigDreamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          findMany: {
            args: Prisma.KidooConfigDreamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>[]
          }
          create: {
            args: Prisma.KidooConfigDreamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          createMany: {
            args: Prisma.KidooConfigDreamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KidooConfigDreamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>[]
          }
          delete: {
            args: Prisma.KidooConfigDreamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          update: {
            args: Prisma.KidooConfigDreamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          deleteMany: {
            args: Prisma.KidooConfigDreamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KidooConfigDreamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KidooConfigDreamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>[]
          }
          upsert: {
            args: Prisma.KidooConfigDreamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamPayload>
          }
          aggregate: {
            args: Prisma.KidooConfigDreamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKidooConfigDream>
          }
          groupBy: {
            args: Prisma.KidooConfigDreamGroupByArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamGroupByOutputType>[]
          }
          count: {
            args: Prisma.KidooConfigDreamCountArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamCountAggregateOutputType> | number
          }
        }
      }
      KidooConfigDreamBedtimeSchedule: {
        payload: Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>
        fields: Prisma.KidooConfigDreamBedtimeScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KidooConfigDreamBedtimeScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KidooConfigDreamBedtimeScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          findFirst: {
            args: Prisma.KidooConfigDreamBedtimeScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KidooConfigDreamBedtimeScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          findMany: {
            args: Prisma.KidooConfigDreamBedtimeScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>[]
          }
          create: {
            args: Prisma.KidooConfigDreamBedtimeScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          createMany: {
            args: Prisma.KidooConfigDreamBedtimeScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KidooConfigDreamBedtimeScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>[]
          }
          delete: {
            args: Prisma.KidooConfigDreamBedtimeScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          update: {
            args: Prisma.KidooConfigDreamBedtimeScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          deleteMany: {
            args: Prisma.KidooConfigDreamBedtimeScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KidooConfigDreamBedtimeScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KidooConfigDreamBedtimeScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>[]
          }
          upsert: {
            args: Prisma.KidooConfigDreamBedtimeScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload>
          }
          aggregate: {
            args: Prisma.KidooConfigDreamBedtimeScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKidooConfigDreamBedtimeSchedule>
          }
          groupBy: {
            args: Prisma.KidooConfigDreamBedtimeScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamBedtimeScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.KidooConfigDreamBedtimeScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamBedtimeScheduleCountAggregateOutputType> | number
          }
        }
      }
      KidooConfigDreamWakeupSchedule: {
        payload: Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>
        fields: Prisma.KidooConfigDreamWakeupScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KidooConfigDreamWakeupScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KidooConfigDreamWakeupScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          findFirst: {
            args: Prisma.KidooConfigDreamWakeupScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KidooConfigDreamWakeupScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          findMany: {
            args: Prisma.KidooConfigDreamWakeupScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>[]
          }
          create: {
            args: Prisma.KidooConfigDreamWakeupScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          createMany: {
            args: Prisma.KidooConfigDreamWakeupScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KidooConfigDreamWakeupScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>[]
          }
          delete: {
            args: Prisma.KidooConfigDreamWakeupScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          update: {
            args: Prisma.KidooConfigDreamWakeupScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          deleteMany: {
            args: Prisma.KidooConfigDreamWakeupScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KidooConfigDreamWakeupScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KidooConfigDreamWakeupScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>[]
          }
          upsert: {
            args: Prisma.KidooConfigDreamWakeupScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KidooConfigDreamWakeupSchedulePayload>
          }
          aggregate: {
            args: Prisma.KidooConfigDreamWakeupScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKidooConfigDreamWakeupSchedule>
          }
          groupBy: {
            args: Prisma.KidooConfigDreamWakeupScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamWakeupScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.KidooConfigDreamWakeupScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<KidooConfigDreamWakeupScheduleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    kidoo?: KidooOmit
    tag?: TagOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    file?: FileOmit
    kidooConfigBasic?: KidooConfigBasicOmit
    kidooConfigDream?: KidooConfigDreamOmit
    kidooConfigDreamBedtimeSchedule?: KidooConfigDreamBedtimeScheduleOmit
    kidooConfigDreamWakeupSchedule?: KidooConfigDreamWakeupScheduleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    kidoos: number
    tags: number
    files: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    kidoos?: boolean | UserCountOutputTypeCountKidoosArgs
    tags?: boolean | UserCountOutputTypeCountTagsArgs
    files?: boolean | UserCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountKidoosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }


  /**
   * Count Type KidooCountOutputType
   */

  export type KidooCountOutputType = {
    tags: number
  }

  export type KidooCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tags?: boolean | KidooCountOutputTypeCountTagsArgs
  }

  // Custom InputTypes
  /**
   * KidooCountOutputType without action
   */
  export type KidooCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooCountOutputType
     */
    select?: KidooCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KidooCountOutputType without action
   */
  export type KidooCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    multimediaFiles: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    multimediaFiles?: boolean | TagCountOutputTypeCountMultimediaFilesArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountMultimediaFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }


  /**
   * Count Type KidooConfigDreamCountOutputType
   */

  export type KidooConfigDreamCountOutputType = {
    bedtimeSchedules: number
    wakeupSchedules: number
  }

  export type KidooConfigDreamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bedtimeSchedules?: boolean | KidooConfigDreamCountOutputTypeCountBedtimeSchedulesArgs
    wakeupSchedules?: boolean | KidooConfigDreamCountOutputTypeCountWakeupSchedulesArgs
  }

  // Custom InputTypes
  /**
   * KidooConfigDreamCountOutputType without action
   */
  export type KidooConfigDreamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamCountOutputType
     */
    select?: KidooConfigDreamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KidooConfigDreamCountOutputType without action
   */
  export type KidooConfigDreamCountOutputTypeCountBedtimeSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigDreamBedtimeScheduleWhereInput
  }

  /**
   * KidooConfigDreamCountOutputType without action
   */
  export type KidooConfigDreamCountOutputTypeCountWakeupSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigDreamWakeupScheduleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: Date | null
    name: string | null
    avatar: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    emailVerified: Date | null
    name: string | null
    avatar: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    emailVerified: number
    name: number
    avatar: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    avatar?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    avatar?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    emailVerified?: true
    name?: true
    avatar?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    emailVerified: Date | null
    name: string | null
    avatar: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    avatar?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    kidoos?: boolean | User$kidoosArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    files?: boolean | User$filesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    avatar?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    avatar?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    emailVerified?: boolean
    name?: boolean
    avatar?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "emailVerified" | "name" | "avatar" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    kidoos?: boolean | User$kidoosArgs<ExtArgs>
    tags?: boolean | User$tagsArgs<ExtArgs>
    files?: boolean | User$filesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      kidoos: Prisma.$KidooPayload<ExtArgs>[]
      tags: Prisma.$TagPayload<ExtArgs>[]
      files: Prisma.$FilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      emailVerified: Date | null
      name: string | null
      avatar: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kidoos<T extends User$kidoosArgs<ExtArgs> = {}>(args?: Subset<T, User$kidoosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tags<T extends User$tagsArgs<ExtArgs> = {}>(args?: Subset<T, User$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    files<T extends User$filesArgs<ExtArgs> = {}>(args?: Subset<T, User$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.kidoos
   */
  export type User$kidoosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    where?: KidooWhereInput
    orderBy?: KidooOrderByWithRelationInput | KidooOrderByWithRelationInput[]
    cursor?: KidooWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KidooScalarFieldEnum | KidooScalarFieldEnum[]
  }

  /**
   * User.tags
   */
  export type User$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    cursor?: TagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * User.files
   */
  export type User$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Kidoo
   */

  export type AggregateKidoo = {
    _count: KidooCountAggregateOutputType | null
    _avg: KidooAvgAggregateOutputType | null
    _sum: KidooSumAggregateOutputType | null
    _min: KidooMinAggregateOutputType | null
    _max: KidooMaxAggregateOutputType | null
  }

  export type KidooAvgAggregateOutputType = {
    brightness: number | null
    sleepTimeout: number | null
    sleepColorR: number | null
    sleepColorG: number | null
    sleepColorB: number | null
    sleepEffect: number | null
  }

  export type KidooSumAggregateOutputType = {
    brightness: number | null
    sleepTimeout: number | null
    sleepColorR: number | null
    sleepColorG: number | null
    sleepColorB: number | null
    sleepEffect: number | null
  }

  export type KidooMinAggregateOutputType = {
    id: string | null
    name: string | null
    model: string | null
    macAddress: string | null
    bluetoothMacAddress: string | null
    deviceId: string | null
    firmwareVersion: string | null
    lastConnected: Date | null
    isConnected: boolean | null
    wifiSSID: string | null
    userId: string | null
    isSynced: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    brightness: number | null
    sleepTimeout: number | null
    sleepColorR: number | null
    sleepColorG: number | null
    sleepColorB: number | null
    sleepEffect: number | null
  }

  export type KidooMaxAggregateOutputType = {
    id: string | null
    name: string | null
    model: string | null
    macAddress: string | null
    bluetoothMacAddress: string | null
    deviceId: string | null
    firmwareVersion: string | null
    lastConnected: Date | null
    isConnected: boolean | null
    wifiSSID: string | null
    userId: string | null
    isSynced: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    brightness: number | null
    sleepTimeout: number | null
    sleepColorR: number | null
    sleepColorG: number | null
    sleepColorB: number | null
    sleepEffect: number | null
  }

  export type KidooCountAggregateOutputType = {
    id: number
    name: number
    model: number
    macAddress: number
    bluetoothMacAddress: number
    deviceId: number
    firmwareVersion: number
    lastConnected: number
    isConnected: number
    wifiSSID: number
    userId: number
    isSynced: number
    createdAt: number
    updatedAt: number
    brightness: number
    sleepTimeout: number
    sleepColorR: number
    sleepColorG: number
    sleepColorB: number
    sleepEffect: number
    _all: number
  }


  export type KidooAvgAggregateInputType = {
    brightness?: true
    sleepTimeout?: true
    sleepColorR?: true
    sleepColorG?: true
    sleepColorB?: true
    sleepEffect?: true
  }

  export type KidooSumAggregateInputType = {
    brightness?: true
    sleepTimeout?: true
    sleepColorR?: true
    sleepColorG?: true
    sleepColorB?: true
    sleepEffect?: true
  }

  export type KidooMinAggregateInputType = {
    id?: true
    name?: true
    model?: true
    macAddress?: true
    bluetoothMacAddress?: true
    deviceId?: true
    firmwareVersion?: true
    lastConnected?: true
    isConnected?: true
    wifiSSID?: true
    userId?: true
    isSynced?: true
    createdAt?: true
    updatedAt?: true
    brightness?: true
    sleepTimeout?: true
    sleepColorR?: true
    sleepColorG?: true
    sleepColorB?: true
    sleepEffect?: true
  }

  export type KidooMaxAggregateInputType = {
    id?: true
    name?: true
    model?: true
    macAddress?: true
    bluetoothMacAddress?: true
    deviceId?: true
    firmwareVersion?: true
    lastConnected?: true
    isConnected?: true
    wifiSSID?: true
    userId?: true
    isSynced?: true
    createdAt?: true
    updatedAt?: true
    brightness?: true
    sleepTimeout?: true
    sleepColorR?: true
    sleepColorG?: true
    sleepColorB?: true
    sleepEffect?: true
  }

  export type KidooCountAggregateInputType = {
    id?: true
    name?: true
    model?: true
    macAddress?: true
    bluetoothMacAddress?: true
    deviceId?: true
    firmwareVersion?: true
    lastConnected?: true
    isConnected?: true
    wifiSSID?: true
    userId?: true
    isSynced?: true
    createdAt?: true
    updatedAt?: true
    brightness?: true
    sleepTimeout?: true
    sleepColorR?: true
    sleepColorG?: true
    sleepColorB?: true
    sleepEffect?: true
    _all?: true
  }

  export type KidooAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kidoo to aggregate.
     */
    where?: KidooWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kidoos to fetch.
     */
    orderBy?: KidooOrderByWithRelationInput | KidooOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KidooWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kidoos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kidoos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Kidoos
    **/
    _count?: true | KidooCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KidooAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KidooSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KidooMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KidooMaxAggregateInputType
  }

  export type GetKidooAggregateType<T extends KidooAggregateArgs> = {
        [P in keyof T & keyof AggregateKidoo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKidoo[P]>
      : GetScalarType<T[P], AggregateKidoo[P]>
  }




  export type KidooGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooWhereInput
    orderBy?: KidooOrderByWithAggregationInput | KidooOrderByWithAggregationInput[]
    by: KidooScalarFieldEnum[] | KidooScalarFieldEnum
    having?: KidooScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KidooCountAggregateInputType | true
    _avg?: KidooAvgAggregateInputType
    _sum?: KidooSumAggregateInputType
    _min?: KidooMinAggregateInputType
    _max?: KidooMaxAggregateInputType
  }

  export type KidooGroupByOutputType = {
    id: string
    name: string
    model: string
    macAddress: string | null
    bluetoothMacAddress: string | null
    deviceId: string
    firmwareVersion: string | null
    lastConnected: Date | null
    isConnected: boolean
    wifiSSID: string | null
    userId: string | null
    isSynced: boolean
    createdAt: Date
    updatedAt: Date
    brightness: number
    sleepTimeout: number
    sleepColorR: number | null
    sleepColorG: number | null
    sleepColorB: number | null
    sleepEffect: number | null
    _count: KidooCountAggregateOutputType | null
    _avg: KidooAvgAggregateOutputType | null
    _sum: KidooSumAggregateOutputType | null
    _min: KidooMinAggregateOutputType | null
    _max: KidooMaxAggregateOutputType | null
  }

  type GetKidooGroupByPayload<T extends KidooGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KidooGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KidooGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KidooGroupByOutputType[P]>
            : GetScalarType<T[P], KidooGroupByOutputType[P]>
        }
      >
    >


  export type KidooSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    model?: boolean
    macAddress?: boolean
    bluetoothMacAddress?: boolean
    deviceId?: boolean
    firmwareVersion?: boolean
    lastConnected?: boolean
    isConnected?: boolean
    wifiSSID?: boolean
    userId?: boolean
    isSynced?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brightness?: boolean
    sleepTimeout?: boolean
    sleepColorR?: boolean
    sleepColorG?: boolean
    sleepColorB?: boolean
    sleepEffect?: boolean
    user?: boolean | Kidoo$userArgs<ExtArgs>
    tags?: boolean | Kidoo$tagsArgs<ExtArgs>
    configBasic?: boolean | Kidoo$configBasicArgs<ExtArgs>
    configDream?: boolean | Kidoo$configDreamArgs<ExtArgs>
    _count?: boolean | KidooCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidoo"]>

  export type KidooSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    model?: boolean
    macAddress?: boolean
    bluetoothMacAddress?: boolean
    deviceId?: boolean
    firmwareVersion?: boolean
    lastConnected?: boolean
    isConnected?: boolean
    wifiSSID?: boolean
    userId?: boolean
    isSynced?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brightness?: boolean
    sleepTimeout?: boolean
    sleepColorR?: boolean
    sleepColorG?: boolean
    sleepColorB?: boolean
    sleepEffect?: boolean
    user?: boolean | Kidoo$userArgs<ExtArgs>
  }, ExtArgs["result"]["kidoo"]>

  export type KidooSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    model?: boolean
    macAddress?: boolean
    bluetoothMacAddress?: boolean
    deviceId?: boolean
    firmwareVersion?: boolean
    lastConnected?: boolean
    isConnected?: boolean
    wifiSSID?: boolean
    userId?: boolean
    isSynced?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brightness?: boolean
    sleepTimeout?: boolean
    sleepColorR?: boolean
    sleepColorG?: boolean
    sleepColorB?: boolean
    sleepEffect?: boolean
    user?: boolean | Kidoo$userArgs<ExtArgs>
  }, ExtArgs["result"]["kidoo"]>

  export type KidooSelectScalar = {
    id?: boolean
    name?: boolean
    model?: boolean
    macAddress?: boolean
    bluetoothMacAddress?: boolean
    deviceId?: boolean
    firmwareVersion?: boolean
    lastConnected?: boolean
    isConnected?: boolean
    wifiSSID?: boolean
    userId?: boolean
    isSynced?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    brightness?: boolean
    sleepTimeout?: boolean
    sleepColorR?: boolean
    sleepColorG?: boolean
    sleepColorB?: boolean
    sleepEffect?: boolean
  }

  export type KidooOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "model" | "macAddress" | "bluetoothMacAddress" | "deviceId" | "firmwareVersion" | "lastConnected" | "isConnected" | "wifiSSID" | "userId" | "isSynced" | "createdAt" | "updatedAt" | "brightness" | "sleepTimeout" | "sleepColorR" | "sleepColorG" | "sleepColorB" | "sleepEffect", ExtArgs["result"]["kidoo"]>
  export type KidooInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Kidoo$userArgs<ExtArgs>
    tags?: boolean | Kidoo$tagsArgs<ExtArgs>
    configBasic?: boolean | Kidoo$configBasicArgs<ExtArgs>
    configDream?: boolean | Kidoo$configDreamArgs<ExtArgs>
    _count?: boolean | KidooCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KidooIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Kidoo$userArgs<ExtArgs>
  }
  export type KidooIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Kidoo$userArgs<ExtArgs>
  }

  export type $KidooPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Kidoo"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      tags: Prisma.$TagPayload<ExtArgs>[]
      configBasic: Prisma.$KidooConfigBasicPayload<ExtArgs> | null
      configDream: Prisma.$KidooConfigDreamPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      model: string
      macAddress: string | null
      bluetoothMacAddress: string | null
      deviceId: string
      firmwareVersion: string | null
      lastConnected: Date | null
      isConnected: boolean
      wifiSSID: string | null
      userId: string | null
      isSynced: boolean
      createdAt: Date
      updatedAt: Date
      brightness: number
      sleepTimeout: number
      sleepColorR: number | null
      sleepColorG: number | null
      sleepColorB: number | null
      sleepEffect: number | null
    }, ExtArgs["result"]["kidoo"]>
    composites: {}
  }

  type KidooGetPayload<S extends boolean | null | undefined | KidooDefaultArgs> = $Result.GetResult<Prisma.$KidooPayload, S>

  type KidooCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KidooFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KidooCountAggregateInputType | true
    }

  export interface KidooDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Kidoo'], meta: { name: 'Kidoo' } }
    /**
     * Find zero or one Kidoo that matches the filter.
     * @param {KidooFindUniqueArgs} args - Arguments to find a Kidoo
     * @example
     * // Get one Kidoo
     * const kidoo = await prisma.kidoo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KidooFindUniqueArgs>(args: SelectSubset<T, KidooFindUniqueArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Kidoo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KidooFindUniqueOrThrowArgs} args - Arguments to find a Kidoo
     * @example
     * // Get one Kidoo
     * const kidoo = await prisma.kidoo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KidooFindUniqueOrThrowArgs>(args: SelectSubset<T, KidooFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kidoo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooFindFirstArgs} args - Arguments to find a Kidoo
     * @example
     * // Get one Kidoo
     * const kidoo = await prisma.kidoo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KidooFindFirstArgs>(args?: SelectSubset<T, KidooFindFirstArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kidoo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooFindFirstOrThrowArgs} args - Arguments to find a Kidoo
     * @example
     * // Get one Kidoo
     * const kidoo = await prisma.kidoo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KidooFindFirstOrThrowArgs>(args?: SelectSubset<T, KidooFindFirstOrThrowArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Kidoos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Kidoos
     * const kidoos = await prisma.kidoo.findMany()
     * 
     * // Get first 10 Kidoos
     * const kidoos = await prisma.kidoo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kidooWithIdOnly = await prisma.kidoo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KidooFindManyArgs>(args?: SelectSubset<T, KidooFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Kidoo.
     * @param {KidooCreateArgs} args - Arguments to create a Kidoo.
     * @example
     * // Create one Kidoo
     * const Kidoo = await prisma.kidoo.create({
     *   data: {
     *     // ... data to create a Kidoo
     *   }
     * })
     * 
     */
    create<T extends KidooCreateArgs>(args: SelectSubset<T, KidooCreateArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Kidoos.
     * @param {KidooCreateManyArgs} args - Arguments to create many Kidoos.
     * @example
     * // Create many Kidoos
     * const kidoo = await prisma.kidoo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KidooCreateManyArgs>(args?: SelectSubset<T, KidooCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Kidoos and returns the data saved in the database.
     * @param {KidooCreateManyAndReturnArgs} args - Arguments to create many Kidoos.
     * @example
     * // Create many Kidoos
     * const kidoo = await prisma.kidoo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Kidoos and only return the `id`
     * const kidooWithIdOnly = await prisma.kidoo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KidooCreateManyAndReturnArgs>(args?: SelectSubset<T, KidooCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Kidoo.
     * @param {KidooDeleteArgs} args - Arguments to delete one Kidoo.
     * @example
     * // Delete one Kidoo
     * const Kidoo = await prisma.kidoo.delete({
     *   where: {
     *     // ... filter to delete one Kidoo
     *   }
     * })
     * 
     */
    delete<T extends KidooDeleteArgs>(args: SelectSubset<T, KidooDeleteArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Kidoo.
     * @param {KidooUpdateArgs} args - Arguments to update one Kidoo.
     * @example
     * // Update one Kidoo
     * const kidoo = await prisma.kidoo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KidooUpdateArgs>(args: SelectSubset<T, KidooUpdateArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Kidoos.
     * @param {KidooDeleteManyArgs} args - Arguments to filter Kidoos to delete.
     * @example
     * // Delete a few Kidoos
     * const { count } = await prisma.kidoo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KidooDeleteManyArgs>(args?: SelectSubset<T, KidooDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kidoos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Kidoos
     * const kidoo = await prisma.kidoo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KidooUpdateManyArgs>(args: SelectSubset<T, KidooUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kidoos and returns the data updated in the database.
     * @param {KidooUpdateManyAndReturnArgs} args - Arguments to update many Kidoos.
     * @example
     * // Update many Kidoos
     * const kidoo = await prisma.kidoo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Kidoos and only return the `id`
     * const kidooWithIdOnly = await prisma.kidoo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KidooUpdateManyAndReturnArgs>(args: SelectSubset<T, KidooUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Kidoo.
     * @param {KidooUpsertArgs} args - Arguments to update or create a Kidoo.
     * @example
     * // Update or create a Kidoo
     * const kidoo = await prisma.kidoo.upsert({
     *   create: {
     *     // ... data to create a Kidoo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Kidoo we want to update
     *   }
     * })
     */
    upsert<T extends KidooUpsertArgs>(args: SelectSubset<T, KidooUpsertArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Kidoos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooCountArgs} args - Arguments to filter Kidoos to count.
     * @example
     * // Count the number of Kidoos
     * const count = await prisma.kidoo.count({
     *   where: {
     *     // ... the filter for the Kidoos we want to count
     *   }
     * })
    **/
    count<T extends KidooCountArgs>(
      args?: Subset<T, KidooCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KidooCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Kidoo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KidooAggregateArgs>(args: Subset<T, KidooAggregateArgs>): Prisma.PrismaPromise<GetKidooAggregateType<T>>

    /**
     * Group by Kidoo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KidooGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KidooGroupByArgs['orderBy'] }
        : { orderBy?: KidooGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KidooGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKidooGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Kidoo model
   */
  readonly fields: KidooFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Kidoo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KidooClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Kidoo$userArgs<ExtArgs> = {}>(args?: Subset<T, Kidoo$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tags<T extends Kidoo$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Kidoo$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    configBasic<T extends Kidoo$configBasicArgs<ExtArgs> = {}>(args?: Subset<T, Kidoo$configBasicArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    configDream<T extends Kidoo$configDreamArgs<ExtArgs> = {}>(args?: Subset<T, Kidoo$configDreamArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Kidoo model
   */
  interface KidooFieldRefs {
    readonly id: FieldRef<"Kidoo", 'String'>
    readonly name: FieldRef<"Kidoo", 'String'>
    readonly model: FieldRef<"Kidoo", 'String'>
    readonly macAddress: FieldRef<"Kidoo", 'String'>
    readonly bluetoothMacAddress: FieldRef<"Kidoo", 'String'>
    readonly deviceId: FieldRef<"Kidoo", 'String'>
    readonly firmwareVersion: FieldRef<"Kidoo", 'String'>
    readonly lastConnected: FieldRef<"Kidoo", 'DateTime'>
    readonly isConnected: FieldRef<"Kidoo", 'Boolean'>
    readonly wifiSSID: FieldRef<"Kidoo", 'String'>
    readonly userId: FieldRef<"Kidoo", 'String'>
    readonly isSynced: FieldRef<"Kidoo", 'Boolean'>
    readonly createdAt: FieldRef<"Kidoo", 'DateTime'>
    readonly updatedAt: FieldRef<"Kidoo", 'DateTime'>
    readonly brightness: FieldRef<"Kidoo", 'Int'>
    readonly sleepTimeout: FieldRef<"Kidoo", 'Int'>
    readonly sleepColorR: FieldRef<"Kidoo", 'Int'>
    readonly sleepColorG: FieldRef<"Kidoo", 'Int'>
    readonly sleepColorB: FieldRef<"Kidoo", 'Int'>
    readonly sleepEffect: FieldRef<"Kidoo", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Kidoo findUnique
   */
  export type KidooFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter, which Kidoo to fetch.
     */
    where: KidooWhereUniqueInput
  }

  /**
   * Kidoo findUniqueOrThrow
   */
  export type KidooFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter, which Kidoo to fetch.
     */
    where: KidooWhereUniqueInput
  }

  /**
   * Kidoo findFirst
   */
  export type KidooFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter, which Kidoo to fetch.
     */
    where?: KidooWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kidoos to fetch.
     */
    orderBy?: KidooOrderByWithRelationInput | KidooOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kidoos.
     */
    cursor?: KidooWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kidoos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kidoos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kidoos.
     */
    distinct?: KidooScalarFieldEnum | KidooScalarFieldEnum[]
  }

  /**
   * Kidoo findFirstOrThrow
   */
  export type KidooFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter, which Kidoo to fetch.
     */
    where?: KidooWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kidoos to fetch.
     */
    orderBy?: KidooOrderByWithRelationInput | KidooOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kidoos.
     */
    cursor?: KidooWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kidoos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kidoos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kidoos.
     */
    distinct?: KidooScalarFieldEnum | KidooScalarFieldEnum[]
  }

  /**
   * Kidoo findMany
   */
  export type KidooFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter, which Kidoos to fetch.
     */
    where?: KidooWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kidoos to fetch.
     */
    orderBy?: KidooOrderByWithRelationInput | KidooOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Kidoos.
     */
    cursor?: KidooWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kidoos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kidoos.
     */
    skip?: number
    distinct?: KidooScalarFieldEnum | KidooScalarFieldEnum[]
  }

  /**
   * Kidoo create
   */
  export type KidooCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * The data needed to create a Kidoo.
     */
    data: XOR<KidooCreateInput, KidooUncheckedCreateInput>
  }

  /**
   * Kidoo createMany
   */
  export type KidooCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Kidoos.
     */
    data: KidooCreateManyInput | KidooCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Kidoo createManyAndReturn
   */
  export type KidooCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * The data used to create many Kidoos.
     */
    data: KidooCreateManyInput | KidooCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Kidoo update
   */
  export type KidooUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * The data needed to update a Kidoo.
     */
    data: XOR<KidooUpdateInput, KidooUncheckedUpdateInput>
    /**
     * Choose, which Kidoo to update.
     */
    where: KidooWhereUniqueInput
  }

  /**
   * Kidoo updateMany
   */
  export type KidooUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Kidoos.
     */
    data: XOR<KidooUpdateManyMutationInput, KidooUncheckedUpdateManyInput>
    /**
     * Filter which Kidoos to update
     */
    where?: KidooWhereInput
    /**
     * Limit how many Kidoos to update.
     */
    limit?: number
  }

  /**
   * Kidoo updateManyAndReturn
   */
  export type KidooUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * The data used to update Kidoos.
     */
    data: XOR<KidooUpdateManyMutationInput, KidooUncheckedUpdateManyInput>
    /**
     * Filter which Kidoos to update
     */
    where?: KidooWhereInput
    /**
     * Limit how many Kidoos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Kidoo upsert
   */
  export type KidooUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * The filter to search for the Kidoo to update in case it exists.
     */
    where: KidooWhereUniqueInput
    /**
     * In case the Kidoo found by the `where` argument doesn't exist, create a new Kidoo with this data.
     */
    create: XOR<KidooCreateInput, KidooUncheckedCreateInput>
    /**
     * In case the Kidoo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KidooUpdateInput, KidooUncheckedUpdateInput>
  }

  /**
   * Kidoo delete
   */
  export type KidooDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
    /**
     * Filter which Kidoo to delete.
     */
    where: KidooWhereUniqueInput
  }

  /**
   * Kidoo deleteMany
   */
  export type KidooDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kidoos to delete
     */
    where?: KidooWhereInput
    /**
     * Limit how many Kidoos to delete.
     */
    limit?: number
  }

  /**
   * Kidoo.user
   */
  export type Kidoo$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Kidoo.tags
   */
  export type Kidoo$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    cursor?: TagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Kidoo.configBasic
   */
  export type Kidoo$configBasicArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    where?: KidooConfigBasicWhereInput
  }

  /**
   * Kidoo.configDream
   */
  export type Kidoo$configDreamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    where?: KidooConfigDreamWhereInput
  }

  /**
   * Kidoo without action
   */
  export type KidooDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kidoo
     */
    select?: KidooSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kidoo
     */
    omit?: KidooOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    tagId: string | null
    uid: string | null
    name: string | null
    type: $Enums.TagType | null
    kidooId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    tagId: string | null
    uid: string | null
    name: string | null
    type: $Enums.TagType | null
    kidooId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    tagId: number
    uid: number
    name: number
    type: number
    kidooId: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    tagId?: true
    uid?: true
    name?: true
    type?: true
    kidooId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    tagId?: true
    uid?: true
    name?: true
    type?: true
    kidooId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    tagId?: true
    uid?: true
    name?: true
    type?: true
    kidooId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    tagId: string | null
    uid: string | null
    name: string | null
    type: $Enums.TagType | null
    kidooId: string
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    uid?: boolean
    name?: boolean
    type?: boolean
    kidooId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    multimediaFiles?: boolean | Tag$multimediaFilesArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    uid?: boolean
    name?: boolean
    type?: boolean
    kidooId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    uid?: boolean
    name?: boolean
    type?: boolean
    kidooId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    tagId?: boolean
    uid?: boolean
    name?: boolean
    type?: boolean
    kidooId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tagId" | "uid" | "name" | "type" | "kidooId" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    multimediaFiles?: boolean | Tag$multimediaFilesArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      kidoo: Prisma.$KidooPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      multimediaFiles: Prisma.$FilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tagId: string | null
      uid: string | null
      name: string | null
      type: $Enums.TagType | null
      kidooId: string
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kidoo<T extends KidooDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KidooDefaultArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    multimediaFiles<T extends Tag$multimediaFilesArgs<ExtArgs> = {}>(args?: Subset<T, Tag$multimediaFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly tagId: FieldRef<"Tag", 'String'>
    readonly uid: FieldRef<"Tag", 'String'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly type: FieldRef<"Tag", 'TagType'>
    readonly kidooId: FieldRef<"Tag", 'String'>
    readonly userId: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
    readonly updatedAt: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.multimediaFiles
   */
  export type Tag$multimediaFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    size: number | null
    order: number | null
  }

  export type FileSumAggregateOutputType = {
    size: number | null
    order: number | null
  }

  export type FileMinAggregateOutputType = {
    id: string | null
    tagId: string | null
    userId: string | null
    url: string | null
    path: string | null
    fileName: string | null
    originalName: string | null
    size: number | null
    mimeType: string | null
    order: number | null
    disabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileMaxAggregateOutputType = {
    id: string | null
    tagId: string | null
    userId: string | null
    url: string | null
    path: string | null
    fileName: string | null
    originalName: string | null
    size: number | null
    mimeType: string | null
    order: number | null
    disabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileCountAggregateOutputType = {
    id: number
    tagId: number
    userId: number
    url: number
    path: number
    fileName: number
    originalName: number
    size: number
    mimeType: number
    order: number
    disabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    size?: true
    order?: true
  }

  export type FileSumAggregateInputType = {
    size?: true
    order?: true
  }

  export type FileMinAggregateInputType = {
    id?: true
    tagId?: true
    userId?: true
    url?: true
    path?: true
    fileName?: true
    originalName?: true
    size?: true
    mimeType?: true
    order?: true
    disabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileMaxAggregateInputType = {
    id?: true
    tagId?: true
    userId?: true
    url?: true
    path?: true
    fileName?: true
    originalName?: true
    size?: true
    mimeType?: true
    order?: true
    disabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileCountAggregateInputType = {
    id?: true
    tagId?: true
    userId?: true
    url?: true
    path?: true
    fileName?: true
    originalName?: true
    size?: true
    mimeType?: true
    order?: true
    disabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    id: string
    tagId: string
    userId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order: number
    disabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    userId?: boolean
    url?: boolean
    path?: boolean
    fileName?: boolean
    originalName?: boolean
    size?: boolean
    mimeType?: boolean
    order?: boolean
    disabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    userId?: boolean
    url?: boolean
    path?: boolean
    fileName?: boolean
    originalName?: boolean
    size?: boolean
    mimeType?: boolean
    order?: boolean
    disabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tagId?: boolean
    userId?: boolean
    url?: boolean
    path?: boolean
    fileName?: boolean
    originalName?: boolean
    size?: boolean
    mimeType?: boolean
    order?: boolean
    disabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectScalar = {
    id?: boolean
    tagId?: boolean
    userId?: boolean
    url?: boolean
    path?: boolean
    fileName?: boolean
    originalName?: boolean
    size?: boolean
    mimeType?: boolean
    order?: boolean
    disabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tagId" | "userId" | "url" | "path" | "fileName" | "originalName" | "size" | "mimeType" | "order" | "disabled" | "createdAt" | "updatedAt", ExtArgs["result"]["file"]>
  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tag?: boolean | TagDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {
      tag: Prisma.$TagPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tagId: string
      userId: string
      url: string
      path: string
      fileName: string
      originalName: string
      size: number
      mimeType: string
      order: number
      disabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["file"]>
    composites: {}
  }

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileFindUniqueArgs>(args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one File that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(args: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileFindFirstArgs>(args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileWithIdOnly = await prisma.file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileFindManyArgs>(args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
     */
    create<T extends FileCreateArgs>(args: SelectSubset<T, FileCreateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Files.
     * @param {FileCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileCreateManyArgs>(args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Files and returns the data saved in the database.
     * @param {FileCreateManyAndReturnArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileCreateManyAndReturnArgs>(args?: SelectSubset<T, FileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
     */
    delete<T extends FileDeleteArgs>(args: SelectSubset<T, FileDeleteArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileUpdateArgs>(args: SelectSubset<T, FileUpdateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileDeleteManyArgs>(args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileUpdateManyArgs>(args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files and returns the data updated in the database.
     * @param {FileUpdateManyAndReturnArgs} args - Arguments to update many Files.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FileUpdateManyAndReturnArgs>(args: SelectSubset<T, FileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     */
    upsert<T extends FileUpsertArgs>(args: SelectSubset<T, FileUpsertArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the File model
   */
  interface FileFieldRefs {
    readonly id: FieldRef<"File", 'String'>
    readonly tagId: FieldRef<"File", 'String'>
    readonly userId: FieldRef<"File", 'String'>
    readonly url: FieldRef<"File", 'String'>
    readonly path: FieldRef<"File", 'String'>
    readonly fileName: FieldRef<"File", 'String'>
    readonly originalName: FieldRef<"File", 'String'>
    readonly size: FieldRef<"File", 'Int'>
    readonly mimeType: FieldRef<"File", 'String'>
    readonly order: FieldRef<"File", 'Int'>
    readonly disabled: FieldRef<"File", 'Boolean'>
    readonly createdAt: FieldRef<"File", 'DateTime'>
    readonly updatedAt: FieldRef<"File", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * File createManyAndReturn
   */
  export type FileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * File updateManyAndReturn
   */
  export type FileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to delete.
     */
    limit?: number
  }

  /**
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
  }


  /**
   * Model KidooConfigBasic
   */

  export type AggregateKidooConfigBasic = {
    _count: KidooConfigBasicCountAggregateOutputType | null
    _avg: KidooConfigBasicAvgAggregateOutputType | null
    _sum: KidooConfigBasicSumAggregateOutputType | null
    _min: KidooConfigBasicMinAggregateOutputType | null
    _max: KidooConfigBasicMaxAggregateOutputType | null
  }

  export type KidooConfigBasicAvgAggregateOutputType = {
    storageTotalBytes: number | null
    storageFreeBytes: number | null
    storageUsedBytes: number | null
    storageFreePercent: number | null
    storageUsedPercent: number | null
  }

  export type KidooConfigBasicSumAggregateOutputType = {
    storageTotalBytes: bigint | null
    storageFreeBytes: bigint | null
    storageUsedBytes: bigint | null
    storageFreePercent: number | null
    storageUsedPercent: number | null
  }

  export type KidooConfigBasicMinAggregateOutputType = {
    id: string | null
    kidooId: string | null
    storageTotalBytes: bigint | null
    storageFreeBytes: bigint | null
    storageUsedBytes: bigint | null
    storageFreePercent: number | null
    storageUsedPercent: number | null
    storageLastUpdated: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigBasicMaxAggregateOutputType = {
    id: string | null
    kidooId: string | null
    storageTotalBytes: bigint | null
    storageFreeBytes: bigint | null
    storageUsedBytes: bigint | null
    storageFreePercent: number | null
    storageUsedPercent: number | null
    storageLastUpdated: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigBasicCountAggregateOutputType = {
    id: number
    kidooId: number
    storageTotalBytes: number
    storageFreeBytes: number
    storageUsedBytes: number
    storageFreePercent: number
    storageUsedPercent: number
    storageLastUpdated: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KidooConfigBasicAvgAggregateInputType = {
    storageTotalBytes?: true
    storageFreeBytes?: true
    storageUsedBytes?: true
    storageFreePercent?: true
    storageUsedPercent?: true
  }

  export type KidooConfigBasicSumAggregateInputType = {
    storageTotalBytes?: true
    storageFreeBytes?: true
    storageUsedBytes?: true
    storageFreePercent?: true
    storageUsedPercent?: true
  }

  export type KidooConfigBasicMinAggregateInputType = {
    id?: true
    kidooId?: true
    storageTotalBytes?: true
    storageFreeBytes?: true
    storageUsedBytes?: true
    storageFreePercent?: true
    storageUsedPercent?: true
    storageLastUpdated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigBasicMaxAggregateInputType = {
    id?: true
    kidooId?: true
    storageTotalBytes?: true
    storageFreeBytes?: true
    storageUsedBytes?: true
    storageFreePercent?: true
    storageUsedPercent?: true
    storageLastUpdated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigBasicCountAggregateInputType = {
    id?: true
    kidooId?: true
    storageTotalBytes?: true
    storageFreeBytes?: true
    storageUsedBytes?: true
    storageFreePercent?: true
    storageUsedPercent?: true
    storageLastUpdated?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KidooConfigBasicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigBasic to aggregate.
     */
    where?: KidooConfigBasicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigBasics to fetch.
     */
    orderBy?: KidooConfigBasicOrderByWithRelationInput | KidooConfigBasicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KidooConfigBasicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigBasics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigBasics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KidooConfigBasics
    **/
    _count?: true | KidooConfigBasicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KidooConfigBasicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KidooConfigBasicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KidooConfigBasicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KidooConfigBasicMaxAggregateInputType
  }

  export type GetKidooConfigBasicAggregateType<T extends KidooConfigBasicAggregateArgs> = {
        [P in keyof T & keyof AggregateKidooConfigBasic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKidooConfigBasic[P]>
      : GetScalarType<T[P], AggregateKidooConfigBasic[P]>
  }




  export type KidooConfigBasicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigBasicWhereInput
    orderBy?: KidooConfigBasicOrderByWithAggregationInput | KidooConfigBasicOrderByWithAggregationInput[]
    by: KidooConfigBasicScalarFieldEnum[] | KidooConfigBasicScalarFieldEnum
    having?: KidooConfigBasicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KidooConfigBasicCountAggregateInputType | true
    _avg?: KidooConfigBasicAvgAggregateInputType
    _sum?: KidooConfigBasicSumAggregateInputType
    _min?: KidooConfigBasicMinAggregateInputType
    _max?: KidooConfigBasicMaxAggregateInputType
  }

  export type KidooConfigBasicGroupByOutputType = {
    id: string
    kidooId: string
    storageTotalBytes: bigint | null
    storageFreeBytes: bigint | null
    storageUsedBytes: bigint | null
    storageFreePercent: number | null
    storageUsedPercent: number | null
    storageLastUpdated: Date | null
    createdAt: Date
    updatedAt: Date
    _count: KidooConfigBasicCountAggregateOutputType | null
    _avg: KidooConfigBasicAvgAggregateOutputType | null
    _sum: KidooConfigBasicSumAggregateOutputType | null
    _min: KidooConfigBasicMinAggregateOutputType | null
    _max: KidooConfigBasicMaxAggregateOutputType | null
  }

  type GetKidooConfigBasicGroupByPayload<T extends KidooConfigBasicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KidooConfigBasicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KidooConfigBasicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KidooConfigBasicGroupByOutputType[P]>
            : GetScalarType<T[P], KidooConfigBasicGroupByOutputType[P]>
        }
      >
    >


  export type KidooConfigBasicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    storageTotalBytes?: boolean
    storageFreeBytes?: boolean
    storageUsedBytes?: boolean
    storageFreePercent?: boolean
    storageUsedPercent?: boolean
    storageLastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigBasic"]>

  export type KidooConfigBasicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    storageTotalBytes?: boolean
    storageFreeBytes?: boolean
    storageUsedBytes?: boolean
    storageFreePercent?: boolean
    storageUsedPercent?: boolean
    storageLastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigBasic"]>

  export type KidooConfigBasicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    storageTotalBytes?: boolean
    storageFreeBytes?: boolean
    storageUsedBytes?: boolean
    storageFreePercent?: boolean
    storageUsedPercent?: boolean
    storageLastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigBasic"]>

  export type KidooConfigBasicSelectScalar = {
    id?: boolean
    kidooId?: boolean
    storageTotalBytes?: boolean
    storageFreeBytes?: boolean
    storageUsedBytes?: boolean
    storageFreePercent?: boolean
    storageUsedPercent?: boolean
    storageLastUpdated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KidooConfigBasicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kidooId" | "storageTotalBytes" | "storageFreeBytes" | "storageUsedBytes" | "storageFreePercent" | "storageUsedPercent" | "storageLastUpdated" | "createdAt" | "updatedAt", ExtArgs["result"]["kidooConfigBasic"]>
  export type KidooConfigBasicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }
  export type KidooConfigBasicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }
  export type KidooConfigBasicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }

  export type $KidooConfigBasicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KidooConfigBasic"
    objects: {
      kidoo: Prisma.$KidooPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kidooId: string
      storageTotalBytes: bigint | null
      storageFreeBytes: bigint | null
      storageUsedBytes: bigint | null
      storageFreePercent: number | null
      storageUsedPercent: number | null
      storageLastUpdated: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kidooConfigBasic"]>
    composites: {}
  }

  type KidooConfigBasicGetPayload<S extends boolean | null | undefined | KidooConfigBasicDefaultArgs> = $Result.GetResult<Prisma.$KidooConfigBasicPayload, S>

  type KidooConfigBasicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KidooConfigBasicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KidooConfigBasicCountAggregateInputType | true
    }

  export interface KidooConfigBasicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KidooConfigBasic'], meta: { name: 'KidooConfigBasic' } }
    /**
     * Find zero or one KidooConfigBasic that matches the filter.
     * @param {KidooConfigBasicFindUniqueArgs} args - Arguments to find a KidooConfigBasic
     * @example
     * // Get one KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KidooConfigBasicFindUniqueArgs>(args: SelectSubset<T, KidooConfigBasicFindUniqueArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KidooConfigBasic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KidooConfigBasicFindUniqueOrThrowArgs} args - Arguments to find a KidooConfigBasic
     * @example
     * // Get one KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KidooConfigBasicFindUniqueOrThrowArgs>(args: SelectSubset<T, KidooConfigBasicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigBasic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicFindFirstArgs} args - Arguments to find a KidooConfigBasic
     * @example
     * // Get one KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KidooConfigBasicFindFirstArgs>(args?: SelectSubset<T, KidooConfigBasicFindFirstArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigBasic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicFindFirstOrThrowArgs} args - Arguments to find a KidooConfigBasic
     * @example
     * // Get one KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KidooConfigBasicFindFirstOrThrowArgs>(args?: SelectSubset<T, KidooConfigBasicFindFirstOrThrowArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KidooConfigBasics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KidooConfigBasics
     * const kidooConfigBasics = await prisma.kidooConfigBasic.findMany()
     * 
     * // Get first 10 KidooConfigBasics
     * const kidooConfigBasics = await prisma.kidooConfigBasic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kidooConfigBasicWithIdOnly = await prisma.kidooConfigBasic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KidooConfigBasicFindManyArgs>(args?: SelectSubset<T, KidooConfigBasicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KidooConfigBasic.
     * @param {KidooConfigBasicCreateArgs} args - Arguments to create a KidooConfigBasic.
     * @example
     * // Create one KidooConfigBasic
     * const KidooConfigBasic = await prisma.kidooConfigBasic.create({
     *   data: {
     *     // ... data to create a KidooConfigBasic
     *   }
     * })
     * 
     */
    create<T extends KidooConfigBasicCreateArgs>(args: SelectSubset<T, KidooConfigBasicCreateArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KidooConfigBasics.
     * @param {KidooConfigBasicCreateManyArgs} args - Arguments to create many KidooConfigBasics.
     * @example
     * // Create many KidooConfigBasics
     * const kidooConfigBasic = await prisma.kidooConfigBasic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KidooConfigBasicCreateManyArgs>(args?: SelectSubset<T, KidooConfigBasicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KidooConfigBasics and returns the data saved in the database.
     * @param {KidooConfigBasicCreateManyAndReturnArgs} args - Arguments to create many KidooConfigBasics.
     * @example
     * // Create many KidooConfigBasics
     * const kidooConfigBasic = await prisma.kidooConfigBasic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KidooConfigBasics and only return the `id`
     * const kidooConfigBasicWithIdOnly = await prisma.kidooConfigBasic.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KidooConfigBasicCreateManyAndReturnArgs>(args?: SelectSubset<T, KidooConfigBasicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KidooConfigBasic.
     * @param {KidooConfigBasicDeleteArgs} args - Arguments to delete one KidooConfigBasic.
     * @example
     * // Delete one KidooConfigBasic
     * const KidooConfigBasic = await prisma.kidooConfigBasic.delete({
     *   where: {
     *     // ... filter to delete one KidooConfigBasic
     *   }
     * })
     * 
     */
    delete<T extends KidooConfigBasicDeleteArgs>(args: SelectSubset<T, KidooConfigBasicDeleteArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KidooConfigBasic.
     * @param {KidooConfigBasicUpdateArgs} args - Arguments to update one KidooConfigBasic.
     * @example
     * // Update one KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KidooConfigBasicUpdateArgs>(args: SelectSubset<T, KidooConfigBasicUpdateArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KidooConfigBasics.
     * @param {KidooConfigBasicDeleteManyArgs} args - Arguments to filter KidooConfigBasics to delete.
     * @example
     * // Delete a few KidooConfigBasics
     * const { count } = await prisma.kidooConfigBasic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KidooConfigBasicDeleteManyArgs>(args?: SelectSubset<T, KidooConfigBasicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigBasics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KidooConfigBasics
     * const kidooConfigBasic = await prisma.kidooConfigBasic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KidooConfigBasicUpdateManyArgs>(args: SelectSubset<T, KidooConfigBasicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigBasics and returns the data updated in the database.
     * @param {KidooConfigBasicUpdateManyAndReturnArgs} args - Arguments to update many KidooConfigBasics.
     * @example
     * // Update many KidooConfigBasics
     * const kidooConfigBasic = await prisma.kidooConfigBasic.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KidooConfigBasics and only return the `id`
     * const kidooConfigBasicWithIdOnly = await prisma.kidooConfigBasic.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KidooConfigBasicUpdateManyAndReturnArgs>(args: SelectSubset<T, KidooConfigBasicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KidooConfigBasic.
     * @param {KidooConfigBasicUpsertArgs} args - Arguments to update or create a KidooConfigBasic.
     * @example
     * // Update or create a KidooConfigBasic
     * const kidooConfigBasic = await prisma.kidooConfigBasic.upsert({
     *   create: {
     *     // ... data to create a KidooConfigBasic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KidooConfigBasic we want to update
     *   }
     * })
     */
    upsert<T extends KidooConfigBasicUpsertArgs>(args: SelectSubset<T, KidooConfigBasicUpsertArgs<ExtArgs>>): Prisma__KidooConfigBasicClient<$Result.GetResult<Prisma.$KidooConfigBasicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KidooConfigBasics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicCountArgs} args - Arguments to filter KidooConfigBasics to count.
     * @example
     * // Count the number of KidooConfigBasics
     * const count = await prisma.kidooConfigBasic.count({
     *   where: {
     *     // ... the filter for the KidooConfigBasics we want to count
     *   }
     * })
    **/
    count<T extends KidooConfigBasicCountArgs>(
      args?: Subset<T, KidooConfigBasicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KidooConfigBasicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KidooConfigBasic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KidooConfigBasicAggregateArgs>(args: Subset<T, KidooConfigBasicAggregateArgs>): Prisma.PrismaPromise<GetKidooConfigBasicAggregateType<T>>

    /**
     * Group by KidooConfigBasic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigBasicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KidooConfigBasicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KidooConfigBasicGroupByArgs['orderBy'] }
        : { orderBy?: KidooConfigBasicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KidooConfigBasicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKidooConfigBasicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KidooConfigBasic model
   */
  readonly fields: KidooConfigBasicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KidooConfigBasic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KidooConfigBasicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kidoo<T extends KidooDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KidooDefaultArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KidooConfigBasic model
   */
  interface KidooConfigBasicFieldRefs {
    readonly id: FieldRef<"KidooConfigBasic", 'String'>
    readonly kidooId: FieldRef<"KidooConfigBasic", 'String'>
    readonly storageTotalBytes: FieldRef<"KidooConfigBasic", 'BigInt'>
    readonly storageFreeBytes: FieldRef<"KidooConfigBasic", 'BigInt'>
    readonly storageUsedBytes: FieldRef<"KidooConfigBasic", 'BigInt'>
    readonly storageFreePercent: FieldRef<"KidooConfigBasic", 'Int'>
    readonly storageUsedPercent: FieldRef<"KidooConfigBasic", 'Int'>
    readonly storageLastUpdated: FieldRef<"KidooConfigBasic", 'DateTime'>
    readonly createdAt: FieldRef<"KidooConfigBasic", 'DateTime'>
    readonly updatedAt: FieldRef<"KidooConfigBasic", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KidooConfigBasic findUnique
   */
  export type KidooConfigBasicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigBasic to fetch.
     */
    where: KidooConfigBasicWhereUniqueInput
  }

  /**
   * KidooConfigBasic findUniqueOrThrow
   */
  export type KidooConfigBasicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigBasic to fetch.
     */
    where: KidooConfigBasicWhereUniqueInput
  }

  /**
   * KidooConfigBasic findFirst
   */
  export type KidooConfigBasicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigBasic to fetch.
     */
    where?: KidooConfigBasicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigBasics to fetch.
     */
    orderBy?: KidooConfigBasicOrderByWithRelationInput | KidooConfigBasicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigBasics.
     */
    cursor?: KidooConfigBasicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigBasics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigBasics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigBasics.
     */
    distinct?: KidooConfigBasicScalarFieldEnum | KidooConfigBasicScalarFieldEnum[]
  }

  /**
   * KidooConfigBasic findFirstOrThrow
   */
  export type KidooConfigBasicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigBasic to fetch.
     */
    where?: KidooConfigBasicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigBasics to fetch.
     */
    orderBy?: KidooConfigBasicOrderByWithRelationInput | KidooConfigBasicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigBasics.
     */
    cursor?: KidooConfigBasicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigBasics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigBasics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigBasics.
     */
    distinct?: KidooConfigBasicScalarFieldEnum | KidooConfigBasicScalarFieldEnum[]
  }

  /**
   * KidooConfigBasic findMany
   */
  export type KidooConfigBasicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigBasics to fetch.
     */
    where?: KidooConfigBasicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigBasics to fetch.
     */
    orderBy?: KidooConfigBasicOrderByWithRelationInput | KidooConfigBasicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KidooConfigBasics.
     */
    cursor?: KidooConfigBasicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigBasics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigBasics.
     */
    skip?: number
    distinct?: KidooConfigBasicScalarFieldEnum | KidooConfigBasicScalarFieldEnum[]
  }

  /**
   * KidooConfigBasic create
   */
  export type KidooConfigBasicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * The data needed to create a KidooConfigBasic.
     */
    data: XOR<KidooConfigBasicCreateInput, KidooConfigBasicUncheckedCreateInput>
  }

  /**
   * KidooConfigBasic createMany
   */
  export type KidooConfigBasicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KidooConfigBasics.
     */
    data: KidooConfigBasicCreateManyInput | KidooConfigBasicCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KidooConfigBasic createManyAndReturn
   */
  export type KidooConfigBasicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * The data used to create many KidooConfigBasics.
     */
    data: KidooConfigBasicCreateManyInput | KidooConfigBasicCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigBasic update
   */
  export type KidooConfigBasicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * The data needed to update a KidooConfigBasic.
     */
    data: XOR<KidooConfigBasicUpdateInput, KidooConfigBasicUncheckedUpdateInput>
    /**
     * Choose, which KidooConfigBasic to update.
     */
    where: KidooConfigBasicWhereUniqueInput
  }

  /**
   * KidooConfigBasic updateMany
   */
  export type KidooConfigBasicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KidooConfigBasics.
     */
    data: XOR<KidooConfigBasicUpdateManyMutationInput, KidooConfigBasicUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigBasics to update
     */
    where?: KidooConfigBasicWhereInput
    /**
     * Limit how many KidooConfigBasics to update.
     */
    limit?: number
  }

  /**
   * KidooConfigBasic updateManyAndReturn
   */
  export type KidooConfigBasicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * The data used to update KidooConfigBasics.
     */
    data: XOR<KidooConfigBasicUpdateManyMutationInput, KidooConfigBasicUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigBasics to update
     */
    where?: KidooConfigBasicWhereInput
    /**
     * Limit how many KidooConfigBasics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigBasic upsert
   */
  export type KidooConfigBasicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * The filter to search for the KidooConfigBasic to update in case it exists.
     */
    where: KidooConfigBasicWhereUniqueInput
    /**
     * In case the KidooConfigBasic found by the `where` argument doesn't exist, create a new KidooConfigBasic with this data.
     */
    create: XOR<KidooConfigBasicCreateInput, KidooConfigBasicUncheckedCreateInput>
    /**
     * In case the KidooConfigBasic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KidooConfigBasicUpdateInput, KidooConfigBasicUncheckedUpdateInput>
  }

  /**
   * KidooConfigBasic delete
   */
  export type KidooConfigBasicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
    /**
     * Filter which KidooConfigBasic to delete.
     */
    where: KidooConfigBasicWhereUniqueInput
  }

  /**
   * KidooConfigBasic deleteMany
   */
  export type KidooConfigBasicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigBasics to delete
     */
    where?: KidooConfigBasicWhereInput
    /**
     * Limit how many KidooConfigBasics to delete.
     */
    limit?: number
  }

  /**
   * KidooConfigBasic without action
   */
  export type KidooConfigBasicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigBasic
     */
    select?: KidooConfigBasicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigBasic
     */
    omit?: KidooConfigBasicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigBasicInclude<ExtArgs> | null
  }


  /**
   * Model KidooConfigDream
   */

  export type AggregateKidooConfigDream = {
    _count: KidooConfigDreamCountAggregateOutputType | null
    _avg: KidooConfigDreamAvgAggregateOutputType | null
    _sum: KidooConfigDreamSumAggregateOutputType | null
    _min: KidooConfigDreamMinAggregateOutputType | null
    _max: KidooConfigDreamMaxAggregateOutputType | null
  }

  export type KidooConfigDreamAvgAggregateOutputType = {
    colorR: number | null
    colorG: number | null
    colorB: number | null
    brightness: number | null
    wakeupColorR: number | null
    wakeupColorG: number | null
    wakeupColorB: number | null
    wakeupBrightness: number | null
  }

  export type KidooConfigDreamSumAggregateOutputType = {
    colorR: number | null
    colorG: number | null
    colorB: number | null
    brightness: number | null
    wakeupColorR: number | null
    wakeupColorG: number | null
    wakeupColorB: number | null
    wakeupBrightness: number | null
  }

  export type KidooConfigDreamMinAggregateOutputType = {
    id: string | null
    kidooId: string | null
    colorR: number | null
    colorG: number | null
    colorB: number | null
    brightness: number | null
    allNight: boolean | null
    effect: string | null
    wakeupColorR: number | null
    wakeupColorG: number | null
    wakeupColorB: number | null
    wakeupBrightness: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamMaxAggregateOutputType = {
    id: string | null
    kidooId: string | null
    colorR: number | null
    colorG: number | null
    colorB: number | null
    brightness: number | null
    allNight: boolean | null
    effect: string | null
    wakeupColorR: number | null
    wakeupColorG: number | null
    wakeupColorB: number | null
    wakeupBrightness: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamCountAggregateOutputType = {
    id: number
    kidooId: number
    colorR: number
    colorG: number
    colorB: number
    brightness: number
    allNight: number
    effect: number
    wakeupColorR: number
    wakeupColorG: number
    wakeupColorB: number
    wakeupBrightness: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KidooConfigDreamAvgAggregateInputType = {
    colorR?: true
    colorG?: true
    colorB?: true
    brightness?: true
    wakeupColorR?: true
    wakeupColorG?: true
    wakeupColorB?: true
    wakeupBrightness?: true
  }

  export type KidooConfigDreamSumAggregateInputType = {
    colorR?: true
    colorG?: true
    colorB?: true
    brightness?: true
    wakeupColorR?: true
    wakeupColorG?: true
    wakeupColorB?: true
    wakeupBrightness?: true
  }

  export type KidooConfigDreamMinAggregateInputType = {
    id?: true
    kidooId?: true
    colorR?: true
    colorG?: true
    colorB?: true
    brightness?: true
    allNight?: true
    effect?: true
    wakeupColorR?: true
    wakeupColorG?: true
    wakeupColorB?: true
    wakeupBrightness?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamMaxAggregateInputType = {
    id?: true
    kidooId?: true
    colorR?: true
    colorG?: true
    colorB?: true
    brightness?: true
    allNight?: true
    effect?: true
    wakeupColorR?: true
    wakeupColorG?: true
    wakeupColorB?: true
    wakeupBrightness?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamCountAggregateInputType = {
    id?: true
    kidooId?: true
    colorR?: true
    colorG?: true
    colorB?: true
    brightness?: true
    allNight?: true
    effect?: true
    wakeupColorR?: true
    wakeupColorG?: true
    wakeupColorB?: true
    wakeupBrightness?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KidooConfigDreamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDream to aggregate.
     */
    where?: KidooConfigDreamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreams to fetch.
     */
    orderBy?: KidooConfigDreamOrderByWithRelationInput | KidooConfigDreamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KidooConfigDreamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KidooConfigDreams
    **/
    _count?: true | KidooConfigDreamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KidooConfigDreamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KidooConfigDreamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KidooConfigDreamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KidooConfigDreamMaxAggregateInputType
  }

  export type GetKidooConfigDreamAggregateType<T extends KidooConfigDreamAggregateArgs> = {
        [P in keyof T & keyof AggregateKidooConfigDream]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKidooConfigDream[P]>
      : GetScalarType<T[P], AggregateKidooConfigDream[P]>
  }




  export type KidooConfigDreamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigDreamWhereInput
    orderBy?: KidooConfigDreamOrderByWithAggregationInput | KidooConfigDreamOrderByWithAggregationInput[]
    by: KidooConfigDreamScalarFieldEnum[] | KidooConfigDreamScalarFieldEnum
    having?: KidooConfigDreamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KidooConfigDreamCountAggregateInputType | true
    _avg?: KidooConfigDreamAvgAggregateInputType
    _sum?: KidooConfigDreamSumAggregateInputType
    _min?: KidooConfigDreamMinAggregateInputType
    _max?: KidooConfigDreamMaxAggregateInputType
  }

  export type KidooConfigDreamGroupByOutputType = {
    id: string
    kidooId: string
    colorR: number | null
    colorG: number | null
    colorB: number | null
    brightness: number | null
    allNight: boolean
    effect: string | null
    wakeupColorR: number | null
    wakeupColorG: number | null
    wakeupColorB: number | null
    wakeupBrightness: number | null
    createdAt: Date
    updatedAt: Date
    _count: KidooConfigDreamCountAggregateOutputType | null
    _avg: KidooConfigDreamAvgAggregateOutputType | null
    _sum: KidooConfigDreamSumAggregateOutputType | null
    _min: KidooConfigDreamMinAggregateOutputType | null
    _max: KidooConfigDreamMaxAggregateOutputType | null
  }

  type GetKidooConfigDreamGroupByPayload<T extends KidooConfigDreamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KidooConfigDreamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KidooConfigDreamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KidooConfigDreamGroupByOutputType[P]>
            : GetScalarType<T[P], KidooConfigDreamGroupByOutputType[P]>
        }
      >
    >


  export type KidooConfigDreamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    colorR?: boolean
    colorG?: boolean
    colorB?: boolean
    brightness?: boolean
    allNight?: boolean
    effect?: boolean
    wakeupColorR?: boolean
    wakeupColorG?: boolean
    wakeupColorB?: boolean
    wakeupBrightness?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    bedtimeSchedules?: boolean | KidooConfigDream$bedtimeSchedulesArgs<ExtArgs>
    wakeupSchedules?: boolean | KidooConfigDream$wakeupSchedulesArgs<ExtArgs>
    _count?: boolean | KidooConfigDreamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDream"]>

  export type KidooConfigDreamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    colorR?: boolean
    colorG?: boolean
    colorB?: boolean
    brightness?: boolean
    allNight?: boolean
    effect?: boolean
    wakeupColorR?: boolean
    wakeupColorG?: boolean
    wakeupColorB?: boolean
    wakeupBrightness?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDream"]>

  export type KidooConfigDreamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooId?: boolean
    colorR?: boolean
    colorG?: boolean
    colorB?: boolean
    brightness?: boolean
    allNight?: boolean
    effect?: boolean
    wakeupColorR?: boolean
    wakeupColorG?: boolean
    wakeupColorB?: boolean
    wakeupBrightness?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDream"]>

  export type KidooConfigDreamSelectScalar = {
    id?: boolean
    kidooId?: boolean
    colorR?: boolean
    colorG?: boolean
    colorB?: boolean
    brightness?: boolean
    allNight?: boolean
    effect?: boolean
    wakeupColorR?: boolean
    wakeupColorG?: boolean
    wakeupColorB?: boolean
    wakeupBrightness?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KidooConfigDreamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kidooId" | "colorR" | "colorG" | "colorB" | "brightness" | "allNight" | "effect" | "wakeupColorR" | "wakeupColorG" | "wakeupColorB" | "wakeupBrightness" | "createdAt" | "updatedAt", ExtArgs["result"]["kidooConfigDream"]>
  export type KidooConfigDreamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
    bedtimeSchedules?: boolean | KidooConfigDream$bedtimeSchedulesArgs<ExtArgs>
    wakeupSchedules?: boolean | KidooConfigDream$wakeupSchedulesArgs<ExtArgs>
    _count?: boolean | KidooConfigDreamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidoo?: boolean | KidooDefaultArgs<ExtArgs>
  }

  export type $KidooConfigDreamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KidooConfigDream"
    objects: {
      kidoo: Prisma.$KidooPayload<ExtArgs>
      bedtimeSchedules: Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>[]
      wakeupSchedules: Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kidooId: string
      colorR: number | null
      colorG: number | null
      colorB: number | null
      brightness: number | null
      allNight: boolean
      effect: string | null
      wakeupColorR: number | null
      wakeupColorG: number | null
      wakeupColorB: number | null
      wakeupBrightness: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kidooConfigDream"]>
    composites: {}
  }

  type KidooConfigDreamGetPayload<S extends boolean | null | undefined | KidooConfigDreamDefaultArgs> = $Result.GetResult<Prisma.$KidooConfigDreamPayload, S>

  type KidooConfigDreamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KidooConfigDreamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KidooConfigDreamCountAggregateInputType | true
    }

  export interface KidooConfigDreamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KidooConfigDream'], meta: { name: 'KidooConfigDream' } }
    /**
     * Find zero or one KidooConfigDream that matches the filter.
     * @param {KidooConfigDreamFindUniqueArgs} args - Arguments to find a KidooConfigDream
     * @example
     * // Get one KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KidooConfigDreamFindUniqueArgs>(args: SelectSubset<T, KidooConfigDreamFindUniqueArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KidooConfigDream that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KidooConfigDreamFindUniqueOrThrowArgs} args - Arguments to find a KidooConfigDream
     * @example
     * // Get one KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KidooConfigDreamFindUniqueOrThrowArgs>(args: SelectSubset<T, KidooConfigDreamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDream that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamFindFirstArgs} args - Arguments to find a KidooConfigDream
     * @example
     * // Get one KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KidooConfigDreamFindFirstArgs>(args?: SelectSubset<T, KidooConfigDreamFindFirstArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDream that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamFindFirstOrThrowArgs} args - Arguments to find a KidooConfigDream
     * @example
     * // Get one KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KidooConfigDreamFindFirstOrThrowArgs>(args?: SelectSubset<T, KidooConfigDreamFindFirstOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KidooConfigDreams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KidooConfigDreams
     * const kidooConfigDreams = await prisma.kidooConfigDream.findMany()
     * 
     * // Get first 10 KidooConfigDreams
     * const kidooConfigDreams = await prisma.kidooConfigDream.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kidooConfigDreamWithIdOnly = await prisma.kidooConfigDream.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KidooConfigDreamFindManyArgs>(args?: SelectSubset<T, KidooConfigDreamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KidooConfigDream.
     * @param {KidooConfigDreamCreateArgs} args - Arguments to create a KidooConfigDream.
     * @example
     * // Create one KidooConfigDream
     * const KidooConfigDream = await prisma.kidooConfigDream.create({
     *   data: {
     *     // ... data to create a KidooConfigDream
     *   }
     * })
     * 
     */
    create<T extends KidooConfigDreamCreateArgs>(args: SelectSubset<T, KidooConfigDreamCreateArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KidooConfigDreams.
     * @param {KidooConfigDreamCreateManyArgs} args - Arguments to create many KidooConfigDreams.
     * @example
     * // Create many KidooConfigDreams
     * const kidooConfigDream = await prisma.kidooConfigDream.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KidooConfigDreamCreateManyArgs>(args?: SelectSubset<T, KidooConfigDreamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KidooConfigDreams and returns the data saved in the database.
     * @param {KidooConfigDreamCreateManyAndReturnArgs} args - Arguments to create many KidooConfigDreams.
     * @example
     * // Create many KidooConfigDreams
     * const kidooConfigDream = await prisma.kidooConfigDream.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KidooConfigDreams and only return the `id`
     * const kidooConfigDreamWithIdOnly = await prisma.kidooConfigDream.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KidooConfigDreamCreateManyAndReturnArgs>(args?: SelectSubset<T, KidooConfigDreamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KidooConfigDream.
     * @param {KidooConfigDreamDeleteArgs} args - Arguments to delete one KidooConfigDream.
     * @example
     * // Delete one KidooConfigDream
     * const KidooConfigDream = await prisma.kidooConfigDream.delete({
     *   where: {
     *     // ... filter to delete one KidooConfigDream
     *   }
     * })
     * 
     */
    delete<T extends KidooConfigDreamDeleteArgs>(args: SelectSubset<T, KidooConfigDreamDeleteArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KidooConfigDream.
     * @param {KidooConfigDreamUpdateArgs} args - Arguments to update one KidooConfigDream.
     * @example
     * // Update one KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KidooConfigDreamUpdateArgs>(args: SelectSubset<T, KidooConfigDreamUpdateArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KidooConfigDreams.
     * @param {KidooConfigDreamDeleteManyArgs} args - Arguments to filter KidooConfigDreams to delete.
     * @example
     * // Delete a few KidooConfigDreams
     * const { count } = await prisma.kidooConfigDream.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KidooConfigDreamDeleteManyArgs>(args?: SelectSubset<T, KidooConfigDreamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KidooConfigDreams
     * const kidooConfigDream = await prisma.kidooConfigDream.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KidooConfigDreamUpdateManyArgs>(args: SelectSubset<T, KidooConfigDreamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreams and returns the data updated in the database.
     * @param {KidooConfigDreamUpdateManyAndReturnArgs} args - Arguments to update many KidooConfigDreams.
     * @example
     * // Update many KidooConfigDreams
     * const kidooConfigDream = await prisma.kidooConfigDream.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KidooConfigDreams and only return the `id`
     * const kidooConfigDreamWithIdOnly = await prisma.kidooConfigDream.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KidooConfigDreamUpdateManyAndReturnArgs>(args: SelectSubset<T, KidooConfigDreamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KidooConfigDream.
     * @param {KidooConfigDreamUpsertArgs} args - Arguments to update or create a KidooConfigDream.
     * @example
     * // Update or create a KidooConfigDream
     * const kidooConfigDream = await prisma.kidooConfigDream.upsert({
     *   create: {
     *     // ... data to create a KidooConfigDream
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KidooConfigDream we want to update
     *   }
     * })
     */
    upsert<T extends KidooConfigDreamUpsertArgs>(args: SelectSubset<T, KidooConfigDreamUpsertArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KidooConfigDreams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamCountArgs} args - Arguments to filter KidooConfigDreams to count.
     * @example
     * // Count the number of KidooConfigDreams
     * const count = await prisma.kidooConfigDream.count({
     *   where: {
     *     // ... the filter for the KidooConfigDreams we want to count
     *   }
     * })
    **/
    count<T extends KidooConfigDreamCountArgs>(
      args?: Subset<T, KidooConfigDreamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KidooConfigDreamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KidooConfigDream.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KidooConfigDreamAggregateArgs>(args: Subset<T, KidooConfigDreamAggregateArgs>): Prisma.PrismaPromise<GetKidooConfigDreamAggregateType<T>>

    /**
     * Group by KidooConfigDream.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KidooConfigDreamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KidooConfigDreamGroupByArgs['orderBy'] }
        : { orderBy?: KidooConfigDreamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KidooConfigDreamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKidooConfigDreamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KidooConfigDream model
   */
  readonly fields: KidooConfigDreamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KidooConfigDream.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KidooConfigDreamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kidoo<T extends KidooDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KidooDefaultArgs<ExtArgs>>): Prisma__KidooClient<$Result.GetResult<Prisma.$KidooPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bedtimeSchedules<T extends KidooConfigDream$bedtimeSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, KidooConfigDream$bedtimeSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wakeupSchedules<T extends KidooConfigDream$wakeupSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, KidooConfigDream$wakeupSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KidooConfigDream model
   */
  interface KidooConfigDreamFieldRefs {
    readonly id: FieldRef<"KidooConfigDream", 'String'>
    readonly kidooId: FieldRef<"KidooConfigDream", 'String'>
    readonly colorR: FieldRef<"KidooConfigDream", 'Int'>
    readonly colorG: FieldRef<"KidooConfigDream", 'Int'>
    readonly colorB: FieldRef<"KidooConfigDream", 'Int'>
    readonly brightness: FieldRef<"KidooConfigDream", 'Int'>
    readonly allNight: FieldRef<"KidooConfigDream", 'Boolean'>
    readonly effect: FieldRef<"KidooConfigDream", 'String'>
    readonly wakeupColorR: FieldRef<"KidooConfigDream", 'Int'>
    readonly wakeupColorG: FieldRef<"KidooConfigDream", 'Int'>
    readonly wakeupColorB: FieldRef<"KidooConfigDream", 'Int'>
    readonly wakeupBrightness: FieldRef<"KidooConfigDream", 'Int'>
    readonly createdAt: FieldRef<"KidooConfigDream", 'DateTime'>
    readonly updatedAt: FieldRef<"KidooConfigDream", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KidooConfigDream findUnique
   */
  export type KidooConfigDreamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDream to fetch.
     */
    where: KidooConfigDreamWhereUniqueInput
  }

  /**
   * KidooConfigDream findUniqueOrThrow
   */
  export type KidooConfigDreamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDream to fetch.
     */
    where: KidooConfigDreamWhereUniqueInput
  }

  /**
   * KidooConfigDream findFirst
   */
  export type KidooConfigDreamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDream to fetch.
     */
    where?: KidooConfigDreamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreams to fetch.
     */
    orderBy?: KidooConfigDreamOrderByWithRelationInput | KidooConfigDreamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreams.
     */
    cursor?: KidooConfigDreamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreams.
     */
    distinct?: KidooConfigDreamScalarFieldEnum | KidooConfigDreamScalarFieldEnum[]
  }

  /**
   * KidooConfigDream findFirstOrThrow
   */
  export type KidooConfigDreamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDream to fetch.
     */
    where?: KidooConfigDreamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreams to fetch.
     */
    orderBy?: KidooConfigDreamOrderByWithRelationInput | KidooConfigDreamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreams.
     */
    cursor?: KidooConfigDreamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreams.
     */
    distinct?: KidooConfigDreamScalarFieldEnum | KidooConfigDreamScalarFieldEnum[]
  }

  /**
   * KidooConfigDream findMany
   */
  export type KidooConfigDreamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreams to fetch.
     */
    where?: KidooConfigDreamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreams to fetch.
     */
    orderBy?: KidooConfigDreamOrderByWithRelationInput | KidooConfigDreamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KidooConfigDreams.
     */
    cursor?: KidooConfigDreamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreams.
     */
    skip?: number
    distinct?: KidooConfigDreamScalarFieldEnum | KidooConfigDreamScalarFieldEnum[]
  }

  /**
   * KidooConfigDream create
   */
  export type KidooConfigDreamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * The data needed to create a KidooConfigDream.
     */
    data: XOR<KidooConfigDreamCreateInput, KidooConfigDreamUncheckedCreateInput>
  }

  /**
   * KidooConfigDream createMany
   */
  export type KidooConfigDreamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KidooConfigDreams.
     */
    data: KidooConfigDreamCreateManyInput | KidooConfigDreamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KidooConfigDream createManyAndReturn
   */
  export type KidooConfigDreamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * The data used to create many KidooConfigDreams.
     */
    data: KidooConfigDreamCreateManyInput | KidooConfigDreamCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDream update
   */
  export type KidooConfigDreamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * The data needed to update a KidooConfigDream.
     */
    data: XOR<KidooConfigDreamUpdateInput, KidooConfigDreamUncheckedUpdateInput>
    /**
     * Choose, which KidooConfigDream to update.
     */
    where: KidooConfigDreamWhereUniqueInput
  }

  /**
   * KidooConfigDream updateMany
   */
  export type KidooConfigDreamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KidooConfigDreams.
     */
    data: XOR<KidooConfigDreamUpdateManyMutationInput, KidooConfigDreamUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreams to update
     */
    where?: KidooConfigDreamWhereInput
    /**
     * Limit how many KidooConfigDreams to update.
     */
    limit?: number
  }

  /**
   * KidooConfigDream updateManyAndReturn
   */
  export type KidooConfigDreamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * The data used to update KidooConfigDreams.
     */
    data: XOR<KidooConfigDreamUpdateManyMutationInput, KidooConfigDreamUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreams to update
     */
    where?: KidooConfigDreamWhereInput
    /**
     * Limit how many KidooConfigDreams to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDream upsert
   */
  export type KidooConfigDreamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * The filter to search for the KidooConfigDream to update in case it exists.
     */
    where: KidooConfigDreamWhereUniqueInput
    /**
     * In case the KidooConfigDream found by the `where` argument doesn't exist, create a new KidooConfigDream with this data.
     */
    create: XOR<KidooConfigDreamCreateInput, KidooConfigDreamUncheckedCreateInput>
    /**
     * In case the KidooConfigDream was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KidooConfigDreamUpdateInput, KidooConfigDreamUncheckedUpdateInput>
  }

  /**
   * KidooConfigDream delete
   */
  export type KidooConfigDreamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
    /**
     * Filter which KidooConfigDream to delete.
     */
    where: KidooConfigDreamWhereUniqueInput
  }

  /**
   * KidooConfigDream deleteMany
   */
  export type KidooConfigDreamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDreams to delete
     */
    where?: KidooConfigDreamWhereInput
    /**
     * Limit how many KidooConfigDreams to delete.
     */
    limit?: number
  }

  /**
   * KidooConfigDream.bedtimeSchedules
   */
  export type KidooConfigDream$bedtimeSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithRelationInput | KidooConfigDreamBedtimeScheduleOrderByWithRelationInput[]
    cursor?: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KidooConfigDreamBedtimeScheduleScalarFieldEnum | KidooConfigDreamBedtimeScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDream.wakeupSchedules
   */
  export type KidooConfigDream$wakeupSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    where?: KidooConfigDreamWakeupScheduleWhereInput
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithRelationInput | KidooConfigDreamWakeupScheduleOrderByWithRelationInput[]
    cursor?: KidooConfigDreamWakeupScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KidooConfigDreamWakeupScheduleScalarFieldEnum | KidooConfigDreamWakeupScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDream without action
   */
  export type KidooConfigDreamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDream
     */
    select?: KidooConfigDreamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDream
     */
    omit?: KidooConfigDreamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamInclude<ExtArgs> | null
  }


  /**
   * Model KidooConfigDreamBedtimeSchedule
   */

  export type AggregateKidooConfigDreamBedtimeSchedule = {
    _count: KidooConfigDreamBedtimeScheduleCountAggregateOutputType | null
    _avg: KidooConfigDreamBedtimeScheduleAvgAggregateOutputType | null
    _sum: KidooConfigDreamBedtimeScheduleSumAggregateOutputType | null
    _min: KidooConfigDreamBedtimeScheduleMinAggregateOutputType | null
    _max: KidooConfigDreamBedtimeScheduleMaxAggregateOutputType | null
  }

  export type KidooConfigDreamBedtimeScheduleAvgAggregateOutputType = {
    hour: number | null
    minute: number | null
  }

  export type KidooConfigDreamBedtimeScheduleSumAggregateOutputType = {
    hour: number | null
    minute: number | null
  }

  export type KidooConfigDreamBedtimeScheduleMinAggregateOutputType = {
    id: string | null
    kidooConfigDreamId: string | null
    weekday: string | null
    hour: number | null
    minute: number | null
    activated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamBedtimeScheduleMaxAggregateOutputType = {
    id: string | null
    kidooConfigDreamId: string | null
    weekday: string | null
    hour: number | null
    minute: number | null
    activated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamBedtimeScheduleCountAggregateOutputType = {
    id: number
    kidooConfigDreamId: number
    weekday: number
    hour: number
    minute: number
    activated: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KidooConfigDreamBedtimeScheduleAvgAggregateInputType = {
    hour?: true
    minute?: true
  }

  export type KidooConfigDreamBedtimeScheduleSumAggregateInputType = {
    hour?: true
    minute?: true
  }

  export type KidooConfigDreamBedtimeScheduleMinAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamBedtimeScheduleMaxAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamBedtimeScheduleCountAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KidooConfigDreamBedtimeScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDreamBedtimeSchedule to aggregate.
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamBedtimeSchedules to fetch.
     */
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithRelationInput | KidooConfigDreamBedtimeScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamBedtimeSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamBedtimeSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KidooConfigDreamBedtimeSchedules
    **/
    _count?: true | KidooConfigDreamBedtimeScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KidooConfigDreamBedtimeScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KidooConfigDreamBedtimeScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KidooConfigDreamBedtimeScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KidooConfigDreamBedtimeScheduleMaxAggregateInputType
  }

  export type GetKidooConfigDreamBedtimeScheduleAggregateType<T extends KidooConfigDreamBedtimeScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateKidooConfigDreamBedtimeSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKidooConfigDreamBedtimeSchedule[P]>
      : GetScalarType<T[P], AggregateKidooConfigDreamBedtimeSchedule[P]>
  }




  export type KidooConfigDreamBedtimeScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithAggregationInput | KidooConfigDreamBedtimeScheduleOrderByWithAggregationInput[]
    by: KidooConfigDreamBedtimeScheduleScalarFieldEnum[] | KidooConfigDreamBedtimeScheduleScalarFieldEnum
    having?: KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KidooConfigDreamBedtimeScheduleCountAggregateInputType | true
    _avg?: KidooConfigDreamBedtimeScheduleAvgAggregateInputType
    _sum?: KidooConfigDreamBedtimeScheduleSumAggregateInputType
    _min?: KidooConfigDreamBedtimeScheduleMinAggregateInputType
    _max?: KidooConfigDreamBedtimeScheduleMaxAggregateInputType
  }

  export type KidooConfigDreamBedtimeScheduleGroupByOutputType = {
    id: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated: boolean
    createdAt: Date
    updatedAt: Date
    _count: KidooConfigDreamBedtimeScheduleCountAggregateOutputType | null
    _avg: KidooConfigDreamBedtimeScheduleAvgAggregateOutputType | null
    _sum: KidooConfigDreamBedtimeScheduleSumAggregateOutputType | null
    _min: KidooConfigDreamBedtimeScheduleMinAggregateOutputType | null
    _max: KidooConfigDreamBedtimeScheduleMaxAggregateOutputType | null
  }

  type GetKidooConfigDreamBedtimeScheduleGroupByPayload<T extends KidooConfigDreamBedtimeScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KidooConfigDreamBedtimeScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KidooConfigDreamBedtimeScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KidooConfigDreamBedtimeScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], KidooConfigDreamBedtimeScheduleGroupByOutputType[P]>
        }
      >
    >


  export type KidooConfigDreamBedtimeScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamBedtimeSchedule"]>

  export type KidooConfigDreamBedtimeScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamBedtimeSchedule"]>

  export type KidooConfigDreamBedtimeScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamBedtimeSchedule"]>

  export type KidooConfigDreamBedtimeScheduleSelectScalar = {
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KidooConfigDreamBedtimeScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kidooConfigDreamId" | "weekday" | "hour" | "minute" | "activated" | "createdAt" | "updatedAt", ExtArgs["result"]["kidooConfigDreamBedtimeSchedule"]>
  export type KidooConfigDreamBedtimeScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamBedtimeScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamBedtimeScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }

  export type $KidooConfigDreamBedtimeSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KidooConfigDreamBedtimeSchedule"
    objects: {
      kidooConfigDream: Prisma.$KidooConfigDreamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kidooConfigDreamId: string
      weekday: string
      hour: number
      minute: number
      activated: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kidooConfigDreamBedtimeSchedule"]>
    composites: {}
  }

  type KidooConfigDreamBedtimeScheduleGetPayload<S extends boolean | null | undefined | KidooConfigDreamBedtimeScheduleDefaultArgs> = $Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload, S>

  type KidooConfigDreamBedtimeScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KidooConfigDreamBedtimeScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KidooConfigDreamBedtimeScheduleCountAggregateInputType | true
    }

  export interface KidooConfigDreamBedtimeScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KidooConfigDreamBedtimeSchedule'], meta: { name: 'KidooConfigDreamBedtimeSchedule' } }
    /**
     * Find zero or one KidooConfigDreamBedtimeSchedule that matches the filter.
     * @param {KidooConfigDreamBedtimeScheduleFindUniqueArgs} args - Arguments to find a KidooConfigDreamBedtimeSchedule
     * @example
     * // Get one KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KidooConfigDreamBedtimeScheduleFindUniqueArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleFindUniqueArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KidooConfigDreamBedtimeSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KidooConfigDreamBedtimeScheduleFindUniqueOrThrowArgs} args - Arguments to find a KidooConfigDreamBedtimeSchedule
     * @example
     * // Get one KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KidooConfigDreamBedtimeScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDreamBedtimeSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleFindFirstArgs} args - Arguments to find a KidooConfigDreamBedtimeSchedule
     * @example
     * // Get one KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KidooConfigDreamBedtimeScheduleFindFirstArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleFindFirstArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDreamBedtimeSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleFindFirstOrThrowArgs} args - Arguments to find a KidooConfigDreamBedtimeSchedule
     * @example
     * // Get one KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KidooConfigDreamBedtimeScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KidooConfigDreamBedtimeSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedules = await prisma.kidooConfigDreamBedtimeSchedule.findMany()
     * 
     * // Get first 10 KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedules = await prisma.kidooConfigDreamBedtimeSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kidooConfigDreamBedtimeScheduleWithIdOnly = await prisma.kidooConfigDreamBedtimeSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KidooConfigDreamBedtimeScheduleFindManyArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KidooConfigDreamBedtimeSchedule.
     * @param {KidooConfigDreamBedtimeScheduleCreateArgs} args - Arguments to create a KidooConfigDreamBedtimeSchedule.
     * @example
     * // Create one KidooConfigDreamBedtimeSchedule
     * const KidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.create({
     *   data: {
     *     // ... data to create a KidooConfigDreamBedtimeSchedule
     *   }
     * })
     * 
     */
    create<T extends KidooConfigDreamBedtimeScheduleCreateArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleCreateArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KidooConfigDreamBedtimeSchedules.
     * @param {KidooConfigDreamBedtimeScheduleCreateManyArgs} args - Arguments to create many KidooConfigDreamBedtimeSchedules.
     * @example
     * // Create many KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KidooConfigDreamBedtimeScheduleCreateManyArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KidooConfigDreamBedtimeSchedules and returns the data saved in the database.
     * @param {KidooConfigDreamBedtimeScheduleCreateManyAndReturnArgs} args - Arguments to create many KidooConfigDreamBedtimeSchedules.
     * @example
     * // Create many KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KidooConfigDreamBedtimeSchedules and only return the `id`
     * const kidooConfigDreamBedtimeScheduleWithIdOnly = await prisma.kidooConfigDreamBedtimeSchedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KidooConfigDreamBedtimeScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KidooConfigDreamBedtimeSchedule.
     * @param {KidooConfigDreamBedtimeScheduleDeleteArgs} args - Arguments to delete one KidooConfigDreamBedtimeSchedule.
     * @example
     * // Delete one KidooConfigDreamBedtimeSchedule
     * const KidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.delete({
     *   where: {
     *     // ... filter to delete one KidooConfigDreamBedtimeSchedule
     *   }
     * })
     * 
     */
    delete<T extends KidooConfigDreamBedtimeScheduleDeleteArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleDeleteArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KidooConfigDreamBedtimeSchedule.
     * @param {KidooConfigDreamBedtimeScheduleUpdateArgs} args - Arguments to update one KidooConfigDreamBedtimeSchedule.
     * @example
     * // Update one KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KidooConfigDreamBedtimeScheduleUpdateArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleUpdateArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KidooConfigDreamBedtimeSchedules.
     * @param {KidooConfigDreamBedtimeScheduleDeleteManyArgs} args - Arguments to filter KidooConfigDreamBedtimeSchedules to delete.
     * @example
     * // Delete a few KidooConfigDreamBedtimeSchedules
     * const { count } = await prisma.kidooConfigDreamBedtimeSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KidooConfigDreamBedtimeScheduleDeleteManyArgs>(args?: SelectSubset<T, KidooConfigDreamBedtimeScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreamBedtimeSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KidooConfigDreamBedtimeScheduleUpdateManyArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreamBedtimeSchedules and returns the data updated in the database.
     * @param {KidooConfigDreamBedtimeScheduleUpdateManyAndReturnArgs} args - Arguments to update many KidooConfigDreamBedtimeSchedules.
     * @example
     * // Update many KidooConfigDreamBedtimeSchedules
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KidooConfigDreamBedtimeSchedules and only return the `id`
     * const kidooConfigDreamBedtimeScheduleWithIdOnly = await prisma.kidooConfigDreamBedtimeSchedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KidooConfigDreamBedtimeScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KidooConfigDreamBedtimeSchedule.
     * @param {KidooConfigDreamBedtimeScheduleUpsertArgs} args - Arguments to update or create a KidooConfigDreamBedtimeSchedule.
     * @example
     * // Update or create a KidooConfigDreamBedtimeSchedule
     * const kidooConfigDreamBedtimeSchedule = await prisma.kidooConfigDreamBedtimeSchedule.upsert({
     *   create: {
     *     // ... data to create a KidooConfigDreamBedtimeSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KidooConfigDreamBedtimeSchedule we want to update
     *   }
     * })
     */
    upsert<T extends KidooConfigDreamBedtimeScheduleUpsertArgs>(args: SelectSubset<T, KidooConfigDreamBedtimeScheduleUpsertArgs<ExtArgs>>): Prisma__KidooConfigDreamBedtimeScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamBedtimeSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KidooConfigDreamBedtimeSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleCountArgs} args - Arguments to filter KidooConfigDreamBedtimeSchedules to count.
     * @example
     * // Count the number of KidooConfigDreamBedtimeSchedules
     * const count = await prisma.kidooConfigDreamBedtimeSchedule.count({
     *   where: {
     *     // ... the filter for the KidooConfigDreamBedtimeSchedules we want to count
     *   }
     * })
    **/
    count<T extends KidooConfigDreamBedtimeScheduleCountArgs>(
      args?: Subset<T, KidooConfigDreamBedtimeScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KidooConfigDreamBedtimeScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KidooConfigDreamBedtimeSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KidooConfigDreamBedtimeScheduleAggregateArgs>(args: Subset<T, KidooConfigDreamBedtimeScheduleAggregateArgs>): Prisma.PrismaPromise<GetKidooConfigDreamBedtimeScheduleAggregateType<T>>

    /**
     * Group by KidooConfigDreamBedtimeSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamBedtimeScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KidooConfigDreamBedtimeScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KidooConfigDreamBedtimeScheduleGroupByArgs['orderBy'] }
        : { orderBy?: KidooConfigDreamBedtimeScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KidooConfigDreamBedtimeScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKidooConfigDreamBedtimeScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KidooConfigDreamBedtimeSchedule model
   */
  readonly fields: KidooConfigDreamBedtimeScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KidooConfigDreamBedtimeSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KidooConfigDreamBedtimeScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kidooConfigDream<T extends KidooConfigDreamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KidooConfigDreamDefaultArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KidooConfigDreamBedtimeSchedule model
   */
  interface KidooConfigDreamBedtimeScheduleFieldRefs {
    readonly id: FieldRef<"KidooConfigDreamBedtimeSchedule", 'String'>
    readonly kidooConfigDreamId: FieldRef<"KidooConfigDreamBedtimeSchedule", 'String'>
    readonly weekday: FieldRef<"KidooConfigDreamBedtimeSchedule", 'String'>
    readonly hour: FieldRef<"KidooConfigDreamBedtimeSchedule", 'Int'>
    readonly minute: FieldRef<"KidooConfigDreamBedtimeSchedule", 'Int'>
    readonly activated: FieldRef<"KidooConfigDreamBedtimeSchedule", 'Boolean'>
    readonly createdAt: FieldRef<"KidooConfigDreamBedtimeSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"KidooConfigDreamBedtimeSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KidooConfigDreamBedtimeSchedule findUnique
   */
  export type KidooConfigDreamBedtimeScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamBedtimeSchedule to fetch.
     */
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamBedtimeSchedule findUniqueOrThrow
   */
  export type KidooConfigDreamBedtimeScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamBedtimeSchedule to fetch.
     */
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamBedtimeSchedule findFirst
   */
  export type KidooConfigDreamBedtimeScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamBedtimeSchedule to fetch.
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamBedtimeSchedules to fetch.
     */
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithRelationInput | KidooConfigDreamBedtimeScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreamBedtimeSchedules.
     */
    cursor?: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamBedtimeSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamBedtimeSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreamBedtimeSchedules.
     */
    distinct?: KidooConfigDreamBedtimeScheduleScalarFieldEnum | KidooConfigDreamBedtimeScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamBedtimeSchedule findFirstOrThrow
   */
  export type KidooConfigDreamBedtimeScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamBedtimeSchedule to fetch.
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamBedtimeSchedules to fetch.
     */
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithRelationInput | KidooConfigDreamBedtimeScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreamBedtimeSchedules.
     */
    cursor?: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamBedtimeSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamBedtimeSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreamBedtimeSchedules.
     */
    distinct?: KidooConfigDreamBedtimeScheduleScalarFieldEnum | KidooConfigDreamBedtimeScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamBedtimeSchedule findMany
   */
  export type KidooConfigDreamBedtimeScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamBedtimeSchedules to fetch.
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamBedtimeSchedules to fetch.
     */
    orderBy?: KidooConfigDreamBedtimeScheduleOrderByWithRelationInput | KidooConfigDreamBedtimeScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KidooConfigDreamBedtimeSchedules.
     */
    cursor?: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamBedtimeSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamBedtimeSchedules.
     */
    skip?: number
    distinct?: KidooConfigDreamBedtimeScheduleScalarFieldEnum | KidooConfigDreamBedtimeScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamBedtimeSchedule create
   */
  export type KidooConfigDreamBedtimeScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a KidooConfigDreamBedtimeSchedule.
     */
    data: XOR<KidooConfigDreamBedtimeScheduleCreateInput, KidooConfigDreamBedtimeScheduleUncheckedCreateInput>
  }

  /**
   * KidooConfigDreamBedtimeSchedule createMany
   */
  export type KidooConfigDreamBedtimeScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KidooConfigDreamBedtimeSchedules.
     */
    data: KidooConfigDreamBedtimeScheduleCreateManyInput | KidooConfigDreamBedtimeScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KidooConfigDreamBedtimeSchedule createManyAndReturn
   */
  export type KidooConfigDreamBedtimeScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many KidooConfigDreamBedtimeSchedules.
     */
    data: KidooConfigDreamBedtimeScheduleCreateManyInput | KidooConfigDreamBedtimeScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDreamBedtimeSchedule update
   */
  export type KidooConfigDreamBedtimeScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a KidooConfigDreamBedtimeSchedule.
     */
    data: XOR<KidooConfigDreamBedtimeScheduleUpdateInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateInput>
    /**
     * Choose, which KidooConfigDreamBedtimeSchedule to update.
     */
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamBedtimeSchedule updateMany
   */
  export type KidooConfigDreamBedtimeScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KidooConfigDreamBedtimeSchedules.
     */
    data: XOR<KidooConfigDreamBedtimeScheduleUpdateManyMutationInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreamBedtimeSchedules to update
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamBedtimeSchedules to update.
     */
    limit?: number
  }

  /**
   * KidooConfigDreamBedtimeSchedule updateManyAndReturn
   */
  export type KidooConfigDreamBedtimeScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * The data used to update KidooConfigDreamBedtimeSchedules.
     */
    data: XOR<KidooConfigDreamBedtimeScheduleUpdateManyMutationInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreamBedtimeSchedules to update
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamBedtimeSchedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDreamBedtimeSchedule upsert
   */
  export type KidooConfigDreamBedtimeScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the KidooConfigDreamBedtimeSchedule to update in case it exists.
     */
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    /**
     * In case the KidooConfigDreamBedtimeSchedule found by the `where` argument doesn't exist, create a new KidooConfigDreamBedtimeSchedule with this data.
     */
    create: XOR<KidooConfigDreamBedtimeScheduleCreateInput, KidooConfigDreamBedtimeScheduleUncheckedCreateInput>
    /**
     * In case the KidooConfigDreamBedtimeSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KidooConfigDreamBedtimeScheduleUpdateInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateInput>
  }

  /**
   * KidooConfigDreamBedtimeSchedule delete
   */
  export type KidooConfigDreamBedtimeScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
    /**
     * Filter which KidooConfigDreamBedtimeSchedule to delete.
     */
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamBedtimeSchedule deleteMany
   */
  export type KidooConfigDreamBedtimeScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDreamBedtimeSchedules to delete
     */
    where?: KidooConfigDreamBedtimeScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamBedtimeSchedules to delete.
     */
    limit?: number
  }

  /**
   * KidooConfigDreamBedtimeSchedule without action
   */
  export type KidooConfigDreamBedtimeScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamBedtimeSchedule
     */
    select?: KidooConfigDreamBedtimeScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamBedtimeSchedule
     */
    omit?: KidooConfigDreamBedtimeScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamBedtimeScheduleInclude<ExtArgs> | null
  }


  /**
   * Model KidooConfigDreamWakeupSchedule
   */

  export type AggregateKidooConfigDreamWakeupSchedule = {
    _count: KidooConfigDreamWakeupScheduleCountAggregateOutputType | null
    _avg: KidooConfigDreamWakeupScheduleAvgAggregateOutputType | null
    _sum: KidooConfigDreamWakeupScheduleSumAggregateOutputType | null
    _min: KidooConfigDreamWakeupScheduleMinAggregateOutputType | null
    _max: KidooConfigDreamWakeupScheduleMaxAggregateOutputType | null
  }

  export type KidooConfigDreamWakeupScheduleAvgAggregateOutputType = {
    hour: number | null
    minute: number | null
  }

  export type KidooConfigDreamWakeupScheduleSumAggregateOutputType = {
    hour: number | null
    minute: number | null
  }

  export type KidooConfigDreamWakeupScheduleMinAggregateOutputType = {
    id: string | null
    kidooConfigDreamId: string | null
    weekday: string | null
    hour: number | null
    minute: number | null
    activated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamWakeupScheduleMaxAggregateOutputType = {
    id: string | null
    kidooConfigDreamId: string | null
    weekday: string | null
    hour: number | null
    minute: number | null
    activated: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KidooConfigDreamWakeupScheduleCountAggregateOutputType = {
    id: number
    kidooConfigDreamId: number
    weekday: number
    hour: number
    minute: number
    activated: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KidooConfigDreamWakeupScheduleAvgAggregateInputType = {
    hour?: true
    minute?: true
  }

  export type KidooConfigDreamWakeupScheduleSumAggregateInputType = {
    hour?: true
    minute?: true
  }

  export type KidooConfigDreamWakeupScheduleMinAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamWakeupScheduleMaxAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KidooConfigDreamWakeupScheduleCountAggregateInputType = {
    id?: true
    kidooConfigDreamId?: true
    weekday?: true
    hour?: true
    minute?: true
    activated?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KidooConfigDreamWakeupScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDreamWakeupSchedule to aggregate.
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamWakeupSchedules to fetch.
     */
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithRelationInput | KidooConfigDreamWakeupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KidooConfigDreamWakeupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamWakeupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamWakeupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KidooConfigDreamWakeupSchedules
    **/
    _count?: true | KidooConfigDreamWakeupScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KidooConfigDreamWakeupScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KidooConfigDreamWakeupScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KidooConfigDreamWakeupScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KidooConfigDreamWakeupScheduleMaxAggregateInputType
  }

  export type GetKidooConfigDreamWakeupScheduleAggregateType<T extends KidooConfigDreamWakeupScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateKidooConfigDreamWakeupSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKidooConfigDreamWakeupSchedule[P]>
      : GetScalarType<T[P], AggregateKidooConfigDreamWakeupSchedule[P]>
  }




  export type KidooConfigDreamWakeupScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KidooConfigDreamWakeupScheduleWhereInput
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithAggregationInput | KidooConfigDreamWakeupScheduleOrderByWithAggregationInput[]
    by: KidooConfigDreamWakeupScheduleScalarFieldEnum[] | KidooConfigDreamWakeupScheduleScalarFieldEnum
    having?: KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KidooConfigDreamWakeupScheduleCountAggregateInputType | true
    _avg?: KidooConfigDreamWakeupScheduleAvgAggregateInputType
    _sum?: KidooConfigDreamWakeupScheduleSumAggregateInputType
    _min?: KidooConfigDreamWakeupScheduleMinAggregateInputType
    _max?: KidooConfigDreamWakeupScheduleMaxAggregateInputType
  }

  export type KidooConfigDreamWakeupScheduleGroupByOutputType = {
    id: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated: boolean
    createdAt: Date
    updatedAt: Date
    _count: KidooConfigDreamWakeupScheduleCountAggregateOutputType | null
    _avg: KidooConfigDreamWakeupScheduleAvgAggregateOutputType | null
    _sum: KidooConfigDreamWakeupScheduleSumAggregateOutputType | null
    _min: KidooConfigDreamWakeupScheduleMinAggregateOutputType | null
    _max: KidooConfigDreamWakeupScheduleMaxAggregateOutputType | null
  }

  type GetKidooConfigDreamWakeupScheduleGroupByPayload<T extends KidooConfigDreamWakeupScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KidooConfigDreamWakeupScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KidooConfigDreamWakeupScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KidooConfigDreamWakeupScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], KidooConfigDreamWakeupScheduleGroupByOutputType[P]>
        }
      >
    >


  export type KidooConfigDreamWakeupScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamWakeupSchedule"]>

  export type KidooConfigDreamWakeupScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamWakeupSchedule"]>

  export type KidooConfigDreamWakeupScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kidooConfigDreamWakeupSchedule"]>

  export type KidooConfigDreamWakeupScheduleSelectScalar = {
    id?: boolean
    kidooConfigDreamId?: boolean
    weekday?: boolean
    hour?: boolean
    minute?: boolean
    activated?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KidooConfigDreamWakeupScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kidooConfigDreamId" | "weekday" | "hour" | "minute" | "activated" | "createdAt" | "updatedAt", ExtArgs["result"]["kidooConfigDreamWakeupSchedule"]>
  export type KidooConfigDreamWakeupScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamWakeupScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }
  export type KidooConfigDreamWakeupScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kidooConfigDream?: boolean | KidooConfigDreamDefaultArgs<ExtArgs>
  }

  export type $KidooConfigDreamWakeupSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KidooConfigDreamWakeupSchedule"
    objects: {
      kidooConfigDream: Prisma.$KidooConfigDreamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kidooConfigDreamId: string
      weekday: string
      hour: number
      minute: number
      activated: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kidooConfigDreamWakeupSchedule"]>
    composites: {}
  }

  type KidooConfigDreamWakeupScheduleGetPayload<S extends boolean | null | undefined | KidooConfigDreamWakeupScheduleDefaultArgs> = $Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload, S>

  type KidooConfigDreamWakeupScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KidooConfigDreamWakeupScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KidooConfigDreamWakeupScheduleCountAggregateInputType | true
    }

  export interface KidooConfigDreamWakeupScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KidooConfigDreamWakeupSchedule'], meta: { name: 'KidooConfigDreamWakeupSchedule' } }
    /**
     * Find zero or one KidooConfigDreamWakeupSchedule that matches the filter.
     * @param {KidooConfigDreamWakeupScheduleFindUniqueArgs} args - Arguments to find a KidooConfigDreamWakeupSchedule
     * @example
     * // Get one KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KidooConfigDreamWakeupScheduleFindUniqueArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleFindUniqueArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KidooConfigDreamWakeupSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KidooConfigDreamWakeupScheduleFindUniqueOrThrowArgs} args - Arguments to find a KidooConfigDreamWakeupSchedule
     * @example
     * // Get one KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KidooConfigDreamWakeupScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDreamWakeupSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleFindFirstArgs} args - Arguments to find a KidooConfigDreamWakeupSchedule
     * @example
     * // Get one KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KidooConfigDreamWakeupScheduleFindFirstArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleFindFirstArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KidooConfigDreamWakeupSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleFindFirstOrThrowArgs} args - Arguments to find a KidooConfigDreamWakeupSchedule
     * @example
     * // Get one KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KidooConfigDreamWakeupScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KidooConfigDreamWakeupSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedules = await prisma.kidooConfigDreamWakeupSchedule.findMany()
     * 
     * // Get first 10 KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedules = await prisma.kidooConfigDreamWakeupSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kidooConfigDreamWakeupScheduleWithIdOnly = await prisma.kidooConfigDreamWakeupSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KidooConfigDreamWakeupScheduleFindManyArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KidooConfigDreamWakeupSchedule.
     * @param {KidooConfigDreamWakeupScheduleCreateArgs} args - Arguments to create a KidooConfigDreamWakeupSchedule.
     * @example
     * // Create one KidooConfigDreamWakeupSchedule
     * const KidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.create({
     *   data: {
     *     // ... data to create a KidooConfigDreamWakeupSchedule
     *   }
     * })
     * 
     */
    create<T extends KidooConfigDreamWakeupScheduleCreateArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleCreateArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KidooConfigDreamWakeupSchedules.
     * @param {KidooConfigDreamWakeupScheduleCreateManyArgs} args - Arguments to create many KidooConfigDreamWakeupSchedules.
     * @example
     * // Create many KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KidooConfigDreamWakeupScheduleCreateManyArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KidooConfigDreamWakeupSchedules and returns the data saved in the database.
     * @param {KidooConfigDreamWakeupScheduleCreateManyAndReturnArgs} args - Arguments to create many KidooConfigDreamWakeupSchedules.
     * @example
     * // Create many KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KidooConfigDreamWakeupSchedules and only return the `id`
     * const kidooConfigDreamWakeupScheduleWithIdOnly = await prisma.kidooConfigDreamWakeupSchedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KidooConfigDreamWakeupScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KidooConfigDreamWakeupSchedule.
     * @param {KidooConfigDreamWakeupScheduleDeleteArgs} args - Arguments to delete one KidooConfigDreamWakeupSchedule.
     * @example
     * // Delete one KidooConfigDreamWakeupSchedule
     * const KidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.delete({
     *   where: {
     *     // ... filter to delete one KidooConfigDreamWakeupSchedule
     *   }
     * })
     * 
     */
    delete<T extends KidooConfigDreamWakeupScheduleDeleteArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleDeleteArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KidooConfigDreamWakeupSchedule.
     * @param {KidooConfigDreamWakeupScheduleUpdateArgs} args - Arguments to update one KidooConfigDreamWakeupSchedule.
     * @example
     * // Update one KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KidooConfigDreamWakeupScheduleUpdateArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleUpdateArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KidooConfigDreamWakeupSchedules.
     * @param {KidooConfigDreamWakeupScheduleDeleteManyArgs} args - Arguments to filter KidooConfigDreamWakeupSchedules to delete.
     * @example
     * // Delete a few KidooConfigDreamWakeupSchedules
     * const { count } = await prisma.kidooConfigDreamWakeupSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KidooConfigDreamWakeupScheduleDeleteManyArgs>(args?: SelectSubset<T, KidooConfigDreamWakeupScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreamWakeupSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KidooConfigDreamWakeupScheduleUpdateManyArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KidooConfigDreamWakeupSchedules and returns the data updated in the database.
     * @param {KidooConfigDreamWakeupScheduleUpdateManyAndReturnArgs} args - Arguments to update many KidooConfigDreamWakeupSchedules.
     * @example
     * // Update many KidooConfigDreamWakeupSchedules
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KidooConfigDreamWakeupSchedules and only return the `id`
     * const kidooConfigDreamWakeupScheduleWithIdOnly = await prisma.kidooConfigDreamWakeupSchedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KidooConfigDreamWakeupScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KidooConfigDreamWakeupSchedule.
     * @param {KidooConfigDreamWakeupScheduleUpsertArgs} args - Arguments to update or create a KidooConfigDreamWakeupSchedule.
     * @example
     * // Update or create a KidooConfigDreamWakeupSchedule
     * const kidooConfigDreamWakeupSchedule = await prisma.kidooConfigDreamWakeupSchedule.upsert({
     *   create: {
     *     // ... data to create a KidooConfigDreamWakeupSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KidooConfigDreamWakeupSchedule we want to update
     *   }
     * })
     */
    upsert<T extends KidooConfigDreamWakeupScheduleUpsertArgs>(args: SelectSubset<T, KidooConfigDreamWakeupScheduleUpsertArgs<ExtArgs>>): Prisma__KidooConfigDreamWakeupScheduleClient<$Result.GetResult<Prisma.$KidooConfigDreamWakeupSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KidooConfigDreamWakeupSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleCountArgs} args - Arguments to filter KidooConfigDreamWakeupSchedules to count.
     * @example
     * // Count the number of KidooConfigDreamWakeupSchedules
     * const count = await prisma.kidooConfigDreamWakeupSchedule.count({
     *   where: {
     *     // ... the filter for the KidooConfigDreamWakeupSchedules we want to count
     *   }
     * })
    **/
    count<T extends KidooConfigDreamWakeupScheduleCountArgs>(
      args?: Subset<T, KidooConfigDreamWakeupScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KidooConfigDreamWakeupScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KidooConfigDreamWakeupSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KidooConfigDreamWakeupScheduleAggregateArgs>(args: Subset<T, KidooConfigDreamWakeupScheduleAggregateArgs>): Prisma.PrismaPromise<GetKidooConfigDreamWakeupScheduleAggregateType<T>>

    /**
     * Group by KidooConfigDreamWakeupSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KidooConfigDreamWakeupScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KidooConfigDreamWakeupScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KidooConfigDreamWakeupScheduleGroupByArgs['orderBy'] }
        : { orderBy?: KidooConfigDreamWakeupScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KidooConfigDreamWakeupScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKidooConfigDreamWakeupScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KidooConfigDreamWakeupSchedule model
   */
  readonly fields: KidooConfigDreamWakeupScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KidooConfigDreamWakeupSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KidooConfigDreamWakeupScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kidooConfigDream<T extends KidooConfigDreamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KidooConfigDreamDefaultArgs<ExtArgs>>): Prisma__KidooConfigDreamClient<$Result.GetResult<Prisma.$KidooConfigDreamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KidooConfigDreamWakeupSchedule model
   */
  interface KidooConfigDreamWakeupScheduleFieldRefs {
    readonly id: FieldRef<"KidooConfigDreamWakeupSchedule", 'String'>
    readonly kidooConfigDreamId: FieldRef<"KidooConfigDreamWakeupSchedule", 'String'>
    readonly weekday: FieldRef<"KidooConfigDreamWakeupSchedule", 'String'>
    readonly hour: FieldRef<"KidooConfigDreamWakeupSchedule", 'Int'>
    readonly minute: FieldRef<"KidooConfigDreamWakeupSchedule", 'Int'>
    readonly activated: FieldRef<"KidooConfigDreamWakeupSchedule", 'Boolean'>
    readonly createdAt: FieldRef<"KidooConfigDreamWakeupSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"KidooConfigDreamWakeupSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KidooConfigDreamWakeupSchedule findUnique
   */
  export type KidooConfigDreamWakeupScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamWakeupSchedule to fetch.
     */
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamWakeupSchedule findUniqueOrThrow
   */
  export type KidooConfigDreamWakeupScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamWakeupSchedule to fetch.
     */
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamWakeupSchedule findFirst
   */
  export type KidooConfigDreamWakeupScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamWakeupSchedule to fetch.
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamWakeupSchedules to fetch.
     */
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithRelationInput | KidooConfigDreamWakeupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreamWakeupSchedules.
     */
    cursor?: KidooConfigDreamWakeupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamWakeupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamWakeupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreamWakeupSchedules.
     */
    distinct?: KidooConfigDreamWakeupScheduleScalarFieldEnum | KidooConfigDreamWakeupScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamWakeupSchedule findFirstOrThrow
   */
  export type KidooConfigDreamWakeupScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamWakeupSchedule to fetch.
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamWakeupSchedules to fetch.
     */
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithRelationInput | KidooConfigDreamWakeupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KidooConfigDreamWakeupSchedules.
     */
    cursor?: KidooConfigDreamWakeupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamWakeupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamWakeupSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KidooConfigDreamWakeupSchedules.
     */
    distinct?: KidooConfigDreamWakeupScheduleScalarFieldEnum | KidooConfigDreamWakeupScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamWakeupSchedule findMany
   */
  export type KidooConfigDreamWakeupScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter, which KidooConfigDreamWakeupSchedules to fetch.
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KidooConfigDreamWakeupSchedules to fetch.
     */
    orderBy?: KidooConfigDreamWakeupScheduleOrderByWithRelationInput | KidooConfigDreamWakeupScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KidooConfigDreamWakeupSchedules.
     */
    cursor?: KidooConfigDreamWakeupScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KidooConfigDreamWakeupSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KidooConfigDreamWakeupSchedules.
     */
    skip?: number
    distinct?: KidooConfigDreamWakeupScheduleScalarFieldEnum | KidooConfigDreamWakeupScheduleScalarFieldEnum[]
  }

  /**
   * KidooConfigDreamWakeupSchedule create
   */
  export type KidooConfigDreamWakeupScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a KidooConfigDreamWakeupSchedule.
     */
    data: XOR<KidooConfigDreamWakeupScheduleCreateInput, KidooConfigDreamWakeupScheduleUncheckedCreateInput>
  }

  /**
   * KidooConfigDreamWakeupSchedule createMany
   */
  export type KidooConfigDreamWakeupScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KidooConfigDreamWakeupSchedules.
     */
    data: KidooConfigDreamWakeupScheduleCreateManyInput | KidooConfigDreamWakeupScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KidooConfigDreamWakeupSchedule createManyAndReturn
   */
  export type KidooConfigDreamWakeupScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many KidooConfigDreamWakeupSchedules.
     */
    data: KidooConfigDreamWakeupScheduleCreateManyInput | KidooConfigDreamWakeupScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDreamWakeupSchedule update
   */
  export type KidooConfigDreamWakeupScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a KidooConfigDreamWakeupSchedule.
     */
    data: XOR<KidooConfigDreamWakeupScheduleUpdateInput, KidooConfigDreamWakeupScheduleUncheckedUpdateInput>
    /**
     * Choose, which KidooConfigDreamWakeupSchedule to update.
     */
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamWakeupSchedule updateMany
   */
  export type KidooConfigDreamWakeupScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KidooConfigDreamWakeupSchedules.
     */
    data: XOR<KidooConfigDreamWakeupScheduleUpdateManyMutationInput, KidooConfigDreamWakeupScheduleUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreamWakeupSchedules to update
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamWakeupSchedules to update.
     */
    limit?: number
  }

  /**
   * KidooConfigDreamWakeupSchedule updateManyAndReturn
   */
  export type KidooConfigDreamWakeupScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * The data used to update KidooConfigDreamWakeupSchedules.
     */
    data: XOR<KidooConfigDreamWakeupScheduleUpdateManyMutationInput, KidooConfigDreamWakeupScheduleUncheckedUpdateManyInput>
    /**
     * Filter which KidooConfigDreamWakeupSchedules to update
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamWakeupSchedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * KidooConfigDreamWakeupSchedule upsert
   */
  export type KidooConfigDreamWakeupScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the KidooConfigDreamWakeupSchedule to update in case it exists.
     */
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
    /**
     * In case the KidooConfigDreamWakeupSchedule found by the `where` argument doesn't exist, create a new KidooConfigDreamWakeupSchedule with this data.
     */
    create: XOR<KidooConfigDreamWakeupScheduleCreateInput, KidooConfigDreamWakeupScheduleUncheckedCreateInput>
    /**
     * In case the KidooConfigDreamWakeupSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KidooConfigDreamWakeupScheduleUpdateInput, KidooConfigDreamWakeupScheduleUncheckedUpdateInput>
  }

  /**
   * KidooConfigDreamWakeupSchedule delete
   */
  export type KidooConfigDreamWakeupScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
    /**
     * Filter which KidooConfigDreamWakeupSchedule to delete.
     */
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
  }

  /**
   * KidooConfigDreamWakeupSchedule deleteMany
   */
  export type KidooConfigDreamWakeupScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KidooConfigDreamWakeupSchedules to delete
     */
    where?: KidooConfigDreamWakeupScheduleWhereInput
    /**
     * Limit how many KidooConfigDreamWakeupSchedules to delete.
     */
    limit?: number
  }

  /**
   * KidooConfigDreamWakeupSchedule without action
   */
  export type KidooConfigDreamWakeupScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KidooConfigDreamWakeupSchedule
     */
    select?: KidooConfigDreamWakeupScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KidooConfigDreamWakeupSchedule
     */
    omit?: KidooConfigDreamWakeupScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KidooConfigDreamWakeupScheduleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    emailVerified: 'emailVerified',
    name: 'name',
    avatar: 'avatar',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const KidooScalarFieldEnum: {
    id: 'id',
    name: 'name',
    model: 'model',
    macAddress: 'macAddress',
    bluetoothMacAddress: 'bluetoothMacAddress',
    deviceId: 'deviceId',
    firmwareVersion: 'firmwareVersion',
    lastConnected: 'lastConnected',
    isConnected: 'isConnected',
    wifiSSID: 'wifiSSID',
    userId: 'userId',
    isSynced: 'isSynced',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    brightness: 'brightness',
    sleepTimeout: 'sleepTimeout',
    sleepColorR: 'sleepColorR',
    sleepColorG: 'sleepColorG',
    sleepColorB: 'sleepColorB',
    sleepEffect: 'sleepEffect'
  };

  export type KidooScalarFieldEnum = (typeof KidooScalarFieldEnum)[keyof typeof KidooScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    tagId: 'tagId',
    uid: 'uid',
    name: 'name',
    type: 'type',
    kidooId: 'kidooId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const FileScalarFieldEnum: {
    id: 'id',
    tagId: 'tagId',
    userId: 'userId',
    url: 'url',
    path: 'path',
    fileName: 'fileName',
    originalName: 'originalName',
    size: 'size',
    mimeType: 'mimeType',
    order: 'order',
    disabled: 'disabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const KidooConfigBasicScalarFieldEnum: {
    id: 'id',
    kidooId: 'kidooId',
    storageTotalBytes: 'storageTotalBytes',
    storageFreeBytes: 'storageFreeBytes',
    storageUsedBytes: 'storageUsedBytes',
    storageFreePercent: 'storageFreePercent',
    storageUsedPercent: 'storageUsedPercent',
    storageLastUpdated: 'storageLastUpdated',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KidooConfigBasicScalarFieldEnum = (typeof KidooConfigBasicScalarFieldEnum)[keyof typeof KidooConfigBasicScalarFieldEnum]


  export const KidooConfigDreamScalarFieldEnum: {
    id: 'id',
    kidooId: 'kidooId',
    colorR: 'colorR',
    colorG: 'colorG',
    colorB: 'colorB',
    brightness: 'brightness',
    allNight: 'allNight',
    effect: 'effect',
    wakeupColorR: 'wakeupColorR',
    wakeupColorG: 'wakeupColorG',
    wakeupColorB: 'wakeupColorB',
    wakeupBrightness: 'wakeupBrightness',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KidooConfigDreamScalarFieldEnum = (typeof KidooConfigDreamScalarFieldEnum)[keyof typeof KidooConfigDreamScalarFieldEnum]


  export const KidooConfigDreamBedtimeScheduleScalarFieldEnum: {
    id: 'id',
    kidooConfigDreamId: 'kidooConfigDreamId',
    weekday: 'weekday',
    hour: 'hour',
    minute: 'minute',
    activated: 'activated',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KidooConfigDreamBedtimeScheduleScalarFieldEnum = (typeof KidooConfigDreamBedtimeScheduleScalarFieldEnum)[keyof typeof KidooConfigDreamBedtimeScheduleScalarFieldEnum]


  export const KidooConfigDreamWakeupScheduleScalarFieldEnum: {
    id: 'id',
    kidooConfigDreamId: 'kidooConfigDreamId',
    weekday: 'weekday',
    hour: 'hour',
    minute: 'minute',
    activated: 'activated',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KidooConfigDreamWakeupScheduleScalarFieldEnum = (typeof KidooConfigDreamWakeupScheduleScalarFieldEnum)[keyof typeof KidooConfigDreamWakeupScheduleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TagType'
   */
  export type EnumTagTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TagType'>
    


  /**
   * Reference to a field of type 'TagType[]'
   */
  export type ListEnumTagTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TagType[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    kidoos?: KidooListRelationFilter
    tags?: TagListRelationFilter
    files?: FileListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    kidoos?: KidooOrderByRelationAggregateInput
    tags?: TagOrderByRelationAggregateInput
    files?: FileOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    kidoos?: KidooListRelationFilter
    tags?: TagListRelationFilter
    files?: FileListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type KidooWhereInput = {
    AND?: KidooWhereInput | KidooWhereInput[]
    OR?: KidooWhereInput[]
    NOT?: KidooWhereInput | KidooWhereInput[]
    id?: StringFilter<"Kidoo"> | string
    name?: StringFilter<"Kidoo"> | string
    model?: StringFilter<"Kidoo"> | string
    macAddress?: StringNullableFilter<"Kidoo"> | string | null
    bluetoothMacAddress?: StringNullableFilter<"Kidoo"> | string | null
    deviceId?: StringFilter<"Kidoo"> | string
    firmwareVersion?: StringNullableFilter<"Kidoo"> | string | null
    lastConnected?: DateTimeNullableFilter<"Kidoo"> | Date | string | null
    isConnected?: BoolFilter<"Kidoo"> | boolean
    wifiSSID?: StringNullableFilter<"Kidoo"> | string | null
    userId?: StringNullableFilter<"Kidoo"> | string | null
    isSynced?: BoolFilter<"Kidoo"> | boolean
    createdAt?: DateTimeFilter<"Kidoo"> | Date | string
    updatedAt?: DateTimeFilter<"Kidoo"> | Date | string
    brightness?: IntFilter<"Kidoo"> | number
    sleepTimeout?: IntFilter<"Kidoo"> | number
    sleepColorR?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorG?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorB?: IntNullableFilter<"Kidoo"> | number | null
    sleepEffect?: IntNullableFilter<"Kidoo"> | number | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    tags?: TagListRelationFilter
    configBasic?: XOR<KidooConfigBasicNullableScalarRelationFilter, KidooConfigBasicWhereInput> | null
    configDream?: XOR<KidooConfigDreamNullableScalarRelationFilter, KidooConfigDreamWhereInput> | null
  }

  export type KidooOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    model?: SortOrder
    macAddress?: SortOrderInput | SortOrder
    bluetoothMacAddress?: SortOrderInput | SortOrder
    deviceId?: SortOrder
    firmwareVersion?: SortOrderInput | SortOrder
    lastConnected?: SortOrderInput | SortOrder
    isConnected?: SortOrder
    wifiSSID?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrderInput | SortOrder
    sleepColorG?: SortOrderInput | SortOrder
    sleepColorB?: SortOrderInput | SortOrder
    sleepEffect?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    tags?: TagOrderByRelationAggregateInput
    configBasic?: KidooConfigBasicOrderByWithRelationInput
    configDream?: KidooConfigDreamOrderByWithRelationInput
  }

  export type KidooWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deviceId?: string
    AND?: KidooWhereInput | KidooWhereInput[]
    OR?: KidooWhereInput[]
    NOT?: KidooWhereInput | KidooWhereInput[]
    name?: StringFilter<"Kidoo"> | string
    model?: StringFilter<"Kidoo"> | string
    macAddress?: StringNullableFilter<"Kidoo"> | string | null
    bluetoothMacAddress?: StringNullableFilter<"Kidoo"> | string | null
    firmwareVersion?: StringNullableFilter<"Kidoo"> | string | null
    lastConnected?: DateTimeNullableFilter<"Kidoo"> | Date | string | null
    isConnected?: BoolFilter<"Kidoo"> | boolean
    wifiSSID?: StringNullableFilter<"Kidoo"> | string | null
    userId?: StringNullableFilter<"Kidoo"> | string | null
    isSynced?: BoolFilter<"Kidoo"> | boolean
    createdAt?: DateTimeFilter<"Kidoo"> | Date | string
    updatedAt?: DateTimeFilter<"Kidoo"> | Date | string
    brightness?: IntFilter<"Kidoo"> | number
    sleepTimeout?: IntFilter<"Kidoo"> | number
    sleepColorR?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorG?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorB?: IntNullableFilter<"Kidoo"> | number | null
    sleepEffect?: IntNullableFilter<"Kidoo"> | number | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    tags?: TagListRelationFilter
    configBasic?: XOR<KidooConfigBasicNullableScalarRelationFilter, KidooConfigBasicWhereInput> | null
    configDream?: XOR<KidooConfigDreamNullableScalarRelationFilter, KidooConfigDreamWhereInput> | null
  }, "id" | "deviceId">

  export type KidooOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    model?: SortOrder
    macAddress?: SortOrderInput | SortOrder
    bluetoothMacAddress?: SortOrderInput | SortOrder
    deviceId?: SortOrder
    firmwareVersion?: SortOrderInput | SortOrder
    lastConnected?: SortOrderInput | SortOrder
    isConnected?: SortOrder
    wifiSSID?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    isSynced?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrderInput | SortOrder
    sleepColorG?: SortOrderInput | SortOrder
    sleepColorB?: SortOrderInput | SortOrder
    sleepEffect?: SortOrderInput | SortOrder
    _count?: KidooCountOrderByAggregateInput
    _avg?: KidooAvgOrderByAggregateInput
    _max?: KidooMaxOrderByAggregateInput
    _min?: KidooMinOrderByAggregateInput
    _sum?: KidooSumOrderByAggregateInput
  }

  export type KidooScalarWhereWithAggregatesInput = {
    AND?: KidooScalarWhereWithAggregatesInput | KidooScalarWhereWithAggregatesInput[]
    OR?: KidooScalarWhereWithAggregatesInput[]
    NOT?: KidooScalarWhereWithAggregatesInput | KidooScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Kidoo"> | string
    name?: StringWithAggregatesFilter<"Kidoo"> | string
    model?: StringWithAggregatesFilter<"Kidoo"> | string
    macAddress?: StringNullableWithAggregatesFilter<"Kidoo"> | string | null
    bluetoothMacAddress?: StringNullableWithAggregatesFilter<"Kidoo"> | string | null
    deviceId?: StringWithAggregatesFilter<"Kidoo"> | string
    firmwareVersion?: StringNullableWithAggregatesFilter<"Kidoo"> | string | null
    lastConnected?: DateTimeNullableWithAggregatesFilter<"Kidoo"> | Date | string | null
    isConnected?: BoolWithAggregatesFilter<"Kidoo"> | boolean
    wifiSSID?: StringNullableWithAggregatesFilter<"Kidoo"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Kidoo"> | string | null
    isSynced?: BoolWithAggregatesFilter<"Kidoo"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Kidoo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Kidoo"> | Date | string
    brightness?: IntWithAggregatesFilter<"Kidoo"> | number
    sleepTimeout?: IntWithAggregatesFilter<"Kidoo"> | number
    sleepColorR?: IntNullableWithAggregatesFilter<"Kidoo"> | number | null
    sleepColorG?: IntNullableWithAggregatesFilter<"Kidoo"> | number | null
    sleepColorB?: IntNullableWithAggregatesFilter<"Kidoo"> | number | null
    sleepEffect?: IntNullableWithAggregatesFilter<"Kidoo"> | number | null
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    tagId?: StringNullableFilter<"Tag"> | string | null
    uid?: StringNullableFilter<"Tag"> | string | null
    name?: StringNullableFilter<"Tag"> | string | null
    type?: EnumTagTypeNullableFilter<"Tag"> | $Enums.TagType | null
    kidooId?: StringFilter<"Tag"> | string
    userId?: StringFilter<"Tag"> | string
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    multimediaFiles?: FileListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    tagId?: SortOrderInput | SortOrder
    uid?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    kidooId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kidoo?: KidooOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    multimediaFiles?: FileOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tagId?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    uid?: StringNullableFilter<"Tag"> | string | null
    name?: StringNullableFilter<"Tag"> | string | null
    type?: EnumTagTypeNullableFilter<"Tag"> | $Enums.TagType | null
    kidooId?: StringFilter<"Tag"> | string
    userId?: StringFilter<"Tag"> | string
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    multimediaFiles?: FileListRelationFilter
  }, "id" | "tagId">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    tagId?: SortOrderInput | SortOrder
    uid?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    kidooId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    tagId?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    uid?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    name?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    type?: EnumTagTypeNullableWithAggregatesFilter<"Tag"> | $Enums.TagType | null
    kidooId?: StringWithAggregatesFilter<"Tag"> | string
    userId?: StringWithAggregatesFilter<"Tag"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    id?: StringFilter<"File"> | string
    tagId?: StringFilter<"File"> | string
    userId?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    fileName?: StringFilter<"File"> | string
    originalName?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    mimeType?: StringFilter<"File"> | string
    order?: IntFilter<"File"> | number
    disabled?: BoolFilter<"File"> | boolean
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FileOrderByWithRelationInput = {
    id?: SortOrder
    tagId?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    path?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    disabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tag?: TagOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    tagId?: StringFilter<"File"> | string
    userId?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    fileName?: StringFilter<"File"> | string
    originalName?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    mimeType?: StringFilter<"File"> | string
    order?: IntFilter<"File"> | number
    disabled?: BoolFilter<"File"> | boolean
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FileOrderByWithAggregationInput = {
    id?: SortOrder
    tagId?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    path?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    disabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"File"> | string
    tagId?: StringWithAggregatesFilter<"File"> | string
    userId?: StringWithAggregatesFilter<"File"> | string
    url?: StringWithAggregatesFilter<"File"> | string
    path?: StringWithAggregatesFilter<"File"> | string
    fileName?: StringWithAggregatesFilter<"File"> | string
    originalName?: StringWithAggregatesFilter<"File"> | string
    size?: IntWithAggregatesFilter<"File"> | number
    mimeType?: StringWithAggregatesFilter<"File"> | string
    order?: IntWithAggregatesFilter<"File"> | number
    disabled?: BoolWithAggregatesFilter<"File"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
  }

  export type KidooConfigBasicWhereInput = {
    AND?: KidooConfigBasicWhereInput | KidooConfigBasicWhereInput[]
    OR?: KidooConfigBasicWhereInput[]
    NOT?: KidooConfigBasicWhereInput | KidooConfigBasicWhereInput[]
    id?: StringFilter<"KidooConfigBasic"> | string
    kidooId?: StringFilter<"KidooConfigBasic"> | string
    storageTotalBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreeBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageUsedBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreePercent?: IntNullableFilter<"KidooConfigBasic"> | number | null
    storageUsedPercent?: IntNullableFilter<"KidooConfigBasic"> | number | null
    storageLastUpdated?: DateTimeNullableFilter<"KidooConfigBasic"> | Date | string | null
    createdAt?: DateTimeFilter<"KidooConfigBasic"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigBasic"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
  }

  export type KidooConfigBasicOrderByWithRelationInput = {
    id?: SortOrder
    kidooId?: SortOrder
    storageTotalBytes?: SortOrderInput | SortOrder
    storageFreeBytes?: SortOrderInput | SortOrder
    storageUsedBytes?: SortOrderInput | SortOrder
    storageFreePercent?: SortOrderInput | SortOrder
    storageUsedPercent?: SortOrderInput | SortOrder
    storageLastUpdated?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kidoo?: KidooOrderByWithRelationInput
  }

  export type KidooConfigBasicWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kidooId?: string
    AND?: KidooConfigBasicWhereInput | KidooConfigBasicWhereInput[]
    OR?: KidooConfigBasicWhereInput[]
    NOT?: KidooConfigBasicWhereInput | KidooConfigBasicWhereInput[]
    storageTotalBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreeBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageUsedBytes?: BigIntNullableFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreePercent?: IntNullableFilter<"KidooConfigBasic"> | number | null
    storageUsedPercent?: IntNullableFilter<"KidooConfigBasic"> | number | null
    storageLastUpdated?: DateTimeNullableFilter<"KidooConfigBasic"> | Date | string | null
    createdAt?: DateTimeFilter<"KidooConfigBasic"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigBasic"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
  }, "id" | "kidooId">

  export type KidooConfigBasicOrderByWithAggregationInput = {
    id?: SortOrder
    kidooId?: SortOrder
    storageTotalBytes?: SortOrderInput | SortOrder
    storageFreeBytes?: SortOrderInput | SortOrder
    storageUsedBytes?: SortOrderInput | SortOrder
    storageFreePercent?: SortOrderInput | SortOrder
    storageUsedPercent?: SortOrderInput | SortOrder
    storageLastUpdated?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KidooConfigBasicCountOrderByAggregateInput
    _avg?: KidooConfigBasicAvgOrderByAggregateInput
    _max?: KidooConfigBasicMaxOrderByAggregateInput
    _min?: KidooConfigBasicMinOrderByAggregateInput
    _sum?: KidooConfigBasicSumOrderByAggregateInput
  }

  export type KidooConfigBasicScalarWhereWithAggregatesInput = {
    AND?: KidooConfigBasicScalarWhereWithAggregatesInput | KidooConfigBasicScalarWhereWithAggregatesInput[]
    OR?: KidooConfigBasicScalarWhereWithAggregatesInput[]
    NOT?: KidooConfigBasicScalarWhereWithAggregatesInput | KidooConfigBasicScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KidooConfigBasic"> | string
    kidooId?: StringWithAggregatesFilter<"KidooConfigBasic"> | string
    storageTotalBytes?: BigIntNullableWithAggregatesFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreeBytes?: BigIntNullableWithAggregatesFilter<"KidooConfigBasic"> | bigint | number | null
    storageUsedBytes?: BigIntNullableWithAggregatesFilter<"KidooConfigBasic"> | bigint | number | null
    storageFreePercent?: IntNullableWithAggregatesFilter<"KidooConfigBasic"> | number | null
    storageUsedPercent?: IntNullableWithAggregatesFilter<"KidooConfigBasic"> | number | null
    storageLastUpdated?: DateTimeNullableWithAggregatesFilter<"KidooConfigBasic"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"KidooConfigBasic"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KidooConfigBasic"> | Date | string
  }

  export type KidooConfigDreamWhereInput = {
    AND?: KidooConfigDreamWhereInput | KidooConfigDreamWhereInput[]
    OR?: KidooConfigDreamWhereInput[]
    NOT?: KidooConfigDreamWhereInput | KidooConfigDreamWhereInput[]
    id?: StringFilter<"KidooConfigDream"> | string
    kidooId?: StringFilter<"KidooConfigDream"> | string
    colorR?: IntNullableFilter<"KidooConfigDream"> | number | null
    colorG?: IntNullableFilter<"KidooConfigDream"> | number | null
    colorB?: IntNullableFilter<"KidooConfigDream"> | number | null
    brightness?: IntNullableFilter<"KidooConfigDream"> | number | null
    allNight?: BoolFilter<"KidooConfigDream"> | boolean
    effect?: StringNullableFilter<"KidooConfigDream"> | string | null
    wakeupColorR?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupColorG?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupColorB?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupBrightness?: IntNullableFilter<"KidooConfigDream"> | number | null
    createdAt?: DateTimeFilter<"KidooConfigDream"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDream"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleListRelationFilter
    wakeupSchedules?: KidooConfigDreamWakeupScheduleListRelationFilter
  }

  export type KidooConfigDreamOrderByWithRelationInput = {
    id?: SortOrder
    kidooId?: SortOrder
    colorR?: SortOrderInput | SortOrder
    colorG?: SortOrderInput | SortOrder
    colorB?: SortOrderInput | SortOrder
    brightness?: SortOrderInput | SortOrder
    allNight?: SortOrder
    effect?: SortOrderInput | SortOrder
    wakeupColorR?: SortOrderInput | SortOrder
    wakeupColorG?: SortOrderInput | SortOrder
    wakeupColorB?: SortOrderInput | SortOrder
    wakeupBrightness?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kidoo?: KidooOrderByWithRelationInput
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleOrderByRelationAggregateInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleOrderByRelationAggregateInput
  }

  export type KidooConfigDreamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kidooId?: string
    AND?: KidooConfigDreamWhereInput | KidooConfigDreamWhereInput[]
    OR?: KidooConfigDreamWhereInput[]
    NOT?: KidooConfigDreamWhereInput | KidooConfigDreamWhereInput[]
    colorR?: IntNullableFilter<"KidooConfigDream"> | number | null
    colorG?: IntNullableFilter<"KidooConfigDream"> | number | null
    colorB?: IntNullableFilter<"KidooConfigDream"> | number | null
    brightness?: IntNullableFilter<"KidooConfigDream"> | number | null
    allNight?: BoolFilter<"KidooConfigDream"> | boolean
    effect?: StringNullableFilter<"KidooConfigDream"> | string | null
    wakeupColorR?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupColorG?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupColorB?: IntNullableFilter<"KidooConfigDream"> | number | null
    wakeupBrightness?: IntNullableFilter<"KidooConfigDream"> | number | null
    createdAt?: DateTimeFilter<"KidooConfigDream"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDream"> | Date | string
    kidoo?: XOR<KidooScalarRelationFilter, KidooWhereInput>
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleListRelationFilter
    wakeupSchedules?: KidooConfigDreamWakeupScheduleListRelationFilter
  }, "id" | "kidooId">

  export type KidooConfigDreamOrderByWithAggregationInput = {
    id?: SortOrder
    kidooId?: SortOrder
    colorR?: SortOrderInput | SortOrder
    colorG?: SortOrderInput | SortOrder
    colorB?: SortOrderInput | SortOrder
    brightness?: SortOrderInput | SortOrder
    allNight?: SortOrder
    effect?: SortOrderInput | SortOrder
    wakeupColorR?: SortOrderInput | SortOrder
    wakeupColorG?: SortOrderInput | SortOrder
    wakeupColorB?: SortOrderInput | SortOrder
    wakeupBrightness?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KidooConfigDreamCountOrderByAggregateInput
    _avg?: KidooConfigDreamAvgOrderByAggregateInput
    _max?: KidooConfigDreamMaxOrderByAggregateInput
    _min?: KidooConfigDreamMinOrderByAggregateInput
    _sum?: KidooConfigDreamSumOrderByAggregateInput
  }

  export type KidooConfigDreamScalarWhereWithAggregatesInput = {
    AND?: KidooConfigDreamScalarWhereWithAggregatesInput | KidooConfigDreamScalarWhereWithAggregatesInput[]
    OR?: KidooConfigDreamScalarWhereWithAggregatesInput[]
    NOT?: KidooConfigDreamScalarWhereWithAggregatesInput | KidooConfigDreamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KidooConfigDream"> | string
    kidooId?: StringWithAggregatesFilter<"KidooConfigDream"> | string
    colorR?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    colorG?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    colorB?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    brightness?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    allNight?: BoolWithAggregatesFilter<"KidooConfigDream"> | boolean
    effect?: StringNullableWithAggregatesFilter<"KidooConfigDream"> | string | null
    wakeupColorR?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    wakeupColorG?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    wakeupColorB?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    wakeupBrightness?: IntNullableWithAggregatesFilter<"KidooConfigDream"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"KidooConfigDream"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KidooConfigDream"> | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleWhereInput = {
    AND?: KidooConfigDreamBedtimeScheduleWhereInput | KidooConfigDreamBedtimeScheduleWhereInput[]
    OR?: KidooConfigDreamBedtimeScheduleWhereInput[]
    NOT?: KidooConfigDreamBedtimeScheduleWhereInput | KidooConfigDreamBedtimeScheduleWhereInput[]
    id?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamBedtimeSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    kidooConfigDream?: XOR<KidooConfigDreamScalarRelationFilter, KidooConfigDreamWhereInput>
  }

  export type KidooConfigDreamBedtimeScheduleOrderByWithRelationInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kidooConfigDream?: KidooConfigDreamOrderByWithRelationInput
  }

  export type KidooConfigDreamBedtimeScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kidooConfigDreamId_weekday?: KidooConfigDreamBedtimeScheduleKidooConfigDreamIdWeekdayCompoundUniqueInput
    AND?: KidooConfigDreamBedtimeScheduleWhereInput | KidooConfigDreamBedtimeScheduleWhereInput[]
    OR?: KidooConfigDreamBedtimeScheduleWhereInput[]
    NOT?: KidooConfigDreamBedtimeScheduleWhereInput | KidooConfigDreamBedtimeScheduleWhereInput[]
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamBedtimeSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    kidooConfigDream?: XOR<KidooConfigDreamScalarRelationFilter, KidooConfigDreamWhereInput>
  }, "id" | "kidooConfigDreamId_weekday">

  export type KidooConfigDreamBedtimeScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KidooConfigDreamBedtimeScheduleCountOrderByAggregateInput
    _avg?: KidooConfigDreamBedtimeScheduleAvgOrderByAggregateInput
    _max?: KidooConfigDreamBedtimeScheduleMaxOrderByAggregateInput
    _min?: KidooConfigDreamBedtimeScheduleMinOrderByAggregateInput
    _sum?: KidooConfigDreamBedtimeScheduleSumOrderByAggregateInput
  }

  export type KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput = {
    AND?: KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput | KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput[]
    OR?: KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput[]
    NOT?: KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput | KidooConfigDreamBedtimeScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | string
    kidooConfigDreamId?: StringWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | string
    weekday?: StringWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | string
    hour?: IntWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | number
    minute?: IntWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | number
    activated?: BoolWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
  }

  export type KidooConfigDreamWakeupScheduleWhereInput = {
    AND?: KidooConfigDreamWakeupScheduleWhereInput | KidooConfigDreamWakeupScheduleWhereInput[]
    OR?: KidooConfigDreamWakeupScheduleWhereInput[]
    NOT?: KidooConfigDreamWakeupScheduleWhereInput | KidooConfigDreamWakeupScheduleWhereInput[]
    id?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamWakeupSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    kidooConfigDream?: XOR<KidooConfigDreamScalarRelationFilter, KidooConfigDreamWhereInput>
  }

  export type KidooConfigDreamWakeupScheduleOrderByWithRelationInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    kidooConfigDream?: KidooConfigDreamOrderByWithRelationInput
  }

  export type KidooConfigDreamWakeupScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kidooConfigDreamId_weekday?: KidooConfigDreamWakeupScheduleKidooConfigDreamIdWeekdayCompoundUniqueInput
    AND?: KidooConfigDreamWakeupScheduleWhereInput | KidooConfigDreamWakeupScheduleWhereInput[]
    OR?: KidooConfigDreamWakeupScheduleWhereInput[]
    NOT?: KidooConfigDreamWakeupScheduleWhereInput | KidooConfigDreamWakeupScheduleWhereInput[]
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamWakeupSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    kidooConfigDream?: XOR<KidooConfigDreamScalarRelationFilter, KidooConfigDreamWhereInput>
  }, "id" | "kidooConfigDreamId_weekday">

  export type KidooConfigDreamWakeupScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KidooConfigDreamWakeupScheduleCountOrderByAggregateInput
    _avg?: KidooConfigDreamWakeupScheduleAvgOrderByAggregateInput
    _max?: KidooConfigDreamWakeupScheduleMaxOrderByAggregateInput
    _min?: KidooConfigDreamWakeupScheduleMinOrderByAggregateInput
    _sum?: KidooConfigDreamWakeupScheduleSumOrderByAggregateInput
  }

  export type KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput = {
    AND?: KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput | KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput[]
    OR?: KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput[]
    NOT?: KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput | KidooConfigDreamWakeupScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | string
    kidooConfigDreamId?: StringWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | string
    weekday?: StringWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | string
    hour?: IntWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | number
    minute?: IntWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | number
    activated?: BoolWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    kidoos?: KidooCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    kidoos?: KidooUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    kidoos?: KidooUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    kidoos?: KidooUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooCreateInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    user?: UserCreateNestedOneWithoutKidoosInput
    tags?: TagCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamCreateNestedOneWithoutKidooInput
  }

  export type KidooUncheckedCreateInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    userId?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    tags?: TagUncheckedCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicUncheckedCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamUncheckedCreateNestedOneWithoutKidooInput
  }

  export type KidooUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    user?: UserUpdateOneWithoutKidoosNestedInput
    tags?: TagUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: TagUncheckedUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUncheckedUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUncheckedUpdateOneWithoutKidooNestedInput
  }

  export type KidooCreateManyInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    userId?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
  }

  export type KidooUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type KidooUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TagCreateInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutTagsInput
    user: UserCreateNestedOneWithoutTagsInput
    multimediaFiles?: FileCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    kidooId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    multimediaFiles?: FileUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutTagsNestedInput
    user?: UserUpdateOneRequiredWithoutTagsNestedInput
    multimediaFiles?: FileUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    kidooId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    multimediaFiles?: FileUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    kidooId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    kidooId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateInput = {
    id?: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tag: TagCreateNestedOneWithoutMultimediaFilesInput
    user: UserCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateInput = {
    id?: string
    tagId: string
    userId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutMultimediaFilesNestedInput
    user?: UserUpdateOneRequiredWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateManyInput = {
    id?: string
    tagId: string
    userId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigBasicCreateInput = {
    id?: string
    storageTotalBytes?: bigint | number | null
    storageFreeBytes?: bigint | number | null
    storageUsedBytes?: bigint | number | null
    storageFreePercent?: number | null
    storageUsedPercent?: number | null
    storageLastUpdated?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutConfigBasicInput
  }

  export type KidooConfigBasicUncheckedCreateInput = {
    id?: string
    kidooId: string
    storageTotalBytes?: bigint | number | null
    storageFreeBytes?: bigint | number | null
    storageUsedBytes?: bigint | number | null
    storageFreePercent?: number | null
    storageUsedPercent?: number | null
    storageLastUpdated?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigBasicUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutConfigBasicNestedInput
  }

  export type KidooConfigBasicUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigBasicCreateManyInput = {
    id?: string
    kidooId: string
    storageTotalBytes?: bigint | number | null
    storageFreeBytes?: bigint | number | null
    storageUsedBytes?: bigint | number | null
    storageFreePercent?: number | null
    storageUsedPercent?: number | null
    storageLastUpdated?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigBasicUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigBasicUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamCreateInput = {
    id?: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutConfigDreamInput
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleCreateNestedManyWithoutKidooConfigDreamInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamUncheckedCreateInput = {
    id?: string
    kidooId: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutConfigDreamNestedInput
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUpdateManyWithoutKidooConfigDreamNestedInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamCreateManyInput = {
    id?: string
    kidooId: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleCreateInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    kidooConfigDream: KidooConfigDreamCreateNestedOneWithoutBedtimeSchedulesInput
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedCreateInput = {
    id?: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidooConfigDream?: KidooConfigDreamUpdateOneRequiredWithoutBedtimeSchedulesNestedInput
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooConfigDreamId?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleCreateManyInput = {
    id?: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooConfigDreamId?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleCreateInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    kidooConfigDream: KidooConfigDreamCreateNestedOneWithoutWakeupSchedulesInput
  }

  export type KidooConfigDreamWakeupScheduleUncheckedCreateInput = {
    id?: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamWakeupScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidooConfigDream?: KidooConfigDreamUpdateOneRequiredWithoutWakeupSchedulesNestedInput
  }

  export type KidooConfigDreamWakeupScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooConfigDreamId?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleCreateManyInput = {
    id?: string
    kidooConfigDreamId: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamWakeupScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooConfigDreamId?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type KidooListRelationFilter = {
    every?: KidooWhereInput
    some?: KidooWhereInput
    none?: KidooWhereInput
  }

  export type TagListRelationFilter = {
    every?: TagWhereInput
    some?: TagWhereInput
    none?: TagWhereInput
  }

  export type FileListRelationFilter = {
    every?: FileWhereInput
    some?: FileWhereInput
    none?: FileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KidooOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type KidooConfigBasicNullableScalarRelationFilter = {
    is?: KidooConfigBasicWhereInput | null
    isNot?: KidooConfigBasicWhereInput | null
  }

  export type KidooConfigDreamNullableScalarRelationFilter = {
    is?: KidooConfigDreamWhereInput | null
    isNot?: KidooConfigDreamWhereInput | null
  }

  export type KidooCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    model?: SortOrder
    macAddress?: SortOrder
    bluetoothMacAddress?: SortOrder
    deviceId?: SortOrder
    firmwareVersion?: SortOrder
    lastConnected?: SortOrder
    isConnected?: SortOrder
    wifiSSID?: SortOrder
    userId?: SortOrder
    isSynced?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrder
    sleepColorG?: SortOrder
    sleepColorB?: SortOrder
    sleepEffect?: SortOrder
  }

  export type KidooAvgOrderByAggregateInput = {
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrder
    sleepColorG?: SortOrder
    sleepColorB?: SortOrder
    sleepEffect?: SortOrder
  }

  export type KidooMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    model?: SortOrder
    macAddress?: SortOrder
    bluetoothMacAddress?: SortOrder
    deviceId?: SortOrder
    firmwareVersion?: SortOrder
    lastConnected?: SortOrder
    isConnected?: SortOrder
    wifiSSID?: SortOrder
    userId?: SortOrder
    isSynced?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrder
    sleepColorG?: SortOrder
    sleepColorB?: SortOrder
    sleepEffect?: SortOrder
  }

  export type KidooMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    model?: SortOrder
    macAddress?: SortOrder
    bluetoothMacAddress?: SortOrder
    deviceId?: SortOrder
    firmwareVersion?: SortOrder
    lastConnected?: SortOrder
    isConnected?: SortOrder
    wifiSSID?: SortOrder
    userId?: SortOrder
    isSynced?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrder
    sleepColorG?: SortOrder
    sleepColorB?: SortOrder
    sleepEffect?: SortOrder
  }

  export type KidooSumOrderByAggregateInput = {
    brightness?: SortOrder
    sleepTimeout?: SortOrder
    sleepColorR?: SortOrder
    sleepColorG?: SortOrder
    sleepColorB?: SortOrder
    sleepEffect?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumTagTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TagType | EnumTagTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTagTypeNullableFilter<$PrismaModel> | $Enums.TagType | null
  }

  export type KidooScalarRelationFilter = {
    is?: KidooWhereInput
    isNot?: KidooWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    type?: SortOrder
    kidooId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    type?: SortOrder
    kidooId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    uid?: SortOrder
    name?: SortOrder
    type?: SortOrder
    kidooId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTagTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TagType | EnumTagTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTagTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TagType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTagTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTagTypeNullableFilter<$PrismaModel>
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type TagScalarRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type FileCountOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    path?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    disabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    size?: SortOrder
    order?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    path?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    disabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    id?: SortOrder
    tagId?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    path?: SortOrder
    fileName?: SortOrder
    originalName?: SortOrder
    size?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    disabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    size?: SortOrder
    order?: SortOrder
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type KidooConfigBasicCountOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    storageTotalBytes?: SortOrder
    storageFreeBytes?: SortOrder
    storageUsedBytes?: SortOrder
    storageFreePercent?: SortOrder
    storageUsedPercent?: SortOrder
    storageLastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigBasicAvgOrderByAggregateInput = {
    storageTotalBytes?: SortOrder
    storageFreeBytes?: SortOrder
    storageUsedBytes?: SortOrder
    storageFreePercent?: SortOrder
    storageUsedPercent?: SortOrder
  }

  export type KidooConfigBasicMaxOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    storageTotalBytes?: SortOrder
    storageFreeBytes?: SortOrder
    storageUsedBytes?: SortOrder
    storageFreePercent?: SortOrder
    storageUsedPercent?: SortOrder
    storageLastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigBasicMinOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    storageTotalBytes?: SortOrder
    storageFreeBytes?: SortOrder
    storageUsedBytes?: SortOrder
    storageFreePercent?: SortOrder
    storageUsedPercent?: SortOrder
    storageLastUpdated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigBasicSumOrderByAggregateInput = {
    storageTotalBytes?: SortOrder
    storageFreeBytes?: SortOrder
    storageUsedBytes?: SortOrder
    storageFreePercent?: SortOrder
    storageUsedPercent?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type KidooConfigDreamBedtimeScheduleListRelationFilter = {
    every?: KidooConfigDreamBedtimeScheduleWhereInput
    some?: KidooConfigDreamBedtimeScheduleWhereInput
    none?: KidooConfigDreamBedtimeScheduleWhereInput
  }

  export type KidooConfigDreamWakeupScheduleListRelationFilter = {
    every?: KidooConfigDreamWakeupScheduleWhereInput
    some?: KidooConfigDreamWakeupScheduleWhereInput
    none?: KidooConfigDreamWakeupScheduleWhereInput
  }

  export type KidooConfigDreamBedtimeScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KidooConfigDreamCountOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    colorR?: SortOrder
    colorG?: SortOrder
    colorB?: SortOrder
    brightness?: SortOrder
    allNight?: SortOrder
    effect?: SortOrder
    wakeupColorR?: SortOrder
    wakeupColorG?: SortOrder
    wakeupColorB?: SortOrder
    wakeupBrightness?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamAvgOrderByAggregateInput = {
    colorR?: SortOrder
    colorG?: SortOrder
    colorB?: SortOrder
    brightness?: SortOrder
    wakeupColorR?: SortOrder
    wakeupColorG?: SortOrder
    wakeupColorB?: SortOrder
    wakeupBrightness?: SortOrder
  }

  export type KidooConfigDreamMaxOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    colorR?: SortOrder
    colorG?: SortOrder
    colorB?: SortOrder
    brightness?: SortOrder
    allNight?: SortOrder
    effect?: SortOrder
    wakeupColorR?: SortOrder
    wakeupColorG?: SortOrder
    wakeupColorB?: SortOrder
    wakeupBrightness?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamMinOrderByAggregateInput = {
    id?: SortOrder
    kidooId?: SortOrder
    colorR?: SortOrder
    colorG?: SortOrder
    colorB?: SortOrder
    brightness?: SortOrder
    allNight?: SortOrder
    effect?: SortOrder
    wakeupColorR?: SortOrder
    wakeupColorG?: SortOrder
    wakeupColorB?: SortOrder
    wakeupBrightness?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamSumOrderByAggregateInput = {
    colorR?: SortOrder
    colorG?: SortOrder
    colorB?: SortOrder
    brightness?: SortOrder
    wakeupColorR?: SortOrder
    wakeupColorG?: SortOrder
    wakeupColorB?: SortOrder
    wakeupBrightness?: SortOrder
  }

  export type KidooConfigDreamScalarRelationFilter = {
    is?: KidooConfigDreamWhereInput
    isNot?: KidooConfigDreamWhereInput
  }

  export type KidooConfigDreamBedtimeScheduleKidooConfigDreamIdWeekdayCompoundUniqueInput = {
    kidooConfigDreamId: string
    weekday: string
  }

  export type KidooConfigDreamBedtimeScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamBedtimeScheduleAvgOrderByAggregateInput = {
    hour?: SortOrder
    minute?: SortOrder
  }

  export type KidooConfigDreamBedtimeScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamBedtimeScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamBedtimeScheduleSumOrderByAggregateInput = {
    hour?: SortOrder
    minute?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleKidooConfigDreamIdWeekdayCompoundUniqueInput = {
    kidooConfigDreamId: string
    weekday: string
  }

  export type KidooConfigDreamWakeupScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleAvgOrderByAggregateInput = {
    hour?: SortOrder
    minute?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    kidooConfigDreamId?: SortOrder
    weekday?: SortOrder
    hour?: SortOrder
    minute?: SortOrder
    activated?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KidooConfigDreamWakeupScheduleSumOrderByAggregateInput = {
    hour?: SortOrder
    minute?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type KidooCreateNestedManyWithoutUserInput = {
    create?: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput> | KidooCreateWithoutUserInput[] | KidooUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KidooCreateOrConnectWithoutUserInput | KidooCreateOrConnectWithoutUserInput[]
    createMany?: KidooCreateManyUserInputEnvelope
    connect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
  }

  export type TagCreateNestedManyWithoutUserInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type FileCreateNestedManyWithoutUserInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type KidooUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput> | KidooCreateWithoutUserInput[] | KidooUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KidooCreateOrConnectWithoutUserInput | KidooCreateOrConnectWithoutUserInput[]
    createMany?: KidooCreateManyUserInputEnvelope
    connect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
  }

  export type TagUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type KidooUpdateManyWithoutUserNestedInput = {
    create?: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput> | KidooCreateWithoutUserInput[] | KidooUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KidooCreateOrConnectWithoutUserInput | KidooCreateOrConnectWithoutUserInput[]
    upsert?: KidooUpsertWithWhereUniqueWithoutUserInput | KidooUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KidooCreateManyUserInputEnvelope
    set?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    disconnect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    delete?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    connect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    update?: KidooUpdateWithWhereUniqueWithoutUserInput | KidooUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KidooUpdateManyWithWhereWithoutUserInput | KidooUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KidooScalarWhereInput | KidooScalarWhereInput[]
  }

  export type TagUpdateManyWithoutUserNestedInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutUserInput | TagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutUserInput | TagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TagUpdateManyWithWhereWithoutUserInput | TagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type FileUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type KidooUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput> | KidooCreateWithoutUserInput[] | KidooUncheckedCreateWithoutUserInput[]
    connectOrCreate?: KidooCreateOrConnectWithoutUserInput | KidooCreateOrConnectWithoutUserInput[]
    upsert?: KidooUpsertWithWhereUniqueWithoutUserInput | KidooUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: KidooCreateManyUserInputEnvelope
    set?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    disconnect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    delete?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    connect?: KidooWhereUniqueInput | KidooWhereUniqueInput[]
    update?: KidooUpdateWithWhereUniqueWithoutUserInput | KidooUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: KidooUpdateManyWithWhereWithoutUserInput | KidooUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: KidooScalarWhereInput | KidooScalarWhereInput[]
  }

  export type TagUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput> | TagCreateWithoutUserInput[] | TagUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TagCreateOrConnectWithoutUserInput | TagCreateOrConnectWithoutUserInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutUserInput | TagUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TagCreateManyUserInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutUserInput | TagUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TagUpdateManyWithWhereWithoutUserInput | TagUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutKidoosInput = {
    create?: XOR<UserCreateWithoutKidoosInput, UserUncheckedCreateWithoutKidoosInput>
    connectOrCreate?: UserCreateOrConnectWithoutKidoosInput
    connect?: UserWhereUniqueInput
  }

  export type TagCreateNestedManyWithoutKidooInput = {
    create?: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput> | TagCreateWithoutKidooInput[] | TagUncheckedCreateWithoutKidooInput[]
    connectOrCreate?: TagCreateOrConnectWithoutKidooInput | TagCreateOrConnectWithoutKidooInput[]
    createMany?: TagCreateManyKidooInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type KidooConfigBasicCreateNestedOneWithoutKidooInput = {
    create?: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigBasicCreateOrConnectWithoutKidooInput
    connect?: KidooConfigBasicWhereUniqueInput
  }

  export type KidooConfigDreamCreateNestedOneWithoutKidooInput = {
    create?: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutKidooInput
    connect?: KidooConfigDreamWhereUniqueInput
  }

  export type TagUncheckedCreateNestedManyWithoutKidooInput = {
    create?: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput> | TagCreateWithoutKidooInput[] | TagUncheckedCreateWithoutKidooInput[]
    connectOrCreate?: TagCreateOrConnectWithoutKidooInput | TagCreateOrConnectWithoutKidooInput[]
    createMany?: TagCreateManyKidooInputEnvelope
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type KidooConfigBasicUncheckedCreateNestedOneWithoutKidooInput = {
    create?: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigBasicCreateOrConnectWithoutKidooInput
    connect?: KidooConfigBasicWhereUniqueInput
  }

  export type KidooConfigDreamUncheckedCreateNestedOneWithoutKidooInput = {
    create?: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutKidooInput
    connect?: KidooConfigDreamWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutKidoosNestedInput = {
    create?: XOR<UserCreateWithoutKidoosInput, UserUncheckedCreateWithoutKidoosInput>
    connectOrCreate?: UserCreateOrConnectWithoutKidoosInput
    upsert?: UserUpsertWithoutKidoosInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutKidoosInput, UserUpdateWithoutKidoosInput>, UserUncheckedUpdateWithoutKidoosInput>
  }

  export type TagUpdateManyWithoutKidooNestedInput = {
    create?: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput> | TagCreateWithoutKidooInput[] | TagUncheckedCreateWithoutKidooInput[]
    connectOrCreate?: TagCreateOrConnectWithoutKidooInput | TagCreateOrConnectWithoutKidooInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutKidooInput | TagUpsertWithWhereUniqueWithoutKidooInput[]
    createMany?: TagCreateManyKidooInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutKidooInput | TagUpdateWithWhereUniqueWithoutKidooInput[]
    updateMany?: TagUpdateManyWithWhereWithoutKidooInput | TagUpdateManyWithWhereWithoutKidooInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type KidooConfigBasicUpdateOneWithoutKidooNestedInput = {
    create?: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigBasicCreateOrConnectWithoutKidooInput
    upsert?: KidooConfigBasicUpsertWithoutKidooInput
    disconnect?: KidooConfigBasicWhereInput | boolean
    delete?: KidooConfigBasicWhereInput | boolean
    connect?: KidooConfigBasicWhereUniqueInput
    update?: XOR<XOR<KidooConfigBasicUpdateToOneWithWhereWithoutKidooInput, KidooConfigBasicUpdateWithoutKidooInput>, KidooConfigBasicUncheckedUpdateWithoutKidooInput>
  }

  export type KidooConfigDreamUpdateOneWithoutKidooNestedInput = {
    create?: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutKidooInput
    upsert?: KidooConfigDreamUpsertWithoutKidooInput
    disconnect?: KidooConfigDreamWhereInput | boolean
    delete?: KidooConfigDreamWhereInput | boolean
    connect?: KidooConfigDreamWhereUniqueInput
    update?: XOR<XOR<KidooConfigDreamUpdateToOneWithWhereWithoutKidooInput, KidooConfigDreamUpdateWithoutKidooInput>, KidooConfigDreamUncheckedUpdateWithoutKidooInput>
  }

  export type TagUncheckedUpdateManyWithoutKidooNestedInput = {
    create?: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput> | TagCreateWithoutKidooInput[] | TagUncheckedCreateWithoutKidooInput[]
    connectOrCreate?: TagCreateOrConnectWithoutKidooInput | TagCreateOrConnectWithoutKidooInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutKidooInput | TagUpsertWithWhereUniqueWithoutKidooInput[]
    createMany?: TagCreateManyKidooInputEnvelope
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutKidooInput | TagUpdateWithWhereUniqueWithoutKidooInput[]
    updateMany?: TagUpdateManyWithWhereWithoutKidooInput | TagUpdateManyWithWhereWithoutKidooInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type KidooConfigBasicUncheckedUpdateOneWithoutKidooNestedInput = {
    create?: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigBasicCreateOrConnectWithoutKidooInput
    upsert?: KidooConfigBasicUpsertWithoutKidooInput
    disconnect?: KidooConfigBasicWhereInput | boolean
    delete?: KidooConfigBasicWhereInput | boolean
    connect?: KidooConfigBasicWhereUniqueInput
    update?: XOR<XOR<KidooConfigBasicUpdateToOneWithWhereWithoutKidooInput, KidooConfigBasicUpdateWithoutKidooInput>, KidooConfigBasicUncheckedUpdateWithoutKidooInput>
  }

  export type KidooConfigDreamUncheckedUpdateOneWithoutKidooNestedInput = {
    create?: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutKidooInput
    upsert?: KidooConfigDreamUpsertWithoutKidooInput
    disconnect?: KidooConfigDreamWhereInput | boolean
    delete?: KidooConfigDreamWhereInput | boolean
    connect?: KidooConfigDreamWhereUniqueInput
    update?: XOR<XOR<KidooConfigDreamUpdateToOneWithWhereWithoutKidooInput, KidooConfigDreamUpdateWithoutKidooInput>, KidooConfigDreamUncheckedUpdateWithoutKidooInput>
  }

  export type KidooCreateNestedOneWithoutTagsInput = {
    create?: XOR<KidooCreateWithoutTagsInput, KidooUncheckedCreateWithoutTagsInput>
    connectOrCreate?: KidooCreateOrConnectWithoutTagsInput
    connect?: KidooWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTagsInput = {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    connect?: UserWhereUniqueInput
  }

  export type FileCreateNestedManyWithoutTagInput = {
    create?: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput> | FileCreateWithoutTagInput[] | FileUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FileCreateOrConnectWithoutTagInput | FileCreateOrConnectWithoutTagInput[]
    createMany?: FileCreateManyTagInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput> | FileCreateWithoutTagInput[] | FileUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FileCreateOrConnectWithoutTagInput | FileCreateOrConnectWithoutTagInput[]
    createMany?: FileCreateManyTagInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type NullableEnumTagTypeFieldUpdateOperationsInput = {
    set?: $Enums.TagType | null
  }

  export type KidooUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<KidooCreateWithoutTagsInput, KidooUncheckedCreateWithoutTagsInput>
    connectOrCreate?: KidooCreateOrConnectWithoutTagsInput
    upsert?: KidooUpsertWithoutTagsInput
    connect?: KidooWhereUniqueInput
    update?: XOR<XOR<KidooUpdateToOneWithWhereWithoutTagsInput, KidooUpdateWithoutTagsInput>, KidooUncheckedUpdateWithoutTagsInput>
  }

  export type UserUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTagsInput
    upsert?: UserUpsertWithoutTagsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTagsInput, UserUpdateWithoutTagsInput>, UserUncheckedUpdateWithoutTagsInput>
  }

  export type FileUpdateManyWithoutTagNestedInput = {
    create?: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput> | FileCreateWithoutTagInput[] | FileUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FileCreateOrConnectWithoutTagInput | FileCreateOrConnectWithoutTagInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutTagInput | FileUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: FileCreateManyTagInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutTagInput | FileUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: FileUpdateManyWithWhereWithoutTagInput | FileUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type FileUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput> | FileCreateWithoutTagInput[] | FileUncheckedCreateWithoutTagInput[]
    connectOrCreate?: FileCreateOrConnectWithoutTagInput | FileCreateOrConnectWithoutTagInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutTagInput | FileUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: FileCreateManyTagInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutTagInput | FileUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: FileUpdateManyWithWhereWithoutTagInput | FileUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type TagCreateNestedOneWithoutMultimediaFilesInput = {
    create?: XOR<TagCreateWithoutMultimediaFilesInput, TagUncheckedCreateWithoutMultimediaFilesInput>
    connectOrCreate?: TagCreateOrConnectWithoutMultimediaFilesInput
    connect?: TagWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFilesInput = {
    create?: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesInput
    connect?: UserWhereUniqueInput
  }

  export type TagUpdateOneRequiredWithoutMultimediaFilesNestedInput = {
    create?: XOR<TagCreateWithoutMultimediaFilesInput, TagUncheckedCreateWithoutMultimediaFilesInput>
    connectOrCreate?: TagCreateOrConnectWithoutMultimediaFilesInput
    upsert?: TagUpsertWithoutMultimediaFilesInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutMultimediaFilesInput, TagUpdateWithoutMultimediaFilesInput>, TagUncheckedUpdateWithoutMultimediaFilesInput>
  }

  export type UserUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesInput
    upsert?: UserUpsertWithoutFilesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFilesInput, UserUpdateWithoutFilesInput>, UserUncheckedUpdateWithoutFilesInput>
  }

  export type KidooCreateNestedOneWithoutConfigBasicInput = {
    create?: XOR<KidooCreateWithoutConfigBasicInput, KidooUncheckedCreateWithoutConfigBasicInput>
    connectOrCreate?: KidooCreateOrConnectWithoutConfigBasicInput
    connect?: KidooWhereUniqueInput
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type KidooUpdateOneRequiredWithoutConfigBasicNestedInput = {
    create?: XOR<KidooCreateWithoutConfigBasicInput, KidooUncheckedCreateWithoutConfigBasicInput>
    connectOrCreate?: KidooCreateOrConnectWithoutConfigBasicInput
    upsert?: KidooUpsertWithoutConfigBasicInput
    connect?: KidooWhereUniqueInput
    update?: XOR<XOR<KidooUpdateToOneWithWhereWithoutConfigBasicInput, KidooUpdateWithoutConfigBasicInput>, KidooUncheckedUpdateWithoutConfigBasicInput>
  }

  export type KidooCreateNestedOneWithoutConfigDreamInput = {
    create?: XOR<KidooCreateWithoutConfigDreamInput, KidooUncheckedCreateWithoutConfigDreamInput>
    connectOrCreate?: KidooCreateOrConnectWithoutConfigDreamInput
    connect?: KidooWhereUniqueInput
  }

  export type KidooConfigDreamBedtimeScheduleCreateNestedManyWithoutKidooConfigDreamInput = {
    create?: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInputEnvelope
    connect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
  }

  export type KidooConfigDreamWakeupScheduleCreateNestedManyWithoutKidooConfigDreamInput = {
    create?: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInputEnvelope
    connect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput = {
    create?: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInputEnvelope
    connect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
  }

  export type KidooConfigDreamWakeupScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput = {
    create?: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInputEnvelope
    connect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
  }

  export type KidooUpdateOneRequiredWithoutConfigDreamNestedInput = {
    create?: XOR<KidooCreateWithoutConfigDreamInput, KidooUncheckedCreateWithoutConfigDreamInput>
    connectOrCreate?: KidooCreateOrConnectWithoutConfigDreamInput
    upsert?: KidooUpsertWithoutConfigDreamInput
    connect?: KidooWhereUniqueInput
    update?: XOR<XOR<KidooUpdateToOneWithWhereWithoutConfigDreamInput, KidooUpdateWithoutConfigDreamInput>, KidooUncheckedUpdateWithoutConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleUpdateManyWithoutKidooConfigDreamNestedInput = {
    create?: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    upsert?: KidooConfigDreamBedtimeScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInputEnvelope
    set?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    disconnect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    delete?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    connect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    update?: KidooConfigDreamBedtimeScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput[]
    updateMany?: KidooConfigDreamBedtimeScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput[]
    deleteMany?: KidooConfigDreamBedtimeScheduleScalarWhereInput | KidooConfigDreamBedtimeScheduleScalarWhereInput[]
  }

  export type KidooConfigDreamWakeupScheduleUpdateManyWithoutKidooConfigDreamNestedInput = {
    create?: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    upsert?: KidooConfigDreamWakeupScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInputEnvelope
    set?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    disconnect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    delete?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    connect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    update?: KidooConfigDreamWakeupScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput[]
    updateMany?: KidooConfigDreamWakeupScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput[]
    deleteMany?: KidooConfigDreamWakeupScheduleScalarWhereInput | KidooConfigDreamWakeupScheduleScalarWhereInput[]
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput = {
    create?: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    upsert?: KidooConfigDreamBedtimeScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInputEnvelope
    set?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    disconnect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    delete?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    connect?: KidooConfigDreamBedtimeScheduleWhereUniqueInput | KidooConfigDreamBedtimeScheduleWhereUniqueInput[]
    update?: KidooConfigDreamBedtimeScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput[]
    updateMany?: KidooConfigDreamBedtimeScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput[]
    deleteMany?: KidooConfigDreamBedtimeScheduleScalarWhereInput | KidooConfigDreamBedtimeScheduleScalarWhereInput[]
  }

  export type KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput = {
    create?: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput> | KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput[] | KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput[]
    connectOrCreate?: KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput[]
    upsert?: KidooConfigDreamWakeupScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput[]
    createMany?: KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInputEnvelope
    set?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    disconnect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    delete?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    connect?: KidooConfigDreamWakeupScheduleWhereUniqueInput | KidooConfigDreamWakeupScheduleWhereUniqueInput[]
    update?: KidooConfigDreamWakeupScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput[]
    updateMany?: KidooConfigDreamWakeupScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput | KidooConfigDreamWakeupScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput[]
    deleteMany?: KidooConfigDreamWakeupScheduleScalarWhereInput | KidooConfigDreamWakeupScheduleScalarWhereInput[]
  }

  export type KidooConfigDreamCreateNestedOneWithoutBedtimeSchedulesInput = {
    create?: XOR<KidooConfigDreamCreateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedCreateWithoutBedtimeSchedulesInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutBedtimeSchedulesInput
    connect?: KidooConfigDreamWhereUniqueInput
  }

  export type KidooConfigDreamUpdateOneRequiredWithoutBedtimeSchedulesNestedInput = {
    create?: XOR<KidooConfigDreamCreateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedCreateWithoutBedtimeSchedulesInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutBedtimeSchedulesInput
    upsert?: KidooConfigDreamUpsertWithoutBedtimeSchedulesInput
    connect?: KidooConfigDreamWhereUniqueInput
    update?: XOR<XOR<KidooConfigDreamUpdateToOneWithWhereWithoutBedtimeSchedulesInput, KidooConfigDreamUpdateWithoutBedtimeSchedulesInput>, KidooConfigDreamUncheckedUpdateWithoutBedtimeSchedulesInput>
  }

  export type KidooConfigDreamCreateNestedOneWithoutWakeupSchedulesInput = {
    create?: XOR<KidooConfigDreamCreateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedCreateWithoutWakeupSchedulesInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutWakeupSchedulesInput
    connect?: KidooConfigDreamWhereUniqueInput
  }

  export type KidooConfigDreamUpdateOneRequiredWithoutWakeupSchedulesNestedInput = {
    create?: XOR<KidooConfigDreamCreateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedCreateWithoutWakeupSchedulesInput>
    connectOrCreate?: KidooConfigDreamCreateOrConnectWithoutWakeupSchedulesInput
    upsert?: KidooConfigDreamUpsertWithoutWakeupSchedulesInput
    connect?: KidooConfigDreamWhereUniqueInput
    update?: XOR<XOR<KidooConfigDreamUpdateToOneWithWhereWithoutWakeupSchedulesInput, KidooConfigDreamUpdateWithoutWakeupSchedulesInput>, KidooConfigDreamUncheckedUpdateWithoutWakeupSchedulesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTagTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TagType | EnumTagTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTagTypeNullableFilter<$PrismaModel> | $Enums.TagType | null
  }

  export type NestedEnumTagTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TagType | EnumTagTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TagType[] | ListEnumTagTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTagTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TagType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTagTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTagTypeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type KidooCreateWithoutUserInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    tags?: TagCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamCreateNestedOneWithoutKidooInput
  }

  export type KidooUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    tags?: TagUncheckedCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicUncheckedCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamUncheckedCreateNestedOneWithoutKidooInput
  }

  export type KidooCreateOrConnectWithoutUserInput = {
    where: KidooWhereUniqueInput
    create: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput>
  }

  export type KidooCreateManyUserInputEnvelope = {
    data: KidooCreateManyUserInput | KidooCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TagCreateWithoutUserInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutTagsInput
    multimediaFiles?: FileCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateWithoutUserInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    kidooId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    multimediaFiles?: FileUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagCreateOrConnectWithoutUserInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput>
  }

  export type TagCreateManyUserInputEnvelope = {
    data: TagCreateManyUserInput | TagCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FileCreateWithoutUserInput = {
    id?: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tag: TagCreateNestedOneWithoutMultimediaFilesInput
  }

  export type FileUncheckedCreateWithoutUserInput = {
    id?: string
    tagId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileCreateOrConnectWithoutUserInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
  }

  export type FileCreateManyUserInputEnvelope = {
    data: FileCreateManyUserInput | FileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type KidooUpsertWithWhereUniqueWithoutUserInput = {
    where: KidooWhereUniqueInput
    update: XOR<KidooUpdateWithoutUserInput, KidooUncheckedUpdateWithoutUserInput>
    create: XOR<KidooCreateWithoutUserInput, KidooUncheckedCreateWithoutUserInput>
  }

  export type KidooUpdateWithWhereUniqueWithoutUserInput = {
    where: KidooWhereUniqueInput
    data: XOR<KidooUpdateWithoutUserInput, KidooUncheckedUpdateWithoutUserInput>
  }

  export type KidooUpdateManyWithWhereWithoutUserInput = {
    where: KidooScalarWhereInput
    data: XOR<KidooUpdateManyMutationInput, KidooUncheckedUpdateManyWithoutUserInput>
  }

  export type KidooScalarWhereInput = {
    AND?: KidooScalarWhereInput | KidooScalarWhereInput[]
    OR?: KidooScalarWhereInput[]
    NOT?: KidooScalarWhereInput | KidooScalarWhereInput[]
    id?: StringFilter<"Kidoo"> | string
    name?: StringFilter<"Kidoo"> | string
    model?: StringFilter<"Kidoo"> | string
    macAddress?: StringNullableFilter<"Kidoo"> | string | null
    bluetoothMacAddress?: StringNullableFilter<"Kidoo"> | string | null
    deviceId?: StringFilter<"Kidoo"> | string
    firmwareVersion?: StringNullableFilter<"Kidoo"> | string | null
    lastConnected?: DateTimeNullableFilter<"Kidoo"> | Date | string | null
    isConnected?: BoolFilter<"Kidoo"> | boolean
    wifiSSID?: StringNullableFilter<"Kidoo"> | string | null
    userId?: StringNullableFilter<"Kidoo"> | string | null
    isSynced?: BoolFilter<"Kidoo"> | boolean
    createdAt?: DateTimeFilter<"Kidoo"> | Date | string
    updatedAt?: DateTimeFilter<"Kidoo"> | Date | string
    brightness?: IntFilter<"Kidoo"> | number
    sleepTimeout?: IntFilter<"Kidoo"> | number
    sleepColorR?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorG?: IntNullableFilter<"Kidoo"> | number | null
    sleepColorB?: IntNullableFilter<"Kidoo"> | number | null
    sleepEffect?: IntNullableFilter<"Kidoo"> | number | null
  }

  export type TagUpsertWithWhereUniqueWithoutUserInput = {
    where: TagWhereUniqueInput
    update: XOR<TagUpdateWithoutUserInput, TagUncheckedUpdateWithoutUserInput>
    create: XOR<TagCreateWithoutUserInput, TagUncheckedCreateWithoutUserInput>
  }

  export type TagUpdateWithWhereUniqueWithoutUserInput = {
    where: TagWhereUniqueInput
    data: XOR<TagUpdateWithoutUserInput, TagUncheckedUpdateWithoutUserInput>
  }

  export type TagUpdateManyWithWhereWithoutUserInput = {
    where: TagScalarWhereInput
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyWithoutUserInput>
  }

  export type TagScalarWhereInput = {
    AND?: TagScalarWhereInput | TagScalarWhereInput[]
    OR?: TagScalarWhereInput[]
    NOT?: TagScalarWhereInput | TagScalarWhereInput[]
    id?: StringFilter<"Tag"> | string
    tagId?: StringNullableFilter<"Tag"> | string | null
    uid?: StringNullableFilter<"Tag"> | string | null
    name?: StringNullableFilter<"Tag"> | string | null
    type?: EnumTagTypeNullableFilter<"Tag"> | $Enums.TagType | null
    kidooId?: StringFilter<"Tag"> | string
    userId?: StringFilter<"Tag"> | string
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
  }

  export type FileUpsertWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
  }

  export type FileUpdateWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>
  }

  export type FileUpdateManyWithWhereWithoutUserInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutUserInput>
  }

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[]
    OR?: FileScalarWhereInput[]
    NOT?: FileScalarWhereInput | FileScalarWhereInput[]
    id?: StringFilter<"File"> | string
    tagId?: StringFilter<"File"> | string
    userId?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    path?: StringFilter<"File"> | string
    fileName?: StringFilter<"File"> | string
    originalName?: StringFilter<"File"> | string
    size?: IntFilter<"File"> | number
    mimeType?: StringFilter<"File"> | string
    order?: IntFilter<"File"> | number
    disabled?: BoolFilter<"File"> | boolean
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
  }

  export type UserCreateWithoutKidoosInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutKidoosInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutKidoosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutKidoosInput, UserUncheckedCreateWithoutKidoosInput>
  }

  export type TagCreateWithoutKidooInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTagsInput
    multimediaFiles?: FileCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateWithoutKidooInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    multimediaFiles?: FileUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagCreateOrConnectWithoutKidooInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput>
  }

  export type TagCreateManyKidooInputEnvelope = {
    data: TagCreateManyKidooInput | TagCreateManyKidooInput[]
    skipDuplicates?: boolean
  }

  export type KidooConfigBasicCreateWithoutKidooInput = {
    id?: string
    storageTotalBytes?: bigint | number | null
    storageFreeBytes?: bigint | number | null
    storageUsedBytes?: bigint | number | null
    storageFreePercent?: number | null
    storageUsedPercent?: number | null
    storageLastUpdated?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigBasicUncheckedCreateWithoutKidooInput = {
    id?: string
    storageTotalBytes?: bigint | number | null
    storageFreeBytes?: bigint | number | null
    storageUsedBytes?: bigint | number | null
    storageFreePercent?: number | null
    storageUsedPercent?: number | null
    storageLastUpdated?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigBasicCreateOrConnectWithoutKidooInput = {
    where: KidooConfigBasicWhereUniqueInput
    create: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
  }

  export type KidooConfigDreamCreateWithoutKidooInput = {
    id?: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleCreateNestedManyWithoutKidooConfigDreamInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamUncheckedCreateWithoutKidooInput = {
    id?: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamCreateOrConnectWithoutKidooInput = {
    where: KidooConfigDreamWhereUniqueInput
    create: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
  }

  export type UserUpsertWithoutKidoosInput = {
    update: XOR<UserUpdateWithoutKidoosInput, UserUncheckedUpdateWithoutKidoosInput>
    create: XOR<UserCreateWithoutKidoosInput, UserUncheckedCreateWithoutKidoosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutKidoosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutKidoosInput, UserUncheckedUpdateWithoutKidoosInput>
  }

  export type UserUpdateWithoutKidoosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutKidoosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TagUpsertWithWhereUniqueWithoutKidooInput = {
    where: TagWhereUniqueInput
    update: XOR<TagUpdateWithoutKidooInput, TagUncheckedUpdateWithoutKidooInput>
    create: XOR<TagCreateWithoutKidooInput, TagUncheckedCreateWithoutKidooInput>
  }

  export type TagUpdateWithWhereUniqueWithoutKidooInput = {
    where: TagWhereUniqueInput
    data: XOR<TagUpdateWithoutKidooInput, TagUncheckedUpdateWithoutKidooInput>
  }

  export type TagUpdateManyWithWhereWithoutKidooInput = {
    where: TagScalarWhereInput
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyWithoutKidooInput>
  }

  export type KidooConfigBasicUpsertWithoutKidooInput = {
    update: XOR<KidooConfigBasicUpdateWithoutKidooInput, KidooConfigBasicUncheckedUpdateWithoutKidooInput>
    create: XOR<KidooConfigBasicCreateWithoutKidooInput, KidooConfigBasicUncheckedCreateWithoutKidooInput>
    where?: KidooConfigBasicWhereInput
  }

  export type KidooConfigBasicUpdateToOneWithWhereWithoutKidooInput = {
    where?: KidooConfigBasicWhereInput
    data: XOR<KidooConfigBasicUpdateWithoutKidooInput, KidooConfigBasicUncheckedUpdateWithoutKidooInput>
  }

  export type KidooConfigBasicUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigBasicUncheckedUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageTotalBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreeBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageUsedBytes?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    storageFreePercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageUsedPercent?: NullableIntFieldUpdateOperationsInput | number | null
    storageLastUpdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamUpsertWithoutKidooInput = {
    update: XOR<KidooConfigDreamUpdateWithoutKidooInput, KidooConfigDreamUncheckedUpdateWithoutKidooInput>
    create: XOR<KidooConfigDreamCreateWithoutKidooInput, KidooConfigDreamUncheckedCreateWithoutKidooInput>
    where?: KidooConfigDreamWhereInput
  }

  export type KidooConfigDreamUpdateToOneWithWhereWithoutKidooInput = {
    where?: KidooConfigDreamWhereInput
    data: XOR<KidooConfigDreamUpdateWithoutKidooInput, KidooConfigDreamUncheckedUpdateWithoutKidooInput>
  }

  export type KidooConfigDreamUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUpdateManyWithoutKidooConfigDreamNestedInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamUncheckedUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooCreateWithoutTagsInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    user?: UserCreateNestedOneWithoutKidoosInput
    configBasic?: KidooConfigBasicCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamCreateNestedOneWithoutKidooInput
  }

  export type KidooUncheckedCreateWithoutTagsInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    userId?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    configBasic?: KidooConfigBasicUncheckedCreateNestedOneWithoutKidooInput
    configDream?: KidooConfigDreamUncheckedCreateNestedOneWithoutKidooInput
  }

  export type KidooCreateOrConnectWithoutTagsInput = {
    where: KidooWhereUniqueInput
    create: XOR<KidooCreateWithoutTagsInput, KidooUncheckedCreateWithoutTagsInput>
  }

  export type UserCreateWithoutTagsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    kidoos?: KidooCreateNestedManyWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTagsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    kidoos?: KidooUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTagsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
  }

  export type FileCreateWithoutTagInput = {
    id?: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateWithoutTagInput = {
    id?: string
    userId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileCreateOrConnectWithoutTagInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput>
  }

  export type FileCreateManyTagInputEnvelope = {
    data: FileCreateManyTagInput | FileCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type KidooUpsertWithoutTagsInput = {
    update: XOR<KidooUpdateWithoutTagsInput, KidooUncheckedUpdateWithoutTagsInput>
    create: XOR<KidooCreateWithoutTagsInput, KidooUncheckedCreateWithoutTagsInput>
    where?: KidooWhereInput
  }

  export type KidooUpdateToOneWithWhereWithoutTagsInput = {
    where?: KidooWhereInput
    data: XOR<KidooUpdateWithoutTagsInput, KidooUncheckedUpdateWithoutTagsInput>
  }

  export type KidooUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    user?: UserUpdateOneWithoutKidoosNestedInput
    configBasic?: KidooConfigBasicUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    configBasic?: KidooConfigBasicUncheckedUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUncheckedUpdateOneWithoutKidooNestedInput
  }

  export type UserUpsertWithoutTagsInput = {
    update: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
    create: XOR<UserCreateWithoutTagsInput, UserUncheckedCreateWithoutTagsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTagsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTagsInput, UserUncheckedUpdateWithoutTagsInput>
  }

  export type UserUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    kidoos?: KidooUpdateManyWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    kidoos?: KidooUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type FileUpsertWithWhereUniqueWithoutTagInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutTagInput, FileUncheckedUpdateWithoutTagInput>
    create: XOR<FileCreateWithoutTagInput, FileUncheckedCreateWithoutTagInput>
  }

  export type FileUpdateWithWhereUniqueWithoutTagInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutTagInput, FileUncheckedUpdateWithoutTagInput>
  }

  export type FileUpdateManyWithWhereWithoutTagInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutTagInput>
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    kidoos?: KidooCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    kidoos?: KidooUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    kidoos?: KidooUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    kidoos?: KidooUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    kidoos?: KidooCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    kidoos?: KidooUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    kidoos?: KidooUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    kidoos?: KidooUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TagCreateWithoutMultimediaFilesInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutTagsInput
    user: UserCreateNestedOneWithoutTagsInput
  }

  export type TagUncheckedCreateWithoutMultimediaFilesInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    kidooId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagCreateOrConnectWithoutMultimediaFilesInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutMultimediaFilesInput, TagUncheckedCreateWithoutMultimediaFilesInput>
  }

  export type UserCreateWithoutFilesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    kidoos?: KidooCreateNestedManyWithoutUserInput
    tags?: TagCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFilesInput = {
    id?: string
    email: string
    emailVerified?: Date | string | null
    name?: string | null
    avatar?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    kidoos?: KidooUncheckedCreateNestedManyWithoutUserInput
    tags?: TagUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
  }

  export type TagUpsertWithoutMultimediaFilesInput = {
    update: XOR<TagUpdateWithoutMultimediaFilesInput, TagUncheckedUpdateWithoutMultimediaFilesInput>
    create: XOR<TagCreateWithoutMultimediaFilesInput, TagUncheckedCreateWithoutMultimediaFilesInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutMultimediaFilesInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutMultimediaFilesInput, TagUncheckedUpdateWithoutMultimediaFilesInput>
  }

  export type TagUpdateWithoutMultimediaFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutTagsNestedInput
    user?: UserUpdateOneRequiredWithoutTagsNestedInput
  }

  export type TagUncheckedUpdateWithoutMultimediaFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    kidooId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutFilesInput = {
    update: XOR<UserUpdateWithoutFilesInput, UserUncheckedUpdateWithoutFilesInput>
    create: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFilesInput, UserUncheckedUpdateWithoutFilesInput>
  }

  export type UserUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    kidoos?: KidooUpdateManyWithoutUserNestedInput
    tags?: TagUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    kidoos?: KidooUncheckedUpdateManyWithoutUserNestedInput
    tags?: TagUncheckedUpdateManyWithoutUserNestedInput
  }

  export type KidooCreateWithoutConfigBasicInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    user?: UserCreateNestedOneWithoutKidoosInput
    tags?: TagCreateNestedManyWithoutKidooInput
    configDream?: KidooConfigDreamCreateNestedOneWithoutKidooInput
  }

  export type KidooUncheckedCreateWithoutConfigBasicInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    userId?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    tags?: TagUncheckedCreateNestedManyWithoutKidooInput
    configDream?: KidooConfigDreamUncheckedCreateNestedOneWithoutKidooInput
  }

  export type KidooCreateOrConnectWithoutConfigBasicInput = {
    where: KidooWhereUniqueInput
    create: XOR<KidooCreateWithoutConfigBasicInput, KidooUncheckedCreateWithoutConfigBasicInput>
  }

  export type KidooUpsertWithoutConfigBasicInput = {
    update: XOR<KidooUpdateWithoutConfigBasicInput, KidooUncheckedUpdateWithoutConfigBasicInput>
    create: XOR<KidooCreateWithoutConfigBasicInput, KidooUncheckedCreateWithoutConfigBasicInput>
    where?: KidooWhereInput
  }

  export type KidooUpdateToOneWithWhereWithoutConfigBasicInput = {
    where?: KidooWhereInput
    data: XOR<KidooUpdateWithoutConfigBasicInput, KidooUncheckedUpdateWithoutConfigBasicInput>
  }

  export type KidooUpdateWithoutConfigBasicInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    user?: UserUpdateOneWithoutKidoosNestedInput
    tags?: TagUpdateManyWithoutKidooNestedInput
    configDream?: KidooConfigDreamUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateWithoutConfigBasicInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: TagUncheckedUpdateManyWithoutKidooNestedInput
    configDream?: KidooConfigDreamUncheckedUpdateOneWithoutKidooNestedInput
  }

  export type KidooCreateWithoutConfigDreamInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    user?: UserCreateNestedOneWithoutKidoosInput
    tags?: TagCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicCreateNestedOneWithoutKidooInput
  }

  export type KidooUncheckedCreateWithoutConfigDreamInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    userId?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
    tags?: TagUncheckedCreateNestedManyWithoutKidooInput
    configBasic?: KidooConfigBasicUncheckedCreateNestedOneWithoutKidooInput
  }

  export type KidooCreateOrConnectWithoutConfigDreamInput = {
    where: KidooWhereUniqueInput
    create: XOR<KidooCreateWithoutConfigDreamInput, KidooUncheckedCreateWithoutConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamBedtimeScheduleCreateOrConnectWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    create: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInputEnvelope = {
    data: KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInput | KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInput[]
    skipDuplicates?: boolean
  }

  export type KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamWakeupScheduleCreateOrConnectWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
    create: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInputEnvelope = {
    data: KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInput | KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInput[]
    skipDuplicates?: boolean
  }

  export type KidooUpsertWithoutConfigDreamInput = {
    update: XOR<KidooUpdateWithoutConfigDreamInput, KidooUncheckedUpdateWithoutConfigDreamInput>
    create: XOR<KidooCreateWithoutConfigDreamInput, KidooUncheckedCreateWithoutConfigDreamInput>
    where?: KidooWhereInput
  }

  export type KidooUpdateToOneWithWhereWithoutConfigDreamInput = {
    where?: KidooWhereInput
    data: XOR<KidooUpdateWithoutConfigDreamInput, KidooUncheckedUpdateWithoutConfigDreamInput>
  }

  export type KidooUpdateWithoutConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    user?: UserUpdateOneWithoutKidoosNestedInput
    tags?: TagUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateWithoutConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: TagUncheckedUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUncheckedUpdateOneWithoutKidooNestedInput
  }

  export type KidooConfigDreamBedtimeScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    update: XOR<KidooConfigDreamBedtimeScheduleUpdateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateWithoutKidooConfigDreamInput>
    create: XOR<KidooConfigDreamBedtimeScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedCreateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamBedtimeScheduleWhereUniqueInput
    data: XOR<KidooConfigDreamBedtimeScheduleUpdateWithoutKidooConfigDreamInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamBedtimeScheduleScalarWhereInput
    data: XOR<KidooConfigDreamBedtimeScheduleUpdateManyMutationInput, KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamBedtimeScheduleScalarWhereInput = {
    AND?: KidooConfigDreamBedtimeScheduleScalarWhereInput | KidooConfigDreamBedtimeScheduleScalarWhereInput[]
    OR?: KidooConfigDreamBedtimeScheduleScalarWhereInput[]
    NOT?: KidooConfigDreamBedtimeScheduleScalarWhereInput | KidooConfigDreamBedtimeScheduleScalarWhereInput[]
    id?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamBedtimeSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamBedtimeSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamBedtimeSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamBedtimeSchedule"> | Date | string
  }

  export type KidooConfigDreamWakeupScheduleUpsertWithWhereUniqueWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
    update: XOR<KidooConfigDreamWakeupScheduleUpdateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedUpdateWithoutKidooConfigDreamInput>
    create: XOR<KidooConfigDreamWakeupScheduleCreateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedCreateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamWakeupScheduleUpdateWithWhereUniqueWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamWakeupScheduleWhereUniqueInput
    data: XOR<KidooConfigDreamWakeupScheduleUpdateWithoutKidooConfigDreamInput, KidooConfigDreamWakeupScheduleUncheckedUpdateWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamWakeupScheduleUpdateManyWithWhereWithoutKidooConfigDreamInput = {
    where: KidooConfigDreamWakeupScheduleScalarWhereInput
    data: XOR<KidooConfigDreamWakeupScheduleUpdateManyMutationInput, KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamInput>
  }

  export type KidooConfigDreamWakeupScheduleScalarWhereInput = {
    AND?: KidooConfigDreamWakeupScheduleScalarWhereInput | KidooConfigDreamWakeupScheduleScalarWhereInput[]
    OR?: KidooConfigDreamWakeupScheduleScalarWhereInput[]
    NOT?: KidooConfigDreamWakeupScheduleScalarWhereInput | KidooConfigDreamWakeupScheduleScalarWhereInput[]
    id?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    kidooConfigDreamId?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    weekday?: StringFilter<"KidooConfigDreamWakeupSchedule"> | string
    hour?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    minute?: IntFilter<"KidooConfigDreamWakeupSchedule"> | number
    activated?: BoolFilter<"KidooConfigDreamWakeupSchedule"> | boolean
    createdAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"KidooConfigDreamWakeupSchedule"> | Date | string
  }

  export type KidooConfigDreamCreateWithoutBedtimeSchedulesInput = {
    id?: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutConfigDreamInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamUncheckedCreateWithoutBedtimeSchedulesInput = {
    id?: string
    kidooId: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamCreateOrConnectWithoutBedtimeSchedulesInput = {
    where: KidooConfigDreamWhereUniqueInput
    create: XOR<KidooConfigDreamCreateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedCreateWithoutBedtimeSchedulesInput>
  }

  export type KidooConfigDreamUpsertWithoutBedtimeSchedulesInput = {
    update: XOR<KidooConfigDreamUpdateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedUpdateWithoutBedtimeSchedulesInput>
    create: XOR<KidooConfigDreamCreateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedCreateWithoutBedtimeSchedulesInput>
    where?: KidooConfigDreamWhereInput
  }

  export type KidooConfigDreamUpdateToOneWithWhereWithoutBedtimeSchedulesInput = {
    where?: KidooConfigDreamWhereInput
    data: XOR<KidooConfigDreamUpdateWithoutBedtimeSchedulesInput, KidooConfigDreamUncheckedUpdateWithoutBedtimeSchedulesInput>
  }

  export type KidooConfigDreamUpdateWithoutBedtimeSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutConfigDreamNestedInput
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamUncheckedUpdateWithoutBedtimeSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wakeupSchedules?: KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamCreateWithoutWakeupSchedulesInput = {
    id?: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    kidoo: KidooCreateNestedOneWithoutConfigDreamInput
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamUncheckedCreateWithoutWakeupSchedulesInput = {
    id?: string
    kidooId: string
    colorR?: number | null
    colorG?: number | null
    colorB?: number | null
    brightness?: number | null
    allNight?: boolean
    effect?: string | null
    wakeupColorR?: number | null
    wakeupColorG?: number | null
    wakeupColorB?: number | null
    wakeupBrightness?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedCreateNestedManyWithoutKidooConfigDreamInput
  }

  export type KidooConfigDreamCreateOrConnectWithoutWakeupSchedulesInput = {
    where: KidooConfigDreamWhereUniqueInput
    create: XOR<KidooConfigDreamCreateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedCreateWithoutWakeupSchedulesInput>
  }

  export type KidooConfigDreamUpsertWithoutWakeupSchedulesInput = {
    update: XOR<KidooConfigDreamUpdateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedUpdateWithoutWakeupSchedulesInput>
    create: XOR<KidooConfigDreamCreateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedCreateWithoutWakeupSchedulesInput>
    where?: KidooConfigDreamWhereInput
  }

  export type KidooConfigDreamUpdateToOneWithWhereWithoutWakeupSchedulesInput = {
    where?: KidooConfigDreamWhereInput
    data: XOR<KidooConfigDreamUpdateWithoutWakeupSchedulesInput, KidooConfigDreamUncheckedUpdateWithoutWakeupSchedulesInput>
  }

  export type KidooConfigDreamUpdateWithoutWakeupSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutConfigDreamNestedInput
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type KidooConfigDreamUncheckedUpdateWithoutWakeupSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    kidooId?: StringFieldUpdateOperationsInput | string
    colorR?: NullableIntFieldUpdateOperationsInput | number | null
    colorG?: NullableIntFieldUpdateOperationsInput | number | null
    colorB?: NullableIntFieldUpdateOperationsInput | number | null
    brightness?: NullableIntFieldUpdateOperationsInput | number | null
    allNight?: BoolFieldUpdateOperationsInput | boolean
    effect?: NullableStringFieldUpdateOperationsInput | string | null
    wakeupColorR?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorG?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupColorB?: NullableIntFieldUpdateOperationsInput | number | null
    wakeupBrightness?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bedtimeSchedules?: KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type KidooCreateManyUserInput = {
    id?: string
    name: string
    model?: string
    macAddress?: string | null
    bluetoothMacAddress?: string | null
    deviceId: string
    firmwareVersion?: string | null
    lastConnected?: Date | string | null
    isConnected?: boolean
    wifiSSID?: string | null
    isSynced?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    brightness?: number
    sleepTimeout?: number
    sleepColorR?: number | null
    sleepColorG?: number | null
    sleepColorB?: number | null
    sleepEffect?: number | null
  }

  export type TagCreateManyUserInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    kidooId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileCreateManyUserInput = {
    id?: string
    tagId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: TagUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
    tags?: TagUncheckedUpdateManyWithoutKidooNestedInput
    configBasic?: KidooConfigBasicUncheckedUpdateOneWithoutKidooNestedInput
    configDream?: KidooConfigDreamUncheckedUpdateOneWithoutKidooNestedInput
  }

  export type KidooUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    macAddress?: NullableStringFieldUpdateOperationsInput | string | null
    bluetoothMacAddress?: NullableStringFieldUpdateOperationsInput | string | null
    deviceId?: StringFieldUpdateOperationsInput | string
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    lastConnected?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    wifiSSID?: NullableStringFieldUpdateOperationsInput | string | null
    isSynced?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    brightness?: IntFieldUpdateOperationsInput | number
    sleepTimeout?: IntFieldUpdateOperationsInput | number
    sleepColorR?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorG?: NullableIntFieldUpdateOperationsInput | number | null
    sleepColorB?: NullableIntFieldUpdateOperationsInput | number | null
    sleepEffect?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TagUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kidoo?: KidooUpdateOneRequiredWithoutTagsNestedInput
    multimediaFiles?: FileUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    kidooId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    multimediaFiles?: FileUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    kidooId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tag?: TagUpdateOneRequiredWithoutMultimediaFilesNestedInput
  }

  export type FileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateManyKidooInput = {
    id?: string
    tagId?: string | null
    uid?: string | null
    name?: string | null
    type?: $Enums.TagType | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTagsNestedInput
    multimediaFiles?: FileUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    multimediaFiles?: FileUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateManyWithoutKidooInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: NullableStringFieldUpdateOperationsInput | string | null
    uid?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableEnumTagTypeFieldUpdateOperationsInput | $Enums.TagType | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileCreateManyTagInput = {
    id?: string
    userId: string
    url: string
    path: string
    fileName: string
    originalName: string
    size: number
    mimeType: string
    order?: number
    disabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUncheckedUpdateManyWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    disabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleCreateManyKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamWakeupScheduleCreateManyKidooConfigDreamInput = {
    id?: string
    weekday: string
    hour: number
    minute: number
    activated?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUpdateWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedUpdateWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamBedtimeScheduleUncheckedUpdateManyWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleUpdateWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleUncheckedUpdateWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KidooConfigDreamWakeupScheduleUncheckedUpdateManyWithoutKidooConfigDreamInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekday?: StringFieldUpdateOperationsInput | string
    hour?: IntFieldUpdateOperationsInput | number
    minute?: IntFieldUpdateOperationsInput | number
    activated?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}