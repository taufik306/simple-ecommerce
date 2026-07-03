export const banner = {
  name: 'banner',
  type: 'document',
  title: 'Banner',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: 'imageUrl',
      type: 'image',
      title: 'Image URL',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isActive',
      type: 'boolean',
      title: 'Is Active',
      initialValue: false,
    },
    {
      name: 'displayOrder',
      type: 'number',
      title: 'Display Order',
    },
  ],
}
