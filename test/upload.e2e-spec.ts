import { Test, TestingModule } from '@nestjs/testing';
import * as fastify from 'fastify';
import * as fs from 'fs';

import { FileUploadService } from './../src/file-upload/file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let app: fastify.FastifyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadService],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);

    app = fastify.default();
    app.register(require('fastify-multipart'));
    app.post('/files/uploadFile', (req, res) => service.uploadFile(req, res));
  });

  afterAll(async () => {
    await app.close();
  });
  async function waitForFileToExist(filePath: string, maxWaitTimeMs = 500): Promise<void> {
    const startTime = Date.now();
    while (!fs.existsSync(filePath) && Date.now() - startTime < maxWaitTimeMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`File '${filePath}' was not created within ${maxWaitTimeMs} ms`);
    }
  }
  
  it('should upload file successfully', async () => {
    const filename = 'test.txt';
    const fileData = 'File uploaded successfully';
    const boundary = 'my-boundary';
  
    // create a multipart/form-data request payload
    const payload = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: text/plain\r\n\r\n${fileData}\r\n--${boundary}--`;
  
    const response = await app.inject({
      method: 'POST',
      url: '/files/uploadFile',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      payload,
    });
  
    expect(response.statusCode).toEqual(200);
  
    const filePath = `uploads/${filename}`;
  
    await waitForFileToExist(filePath);
  
    const fileContent = fs.readFileSync(filePath, 'utf8');
    expect(fileContent).toBe(fileData);
  
    fs.unlinkSync(filePath);
  });
}) ;