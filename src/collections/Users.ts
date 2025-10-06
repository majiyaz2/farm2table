import type { CollectionConfig } from 'payload'
import {tenantsArrayField} from "@payloadcms/plugin-multi-tenant/fields"
import { cookies } from 'next/headers'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",

  arrayFieldAccess: {
    read: () => true,
    update: () => true,
    create: () => true,
  },
  tenantFieldAccess:{
    read: () => true,
    update: () => true,
    create: () => true,
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  hooks: {
    // Add this new hook
    afterLogout: [
      async ({ req }) => {
        const cookiePrefix = req.payload.config.cookiePrefix || 'payload';
        const tenantCookieName = `${cookiePrefix}-tenant`;
        const cookiesStore = await cookies();
        cookiesStore.delete(tenantCookieName);
        return req.user; 
      },
    ],
  },
  auth: true,
  fields: [
    {
      name: 'username',
      required: true,
      unique: true,
      type: 'text',
    },
    {
      admin: {
        position: "sidebar"
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options:["super_admin", "user"],
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar"
      }
    }
  ],
}
