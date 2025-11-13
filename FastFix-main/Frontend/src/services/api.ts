import axios from 'axios';
import { Worker } from '../types';

const BASE_URL = 'https://fastfix-0sal.onrender.com/api/workers';

export const api = {
  getWorkers: async (): Promise<Worker[]> => {
    const res = await axios.get(`${BASE_URL}`);
    return res.data.map((w: any) => ({ ...w, id: w._id }));
  },

  getWorkersBySkill: async (skill: string): Promise<Worker[]> => {
    const res = skill === 'all'
      ? await axios.get(`${BASE_URL}`)
      : await axios.get(`${BASE_URL}/skill/${skill}`);
    return res.data.map((w: any) => ({ ...w, id: w._id }));
  },

  getWorkerById: async (id: string): Promise<Worker> => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    const w = res.data;
    return { ...w, id: w._id };
  },

  callWorker: async (
    workerId: string,
    customerPhone: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await axios.post(`${BASE_URL}/${workerId}/call`, {
      customerPhone,
    });
    return res.data;
  },
  messageWorker: async (
    workerId: string,
    customerPhone: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await axios.post(`${BASE_URL}/${workerId}/message`, {
      customerPhone,
    });
    return res.data;
  },
};
