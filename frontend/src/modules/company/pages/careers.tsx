import { type FC } from 'react';
import { Business, Group, TrendingUp, Favorite, LocationOn, Work } from '@mui/icons-material';

const Careers: FC = () => {
    const positions = [
        {
            title: 'Senior Full Stack Developer',
            department: 'Engineering',
            location: 'Remote / New York, NY',
            type: 'Full-time',
            description: 'Build and maintain scalable e-commerce solutions using modern web technologies.'
        },
        {
            title: 'Product Manager',
            department: 'Product',
            location: 'San Francisco, CA',
            type: 'Full-time',
            description: 'Drive product strategy and roadmap for our e-commerce platform.'
        },
        {
            title: 'UX/UI Designer',
            department: 'Design',
            location: 'Remote / Los Angeles, CA',
            type: 'Full-time',
            description: 'Create intuitive and beautiful user experiences for millions of shoppers.'
        },
        {
            title: 'Customer Success Manager',
            department: 'Customer Service',
            location: 'Remote',
            type: 'Full-time',
            description: 'Help our customers succeed and ensure they have exceptional experiences.'
        },
        {
            title: 'Data Analyst',
            department: 'Analytics',
            location: 'Boston, MA',
            type: 'Full-time',
            description: 'Transform data into actionable insights to drive business decisions.'
        },
        {
            title: 'DevOps Engineer',
            department: 'Engineering',
            location: 'Remote / Seattle, WA',
            type: 'Full-time',
            description: 'Build and maintain robust infrastructure and deployment pipelines.'
        }
    ];

    const benefits = [
        {
            icon: <Business className="text-3xl" />,
            title: 'Competitive Salary',
            description: 'Top-of-market compensation packages with equity options'
        },
        {
            icon: <Group className="text-3xl" />,
            title: 'Great Team',
            description: 'Work with talented, passionate people who love what they do'
        },
        {
            icon: <TrendingUp className="text-3xl" />,
            title: 'Growth Opportunities',
            description: 'Continuous learning and career development programs'
        },
        {
            icon: <Favorite className="text-3xl" />,
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance and wellness benefits'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8">
                        Help us build the future of e-commerce
                    </p>
                    <a
                        href="#positions"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        View Open Positions
                    </a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why ZCommerce?</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We're building something special, and we want you to be part of it. At ZCommerce,
                        you'll work on challenging problems, collaborate with exceptional people, and make
                        a real impact on millions of customers worldwide.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Culture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-600">Innovation First</h3>
                            <p className="text-gray-600">
                                We encourage creativity and experimentation. Your ideas matter, and we provide
                                the resources to turn them into reality.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-purple-600">Work-Life Balance</h3>
                            <p className="text-gray-600">
                                We believe in working smart, not just hard. Flexible schedules, remote work
                                options, and generous PTO help you maintain balance.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-green-600">Diversity & Inclusion</h3>
                            <p className="text-gray-600">
                                We're committed to building a diverse, inclusive workplace where everyone
                                feels valued and empowered to do their best work.
                            </p>
                        </div>
                    </div>
                </div>
                <div id="positions" className="scroll-mt-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
                    <div className="space-y-4">
                        {positions.map((position, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <Business className="text-sm mr-1" />
                                                {position.department}
                                            </span>
                                            <span className="flex items-center">
                                                <LocationOn className="text-sm mr-1" />
                                                {position.location}
                                            </span>
                                            <span className="flex items-center">
                                                <Work className="text-sm mr-1" />
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
                                        Apply Now
                                    </button>
                                </div>
                                <p className="text-gray-600">{position.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 text-center text-gray-600">
                    <p className="text-sm">
                        ZCommerce is an equal opportunity employer. We celebrate diversity and are committed to
                        creating an inclusive environment for all employees. We do not discriminate on the basis
                        of race, religion, color, national origin, gender, sexual orientation, age, marital status,
                        veteran status, or disability status.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Careers;