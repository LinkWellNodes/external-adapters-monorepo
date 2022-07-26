import { AdapterError, util } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

import lanceria from './lanceria'
import { Provider } from './constants'

export default (config: Config) => {
  const provider = util.getRequiredEnv('API_PROVIDER')

  switch (provider) {
    case Provider.LANCERIA:
      return lanceria(config)
    default: {
      const message = `Unsupported provider: ${provider}. Check API_PROVIDER env var`
      throw new AdapterError({
        statusCode: 200,
        message,
        cause: message,
      })
    }
  }
}
