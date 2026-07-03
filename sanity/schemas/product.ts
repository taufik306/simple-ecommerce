export const product = {
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    {
      name: 'sku',
      type: 'string',
      title: 'SKU Code',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      type: 'string',
      title: 'Product Name',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'mainImage',
      type: 'image',
      title: 'Product Image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Product Description',
    },
  ],
}
