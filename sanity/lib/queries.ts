import { groq } from 'next-sanity'

export const getStoreSettingsQuery = groq`*[_type == "storeSettings"][0]`
export const getActiveBannersQuery = groq`*[_type == "banner" && isActive == true] | order(displayOrder asc)`
export const getAllProductsQuery = groq`*[_type == "product"]`
export const getProductByIdQuery = groq`*[_type == "product" && _id == $id][0]`
