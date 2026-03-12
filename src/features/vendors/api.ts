import api from '@/services/api';
import { Vendor } from '@/types';

export const vendorsApi = {
  getVendors(): Promise<Vendor[]> {
    return api.get<Vendor[]>('/vendors');
  },

  getFeaturedVendors(): Promise<Vendor[]> {
    return api.get<Vendor[]>('/vendors/featured');
  },

  getVendorById(id: string): Promise<Vendor> {
    return api.get<Vendor>(`/vendors/${id}`);
  },

  approveVendor(id: string): Promise<Vendor> {
    return api.patch<Vendor>(`/admin/vendors/${id}/approve`);
  },

  suspendVendor(id: string): Promise<Vendor> {
    return api.patch<Vendor>(`/admin/vendors/${id}/suspend`);
  },

  deleteVendor(id: string): Promise<void> {
    return api.delete<void>(`/admin/vendors/${id}`);
  },
};
