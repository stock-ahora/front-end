import { AUTH_PROVIDER, Login } from '@/config/Global'
import { TruStockRole } from '@/enums/rol-type.enum'

// ====== STATIC (actual) ======
const staticUser = {
  name: 'Usuario Demo',
  username: 'demo@truestock.local',
  localAccountId: 'mock_001',
  idTokenClaims: { roles: [TruStockRole.ADMIN] }
}
const staticRoles = [TruStockRole.ADMIN]

// ====== AZURE (tu implementación actual) ======
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AccountInfo,
  InteractionRequiredAuthError,
  PublicClientApplication,
  SilentRequest
} from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    clientId: process.env.AZURE as string,
    authority: 'https://login.microsoftonline.com/e2805430-ca04-4f08-a658-8c0a3a59dea3' as string,
    redirectUri: process.env.AZURE_REDIRECT_URI as string
  },
  cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false }
}
export const msalInstance = new PublicClientApplication(msalConfig)
const getFirstAccount = (): AccountInfo | null => {
  const accounts = msalInstance.getAllAccounts()
  return accounts.length > 0 ? accounts[0] : null
}
const createSilentRequest = (account: AccountInfo): SilentRequest => ({
  scopes: [`api://${msalConfig.auth.clientId}/App.Use`],
  account
})
const handleTokenAcquisitionError = async (err: any, silentRequest: SilentRequest) => {
  if (err instanceof InteractionRequiredAuthError) {
    try {
      const response = await msalInstance.acquireTokenPopup(silentRequest)
      return response.accessToken
    } catch (error) { console.error('Failed to acquire token interactively', error) }
  } else {
    console.error('Failed to acquire token silently', err)
  }
  return null
}

// ====== GOOGLE (futuro NextAuth) ======
// Aquí podríamos leer desde next-auth si ACTIVAS ese proveedor.

// ====== AWS (Cognito) — placeholder ======
// Cuando conectes Cognito, cambia estas funciones para:
/// - usar Amplify Auth, o
/// - @aws-sdk/client-cognito-identity-provider + Hosted UI
const awsGetUser = () => {
  // por ahora devolvemos mock hasta que conectes Cognito
  return staticUser
}
const awsGetRoles = () => {
  // define tu estrategia de roles desde idToken o tu API
  return [TruStockRole.OPERATOR] // ej: operador por defecto
}
const awsGetAccessToken = async () => {
  // si usas Hosted UI + OAuth, puedes guardar el idToken en storage o cookies y leerlo aquí
  return null
}

// ====== API pública que usa el provider ======
export const getAccessToken = async (): Promise<string | null> => {
  switch (AUTH_PROVIDER) {
    case 'azure': {
      if (!Login) return null
      const account = getFirstAccount()
      if (!account) return null
      const silentRequest = createSilentRequest(account)
      try {
        const response = await msalInstance.acquireTokenSilent(silentRequest)
        return response.accessToken
      } catch (err) {
        return await handleTokenAcquisitionError(err, silentRequest)
      }
    }
    case 'aws':
      return await awsGetAccessToken()
    case 'google':
      return null // en NextAuth normalmente no necesitas token aquí
    case 'static':
    default:
      return null
  }
}

export const getAuthenticatedUser = () => {
  switch (AUTH_PROVIDER) {
    case 'azure': return getFirstAccount()
    case 'aws':   return awsGetUser()
    case 'google': // si habilitas next-auth, léelo desde getSession() o useSession()
      return staticUser
    case 'static':
    default:
      return staticUser
  }
}

export const getAuthenticatedUserRoles = (): string[] => {
  switch (AUTH_PROVIDER) {
    case 'azure': {
      const account = getFirstAccount()
      const roles = (account?.idTokenClaims as any)?.roles
      return Array.isArray(roles) ? roles : []
    }
    case 'aws':
      return awsGetRoles()
    case 'google':
      return staticRoles // o derivar de email si quieres
    case 'static':
    default:
      return staticRoles
  }
}
