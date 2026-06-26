import { Component } from '@angular/core';
import { DataTable, Column } from '../data-table/data-table';
import { useFetchJson } from '../use-fetch-json';

interface CompetitionRow {
    [key: string]: unknown;
    Sport: string;
    Competition_Name: string;
    Competition_Track: string;
    Competition_Date: string;
    Location_City: string;
    Location_Country: string;
}

const COLUMNS: Column[] = [
    { key: 'Sport', header: 'Sport' },
    { key: 'Competition_Name', header: 'Compétition' },
    { key: 'Competition_Track', header: 'Épreuve' },
    { key: 'Competition_Date', header: 'Date' },
    { key: 'Location_City', header: 'Ville' },
    { key: 'Location_Country', header: 'Pays' },
];

@Component({
    selector: 'app-competitions',
    imports: [DataTable],
    templateUrl: './competitions.html',
})
export class Competitions {
    columns = COLUMNS;
    protected readonly fetch = useFetchJson<CompetitionRow[]>('/api/competitions');
}
