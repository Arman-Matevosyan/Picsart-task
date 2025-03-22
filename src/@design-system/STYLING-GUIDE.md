# Styling Best Practices Guide

This document outlines the best practices for styling components in our application using styled-components to maintain performance and consistency.

## Performance Optimizations

### 1. Prop Filtering

Always filter props that shouldn't be passed to the DOM to prevent invalid HTML attributes and optimize rendering:

```tsx
import { shouldForwardProp } from '@design-system/utils/styleUtils';

// Simple approach - use the utility directly
const Card = styled.div.withConfig({
  shouldForwardProp: shouldForwardProp,
})`
  // your styles
`;

// For component-specific props
import { createPropFilter } from '@design-system/utils/styleUtils';
const buttonPropFilter = createPropFilter(['isLoading', 'iconPosition']);

const Button = styled.button.withConfig({
  shouldForwardProp: buttonPropFilter,
})`
  // your styles
`;
```

### 2. Transient Props

Use the `$` prefix for styled-component props to prevent them from being passed to the DOM:

```tsx
// Bad - these props will be passed to the DOM
const Button = styled.button<{ primary: boolean; size: string }>`
  background: ${props => props.primary ? 'blue' : 'white'};
  font-size: ${props => props.size === 'large' ? '20px' : '16px'};
`;

// Good - transient props won't be passed to the DOM
const Button = styled.button<{ $primary: boolean; $size: string }>`
  background: ${props => props.$primary ? 'blue' : 'white'};
  font-size: ${props => props.$size === 'large' ? '20px' : '16px'};
`;
```

### 3. Memoization

Always use memoization for styled component props and values:

```tsx
const Component = () => {
  // Bad - creates new theme toggle function on every render
  const toggleTheme = () => setTheme(prev => !prev);
  
  // Good - function reference remains stable
  const toggleTheme = useCallback(() => {
    setTheme(prev => !prev);
  }, []);
  
  // Bad - creates new context value object on every render
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>
  
  // Good - context value only changes when dependencies change
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={contextValue}>
};
```

## Style Architecture

### 1. Component Organization

- Place all styled components at the top of the file, before the main component
- Group related styled components together
- Export only the main component, not the styled sub-components

### 2. Theme Usage

Always use the theme for consistent values:

```tsx
// Bad - hardcoded values
const Button = styled.button`
  border-radius: 4px;
  color: #333;
`;

// Good - values from theme
const Button = styled.button`
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
```

### 3. Media Queries

Use the theme's breakpoints for consistent responsive design:

```tsx
const Container = styled.div`
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 80%;
  }
`;
```

## Advanced Techniques

### 1. Component Composition

Prefer composition over complex style inheritance:

```tsx
// Instead of extending styles in complex ways
const Button = styled.button`/* base styles */`;
const PrimaryButton = styled(Button)`/* primary styles */`;

// Prefer composition with variants
const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  /* Base styles */
  
  /* Variant-specific styles */
  background: ${props => props.$variant === 'primary' ? 'blue' : 'gray'};
`;
```

### 2. Performance Monitoring

Use the React Developer Tools Profiler to identify unnecessary re-renders caused by style changes.

### 3. Server-Side Rendering

For SSR compatibility, ensure all theme access is done safely:

```tsx
// Dangerous - accessing theme before it exists
const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
  }
`;

// Safe - theme is guaranteed to exist
const ThemeAwareComponent = () => {
  const theme = useTheme();
  return <div style={{ background: theme.colors.background }} />;
};
```

## References

- [Styled Components Documentation](https://styled-components.com/docs)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Chrome DevTools for Performance](https://developer.chrome.com/docs/devtools/) 