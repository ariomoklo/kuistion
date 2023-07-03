/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError, type ZodFormattedError } from "zod";
import { useDatabase, type DatabaseHookReturn } from "../firebase";

export type RepoReturnFormat<T extends Record<string, any>, TErr = any> = TErr extends any ?
  { success: true, data: T } | { success: false, errors: ZodFormattedError<T> } :
  { success: true, data: T } | { success: false, errors: ZodFormattedError<TErr> }

export function createErrorReturn<T>(errorFormat: ZodFormattedError<T>) {
  return { success: false, errors: errorFormat } as { success: false, errors: ZodFormattedError<T> }
}

export class Repo {

  protected db: DatabaseHookReturn

  constructor() {
    this.db = useDatabase()
  }

  static catchFail<T>(error: any) {
    if (error instanceof ZodError) return { success: false, errors: error.format() } as { success: false, errors: ZodFormattedError<T> }
    return { success: false, errors: { _errors: ['Something is wrong, please try again later.'] } } as { success: false, errors: ZodFormattedError<T> }
  }

  static fail<T>(errors: ZodFormattedError<T>) {
    return { success: false, errors: errors } as { success: false, errors: ZodFormattedError<T> }
  }

  static success<T>(data: T) {
    return { success: true, data } as { success: true, data: T }
  }

  static getdb() {
    return useDatabase()
  }

}