import React, { useState, useEffect } from 'react';
import { Link, Outlet } from "react-router-dom";

import FundingEach from './FundingEach';

function FundingList({ projects }) {
    return (
        <div className='container funding_whole'>
            {
                projects.map((x, i) => {
                    return (
                        <FundingEach key={i} projectId={x.id} projectName={x.name}
                            projectOwner={x.launcher} category={x.category}
                            funding={x.funding} funding_all={x.funding_all} start={x.start_date} />
                    )
                })
            }
        </div>
    );
}

export default FundingList;