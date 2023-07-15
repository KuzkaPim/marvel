const Char = ({thumbnail, name, onSelectedChar}) => {
    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {'objectFit': 'unset'};
    }

    return (
        <li onClick={onSelectedChar} className="char__item">
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

export default Char;