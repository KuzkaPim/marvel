import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=eb8aed350156aa4586437ed9f36552cf';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        let descriptionSliced = character.description.slice(0, 150);
        if (descriptionSliced.length < character.description.length) {
            descriptionSliced += '...';
        }
        return {
            name: character.name,
            description: character.description ? descriptionSliced : 'Об этом персонаже нам неизвестно',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            id: character.id,
            comics: character.comics.items   
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError};
}

export default useMarvelService;