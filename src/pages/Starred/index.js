import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WebView from 'react-native-webview';
import { Loading } from './styles';

export default class Starred extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('repoName'),
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {
        loading: true,
    };

    render() {
        const { navigation } = this.props;
        const { loading } = this.state;
        const repoUrl = navigation.getParam('repoUrl');

        return (
            <>
                {loading && <Loading />}
                <WebView
                    onLoad={() => this.setState({ loading: false })}
                    source={{ uri: repoUrl }}
                    style={{ flex: 1 }}
                />
            </>
        );
    }
}
