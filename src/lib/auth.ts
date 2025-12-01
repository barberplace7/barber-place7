import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    const { payload } = await jwtVerify(sessionCookie.value, secret);
    
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      role: payload.role as string,
      cabangId: payload.cabangId as string | null,
      selectedKasirId: payload.selectedKasirId as string | null
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth(requiredRole?: string) {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (requiredRole && session.role !== requiredRole && session.role !== 'ADMIN') {
    throw new Error('Insufficient permissions');
  }
  
  return session;
}

export async function requireBranchAccess(requestedCabangId: string) {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  // Admin can access all branches
  if (session.role === 'ADMIN') {
    return session;
  }
  
  // Kasir (cabang1/cabang2 login) can only access their own branch data
  if (session.role === 'KASIR' && session.cabangId !== requestedCabangId) {
    throw new Error('Branch access denied - cabang1 cannot access cabang2 data');
  }
  
  return session;
}