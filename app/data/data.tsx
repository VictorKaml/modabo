import {ColorValue, ImageProps, ImageSourcePropType} from 'react-native';

import Colors from '../utils/Colors';

export type Data = {
  name: string;
  amount: string;
  image: ImageSourcePropType;
  about: string;
};

export type Category = {
  id: string;
  title: string;
};

export type Slides = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

const categories: Category[] = [
  {id: 'All', title: 'All'},
  {id: 'Coupons', title: 'Coupons'},
  {id: 'Gift Cards', title: 'Gift Card'},
  {id: 'Vouchers', title: 'Vouchers'},
  {id: 'Tickets', title: 'Tickets'},
];

export type CategoryData = {
  id: number;
  category: string;
  image: ImageSourcePropType;
  product: string;
  previous: string;
  current: string;
  discount: string;
};

export type BalanceData = {
  id: number;
  backgroundColor: string;
  balanceText: string;
  balanceAmount: string;
};
export type FeaturesData = {
  id: number;
  icon: ImageSourcePropType;
  color: ColorValue;
  backgroundColor: string;
  description: string;
};

export type AnalyticsData = {
  id: number;
  color: string;
  label: string;
  value: number;
};

export type Reaction = {
  label: string;
  src: ImageSourcePropType;
  bigSrc: ImageSourcePropType;
};

export type UsersData = {
  id: number;
  icon: ImageSourcePropType;
  color: ColorValue;
  backgroundColor: string;
  username: string;
};

const categoryData: CategoryData[] = [
  {
    id: 1,
    category: 'Coupons',
    image: require('../assets/img/laptop1.jpg'),
    product: 'ASUS ROG (2023) 1 TB New',
    previous: 'MK999.99',
    current: 'MK800',
    discount: '13%',
  },
  {
    id: 2,
    category: 'Coupons',
    image: require('../assets/img/laptop2.jpg'),
    product: 'ASUS ROG (2023) 500 GB New',
    previous: 'MK899.99',
    current: 'MK700',
    discount: '10%',
  },
  {
    id: 3,
    category: 'Coupons',
    image: require('../assets/img/body_lotion1.jpg'),
    product: 'Tea Tree Mens Special Shampoo',
    previous: 'MK19.99',
    current: 'MK14',
    discount: '3%',
  },
  {
    id: 4,
    category: 'Coupons',
    image: require('../assets/img/body_lotion2.jpg'),
    product: 'Olaplex No. 4 Bond Shampoo',
    previous: 'MK56.99',
    current: 'MK45',
    discount: '7%',
  },
  {
    id: 5,
    category: 'Gift Cards',
    image: require('../assets/img/console1.jpg'),
    product: 'Nintendo Switch (2023) New',
    previous: 'MK299.99',
    current: 'MK250',
    discount: '15%',
  },
  {
    id: 6,
    category: 'Gift Cards',
    image: require('../assets/img/console2.jpg'),
    product: 'Play Station 4 (2023) 1 TB New',
    previous: 'MK599.99',
    current: 'MK400',
    discount: '20%',
  },
  {
    id: 7,
    category: 'ss',
    image: require('../assets/img/gas_cooker.jpg'),
    product: 'Gas Stove Single Plate New',
    previous: 'MK115.99',
    current: 'MK90',
    discount: '6%',
  },
  {
    id: 8,
    category: 'Vouchers',
    image: require('../assets/img/laptop3.jpg'),
    product: 'ASUS ROG (2023) 500 GB New',
    previous: 'MK499.99',
    current: 'MK350',
    discount: '3%',
  },
  {
    id: 9,
    category: 'Tickets',
    image: require('../assets/img/gas_cooker.jpg'),
    product: 'Gas Stove Single Plate New',
    previous: 'MK115.99',
    current: 'MK90',
    discount: '6%',
  },
  {
    id: 10,
    category: 'Tickets',
    image: require('../assets/img/laptop3.jpg'),
    product: 'ASUS ROG (2023) 500 GB New',
    previous: 'MK499.99',
    current: 'MK350',
    discount: '3%',
  },
];

