import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
            error: false
        })
    }

    onCharacterLoaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false
        })
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharacterLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    render() {
        const {char, loading, error} = this.state,
              skeleton = char || loading || error ? null : <Skeleton />,
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

export default CharInfo;