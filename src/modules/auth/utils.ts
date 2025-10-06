import {cookies as getCookies} from "next/headers"

interface Props {
    prefix: string
    value: string
}

export const generateAuthCookie = async ({
    prefix, 
    value
}: Props) => {
    const cookies = await getCookies()
    cookies.set({
        name: `${prefix}-token`, 
        value,
        httpOnly: true,
        path: "/",    
    })
}
export const generateTenantCookie = async ({
    prefix, 
    value
}: Props) => {
    const cookies = await getCookies()
    cookies.set({
        name: `${prefix}-tenant`, 
        value,
        httpOnly: true,
        path: "/",  
        maxAge: 7200,
    })
}

// utils.ts

import type { Payload } from 'payload';

export async function completeAuthFlow({
  payload,
  userId,
  token,
}: {
  payload: Payload;
  userId: string;
  token: string;
}) {
  const cookiePrefix = payload.config.cookiePrefix || 'payload';

  // Set auth token
  const cookiesStore = await getCookies();
  cookiesStore.set(`${cookiePrefix}-token`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Fetch user's tenants
  const user = await payload.findByID({
    collection: 'users',
    id: userId,
    depth: 1,
  });

  const tenants = user.tenants || [];
  if (tenants.length === 0) {
    throw new Error('No tenants assigned to user');
  }

  // Auto-select first tenant (or add logic for a default)
  const tenantValue = tenants[0].tenant;
  const defaultTenantId = typeof tenantValue === 'string' 
    ? tenantValue 
    : tenantValue.id;

  // Set tenant cookie
  cookiesStore.set(`${cookiePrefix}-tenant`, defaultTenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { userId, tenantId: defaultTenantId };
}