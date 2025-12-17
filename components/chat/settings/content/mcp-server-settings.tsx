import MCPServersList from "../../mcp/MCPServersList";

export function MCPServerSettings() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Cấu hình địa chỉ MCP server, API key, và cổng kết nối.</p>
      {/* TODO: Add MCP server configuration form */}
      <MCPServersList></MCPServersList>
    </div>
  )
}
