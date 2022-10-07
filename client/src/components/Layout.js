import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

import useInput from '../hooks/useInput';
import caver from './chain/caver';

// image
import logo from '../image/logo/logo.png';
import searchIcon from '../image/utils/search.png';
import closeIcon from '../image/utils/close.png';
import kaikasImage from '../image/utils/kaikas.jpg';
import metamaskImage from '../image/utils/metamask.jpg';

function Layout() {

    const { klaytn } = window;

    const [searchWord, onChangeSearchWord] = useInput('')
    const [modalOn, setModalOn] = useState(false);
    const [address, setAddress] = useState(null);
    const [myInfo, setMyInfo] = useState({});
    const [network, setNetwork] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const getMyInfo = async (adr) => {
        const res = await axios.post('/api/getUserInfo', { address: adr })
        setMyInfo({ name: res.data.name, intro: res.data.intro, profile: res.data.image })
    }

    useEffect(() => {
        if (address === null) return
        getMyInfo(address)
    }, [address])

    const kaikas_connect = async () => {
        if (klaytn) {
            const accounts = await klaytn?.enable()
            return (accounts[0])
        }
    }

    const connect_wallet = async (type) => {
        let account;
        if (type === 0) {
            // kaikas
            account = await kaikas_connect();
            if (Number(klaytn.networkVersion) !== 1001) alert('please change your network to baobab')
            setNetwork(Number(klaytn.networkVersion))
            klaytn.on('networkChanged', () => setNetwork(Number(klaytn.networkVersion)))
        } else if (type === 1) {
            // metamask
        }

        setAddress(account)
        setModalOn(false)
    }

    return (
        <>
            <div className='header'>
                <div className='header_container'>
                    <div className='header_semi_container'>
                        <Link to='/'>
                            <img className='header_logo' src={logo} alt='wanna' />
                        </Link>
                        <Link to='/funding'>
                            <span className={location.pathname === '/funding' ? 'header_menu bluefonts boldfonts' : 'header_menu'}>
                                Funding
                            </span>
                        </Link>
                        <span className={location.pathname === '/ranking' ? 'header_menu bluefonts boldfonts' : 'header_menu'} onClick={() => alert('comming soon.')}>
                            Ranking
                        </span>
                    </div>
                    <div className='header_semi_container'>
                        <div className='header_search_container'>
                            <img className='header_search_icon' src={searchIcon} alt='search' />
                            <input className='header_search_input' value={searchWord} placeholder='search project...' onChange={onChangeSearchWord} onKeyUp={() => {
                                if (window.event.keyCode === 13) {
                                    navigate(`/funding?keyword=${searchWord}`)
                                    onChangeSearchWord({ target: { value: '' } })
                                }
                            }} />
                        </div>
                        {
                            address !== null
                                ?
                                <Link to={`/user/${address}`}>
                                    <span className='header_login'>
                                        my info
                                    </span>
                                </Link>
                                :
                                <span className='header_login' onClick={() => setModalOn(true)}>
                                    sign in
                                </span>
                        }
                        {
                            address !== null
                                ?
                                <Link to='/launch'>
                                    <button className='header_button trans'>
                                        Launch Project
                                    </button>
                                </Link>
                                :
                                <button className='header_button trans' onClick={() => alert('connect wallet first')}>
                                    Launch Project
                                </button>
                        }
                    </div>
                </div>
            </div>
            <Outlet context={{ address: address, myInfo: myInfo, getMyInfo: getMyInfo }} />
            <div className='footer'>
                <div className='footer_container'>
                    ⓒ 2022. WANNA all rights reserved.
                </div>
            </div>
            {
                modalOn
                    ?
                    <>
                        <div className='login_modal'>
                            <div className='login_moadal_header'>
                                <img src={closeIcon} alt='close' className='login_modal_header_icon' onClick={() => setModalOn(false)} />
                            </div>
                            <div className='login_modal_content'>
                                <span className='login_modal_content_title'>
                                    Wallet Connect
                                </span>
                                <div className='login_modal_content_wallet'>
                                    <div className='login_modal_content_wallet_each' onClick={() => connect_wallet(0)}>
                                        <img className='login_modal_content_wallet_img' src={kaikasImage} alt='kaikas' />
                                        <span className='login_modal_content_wallet_span'>Kaikas</span>
                                    </div>
                                    <div className='login_modal_content_wallet_each'>
                                        <img className='login_modal_content_wallet_img' src={metamaskImage} alt='kaikas' />
                                        <span className='login_modal_content_wallet_span'>Metamask</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='login_modal_mock' onClick={() => setModalOn(false)} />
                    </>
                    :
                    null
            }
        </>
    );
}

export default Layout;