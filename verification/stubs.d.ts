declare namespace JSX { interface IntrinsicAttributes { key?: any } interface IntrinsicElements { [elementName: string]: any } }
declare module "react" {
  export type ReactNode = any;
  export type CSSProperties = Record<string, string | number | undefined>;
  export function cache<T extends (...args: any[]) => any>(fn: T): T;
  export function useEffect(effect: () => void | (() => void), deps: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(value: T | null): { current: T | null };
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];
}
declare module "next" {
  export type Metadata = any;
  export type NextConfig = any;
  export namespace MetadataRoute { type Robots = any; type Sitemap = any; }
}
declare module "next/link" { const Link: any; export default Link; }
declare module "next/image" { const Image: any; export default Image; }
declare module "next/script" { const Script: any; export default Script; }
declare module "next/navigation" { export function notFound(): never; export function useRouter(): { push(url: string): void; replace(url: string): void }; }
declare module "next/og" { export class ImageResponse extends Response { constructor(element: any, options?: any); } }
declare module "*.module.css" { const classes: Record<string, string>; export default classes; }
declare const process: { env: Record<string, string | undefined> };
declare module "react/jsx-runtime" { export const jsx: any; export const jsxs: any; export const Fragment: any; }
