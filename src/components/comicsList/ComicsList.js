import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]),
          [offset, setOffset] = useState(10),
          [comicsEnded, setComicsEnded] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        console.log('update');
        getAllComics(offset)
            .then(processingComicsList)
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

    const comics = comicsList.map((item, index) => {
        const {name, thumbnail, price, id} = item;

        return (
            <CSSTransition key={index} timeout={500} classNames="comics__item">
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

    const errorMessage = error ? <Error /> : null,
          spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {comics}
                </TransitionGroup>
            </ul>
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