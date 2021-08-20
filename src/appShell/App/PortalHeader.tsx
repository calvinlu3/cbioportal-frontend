import * as React from 'react';
import * as _ from 'lodash';
import { Link, NavLink } from 'react-router-dom';
import { If, Then, Else } from 'react-if';
import { AppStore } from '../../AppStore';
import { observer } from 'mobx-react';
import { getInstituteLogoUrl } from '../../shared/api/urls';
import SocialAuthButton from '../../shared/components/SocialAuthButton';
import { Dropdown } from 'react-bootstrap';
import { DataAccessTokensDropdown } from '../../shared/components/dataAccessTokens/DataAccessTokensDropdown';
import { getLoadConfig, getServerConfig } from 'config/config';

@observer
export default class PortalHeader extends React.Component<
    { appStore: AppStore },
    {}
> {
    private tabs() {
        return [
            {
                id: 'datasets',
                text: 'Data Sets',
                address: '/datasets',
                internal: true,
                hide: () => getServerConfig().skin_show_data_tab === false,
            },

            {
                id: 'webAPI',
                text: 'Web API',
                address: '/webAPI',
                internal: true,
                hide: () => getServerConfig().skin_show_web_api_tab === false,
            },

            {
                id: 'rMatlab',
                text: 'R/MATLAB',
                address: '/rmatlab',
                internal: true,
                hide: () => getServerConfig().skin_show_r_matlab_tab === false,
            },

            {
                id: 'tutorials',
                text: 'Tutorials/Webinars',
                address: '/tutorials',
                internal: true,
                hide: () => getServerConfig().skin_show_tutorials_tab === false,
            },

            {
                id: 'faq',
                text: 'FAQ',
                address: '/faq',
                internal: true,
                hide: () => getServerConfig().skin_show_faqs_tab === false,
            },

            {
                id: 'news',
                text: 'News',
                address: '/news',
                internal: true,
                hide: () => getServerConfig().skin_show_news_tab === false,
            },

            {
                id: 'visualize',
                text: 'Visualize Your Data',
                address: '/visualize',
                internal: true,
                hide: () => getServerConfig().skin_show_tools_tab === false,
            },

            {
                id: 'about',
                text: 'About',
                address: '/about',
                internal: true,
                hide: () => getServerConfig().skin_show_about_tab === false,
            },

            {
                id: 'installation-map',
                text: 'cBioPortal Installations',
                address: '/installations',
                internal: false,
                hide: () => !getServerConfig().installation_map_url,
            },
        ];
    }

    private getTabs() {
        const shownTabs = this.tabs().filter(t => {
            return !t.hide();
        });

        return shownTabs.map(tab => {
            return (
                <li>
                    {tab.internal ? (
                        <NavLink activeClassName={'selected'} to={tab.address}>
                            {tab.text}
                        </NavLink>
                    ) : (
                        <a href={tab.address}>{tab.text}</a>
                    )}
                </li>
            );
        });
    }

    render() {
        return (
            <header>
                <div id="leftHeaderContent">
                    <Link to="/" id="cbioportal-logo">
                        <img
                            src={require('../../globalStyles/images/cbioportal_logo.png')}
                            alt="cBioPortal Logo"
                        />
                    </Link>
                    <nav id="main-nav">
                        <ul>{this.getTabs()}</ul>
                    </nav>
                </div>
                <div id="rightHeaderContent">
                    <If
                        condition={
                            !getLoadConfig().hide_login &&
                            !getServerConfig().skin_hide_logout_button
                        }
                    >
                        <If condition={this.props.appStore.isLoggedIn}>
                            <Then>
                                <div className="identity">
                                    <Dropdown id="dat-dropdown">
                                        <Dropdown.Toggle className="btn-sm">
                                            Logged in as{' '}
                                            {this.props.appStore.userName}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu
                                            style={{
                                                paddingLeft: 10,
                                                overflow: 'auto',
                                                maxHeight: 300,
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <DataAccessTokensDropdown
                                                appStore={this.props.appStore}
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Then>
                            <Else>
                                <If
                                    condition={
                                        this.props.appStore
                                            .isSocialAuthenticated
                                    }
                                >
                                    <SocialAuthButton
                                        appStore={this.props.appStore}
                                    />
                                </If>
                            </Else>
                        </If>
                    </If>
                    <If condition={getInstituteLogoUrl()}>
                        <img
                            id="institute-logo"
                            src={getInstituteLogoUrl()}
                            alt="Institute Logo"
                        />
                    </If>
                </div>
            </header>
        );
    }
}
