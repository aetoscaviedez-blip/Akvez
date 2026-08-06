export interface ProspectSearchRequestPayload {
  industry: string;
  location: string;
  designerStyle: string;
  excludeNames?: string[];
}

export async function fetchProspects(payload: ProspectSearchRequestPayload): Promise<any> {
  const response = await fetch("/api/prospect/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}
