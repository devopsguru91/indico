/* This file is part of Indico.
 * Copyright (C) 2002 - 2018 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico; if not, see <http://www.gnu.org/licenses/>.
 */

import fetchDefaultLocationUrl from 'indico-url:rooms_new.default_location';

import {indicoAxios, handleAxiosError} from 'indico/utils/axios';

// User
export const SET_USER = 'SET_USER';
// Filter
export const SET_TEXT_FILTER = 'SET_TEXT_FILTER';
export const SET_FILTER_PARAMETER = 'SET_FILTER_PARAMETER';
// Rooms
export const FETCH_ROOMS_STARTED = 'FETCH_ROOMS_STARTED';
export const FETCH_ROOMS_FAILED = 'FETCH_ROOMS_FAILED';
export const UPDATE_ROOMS = 'UPDATE_ROOMS';
// Map location
export const FETCH_DEFAULT_LOCATION_STARTED = 'FETCH_DEFAULT_LOCATION_STARTED';
export const FETCH_DEFAULT_LOCATION_FAILED = 'FETCH_DEFAULT_LOCATION_FAILED';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';


export function setUser(data) {
    return {type: SET_USER, data};
}

export function setTextFilter(textFilter) {
    return {type: SET_TEXT_FILTER, textFilter};
}

export function fetchRoomsStarted() {
    return {type: FETCH_ROOMS_STARTED};
}

export function fetchRoomsFailed() {
    return {type: FETCH_ROOMS_FAILED};
}

export function updateRooms(rooms) {
    return {type: UPDATE_ROOMS, rooms};
}

export function fetchRooms(reducerName) {
    return async (dispatch, getStore) => {
        dispatch(fetchRoomsStarted());

        const {staticData: {fetchRoomsUrl}} = getStore();
        const {filters: {text}} = getStore()[reducerName];
        let response;
        const params = {};
        if (text) {
            params.room_name = text;
        }

        try {
            response = await indicoAxios.get(fetchRoomsUrl, {params});
        } catch (error) {
            handleAxiosError(error);
            dispatch(fetchRoomsFailed());
            return;
        }

        dispatch(updateRooms(response.data));
    };
}

export function setFilterParameter(namespace, param, data) {
    return {type: SET_FILTER_PARAMETER, namespace, param, data};
}

export function fetchDefaultLocationStarted() {
    return {type: FETCH_DEFAULT_LOCATION_STARTED};
}

export function fetchDefaultLocationFailed() {
    return {type: FETCH_DEFAULT_LOCATION_FAILED};
}

export function updateLocation(location) {
    return {type: UPDATE_LOCATION, location};
}

export function fetchMapDefaultLocation() {
    return async (dispatch) => {
        dispatch(fetchDefaultLocationStarted());

        let response;
        try {
            response = await indicoAxios.get(fetchDefaultLocationUrl());
        } catch (error) {
            handleAxiosError(error);
            dispatch(fetchDefaultLocationFailed());
            return;
        }

        const data = response.data;
        const location = [
            [parseFloat(data.top_left_latitude), parseFloat(data.top_left_longitude)],
            [parseFloat(data.bottom_right_latitude), parseFloat(data.bottom_right_longitude)]
        ];
        dispatch(updateLocation(location));
    };
}
