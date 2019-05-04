import { initdb } from './dbconnection'

initdb()
  .then((): void => process.exit())
  .catch((err): void => console.error(err))
