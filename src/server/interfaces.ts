import { Request, Response } from 'express'

// Exporting classes instead of interfaces 'cause *Rollup TS Plugin*
// doestn't allow to export/import interfaces

export class ITypeGraphQLContext {
  public req: Request
  public res: Response
}
