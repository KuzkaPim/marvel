

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=d2d90ae6492c1e53c88b351cb4eaa738';
    _baseOffset = 210;

    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
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
}

export default MarvelService;