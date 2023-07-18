const Char = ({thumbnail, name, onSelectedChar, clazz}) => {

    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit': 'unset'};
    }

    return (
        <li
            tabIndex={0} 
            onClick={() => {
                onSelectedChar();
            }}
            onKeyPress={(e) => {
                e.preventDefault();
                if (e.key === ' ' || e.key === "Enter") {
                    onSelectedChar();
                }
            }} 
            className={clazz}>
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default Char;