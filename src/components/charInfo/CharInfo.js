import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null),
          [loading, setLoading] = useState(false),
          [error, setError] = useState(false);

    const marvelService = new MarvelService();

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onCharLoading = () => {
        setLoading(true);
        setError(false);
    }

    const onCharacterLoaded = (char) => {
        setChar(char)
        setLoading(false);
        setError(false);
    }

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading()
        marvelService
            .getCharacter(charId)
            .then(onCharacterLoaded)
            .catch(onError)
    }
    
    useEffect(() => {
        updateChar();
    }, [props.charId])

    const skeleton = char || loading || error ? null : <Skeleton />,
          errorMessage = error ? <Error /> : null,
          spinner = loading ? <Spinner /> : null,
          content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit': 'unset'};
    }

    const viewComics = comics.length ?
        comics.map((item, i) => {
            if (i < 10) {
                return (
                    <li key={i} className="char__comics-item">
                        <a href={item.resourceURI}>{item.name}</a>
                    </li>
                )
            }
        }) :
        <div>Для этого персонажа нет комиксов</div>;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description}</div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {viewComics}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;