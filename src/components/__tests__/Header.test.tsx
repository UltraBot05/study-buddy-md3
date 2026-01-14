/**
 * Unit tests for Header component
 * Tests title display and responsive behavior
 * Requirements: 5.1
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import Header from '../Header';

describe('Header Component', () => {
  it('should display the application title', () => {
    render(React.createElement(Header));
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('AI Study Assistant');
  });

  it('should have the correct CSS classes for styling', () => {
    render(React.createElement(Header));
    
    const header = screen.getByRole('banner');
    const title = screen.getByRole('heading', { level: 1 });
    
    expect(header).toHaveClass('header');
    expect(title).toHaveClass('header-title');
  });

  it('should render as a semantic header element', () => {
    render(React.createElement(Header));
    
    const header = screen.getByRole('banner');
    expect(header.tagName).toBe('HEADER');
  });

  it('should have proper heading hierarchy', () => {
    render(React.createElement(Header));
    
    // Should have exactly one h1 element
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0].tagName).toBe('H1');
  });

  it('should be accessible with proper ARIA roles', () => {
    render(React.createElement(Header));
    
    // Header should have banner role (implicit)
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Title should have heading role (implicit)
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
});