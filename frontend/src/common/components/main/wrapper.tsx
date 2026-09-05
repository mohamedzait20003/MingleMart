import { type ReactNode, type FC, Suspense } from "react";

import { Spinner } from "../ui/spinner";

const Wrapper: FC<{ children: ReactNode, islazy: boolean }> = ({ children, islazy }) => {
    return islazy ? (
        <Suspense fallback={<Spinner />}>
            {children}
        </Suspense>
    ) : (
        <>{children}</>
    );
};

export default Wrapper;