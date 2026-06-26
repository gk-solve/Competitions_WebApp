import { Component } from '@angular/core';
import { DataTable, Column } from '../data-table/data-table';
import { useFetchJson } from '../use-fetch-json';

interface ResultRow {
    [key: string]: unknown;
    Sport: string;
    Competition_Name: string;
    Competition_Track: string;
    Last_Name: string;
    First_Name: string;
    Country_Residence: string;
    Elapsed_Time: string;
    Individual_Rank: number;
    Result_Status: string;
}

const COLUMNS: Column[] = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Compétition' },
    { key: 'Competition_Track', header: 'Épreuve' },
    { key: 'Last_Name', header: 'Nom' },
    { key: 'First_Name', header: 'Prénom' },
    { key: 'Country_Residence', header: 'Pays' },
    { key: 'Elapsed_Time', header: 'Temps' },
    { key: 'Individual_Rank', header: 'Rang' },
    { key: 'Result_Status', header: 'Statut' },
];

@Component({
    selector: 'app-results',
    imports: [DataTable],
    templateUrl: './results.html',
})
export class Results {
    columns = COLUMNS;
    protected readonly fetch = useFetchJson<ResultRow[]>('/api/results');
}
