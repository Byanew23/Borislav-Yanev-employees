import React, { useEffect, useState } from 'react';
import { TableDataEntry, useCSV } from '../hooks';
import './dataTable.css';

export const DataTable = ({ file }: { file: string | ArrayBuffer | null | undefined }) => {
    const csvData = useCSV(file as string);

    const [tableContent, setTableContent] = useState<{ headers: string[], data: TableDataEntry }>({ headers: [], data: {} });

    useEffect(() => {
        if (csvData?.headers && csvData.data) {
            // Only update the state if it's different from the current state
            if (
                csvData.headers.join(',') !== tableContent.headers.join(',') ||
                JSON.stringify(csvData.data) !== JSON.stringify(tableContent.data)
            ) {
                setTableContent({ headers: csvData.headers, data: csvData.data });
            }
        }
    }, [csvData, tableContent.headers, tableContent.data]);

    if (!tableContent.headers || !tableContent.data) {
        return null;
    }


    return (
        <table id="csvTable">
            <thead>
                <tr>
                    {tableContent.headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Object.keys(tableContent.data).map((project, rowIndex) => (
                    <tr key={project}>
                        {tableContent.data[project].EmpIDs.map((value, colIndex) => (
                            <td key={colIndex}>{value}</td>
                        ))}
                        <td>{project}</td>
                        <td>{tableContent.data[project].MaxDaysWorked}</td>
                    </tr>

                ))}
            </tbody>
        </table>
    );
};
