import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { describe, it, expect, vi } from 'vitest'

// Pattern für React Native Komponenten-Tests.
// Eigene Komponente einbinden wenn vorhanden:
// import { LoginButton } from '../../components/LoginButton'

const LoginButton = ({
  label    = 'Einloggen',
  onPress  = () => {},
  disabled = false,
  loading  = false,
}: {
  label?:    string
  onPress?:  () => void
  disabled?: boolean
  loading?:  boolean
}) => {
  const { Pressable, Text, ActivityIndicator } = require('react-native')
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button">
      {loading
        ? <ActivityIndicator testID="loading-indicator" />
        : <Text>{label}</Text>
      }
    </Pressable>
  )
}

describe('LoginButton', () => {
  it('rendert Label', () => {
    render(<LoginButton label="Einloggen" />)
    expect(screen.getByText('Einloggen')).toBeTruthy()
  })

  it('ruft onPress auf beim Tippen', () => {
    const onPress = vi.fn()
    render(<LoginButton onPress={onPress} />)
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('ruft onPress nicht auf wenn disabled', () => {
    const onPress = vi.fn()
    render(<LoginButton onPress={onPress} disabled />)
    fireEvent.press(screen.getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('zeigt Ladeindikator wenn loading', () => {
    render(<LoginButton loading />)
    expect(screen.getByTestId('loading-indicator')).toBeTruthy()
  })
})
