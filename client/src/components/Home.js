import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from './utils/Slider';
import FundingList from './FundingList';
import banner1 from '../image/banner/banner1.png';
import banner2 from '../image/banner/banner2.png';
import banner3 from '../image/banner/banner3.png';
import axios from 'axios';

function Home() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getAllProjects();
    }, [])

    const getAllProjects = async () => {
        const res = await axios.post('/api/getProjectList')
        setProjects(res.data.projects)
    }
    return (
        <>
            <Slider
                titles={['Good Items', 'Bravo Items', 'Bravo Items']}
                descs={[`It's good as good.\nThat's better as better.`, `It's bad as bad.\nThat's worse as worse.`, `It's bad as bad.\nThat's worse as worse.`]}
                images={[banner1, banner2, banner3]}
                height={'400px'} />
            <FundingList projects={projects} />
        </>
    );
}

export default Home;