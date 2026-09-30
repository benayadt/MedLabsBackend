import { Patient } from '../mock-data/patients';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const patientApi = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch patients: ${response.status}`);
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating patient:', error);
      return null;
    }
  },

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating patient:', error);
      return null;
    }
  },

  async deletePatient(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting patient:', error);
      return false;
    }
  },
};
