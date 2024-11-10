import cron from 'node-cron'
import logger from './modules/logger.mjs'
import { loadBoxData } from './modules/wb-http.mjs'
import config from './config.mjs'
import { updateSpreadsheet } from './modules/google-sheets.mjs'

cron.schedule('0 * * * *', () => {
	const date = new Date()

	logger.info(`Cron job is running for ${date.toISOString()}`)

	logger.info('Loading box data...')
	loadBoxData(date.toISOString().slice(0, 10))
	logger.info('Box data loaded')

	logger.info('Updating spreadsheets...')
	config.google.SPREEDSHEET_IDS.forEach((spreadsheetId) => {
		updateSpreadsheet(spreadsheetId)
	})
	logger.info('Spreadsheets updated')

	logger.info(`Cron job completed for ${date.toISOString()}`)
})
