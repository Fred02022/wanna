import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import caver from './chain/caver.js';

import useInput from '../hooks/useInput';

function UserRevise() {

    const { address, myInfo, getMyInfo } = useOutletContext();

    const [file_, setFile_] = useState(null);
    const [imageUrl_, setImageUrl_] = useState(null);

    const [name_, onChangeName_] = useInput('');
    const [intro_, onChangeIntro_] = useInput('');

    const navigate = useNavigate();

    useEffect(() => {
        if (myInfo?.name === undefined) return
        setImageUrl_(myInfo.profile)
        onChangeName_({ target: { value: myInfo.name } })
        onChangeIntro_({ target: { value: myInfo.intro } })
    }, [myInfo])

    const imagePreview = () => {
        if (!file_) return
        const url = URL.createObjectURL(file_)
        setImageUrl_(url)
        console.log(url)
    }

    useEffect(() => {
        if (!file_) return
        console.log(file_)
        imagePreview()
    }, [file_])

    const changeFile = (e) => {
        setFile_(e.target.files[0])
    }

    const submit = async () => {
        try {
            const sign = await caver.klay.sign("changeUserInfo", address)
            const formData = new FormData();
            formData.append("info", JSON.stringify({ intro: intro_, address: address, name: name_ }));
            formData.append("img", file_);
            const res = await axios.post("/api/changeUserInfo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            if (res.data.result === 'success') {
                alert('info saved.')
                await getMyInfo(address)
                navigate(`/user/${address}`)
            } else {
                alert('error occured.')
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='user_whole'>
            <div className='user_profile_revise_box'>
                <span className='user_profile_revise_div' onClick={submit}>
                    save
                </span>
            </div>
            <span className='projectInfo_title'>
                Set Profile Picture
            </span>
            <div className='user_revise_image'>
                <div className='launch_image_box2'>
                    {
                        imageUrl_ === null
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
                            <img style={{ width: '100%', height: '100%' }} src={imageUrl_} alt='' />
                    }
                </div>
                <label className='blueButton launch_file_upload' htmlFor="preview">
                    select image
                </label>
                <input
                    style={{ display: 'none' }}
                    type="file"
                    name='img'
                    id="preview"
                    accept="image/jpg, image/png, image/jpeg"
                    onChange={changeFile}
                />

            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>User Name</span>
                <div className='user_revise_intro'>
                    <span className='launch_more'>
                        <input className='launch_add_link_input' placeholder='maximum 20 letters' maxLength={20} type='text' onChange={onChangeName_} value={name_} />
                    </span>
                </div>
            </div>
            <div className='projectInfo_div'>
                <span className='projectInfo_title'>Introduction</span>
                <div className='user_revise_intro'>
                    <span className='launch_more'>
                        <TextareaAutosize className='launch_text_area' onChange={onChangeIntro_} value={intro_} placeholder='write your intro' />
                    </span>
                </div>
            </div>
        </div>
    );
}

export default UserRevise;