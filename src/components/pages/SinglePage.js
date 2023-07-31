import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Page404 from './404';
import AppBanner from '../appBanner/AppBanner';
import './singleComicPage.scss';

const SinglePage = ({Component, dataType}) => {
    const {id} = useParams(),
          [data, setData] = useState(null);

    const {loading, error, getComics, getCharacter, clearError} = useMarvelService();

    const onDataLoaded = (data) => {
        setData(data)
    }

    const updateData = () => {
        clearError();

        switch(dataType) {
            case 'character':
                getCharacter(id).then(onDataLoaded);
                break;
            case 'comics':
                getComics(id).then(onDataLoaded);
        }
    }
    
    useEffect(() => {
        updateData();
    }, [id])

    const errorMessage = error ? <Page404 /> : null,
          spinner = loading ? <Spinner /> : null,
          content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;