import { Component } from 'react';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import MarvelService from '../../services/MarvelService';
import Char from '../char/Char';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charsEnded: false
    }

    marvelService = new MarvelService();

    processingCharList = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            error: false,
            newItemLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.processingCharList)
            .catch(this.onError)
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    componentDidMount() {
        this.onRequest();
    }

    render() {
        const {charList, error, loading, newItemLoading, offset, charsEnded} = this.state,
              {onSelectedChar, selectedChar} = this.props;
        const chars = charList.map(item => {
            return (
                <Char
                    clazz={selectedChar === item.id ? 'char__item char__item_selected' : 'char__item'}
                    key={item.id}
                    thumbnail={item.thumbnail}
                    name={item.name}
                    onSelectedChar={() => onSelectedChar(item.id)}
                    ref={this.setRef}/>
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
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long"
                    style={{'display': charsEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;