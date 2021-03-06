import { Request, Response } from 'express'

// Exporting classes instead of interfaces 'cause *Rollup TS Plugin*
// doestn't allow to export/import interfaces

export class IGQLContext {
  public req: Request
  public res: Response
}

export class IServerInfo {
  public links: string
}
