import isPropValid from "@emotion/is-prop-valid";

/**
 * Utility functions for styled-components to improve performance
 * 
 * These functions help prevent DOM attributes pollution by filtering out
 * props that should not be passed to the DOM elements.
 */

/**
 * Common props that styled-components should not forward to the DOM
 * to prevent "unknown prop" React warnings and optimize rendering
 */
export const commonTransientProps = [
  'variant',
  'fullWidth',
  'active',
  'disabled',
  'size',
  'elevation',
  'rounded',
  'outlined',
  'color',
  'align',
  'justify',
  'direction',
  'margin',
  'padding',
  'gap',
  'selected',
  'expanded',
  'loading',
  'intensity',
  'position',
  'isOpen',
  'priority',
  'fit',
  'isPriority'
];

/**
 * A reusable shouldForwardProp function that combines both @emotion/is-prop-valid
 * and our custom transient props filtering
 * 
 * Usage:
 * ```
 * const Button = styled('button', { shouldForwardProp: shouldForwardProp })`
 *   // styles
 * `;
 * ```
 */
export const shouldForwardProp = (prop: string): boolean => {
  return isPropValid(prop) && !commonTransientProps.includes(prop);
};

/**
 * Creates a custom prop filter function that also filters specific props
 * 
 * @param additionalProps - Additional props that should not be forwarded to the DOM
 * @returns A shouldForwardProp function that filters the common props and the additional props
 * 
 * Usage:
 * ```
 * const Card = styled('div', { 
 *   shouldForwardProp: createPropFilter(['elevation', 'hoverable']) 
 * })`
 *   // styles
 * `;
 * ```
 */
export const createPropFilter = (additionalProps: string[] = []) => {
  return (prop: string): boolean => {
    return isPropValid(prop) && 
      !commonTransientProps.includes(prop) && 
      !additionalProps.includes(prop);
  };
}; 