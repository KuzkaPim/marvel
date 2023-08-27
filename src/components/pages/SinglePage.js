import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

const SinglePage = ({Component, dataType}) => {
    const {id} = useParams(),
          [data, setData] = useState(null);

    const {getComics, getCharacter, clearError, process, setProcess} = useMarvelService();

    const onDataLoaded = (data) => {
        setData(data)
    }

    const updateData = () => {
        clearError();

        switch(dataType) {
            case 'character':
                getCharacter(id)
                    .then(onDataLoaded)
                    .then(() => setProcess('confirm'));
                break;
            case 'comics':
                getComics(id)
                    .then(onDataLoaded)
                    .then(() => setProcess('confirm'));
        }
    }
    
    useEffect(() => {
        updateData();
    }, [id])

    return (
        <>
            <AppBanner />
            {setContent(process, Component, data)}
        </>
    )
}

export default SinglePage;