import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import linkIcon from '../image/utils/link.png';
import caver from './chain/caver';

function SupporterList({ id }) {

    const [sponsors, setSponsors] = useState([]);

    const getSponsorLists = async (_id) => {
        const res = await axios.post('/api/getSponsorList', { id: _id })
        setSponsors(res.data.lists)
    }

    useEffect(() => {
        if (id === undefined) return
        getSponsorLists(id);
    }, [id])

    const getShrinkAddress = (addr) => {
        if (addr === null || addr === undefined) {
            return '0x'
        } else {
            return `${addr.substring(0, 6)}...${addr.substring(40, 42)}`
        }
    }


    return (
        <>
            <span className='projectInfo_title'>
                This project is sponsored by <span className='bluefonts'>{sponsors.length}</span> people.
            </span>
            <div className='supporter_whole'>
                <div className='supporter_head'>
                    <div>
                        Sponsors
                    </div>
                    <div>
                        Amount (KLAY)
                    </div>
                </div>
                {
                    sponsors.map((x, i) => {
                        return (
                            <div className='supporter_each_box' key={i}>
                                <div>
                                    <div className='spporter_profile' />
                                    <span className='spporter_name'>
                                        {getShrinkAddress(x.sponsor)}
                                    </span>
                                    <Link to={`/user/${x.sponsor}`}>
                                        <img className='project_head_launcher_link' src={linkIcon} alt='link' />
                                    </Link>
                                </div>
                                <div>
                                    {caver.utils.convertFromPeb(x.amount)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default SupporterList;