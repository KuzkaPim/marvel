import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

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

const CharList = ({onSelectedChar, selectedChar}) => {

    const [charList, setCharList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [charsEnded, setCharsEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllCharacters(offset)
            .then(processingCharList)
            .then(() => setProcess('confirm'));
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

    const renderItems = () => {
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

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {chars}
                </TransitionGroup>
            </ul>
        )
    }

    return (
        <div className="char__list">
            {setContent(process, () => renderItems(), newItemLoading)}
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