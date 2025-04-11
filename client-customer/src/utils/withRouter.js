import {useNavigate, useParams, useLocation} from "react-router-dom";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let navigate = useNavigate();
        let params = useParams();
        let location = useLocation();
        return (
            <Component {...props} router={{ navigate, params, location }}/>
        );
    }
    return ComponentWithRouterProp;
}

export default withRouter;