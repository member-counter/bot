import React, { Component } from 'react';
import queryString from 'query-string';
import apiContext from '../apiContext';

class Login extends Component {
    
    static contextType = apiContext;

    componentDidMount = () => {
        const { code } = queryString.parse(this.props.location.search);
        fetch('/api/oauth2?code='+code)
            .then(res => res.json())
            .then(res => {
                const { access_token } = res;
                if (access_token) {
                    this.context.login(access_token).then(() => {
                        this.props.history.push('/dashboard');
                    });
                } else window.location.href = '/';
            })
    }
    render = () => {
        return (
            <div {...this.props}>
            </div>
        )
    }
}
export default Login;