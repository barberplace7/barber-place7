import { create } from 'zustand';

interface MasterDataStore {
  services: any[];
  capsters: any[];
  kasirList: any[];
  products: any[];
  cabangList: any[];
  branchList: any[];
  setServices: (services: any[]) => void;
  setCapsters: (capsters: any[]) => void;
  setKasirList: (kasirList: any[]) => void;
  setProducts: (products: any[]) => void;
  setCabangList: (cabangList: any[]) => void;
  setBranchList: (branchList: any[]) => void;
}

export const useMasterDataStore = create<MasterDataStore>((set) => ({
  services: [],
  capsters: [],
  kasirList: [],
  products: [],
  cabangList: [],
  branchList: [],
  setServices: (services) => set({ services }),
  setCapsters: (capsters) => set({ capsters }),
  setKasirList: (kasirList) => set({ kasirList }),
  setProducts: (products) => set({ products }),
  setCabangList: (cabangList) => set({ cabangList }),
  setBranchList: (branchList) => set({ branchList }),
}));
