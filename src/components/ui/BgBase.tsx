import React, { forwardRef, ReactNode, SVGProps } from 'react';

export type IconBaseProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  viewBox?: string;
  children: ReactNode;
  width?: number | string;
  height?: number | string;
};

const defaultAttrs = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2 as number,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const BgBase = forwardRef<SVGSVGElement, IconBaseProps>(
  ({
    viewBox = '0 0 24 24',
    width = "24px",
    height = "24px",
    children,
    ...props
  }, ref) => (
    <svg
      ref={ref}
      viewBox={viewBox}
      width={width}
      height={height}
      role={props['aria-label'] ? 'img' : 'presentation'}
      aria-hidden={props['aria-label'] ? 'false' : 'true'}
      {...defaultAttrs}
      {...props}
    >
      {children}
    </svg>
  )
);

BgBase.displayName = 'BgBase';



