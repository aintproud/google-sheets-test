
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	return knex.schema.createTable('record', (table) => {
		table.increments('id').primary()
		table.date('date').notNullable()
		table.integer('boxDeliveryAndStorageExpr')
		table.integer('boxDeliveryBase')
    table.integer('boxDeliveryLiter')
    table.integer('boxStorageBase')
    table.integer('boxStorageLiter')
    table.string('warehouseName')
		table.index('date')
		table.index('warehouseName')
	})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	return knex.schema.dropTable('record')
}