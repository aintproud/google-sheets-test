import config from '../config.mjs'
import db from './db.mjs'
import logger from './logger.mjs'

const myHeaders = new Headers()
myHeaders.append('Authorization', config.wb.TOKEN)

/**
 * @param {string} date - date in format 'yyyy-mm-dd'
 * @returns {Promise<void>}
 * @description load box data from wildberries api
 */
export async function loadBoxData(date) {
  const url = new URL(config.wb.BOX_URL)
  url.searchParams.append('date', date)

  let targetData
  try {
    const data = await fetch(url, {
      method: 'GET',
      headers: myHeaders,
    })
    const json = await data.json()
    targetData = json.response.data.warehouseList
  } catch (error) {
    logger.error(error)
    return
  }
  logger.info(`Fetched data for ${date}`)

  for (const item of targetData) {
    const {
      warehouseName,
      boxDeliveryAndStorageExpr,
      boxDeliveryBase,
      boxDeliveryLiter,
      boxStorageBase,
      boxStorageLiter,
    } = item
    if (await db('record').where({ date, warehouseName }).first()) {
      await db('record').where({ date, warehouseName }).update({
        boxDeliveryAndStorageExpr,
        boxDeliveryBase,
        boxDeliveryLiter,
        boxStorageBase,
        boxStorageLiter,
      })
    } else {
      await db('record').insert({
        date,
        warehouseName,
        boxDeliveryAndStorageExpr,
        boxDeliveryBase,
        boxDeliveryLiter,
        boxStorageBase,
        boxStorageLiter,
      })
    }
  }
	logger.info(`Saved data for ${date}`)
}
