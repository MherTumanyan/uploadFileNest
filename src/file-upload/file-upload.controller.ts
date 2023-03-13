import { Controller, Post, Req, Res } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import fastify = require('fastify');

@Controller('files')
export class FileUploadController {
  constructor(private uploadService: FileUploadService) {}
  @Post('/uploadFile')
  async uploadFile(
    @Req() req: fastify.FastifyRequest,
    @Res() res: fastify.FastifyReply<any>,
  ): Promise<any> {
    return await this.uploadService.uploadFile(req, res);
  }
}
