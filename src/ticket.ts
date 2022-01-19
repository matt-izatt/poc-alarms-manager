import { ADF } from "./adf";

interface Ticket {
    fields: {
        project: {
            id: string;
        };
        issuetype: {
            id: string;
        };
        priority: {
            id: string;
        };
        labels: string[];
        summary: string;
        description: {
            type: "doc";
            version: 1;
            content: ADF[];
        };
    }
}
export default Ticket;