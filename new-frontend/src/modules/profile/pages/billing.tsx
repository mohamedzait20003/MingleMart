import { type FC } from 'react';

const Billing: FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing Settings</h1>
            <div className="space-y-4">
                <p className="text-gray-600">Manage your payment methods and billing information.</p>
                {/* Add payment methods form here */}
            </div>
        </div>
    );
};

export default Billing;