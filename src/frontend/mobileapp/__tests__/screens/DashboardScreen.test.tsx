import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

// Pattern für React Native Screen Tests.
// Eigenen Screen einbinden wenn vorhanden:
// import DashboardScreen from '../../app/dashboard'

// Expo Router mocken
vi.mock('expo-router', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  Link:      ({ children }: { children: React.ReactNode }) => children,
}))

// Supabase mocken
vi.mock('../../lib/supabase', () => ({
  supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) } },
}))

// Minimaler Stub-Screen
const DashboardScreen = ({ userName = 'Max' }: { userName?: string }) => {
  const { View, Text } = require('react-native')
  return (
    <View>
      <Text>Dashboard</Text>
      <Text>Willkommen, {userName}</Text>
    </View>
  )
}

describe('DashboardScreen', () => {
  it('rendert Dashboard-Titel', () => {
    render(<DashboardScreen />)
    expect(screen.getByText('Dashboard')).toBeTruthy()
  })

  it('rendert Begrüßung mit Username', () => {
    render(<DashboardScreen userName="Anna" />)
    expect(screen.getByText('Willkommen, Anna')).toBeTruthy()
  })
})
