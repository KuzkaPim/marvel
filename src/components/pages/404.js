import img from "./pageNotFound.gif";
import { Link } from "react-router-dom";
import "./404.scss";

const Page404 = () => {
    return (
        <div className="page-not-found">
            <img src={img} alt="pageNotFound" />
            <div>Page not found</div>
            <Link to="/">Back</Link>
        </div>
    )
}

export default Page404;