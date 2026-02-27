export type LocusRole = 'admin' | 'normal' | 'limited';

export interface LocusUser {
    id: number;
    role: LocusRole;
}
