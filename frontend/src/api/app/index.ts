import { AxiosResponse } from 'axios';
import { api } from '../instances';

export interface CompetitionIn { name: string, password:string}
export interface CompetitionOut { name: string, id:string, is_joined: boolean, is_owner: boolean}
type R<T> = Promise<AxiosResponse<T>>
// type E<T> = Promise<AxiosError<T>>

export function createCompetition(data: CompetitionIn): R<CompetitionOut> {
  return api.post('api/competition/create-competition', data);
}

export function getCompetitionList(): R<CompetitionOut[]> {
  return api.get('api/competition/competitions');
}

export interface JoinCompetition {
    competition: string;
    password: string;
}

export interface UtilMessage {
    message: string;
    status: string;
}

export function joinCompetition(data: JoinCompetition): R<UtilMessage> {
  return api.post('api/competition/competition-join', data);
}

export interface CompetitionOutDetail {
    name: string,
    id:string,
    is_owner: boolean
}
export function getCompetition(id: string): R<CompetitionOutDetail> {
  return api.get(`api/competition/${id}`);
}

export interface CreateCompetitionRole {
    role: string;
    competition: string;
}
export interface CompetitionRole {
    role: string
}
export function createCompetitionRole(data: CreateCompetitionRole): R<CompetitionRole> {
  return api.post(`api/competition/${data.competition}/roles`, data);
}

export function getCompetitionRoles(id: string): R<CompetitionRole[]> {
  return api.get(`api/competition/${id}/roles`);
}
