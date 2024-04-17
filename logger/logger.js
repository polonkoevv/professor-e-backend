import pino from 'pino'
import pretty from 'pino-pretty'

// Логирование 
export default pino(pretty({
    level: 'info',
    sync: true
}));