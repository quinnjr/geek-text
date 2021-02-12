import {
  PrismaClient,
  User,
  Book,
  Publisher,
  Author,
  CreditCard,
  Genre,
  Rating,
  Address,
  Transaction,
  Prisma
} from '@prisma/client';
import * as faker from 'faker';
import * as argon2 from 'argon2';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { fake } from 'faker';

const client = new PrismaClient();

async function main() {
  const password = 'IAmAPassword';
  const hash = await argon2.hash(password);

  const testUser = await client.user.upsert({
    where: {
      email: 'john.doe@gmail.com'
    },
    update: {},
    create: {
      email: 'john.doe@gmail.com',
      passwordHash: hash,
      firstName: 'John',
      lastName: 'Doe',
      creditCard: {
        create: {
          encryptedCreditCardNumber: faker.finance.creditCardNumber(),
          encryptedCCV: faker.finance.creditCardCVV(),
          expirationDate: new Date()
        }
      },
      shippingAddress: {
        create: {
          street: faker.address.streetAddress(),
          apartmentOrUnit: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          country: faker.address.country(),
          zipcode: faker.address.zipCode()
        }
      }
    },
  });

  for(let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    const _user = await client.user.upsert({
      where: {
        email: email
      },
      update: {},
      create: {
        email: email,
        passwordHash: hash,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profilePicture: faker.image.avatar()
      }
    });
  }

  const toKillAMockingBird = await client.book.upsert({
    where: {
      title: 'To Kill a Mockingbird',
    },
    update: {},
    create: {
      title: 'To Kill a Mockingbird',
      author: {
        create: {
          firstName: 'Harper',
          lastName: 'Lee',
          description: "Harper Lee was born in 1926 in Monroeville, Alabama. She is the author of the acclaimed To Kill a Mockingbird and Go Set a Watchman, which became a phenomenal #1 New York Times bestseller when it was published in July 2015. Ms. Lee received the Pulitzer Prize, the Presidential Medal of Freedom, and numerous other literary awards and honors. She died on February 19, 2016."
        }
      },
      publisher: {
        create: {
          name: 'HarperCollins Publishers'
        }
      },
      description: "Nominated as one of America’s best-loved novels by PBS’s The Great American Read\nHarper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred\nOne of the best-loved stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, it views a world of great beauty and savage inequities through the eyes of a young girl, as her father—a crusading local lawyer—risks everything to defend a black man unjustly accused of a terrible crime.",
      genre: {
        connectOrCreate: {
          where: {
            name: 'Fiction'
          },
          create: {
            name: 'Fiction'
          }
        }
      },
      price: 17.99,
      coverUrl: 'https://prodimage.images-bn.com/pimages/9780061120084_p0_v4_s600x595.jpg',
      isbn: 9780061120084,
    }
  });

  const onLiberty = await client.book.upsert({
    where: {
      title: 'On Liberty'
    },
    update: {},
    create: {
      title: 'On Liberty',
      author: {
        create: {
          firstName: 'John',
          middleName: 'Stuart',
          lastName: 'Mill',
          description: 'John Stuart Mill (1806–73) was the most influential English language philosopher of the nineteenth century. He was a naturalist, a utilitarian, and a liberal, whose work explores the consequences of a thoroughgoing empiricist outlook.'
        }
      },
      publisher: {
        create: {
          name: 'Dover Publications'
        }
      },
      description: "Discussed and debated from time immemorial, the concept of personal liberty went without codification until the 1859 publication of On Liberty. John Stuart Mill's complete and resolute dedication to the cause of freedom inspired this treatise, an enduring work through which the concept remains well known and studied.\nThe British economist, philosopher, and ethical theorist's argument does not focus on \"the so-called Liberty of the Will…but Civil, or Social Liberty: the nature and limits of the power which can be legitimately exercised by society over the individual.\" Mill asks and answers provocative questions relating to the boundaries of social authority and individual sovereignty. In powerful and persuasive prose, he declares that there is \"one very simple principle\" regarding the use of coercion in society — one may only coerce others either to defend oneself or to defend others from harm.\nThe new edition offers students of political science and philosophy, in an inexpensive volume, one of the most influential studies on the nature of individual liberty and its role in a democratic society.",
      genre: {
        connectOrCreate: {
          where: {
            name: 'Philosophy'
          },
          create: {
            name: 'Philosophy'
          }
        }
      },
      isbn: Number("0486421309"),
      price: 4.00,
      coverUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555338584l/385228._SY475_.jpg'
    }
  });

  for(let i = 0; i < 50; i++) {
    const title = faker.commerce.productName();
    const _fakeBook = await client.book.upsert({
      where: {
        title: title
      },
      update: {},
      create: {
        title: title,
        author: {
          create: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            description: faker.lorem.paragraph(),
          }
        },
        publisher: {
          create: {
            name: faker.company.companyName()
          }
        },
        description: faker.lorem.paragraphs(),
        isbn: faker.random.number({
          min: 1000000000000,
          max: 9999999999999
        }),
        price: faker.random.number({
          min: 2.00,
          max: 20.00,
          precision: 0.01
        }),
        coverUrl: faker.image.imageUrl()
      }
    })
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1)
  })
  .finally(async () => {
    await client.$disconnect();
  });
