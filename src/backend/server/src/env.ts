import { config } from 'dotenv'
import { resolve } from 'path'

// .env aus dem Projekt-Root laden (3 Ebenen hoch: server/src → server → backend → src → Root)
config({ path: resolve(__dirname, '../../../../.env') })
