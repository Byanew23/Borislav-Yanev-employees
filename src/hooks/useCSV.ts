
export interface CSVEntry {
    [key: string]: string | null | Date
}

export interface TableDataEntry {
    [key: string]: { EmpIDs: string[]; MaxDaysWorked: number, From: Date, To: Date }
}

export const useCSV = (text: String | undefined) => {
    if (!text) {
        return null
    }

    const rows: string[] = text.split('\n');

    const csvHeaders: string[] = rows[0].split(',').map(x => x.trim());

    const result: CSVEntry[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row: string[] = rows[i].split(',');
        const entry: CSVEntry = {};

        for (let j = 0; j < csvHeaders.length; j++) {
            entry[csvHeaders[j]] = row[j].trim();
        }
        const dateTo = entry.DateTo === 'NULL' ? new Date() : new Date(entry.DateTo as string);

        result.push({ ...entry, DateTo: dateTo, DateFrom: new Date(entry.DateFrom as string) });
    }

    // Remove last row if empty
    if (result.length > 0 && Object.keys(result[result.length - 1]).length === 0) {
        result.pop();
    }

    const collabsByProject: TableDataEntry = {}

    for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
            const projectID1 = result[i].ProjectID;
            const projectID2 = result[j].ProjectID;

            if (projectID1 === projectID2) {
                const key = `${projectID1}`;
                const startDate = new Date(Math.max((result[i].DateFrom as Date).getTime(), (result[j].DateFrom as Date).getTime()));
                const endDate = new Date(Math.min((result[i].DateTo as Date).getTime(), (result[j].DateTo as Date).getTime()));

                if (startDate <= endDate) {
                    const daysWorkedTogether = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (!collabsByProject[key] || daysWorkedTogether > collabsByProject[key].MaxDaysWorked) {
                        collabsByProject[key] = {
                            EmpIDs: [result[i].EmpID as string, result[j].EmpID as string],
                            MaxDaysWorked: daysWorkedTogether,
                            From: startDate,
                            To: endDate
                        };
                    }
                }
            }
        }
    }

    const tableHeaders: string[] = ['Employee ID #1', 'Employee ID #2', 'Project ID', 'Days worked']

    return { headers: tableHeaders, data: collabsByProject }
}