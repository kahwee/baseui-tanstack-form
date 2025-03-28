import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';

const engine = new Styletron();

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        {children}
      </BaseProvider>
    </StyletronProvider>
  );
}

// Custom render function with explicit return type
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Export custom render and other utilities
export * from '@testing-library/react';
export { customRender as render };
