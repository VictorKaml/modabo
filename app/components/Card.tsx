// Header.tsx
import React, {useState} from 'react';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Text,
	Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import CardDeals from './CardDeals';
import {categories, categoryData} from '../data/data';

const DealCategories: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = useState('All');

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const filteredData =
		selectedCategory === 'All'
			? categoryData
			: categoryData.filter(item => item.category === selectedCategory);

	return (
		<View>
			<FlatList
				numColumns={5}
				contentContainerStyle={{
					marginStart: 10,
					justifyContent: 'space-between',
					marginBottom: 10,
				}}
				showsHorizontalScrollIndicator={false}
				data={categories}
				keyExtractor={item => item.id}
				renderItem={({item}) => (
					<TouchableOpacity
						onPress={() => handleCategoryChange(item.id)}
						style={{
							backgroundColor:
								selectedCategory === item.id ? 'tomato' : 'black',
							height: 35,
							justifyContent: 'center',
							alignItems: 'center',
							overflow: 'hidden',
							borderRadius: 10,
						}}>
						<Text
							style={{
								color: selectedCategory === item.id ? 'white' : 'white',
								fontSize: 14,
								fontFamily: 'Nunito-Black',
								textAlign: 'center',
								letterSpacing: 1,
								marginHorizontal: 10,
							}}>
							{item.title}
						</Text>
					</TouchableOpacity>
				)}
				ListFooterComponent={CardDeal()}
			/>
		</View>
	);
};

const CardDeal = () => {
	return (
		<View>
			<FlatList
				horizontal
				contentContainerStyle={{
					marginEnd: 10,
				}}
				style={{
					marginBottom: 5,
				}}
				showsHorizontalScrollIndicator={false}
				data={filteredData}
				keyExtractor={item => `${item.id}`}
				renderItem={({item, index}) => {
					return <CardDeals item={item} index={index} />;
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export {DealCategories};
