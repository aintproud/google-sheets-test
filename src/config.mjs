export default {
	db: {
		URL: 'postgresql://user:password@localhost:5432/postgres',
	},
	wb: {
		TOKEN: '',
		BOX_URL: 'https://common-api.wildberries.ru/api/v1/tariffs/box',
	},
	google: {
		CREDATIONALS_FILE_PATH: `${process.cwd()}/creds.json`,
		TOKEN_FILE_PATH: `${process.cwd()}/token.json`,
		// тут id всех спредшитов
		SPREEDSHEET_IDS: [],
		SHEET_NAME: 'stocks_coefs',
		SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
	},
}
