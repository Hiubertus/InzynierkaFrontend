"use server"

import axios from "axios";

export const fetchUserProfile = async ( id: number) => {
    const profileData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/user-profile/get/${id}`, {
    });
    return profileData.data.data;
}