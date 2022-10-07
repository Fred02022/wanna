import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";

import category1 from '../image/category/1.png';
import category2 from '../image/category/2.png';
import category3 from '../image/category/3.png';
import category4 from '../image/category/4.png';
import category5 from '../image/category/5.png';
import category6 from '../image/category/6.png';
import category7 from '../image/category/7.png';
import category8 from '../image/category/8.png';

function Category() {

    //keyword

    return (
        <div className='container'>
            <span className='category_container'>
                <Link to={`/funding?category=1`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category1} alt='games' />
                        </div>
                        <span className='category_title'>
                            Games
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=2`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category2} alt='exchanges' />
                        </div>
                        <span className='category_title'>
                            Exchange
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=3`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category3} alt='finance' />
                        </div>
                        <span className='category_title'>
                            Finance
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=4`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category4} alt='social' />
                        </div>
                        <span className='category_title'>
                            Social
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=5`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category5} alt='public goods' />
                        </div>
                        <span className='category_title'>
                            PublicGoods
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=6`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category6} alt='infrastructure' />
                        </div>
                        <span className='category_title'>
                            Infrastructure
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=7`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category7} alt='metaverse/nft' />
                        </div>
                        <span className='category_title'>
                            Metaverse/NFT
                        </span>
                    </div>
                </Link>
                <Link to={`/funding?category=8`}>
                    <div className='category_each'>
                        <div className='category_img'>
                            <img className='category_img_' src={category8} alt='dao' />
                        </div>
                        <span className='category_title'>
                            DAO
                        </span>
                    </div>
                </Link>
            </span>
        </div>
    );
}

export default Category;