import axios from "axios";
import Ticket from "./ticket";
import TicketBuilder from "./ticket-builder";

enum LogPriority {
  critical = 1,
  error = 2,
}

interface JiraConfig {
  url: string;
  token: string;
  projectId: string;
  issueTypeId: string;
  defualtPriority: string;
}

interface CloudWatchAlarm {
  message: string;
  date: string;
  service: string;
  level: string;
  description?: string;
  stack?: string;
  data?: string;
  meta?: string;
}

interface TicketCreationResponse {
  id: string;
  key: string;
  self: string;
}

export async function handler(
  event: CloudWatchAlarm,
): Promise<TicketCreationResponse> {
  const jiraConfig = getJiraConfig();

  const config = {
    headers: {
      Authorization: `Basic ${jiraConfig.token}`,
    },
  };

  const data = buildTicket(event, jiraConfig);

  const response = await axios.post<TicketCreationResponse>(
    `${jiraConfig.url}/issue`,
    data,
    config,
  );

  return response.data;
}

function buildTicket(alarm: CloudWatchAlarm, jiraConfig: JiraConfig): Ticket {
  const ticketBuilder = new TicketBuilder(jiraConfig.projectId, jiraConfig.issueTypeId, jiraConfig.defualtPriority);

  ticketBuilder
    .title(alarm.message)
    .priority(getLogPriority(alarm.level))
    .date(alarm.date);

  if (alarm.service === 'lender-dashboard') {
    ticketBuilder.label('investor');
  } else {
    ticketBuilder.label('lending');
  }
  
  if (alarm.description) {
    ticketBuilder.description(alarm.description);
  }  

  if (alarm.stack) {
    ticketBuilder.stack(alarm.stack);
  }

  if (alarm.data) {
    ticketBuilder.data(alarm.data);
  }

  if (alarm.meta) {
    ticketBuilder.meta(alarm.meta);
  }

  return ticketBuilder.build();
}

function getJiraConfig(): JiraConfig {
  const url = process.env.JIRA_URL;
  const token = process.env.JIRA_TOKEN;
  const projectId = process.env.JIRA_PROJECT_ID || "10004";
  const issueTypeId = process.env.JIRA_ISSUE_TYPE_ID || "10005";
  const defualtPriority = process.env.JIRA_DEFAULT_PRIORITY || "3";

  if (!url || url.length === 0) {
    throw new Error("Missing JIRA_URL");
  }

  if (!token || token.length === 0) {
    throw new Error("Missing JIRA_TOKEN");
  }

  return {
    url,
    token,
    projectId,
    issueTypeId,
    defualtPriority
  };
}

function getLogPriority(level: string): LogPriority {
  switch (level) {
    case "error":
      return LogPriority.error;

    case "critical":
      return LogPriority.critical;

    default:
      throw new Error(
        `Log level ${level} is not recognised. Use error or critical.`,
      );
  }
}
