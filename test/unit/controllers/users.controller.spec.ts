import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../src/api/controllers/users.controller';
import { UsersService } from 'src/domain/services/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            get: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
