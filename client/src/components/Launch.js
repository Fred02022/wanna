import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

import caver from './chain/caver';
import useInput from '../hooks/useInput';
import plusIcon from '../image/utils/plus.png';
import { BigNumber } from 'ethers';

import contract_address from './chain/contract_address.js';
import factory_abi from './chain/abi/WannaFactory.json';

function Launch() {

    const { address } = useOutletContext();

    const factory = new caver.klay.Contract(factory_abi.abi, contract_address.factory);

    const [agree, setAgree] = useState(false);
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [symbolUrl, setSymbolUrl] = useState(null);

    const [funding_due, setFunding_due] = useState('')
    const [funding_due_year, setFunding_due_year] = useState('')
    const [funding_due_month, setFunding_due_month] = useState('')
    const [funding_due_date, setFunding_due_date] = useState('')

    useEffect(() => {
        const now = new Date();
        const _now = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
        setFunding_due(_now.getTime())
        setFunding_due_year(_now.getFullYear());
        setFunding_due_month(_now.getMonth() + 1);
        setFunding_due_date(_now.getDate());
    }, [])

    // input
    const [project_name, onChangeProject_name] = useInput('');
    const [project_category, onChangeProject_category] = useInput('');
    const [project_desc, onChangeProject_desc] = useInput('');
    const [link_web, onChangeLink_web] = useInput('');
    const [link_github, onChangeLink_github] = useInput('');
    const [link_medium, onChangeLink_medium] = useInput('');
    const [link_twitter, onChangeLink_twitter] = useInput('');
    const [link_notion, onChangeLink_notion] = useInput('');

    const [project_detail, setProject_detail] = useState([]);
    const [project_roadmap, setProject_roadmap] = useState([]);

    const [project_more, onChangeProject_more] = useInput('');

    const imagePreview = () => {
        if (!file) return
        const url = URL.createObjectURL(file)
        setImageUrl(url)
        console.log(url)
    }

    const imagePreview2 = () => {
        if (!file2) return
        const url = URL.createObjectURL(file2)
        setSymbolUrl(url)
        console.log(url)
    }

    useEffect(() => {
        if (!file) return
        imagePreview()
    }, [file])

    useEffect(() => {
        if (!file2) return
        imagePreview2()
    }, [file2])

    const getFundAmount = (_roadmap) => {
        let add = 0;
        for (let i = 0; i < _roadmap.length; i++) {
            add += (_roadmap[i].expense === '' ? 0 : Number(_roadmap[i].expense));
        }
        return add;
    }

    const changeFile = (e) => {
        setFile(e.target.files[0])
    }

    const changeFile2 = (e) => {
        setFile2(e.target.files[0])
    }

    const navigate = useNavigate();

    const submit = async () => {
        try {
            if (!address) return
            if (!agree) {
                alert('You have to agree the terms.')
                return
            }

            const due_ = [];
            const now_ = Math.ceil(new Date() / 1000);
            due_.push(now_)
            for (let i = 0; i < project_roadmap.length - 1; i++) {
                due_.push(Math.ceil(new Date(project_roadmap[i].due) / 1000));
            }

            const expense_ = [];
            for (let i = 0; i < project_roadmap.length; i++) {
                expense_.push(caver.utils.convertToPeb(project_roadmap[i].expense.toString(), 'KLAY'))
            }

            const id = Number(await factory.call('allProjectLength'))

            const re = await factory.send({ from: address, gas: 15000000 }, 'createProject', project_name, due_, expense_)
            if (re.status !== true) {
                alert('error occured.')
                return
            }

            const formData = new FormData();
            formData.append("info", JSON.stringify({
                launcher: address, project_id: id,
                name: project_name, category: project_category, detail: project_detail, roadmap: project_roadmap, desc: project_desc,
                link_github: link_github, link_medium: link_medium, link_web: link_web, link_notion: link_notion,
                link_twitter: link_twitter, project_more: project_more
            }));
            formData.append("img", file);
            formData.append("symbol", file2);

            const res = await axios.post("/api/createProject", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            if (res.data.msg === 'success') {
                alert('project launched')
                navigate(`/project/${id}`)
            } else {
                alert('error occured')
            }
        } catch (err) {
            console.error(err)
            alert('error occured.')
        }
    }

    const changeDetail_semi = (v, i) => {
        const _project_detail = [...project_detail];
        const obj = _project_detail[i];
        obj.semiTitle = v;
        _project_detail.splice(i, 1, obj)
        setProject_detail(_project_detail)
    }

    const changeDetail_detail = (v, i) => {
        const _project_detail = [...project_detail];
        const obj = _project_detail[i];
        obj.detail = v;
        _project_detail.splice(i, 1, obj)
        setProject_detail(_project_detail)
    }

    const addDetail = () => {
        const _project_detail = [...project_detail];
        _project_detail.push({ semiTitle: '', detail: '' })
        setProject_detail(_project_detail)
    }

    const changeRoadmap_due = (v, i) => {
        const _project_roadmap = [...project_roadmap];
        const obj = _project_roadmap[i];
        obj.due = v;
        _project_roadmap.splice(i, 1, obj)
        setProject_roadmap(_project_roadmap)
    }

    const changeRoadmap_expense = (v, i) => {
        const _project_roadmap = [...project_roadmap];
        const obj = _project_roadmap[i];
        obj.expense = v;
        _project_roadmap.splice(i, 1, obj)
        setProject_roadmap(_project_roadmap)
    }

    const changeRoadmap_detail = (v, i) => {
        const _project_roadmap = [...project_roadmap];
        const obj = _project_roadmap[i];
        obj.detail = v;
        _project_roadmap.splice(i, 1, obj)
        setProject_roadmap(_project_roadmap)
    }

    const addRoadmap = () => {
        const _project_roadmap = [...project_roadmap];
        _project_roadmap.push({ due: '', expense: '', detail: '' })
        setProject_roadmap(_project_roadmap)
    }

    return (
        <div className='container launch_whole'>
            <span className='launch_whole_title'>Launch Project</span>
            <div className='launch_whole_caution_wrapper'>
                <div className='launch_whole_caution'>
                    <span className='launch_whole_caution_span'>
                        * The present agreement sets out the conditions for the use of the Wanna platform (the “Platform”) and regulates the legal relationship among the Users and between the Users and Operator.</span>
                    <span className='launch_whole_caution_span'>
                        * By using the Platform you agree and accept the Terms & Conditions, operating rules, guidelines, policies, instructions etc. without modification.</span>
                    <span className='launch_whole_caution_span'>
                        * Wanna does not provide any direct financial or investment services, as Wanna is not a financial institution, investment bank, or a financial advisor.</span>
                    <span className='launch_whole_caution_span'>
                        * The purpose of the Platform is solely to assist Legitimate Projects in finding suitable Investors and Investors in finding suitable projects for investment.</span>
                    <span className='launch_whole_caution_span'>
                        * Legal commitments on the financing rounds are formed directly between Legitimate Projects and Investors, without any advising or legal responsibility by Wanna.</span>
                </div>
            </div>
            <div className='launch_whole_caution_agree'>
                <input className='agree_input' type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked) }} />
                <span className='agree_span' onClick={() => setAgree(!agree)}>I have read and understood the terms and conditions and hereby agree to all of the above.</span>
            </div>
            <div className='container launch_content'>
                <span className='projectInfo_title'>Project Name</span>
                <div className='launch_about_box'>
                    <span className='launch_about_span'>
                        * Write a clear, brief title to help people quickly understand your project.
                    </span>
                    <span className='launch_about_span'>
                        * Your project name will appear on category pages, search results, etc.
                    </span>
                </div>
                <div className='launch_add_wrapper'>
                    <div className='launch_add_link_box'>
                        <div className='launch_add_link_each'>
                            <span className='launch_add_link_tag'>
                                Project Name
                            </span>
                            <span className='launch_add_link_url'>
                                <input className='launch_add_link_input' placeholder='maximum 60 letters' maxLength={60} type='text' onChange={onChangeProject_name} value={project_name} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container launch_content'>
                <span className='projectInfo_title'>Project Category</span>
                <div className='launch_about_box'>
                    <span className='launch_about_span'>
                        * Select the category to which your project belongs.
                    </span>
                    <span className='launch_about_span'>
                        * There are currently eight categories, and we will add more.
                    </span>
                </div>
                <div className='launch_add_wrapper'>
                    <div className='launch_add_link_box'>
                        <div className='launch_add_link_each'>
                            <span className='launch_add_link_tag'>
                                Project Category
                            </span>
                            <span className='launch_add_link_url'>
                                <select className="launch_add_link_input" value={project_category} onChange={onChangeProject_category}>
                                    <option value='' selected disabled hidden>Choose category</option>
                                    <option value={1} >Games</option>
                                    <option value={2} >Exchange</option>
                                    <option value={3} >Finance</option>
                                    <option value={4} >Social</option>
                                    <option value={5} >Public Goods</option>
                                    <option value={6} >Infrastructure</option>
                                    <option value={7} >Metaverse/NFT</option>
                                    <option value={8} >DAO</option>
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container launch_content'>
                <span className='projectInfo_title'>Project summary</span>
                <div className='launch_about_box'>
                    <span className='launch_about_span'>
                        * Please explain your project in one sentence.
                    </span>
                </div>
                <div className='launch_add_wrapper'>
                    <div className='launch_add_link_box'>
                        <div className='launch_add_link_each'>
                            <span className='launch_add_link_tag'>
                                Project Summary
                            </span>
                            <span className='launch_add_link_url'>
                                <TextareaAutosize className='launch_text_area' placeholder='max 200 letters' onChange={onChangeProject_desc} value={project_desc} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container launch_content'>
                <span className='projectInfo_title'>Project Image</span>
                <div className='launch_about_box'>
                    <span className='launch_about_span'>
                        * Add an image that clearly represents your project(Consider different sizes-mobile, website, social channels).
                    </span>
                    <span className='launch_about_span'>
                        * We recommend images with clear text and material for legibility.
                    </span>
                </div>
                <div className='launch_image_box'>
                    {
                        imageUrl === null
                            ?
                            <div className='launch_image_no'>
                                <span className='launch_image_no_span'>
                                    upload your image file
                                </span>
                                <span className='launch_image_no_caution'>
                                    (2400*1600/.png recommended)
                                </span>
                            </div>
                            :
                            <img style={{ width: '100%', height: '100%' }} src={imageUrl} alt='' />
                    }
                </div>
                <label className='blueButton launch_file_upload' htmlFor="preview">
                    select image
                </label>
                <input
                    style={{ display: 'none' }}
                    type="file"
                    id="preview"
                    accept="image/jpg, image/png, image/jpeg"
                    onChange={changeFile}
                />
                <div className='launch_image_box2'>
                    {
                        symbolUrl === null
                            ?
                            <div className='launch_image_no'>
                                <span className='launch_image_no_span'>
                                    upload your symbol file
                                </span>
                                <span className='launch_image_no_caution'>
                                    (720*720 recommended)
                                </span>
                            </div>
                            :
                            <img style={{ width: '100%', height: '100%' }} src={symbolUrl} alt='' />
                    }
                </div>
                <label className='blueButton launch_file_upload' htmlFor="preview2">
                    select image
                </label>
                <input
                    style={{ display: 'none' }}
                    type="file"
                    id="preview2"
                    accept="image/jpg, image/png, image/jpeg"
                    onChange={changeFile2}
                />
                <div className='projectInfo_div'>
                    <span className='projectInfo_title'>Project Links</span>
                    <div className='launch_about_box'>
                        <span className='launch_about_span'>
                            * Paste the URL of the information you require to share.
                        </span>
                        <span className='launch_about_span'>
                            * Project website, Github, Medium, Twitter, Notion links etc.
                        </span>
                    </div>
                    <div className='launch_add_wrapper'>
                        <div className='launch_add_link_box'>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Website
                                </span>
                                <span className='launch_add_link_url'>
                                    <input className='launch_add_link_input' placeholder='https://...' type='text' onChange={onChangeLink_web} value={link_web} />
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Github
                                </span>
                                <span className='launch_add_link_url'>
                                    <input className='launch_add_link_input' placeholder='https://...' type='text' onChange={onChangeLink_github} value={link_github} />
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Medium
                                </span>
                                <span className='launch_add_link_url'>
                                    <input className='launch_add_link_input' placeholder='https://...' type='text' onChange={onChangeLink_medium} value={link_medium} />
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Twitter
                                </span>
                                <span className='launch_add_link_url'>
                                    <input className='launch_add_link_input' placeholder='https://...' type='text' onChange={onChangeLink_twitter} value={link_twitter} />
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Notion
                                </span>
                                <span className='launch_add_link_url'>
                                    <input className='launch_add_link_input' placeholder='https://...' type='text' onChange={onChangeLink_notion} value={link_notion} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='projectInfo_div'>
                    <span className='projectInfo_title'>Project Details</span>
                    <div className='launch_about_box'>
                        <span className='launch_about_span'>
                            * Describe what you’re raising funds to do, how you plan to make it happen, why you’re doing it, and who you are.
                        </span>
                        <span className='launch_about_span'>
                            * Your description should tell investors everything they need to know.
                        </span>
                    </div>
                    <div className='launch_add_wrapper_big'>
                        <div className='launch_add_wrapper_big_head'>
                            <span className='launch_info'>
                                Semi Title
                            </span>
                            <span className='launch_info'>
                                Details
                            </span>
                        </div>
                        {
                            project_detail.map((x, i) => {
                                return (
                                    < div className='launch_add_wrapper_big_content' key={i} >
                                        <span className='launch_info'>
                                            <input className='launch_text_input' type='text' placeholder='semi title' onChange={(e) => changeDetail_semi(e.target.value, i)} value={project_detail[i].semiTitle} />
                                        </span>
                                        <span className='launch_info'>
                                            <TextareaAutosize className='launch_text_area' placeholder='details' onChange={(e) => changeDetail_detail(e.target.value, i)} value={project_detail[i].detail} />
                                        </span>
                                    </div>
                                )
                            })
                        }
                        <div className='launch_add_wrapper_big_addBox' onClick={() => addDetail()}>
                            <img className='launch_add_wrapper_big_icon' src={plusIcon} alt='plus' />
                            add new content
                        </div>
                    </div>
                </div>
                <div className='projectInfo_div'>
                    <span className='projectInfo_title'>Roadmap</span>
                    <div className='launch_about_box'>
                        <span className='launch_about_span'>
                            * Set a timed roadmap for your campaign. What, when, and how you will complete steps should be stated.
                        </span>
                        <span className='launch_about_span'>
                            * Set an achievable goal of funding sufficient enough to complete your project.
                        </span>
                    </div>
                    <div className='launch_add_wrapper_big'>
                        <div className='launch_add_wrapper_big_head'>
                            <span className='launch_roadmap'>
                                Deadline
                            </span>
                            <span className='launch_roadmap'>
                                Expenses
                            </span>
                            <span className='launch_roadmap'>
                                Details
                            </span>
                        </div>
                        {
                            project_roadmap.map((x, i) => {
                                return (
                                    <div className='launch_add_wrapper_big_content' key={i}>
                                        <span className='launch_roadmap'>
                                            <input className='launch_text_input' type='date' placeholder='select date' onChange={(e) => changeRoadmap_due(e.target.value, i)} />
                                        </span>
                                        <span className='launch_roadmap'>
                                            <input className='launch_text_input' type='number' placeholder='unit: KLAY' onChange={(e) => changeRoadmap_expense(e.target.value, i)} />
                                        </span>
                                        <span className='launch_roadmap'>
                                            <TextareaAutosize className='launch_text_area' placeholder='details' onChange={(e) => changeRoadmap_detail(e.target.value, i)} />
                                        </span>
                                    </div>
                                )
                            })
                        }
                        <div className='launch_add_wrapper_big_addBox' onClick={() => addRoadmap()}>
                            <img className='launch_add_wrapper_big_icon' src={plusIcon} alt='plus' />
                            add new content
                        </div>
                    </div>
                </div>
                <div className='projectInfo_div'>
                    <span className='projectInfo_title'>More (optional)</span>
                    <div className='launch_about_box'>
                        <span className='launch_about_span'>
                            * Introduce you/team to give investors an idea of who you are.
                        </span>
                        <span className='launch_about_span'>
                            * Add and state the rewards or compensation that will be given to your investors.
                        </span>
                    </div>
                    <div className='launch_add_wrapper_big'>
                        <div className='launch_add_wrapper_big_head'>
                            <span className='launch_more'>
                                Other Information
                            </span>
                        </div>
                        <div className='launch_add_wrapper_big_content'>
                            <span className='launch_more'>
                                <TextareaAutosize className='launch_text_area' onChange={onChangeProject_more} value={project_more} placeholder='write your extra story.' />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='projectInfo_div'>
                    <span className='projectInfo_title'>Project Preview</span>
                    <div className='launch_add_wrapper'>
                        <div className='launch_add_link_box'>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    ProjectName
                                </span>
                                <span className='launch_add_link_url'>
                                    {project_name}
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Total Funding Amounts
                                </span>
                                <span className='launch_add_link_url'>
                                    {getFundAmount(project_roadmap)}
                                </span>
                            </div>
                            <div className='launch_add_link_each'>
                                <span className='launch_add_link_tag'>
                                    Funding Periods
                                </span>
                                <span className='launch_add_link_url'>
                                    ~ {`${funding_due_year}. ${funding_due_month}. ${funding_due_date}.`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className='blueButton launch_submit_button' onClick={submit}>
                        Submit
                    </button>
                </div>
            </div>
        </div >
    );
}

export default Launch;