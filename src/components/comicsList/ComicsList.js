import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner />;
            break;
        case 'confirm':
            return <Component/>;
            break;
        case 'error':
            return <Error />;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]),
          [offset, setOffset] = useState(10),
          [comicsEnded, setComicsEnded] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false);

    const {loading, error, getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllComics(offset)
            .then(processingComicsList)
            .then(() => setProcess('confirm'));
    }

    const processingComicsList = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    const renderItems = () => {
        const comics = comicsList.map((item, index) => {
            const {name, thumbnail, price, id} = item;
    
            return (
                <CSSTransition 
                    key={index} 
                    timeout={500} 
                    classNames="comics__item">
                        <li className="comics__item">
                            <Link to={`/comics/${id}`}>
                                <img src={thumbnail} alt={name} className="comics__item-img"/>
                                <div className="comics__item-name">{name}</div>
                                <div className="comics__item-price">{price}</div>
                            </Link>
                        </li>
                </CSSTransition>
            );
        });

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {comics}
                </TransitionGroup>
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(), newItemLoading)}
            <button
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                className="button button__main button__long"
                style={{'display': comicsEnded ? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;