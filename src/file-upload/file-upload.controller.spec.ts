import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [FileUploadService],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should upload file', async () => {
    const req = {
      isMultipart: () => true,
      multipart: (handler: any, callback: any) => {
        handler('field', 'value', 'filename').then(() => {
          callback(null);
        });
      },
    } as any;

    const res = {
      code: (status: number) => ({
        send: (data: any) => {
          expect(status).toBe(200);
          expect(data.message).toBe('Data uploaded successfully');
        },
      }),
    } as any;

    await controller.uploadFile(req, res);
  });

  it('should return error if request is not multipart', async () => {
    const req = { isMultipart: () => false } as any;

    const res = {
      send: (error: any) => {
        expect(error.statusCode).toBe(400);
        expect(error.message.message).toBe('Request is not multipart');
      },
    } as any;

    await controller.uploadFile(req, res);
  });
});
