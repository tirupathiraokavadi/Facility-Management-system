export interface User {
  id: string;
  email: string;
  name?: string;
  phone:string,
  role: 'customer';
}

export interface Worker {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  rating: number;
  completedJobs: number;
  experience: number;
  hourlyRate: number;
  responseTime?: string
  skills: string[];
  role:'worker';
}
