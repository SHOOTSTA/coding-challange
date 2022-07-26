import React from 'react';
import dummyImg from './../assets/images/no-image.png';

interface BikeList {
    id: number;
    [key: string]: any;
}

//Table Data
const BikeTable = ({ bikeData }: { bikeData: BikeList[] }) => {
    return (
        <div className="search-table ">
            <table >
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Frame Color</th>
                        <th>Case Description</th>
                        <th>Date</th>
                        <th>Theft Location</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {bikeData?.map((bike: any, index: number) =>
                        <tr key={index}>
                            <td>{bike.id}</td>
                            <td >{bike.title || 'N/A'}</td>
                            <td>{bike.frame_colors || 'N/A'}</td>
                            <td>{bike.description || 'N/A'}</td>
                            <td><span >{new Date(bike.date_stolen * 1000).toString().substring(0, 15)}</span></td>
                            <td>{bike.stolen_location || 'N/A'}</td>
                            <td><img width='80px' src={`${bike.thumb !== null ? bike.thumb : dummyImg}`} alt="profile" /></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default BikeTable;