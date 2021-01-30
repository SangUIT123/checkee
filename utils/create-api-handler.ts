import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
// import { CheckeeConfig, getConfig } from '..'

export type CheckeeApiHandler<
  T = any,
  H extends CheckeeHandlers = {},
  Options extends {} = {}
> = (
  req: NextApiRequest,
  res: NextApiResponse<CheckeeApiResponse<T>>,
  // config: CheckeeConfig,
  handlers: H,
  // Custom configs that may be used by a particular handler
  options: Options
) => void | Promise<void>

// export interface CheckeeApiHandler2<
//   T = any,
//   H extends CheckeeHandlers = {},
//   Options extends {} = {}
// > {
//   (
//     req: NextApiRequest,
//     res: NextApiResponse<CheckeeApiResponse<T>>,
//     // config: CheckeeConfig,
//     handlers: H,
//     // Custom configs that may be used by a particular handler
//     options: Options,
//   ): void | Promise<void>
// }

export type CheckeeHandler<T = any, Body = null> = (options: {
  req: NextApiRequest
  res: NextApiResponse<CheckeeApiResponse<T>>
  // config: CheckeeConfig
  body: Body
}) => void | Promise<void>

export type CheckeeHandlers<T = any> = {
  [k: string]: CheckeeHandler<T, any>
}

export type CheckeeApiResponse<T> = {
  data: T | null
  errors?: { message: string; code?: string }[]
}

export default function createApiHandler<
  T = any,
  H extends CheckeeHandlers = {},
  Options extends {} = {}
>(
  handler: CheckeeApiHandler<T, H, Options>,
  handlers: H,
  defaultOptions: Options
) {
  return function getApiHandler({
    // config,
    operations,
    options,
  }: {
    // config?: CheckeeConfig
    operations?: Partial<H>
    options?: Options extends {} ? Partial<Options> : never
  } = {}): NextApiHandler {
    const ops = { ...operations, ...handlers }
    const opts = { ...defaultOptions, ...options }

    return function apiHandler(req, res) {
      return handler(req, res, /* getConfig(config), */ ops, opts)
    }
  }
}
