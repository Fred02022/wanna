import React, { useState, useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";
import caver from './chain/caver.js';

function FundingEach({ projectId, projectName, projectOwner, category, funding, funding_all, start }) {

    const getCategory = (cat) => {
        let cattt;
        switch (Number(cat)) {
            case 1:
                cattt = 'Games'
                break;
            case 2:
                cattt = 'Exchange'
                break;
            case 3:
                cattt = 'Finance'
                break;
            case 4:
                cattt = 'Social'
                break;
            case 5:
                cattt = 'Public Goods'
                break;
            case 6:
                cattt = 'Infrastructure'
                break;
            case 7:
                cattt = 'Metaverse/NFT'
                break;
            case 8:
                cattt = 'DAO'
                break;
            default:
                cattt = ''
                break;
        }
        return cattt;
    }

    const getShrinkAddress = (addr) => {
        if (addr === null && addr === undefined) return '0x'
        return `${addr.substring(0, 6)}...${addr.substring(40, 42)}`
    }

    const calculateLeft = (date) => {
        const _now = new Date().getTime();
        const _start = new Date(date).getTime();
        const _time = Math.floor((_start + 86400 * 1000 * 7 - _now) / 1000);
        if (_time < 0) {
            return 'funding closed'
        } else {
            const d = Math.floor(_time / 86400);
            const t = Math.floor((_time % 86400) / 3600);
            return `${d}d ${t}h left`
        }
    }


    return (
        <Link to={`/project/${projectId}`} style={Number(projectId) >= 10000 ? { pointerEvents: 'none' } : {}} >
            <div className='funding_Each'>
                <div className='funding_img'>
                    <img className='funding_image' src={`https://wannaproject.s3.ap-northeast-2.amazonaws.com/project/${projectId}.png`} alt='' />
                </div>
                <span className='funding_title'>
                    {projectName}
                </span>
                <div className='funding_detail'>
                    {getCategory(category)} | launched by {getShrinkAddress(projectOwner)}
                </div>
                <div className='funding_rate'>
                    <div className='funding_rate_true' style={{ width: `${Math.floor(Number(caver.utils.convertFromPeb(funding, 'KLAY')) / Number(caver.utils.convertFromPeb(funding_all, 'KLAY')) * 1000) / 10}%` }} />
                </div>
                <div className='funding_rate_span'>
                    <div>
                        <span className='funding_rate_span1'>
                            {Math.floor(Number(caver.utils.convertFromPeb(funding, 'KLAY')) / Number(caver.utils.convertFromPeb(funding_all, 'KLAY')) * 1000) / 10}%
                        </span>
                        <span className='funding_rate_span2'>
                            {caver.utils.convertFromPeb(funding, 'KLAY')} Klay
                        </span>
                    </div>
                    <span className='funding_rate_span2'>
                        {calculateLeft(start)}
                    </span>
                </div>
            </div>
        </Link >
    );
}

export default FundingEach;