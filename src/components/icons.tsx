import type { SVGProps } from 'react';

export const Icons = {
  octopus: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7.5 12.5c0-2.8 2.2-5 5-5s5 2.2 5 5c0 2.8-2.2 5-5 5s-5-2.2-5-5" />
      <path d="M4.5 12.5c0-5.5 4.5-10 10-10" />
      <path d="M19.5 12.5c0-5.5-4.5-10-10-10" />
      <path d="M6 18.5c-2-1-3.5-3.5-3.5-6" />
      <path d="M18 18.5c2-1 3.5-3.5 3.5-6" />
      <path d="M10 21.5c-2.5 0-4.5-2-4.5-4.5" />
      <path d="M14 21.5c2.5 0 4.5-2 4.5-4.5" />
    </svg>
  ),
};
