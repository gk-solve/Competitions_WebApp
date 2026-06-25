// Generic table renderer shared by the 3 data pages: given column definitions
// ({ header, key }) and rows, renders the same markup/classes as the vanilla-JS version.
export default function DataTable({ columns, rows, emptyMessage }) {
    if (rows.length === 0) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id ?? index}>
                            {columns.map((column) => (
                                <td key={column.key}>{row[column.key] ?? ''}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
