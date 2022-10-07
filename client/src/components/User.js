import React, { useState, useEffect } from 'react';
import { Link, useParams, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";

import axios from 'axios';
import caver from './chain/caver.js';
import contract_address from './chain/contract_address.js';
import nft_abi from './chain/abi/WannaKIP17.json';

function User({ launcher }) {

    const { address } = useOutletContext();

    const { userAddress } = useParams();

    const [name, setName] = useState(null);
    const [intro, setIntro] = useState(null);
    const [profile, setProfile] = useState(null);
    const [launched, setLaunched] = useState([]);
    const [sponsored, setSponsored] = useState([]);

    const getUserInfo = async (adr) => {
        const nft_launcher = new caver.klay.Contract(nft_abi.abi, contract_address.nft_project);
        const nft_sponsor = new caver.klay.Contract(nft_abi.abi, contract_address.nft_sponsor);

        const res = await axios.post('/api/getUserInfo', { address: adr })
        setName(res.data.name)
        setIntro(res.data.intro)
        setProfile(res.data.image)
        const launcher_num = await nft_launcher.call('balanceOf', adr)
        const sponsor_num = await nft_sponsor.call('balanceOf', adr)

        const _launched = [];
        const _sponsored = [];

        for (let i = 0; i < Number(launcher_num); i++) {
            const _id = await nft_launcher.call('tokenOfOwnerByIndex', adr, i)
            _launched.push(Number(_id))
        }

        for (let i = 0; i < Number(sponsor_num); i++) {
            const _id = await nft_sponsor.call('tokenOfOwnerByIndex', adr, i)
            _sponsored.push(Number(_id))
        }
        setLaunched(_launched)
        setSponsored(_sponsored)
    }

    useEffect(() => {
        if (launcher !== undefined) {
            getUserInfo(launcher);
        } else if (userAddress !== undefined) {
            getUserInfo(userAddress);
        }
    }, [userAddress, launcher])

    return (
        <div className='user_whole'>
            <div className='user_profile_revise_box'>
                {
                    userAddress?.toUpperCase() === address?.toUpperCase()
                        ?
                        <Link to='/userRevise'>
                            <span className='user_profile_revise_div'>
                                revise
                            </span>
                        </Link>
                        :
                        null
                }
            </div>
            <div className='grey-borderBox user_profile_box'>
                {
                    profile
                        ?
                        <div className='user_profile_picture2'>
                            <img style={{ width: '100%', height: '100%' }} src={profile} alt={name} />
                        </div>
                        :
                        <div className='user_profile_picture'>

                        </div>
                }
                <div className='user_profile_detail'>
                    <div className='user_profile_detail_each'>
                        <span className='user_profile_detail_tag'>
                            Name
                        </span>
                        <span className='user_profile_detail_content'>
                            {name ? name : 'No name'}
                        </span>
                    </div>
                    <div className='user_profile_detail_each'>
                        <span className='user_profile_detail_tag'>
                            Wallet Address
                        </span>
                        <span className='user_profile_detail_content'>
                            {userAddress}
                        </span>
                    </div>
                    <div className='user_profile_detail_each'>
                        <span className='user_profile_detail_tag'>
                            Projects Launched
                        </span>
                        <span className='user_profile_detail_content'>
                            {launched.length}
                        </span>
                        <span className='user_profile_detail_tag'>
                            Projects Sponsored
                        </span>
                        <span className='user_profile_detail_content'>
                            {sponsored.length}
                        </span>
                    </div>
                </div>
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Introduction</span>
                <span className='projectInfo_span'>
                    {
                        intro
                            ?
                            intro
                            :
                            'No introduction'
                    }
                </span>
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Projects Launched</span>
                <div className='user_funding_list'>
                    {
                        launched.map((x, i) => {
                            return (
                                <div key={i} className='user_funding_nft' onClick={() => window.open(`https://testnets.opensea.io/assets/baobab/${contract_address.nft_project}/${x}`)}>
                                    <img className='user_funding_nft_' src={`https://wannaproject.s3.ap-northeast-2.amazonaws.com/image/${x}.png`} alt={x} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Projects Sponsored</span>
                <div className='user_funding_list'>
                    {
                        sponsored.map((x, i) => {
                            return (
                                <div key={i} className='user_funding_nft' onClick={() => window.open(`https://testnets.opensea.io/assets/baobab/${contract_address.nft_sponsor}/${x}`)}>
                                    <img className='user_funding_nft_' src={`https://wannaproject.s3.ap-northeast-2.amazonaws.com/image/${x}.png`} alt={x} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default User;