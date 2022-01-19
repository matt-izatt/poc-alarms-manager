import { ADFCodeBlock, ADFHeading, ADFParagraph } from "./adf";
import Ticket from "./ticket";

class TicketBuilder {
  private ticket: Ticket;

  constructor(projectId: string, issueTypeId: string, defaultPriority: string) {
    this.ticket = {
      fields: {
        project: {
          id: projectId
        },
        issuetype: {
          id: issueTypeId
        },
        priority: {
          id: defaultPriority
        },
        labels: [],
        summary: "",
        description: {
          type: "doc",
          version: 1,
          content: [],
        },
      },
    };
  }

  public title(title: string): TicketBuilder {
    this.ticket.fields.summary = title;
    return this;
  }

  public priority(priority: number): TicketBuilder {
    this.ticket.fields.priority.id = priority.toString();
    return this;
  }

  public label(label: string): TicketBuilder {
    this.ticket.fields.labels.push(label);
    return this;
  }

  public description(description: string): TicketBuilder {
    const adfDescription = [
      new ADFHeading("Description", 4),
      new ADFParagraph([description]),
    ];
    this.ticket.fields.description.content.push(...adfDescription);
    return this;
  }

  public date(date: string): TicketBuilder {
    const adfDate = [
      new ADFHeading("Date", 4),
      new ADFParagraph([date]),
    ];
    this.ticket.fields.description.content.push(...adfDate);
    return this;
  }

  public data(data: unknown): TicketBuilder {
    const dataAsString = JSON.stringify(data, null, 4);
    const adfData = [
      new ADFHeading("Data", 4),
      new ADFCodeBlock(dataAsString)
    ];
    this.ticket.fields.description.content.push(...adfData);
    return this;
  }

  public meta(meta: unknown): TicketBuilder {
    const metaAsString = JSON.stringify(meta, null, 4);
    const adfMeta = [
      new ADFHeading("Metadata", 4),
      new ADFCodeBlock(metaAsString)
    ];
    this.ticket.fields.description.content.push(...adfMeta);
    return this;
  }

  public stack(stack: string): TicketBuilder {
    const stackArray = stack.split("\n");
    const adfStack = [
      new ADFHeading("Stack Trace", 4),
      new ADFParagraph(stackArray),
    ];
    this.ticket.fields.description.content.push(...adfStack);
    return this;
  }

  public build(): Ticket {
    return this.ticket;
  }
}

export default TicketBuilder;