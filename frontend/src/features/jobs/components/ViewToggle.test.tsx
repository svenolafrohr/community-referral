import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ViewToggle } from './ViewToggle'

describe('ViewToggle', () => {
  it('marks the active mode as pressed', () => {
    render(<ViewToggle value="grid" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Show as tiles' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Show as cards' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Show as list' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the selected mode', () => {
    const onChange = vi.fn()
    render(<ViewToggle value="grid" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show as cards' }))
    expect(onChange).toHaveBeenCalledWith('stack')
  })
})
