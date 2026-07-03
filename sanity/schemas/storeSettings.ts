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
    {
      name: 'pricingFormat',
      title: 'Pricing Format',
      type: 'object',
      description: 'Format options for how prices are displayed on the storefront.',
      fields: [
        {
          name: 'symbolPosition',
          title: 'Symbol Position',
          type: 'string',
          options: {
            list: [
              { title: 'Before Price (e.g. $100)', value: 'before' },
              { title: 'After Price (e.g. 100$)', value: 'after' },
            ],
            layout: 'radio',
          },
          initialValue: 'before',
        },
        {
          name: 'addSpace',
          title: 'Add space between symbol and price',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'thousandSeparator',
          title: 'Thousand Separator',
          type: 'string',
          initialValue: ',',
        },
        {
          name: 'decimalSeparator',
          title: 'Decimal Separator',
          type: 'string',
          initialValue: '.',
        },
        {
          name: 'decimalPlaces',
          title: 'Decimal Places',
          type: 'number',
          initialValue: 2,
        },
      ],
    },
  ],
}
