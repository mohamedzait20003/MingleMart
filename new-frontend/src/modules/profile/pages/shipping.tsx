import { type FC } from 'react';

const Shipping: FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Settings</h1>
            <div className="space-y-4">
                <p className="text-gray-600">Manage your shipping addresses and delivery preferences.</p>
                {/* Add shipping addresses form here */}
            </div>
        </div>
    );
};

export default Shipping;