import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
    TouchableItem,
} from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
            navigate: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        loading: true,
        refreshing: false,
        page: 1,
    };

    async componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`);

        this.setState({ stars: response.data, loading: false });
    }

    loadMore = async () => {
        const { navigation } = this.props;
        const { stars, page } = this.state;
        const user = navigation.getParam('user');

        const response = await api.get(
            `/users/${user.login}/starred?page=${page + 1}`
        );

        this.setState({ stars: [...stars, ...response.data], page: page + 1 });
    };

    refreshList = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

        this.setState({ refreshing: true });

        const response = await api.get(`/users/${user.login}/starred`);

        this.setState({ stars: response.data, refreshing: false });
    };

    openStarred = repo => {
        const { navigation } = this.props;
        const { name: repoName, html_url: repoUrl } = repo;

        navigation.navigate('Starred', { repoName, repoUrl });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading, refreshing } = this.state;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Stars
                            onEndReachedThereshold={0.2}
                            onEndReached={this.loadMore}
                            onRefresh={this.refreshList}
                            refreshing={refreshing}
                            data={stars}
                            keyExtractor={star => String(star.id)}
                            renderItem={({ item }) => (
                                <Starred>
                                    <TouchableItem
                                        onPress={() => this.openStarred(item)}
                                    >
                                        <OwnerAvatar
                                            source={{
                                                uri: item.owner.avatar_url,
                                            }}
                                        />
                                        <Info>
                                            <Title>{item.name}</Title>
                                            <Author>{item.owner.login}</Author>
                                        </Info>
                                    </TouchableItem>
                                </Starred>
                            )}
                        />
                    </>
                )}
            </Container>
        );
    }
}
