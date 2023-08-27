import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Error from '../error/Error';

import './charSearch.scss';

const CharSearch = () => {
    const [char, setChar] = useState(null);

    const {getCharacterByName, clearError, process, setProcess} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    } 

    const updateChar = (name) => {
        if (name) {
            clearError();

            getCharacterByName(name)
                .then(onCharLoaded)
                .then(() => setProcess('confirm'));
        } else {
            setChar(null);
        }
    }

    const errorMessage = process === 'error' ? <div className="char__search-critical-error"><Error /></div> : null;
    const results = !char ? null : char.length > 0 ?
                    <div className="char__search-wrapper">
                        <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                            <div className="inner">To page</div>
                        </Link>
                    </div> : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;

    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    charName: ''
                }}
                onSubmit={({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={process === 'loading' ? true : false}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <ErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearch;