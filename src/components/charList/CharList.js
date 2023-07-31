import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './charList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import useMarvelService from '../../services/MarvelService';

const CharList = ({onSelectedChar, selectedChar}) => {

    const [charList, setCharList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [charsEnded, setCharsEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        console.log('update');
        getAllCharacters(offset)
            .then(processingCharList)
    }

    const processingCharList = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharsEnded(charsEnded => ended);
    }

    const chars = charList.map((item, index) => {
        let imgStyle = {'objectFit': 'cover'};
        if (item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
            imgStyle = {'objectFit': 'unset'};
        }
        const clazz = selectedChar === item.id ? 'char__item char__item_selected' : 'char__item';

        return (
            <CSSTransition 
                key={index} 
                timeout={500} 
                classNames="char__item">
                <li
                    tabIndex={0} 
                    onClick={() => {
                        onSelectedChar(item.id);
                    }}
                    onKeyPress={(e) => {
                        e.preventDefault();
                        if (e.key === ' ' || e.key === "Enter") {
                            onSelectedChar(item.id);
                        }
                    }} 
                    className={clazz}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            </CSSTransition>
        )
    });

    const errorMessage = error ? <Error /> : null,
            spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {chars}
                </TransitionGroup>
            </ul>
            <button
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                className="button button__main button__long"
                style={{'display': charsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;