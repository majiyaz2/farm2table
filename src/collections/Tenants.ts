import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: 'name',
      required: true,
      unique: true,
      type: 'text',
      label: 'Store Name',
      admin: {
        description: 'The name of the store (eg. Farm2Table)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      required: true,
      unique: true,
      admin: {
        description: 'The slug of the store (eg. farm2table)',
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      admin:{
        readOnly: true,
      }
    },
    {
        name: "stripeDetailsSubscription",
        type: "checkbox",
        admin:{
            readOnly: true,
            description: "You cannot create products until you submit your stripe details"
        }
    }
  ],
}
