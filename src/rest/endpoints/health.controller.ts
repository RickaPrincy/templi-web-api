import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags("Health")
export class HealthController {
  @Get("/ping")
  @ApiOperation({
    operationId: "ping",
  })
  @ApiOkResponse({
    content: {
      "text/plain": {
        schema: {
          type: "string",
        },
      },
    },
  })
  async ping() {
    return "pong";
  }
}
