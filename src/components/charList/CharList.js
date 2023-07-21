import { useState, useEffect } from 'react';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import useMarvelService from '../../services/MarvelService';
import Char from '../char/Char';

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
        getAllCharacters(offset)
            .then(processingCharList)
    }

    const processingCharList = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharsEnded(charsEnded => ended);
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
            spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            <ul className="char__grid">
                {chars}
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