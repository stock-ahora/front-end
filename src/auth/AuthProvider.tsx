'use client'

import React, { ReactNode } from 'react'
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react'
import { msalInstance } from './msal'
import { InteractionType } from '@azure/msal-browser'

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        {children}
      </MsalAuthenticationTemplate>
    </MsalProvider>
  )
}

export default AuthProvider
