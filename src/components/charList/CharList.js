import { useState, useEffect } from 'react';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import MarvelService from '../../services/MarvelService';
import Char from '../char/Char';

const CharList = ({onSelectedChar, selectedChar}) => {

    const [charList, setCharList] = useState([]),
          [loading, setLoading] = useState(true),
          [error, setError] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [charsEnded, setCharsEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
            onCharListLoading();
            marvelService
                .getAllCharacters(offset)
                .then(processingCharList)
                .catch(onError)
        }

    const processingCharList = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setError(error => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharsEnded(charsEnded => ended);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onError = () => {
        setLoading(loading => false);
        setError(false);
    }
    
    const chars = charList.map(item => {
        return (
            <Char
                clazz={selectedChar === item.id ? 'char__item char__item_selected' : 'char__item'}
                key={item.id}
                thumbnail={item.thumbnail}
                name={item.name}
                onSelectedChar={() => onSelectedChar(item.id)}
            />
        )
    });

    const errorMessage = error ? <Error /> : null,
            spinner = loading ? <Spinner /> : null,
            content = !(loading || error) ? chars : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            <ul className="char__grid">
                {content}
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