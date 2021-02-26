import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { BooksController } from './books.controller';
import { PrismaService } from '../prisma/prisma.service';
import { BooksService } from './books.service';
import { UtilityService } from '../utility/utility.service';

describe('BooksController', () => {
  let controller: BooksController;
  let database: PrismaService;
  let utility: UtilityService;

  let mockBook: any = {
    title: 'Mock Book',
    publishYear: 2020,
    isbn: 8675309,
    description: 'A book',
    price: 1.50,
    coverUrl: '',
    sold: 0,
    publisher: {
      connectOrCreate: {
        where: {
          name: 'A Mock Publisher'
        },
        create: {
          name: 'A Mock Publisher',
          city: '',
          state: ''
        }
      }
    }
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        BooksService,
        UtilityService
      ],
      controllers: [ BooksController ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    utility = module.get<UtilityService>(UtilityService);
    database = module.get<PrismaService>(PrismaService);

    let b;

    if(b = await database.book.findFirst({ where: { title: mockBook.title }})) {
      await database.book.delete({ where: { id: b.id }});
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have a method findAll', async () => {
    const select = await utility.convertOtoB({ id: true }) as unknown as Prisma.AuthorSelect;
    const first = await database.book.findFirst();
    const cursor = await utility.convertOtoB({ id: first?.id }) as unknown as Prisma.BookWhereUniqueInput;
    const orderBy = await utility.convertOtoB({ title: 'asc' }) as unknown as Prisma.BookOrderByInput;
    const where = await utility.convertOtoB({ id: first?.id }) as unknown as Prisma.BookWhereInput;
    await expect(controller.findAll).toBeDefined();
    let findAll = await controller.findAll(0, 10, cursor, where, orderBy, select);
    await expect(findAll).toBeDefined();
    await expect(findAll.length).toBeGreaterThan(0);

    findAll = await controller.findAll();
    await expect(findAll).toBeDefined();
    await expect(findAll.length).toBeGreaterThan(0);
  });

  it('should have a method findOne', async () => {
    const select = await utility.convertOtoB({ id: true }) as unknown as Prisma.BookSelect;
    await expect(controller.findOne).toBeDefined();
    const book = await database.book.findFirst();
    const findOne = await controller.findOne(book?.id as string, select);
    await expect(findOne).toBeDefined();
  });

  it('should have a method create', async () => {
    await expect(controller.create).toBeDefined();
    mockBook = await controller.create(mockBook);
    await expect(mockBook).toBeDefined();
    await expect(mockBook.title).toBe('Mock Book');
    await expect(mockBook.price).toBe(1.50);
    await expect(mockBook.publishYear).toBe(2020);
  });

  it('should have a method update', async () => {
    await expect(controller.update).toBeDefined();
    mockBook = await database.book.findFirst({ where: { title: 'Mock Book' }})
    mockBook.title = 'A Mocking Book';
    mockBook = await controller.update(mockBook.id, mockBook);
    await expect(mockBook).toBeDefined();
    await expect(mockBook.title).toBe('A Mocking Book');
  });

  it('should have a method delete', async () => {
    await expect(controller.delete).toBeDefined();
    await expect(mockBook).toBeDefined();
    mockBook = await database.book.findFirst({ where: { title: mockBook.title }});
    mockBook = await controller.delete(mockBook.id);
    const testBook = await controller.findOne(mockBook.id);
    expect(testBook).toBeNull();
  });
});
