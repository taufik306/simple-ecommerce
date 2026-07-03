export const storeSettings = {
  name: 'storeSettings',
  type: 'document',
  title: 'Store Settings',
  fields: [
    {
      name: 'currencySymbol',
      type: 'string',
      title: 'Currency Symbol',
      initialValue: '$',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'whatsappNumber',
      type: 'string',
      title: 'WhatsApp Number',
      description: 'Include country code, no +, no spaces',
      validation: (Rule: any) => Rule.required(),
    },
  ],
}
