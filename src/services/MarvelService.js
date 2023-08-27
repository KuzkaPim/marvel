import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=eb8aed350156aa4586437ed9f36552cf';
    const _baseOffsetForCharacters = 210;
    const _baseOffsetForComics = 10;

    const getAllCharacters = async (offset = _baseOffsetForCharacters) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`)
        return res.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset = _baseOffsetForComics) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        const descriptionSliced = character.description.length > 140 ? character.description.slice(0, 140) + '...' : character.description;

        return {
            name: character.name,
            description: character.description ? descriptionSliced : 'There is no description for this character',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            id: character.id,
            comics: character.comics.items   
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? comics.pageCount + ' p.' : 'No information about the number of pages',
            language: comics.textObjects.language || 'en-us',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            name: comics.title,
            price: comics.prices[0].price ? comics.prices[0].price + '$' : 'not available'
        }
    }

    return {process,
            setProcess,
            getAllCharacters, 
            getCharacter, 
            clearError, 
            getAllComics, 
            getComics, 
            getCharacterByName};
}

export default useMarvelService;