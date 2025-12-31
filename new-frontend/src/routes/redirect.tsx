import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Redirect: FC = () => {
    const navigate = useNavigate();
    const { role } = useSelector((state: any) => state.auth);
    
    if(role === 'admin') {
        navigate('/admin');
    } else if(role === 'client') {
        navigate('/shop');
    } else {
        navigate('/home');
    }

    return null;
}

export default Redirect