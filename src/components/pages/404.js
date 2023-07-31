import img from "./pageNotFound.gif";
import { Link } from "react-router-dom";
import "./404.scss";

const Page404 = () => {
    return (
        <div className="page-not-found">
            <img src={img} alt="pageNotFound" />
            <div>Страница не найдена</div>
            <Link to="/">На главную</Link>
        </div>
    )
}

export default Page404;