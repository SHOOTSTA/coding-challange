import React from 'react';
import * as axios from 'axios';
import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import Bike from ".";

const bikeData = {
    data: {
        bikes: [
            {
                date_stolen: 1656364074,
                description: null,
                external_id: null,
                frame_colors: ['Black'],
                frame_model: "Tesoro neo x2",
                id: 1333096,
                is_stock_img: false,
                large_img: "https://files.bikeindex.org/uploads/Pu/597696/large_FC486C02-52AC-40C6-BDE1-ADDDA819E258.jpeg",
                location_found: null,
                manufacturer_name: "Cannondale",
                registry_name: null,
                registry_url: null,
                serial: "9531010220613",
                status: "stolen",
                stolen: true,
                stolen_coordinates: [52.5, 13.34],
                stolen_location: "Berlin, 10777, DE",
                thumb: "https://files.bikeindex.org/uploads/Pu/597696/small_FC486C02-52AC-40C6-BDE1-ADDDA819E258.jpeg",
                title: "2020 Cannondale Tesoro neo x2",
                url: "https://bikeindex.org/bikes/1333096",
                year: 2020
            }
        ]
    }
}

const bikeCount = {
    data: {
        non: 742373,
        proximity: 73,
        stolen: 115753
    }
}

jest.mock('axios');

describe('bike index page', () => {
    beforeAll(() => {
        console.error = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
    test('checking bike api response', () => {
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
    });
    test('checking bike api returns wrong response', async () => {
        const errorMsg = 'Somthing went wrong please try again';
        (axios as any).get.mockImplementation(
            () => Promise.resolve({ status: 404 }),
        );
        render(<Bike />);
        await waitFor(() => {
            expect(screen.getByText(errorMsg)).toBeTruthy();
        });
    });
    test('checking the place holder', async () => {
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
        expect(screen.getByTestId('title')).toBeTruthy();
    });
    test(' checking the data with text ', async () => {
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
        fireEvent.change(screen.getByTestId('title'), {
            target: {
                value: 'Tesoro'
            }
        });
        await new Promise((r) => setTimeout(r, 1000));

        act(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        await waitFor(() => {
            expect(screen.getByText('2020 Cannondale Tesoro neo x2')).toBeTruthy();
        });
    });
    test('checking the data with out text', async () => {
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
        fireEvent.change(screen.getByTestId('title'), {
            target: {
                value: ''
            }
        });
        await new Promise((r) => setTimeout(r, 1000));

        act(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        await waitFor(() => {
            expect(screen.getByText('2020 Cannondale Tesoro neo x2')).toBeTruthy();
        });
    });
    test('checking pagination', async () => {
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeCount.data,
            }),
        );
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
        await new Promise((r) => setTimeout(r, 1000));
        await waitFor(() => {
            expect(screen.getByRole("list")).toBeTruthy();
        });
    })
    test('checking pagination count', async () => {        
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeCount.data,
            }),
        );
        (axios as any).get.mockImplementation(
            () => Promise.resolve({
                status: 200,
                data: bikeData.data,
            }),
        );
        render(<Bike />);
        await new Promise((r) => setTimeout(r, 1000));
        act(() => {
            fireEvent.click(screen.getByLabelText("Go to last page"));
        });
        await waitFor(() => {
            expect(screen.getByText('2020 Cannondale Tesoro neo x2')).toBeTruthy();
        });
    })
})