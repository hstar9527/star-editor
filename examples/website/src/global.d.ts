interface Window {
  MSStream: boolean;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
  }
}

declare module JSX {
  interface IntrinsicElements {
    "em-emoji": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
