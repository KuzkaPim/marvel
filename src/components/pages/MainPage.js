import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearch from "../charSearch/CharSearch";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [selectedChar, setSelectedChar] = useState(null)

    const onSelectedChar = (id) => {
        setSelectedChar(id);
    }

    return (
        <>
            <RandomChar/>
            <div className="char__content">
                <CharList
                    onSelectedChar={onSelectedChar} 
                    selectedChar={selectedChar}
                />
                <div>
                    <CharInfo charId={selectedChar}/>
                    <CharSearch />
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    );
};

export default MainPage;