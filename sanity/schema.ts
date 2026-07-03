import { type SchemaTypeDefinition } from 'sanity'
import { banner } from './schemas/banner'
import { product } from './schemas/product'
import { storeSettings } from './schemas/storeSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [storeSettings, banner, product],
}
