import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from 'react-js-pagination';
import LoadIcon from "../assets/spinner.gif"
import './styles.css';
import BikeTable from "./bike-table";

//API for Searc bike
const ROOT_URL = `https://bikeindex.org/api/v3/search`;

interface BikeList {
    id: number;
    [key: string]: any;
}

const perPage = 10;

const Bike = () => {
    const [bikeData, setBikeData] = useState<BikeList[]>([]);
    const [loader, setLoader] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('');
    const [stolenBikeCount, setStolenBikeCount] = useState<number>(0);
    const [totalBikeCount, setTotalBikeCount] = useState<number>(0);
    const [checkData, setCheckData] = useState<string>('');
    const [error, setError] = useState<string>('');

    // calling api service when chenge the page value
    const fetchData = async () => {
        setBikeData([]);
        setCheckData('');
        setLoader(true);
        const [bikeStolen, bikeCount] = await Promise.all([bikeCountData(), bikeStolenData()]);
        console.log(bikeStolen, bikeCount);
        setLoader(false);
        const { data: bikeList, status: listStatus } = bikeCount;
        const { data: countData, status: countStatus } = bikeStolen;
        if (listStatus === 200 && countStatus === 200) {
            setStolenBikeCount(countData.proximity);
            setTotalBikeCount(countData.proximity);
            setBikeData(bikeList.bikes);
            setError('');
            if (bikeList.bikes.length <= 0) {
                setCheckData('Data Not Found.');
            }
        } else {
            setError('Somthing went wrong please try again');
        }
    }

    useEffect(() => {
        fetchData();
    }, [page]);


    const bikeCountData = async () => {
        return await axios.get(`${ROOT_URL}/count?location=Berlin&stolenness=proximity&query=${searchText}`);
    }

    const bikeStolenData = async () => {
        return await axios.get(`${ROOT_URL}?page=${page}&per_page=${perPage}&query=${searchText}&location=Berlin&stolenness=proximity`);
    }

    //handling the page number here
    const pageHandler = (pageNumber: number) => {
        setPage(pageNumber);
    }

    //handling the input text value here
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }

    //handling filter here
    const handleSubmit = () => {
        if (page === 1) {
            fetchData();
        } else {
            setPage(1);
        }
    }

    return (
        <div >
            <h2 className="head">Berlin Police Department-Bike Stolen List</h2>
            {/*filter start from here*/}
            <div className="main">
                <div className="main1">
                    <label className="label-1">Search By Title:</label>
                    <input className='input-1' type="text" data-testid='title' placeholder="Please Enter Title of Bike" value={searchText} onChange={handleInputChange} />
                    <button className='btn-1' onClick={handleSubmit}>Submit</button>
                </div>
                {/* displaying bike table here*/}
                <h4 className="head1">Total no.of bikes: <span>{totalBikeCount}</span></h4>
            </div>
            {/*filter end here*/}
            <BikeTable bikeData={bikeData} />
            {checkData && <p className="errorMessage">{checkData}</p>}
            {error && <p>{error}</p>}
            {/*page loader*/}
            {loader && <p><img src={LoadIcon} alt="Loading....." /></p>}
            {/*pagination start from here*/}
            <div>
                <Pagination
                    data-testid='pagination'
                    activePage={page}
                    itemsCountPerPage={perPage}
                    totalItemsCount={stolenBikeCount}
                    pageRangeDisplayed={5}
                    onChange={pageHandler}
                    nextPageText={'⟩'}
                    prevPageText={'⟨'}
                />
            </div>
        </div >
    )
}

export default Bike