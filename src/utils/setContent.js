import Spinner from '../components/spinner/Spinner';
import Error from '../components/error/Error';
import Skeleton from '../components/skeleton/Skeleton';

const setContent = (process, Component, data) => {
    switch (process) {
        case 'waiting':
            return <Skeleton />;
            break;
        case 'loading':
            return <Spinner />;
            break;
        case 'confirm':
            return <Component data={data}/>;
            break;
        case 'error':
            return <Error />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

export default setContent;