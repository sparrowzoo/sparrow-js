import type {ReactNode} from "react";

export default function IndexLayout({children}: {children: ReactNode}) {
    return <html lang="zh"><body>{children}</body></html>;
}
