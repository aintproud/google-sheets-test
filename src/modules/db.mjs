import knex from 'knex'
import config from '../config.mjs'
export default knex({
	client: 'postgresql',
	connection: config.db.url,
})
