import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import queryString from "query-string"
import axios from 'axios';
import FundingList from './FundingList';
import Category from './Category';
// image

function Funding() {
    const { search } = useLocation();
    const { keyword, category } = queryString.parse(search);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getAllProjects(keyword, category);
    }, [keyword, category])

    const getAllProjects = async (_keyword, _category) => {
        let res;
        if (_keyword === undefined && _category === undefined) {
            res = await axios.post('/api/getProjectList')
        } else if (_keyword === undefined && _category !== undefined) {
            res = await axios.post('/api/getProjectList', { category: _category })
        } else if (_keyword !== undefined && _category === undefined) {
            res = await axios.post('/api/getProjectList', { keyword: _keyword })
        }
        setProjects(res.data.projects)
    }

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

    return (
        <>
            <div className='container funding_main_find_container'>
                <span className='funding_main_find_title'>
                    <span className='grayfonts'>Search results for</span>
                    &nbsp;&nbsp;
                    {
                        keyword === undefined && category !== undefined
                            ?
                            <>
                                <span className='boldfonts'>{category === undefined ? `ALL` : getCategory(category)}</span>
                                &nbsp;
                                <span className='grayfonts'>category</span>
                            </>
                            :
                            <>
                                <span className='boldfonts'>{keyword === undefined ? `ALL` : keyword}</span>
                            </>
                    }
                </span>
                <span className='funding_main_find_semi'>
                    {projects.length} results
                </span>
            </div>
            <Category />
            <FundingList projects={projects} />
        </>
    );
}

export default Funding;