const analyticsData: AnalyticsData[] = [
  {
    id: 1,
    color: Colors.grin,
    label: 'Transactions',
    value: 326,
  },
  {
    id: 2,
    color: Colors.grin,
    label: 'Sent',
    value: 1050,
  },
  {
    id: 3,
    color: Colors.grin,
    label: 'Limit usage',
    value: 76,
  },
  {
    id: 4,
    color: Colors.grin,
    label: 'Received',
    value: 1450,
  },
  {
    id: 5,
    color: Colors.grin,
    label: 'Received',
    value: 1450,
  },
];

const balanceData: BalanceData[] = [
  {
    id: 1,
    backgroundColor: 'white',
    balanceText: 'Balance',
    balanceAmount: '$53,313.45',
  },
  {
    id: 1,
    backgroundColor: 'white',
    balanceText: 'Today',
    balanceAmount: '+$500',
  },
];

const featuresData: FeaturesData[] = [
  {
    id: 1,
    icon: require('../assets/img/interface/plus-hexagon.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'Top Up',
  },
  {
    id: 2,
    icon: require('../assets/img/interface/paper-plane.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'Send',
  },
  {
    id: 3,
    icon: require('../assets/img/interface/qrcode.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'Receive',
  },
  {
    id: 4,
    icon: require('../assets/img/interface/parachute-box.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'Airdrop',
  },
  {
    id: 5,
    icon: require('../assets/img/interface/music-alt.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'Music',
  },
  {
    id: 6,
    icon: require('../assets/img/interface/id-badge.png'),
    color: 'transparent',
    backgroundColor: '#00ff83',
    description: 'My ID',
  },
];

const usersData: UsersData[] = [
  {
    id: 1,
    icon: require('../assets/img/person1.jpg'),
    color: Colors.neon,
    backgroundColor: 'white',
    username: 'TKay',
  },
  {
    id: 2,
    icon: require('../assets/img/person2.jpg'),
    color: 'lightblue',
    backgroundColor: 'white',
    username: 'Micah',
  },
  {
    id: 3,
    icon: require('../assets/img/person3.jpg'),
    color: 'yellow',
    backgroundColor: 'white',
    username: 'Bright',
  },
  {
    id: 4,
    icon: require('../assets/img/person4.jpg'),
    color: 'tomato',
    backgroundColor: 'white',
    username: 'Phwedo',
  },
  {
    id: 5,
    icon: require('../assets/img/person3.jpg'),
    color: 'bisque',
    backgroundColor: 'white',
    username: 'Martin',
  },
  {
    id: 6,
    icon: require('../assets/img/person2.jpg'),
    color: 'lightgreen',
    backgroundColor: 'white',
    username: 'David',
  },
  {
    id: 7,
    icon: require('../assets/img/person1.jpg'),
    color: 'violet',
    backgroundColor: 'white',
    username: 'James',
  },
  {
    id: 8,
    icon: require('../assets/img/person4.jpg'),
    color: 'orange',
    backgroundColor: 'white',
    username: 'Victor',
  },
];

export interface OnboardingData {
  id: number;
  image: ImageProps;
  text: string;
  description: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    image: require('../assets/img/splash1.png'),
    description: 'Take charge of your money. All aspects, one app.',
    text: 'Transfer Money Easily',
    textColor: '#f8dac2',
    backgroundColor: '#154f40',
  },
  {
    id: 2,
    image: require('../assets/img/splash1.png'),
    description: 'Take charge of your money. All aspects, one app.',
    text: 'Enjoy Many More',
    textColor: '#154f40',
    backgroundColor: '#fd94b2',
  },
  {
    id: 3,
    image: require('../assets/img/splash1.png'),
    text: 'Modabo',
    description: 'Take charge of your money. All aspects, one app.',
    textColor: 'black',
    backgroundColor: '#f8dac2',
  },
];

export {
  categories,
  categoryData,
  balanceData,
  featuresData,
  usersData,
  data,
  analyticsData,
};
