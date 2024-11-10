import { pino } from 'pino'

const consoleTransport = {
	target: 'pino-pretty',
	options: {
		levelFirst: true,
		colorize: true,
		translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
		ignore: 'pid,hostname',
	},
}
const transports = pino.transport({
	targets: [consoleTransport],
})
export const logger = pino(transports)

export default logger
