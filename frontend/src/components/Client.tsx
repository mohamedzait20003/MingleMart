import { useEffect, type ReactNode } from 'react';
import { persistStore } from 'redux-persist';

import store from '../store';

const Client = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const persistor = persistStore(store);
        persistor.persist();
    }, []);

    return <>{children}</>;
}

export default Client;
