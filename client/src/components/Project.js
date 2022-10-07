import React, { useState, useEffect } from 'react';
import { Link, useParams, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ProjectInfo from './ProjectInfo';
import SupporterList from './SupporterList';
import User from './User';
import useInput from '../hooks/useInput';
import banner1 from '../image/banner/banner1.png';
import linkIcon from '../image/utils/link.png';
import axios from 'axios';
import caver from './chain/caver.js';
import contract_address from './chain/contract_address.js';
import router_abi from './chain/abi/WannaRouter.json';
import nft_abi from './chain/abi/WannaKIP17.json';

function Layout() {

    const { projectId } = useParams();
    const { address } = useOutletContext();

    const router = new caver.klay.Contract(router_abi.abi, contract_address.router);
    const nft = new caver.klay.Contract(nft_abi.abi, contract_address.nft_sponsor);

    const [name, setName] = useState(null);
    const [launcher, setLauncher] = useState(null);
    const [desc, setDesc] = useState(null);
    const [category, setCategory] = useState(null);
    const [funding, setFunding] = useState('0');
    const [funding_all, setFunding_all] = useState('1');
    const [link_github, setLink_github] = useState(null);
    const [link_medium, setLink_medium] = useState(null);
    const [link_web, setLink_web] = useState(null);
    const [link_notion, setLink_notion] = useState(null);
    const [link_twitter, setLink_twitter] = useState(null);
    const [project_more, setProject_more] = useState(null);
    const [detail, setDetail] = useState([]);
    const [roadmap, setRoadmap] = useState([]);
    const [start, setStart] = useState(null);

    const [launcher_name, setLauncher_name] = useState(null);
    const [launcher_image, setLauncher_image] = useState(null);

    const getProject = async (_id) => {
        const res = await axios.post('/api/getProject', { id: _id })
        const res2 = await axios.post('/api/getUserInfo', { address: res.data.launcher })
        setName(res.data.name)
        setLauncher(res.data.launcher)
        setCategory(res.data.category)
        setFunding(res.data.funding)
        setFunding_all(res.data.funding_all)
        setLink_github(res.data.link_github)
        setLink_medium(res.data.link_medium)
        setLink_web(res.data.link_web)
        setLink_notion(res.data.link_notion)
        setLink_twitter(res.data.link_twitter)
        setProject_more(res.data.project_more)
        setDetail(res.data.detail)
        setRoadmap(res.data.roadmap)
        setDesc(res.data.desc)
        setStart(res.data.start)

        setLauncher_name(res2.data.name)
        setLauncher_image(res2.data.image)
    }

    useEffect(() => {
        getProject(projectId)
    }, [projectId])

    const getShrinkAddress = (addr) => {
        if (addr === null || addr === undefined) {
            return '0x'
        } else {
            return `${addr.substring(0, 6)}...${addr.substring(40, 42)}`
        }
    }


    const [tabNum, setTabNum] = useState(0);
    const [fundAmount, onChangeFundAmount] = useInput('')
    const navigate = useNavigate();

    const calculateLeft = (date) => {
        const _now = new Date().getTime();
        const _start = new Date(date).getTime();
        const _time = Math.floor((_start + 86400 * 1000 * 7 - _now) / 1000);
        if (_time < 0) {
            return 'funding closed'
        } else {
            const d = Math.floor(_time / 86400);
            const t = Math.floor((_time % 86400) / 3600);
            return `${d} days ${t} hours left`
        }
    }

    const getPeriods = (date) => {
        const _start = new Date(date);
        const _start_ = new Date(date).getTime();
        const _end = new Date(_start_ + 86400 * 7 * 1000);
        const y = _start.getFullYear()
        const m = _start.getMonth() + 1
        const d = _start.getDate()

        const _y = _end.getFullYear()
        const _m = _end.getMonth() + 1
        const _d = _end.getDate()

        return `${y}.${m}.${d}. ~ ${_y}.${_m}.${_d}.`
    }


    const getCategory = (cat) => {
        let cattt;
        if (cat === null) {
            return '';
        }
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

    const doSponse = async () => {
        try {
            const _value = caver.utils.convertToPeb(fundAmount, 'KLAY').toString();
            const res = await router.send({ from: address, gas: 15000000, value: _value }, 'sponse', projectId)
            if (res.status !== true) {
                alert('error occured.')
                return
            }

            const ts = await nft.call('totalSupply')

            const res2 = await axios.post('/api/sponse', { ts: ts, sponsor: address, id: projectId, amount: _value })
            if (res2.data.msg === 'success') {
                alert('sponse success.')
            } else {
                alert('error occured.')
            }
        } catch (err) {
            alert('error occured.')
            console.error(err);
        }
    }

    return (
        <>
            <div className='project_banner'>
                <div className='project_banner_span_box'>
                    <span className='project_banner_kind'>
                        {getCategory(category)}
                    </span>
                    <span className='project_banner_title'>
                        {name}
                    </span>
                </div>
                <div className='project_banner_img_box'>
                    <img className='project_banner_img' src={`https://wannaproject.s3.ap-northeast-2.amazonaws.com/project/${[projectId]}.png`} alt='' />
                </div>
            </div>
            <div className='container project_invest_container'>
                <div className='grey-borderBox project_head_launcherBox'>
                    <div className='project_head_launcherImage'>
                        {
                            launcher_image
                                ?
                                <img className='project_head_launcherImage_' src={launcher_image} alt={launcher_name} />
                                :
                                null
                        }
                    </div>
                    <span className='project_head_launcher_launcher'>
                        {launcher_name ? launcher_name : 'no name'} ({getShrinkAddress(launcher)})
                    </span>
                    <Link to={`/user/${launcher}`}>
                        <img className='project_head_launcher_link' src={linkIcon} alt='link' />
                    </Link>
                </div>
                <div className='funding_project_title_box'>
                    <span className='funding_project_title'>
                        {name}
                    </span>
                    <span className='funding_project_desc'>
                        {desc}
                    </span>
                </div>
                <div className='light-blueBox project_funding_amount_box'>
                    <span className='project_funding_amount_amount'>
                        Target Amount: {caver.utils.convertFromPeb(funding_all, 'KLAY')} Klay
                    </span>
                    <span className='project_funding_amount_amount'>
                        Funding Period: {getPeriods(start)}
                    </span>
                    <span className='project_funding_amount_caution'>
                        If funding amount doesn't reach 100%, funding is canceled and all reserves will be refunded.
                    </span>
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
                <div className='project_invest_button_box'>
                    <input className='project_invest_input' type='number' value={fundAmount} placeholder='Insert KLAY' onChange={onChangeFundAmount} />
                    <button className='project_invest_button blueButton' onClick={doSponse}>Sponse</button>
                </div>
            </div>
            <div className='container project_tab_container'>
                <div className={tabNum === 0 ? 'project_tab_each_selected' : 'project_tab_each'} onClick={() => setTabNum(0)}>
                    Story
                </div>
                <div className={tabNum === 1 ? 'project_tab_each_selected' : 'project_tab_each'} onClick={() => setTabNum(1)}>
                    Launcher
                </div>
                <div className={tabNum === 2 ? 'project_tab_each_selected' : 'project_tab_each'} onClick={() => setTabNum(2)}>
                    Sponsors
                </div>
            </div>
            <div className='container project_tab_content'>
                {
                    {
                        0:
                            <ProjectInfo project_id={projectId} start={start}
                                link_github={link_github} link_twitter={link_twitter} link_medium={link_medium} link_notion={link_notion} link_web={link_web}
                                detail={detail} roadmap={roadmap} more={project_more} />
                        ,
                        1:
                            <User launcher={launcher} />
                        ,
                        2:
                            <SupporterList id={projectId} />
                    }[tabNum]
                }
            </div>
        </>
    );
}

export default Layout;