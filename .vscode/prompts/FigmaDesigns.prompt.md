---
mode: "agent"
---

# Pull Design Data from Figma

Use the `figma` MCP server defined in the `mcp.json` file to fetch design data from one or more Figma URLs. Below is an example prompt to pull data:

## Example Prompt

```
use get_figma_data to get the design data from the following URLs:
- PTO: https://www.figma.com/design/ETegd6QoXRb3SHuqm22pvi/Time-Tracker-Update?node-id=54-3110&m=dev
- Colors: https://www.figma.com/design/ETegd6QoXRb3SHuqm22pvi/Time-Tracker-Update?node-id=61-1700&m=dev
- Current Timesheet: https://www.figma.com/design/ETegd6QoXRb3SHuqm22pvi/Time-Tracker-Update?node-id=8-105&m=dev
- Projects: https://www.figma.com/design/ETegd6QoXRb3SHuqm22pvi/Time-Tracker-Update?node-id=37-1420&m=dev
```

### Notes

- Ensure the `FIGMA_API_KEY` is set in the environment variables as defined in the `mcp.json` file.
- Replace `[Add more URLs as needed]` with additional Figma design URLs you are working on.
- The `node-id` parameter in the URL specifies the design node to fetch.
