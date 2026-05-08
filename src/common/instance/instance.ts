import axios from "axios";

const token = 'd8f3e783-2015-4639-b053-c6fffaa79000'
const apiKey = '68ce592e-fe87-4422-ab28-6cb2289a24e0'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    Authorization: `Bearer ${token}`,
    'API-KEY': apiKey
  }
})