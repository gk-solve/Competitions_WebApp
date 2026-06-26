import { Component } from '@angular/core';
import { DataTable, Column } from '../data-table/data-table';
import { useFetchJson } from '../use-fetch-json';

interface CompetitorRow {
    [key: string]: unknown;
    Last_Name: string;
    First_Name: string;
    Country_Residence: string;
}

const COLUMNS: Column[] = [
    { key: 'Last_Name', header: 'Nom' },
    { key: 'First_Name', header: 'Prénom' },
    { key: 'Country_Residence', header: 'Pays' },
];

@Component({
    selector: 'app-competitors',
    imports: [DataTable],
    templateUrl: './competitors.html',
})
export class Competitors {
    columns = COLUMNS;
    protected readonly fetch = useFetchJson<CompetitorRow[]>('/api/competitors');
}
