import { authenticate } from '@google-cloud/local-auth'
import { promises as fs } from 'fs'
import { Auth, google } from 'googleapis'
import config from '../config.mjs'
import db from './db.mjs'

const { SCOPES, SHEET_NAME, TOKEN_FILE_PATH, CREDATIONALS_FILE_PATH } = config.google

/**
 * Reads previously authorized credentials from the save file.
 * @return {Promise<Auth.AuthClient|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_FILE_PATH, 'utf8')
		const credentials = JSON.parse(content)
		return google.auth.fromJSON(credentials)
	} catch (err) {
		return null
	}
}

/**
 * Saves credentials to the file.
 * @param {Auth.AuthClient} client OAuth2 client
 */
async function saveCredentials(client) {
	const content = await fs.readFile(CREDATIONALS_FILE_PATH, 'utf-8')
	const keys = JSON.parse(content)
	const key = keys.installed || keys.web
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	})
	await fs.writeFile(TOKEN_FILE_PATH, payload)
}

/**
 * Authorizes Google API client. If credentials are saved, load them. Otherwise
 * authenticate and save credentials.
 * @return {Promise<Auth.AuthClient>} authorized client
 */
async function authorize() {
	let client = await loadSavedCredentialsIfExist()
	if (client) {
		return client
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDATIONALS_FILE_PATH,
	})
	if (client.credentials) {
		await saveCredentials(client)
	}
	return client
}

const googleSheets = google.sheets({ version: 'v4', auth: await authorize() })

/**
 * Updates Google Sheets spreadsheet with current data from DB.
 * @param {string} spreadsheetId - spreadsheet id
 * @returns {Promise<void>}
 */
export async function updateSpreadsheet(spreadsheetId) {
	const data = await db('record').select().orderBy('date', 'desc')
	const spreadsheet = await googleSheets.spreadsheets.get({
		spreadsheetId,
	})

	await googleSheets.spreadsheets.batchUpdate({
		spreadsheetId,
		requestBody: {
			requests: [
				{
					deleteSheet: {
						sheetId: spreadsheet.data.sheets?.find(
							(item) => item.properties?.title === SHEET_NAME,
						)?.properties?.sheetId,
					},
				},
			],
		},
	})
	await googleSheets.spreadsheets.batchUpdate({
		spreadsheetId,
		requestBody: {
			requests: [
				{
					addSheet: {
						properties: {
							title: SHEET_NAME,
						},
					},
				},
			],
		},
	})
	await googleSheets.spreadsheets.values.batchUpdate({
		spreadsheetId,
		requestBody: {
			data: [
				{
					range: `${SHEET_NAME}!1:1`,
					values: [
						[
							'date',
							'boxDeliveryAndStorageExpr',
							'boxDeliveryBase',
							'boxDeliveryLiter',
							'boxStorageBase',
							'boxStorageLiter',
							'warehouseName',
						],
					],
				},
				{
					range: `${SHEET_NAME}!A2`,
					values: data.map((item) => [
						item.date,
						item.boxDeliveryAndStorageExpr,
						item.boxDeliveryBase,
						item.boxDeliveryLiter,
						item.boxStorageBase,
						item.boxStorageLiter,
						item.warehouseName,
					]),
				},
			],
			valueInputOption: 'USER_ENTERED',
		},
	})
}
