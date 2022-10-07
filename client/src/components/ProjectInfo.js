import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import useInput from '../hooks/useInput';
import webIcon from '../image/utils/web.png'
import githubIcon from '../image/utils/github.png'
import mediumIcon from '../image/utils/medium.png'
import notionIcon from '../image/utils/notion.png'
import twitterIcon from '../image/utils/twitter.png'
import caver from './chain/caver.js';
import linkIcon from '../image/utils/link.png';
import logo from '../image/logo/logo.png';
import searchIcon from '../image/utils/search.png';

function ProjectInfo({ project_id, link_github, link_medium, link_notion, link_twitter, link_web, detail, roadmap, more }) {

    const changeToYMD = (date) => {
        const _time = new Date(date);
        const y = _time.getFullYear();
        const m = _time.getMonth();
        const d = _time.getDate();
        return `~ ${y}. ${m + 1}. ${d}.`
    }

    return (
        <>
            <div className='projectInfo_image'>
                <img style={{ width: '100%', height: '100%' }} src={`https://wannaproject.s3.ap-northeast-2.amazonaws.com/project/${project_id}.png`} alt='' />
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Project Links</span>
                <span className='projectInfo_link_each'>
                    <img className='projectInfo_link_icon' src={webIcon} alt='' />
                    <span onClick={() => window.open(link_web)}>
                        {link_web}
                    </span>
                </span>
                <span className='projectInfo_link_each'>
                    <img className='projectInfo_link_icon' src={githubIcon} alt='' />
                    <span onClick={() => window.open(link_github)}>
                        {link_github}
                    </span>
                </span>
                <span className='projectInfo_link_each'>
                    <img className='projectInfo_link_icon' src={mediumIcon} alt='' />
                    <span onClick={() => window.open(link_medium)}>
                        {link_medium}
                    </span>
                </span>
                <span className='projectInfo_link_each'>
                    <img className='projectInfo_link_icon' src={notionIcon} alt='' />
                    <span onClick={() => window.open(link_notion)}>
                        {link_notion}
                    </span>
                </span>
                <span className='projectInfo_link_each'>
                    <img className='projectInfo_link_icon' src={twitterIcon} alt='' />
                    <span onClick={() => window.open(link_twitter)}>
                        {link_twitter}
                    </span>
                </span>
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Project Details</span>
                {
                    detail.map((x, i) => {
                        return (
                            <>
                                <span className='projectInfo_semiTitle'>{x.semiTitle}</span>
                                <span className='projectInfo_span'>
                                    {x.detail}
                                </span>
                            </>
                        )
                    })
                }
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Roadmap</span>
                {
                    roadmap.map((x, i) => {
                        return (
                            <>
                                <span className='projectInfo_semiTitle'>{changeToYMD(x.due)}</span>
                                <span className='projectInfo_semiTitle grayfonts'>(Expenses: {caver.utils.convertFromPeb(x.expense, 'KLAY')} KLAY)</span>
                                <span className='projectInfo_span'>
                                    {x.detail}
                                </span>
                            </>
                        )
                    })
                }
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Other Information</span>
                <span className='projectInfo_span'>
                    {more}
                </span>
            </div>
        </>
    );
}

export default ProjectInfo;