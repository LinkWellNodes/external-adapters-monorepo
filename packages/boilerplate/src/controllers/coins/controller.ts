import { AdapterError, Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, AdapterRequest } from '@chainlink/types'
import { selectors, reducers } from '@linkpool/shared'

import api from '../../api'
import input from './input'
import type { ICoin } from '../../models/coin'

const controller: ExecuteWithConfig<Config> = async (request: AdapterRequest, _, config) => {
  const validator = new Validator(request, input)
  const client = api(config)

  const jobRunID = validator.validated.id

  try {
    let result = await client.coins.list()

    const filter = validator.validated.data.filter
    if (filter) {
      result = selectors.filterKeyValueInArray(result, 'symbol', filter.split(','))
    }

    const parse = validator.validated.data.parse
    if (parse) {
      result = reducers.reduceByKeys(result, parse.split(',')) as ICoin[]
    }

    return Requester.success(jobRunID, { data: result }, true)
  } catch (error) {
    throw new AdapterError({
      jobRunID,
      statusCode: 200,
      message: `Unexpected error returning coins endpoint. Reason: ${error}`,
      cause: error,
    })
  }
}

export default controller
