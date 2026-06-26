import { Component, Input } from '@angular/core';

export interface Column {
    key: string;
    header: string;
}

// Generic table renderer shared by the 3 data pages: given column definitions
// ({ header, key }) and rows, renders the same markup/classes as the vanilla-JS version.
@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.html',
})
export class DataTable {
    @Input({ required: true }) columns!: Column[];
    @Input({ required: true }) rows!: Record<string, unknown>[];
    @Input({ required: true }) emptyMessage!: string;
}
