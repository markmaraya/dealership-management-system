import {
  InMemoryDbService,
  RequestInfoUtilities,
} from 'angular-in-memory-web-api';

export class MockDataService implements InMemoryDbService {
  createDb() {
    const units = [
      {
        _id: '1',
        id: '1',
        expenses: [],
        unitCode: 'A0023',
        makeAndModel: 'Isuzu Giga',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ57Z-5363265',
        status: 'Available',
        imageFile: {
          url: 'assets/mock-images/mock-image1.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '2',
        id: '2',
        expenses: [],
        unitCode: 'A0024',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPX57P-6365701',
        status: 'Available',
        imageFile: {
          url: 'assets/mock-images/mock-image2.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '3',
        id: '3',
        expenses: [],
        unitCode: 'A0035',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ57X-7317289',
        status: 'Available',
        imageFile: {
          url: 'assets/mock-images/mock-image3.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '4',
        id: '4',
        expenses: [],
        unitCode: 'A0040',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPX57P-1354165',
        status: 'Available',
        imageFile: {
          url: 'assets/mock-images/mock-image4.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '5',
        id: '5',
        expenses: [],
        unitCode: 'A0055',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ57X-6486578',
        status: 'Available',
        imageFile: {
          url: 'assets/mock-images/mock-image5.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '6',
        id: '6',
        expenses: [],
        unitCode: 'S0123',
        makeAndModel: 'Isuzu Giga',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ57P-4643265',
        status: 'Sold',
        imageFile: {
          url: 'assets/mock-images/mock-image6.jpg',
          alt: 'Isuzu Giga Car Carrier',
        },
      },
      {
        _id: '7',
        id: '7',
        expenses: [],
        unitCode: 'S0124',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPX57Z-3325701',
        status: 'Sold',
        imageFile: {
          url: 'assets/mock-images/mock-image7.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '8',
        id: '8',
        expenses: [],
        unitCode: 'S0135',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ57X-2467289',
        status: 'Sold',
        imageFile: {
          url: 'assets/mock-images/mock-image8.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '9',
        id: '9',
        expenses: [],
        unitCode: 'S0140',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPX56Z-2134165',
        status: 'Sold',
        imageFile: {
          url: 'assets/mock-images/mock-image9.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
      {
        _id: '10',
        id: '10',
        expenses: [],
        unitCode: 'S0155',
        makeAndModel: 'Isuzu Elf',
        bodyType: 'Car Carrier',
        chasisCode: 'NPZ59X-3326578',
        status: 'Sold',
        imageFile: {
          url: 'assets/mock-images/mock-image10.jpg',
          alt: 'Isuzu Elf Car Carrier',
        },
      },
    ];

    const expenses = [
      {
        _id: '1',
        id: '1',
        amount: '23.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0023',
      },
      {
        _id: '2',
        id: '2',
        amount: '24.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0023',
      },
      {
        _id: '3',
        id: '3',
        amount: '33.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0024',
      },
      {
        _id: '4',
        id: '4',
        amount: '44.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0035',
      },
      {
        _id: '5',
        id: '5',
        amount: '55.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0040',
      },
      {
        _id: '6',
        id: '6',
        amount: '55.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'A0055',
      },
      {
        _id: '7',
        id: '7',
        amount: '144.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'S0123',
      },
      {
        _id: '8',
        id: '8',
        amount: '155.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'S0124',
      },
      {
        _id: '9',
        id: '9',
        amount: '155.00',
        description: 'Model RX-78-2',
        encodedBy: 'Mark Maraya',
        dateEncoded: '2022-01-17T07:00:49.143+00:00',
        unitCode: 'S0135',
      },
    ];

    return { units, expenses };
  }

  parseRequestUrl(url: string, utils: RequestInfoUtilities) {
    const parsed = utils.parseRequestUrl(url);

    const match = /api\/units\/expenses\/(.+)/.exec(url);
    if (match) {
      return {
        apiBase: parsed.apiBase,
        collectionName: 'expenses',
        id: match[1],
        resourceUrl: url,
      };
    }

    return parsed;
  }
}
